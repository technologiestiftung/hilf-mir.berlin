/**
 * Build step: convert the committed CSV source-of-truth under `data/csv/` into
 * the JSON cache (`data/records.json`, `data/labels.json`, `data/texts.json`)
 * that the app reads at build/request time. This replaces the previous
 * Grist-API download.
 *
 * Run with: npx ts-node src/scripts/csvToJson.ts
 */
import fs from 'node:fs/promises'
import Papa from 'papaparse'
import sanitize from 'sanitize-html'
import { GristLabelType, TableRowType } from '../common/types/gristData'
import {
  createDirectoriesIfNotAlreadyThere,
  writeJsonFile,
} from '../lib/scriptUtils'
import { TextsMapType } from '../lib/TextsContext'

type CsvRow = Record<string, string>

async function parseCsv(name: string): Promise<CsvRow[]> {
  const content = await fs.readFile(`data/csv/${name}.csv`, 'utf-8')
  const { data, errors } = Papa.parse<CsvRow>(content, {
    header: true,
    skipEmptyLines: true,
  })
  if (errors.length > 0) {
    throw new Error(
      `Failed to parse data/csv/${name}.csv: ${errors
        .map((e) => e.message)
        .join(', ')}`
    )
  }
  return data
}

/** Columns that must be reconstructed with a non-string type. Everything else
 * stays a string (empty cell -> ''), matching how the app consumes the data. */
const RECORD_NUMBER_FIELDS = ['Anzeigen'] as const
const RECORD_ARRAY_FIELDS = ['Schlagworte'] as const
// Coordinates are `string | null` in the source; an empty cell means "no
// coordinates" and is represented as null (so geo code skips the record).
const RECORD_NULLABLE_FIELDS = ['lat', 'long'] as const

function csvRowToRecord({ id, ...fields }: CsvRow): TableRowType {
  const parsedFields: Record<string, unknown> = { ...fields }
  for (const field of RECORD_NUMBER_FIELDS) {
    parsedFields[field] = fields[field] === '' ? null : Number(fields[field])
  }
  for (const field of RECORD_ARRAY_FIELDS) {
    parsedFields[field] = fields[field]
      ? (JSON.parse(fields[field]) as unknown[])
      : []
  }
  for (const field of RECORD_NULLABLE_FIELDS) {
    if (fields[field] === '') parsedFields[field] = null
  }
  return {
    id: Number(id),
    fields: parsedFields,
  } as TableRowType
}

function csvRowToLabel({ id, order, ...fields }: CsvRow): GristLabelType {
  return {
    id: Number(id),
    fields: {
      ...fields,
      order: order === '' ? null : Number(order),
    },
  } as GristLabelType
}

// Mirrors the previous getGristTexts sanitisation: only these keys may keep a
// small set of inline HTML tags; all other text values are stripped of markup.
const keysOfAllowedHtml = ['homeWelcomeText', 'welcomeFiltersText']

function csvRowsToTexts(rows: CsvRow[]): TextsMapType {
  return rows.reduce((acc, { key, de }) => {
    const htmlIsAllowed = keysOfAllowedHtml.includes(key)
    return {
      ...acc,
      [key]: sanitize(de, {
        allowedTags: htmlIsAllowed
          ? ['a', 'b', 'i', 'em', 'strong', 'u', 'sup', 'sub', 'br']
          : [],
        allowedAttributes: {
          a: htmlIsAllowed ? ['href', 'title'] : [],
        },
        disallowedTagsMode: 'discard',
      }),
    }
  }, {}) as TextsMapType
}

async function main(): Promise<void> {
  console.log(`BUILDING CACHE DATA FROM CSV`)
  const [recordRows, labelRows, textRows] = await Promise.all([
    parseCsv('records'),
    parseCsv('labels'),
    parseCsv('texts'),
  ])

  // Only rows flagged for display (`Anzeigen === 1`) are exposed, matching the
  // previous getGristRecords behaviour.
  const records = recordRows
    .map(csvRowToRecord)
    .filter((record) => record.fields.Anzeigen === 1)
  const labels = labelRows.map(csvRowToLabel)
  const texts = csvRowsToTexts(textRows)
  console.log(
    `  -> ${records.length} records, ${labels.length} labels, ${
      Object.keys(texts).length
    } texts`
  )

  await createDirectoriesIfNotAlreadyThere('data')
  await Promise.all([
    writeJsonFile(`data/records.json`, records),
    writeJsonFile(`data/labels.json`, labels),
    writeJsonFile(`data/texts.json`, texts),
  ])
  console.log(`  -> ✅ Success`)
}

void main()
