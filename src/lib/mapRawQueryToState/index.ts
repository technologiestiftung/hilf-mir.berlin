import { truncateSearchTerm } from '@lib/facilityFilterUtil'
import { removeNullAndUndefinedFromQuery } from '@lib/removeNullAndUndefinedFromQuery'

type qCategoryType = 1 | 2 | 3 | 4 | 5
export interface PageQueryType {
  latitude?: number
  longitude?: number
  zoom?: number
  tags?: number[]
  q?: string
  qCategories?: qCategoryType[]
  back?: string
}

const isNumber = (val: unknown): boolean =>
  !Number.isNaN(val) && Number.isInteger(parseFloat(String(val)))

const parseSingleNumber = (
  val: string | string[] | undefined
): number | null => {
  if (!val) return null
  if (typeof val === 'string') return parseFloat(val) || null
  if (isNumber(val)) return Number(val)
  return null
}

const parseNumbersArray = (
  val: string | string[] | undefined
): number[] | null => {
  if (typeof val === 'undefined') return null
  if (Array.isArray(val)) {
    return val.map(parseSingleNumber).filter(Boolean) as number[]
  }
  if (typeof val !== 'string') return null
  try {
    if (!val.startsWith('[') && !val.endsWith(']')) {
      return val.split(',').map(parseSingleNumber).filter(Boolean) as number[]
    }
    const parsedJson = JSON.parse(val) as unknown
    if (isNumber(parsedJson)) return [parsedJson] as number[]
    if (!Array.isArray(parsedJson)) return null
    return parsedJson.map(parseSingleNumber).filter(Boolean) as number[]
  } catch (err) {
    console.error(
      'There was an error while parsing the query parameter "tags":',
      Error(err as string).message,
      Error(err as string).stack
    )
    return null
  }
}

export const mapRawQueryToState = (
  rawQuery: Record<string, string | string[] | undefined>
): PageQueryType =>
  removeNullAndUndefinedFromQuery({
    latitude: parseSingleNumber(rawQuery.latitude),
    longitude: parseSingleNumber(rawQuery.longitude),
    zoom: parseSingleNumber(rawQuery.zoom),
    tags: parseNumbersArray(rawQuery.tags),
    q: truncateSearchTerm(rawQuery.q),
    qCategories: parseNumbersArray(rawQuery.qCategories) as qCategoryType[],
  })
