import classNames from '@lib/classNames'
import { ViewportType } from '@lib/types/map'
import { LngLatLike, Map, Marker } from 'maplibre-gl'
import { useEffect, useRef } from 'react'

export function useMapHighlightMarker(
  map: Map | null,
  markerViewport: ViewportType | null
): Marker | null {
  const highlightedMarker = useRef<Marker>(null)

  useEffect(() => {
    if (!map) return
    // Remove possibly existent markers:
    highlightedMarker.current?.remove()

    if (!markerViewport?.latitude) return
    const customMarker = document.createElement('div')
    customMarker.className = classNames(
      'w-10 h-10 bg-primary rounded-full ring-2',
      'ring-offset-white ring-offset-2 ring-primary'
    )

    const markerCenter = [
      markerViewport.longitude,
      markerViewport.latitude,
    ] as LngLatLike
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    highlightedMarker.current = new Marker(customMarker)
      .setLngLat(markerCenter)
      .addTo(map)

    map.easeTo({
      center: markerCenter,
      zoom: markerViewport.zoom,
    })
  }, [
    map,
    markerViewport?.longitude,
    markerViewport?.latitude,
    markerViewport?.zoom,
  ])

  return highlightedMarker.current
}
