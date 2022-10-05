import { GristLabelType, TableRowType } from '../common/types/gristData'
import { loadJson } from './scriptUtils'
import { TextsMapType } from './TextsContext'

export async function loadCacheData(): Promise<{
  records: TableRowType[]
  labels: GristLabelType[]
  texts: TextsMapType
}> {
  const [records, labels, texts] = await Promise.all([
    loadJson<TableRowType[]>(`data/records.json`),
    loadJson<GristLabelType[]>(`data/labels.json`),
    loadJson<TextsMapType>(`data/texts.json`),
  ])
  return {
    records,
    labels,
    texts,
  }
}
