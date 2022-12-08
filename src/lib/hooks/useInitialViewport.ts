import { ViewportType } from '@lib/types/map'
import { useUrlState } from '@lib/UrlStateContext'
import { Map } from 'maplibre-gl'
import { useEffect, useState } from 'react'

export function useInitialViewport(map: Map | null): void {
  const [urlState] = useUrlState()
  // The initial viewport will be available on 2nd render,
  // because we get it from useRouter. First it has to be null.
  const [initialViewport, setInitialViewport] = useState<ViewportType | null>(
    null
  )

  useEffect(() => {
    // If we've already got an initial viewport, we can not redefine it
    // anymore because something initial shoudl only be set once.
    if (initialViewport) return

    if (!urlState.latitude || !urlState.longitude || !urlState.zoom) return

    const mapLongitude = map?.transform._center.lng
    const mapLatitude = map?.transform._center.lat
    const mapZoom = map?.transform._zoom

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
  }, [
    map,
    urlState.latitude,
    urlState.longitude,
    urlState.zoom,
    initialViewport,
  ])
  //
  // After the initial viewport has been set ONCE (in the above useEffect),
  // we ease the map to the location specified in the query state.
  useEffect(() => {
    if (!initialViewport) return
    map &&
      map.easeTo({
        center: [initialViewport.longitude, initialViewport.latitude],
        zoom: initialViewport.zoom,
      })
  }, [map, initialViewport])
}
