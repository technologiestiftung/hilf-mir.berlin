import { useRouter } from 'next/router'
import { createContext, FC, useCallback, useContext, useEffect } from 'react'
import { mapRawQueryToState, PageQueryType } from './mapRawQueryToState'

export const MAX_TEXT_SEARCH_STRING_LENGTH = 100

type ParsedSearchTermCategoriesType = {
  categorySelfHelp: boolean
  categoryAdvising: boolean
  categoryClinics: boolean
  categoryDisctrictOfficeHelp: boolean
  categoryOnlineOffers: boolean
}

type SetUrlStateHandlerType = (newState: PageQueryType) => void

const UrlStateContext = createContext<[PageQueryType, SetUrlStateHandlerType]>([
  {},
  () => undefined,
])

const Provider = UrlStateContext.Provider

export const useUrlState = (): [PageQueryType, SetUrlStateHandlerType] =>
  useContext(UrlStateContext) as [PageQueryType, SetUrlStateHandlerType]

export const UrlStateProvider: FC = ({ children }) => {
  const { query, pathname, push } = useRouter()
  const mappedQuery = mapRawQueryToState(query)

  const updateUrlState = useCallback(
    (newState: PageQueryType) => {
      const path = typeof query.id === 'string' ? `/${query.id}` : pathname
      void push(
        {
          pathname: path,
          query: {
            ...query,
            ...newState,
            q: newState.q
              ? newState.q.slice(0, MAX_TEXT_SEARCH_STRING_LENGTH)
              : undefined,
          },
        },
        undefined,
        { shallow: true }
      )
    },
    [query, pathname, push]
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('qCategories')) return
    const parsedQuery = mapRawQueryToState({
      q: urlParams.get('q') || undefined,
      qCategories: urlParams.getAll('qCategories') || undefined,
      tags: urlParams.getAll('tags') || undefined,
      back: urlParams.get('back') || undefined,
      latitude: urlParams.get('latitude') || undefined,
      longitude: urlParams.get('longitude') || undefined,
      zoom: urlParams.get('zoom') || undefined,
    })
    updateUrlState({
      ...parsedQuery,
      qCategories: stateSearchCategoriesToUrlSearchCategories({
        categorySelfHelp: true,
        categoryAdvising: true,
      }),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Provider value={[mappedQuery, updateUrlState]}>{children}</Provider>
}

export function urlSearchCategoriesToStateSearchCategories(
  qCategories: PageQueryType['qCategories']
): Partial<ParsedSearchTermCategoriesType> {
  return {
    categorySelfHelp: !!qCategories?.includes(1),
    categoryAdvising: !!qCategories?.includes(2),
    categoryClinics: !!qCategories?.includes(3),
    categoryDisctrictOfficeHelp: !!qCategories?.includes(4),
    categoryOnlineOffers: !!qCategories?.includes(5),
  }
}

export function stateSearchCategoriesToUrlSearchCategories(
  searchTermCategories: Partial<ParsedSearchTermCategoriesType> | undefined
): PageQueryType['qCategories'] {
  if (typeof searchTermCategories === 'undefined') return undefined
  if (Object.entries(searchTermCategories).length === 0) return []
  return [
    searchTermCategories.categorySelfHelp && 1,
    searchTermCategories.categoryAdvising && 2,
    searchTermCategories.categoryClinics && 3,
    searchTermCategories.categoryDisctrictOfficeHelp && 4,
    searchTermCategories.categoryOnlineOffers && 5,
  ].filter(Boolean) as PageQueryType['qCategories']
}
