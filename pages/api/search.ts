import { TableRowType } from '@common/types/gristData'
import { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import fs from 'fs/promises'
import { existsSync } from 'fs'

const searchData = (data: TableRowType[], keyword: string): TableRowType[] => {
  return data.filter((item) => {
    // Convert each field value into a string and join them together.
    const str = Object.values(item.fields)
      .map((value) => String(value))
      .join(' ')

    // Return true if the keyword exists in str.
    return str.toLowerCase().includes(keyword.toLowerCase())
  })
}
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const url = new URL(req.url ?? '', 'http://localhost')

  // Get all query parameters as an object
  const params = Object.fromEntries(url.searchParams.entries())
  // check if the q parameter exists
  if (!params.q) {
    return res
      .status(400)
      .json({ result: null, error: 'Missing query parameter "q"' })
  }
  const filePath = path.resolve(process.cwd(), './data/records.json')
  // check if the file ath te path exists
  if (!existsSync(filePath)) {
    return res
      .status(500)
      .json({ result: null, error: 'data/records.json File not found' })
  }

  const content = await fs.readFile(filePath, 'utf8')

  try {
    const data = JSON.parse(content) as TableRowType[]
    const result = searchData(data, params.q)
    return res.status(200).json({ params, result })
  } catch (error: unknown) {
    if (!(error instanceof Error)) {
      return res.status(500).json({ result: null, error })
    } else {
      return res
        .status(500)
        .json({ result: null, error: new Error('unknown error') })
    }
  }

  // console.log(data.records)
}

export default handler
