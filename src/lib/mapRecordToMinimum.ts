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

export const hasValidData = (record: TableRowType): boolean => {
  // Check for required fields
  if (!record?.fields) return false

  const fields = record.fields

  // Check for valid coordinates
  if (!fields.lat || !fields.long) return false
  if (typeof fields.lat !== 'string' || typeof fields.long !== 'string')
    return false
  if (fields.lat.trim() === '' || fields.long.trim() === '') return false

  // Check for valid basic info
  if (!fields.Einrichtung || typeof fields.Einrichtung !== 'string')
    return false
  if (fields.Einrichtung.trim() === '') return false

  // Check for valid type
  const validTypes = ['Beratung', 'Klinik', 'Selbsthilfe', 'Amt', 'Online']
  if (!fields.Typ || !validTypes.includes(fields.Typ)) {
    // We can still process if we have a fallback, but log this
    console.warn(
      `Invalid or missing type for record ${record.id}: ${fields.Typ}`
    )
  }

  return true
}

export const mapRecordToMinimum = (record: TableRowType): MinimalRecordType => {
  const lat = record.fields.lat
  const long = record.fields.long

  return {
    id: record.id,
    title: record.fields.Einrichtung || '',
    latitude: lat ? Number(lat.replace(',', '.')) : NaN,
    longitude: long ? Number(long.replace(',', '.')) : NaN,
    ...getRecordOpeningTimesBounds(record.fields),
    labels: record.fields.Schlagworte || [],
    languages: splitString(record.fields.Sprachen || '', ','),
    open247: (record.fields['c24_h_7_Tage'] || '').trim() === 'ja',
    openingTimesText: (record.fields['Weitere_Offnungszeiten'] || '').trim(),
    prioriy: mapPriorityToNumber(record.fields.Prio),
    description: sanitizeHtml(record.fields.Uber_uns || '', {
      allowedTags: [],
      allowedAttributes: {},
      disallowedTagsMode: 'discard',
    }),
    phone: record.fields.Telefonnummer || '',
    website: record.fields.Website || '',
    type: record.fields.Typ || 'Beratung',
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
