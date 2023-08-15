import { PageQueryType } from './mapRawQueryToState'

export const removeNullAndUndefinedFromQuery = (
  obj: Record<
    string,
    null | undefined | string | number | boolean | Record<string, unknown>
  >
): PageQueryType => {
  Object.keys(obj).forEach(
    (k) => (obj[k] === null || typeof obj[k] === 'undefined') && delete obj[k]
  )
  return obj
}
