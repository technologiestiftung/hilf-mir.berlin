import { useEffect, FC, useRef, useState, useCallback } from 'react'
import maplibregl, { LngLatLike, Map, Marker } from 'maplibre-gl'
import {
  createGeoJsonStructure,
  GeojsonFeatureType,
} from '@lib/createGeojsonStructure'
import { useRouter } from 'next/router'
import { useDebouncedCallback } from 'use-debounce'
import { URLViewportType } from '@lib/types/map'
import { MinimalRecordType } from '@lib/mapRecordToMinimum'
import { useUrlState } from '@lib/UrlStateContext'

interface MapType {
  markers?: MinimalRecordType[]
  activeTags?: number[] | null
  onMarkerClick?: (facilities: MinimalRecordType[]) => void
  onMoveStart?: () => void
  /**
   * Function that is called whenever a click on the map happens,
   * that is anywhere except for a click on the facilities layer.
   */
  onClickAnywhere?: () => void
  /** An optional array of [longitude, latitude].
   * If provided, the map's center will be forced to this location.
   * Also, a highlighted marker will be drawn to the map.
   */
  highlightedCenter?: LngLatLike
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
}

export const FacilitiesMap: FC<MapType> = ({
  markers,
  activeTags,
  onMarkerClick = () => undefined,
  onMoveStart = () => undefined,
  onClickAnywhere = () => undefined,
  highlightedCenter,
}) => {
  const map = useRef<Map>(null)
  const highlightedMarker = useRef<Marker>(null)

  const { pathname } = useRouter()
  const [urlState, setUrlState] = useUrlState()

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
      mapLatitude == urlState.latitude &&
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

      map.current.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'facilities',
        paint: {
          'circle-radius': 10,
          'circle-stroke-width': 1,
          'circle-stroke-color': [
            'case',
            // While the feature state is still undefined, we prefer to
            // show the facilities as not active, so that we don't create
            // disappointment when first facilities flash and then they
            // disappear.
            ['boolean', ['feature-state', 'active'], false],
            '#fff',
            '#E40422',
          ],
          'circle-color': [
            'case',
            // While the feature state is still undefined, we prefer to
            // show the facilities as not active, so that we don't create
            // disappointment when first facilities flash and then they
            // disappear.
            ['boolean', ['feature-state', 'active'], false],
            '#E40422',
            '#fff',
          ],
        },
      })

      map.current.on('click', () => {
        onClickAnywhere()
      })

      map.current.on('click', 'unclustered-point', function (e) {
        if (!e.features) return
        if (!map.current) return
        const features = e.features as GeojsonFeatureType[]
        const clickedMarkerIds = features.map((f) => f.properties.id)

        map.current.easeTo({
          center: features[0].geometry.coordinates,
          zoom: 17,
        })

        const clickedFacilities = markers.filter((marker) =>
          clickedMarkerIds.includes(marker.id)
        )

        onMarkerClick(clickedFacilities)
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers])

  useEffect(() => {
    if (!map.current || !highlightedCenter) return

    map.current.easeTo({
      center: highlightedCenter,
      zoom: 17,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightedCenter])

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
      customMarker.className =
        'w-10 h-10 border-2 border-white rounded-full bg-red ring-2 ring-red ring-offset-2 ring-offset-white'

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      highlightedMarker.current = new maplibregl.Marker(customMarker)
        .setLngLat(highlightedCenter)
        .addTo(map.current)
    }
  }, [highlightedCenter])

  useEffect(
    () => updateFilteredFacilities(activeTags as number[]),
    [activeTags, markers, updateFilteredFacilities]
  )

  return (
    <div
      id="map"
      className="w-full h-full bg-[#F8F4F0]"
      aria-label="Kartenansicht der Einrichtungen"
    ></div>
  )
}
