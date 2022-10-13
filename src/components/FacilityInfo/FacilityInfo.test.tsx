import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { FacilityInfo } from './'
import { TableRowType as FacilityType } from '@common/types/gristData'

const FACILITY: FacilityType = {
  id: 1,
  fields: {
    Einrichtung: 'Einrichtung',
    Strasse: 'Strasse',
    Hausnummer: '1',
    Zusatz: 'Zusatz',
    PLZ: '12345',
    Bezirk: 'Bezirk',
    Telefonnummer: '030/12345678',
    EMail: 'test@example.com',
    Website: 'Website',
    Trager: 'string',
    Kategorie: 'string',
    Schlagworte: [1, 2, 3],
    Wichtige_Hinweise: 'string',
    Beratungsmoglichkeiten: 'string',
    Sprachen: 'string',
    Barrierefreiheit: 'string',
    Uber_uns: 'string',
    Reichweite: 'string',
    Stadtteile_Regionen: 'string',
    Ausschlie_lich_nach_Meldeadresse: 'string',
    Stadtteil: 'string',
    Ansprechperson_1_Anrede: 'string',
    Ansprechperson_1_Titel: 'string',
    Ansprechperson_1_Vorname: 'string',
    Ansprechperson_1_Nachname: 'string',
    Ansprechperson_2_Anrede: 'string',
    Ansprechperson_2_Titel: 'string',
    Ansprechperson_2_Vorname: 'string',
    Ansprechperson_2_Nachname: 'string',
    c24_h_7_Tage: 'string',
    Montag: 'string',
    Dienstag: 'string',
    Mittwoch: 'string',
    Donnerstag: 'string',
    Freitag: 'string',
    Samstag: 'string',
    Sonntag: 'string',
    Anmeldung_gewunscht: 'string',
    Weitere_Offnungszeiten: 'string',
    lat: 52.13245,
    long: 13.5123,
  },
}

describe('FacilityInfo', () => {
  it('renders what is passed to it', () => {
    render(<FacilityInfo facility={FACILITY} />)

    const facilityName = screen.getByRole('heading', {
      level: 2,
      name: /Einrichtung/i,
    })
    expect(facilityName).toBeInTheDocument()

    const facilityEmail = screen.getByText('test@example.com')
    expect(facilityEmail).toBeInTheDocument()

    const facilityPhone = screen.getByText('030/12345678')
    expect(facilityPhone).toBeInTheDocument()
  })
})
