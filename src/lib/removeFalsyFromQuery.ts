import { PageQueryType } from './mapRawQueryToState'

export const removeFalsyFromQuery = (
  obj: Record<string, unknown | null>
): PageQueryType => {
  Object.keys(obj).forEach((k) => {
    const value = obj[k]
    const isEmptyArray = Array.isArray(value) && value.length === 0
    if (!value || isEmptyArray) delete obj[k]
  })
  return obj
}
