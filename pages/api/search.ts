import { TableRowType } from '@common/types/gristData'
import { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import fs from 'fs/promises'
import { existsSync } from 'fs'

const searchData = ({
  data,
  query,
  filters,
}: {
  data: TableRowType[]
  query: string
  filters: string[]
}): TableRowType[] => {
  if ((!query && filters.length === 0) || (!query && filters.length === 5))
    return data
  return data.filter((item) => {
    // check if item.fields.Typ is in the filters array
    if (filters.length > 0 && !filters.includes(item.fields.Typ)) {
      return false
    }

    // Return true if there is no query
    if (!query) return true

    // Convert each field value into a string and join them together.
    // const str = Object.values(item.fields)
    //   .map((value) => String(value))
    //   .join(' ')
    // only filter specific fields
    const str = [
      item.fields.Einrichtung,
      item.fields.Schlagworte.join(' '),
      item.fields.Zielgruppen,
      item.fields.Trager,
      item.fields.Kategorie,
      item.fields.Sprachen,
      item.fields.Uber_uns,
      item.fields.Strasse,
      item.fields.Hausnummer,
      item.fields.Zusatz,
      item.fields.PLZ,
      item.fields.Bezirk,
      item.fields.Stadtteil,
      item.fields.Telefonnummer,
      item.fields.EMail,
      item.fields.Typ,
    ].join(' ')

    // Return true if the keyword exists in str.
    return str.toLowerCase().includes(query.toLowerCase())
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

  if (typeof params.query !== 'string') {
    return res
      .status(400)
      .json({ result: null, error: 'Missing query parameter "query"' })
  }

  // the paramters filters is a comma sparated list. Create an an array from it
  // If there is no filter applied we still get an string of 0 length. Which gets split into [""] an array with one empty string
  // to prevent our filter function from failing we replace this with an empty array
  const filters = params.filters.length === 0 ? [] : params.filters.split(',')

  const filePath = path.resolve(process.cwd(), './data/records.json')
  // check if the file ath te path exists
  if (!existsSync(filePath)) {
    return res
      .status(500)
      .json({ result: null, error: 'data/records.json File not found' })
  }

  try {
    const content = await fs.readFile(filePath, 'utf8')
    const data = JSON.parse(content) as TableRowType[]
    const result = searchData({ data, query: params.query, filters })
    return res.status(200).json({ params, result })
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ result: null, error: error.message })
    } else {
      return res
        .status(500)
        .json({ result: null, error: new Error('unknown error') })
    }
  }
}

export default handler
