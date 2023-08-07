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
import { removeNullAndUndefinedFromQuery } from './removeNullAndUndefinedFromQuery'

type UrlStateType = PageQueryType
type SetUrlStateHandlerType = (newState: Partial<PageQueryType>) => void

const UrlStateContext = createContext<[UrlStateType, SetUrlStateHandlerType]>([
  {},
  () => undefined,
])

const Provider = UrlStateContext.Provider

export const useUrlState = (): [UrlStateType, SetUrlStateHandlerType] =>
  useContext(UrlStateContext) as [UrlStateType, SetUrlStateHandlerType]

export const UrlStateProvider: FC = ({ children }) => {
  const { query, pathname, push } = useRouter()
  const mappedQuery = mapRawQueryToState(query)
  const [latitude, setLatitude] = useState<number | undefined>(
    mappedQuery.latitude
  )
  const [longitude, setLongitude] = useState<number | undefined>(
    mappedQuery.longitude
  )
  const [zoom, setZoom] = useState<number | undefined>(mappedQuery.zoom)
  const [tags, setTags] = useState<number[] | undefined>(mappedQuery.tags)

  useEffect(() => {
    setLatitude(mappedQuery.latitude)
    setLongitude(mappedQuery.longitude)
    setZoom(mappedQuery.zoom)
    setTags(mappedQuery.tags)
    console.log('mappedQuery', mappedQuery)
    console.log('query', query)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const updateUrlState = useCallback(
    (newState: Partial<PageQueryType>) => {
      console.log('newState', newState)
      const paramsString = new URLSearchParams({
        ...removeNullAndUndefinedFromQuery({
          latitude,
          longitude,
          zoom,
          tags,
          ...newState,
        }),
      } as Record<string, string>).toString()
      const path = typeof query.id === 'string' ? `/${query.id}` : pathname
      const as = `${path}?${paramsString}`
      void push(
        {
          pathname: path,
          query: {
            ...query,
            ...newState,
          },
        },
        as,
        { shallow: true }
      )
      if (newState.latitude) setLatitude(newState.latitude)
      if (newState.longitude) setLongitude(newState.longitude)
      if (newState.zoom) setZoom(newState.zoom)
      if (newState.tags) setTags(newState.tags)
    },
    [latitude, longitude, zoom, tags, query, pathname, push]
  )

  const state = {
    latitude,
    longitude,
    zoom,
    tags: tags || [],
  }
  return <Provider value={[state, updateUrlState]}>{children}</Provider>
}
