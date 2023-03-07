import { TableRowType } from '@common/types/gristData'
import { getGristTableData } from './getGristTableData'

export async function getGristRecords(): Promise<TableRowType[]> {
  const data = await getGristTableData<{ records: TableRowType[] }>(
    process.env.NEXT_SECRET_GRIST_DOC_ID || '',
    process.env.NEXT_SECRET_GRIST_RECORDS_TABLE || ''
  )
  return data.records.filter((record) => record.fields.Anzeigen === 1)
}
