import { useEffect, FC, useRef, useState, useCallback } from 'react'
import maplibregl, {
  DataDrivenPropertyValueSpecification,
  LngLatLike,
  Map,
  Marker,
  Popup,
} from 'maplibre-gl'
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
import { MOBILE_BREAKPOINT } from '@lib/hooks/useIsMobile'
import { useTexts } from '@lib/TextsContext'
import { getPopupHTML } from './popupUtils'
import {
  getFeaturesOnSameCoordsThanFirstOne,
  getSpiderfier,
  MarkerClickHandlerType,
  normalizeLatLng,
  setCursor,
  zoomIn,
} from './mapUtil'

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

interface ViewportObjType {
  latitude: number
  longitude: number
  zoom: number
}

const easeInOutQuad = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1

export const transitionProps = {
  transitionDuration: 2000,
  transitionEasing: easeInOutQuad,
}

const MAP_CONFIG = {
  defaultZoom: 11,
  defaultLatitude: 52.520008,
  defaultLongitude: 13.404954,
  minZoom: 10,
  maxZoom: 19,
  zoomedInZoom: 17,
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
  const { pathname, push } = useRouter()
  const texts = useTexts()
  const map = useRef<Map>(null)
  const highlightedMarker = useRef<Marker>(null)
  const popup = useRef(
    new Popup({
      closeButton: false,
      closeOnClick: false,
      maxWidth: '320px',
    })
  )
  const hoveredStateIds = useRef<number[]>(null)
  const spideredFeatureIds = useRef<number[]>(null)
  const highlightedSearchMarker = useRef<Marker>(null)
  const highlightedUserGeoposition = useRef<Marker>(null)
  const markerClickHandler = useRef<MarkerClickHandlerType>(() => undefined)
  const spiderifier =
    useRef<InstanceType<typeof MaplibreglSpiderifier<MinimalRecordType>>>(null)

  const [urlState, setUrlState] = useUrlState()
  const {
    isLoading: userGeolocationIsLoading,
    latitude: userLatitude,
    longitude: userLongitude,
    useGeolocation,
  } = useUserGeolocation()

  const prevViewport = useRef<ViewportObjType>(null)
  // The initial viewport will be available on 2nd render,
  // because we get it from useRouter. First it has to be null.
  const [initialViewport, setInitialViewport] =
    useState<ViewportObjType | null>(null)

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

    const newViewport = {
      longitude: urlState.longitude,
      latitude: urlState.latitude,
      zoom: urlState.zoom,
    }
    // If all previous checks were passed, we need to set the initial viewport,
    // which in the useEffect below will easeTo the desired location.
    setInitialViewport(newViewport)
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
    if (!map.current) return

    if (pathname !== '/map') return

    const mapLng = normalizeLatLng(map.current.getCenter().lng)
    const mapLat = normalizeLatLng(map.current.getCenter().lat)
    const mapZoom = map.current.getZoom()

    const markerLng = normalizeLatLng(highlightedMarker.current?._lngLat.lng)
    const markerLat = normalizeLatLng(highlightedMarker.current?._lngLat.lat)
    const markerZoom = MAP_CONFIG.zoomedInZoom

    const prevLng = normalizeLatLng(prevViewport.current?.longitude)
    const prevLat = normalizeLatLng(prevViewport.current?.latitude)
    const prevZoom = prevViewport.current?.zoom

    // Without a highlightedCenter we want to remove any highlightedMarker:
    highlightedMarker.current?.remove()

    if (!prevLng || !prevLat || !prevZoom) return
    if (
      mapLng === markerLng &&
      mapLat === markerLat &&
      mapZoom === markerZoom
    ) {
      map.current.easeTo({
        center: [prevLng, prevLat],
        zoom: prevZoom,
      })
    }
  }, [pathname])

  useEffect(() => {
    if (!map.current) return
    markerClickHandler.current = (facility: MinimalRecordType): void => {
      if (!map.current || !facility) return
      void push({
        pathname: `/${facility.id}`,
        query: {
          ...urlState,
          latitude: facility.latitude,
          longitude: facility.longitude,
        },
      })
      map.current.easeTo({
        center: [facility.longitude, facility.latitude],
        zoom: MAP_CONFIG.zoomedInZoom,
      })
    }
  }, [push, urlState])

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
        if (map.current && e.originalEvent) {
          const { lat: latitude, lng: longitude } = map.current.getCenter()
          const zoom = map.current.getZoom.bind(map.current)()
          if (!latitude || !longitude || !zoom) return
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          prevViewport.current = { latitude, longitude, zoom }
        }
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
      ] as DataDrivenPropertyValueSpecification<number>

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
      spiderifier.current = getSpiderfier({
        clickHandler: markerClickHandler.current,
        map: map.current,
        popup: popup.current,
        texts,
      })

      function unspiderfy(): void {
        spiderifier.current?.unspiderfy()
        popup.current.setOffset(0)
        popup.current.remove()
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

        const features = e.features as GeojsonFeatureType<MinimalRecordType>[]
        const activeFeatures = features.filter(({ state }) => state.active)
        const firstFeature = activeFeatures[0]

        if (activeFeatures.length === 0 || !firstFeature.geometry.coordinates)
          return

        const featuresOnSameCoords =
          getFeaturesOnSameCoordsThanFirstOne(activeFeatures)

        const isClusterOfVeryNearButNotOverlappingPoints =
          featuresOnSameCoords.length !== activeFeatures.length
        if (isClusterOfVeryNearButNotOverlappingPoints) {
          zoomIn(
            map.current,
            featuresOnSameCoords[0].geometry.coordinates,
            2,
            MAP_CONFIG.zoomedInZoom
          )
          return
        }

        const clickedMarkerIds = featuresOnSameCoords.map(
          (f) => f.properties.id
        )
        const clickedFacilities = markers.filter((marker) =>
          clickedMarkerIds.includes(marker.id)
        )

        // map.current.easeTo({ center: firstFeature.geometry.coordinates })

        const isMobile = window.innerWidth <= MOBILE_BREAKPOINT
        if (isMobile) {
          onMarkerClick(clickedFacilities)
          return
        }
        if (clickedFacilities.length === 1) {
          markerClickHandler.current(clickedFacilities[0])
          return
        }
        popup.current?.remove.bind(popup.current)()
        spiderifier.current.spiderfy(
          firstFeature.geometry.coordinates,
          clickedFacilities
        )
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        spideredFeatureIds.current = activeFeatures.map(
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
      const isMobile = window.innerWidth <= MOBILE_BREAKPOINT
      if (isMobile) return

      const features = e.features as GeojsonFeatureType<MinimalRecordType>[]
      const activeFeatures = features.filter(({ state }) => state.active)
      const allFeaturesInactive = activeFeatures.length === 0
      if (allFeaturesInactive) return

      setCursor('pointer')

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
      hoveredStateIds.current = features.map(({ id }) => id as number)
      hoveredStateIds.current?.forEach((id) => {
        map.current?.setFeatureState(
          { source: 'facilities', id },
          { hover: true }
        )
      })

      if (
        activeFeatures.length >= 1 &&
        !spiderifier.current?.expandedIds.some((id) =>
          activeFeatures.find((marker) => marker.properties.id === id)
        )
      ) {
        const { longitude, latitude } = activeFeatures[0]
          .properties as MinimalRecordType
        popup.current
          .setLngLat([longitude, latitude])
          .setHTML(
            getPopupHTML(
              activeFeatures.map(({ properties }) => properties),
              texts
            )
          )
          .addTo(map.current)
      }
    })

    map.current.on('mouseleave', 'unclustered-point', () => {
      if (!map.current) return

      setCursor('inherit')

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

      popup.current.remove.bind(popup.current)()
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
        zoom: MAP_CONFIG.zoomedInZoom,
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
        zoom: MAP_CONFIG.zoomedInZoom,
      })
    }
  }, [searchCenter])

  useEffect(() => {
    if (!map.current) return
    if (highlightedCenter) {
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
        zoom: MAP_CONFIG.zoomedInZoom,
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
