import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { FacilityInfo } from './'
import { TableRowType as FacilityType } from '@common/types/gristData'

const FACILITY: FacilityType = {
  id: 1,
  fields: {
    Projekt: 'Projekt',
    Zuwendungsempfanger: 'Zuwendungsempfanger',
    Fordertyp: 'Fordertyp',
    Angebotstyp: 'Angebotstyp',
    Zielgruppe: 'Zielgruppe',
    Leistung: 'Leistung',
    Strasse: 'Strasse',
    Hausnummer: '1',
    Zusatz: 'Zusatz',
    PLZ: '12345',
    Bezirk: 'Bezirk',
    Telefonnummer: '030/12345678',
    EMail: 'test@example.com',
    long2: 13.5123,
    Website: 'Website',
    lat: 52.13245,
    district: 'district',
  },
}

describe('FacilityInfo', () => {
  it('renders what is passed to it', () => {
    render(<FacilityInfo facility={FACILITY} />)

    const facilityName = screen.getByRole('heading', {
      level: 2,
      name: /Projekt/i,
    })
    expect(facilityName).toBeInTheDocument()

    const facilityEmail = screen.getByText('test@example.com')
    expect(facilityEmail).toBeInTheDocument()

    const facilityPhone = screen.getByText('030/12345678')
    expect(facilityPhone).toBeInTheDocument()
  })
})
