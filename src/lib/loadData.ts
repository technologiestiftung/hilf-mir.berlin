import { GristLabelType, TableRowType } from '../common/types/gristData'
import { loadCacheData } from './loadCacheData'
import { getGristLabels } from './requests/getGristLabels'
import { getGristRecords } from './requests/getGristRecords'
import { getGristTexts } from './requests/getGristTexts'
import { TextsMapType } from './TextsContext'

export async function loadData(): Promise<{
  records: TableRowType[]
  labels: GristLabelType[]
  texts: TextsMapType
}> {
  let texts, records, labels
  if (process.env.IS_BUILDING) {
    const cacheData = await loadCacheData()
    texts = cacheData.texts
    labels = cacheData.labels
    records = cacheData.records
  } else {
    const fetchedData = await Promise.all([
      getGristTexts(),
      getGristRecords(),
      getGristLabels(),
    ])
    texts = fetchedData[0]
    records = fetchedData[1]
    labels = fetchedData[2]
  }
  return { texts, labels, records }
}
