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
type ResetUrlStateHandlerType = () => void

const UrlStateContext = createContext<
  [PageQueryType, SetUrlStateHandlerType, ResetUrlStateHandlerType]
>([{}, () => undefined, () => undefined])

const Provider = UrlStateContext.Provider

export const useUrlState = (): [
  PageQueryType,
  SetUrlStateHandlerType,
  ResetUrlStateHandlerType
] =>
  useContext(UrlStateContext) as [
    PageQueryType,
    SetUrlStateHandlerType,
    ResetUrlStateHandlerType
  ]

export const UrlStateProvider: FC = ({ children }) => {
  const { query, pathname } = useRouter()
  const mappedQuery = mapRawQueryToState(query)
  const [latitude, setLatitude] = useState(mappedQuery.latitude)
  const [longitude, setLongitude] = useState(mappedQuery.longitude)
  const [zoom, setZoom] = useState(mappedQuery.zoom)
  const [tags, setTags] = useState(mappedQuery.tags)
  const [back, setBack] = useState(mappedQuery.back)
  const [q, setQ] = useState(mappedQuery.q)
  const [qCategories, setQCategories] = useState(mappedQuery.qCategories)

  // GET A COMBINED STATE OBJECT WITH APPLIED DEFAULTS
  const state = getFormattedUrlStateWithDefaults({
    latitude,
    longitude,
    zoom,
    tags,
    back,
    q,
    qCategories,
  })

  // UTILITY FUNCTION TO UPDATE ALL REACT STATES
  const updateReactUrlState = useCallback(
    (state: PageQueryType) => {
      setLatitude(state.latitude)
      setLongitude(state.longitude)
      setZoom(state.zoom)
      setTags(state.tags)
      setBack(state.back)
      setQ(state.q)
      setQCategories(state.qCategories)
    },
    [setLatitude, setLongitude, setZoom, setTags, setBack, setQ, setQCategories]
  )

  // UTILITY FUNCTION TO UPDATE URL STATE (Passed down the context as a setter)
  const updateUrlState = useCallback(
    (newState: PageQueryType) => {
      const path = typeof query.id === 'string' ? `/${query.id}` : pathname

      const fullNewState = removeFalsyFromQuery({
        ...state,
        ...newState,
      })
      fullNewState.q = truncateSearchTerm(fullNewState.q)

      updateStateWindowLocation(path, fullNewState)
      updateReactUrlState(fullNewState)
    },
    [query.id, pathname, state, updateReactUrlState]
  )

  const resetUrlState = useCallback(() => {
    updateStateWindowLocation(pathname, {})
    updateReactUrlState({})
  }, [pathname, updateReactUrlState])

  // UPDATE REACT STATE ON NEXTJS ROUTER QUERY CHANGE
  useEffect(
    () => updateReactUrlState(mappedQuery),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query]
  )

  // UPDATE URL WITH DEFAULTS ON INITIAL LOAD AND PAGE CHANGE
  useEffect(() => {
    if (typeof window === 'undefined') return

    const urlStateFromWindowLocation = getUrlStateFromWindowLocation()
    const allCatergoriesAreUnselected =
      !urlStateFromWindowLocation.qCategories?.length

    if (allCatergoriesAreUnselected) {
      updateUrlState({
        ...urlStateFromWindowLocation,
        qCategories: stateSearchCategoriesToUrlSearchCategories({
          categorySelfHelp: true,
          categoryAdvising: true,
        }),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.id, pathname])

  return (
    <Provider value={[state, updateUrlState, resetUrlState]}>
      {children}
    </Provider>
  )
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

function getUrlStateFromWindowLocation(): PageQueryType {
  const urlParams = new URLSearchParams(window.location.search)
  return mapRawQueryToState({
    latitude: urlParams.get('latitude') || undefined,
    longitude: urlParams.get('longitude') || undefined,
    zoom: urlParams.get('zoom') || undefined,
    tags: urlParams.getAll('tags')?.join(',') || undefined,
    back: urlParams.get('back') || undefined,
    q: urlParams.get('q') || undefined,
    qCategories: urlParams.getAll('qCategories')?.join(',') || undefined,
  })
}

function getFormattedUrlStateWithDefaults({
  latitude,
  longitude,
  zoom,
  tags,
  back,
  q,
  qCategories,
}: PageQueryType): PageQueryType {
  return {
    latitude,
    longitude,
    zoom,
    tags: tags || [],
    back,
    q: q || '',
    qCategories: qCategories || [],
  }
}

function updateStateWindowLocation(path: string, state: PageQueryType): void {
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
}
