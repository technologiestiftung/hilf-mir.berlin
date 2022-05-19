import { TableRowType } from '@common/types/gristData'
import type { NextApiRequest, NextApiResponse } from 'next'

// We ignore this because that line is provided by Next and untouched so far:
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<unknown>
) {
  // NOTE: the need for manual JSON encoding of the filters is annoying: {"e-bez": ["Mitte"]}
  // NOTE: It's not exactly clear what is the tableId. I managed to find it through trial and error.

  try {
    const response = await fetch(
      `${process.env.NEXT_SECRET_GRIST_DOMAIN || ''}/api/docs/${
        process.env.NEXT_SECRET_GRIST_DOC_ID || ''
      }/tables/${process.env.NEXT_SECRET_GRIST_TABLE || ''}/records`,
      {
        headers: {
          Authorization: `Bearer ${
            process.env.NEXT_SECRET_GRIST_API_KEY || ''
          }`,
        },
      }
    )
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = (await response.json()) as TableRowType[]
    res.status(200).json(data)
  } catch (error: unknown) {
    return res.status(500).end((error as Error).message)
  }
}
