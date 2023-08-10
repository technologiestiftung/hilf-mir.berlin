import { useRouter } from 'next/router'
import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { mapRawQueryToState, PageQueryType } from './mapRawQueryToState'
import { truncateSearchTerm } from './facilityFilterUtil'
import { removeNullAndUndefinedFromQuery } from './removeNullAndUndefinedFromQuery'

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
  const { query, pathname } = useRouter()
  const mappedQuery = mapRawQueryToState(query)
  const [latitude, setLatitude] = useState<number | undefined>(
    mappedQuery.latitude
  )
  const [longitude, setLongitude] = useState<number | undefined>(
    mappedQuery.longitude
  )
  const [zoom, setZoom] = useState<number | undefined>(mappedQuery.zoom)
  const [tags, setTags] = useState<number[] | undefined>(mappedQuery.tags)
  const [back, setBack] = useState<string | undefined>(mappedQuery.back)
  const [q, setQ] = useState<string | undefined>(mappedQuery.q)
  const [qCategories, setQCategories] = useState<
    PageQueryType['qCategories'] | undefined
  >(mappedQuery.qCategories)

  const updateUrlState = useCallback(
    (newState: PageQueryType) => {
      const path = typeof query.id === 'string' ? `/${query.id}` : pathname
      const state = removeNullAndUndefinedFromQuery({
        latitude,
        longitude,
        zoom,
        tags,
        qCategories,
        back,
        ...newState,
        q: newState.q ? truncateSearchTerm(newState.q) : q,
      })
      const paramsString = new URLSearchParams(
        state as Record<string, string>
      ).toString()
      const as = `${path}?${paramsString}`
      window.history.replaceState(
        {
          ...window.history.state,
          ...state,
          as,
          url: as,
        },
        '',
        as
      )
      if (newState.latitude) setLatitude(newState.latitude)
      if (newState.longitude) setLongitude(newState.longitude)
      if (newState.zoom) setZoom(newState.zoom)
      if (newState.tags) setTags(newState.tags)
      if (newState.back) setBack(newState.back)
      if (newState.q) setQ(newState.q)
      if (newState.qCategories) setQCategories(newState.qCategories)
    },
    [query.id, pathname, latitude, longitude, zoom, tags, q, qCategories, back]
  )

  useEffect(() => {
    setLatitude(mappedQuery.latitude)
    setLongitude(mappedQuery.longitude)
    setZoom(mappedQuery.zoom)
    setTags(mappedQuery.tags)
    setBack(mappedQuery.back)
    setQ(mappedQuery.q)
    setQCategories(mappedQuery.qCategories)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('qCategories')) return
    updateUrlState({
      qCategories: stateSearchCategoriesToUrlSearchCategories({
        categorySelfHelp: true,
        categoryAdvising: true,
      }),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const state = {
    latitude,
    longitude,
    zoom,
    tags: tags || [],
    back,
    q: q || '',
    qCategories: qCategories || [],
  }

  return <Provider value={[state, updateUrlState]}>{children}</Provider>
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
