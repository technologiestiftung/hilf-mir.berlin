export interface PageQueryType {
  latitude: number | null
  longitude: number | null
  zoom: number | null
  tags: number[] | null
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

const removeNull = (
  obj: Record<string, unknown | null>
): Partial<PageQueryType> => {
  Object.keys(obj).forEach(
    (k) => (obj[k] === null || typeof obj[k] === 'undefined') && delete obj[k]
  )
  return obj
}

export const mapRawQueryToState = (
  rawQuery: Record<string, string | string[] | undefined>
): Partial<PageQueryType> =>
  removeNull({
    latitude: parseSingleNumber(rawQuery.latitude),
    longitude: parseSingleNumber(rawQuery.longitude),
    zoom: parseSingleNumber(rawQuery.zoom),
    tags: parseNumbersArray(rawQuery.tags),
  })
