import { LngLat } from 'maplibre-gl'
import { useCallback } from 'react'
import { useUserGeolocation } from './useUserGeolocation'

interface PointType {
  latitude?: number
  longitude?: number
}

interface UseDistanceToUserReturnType {
  getDistanceToUser: (pointA: PointType) => number | undefined
}

export function getDistanceBetweenTwoPoints(
  pointA: PointType,
  pointB: PointType
): number | undefined {
  if (!pointA?.latitude || !pointA?.longitude) return
  if (!pointB?.latitude || !pointB?.longitude) return

  const userLocation = new LngLat(pointA.longitude, pointA.latitude)
  const facilityLocation = new LngLat(pointB.longitude, pointB.latitude)
  const dist = userLocation.distanceTo(facilityLocation)

  const distance = Math.round(dist / 100) / 10
  return distance
}

export const useDistanceToUser = (): UseDistanceToUserReturnType => {
  const pointB = useUserGeolocation()

  const getDistanceToUser = useCallback(
    (pointA: PointType): number | undefined => {
      return getDistanceBetweenTwoPoints(pointA, pointB)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pointB.latitude, pointB.longitude]
  )

  return { getDistanceToUser }
}
