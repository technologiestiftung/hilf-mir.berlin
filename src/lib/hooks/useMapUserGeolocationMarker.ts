import classNames from '@lib/classNames'
import { Map, Marker } from 'maplibre-gl'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { useUserGeolocation } from './useUserGeolocation'

export function useMapUserGeolocationMarker(
  map: Map | null,
  zoomedInZoom?: number,
  loaded?: boolean
): void {
  const {
    isLoading: userGeolocationIsLoading,
    latitude: userLatitude,
    longitude: userLongitude,
    useGeolocation,
  } = useUserGeolocation()
  const highlightedUserGeoposition = useRef<Marker>(null)
  const { pathname } = useRouter()

  useEffect(() => {
    if (!map) return
    if (!useGeolocation || !userLatitude || !userLongitude) {
      // Without a userGeolocation we want to remove any highlightedUserGeoposition:
      highlightedUserGeoposition && highlightedUserGeoposition.current?.remove()
      return
    } else {
      // Remove possibly existent user geoposition marker:
      highlightedUserGeoposition.current?.remove()

      const customMarker = document.createElement('div')
      customMarker.className = classNames(
        'w-8 h-8 border-2 border-white rounded-full bg-info ring-2',
        'ring-info ring-offset-2 ring-offset-white'
      )

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      highlightedUserGeoposition.current = new Marker(customMarker)
        .setLngLat([userLongitude, userLatitude])
        .addTo(map)

      if (pathname !== '/map') return
      map.easeTo({
        center: [userLongitude, userLatitude],
        zoom: zoomedInZoom || 17,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, userGeolocationIsLoading, useGeolocation])
}
