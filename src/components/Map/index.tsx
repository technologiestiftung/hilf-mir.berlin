import { useEffect, FC, useRef, useState } from 'react'
import maplibregl, { LngLatLike, Map, Marker } from 'maplibre-gl'
import {
  createGeoJsonStructure,
  GeojsonFeatureType,
} from '@lib/createGeojsonStructure'
import { TableRowType } from '@common/types/gristData'
import { mapRawQueryToState } from '@lib/mapRawQueryToState'
import { useRouter } from 'next/router'
import { useDebouncedCallback } from 'use-debounce'
import { URLViewportType } from '@lib/types/map'

interface MapType {
  center?: LngLatLike
  markers?: TableRowType[]
  activeTags?: number[] | null
  onMarkerClick?: (facilityId: number) => void
  highlightedLocation?: [number, number]
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
  center,
  markers,
  activeTags,
  onMarkerClick = () => undefined,
  highlightedLocation,
}) => {
  const map = useRef<Map>(null)
  const highlightedMarker = useRef<Marker>(null)

  const { replace, query, pathname } = useRouter()
  const queryState = mapRawQueryToState(query)

  // The initial viewport will be available on 2nd render,
  // because we get it from useRouter. First it has to be null.
  const [initialViewport, setInitialViewport] = useState<{
    latitude: number
    longitude: number
    zoom: number
  } | null>(null)

  useEffect(() => {
    // If we've already got an initial viewport, we can not redefine it
    // anymore because something initial shoudl only be set once.
    if (initialViewport) return

    if (!queryState.latitude || !queryState.longitude || !queryState.zoom)
      return

    const mapLongitude = map.current?.transform._center.lng
    const mapLatitude = map.current?.transform._center.lat
    const mapZoom = map.current?.transform._zoom

    if (
      mapLongitude === queryState.longitude &&
      mapLatitude == queryState.latitude &&
      mapZoom === queryState.zoom
    )
      return

    // If all previous checks were passes, we need to set the initial viewport,
    // which in the useEffect below will easeTo the desired location.
    setInitialViewport({
      longitude: queryState.longitude,
      latitude: queryState.latitude,
      zoom: queryState.zoom,
    })
  }, [
    queryState.latitude,
    queryState.longitude,
    queryState.zoom,
    initialViewport,
  ])

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
      const newQuery = { ...queryState, ...viewport }

      void replace({ pathname, query: newQuery }, undefined, { shallow: true })
    },
    1000
  )

  useEffect(() => {
    if (!markers || !map.current) return

    map.current.on('load', function () {
      if (!map.current) return

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
        cluster: false,
        clusterMaxZoom: 14,
        clusterRadius: 20,
        promoteId: 'id',
      })

      // map.current.addLayer({
      //   id: 'clusters',
      //   type: 'circle',
      //   source: 'facilities',
      //   paint: {
      //     'circle-color': '#2f2fa2',
      //     'circle-radius': [
      //       'step',
      //       ['get', 'point_count'],
      //       20,
      //       50,
      //       30,
      //       100,
      //       35,
      //     ],
      //   },
      // })

      // map.current.addLayer({
      //   id: 'cluster-count',
      //   type: 'symbol',
      //   source: 'facilities',
      //   layout: {
      //     'text-field': '{point_count_abbreviated}',
      //     'text-size': 16,
      //   },
      //   paint: {
      //     'text-color': '#fff',
      //   },
      // })

      map.current.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'facilities',
        // filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#2f2fa2',
          'circle-radius': 8,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff',
          'circle-opacity': [
            'case',
            // By default we set it to false (while loading)
            ['boolean', ['feature-state', 'active'], false],
            1,
            0,
          ],
          'circle-stroke-opacity': [
            'case',
            // By default we set it to false (while loading)
            ['boolean', ['feature-state', 'active'], false],
            1,
            0,
          ],
        },
      })

      map.current.on('click', 'clusters', function (e) {
        if (!map.current) return
        const features = map.current.queryRenderedFeatures(e.point, {
          layers: ['clusters'],
        }) as GeojsonFeatureType[]
        const clusterId = features[0].properties.cluster_id
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        map.current
          .getSource('facilities')
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .getClusterExpansionZoom(clusterId, function (err, zoom: number) {
            if (err) return
            if (!zoom) return
            if (!map.current) return

            map.current.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom,
            })
          })
      })

      map.current.on('click', 'unclustered-point', function (e) {
        if (!e.features) return
        if (!map.current) return
        const features = e.features as GeojsonFeatureType[]
        const clickedMarkerIds = features.map((f) => f.properties.id)

        map.current.easeTo({
          center: features[0].geometry.coordinates,
          zoom: 15,
        })

        onMarkerClick(clickedMarkerIds[0])
      })

      map.current.on('mouseenter', 'clusters', function () {
        if (!map.current) return
        map.current.getCanvas().style.cursor = 'pointer'
      })
      map.current.on('mouseleave', 'clusters', function () {
        if (!map.current) return
        map.current.getCanvas().style.cursor = ''
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers])

  // TODO: evaluate if center and this effect is still necessary
  useEffect(() => {
    if (!map.current || !center) return

    map.current.flyTo({
      center: center,
      zoom: 15,
      essential: true,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center])

  useEffect(() => {
    if (!map.current) return
    if (!highlightedLocation) {
      // Without a highlightedLocation we want to remove any highlightedMarker:
      highlightedMarker && highlightedMarker.current?.remove()
      return
    } else {
      // Remove possibly existent markers:
      highlightedMarker.current?.remove()

      const customMarker = document.createElement('div')
      customMarker.className =
        'rounded-full w-8 h-8 bg-blue-500 ring-4 ring-magenta-500'

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      highlightedMarker.current = new maplibregl.Marker(customMarker)
        .setLngLat(highlightedLocation as LngLatLike)
        .addTo(map.current)
    }
  }, [highlightedLocation])

  useEffect(() => {
    console.log('active tags:', activeTags)
    // if (!map.current || !map.current.loaded()) return
    // if (!activeTags || activeTags.length === 0) {
    //   markers?.forEach((marker) => {
    //     map.current?.setFeatureState(
    //       {
    //         source: 'facilities',
    //         id: marker.id,
    //       },
    //       {
    //         active: true,
    //       }
    //     )
    //   })
    //   return
    // }

    // const markersToDisplay = markers?.filter((marker) => {
    //   return activeTags?.every((tag) => marker.fields.Schlagworte.includes(tag))
    // })

    // const markersToHide = markers?.filter((marker) => {
    //   return !markersToDisplay?.map(({ id }) => id).includes(marker.id)
    // })

    // markersToDisplay?.forEach((marker) => {
    //   map.current?.setFeatureState(
    //     {
    //       source: 'facilities',
    //       id: marker.id,
    //     },
    //     {
    //       active: true,
    //     }
    //   )
    // })

    // markersToHide?.forEach((marker) => {
    //   map.current?.setFeatureState(
    //     {
    //       source: 'facilities',
    //       id: marker.id,
    //     },
    //     {
    //       active: false,
    //     }
    //   )
    // })
  }, [activeTags, markers])

  return (
    <div
      id="map"
      className="w-full h-full bg-[#F8F4F0]"
      aria-label="Kartenansicht der Einrichtungen"
    ></div>
  )
}
