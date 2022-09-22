import { useCallback, useEffect, useState } from 'react'

const LOCAL_STORAGE_KEY = 'nearFilterOn'

const requestUserGeolocation = (): Promise<GeolocationPosition> =>
  new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    } else {
      reject()
    }
  })

export const useNearFilter = (): {
  nearFilterOn: boolean
  setNearFilter: (isOn: boolean) => void
  geolocationIsForbidden: boolean
} => {
  const [nearFilterOn, setNearFilterOn] = useState(false)
  const [geolocationIsForbidden, setGeolocationIsForbidden] = useState(false)

  const updateGeolocation = useCallback((newValue: boolean) => {
    if (newValue) {
      requestUserGeolocation()
        .then(() => setGeolocationIsForbidden(false))
        .catch(() => {
          setNearFilterOn(false)
          localStorage.setItem(LOCAL_STORAGE_KEY, 'false')
          setGeolocationIsForbidden(true)
        })
    }
  }, [])

  useEffect(() => {
    const localStorageValue = window.localStorage.getItem(LOCAL_STORAGE_KEY)
    if (localStorageValue && localStorageValue === 'true') {
      setNearFilterOn(true)
      updateGeolocation(true)
    }
  }, [setNearFilterOn, updateGeolocation])

  const setNearFilter = useCallback(
    (newValue) => {
      setNearFilterOn(!!newValue)
      window.localStorage.setItem(
        LOCAL_STORAGE_KEY,
        Boolean(newValue).toString()
      )
      updateGeolocation(!!newValue)
    },
    [updateGeolocation]
  )

  return {
    nearFilterOn,
    geolocationIsForbidden,
    setNearFilter,
  }
}
