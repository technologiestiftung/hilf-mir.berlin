import { useEffect, FC, useRef, useState, useCallback } from 'react'
import maplibregl, { LngLat, LngLatLike, Map, Marker } from 'maplibre-gl'
import {
  createGeoJsonStructure,
  GeojsonFeatureType,
} from '@lib/createGeojsonStructure'
import { useRouter } from 'next/router'
import { useDebouncedCallback } from 'use-debounce'
import { URLViewportType } from '@lib/types/map'
import { MinimalRecordType } from '@lib/mapRecordToMinimum'
import { useUrlState } from '@lib/UrlStateContext'
import classNames from '@lib/classNames'
import { useUserGeolocation } from '@lib/hooks/useUserGeolocation'
import { MapTilerLogo } from '@components/MaptilerLogo'
import MaplibreglSpiderifier from '@lib/MaplibreglSpiderifier'
import { useIsMobile } from '@lib/hooks/useIsMobile'

interface MapType {
  markers?: MinimalRecordType[]
  activeTags?: number[] | null
  onMarkerClick?: (facilities: MinimalRecordType[]) => void
  onClickAnywhere?: () => void
  onMoveStart?: () => void
  /** An optional array of [longitude, latitude].
   * If provided, the map's center will be forced to this location.
   * Also, a highlighted marker will be drawn to the map.
   */
  highlightedCenter?: LngLatLike
  searchCenter?: LngLatLike
}

const easeInOutQuad = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1

export const transitionProps = {
  transitionDuration: 2000,
  transitionEasing: easeInOutQuad,
}

const MAX_ZOOM = 17
const MAP_CONFIG = {
  defaultZoom: 11,
  defaultLatitude: 52.520008,
  defaultLongitude: 13.404954,
  minZoom: 10,
  maxZoom: 19,
}

export const FacilitiesMap: FC<MapType> = ({
  markers,
  activeTags,
  onMarkerClick = () => undefined,
  onClickAnywhere = () => undefined,
  onMoveStart = () => undefined,
  highlightedCenter,
  searchCenter,
}) => {
  const isMobile = useIsMobile()
  const { push } = useRouter()
  const map = useRef<Map>(null)
  const highlightedMarker = useRef<Marker>(null)
  const hoveredStateIds = useRef<number[]>(null)
  const spideredFeatureIds = useRef<number[]>(null)
  const highlightedSearchMarker = useRef<Marker>(null)
  const highlightedUserGeoposition = useRef<Marker>(null)
  const spiderifier =
    useRef<InstanceType<typeof MaplibreglSpiderifier<Record<string, unknown>>>>(
      null
    )

  const { pathname } = useRouter()
  const [urlState, setUrlState] = useUrlState()
  const {
    isLoading: userGeolocationIsLoading,
    latitude: userLatitude,
    longitude: userLongitude,
    useGeolocation,
  } = useUserGeolocation()

  // The initial viewport will be available on 2nd render,
  // because we get it from useRouter. First it has to be null.
  const [initialViewport, setInitialViewport] = useState<{
    latitude: number
    longitude: number
    zoom: number
  } | null>(null)

  const [mapIsFullyLoaded, setMapIsFullyLoaded] = useState(false)

  useEffect(() => {
    // If we've already got an initial viewport, we can not redefine it
    // anymore because something initial shoudl only be set once.
    if (initialViewport) return

    if (!urlState.latitude || !urlState.longitude || !urlState.zoom) return

    const mapLongitude = map.current?.transform._center.lng
    const mapLatitude = map.current?.transform._center.lat
    const mapZoom = map.current?.transform._zoom

    if (
      mapLongitude === urlState.longitude &&
      mapLatitude === urlState.latitude &&
      mapZoom === urlState.zoom
    )
      return

    // If all previous checks were passed, we need to set the initial viewport,
    // which in the useEffect below will easeTo the desired location.
    setInitialViewport({
      longitude: urlState.longitude,
      latitude: urlState.latitude,
      zoom: urlState.zoom,
    })
  }, [urlState.latitude, urlState.longitude, urlState.zoom, initialViewport])

  // After the initial viewport has been set ONCE (in the above useEffect),
  // we ease the map to the location specified in the query state.
  useEffect(() => {
    if (!initialViewport) return
    map.current &&
      map.current.easeTo({
        center: [
          initialViewport.longitude,
          initialViewport.latitude,
        ] as LngLatLike,
        zoom: initialViewport.zoom,
      })
  }, [initialViewport])

  // Map setup (run only once on initial render)
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    map.current = new maplibregl.Map({
      container: 'map',
      style: `${process.env.NEXT_PUBLIC_MAPTILER_STYLE_URL || ''}?key=${
        process.env.NEXT_PUBLIC_MAPTILER_API_KEY || ''
      }`,
      center: [
        MAP_CONFIG.defaultLongitude,
        MAP_CONFIG.defaultLatitude,
      ] as LngLatLike,
      zoom: MAP_CONFIG.defaultZoom,
      minZoom: MAP_CONFIG.minZoom,
      maxZoom: MAP_CONFIG.maxZoom,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Debounced function that updates the URL query without triggering a rerender:
  const debouncedViewportChange = useDebouncedCallback(
    (viewport: URLViewportType): void => {
      if (pathname !== '/map') return

      setUrlState({
        ...urlState,
        ...viewport,
      })
    },
    1000
  )

  const updateFilteredFacilities = useCallback(
    (activeTags: number[]) => {
      if (!map.current || !mapIsFullyLoaded) return

      markers?.forEach((marker) => {
        map.current?.setFeatureState(
          {
            source: 'facilities',
            id: marker.id,
          },
          {
            active: activeTags?.every((tag) => marker.labels.includes(tag)),
          }
        )
      })
    },
    [markers, mapIsFullyLoaded]
  )

  useEffect(() => {
    if (!markers || !map.current) return

    map.current.on('load', function () {
      if (!map.current) return

      const pollForMapLoaded = (): void => {
        if (map.current?.loaded()) {
          setMapIsFullyLoaded(true)
          return
        } else {
          requestAnimationFrame(pollForMapLoaded)
        }
      }

      pollForMapLoaded()

      map.current.on('movestart', () => {
        onMoveStart()
      })

      map.current.on('moveend', (e) => {
        debouncedViewportChange({
          latitude: e.target.transform._center.lat,
          longitude: e.target.transform._center.lng,
          zoom: e.target.transform._zoom,
        })
      })

      map.current.addSource('facilities', {
        type: 'geojson',
        data: createGeoJsonStructure(markers),
        // We need to set an ID for making setFeatureState work.
        // The ID comes from the markers dataset whoch contains
        // a unique ID.
        promoteId: 'id',
      })

      updateFilteredFacilities(activeTags as number[])

      const opacityGlCondition = [
        'case',
        [
          'all',
          ['boolean', ['feature-state', 'active'], false],
          ['!', ['boolean', ['feature-state', 'spidered'], false]],
        ],
        1,
        0,
      ]

      map.current.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'facilities',
        paint: {
          'circle-radius': 10,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff',
          'circle-color': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            '#999999',
            '#E40422',
          ],
          'circle-stroke-opacity': opacityGlCondition,
          'circle-opacity': opacityGlCondition,
        },
      })

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      spiderifier.current = new MaplibreglSpiderifier<MinimalRecordType>(
        map.current,
        {
          onClick(_e, markerObject) {
            console.log('Clicked on ', markerObject.marker.title)
            void push(`/${markerObject.marker.id}`)
            map.current?.easeTo({
              center: [
                markerObject.marker.longitude,
                markerObject.marker.latitude,
              ],
              zoom: MAX_ZOOM,
            })
          },
          onMouseenter(_e, markerObject) {
            console.log('Hovered over', markerObject.marker.title)
          },
          onMouseleave(_e, markerObject) {
            console.log('Hovered out', markerObject.marker.title)
          },
        }
      )

      function unspiderfy(): void {
        spiderifier.current?.unspiderfy()
        if (
          map.current &&
          spideredFeatureIds.current &&
          spideredFeatureIds.current.length > 0
        ) {
          spideredFeatureIds.current.forEach((id) => {
            map.current?.setFeatureState(
              { source: 'facilities', id },
              { spidered: false }
            )
          })
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          spideredFeatureIds.current = null
        }
      }

      map.current.on('click', function () {
        unspiderfy()
        onClickAnywhere()
      })

      map.current.on('click', 'unclustered-point', (e) => {
        if (!e.features) return
        if (!map.current || !spiderifier.current) return

        const features = e.features as GeojsonFeatureType[]
        if (features.length === 0 || !features[0].geometry.coordinates) return

        const featuresOnSameCoords =
          getFeaturesOnSameCoordsThanFirstOne(features)

        const isClusterOfVeryNearButNotOverlappingPoints =
          featuresOnSameCoords.length !== features.length
        if (isClusterOfVeryNearButNotOverlappingPoints) {
          zoomIn(map.current, featuresOnSameCoords[0].geometry.coordinates, 2)
          return
        }

        const clickedMarkerIds = featuresOnSameCoords.map(
          (f) => f.properties.id
        )
        const clickedFacilities = markers.filter((marker) =>
          clickedMarkerIds.includes(marker.id)
        )

        map.current.easeTo({ center: features[0].geometry.coordinates })

        if (isMobile) {
          onMarkerClick(clickedFacilities)
          return
        }
        if (clickedFacilities.length === 1) {
          void push(`/${clickedFacilities[0].id}`)
          map.current.easeTo({
            center: featuresOnSameCoords[0].geometry.coordinates,
            zoom: MAX_ZOOM,
          })
          return
        }
        spiderifier.current.spiderfy(
          features[0].geometry.coordinates,
          clickedFacilities
        )
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        spideredFeatureIds.current = features.map(
          ({ properties }) => properties.id
        )
        spideredFeatureIds.current.forEach((id) => {
          map.current?.setFeatureState(
            { source: 'facilities', id },
            { spidered: true }
          )
        })
      })
    })

    map.current.on('mousemove', 'unclustered-point', (e) => {
      if (!map.current) return
      if (!e.features || e.features.length === 0) return
      const features = e.features as GeojsonFeatureType[]
      if (hoveredStateIds.current && hoveredStateIds.current?.length > 0) {
        hoveredStateIds.current?.forEach((id) => {
          map.current?.setFeatureState(
            { source: 'facilities', id },
            { hover: false }
          )
        })
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      hoveredStateIds.current = features.map(({ properties }) => properties.id)
      hoveredStateIds.current?.forEach((id) => {
        map.current?.setFeatureState(
          { source: 'facilities', id },
          { hover: true }
        )
      })
    })

    map.current.on('mouseleave', 'unclustered-point', () => {
      if (!map.current) return
      if (hoveredStateIds.current && hoveredStateIds.current.length > 0) {
        hoveredStateIds.current?.forEach((id) => {
          map.current?.setFeatureState(
            { source: 'facilities', id },
            { hover: false }
          )
        })
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        hoveredStateIds.current = null
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers])

  useEffect(() => {
    if (!map.current) return
    if (!useGeolocation || !userLatitude || !userLongitude) {
      // Without a userGeolocation we want to remove any highlightedUserGeoposition:
      highlightedUserGeoposition && highlightedUserGeoposition.current?.remove()
      return
    } else {
      // Remove possibly existent user geoposition marker:
      highlightedUserGeoposition.current?.remove()

      const customMarker = document.createElement('div')
      customMarker.className = classNames(
        'w-8 h-8 border-2 border-white rounded-full bg-blau ring-2',
        'ring-blau ring-offset-2 ring-offset-white'
      )

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      highlightedUserGeoposition.current = new maplibregl.Marker(customMarker)
        .setLngLat([userLongitude, userLatitude])
        .addTo(map.current)

      map.current.easeTo({
        center: [userLongitude, userLatitude],
        zoom: MAX_ZOOM,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapIsFullyLoaded, userGeolocationIsLoading, useGeolocation])

  useEffect(() => {
    if (!map.current) return
    if (!searchCenter) {
      // Without a searchCenter we want to remove any highlightedSearchMarker:
      highlightedSearchMarker && highlightedSearchMarker.current?.remove()
      return
    } else {
      // Remove possibly existent markers:
      highlightedSearchMarker.current?.remove()

      const customMarker = document.createElement('div')
      customMarker.className = classNames('w-8 h-8 bg-norepeat')
      customMarker.style.backgroundImage = 'url("/images/search_geopin.svg")'

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      highlightedSearchMarker.current = new maplibregl.Marker(customMarker)
        .setLngLat(searchCenter)
        .addTo(map.current)

      map.current.easeTo({
        center: searchCenter,
        zoom: MAX_ZOOM,
      })
    }
  }, [searchCenter])

  useEffect(() => {
    if (!map.current) return
    if (!highlightedCenter) {
      // Without a highlightedCenter we want to remove any highlightedMarker:
      highlightedMarker && highlightedMarker.current?.remove()
      return
    } else {
      // Remove possibly existent markers:
      highlightedMarker.current?.remove()

      const customMarker = document.createElement('div')
      customMarker.className = classNames(
        'w-10 h-10 bg-red rounded-full ring-2',
        'ring-offset-white ring-offset-2 ring-red'
      )

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      highlightedMarker.current = new maplibregl.Marker(customMarker)
        .setLngLat(highlightedCenter)
        .addTo(map.current)

      map.current.easeTo({
        center: highlightedCenter,
        zoom: MAX_ZOOM,
      })
    }
  }, [highlightedCenter])

  useEffect(
    () => updateFilteredFacilities(activeTags as number[]),
    [activeTags, markers, updateFilteredFacilities]
  )

  return (
    <>
      <div
        id="map"
        className="w-full h-full bg-[#F8F4F0]"
        aria-label="Kartenansicht der Einrichtungen"
      />
      <MapTilerLogo />
    </>
  )
}

function getFeaturesOnSameCoordsThanFirstOne(
  features: GeojsonFeatureType[]
): GeojsonFeatureType[] {
  const pointA = new LngLat(
    ...(features[0].geometry.coordinates as [number, number])
  )
  return features.filter((feat) => {
    const pointB = new LngLat(
      ...(feat.geometry.coordinates as [number, number])
    )
    const dist = pointA.distanceTo(pointB)
    const distance = Math.round(dist / 100) / 10
    return distance < 0.1
  })
}

function zoomIn(map: Map, coordinates?: LngLatLike, zoomIncrease = 1): void {
  map.easeTo({
    center: coordinates,
    zoom: Math.min(MAX_ZOOM, map.getZoom() + zoomIncrease),
  })
}
