import { TableRowType } from '@common/types/gristData'
import { getGristTableData } from '@lib/requests/getGristTableData'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<TableRowType[]>
): Promise<void> {
  try {
    const data = await getGristTableData<TableRowType[]>(
      process.env.NEXT_SECRET_GRIST_DOC_ID || '',
      process.env.NEXT_SECRET_GRIST_RECORDS_TABLE || ''
    )
    res.status(200).json(data)
  } catch (error: unknown) {
    console.log(error)
    res.status(500).end((error as Error).message)
  }
}
