import { PageQueryType } from './mapRawQueryToState'

export const removeNullAndUndefinedFromQuery = (
  obj: Record<string, unknown | null>
): PageQueryType => {
  Object.keys(obj).forEach(
    (k) => (obj[k] === null || typeof obj[k] === 'undefined') && delete obj[k]
  )
  return obj
}
