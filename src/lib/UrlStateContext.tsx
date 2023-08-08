import { useRouter } from 'next/router'
import { createContext, FC, useCallback, useContext } from 'react'
import { mapRawQueryToState, PageQueryType } from './mapRawQueryToState'

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
          },
        },
        undefined,
        { shallow: true }
      )
    },
    [query, pathname, push]
  )

  return <Provider value={[mappedQuery, updateUrlState]}>{children}</Provider>
}

export function urlSearchCategoriesToStateSearchCategories(
  qCategories: PageQueryType['qCategories']
): Partial<ParsedSearchTermCategoriesType> {
  const noCategories = !qCategories || qCategories.length === 0
  return {
    categorySelfHelp: noCategories || qCategories.includes(1),
    categoryAdvising: noCategories || qCategories.includes(2),
    categoryClinics: noCategories || qCategories.includes(3),
    categoryDisctrictOfficeHelp: noCategories || qCategories.includes(4),
    categoryOnlineOffers: noCategories || qCategories.includes(5),
  }
}

export function stateSearchCategoriesToUrlSearchCategories(
  searchTermCategories: Partial<ParsedSearchTermCategoriesType> | undefined
): PageQueryType['qCategories'] {
  if (!searchTermCategories) return undefined
  if (Object.entries(searchTermCategories).length === 0) return undefined
  return [
    searchTermCategories.categorySelfHelp && 1,
    searchTermCategories.categoryAdvising && 2,
    searchTermCategories.categoryClinics && 3,
    searchTermCategories.categoryDisctrictOfficeHelp && 4,
    searchTermCategories.categoryOnlineOffers && 5,
  ].filter(Boolean) as PageQueryType['qCategories']
}
