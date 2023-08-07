import { TableRowType } from '@common/types/gristData'
import { loadCacheData } from '@lib/loadCacheData'
import { NextApiRequest, NextApiResponse } from 'next'

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
  const data = await loadCacheData()
  // console.log(data.records)

  const result = searchData(data.records, params.q)

  return res.status(200).json({ params, result })
}

export default handler
