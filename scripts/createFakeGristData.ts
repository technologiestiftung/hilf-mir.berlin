import fetch from 'node-fetch'
import { TableRowType } from '@common/types/gristData'
import { loadEnvConfig } from '@next/env'
import { faker } from '@faker-js/faker/locale/de'

const projectDir = process.cwd()
loadEnvConfig(projectDir, true)

// Taken from: https://stackoverflow.com/a/19270021
const getRandomArray = (arr: string[], n: number): string[] => {
  const result = new Array(n)
  let len = arr.length
  const taken = new Array(len)
  if (n > len)
    throw new RangeError('getRandom: more elements taken than available')
  while (n--) {
    const x = Math.floor(Math.random() * len)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    result[n] = arr[x in taken ? taken[x] : x]
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    taken[x] = --len in taken ? taken[len] : len
  }
  return result as string[]
}

const POST_RECORDS_URL = `${
  process.env.NEXT_SECRET_GRIST_DOMAIN || ''
}/api/docs/${process.env.NEXT_SECRET_GRIST_DOC_ID || ''}/tables/${
  process.env.NEXT_SECRET_GRIST_TABLE || ''
}/records`

const fakeData: Omit<TableRowType, 'id'>[] = Array.from(Array(300)).map(() => {
  return {
    fields: {
      Anmeldung_gewunscht: 'ja',
      Ansprechperson_1_Anrede: 'Frau',
      Ansprechperson_1_Nachname: faker.name.lastName(),
      Ansprechperson_1_Titel: 'Dr.',
      Ansprechperson_1_Vorname: faker.name.firstName('female'),
      Ansprechperson_2_Anrede: 'Herr',
      Ansprechperson_2_Nachname: faker.name.lastName(),
      Ansprechperson_2_Titel: '',
      Ansprechperson_2_Vorname: faker.name.firstName('male'),
      Ausschlie_lich_nach_Meldeadresse: 'ja',
      Barrierefreiheit: 'nein',
      Beratungsmoglichkeiten: getRandomArray(
        [
          'Vor Ort',
          'Telefonberatung',
          'Rückrufservice',
          'Außerhalb der Einrichtung',
        ],
        3
      ).join(';'),
      Bezirk: 'Lichtenberg',
      c24_h_7_Tage: 'nein',
      Montag: '09:00 - 17:00',
      Dienstag: '12:00 - 22:00',
      Mittwoch: '09:00 - 12:00',
      Donnerstag: '18:00 - 24:00',
      Freitag: '10:00 - 13:00',
      Samstag: 'geschlossen',
      Sonntag: 'geschlossen',
      Einrichtung: faker.company.name(),
      EMail: faker.internet.email(),
      Hausnummer: `${faker.datatype.number({ max: 350 })}`,
      Kategorie: 'Kontakt-und Beratungsstellen',
      // TODO: Fakers latitude produces weird, nor really random-looking results. Improve that.
      lat: parseFloat(
        faker.address.latitude(52.645919276537, 52.54470760200334, 6)
      ),
      // TODO: Fakers latitude produces weird, nor really random-looking results. Improve that.
      long2: parseFloat(
        faker.address.longitude(13.381266029328117, 13.349337606247445, 6)
      ),
      PLZ: `${faker.datatype.number({ min: 10_000, max: 13_000 })}`,
      Reichweite: 'Bezirk',
      Schlagworte: getRandomArray(
        [
          'Arbeit und Beschäftigung',
          'Erwachsene',
          'Alkohol und Medikamente',
          'Sucht',
          'Geflüchtete',
          'LSTBIQ',
        ],
        3
      ).join(';'),
      Sprachen: getRandomArray(
        ['Deutsch', 'Englisch', 'Türkisch', 'Polnisch', 'Arabisch', 'Spanisch'],
        3
      ).join(';'),
      Stadtteil: 'Lichtenberg',
      Stadtteile_Regionen: '',
      Strasse: faker.address.street(),
      Telefonnummer: faker.phone.number('+49 30 ### ### ##'),
      Trager: faker.company.name(),
      Uber_uns: faker.lorem.paragraph(),
      Website: faker.internet.url(),
      Weitere_Offnungszeiten: '',
      Wichtige_Hinweise: '',
      Zusatz: '',
    } as TableRowType['fields'],
  }
})

const postRows = async (): Promise<void> => {
  const response = await fetch(POST_RECORDS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NEXT_SECRET_GRIST_API_KEY || ''}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      records: fakeData,
    }),
  })
  //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const responseData = await response.json()
  console.log('Successfully inserted fake data:')
  console.log(responseData)
}

try {
  void postRows()
} catch (error) {
  console.error(error)
}
