import { GristLabelType, TableRowType } from '../common/types/gristData'
import { loadCacheData } from './loadCacheData'
import { TextsMapType } from './TextsContext'

export async function loadData(): Promise<{
  records: TableRowType[]
  labels: GristLabelType[]
  texts: TextsMapType
}> {
  const cacheData = await loadCacheData()
  const texts = cacheData.texts
  const labels = cacheData.labels
  const records = cacheData.records
  return { texts, labels, records }
}
