import { TableRowType } from '@common/types/gristData'
import { LngLatLike } from 'maplibre-gl'

export interface GeojsonType {
  type: string
  features: GeojsonFeatureType[]
}

// This typing is not yet exhaustive but enough for the current use case:
export interface GeojsonFeatureType {
  type: string
  geometry: {
    type: string
    coordinates?: LngLatLike
    [key: string]: unknown
  }
  properties: {
    id: number
    [key: string]: unknown
  }
}

export const createGeoJsonStructure = (
  markers: TableRowType[]
): GeojsonType => {
  return {
    type: 'FeatureCollection',
    features: markers.map((marker) => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          // It's curious that the Grist API returns the field long2, while actually in the spreadsheet the column is called long:
          coordinates: [marker.fields.long2, marker.fields.lat],
        },
        properties: {
          id: marker.id,
          ...marker.fields,
        },
      }
    }),
  }
}
