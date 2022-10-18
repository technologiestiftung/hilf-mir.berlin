import { ChangeEvent, FC, useState } from 'react'
import { FeatureType, geocode } from '@lib/requests/geocode'
import classNames from '@lib/classNames'

interface SearchType {
  onSelectResult?: (place: FeatureType) => void
}
export const Search: FC<SearchType> = ({
  onSelectResult = () => undefined,
}) => {
  const [searchInput, setSearchInput] = useState('')
  const [searchResults, setSearchResults] = useState<FeatureType[]>([])
  const onSearchInput = async (
    e: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const inputValue = e.target.value
    setSearchInput(inputValue)

    if (inputValue.length <= 3) return
    const results = await geocode(inputValue)
    if (!results) return
    setSearchResults(results.features)
  }
  return (
    <div className={classNames(`max-w-72 w-full bg-white h-12`)}>
      <div className="grid grid-cols-1 h-12">
        <label htmlFor="geocoding-input" className="sr-only">
          Standortsuche
        </label>
        <input
          type="text"
          name="place"
          id="geocoding-input"
          className={classNames(
            `border border-gray-100 px-3 py-2 h-12`,
            `focus:outline-none focus:ring-2 focus:ring-red`,
            `focus:ring-offset-2 focus:ring-offset-white`,
            `relative focus:z-10`
          )}
          placeholder="Adresssuche"
          value={searchInput}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onChange={onSearchInput}
        />
      </div>
      <ul
        className="border-x border-gray-100"
        aria-label="Ergebnisse der Standortsuche"
      >
        {searchResults.length > 0 &&
          searchResults.map((searchResult) => {
            return (
              <li
                key={`${searchResult.id} ${searchResult.place_name}`}
                className="border-b border-gray-20 last-of-type:border-black bg-white"
              >
                <button
                  className="text-left w-full py-2 px-3 transition-colors hover:bg-gray-50"
                  onClick={() => {
                    setSearchInput('')
                    setSearchResults([])
                    onSelectResult(searchResult)
                  }}
                >
                  {searchResult.place_name}
                </button>
              </li>
            )
          })}
      </ul>
    </div>
  )
}
