import { TableRowType } from '@common/types/gristData'
import {
  getRecordOpeningTimesBounds,
  OpeningTimesBoundsType,
} from './getRecordOpeningTimesBounds'

export interface MinimalRecordType
  extends Record<string, unknown>,
    OpeningTimesBoundsType {
  id: number
  title: string
  latitude: number
  longitude: number
  labels: number[]
  open247: boolean
  description: string
}

export const mapRecordToMinimum = (record: TableRowType): MinimalRecordType => {
  return {
    id: record.id,
    title: record.fields.Einrichtung,
    latitude: record.fields.lat,
    longitude: record.fields.long,
    ...getRecordOpeningTimesBounds(record.fields),
    labels: record.fields.Schlagworte,
    open247: record.fields['c24_h_7_Tage'] === 'ja',
    description: record.fields.Uber_uns,
  }
}
