import { TableRowType } from '@common/types/gristData'
import sanitizeHtml from 'sanitize-html'
import {
  getRecordOpeningTimesBounds,
  OpeningTimesBoundsType,
} from './getRecordOpeningTimesBounds'
import { splitString } from './splitString'

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
  languages: string[]
  open247: boolean
  openingTimesText: string
  phone: string
  description: string
  website: string
  type: 'Beratung' | 'Klinik' | 'Selbsthilfe' | 'Amt' | 'Online'
}

export const mapRecordToMinimum = (record: TableRowType): MinimalRecordType => {
  return {
    id: record.id,
    title: record.fields.Einrichtung,
    latitude: Number(record.fields.lat.replace(',', '.')),
    longitude: Number(record.fields.long.replace(',', '.')),
    ...getRecordOpeningTimesBounds(record.fields),
    labels: record.fields.Schlagworte,
    languages: splitString(record.fields.Sprachen, ','),
    open247: record.fields['c24_h_7_Tage'].trim() === 'ja',
    openingTimesText: (record.fields['Weitere_Offnungszeiten'] || '').trim(),
    prioriy: mapPriorityToNumber(record.fields.Prio),
    description: sanitizeHtml(record.fields.Uber_uns, {
      allowedTags: [],
      allowedAttributes: {},
      disallowedTagsMode: 'discard',
    }),
    phone: record.fields.Telefonnummer,
    website: record.fields.Website,
    type: record.fields.Typ,
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
