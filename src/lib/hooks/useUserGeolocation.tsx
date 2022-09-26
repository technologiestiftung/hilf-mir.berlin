import { useCallback, useEffect, useState } from 'react'

const LOCAL_STORAGE_KEY = 'useGeolocation'

const requestUserGeolocation = (): Promise<GeolocationPosition> =>
  new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    } else {
      reject()
    }
  })

export const useUserGeolocation = (): {
  useGeolocation: boolean
  setGeolocationUsage: (isOn: boolean) => void
  geolocationIsForbidden: boolean
  latitude: number | undefined
  longitude: number | undefined
} => {
  const [latitude, setLatitude] = useState<undefined | number>(undefined)
  const [longitude, setLongitude] = useState<undefined | number>(undefined)
  const [useGeolocation, setUseGeolocation] = useState(false)
  const [geolocationIsForbidden, setGeolocationIsForbidden] = useState(false)

  const updateGeolocation = useCallback((newValue: boolean) => {
    if (newValue) {
      requestUserGeolocation()
        .then((pos) => {
          setGeolocationIsForbidden(false)
          setLatitude(pos.coords.latitude)
          setLongitude(pos.coords.longitude)
        })
        .catch(() => {
          setUseGeolocation(false)
          localStorage.setItem(LOCAL_STORAGE_KEY, 'false')
          setGeolocationIsForbidden(true)
        })
    }
  }, [])

  useEffect(() => {
    const localStorageValue = window.localStorage.getItem(LOCAL_STORAGE_KEY)
    if (localStorageValue && localStorageValue === 'true') {
      setUseGeolocation(true)
      updateGeolocation(true)
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

  return {
    useGeolocation,
    geolocationIsForbidden,
    setGeolocationUsage,
    latitude,
    longitude,
  }
}
