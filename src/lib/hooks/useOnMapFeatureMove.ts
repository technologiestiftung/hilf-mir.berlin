import { GeojsonFeatureType } from '@lib/createGeojsonStructure'
import { MinimalRecordType } from '@lib/mapRecordToMinimum'
import { Map } from 'maplibre-gl'
import { useEffect } from 'react'

type HandlerType = (features: GeojsonFeatureType<MinimalRecordType>[]) => void

export function useOnMapFeatureMove(
  map: Map | null,
  layer: string,
  handler: HandlerType
): void {
  useEffect(() => {
    if (!map) return

    map.on('load', () => {
      if (layer && handler) {
        map.on('mousemove', layer, (e) => {
          if (!map || !handler) return
          if (!e.features || e.features.length === 0) return
          const features = e.features as GeojsonFeatureType<MinimalRecordType>[]
          handler(features)
        })
      }
    })
  }, [map, handler, layer])
}
