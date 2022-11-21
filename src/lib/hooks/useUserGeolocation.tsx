import {
  FC,
  useCallback,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

const LOCAL_STORAGE_KEY = 'useGeolocation'

interface GeolocationType {
  useGeolocation: boolean
  setGeolocationUsage: (isOn: boolean) => void
  geolocationIsForbidden: boolean
  latitude: number | undefined
  longitude: number | undefined
  isLoading: boolean
}

const requestUserGeolocation = (): Promise<GeolocationPosition> =>
  new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    } else {
      reject()
    }
  })

export const UserGeolocationProvider: FC = ({ children }) => {
  const [latitude, setLatitude] = useState<undefined | number>(undefined)
  const [longitude, setLongitude] = useState<undefined | number>(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [useGeolocation, setUseGeolocation] = useState(false)
  const [geolocationIsForbidden, setGeolocationIsForbidden] = useState(false)

  const updateGeolocation = useCallback((newValue: boolean) => {
    let shouldUpdate = true
    if (newValue) {
      requestUserGeolocation()
        .then((pos) => {
          if (!shouldUpdate) return
          setGeolocationIsForbidden(false)
          setLatitude(pos.coords.latitude)
          setLongitude(pos.coords.longitude)
        })
        .catch(() => {
          if (!shouldUpdate) return
          setUseGeolocation(false)
          localStorage.setItem(LOCAL_STORAGE_KEY, 'false')
          setGeolocationIsForbidden(true)
        })
        .finally(() => setIsLoading(false))
    }
    return () => {
      shouldUpdate = false
    }
  }, [])

  useEffect(() => {
    let shouldUpdate = true
    const localStorageValue = window.localStorage.getItem(LOCAL_STORAGE_KEY)
    if (localStorageValue && localStorageValue === 'true' && shouldUpdate) {
      setUseGeolocation(true)
      updateGeolocation(true)
    }
    return () => {
      shouldUpdate = false
    }
  }, [setUseGeolocation, updateGeolocation])

  const setGeolocationUsage = useCallback(
    (newValue) => {
      setUseGeolocation(!!newValue)
      window.localStorage.setItem(
        LOCAL_STORAGE_KEY,
        Boolean(newValue).toString()
      )
      updateGeolocation(!!newValue)
    },
    [updateGeolocation]
  )

  return (
    <GeolocationContext.Provider
      value={{
        useGeolocation,
        geolocationIsForbidden,
        setGeolocationUsage,
        latitude,
        longitude,
        isLoading,
      }}
    >
      {children}
    </GeolocationContext.Provider>
  )
}

const GeolocationContext = createContext<GeolocationType>({
  useGeolocation: false,
  setGeolocationUsage: () => undefined,
  geolocationIsForbidden: false,
  latitude: undefined,
  longitude: undefined,
  isLoading: true,
})

export const useUserGeolocation = (): GeolocationType =>
  useContext(GeolocationContext)
