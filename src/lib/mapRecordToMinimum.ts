import { TableRowType } from '@common/types/gristData'
import sanitizeHtml from 'sanitize-html'
import {
  getRecordOpeningTimesBounds,
  OpeningTimesBoundsType,
} from './getRecordOpeningTimesBounds'

type PrioNumberType = -1 | 0 | 1 | 2

export interface MinimalRecordType
  extends Record<string, unknown>,
    OpeningTimesBoundsType {
  id: number
  title: string
  latitude: number
  longitude: number
  prioriy: PrioNumberType
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
    open247: record.fields['c24_h_7_Tage'].trim() === 'ja',
    prioriy: mapPriorityToNumber(record.fields.Prio),
    description: sanitizeHtml(record.fields.Uber_uns, {
      allowedTags: [],
      allowedAttributes: {},
      disallowedTagsMode: 'discard',
    }),
  }
}

function mapPriorityToNumber(
  rawPrio: TableRowType['fields']['Prio']
): PrioNumberType {
  switch (rawPrio) {
    case 'Hoch':
      return 2
    case 'Mittel':
      return 1
    case 'Versteckt':
      return -1
    default:
      return 0
  }
}
