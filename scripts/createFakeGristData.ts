import fetch from 'node-fetch'
import { TableRowType } from '@common/types/gristData'
import { loadEnvConfig } from '@next/env'
import { faker } from '@faker-js/faker/locale/de'

const projectDir = process.cwd()
loadEnvConfig(projectDir, true)

const createRandomArrayFromArray = (
  sourceArray: string[],
  newArrayLength: number
): string[] => {
  const shuffledArray = [...sourceArray].sort(() => 0.5 - Math.random())
  return shuffledArray.slice(0, newArrayLength)
}

const getRandomNumberInRange = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min) + min)

const POST_RECORDS_URL = `${
  process.env.NEXT_SECRET_GRIST_DOMAIN || ''
}/api/docs/${process.env.NEXT_SECRET_GRIST_DOC_ID || ''}/tables/${
  process.env.NEXT_SECRET_GRIST_TABLE || ''
}/records`

const fakeData: Omit<TableRowType, 'id'>[] = Array.from(Array(300)).map(() => {
  return {
    fields: {
      ID2: 1,
      Anmeldung_gewunscht: 'ja',
      Art_der_Anmeldung: 'telefonisch',
      Barrierefreiheit: 'nein',
      Beratungsmoglichkeiten: createRandomArrayFromArray(
        [
          'Vor Ort',
          'Telefonberatung',
          'Rückrufservice',
          'Außerhalb der Einrichtung',
        ],
        getRandomNumberInRange(1, 4)
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
      // TODO: Fakers latitude produces weird, nor really random-looking results. Improve that.
      lat: parseFloat(
        faker.address.latitude(52.645919276537, 52.54470760200334, 6)
      ),
      // TODO: Fakers latitude produces weird, nor really random-looking results. Improve that.
      long: parseFloat(
        faker.address.longitude(13.381266029328117, 13.349337606247445, 6)
      ),
      PLZ: `${faker.datatype.number({ min: 10_000, max: 13_000 })}`,
      Schlagworte: createRandomArrayFromArray(
        ['1', '2', '3', '4', '5', '6'],
        getRandomNumberInRange(1, 6)
      ).map((id) => parseInt(id)),
      Zielgruppen: 'Familien;Senioren',
      Prio: ['', 'Versteckt', 'Niedrieg', 'Mittel', 'Hoch'][
        getRandomNumberInRange(0, 4)
      ],
      Sprachen: createRandomArrayFromArray(
        ['Deutsch', 'Englisch', 'Türkisch', 'Polnisch', 'Arabisch', 'Spanisch'],
        getRandomNumberInRange(1, 6)
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
  console.error(error)
}
