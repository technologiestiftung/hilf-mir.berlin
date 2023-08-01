import detectCharacterEncoding from 'detect-character-encoding'
import fs from 'fs'
import csv from 'csv-parser'
import { Iconv } from 'iconv'
const buffer = fs.readFileSync('./datensatz_hilf-mir_berlin.csv')
const charsetMatch = detectCharacterEncoding(buffer)
console.log(charsetMatch)
if (!charsetMatch) {
  console.error('could not detect character encoding')
  process.exit(1)
}

const iconv = new Iconv(charsetMatch.encoding, 'utf-8')
const res = iconv.convert(buffer)
fs.writeFileSync('./datensatz_hilf-mir_berlin_utf8.csv', res)
// console.log(res.toString())

const results: any[] = []

fs.createReadStream('./datensatz_hilf-mir_berlin_utf8.csv')
  .pipe(
    csv({
      strict: true,
      separator: ';',
      mapHeaders: ({ header }) =>
        header
          .replace(/ /g, '_')
          .replace(/ä/g, 'a')
          .replace(/ö/g, 'o')
          .replace(/ü/g, 'u')
          .replace(/Ä/g, 'A')
          .replace(/Ö/g, 'O')
          .replace(/Ü/g, 'U')
          .replace(/24_h\/7_Tage/g, 'c24_h_7_Tage'),

      mapValues: ({
        header,
        value,
      }: {
        header: string
        index: number
        value: string
      }) => {
        if (header === 'lat') {
          return parseFloat(value)
        } else if (header === 'long') {
          return parseFloat(value)
        } else if (header === 'Anzeigen') {
          return parseInt(value)
        }
        if (value === '') {
          return null
        }
        if (value === '#WERT!') {
          return null
        }
        return value
      },
    })
  )
  .on('data', (data) => results.push(data))
  .on('end', () => {
    // clean out empty objects
    const filteredArray = results
      .map((item) => {
        if (Object.keys(item).every((key) => item[key] !== null)) {
          return item
        }
        return null
      })
      .filter((item) => item !== null)
    fs.writeFileSync(
      './datensatz_hilf-mir_berlin.json',
      JSON.stringify(filteredArray, null, 2)
    )
  })
