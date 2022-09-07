import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { Search } from './'
import { MOCK_GEOCODING_RESULTS } from 'src/mocks/geocodeResults'
import { geocode } from '@lib/requests/geocode'

jest.mock('@lib/requests/geocode')

describe('Search', () => {
  it('displays no results with 3 or less input characters', async () => {
    const user = userEvent.setup()

    render(<Search />)

    const input = screen.getByLabelText('Standortsuche')
    expect(input).toBeInTheDocument()

    await user.type(input, 'pla')

    expect(input).toHaveValue('pla')

    const resultsList = screen.getByLabelText('Ergebnisse der Standortsuche')
    expect(resultsList).toBeEmptyDOMElement()
  })

  it('displays no results with gibberish input', async () => {
    const user = userEvent.setup()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    geocode.mockResolvedValueOnce({
      features: [],
    })

    render(<Search />)

    const input = screen.getByLabelText('Standortsuche')
    expect(input).toBeInTheDocument()

    await user.type(input, 'ehiurfkergfhifgkd')

    const resultsList = screen.getByLabelText('Ergebnisse der Standortsuche')
    expect(resultsList).toBeEmptyDOMElement()
  })

  it('displays results after input', async () => {
    const user = userEvent.setup()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    geocode.mockResolvedValueOnce(MOCK_GEOCODING_RESULTS)

    render(<Search />)

    const input = screen.getByLabelText('Standortsuche')
    expect(input).toBeInTheDocument()

    await user.type(input, 'plat')

    expect(input).toHaveValue('plat')

    MOCK_GEOCODING_RESULTS.features.forEach((feature) => {
      const placeButton = screen.getByRole('button', {
        name: feature.place_name,
      })
      expect(placeButton).toBeInTheDocument()
    })
  })

  it('lets susers click a result', async () => {
    const user = userEvent.setup()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    geocode.mockResolvedValueOnce(MOCK_GEOCODING_RESULTS)

    render(<Search />)

    const input = screen.getByLabelText('Standortsuche')
    expect(input).toBeInTheDocument()

    await user.type(input, 'plat')

    expect(input).toHaveValue('plat')

    const placeNameToClick = MOCK_GEOCODING_RESULTS.features[0]
    const placeButton = screen.getByRole('button', {
      name: placeNameToClick.place_name,
    })
    expect(placeButton).toBeInTheDocument()

    await user.click(placeButton)
  })
})
