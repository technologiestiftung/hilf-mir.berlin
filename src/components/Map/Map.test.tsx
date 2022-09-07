import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { FacilitiesMap } from '.'

jest.mock('maplibre-gl/dist/maplibre-gl', () => ({
  GeolocateControl: jest.fn(),
  Map: jest.fn(() => ({
    addControl: jest.fn(),
    on: jest.fn(),
    remove: jest.fn(),
  })),
  NavigationControl: jest.fn(),
}))

describe('FacilitiesMap', () => {
  it('renders a map container', () => {
    render(<FacilitiesMap />)
    const mapContainer = screen.getByLabelText(
      'Kartenansicht der Einrichtungen'
    )
    expect(mapContainer).toBeInTheDocument()
  })
})
