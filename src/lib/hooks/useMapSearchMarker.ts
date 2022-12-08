import classNames from '@lib/classNames'
import { ViewportType } from '@lib/types/map'
import { LngLatLike, Map, Marker } from 'maplibre-gl'
import { useEffect, useRef } from 'react'

export function useMapSearchMarker(
  map: Map | null,
  searchViewport: ViewportType | null
): void {
  const highlightedSearchMarker = useRef<Marker>(null)
  useEffect(() => {
    if (!map) return
    if (!searchViewport?.latitude) {
      // Without a searchCenter we want to remove any highlightedSearchMarker:
      highlightedSearchMarker && highlightedSearchMarker.current?.remove()
      return
    } else {
      // Remove possibly existent markers:
      highlightedSearchMarker.current?.remove()

      const customMarker = document.createElement('div')
      customMarker.className = classNames('w-8 h-8 bg-norepeat')
      customMarker.style.backgroundImage = 'url("/images/search_geopin.svg")'

      const searchCenter = [
        searchViewport.longitude,
        searchViewport.latitude,
      ] as LngLatLike
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      highlightedSearchMarker.current = new Marker(customMarker)
        .setLngLat(searchCenter)
        .addTo(map)

      map.easeTo({
        center: searchCenter,
        zoom: searchViewport.zoom,
      })
    }
  }, [
    map,
    searchViewport?.latitude,
    searchViewport?.longitude,
    searchViewport?.zoom,
  ])
}
