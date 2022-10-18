import { GristLabelType } from '@common/types/gristData'
import { getGristTableData } from './getGristTableData'

export async function getGristLabels(): Promise<GristLabelType[]> {
  const data = await getGristTableData<{ records: GristLabelType[] }>(
    process.env.NEXT_SECRET_GRIST_DOC_ID || '',
    process.env.NEXT_SECRET_GRIST_LABELS_TABLE || ''
  )
  return data.records
}
