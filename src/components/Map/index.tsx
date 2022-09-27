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
import { URLViewportType, ViewportProps } from '@lib/types/map'

interface MapType {
  center?: LngLatLike
  markers?: TableRowType[]
  activeTags?: number[] | null
  onMarkerClick?: (facilityId: number) => void
  highlightedLocation?: [number, number]
  staticViewportProps?: {
    maxZoom: number
    minZoom: number
  }
  initialViewportProps: {
    latitude: number
    longitude: number
    zoom: number
  }
}

const easeInOutQuad = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1

export const transitionProps = {
  transitionDuration: 2000,
  transitionEasing: easeInOutQuad,
}

export const FacilitiesMap: FC<MapType> = ({
  center,
  markers,
  activeTags,
  onMarkerClick = () => undefined,
  highlightedLocation,
  staticViewportProps = { minZoom: 10, maxZoom: 22 },
  initialViewportProps,
}) => {
  const map = useRef<Map>(null)
  const highlightedMarker = useRef<Marker>(null)

  const { replace, query, pathname } = useRouter()
  const mappedQuery = mapRawQueryToState(query)

  const [viewport, setViewport] = useState<ViewportProps>({
    ...staticViewportProps,
    ...initialViewportProps,
  })

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    map.current = new maplibregl.Map({
      container: 'map',
      style: `https://api.maptiler.com/maps/bright/style.json?key=${
        process.env.NEXT_PUBLIC_MAPTILER_API_KEY || ''
      }`,
      center: [viewport.longitude, viewport.latitude] as LngLatLike,
      zoom: viewport.zoom,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setViewport({
      ...viewport,
      ...transitionProps,
      latitude: mappedQuery.latitude || viewport.latitude,
      longitude: mappedQuery.longitude || viewport.longitude,
      zoom: mappedQuery.zoom || viewport.zoom,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mappedQuery.latitude, mappedQuery.longitude, mappedQuery.zoom])

  const debouncedViewportChange = useDebouncedCallback(
    (viewport: URLViewportType): void => {
      if (pathname !== '/map') return
      const newQuery = { ...mappedQuery, ...viewport }

      void replace({ pathname, query: newQuery }, undefined, { shallow: true })
    },
    1000
  )

  console.log(debouncedViewportChange)

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
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 20, // Radius of each cluster when clustering points (defaults to 50)
      })

      map.current.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'facilities',
        paint: {
          'circle-color': '#2f2fa2',
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            50,
            30,
            100,
            35,
          ],
        },
      })

      map.current.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'facilities',
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-size': 16,
        },
        paint: {
          'text-color': '#fff',
        },
      })

      map.current.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'facilities',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#2f2fa2',
          'circle-radius': 8,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff',
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
    console.log(activeTags)
    // TODO: Implement filtering of facilities according to activeTag here.
  }, [activeTags])

  return (
    <div
      id="map"
      className="w-full h-full bg-[#F8F4F0]"
      aria-label="Kartenansicht der Einrichtungen"
    ></div>
  )
}
