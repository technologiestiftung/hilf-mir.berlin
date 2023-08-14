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
import { removeFalsyFromQuery } from './removeFalsyFromQuery'

type ParsedSearchTermCategoriesType = {
  categorySelfHelp: boolean
  categoryAdvising: boolean
  categoryClinics: boolean
  categoryDistrictOfficeHelp: boolean
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
      const state = removeFalsyFromQuery({
        latitude,
        longitude,
        zoom,
        tags,
        qCategories,
        back,
        q,
        ...newState,
      })
      state.q = truncateSearchTerm(state.q)
      const paramsString = new URLSearchParams(
        state as Record<string, string>
      ).toString()
      const as = [path, paramsString].filter(Boolean).join('?')
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
      setLatitude(state.latitude)
      setLongitude(state.longitude)
      setZoom(state.zoom)
      setTags(state.tags)
      setBack(state.back)
      setQ(state.q)
      setQCategories(state.qCategories)
    },
    [query.id, pathname, latitude, longitude, zoom, tags, qCategories, back, q]
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
    if (!urlParams.get('qCategories')) {
      const query = mapRawQueryToState({
        latitude: urlParams.get('latitude') || undefined,
        longitude: urlParams.get('longitude') || undefined,
        zoom: urlParams.get('zoom') || undefined,
        tags: urlParams.getAll('tags')?.join(',') || undefined,
        back: urlParams.get('back') || undefined,
        q: urlParams.get('q') || undefined,
        qCategories: stateSearchCategoriesToUrlSearchCategories({
          categorySelfHelp: true,
          categoryAdvising: true,
        })?.join(','),
      })
      updateUrlState(query)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.id, pathname])

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
    categoryDistrictOfficeHelp: !!qCategories?.includes(4),
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
    searchTermCategories.categoryDistrictOfficeHelp && 4,
    searchTermCategories.categoryOnlineOffers && 5,
  ].filter(Boolean) as PageQueryType['qCategories']
}
