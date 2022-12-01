import { MinimalRecordType } from '@lib/mapRecordToMinimum'

export interface GeojsonType {
  type: string
  features: GeojsonFeatureType[]
}

// This typing is not yet exhaustive but enough for the current use case:
export interface GeojsonFeatureType<PropertiesType = Record<string, unknown>> {
  type: string
  geometry: {
    type: string
    coordinates?: [x: number, y: number]
    [key: string]: unknown
  }
  properties: PropertiesType & {
    id: number
  }
  state: Record<string, unknown>
}

export const createGeoJsonStructure = (
  markers: MinimalRecordType[]
): GeojsonType => {
  return {
    type: 'FeatureCollection',
    features: markers.map((marker) => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [marker.longitude, marker.latitude],
        },
        properties: marker,
        state: {},
      }
    }),
  }
}
