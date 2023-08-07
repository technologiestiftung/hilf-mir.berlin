import { TableRowType } from '@common/types/gristData'
import { Page } from '@common/types/nextPage'
import Head from 'next/head'
import { useCallback, useState } from 'react'

interface SearchResult {
  result?: TableRowType[]
  error?: string
  params: Record<string, string>
}

const filterOptions = ['Beratung', 'Klinik', 'Amt', 'Online', 'Selbsthilfe']

const Search: Page = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>()
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  const search = useCallback(async () => {
    const response = await fetch(
      `/api/search?query=${searchTerm}&filters=${selectedFilters.join(',')}`
    )
    if (!response.ok) {
      const e = await response.text()
      setError(new Error(e))
      return
    }
    const data = (await response.json()) as SearchResult
    console.log(data)
    setSearchResults(data)
  }, [searchTerm, selectedFilters])

  return (
    <div>
      <Head>
        <title>Info - HILF-MIR Berlin</title>
      </Head>
      <div className="flex flex-col items-center justify-center h-screen">
        <input
          type="text"
          className="px-4 py-2 border rounded"
          placeholder="Enter text here"
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setIsLoading(true)

              search()
                .catch(() => {
                  setError(new Error('Error on search'))
                })
                .finally(() => {
                  setIsLoading(false)
                })
            }
          }}
        />
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col justify-center">
            {filterOptions.map((option) => (
              <label key={option}>
                <input
                  type="checkbox"
                  value={option}
                  checked={selectedFilters.includes(option)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedFilters([...selectedFilters, option])
                    } else {
                      setSelectedFilters(
                        selectedFilters.filter((f) => f !== option)
                      )
                    }
                  }}
                />
                {option}
              </label>
            ))}
          </div>
          {isLoading && <div>Loading...</div>}
          {searchResults &&
            searchResults.result &&
            searchResults.result.length === 0 && (
              <>{'nothing found that matches'}</>
            )}
          {searchResults &&
            searchResults.result &&
            searchResults.result.map((item: TableRowType) => (
              <div key={item.id}>
                {`${item.id}: ${item.fields.Einrichtung}`}
              </div>
            ))}
          {error && <div>{error.message}</div>}
        </div>
      </div>
    </div>
  )
}

export default Search

// Path: pages/search-poc.tsx
