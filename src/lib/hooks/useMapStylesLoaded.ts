import { Map } from 'maplibre-gl'
import { useEffect, useState } from 'react'

export function useMapStylesLoaded(map: null | Map): boolean {
  const [mapIsFullyLoaded, setMapIsFullyLoaded] = useState(false)

  useEffect(() => {
    if (!map) return

    map.on('load', () => {
      const pollForMapLoaded = (): void => {
        if (map?.loaded()) {
          setMapIsFullyLoaded(true)
          return
        } else {
          requestAnimationFrame(pollForMapLoaded)
        }
      }

      pollForMapLoaded()
    })
  }, [map])

  return mapIsFullyLoaded
}
