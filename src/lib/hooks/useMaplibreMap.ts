import { LngLatLike, Map } from 'maplibre-gl'
import { useEffect, useRef } from 'react'

export function useMaplibreMap(config: {
  containerId: string
  defaultLatitude: number
  defaultLongitude: number
  defaultZoom: number
  maxZoom: number
  minZoom: number
}): Map | null {
  const map = useRef<Map>(null)
  const mapIsInitialized = useRef<boolean>(false)
  // Map setup (run only once on initial render)
  useEffect(() => {
    if (mapIsInitialized.current) return
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    map.current = new Map({
      container: config.containerId,
      style: `${process.env.NEXT_PUBLIC_MAPTILER_STYLE_URL || ''}?key=${
        process.env.NEXT_PUBLIC_MAPTILER_API_KEY || ''
      }`,
      center: [config.defaultLongitude, config.defaultLatitude] as LngLatLike,
      zoom: config.defaultZoom,
      minZoom: config.minZoom,
      maxZoom: config.maxZoom,
    })
    mapIsInitialized.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return map.current
}
