import { ViewportType } from '@lib/types/map'
import { Map } from 'maplibre-gl'
import { RefObject, useEffect, useRef } from 'react'

export function usePreviousViewport(map: Map | null): RefObject<ViewportType> {
  const prevViewport = useRef<ViewportType>(null)

  useEffect(() => {
    if (!map) return
    map.on('moveend', (e) => {
      // Determines whether a moveend event has been triggered by a user or
      // a programatic change (easeTo, flyTo, etc)
      const isUserEvent = !!e.originalEvent
      if (!map || !isUserEvent) return
      // If the user has changed the zoom or position, we save a reference
      // to the last position/zoom in order to move back to this position
      // when the user goes back to map overview (deselcts the facility)
      const { lat: latitude, lng: longitude } = map.getCenter()
      const zoom = map.getZoom.bind(map)()
      if (!latitude || !longitude || !zoom) return
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      prevViewport.current = { latitude, longitude, zoom }
    })
  }, [map])

  return prevViewport
}
