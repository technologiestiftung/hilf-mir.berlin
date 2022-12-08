import { normalizeLatLng } from '@components/Map/mapUtil'
import { ViewportType } from '@lib/types/map'
import { Map } from 'maplibre-gl'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { usePreviousViewport } from './usePreviousViewport'

interface InputType {
  map: Map | null
  zoomedInCoords: Partial<ViewportType> | null
}

export function useEaseOnBackToMap({ map, zoomedInCoords }: InputType): void {
  const { pathname } = useRouter()
  const prevViewport = usePreviousViewport(map)

  useEffect(() => {
    if (!map) return

    if (pathname !== '/map') return

    // When moving from [id] to /map, we check if the position of the
    // has changed and zoom back to the previous position in case it hasn't
    const mapLng = normalizeLatLng(map.getCenter().lng)
    const mapLat = normalizeLatLng(map.getCenter().lat)
    const mapZoom = Math.round(map.getZoom())

    const markerLng = normalizeLatLng(zoomedInCoords?.longitude)
    const markerLat = normalizeLatLng(zoomedInCoords?.latitude)
    const markerZoom = Math.round(zoomedInCoords?.zoom || 0)

    const prevLng = normalizeLatLng(prevViewport.current?.longitude)
    const prevLat = normalizeLatLng(prevViewport.current?.latitude)
    const prevZoom = Math.round(prevViewport.current?.zoom || 0)

    // When an [id] page is (re)loaded, it doesn't yet have a previous position
    if (!prevLng || !prevLat || !prevZoom) return
    // If the user hasn't moved from the default facility position and zoom,
    // we zoom back to the previous map position and zoom
    // This makes it easy to regain context and orientation
    if (
      mapLng === markerLng &&
      mapLat === markerLat &&
      mapZoom === markerZoom
    ) {
      map.easeTo({
        center: [prevLng, prevLat],
        zoom: prevZoom,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])
}
