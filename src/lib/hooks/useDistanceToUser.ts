import {
  getDistanceBetweenTwoPoints,
  PointType,
} from '@lib/getDistanceBetweenTwoPoints'
import { useCallback } from 'react'
import { useUserGeolocation } from './useUserGeolocation'

interface UseDistanceToUserReturnType {
  getDistanceToUser: (pointA: PointType) => number | undefined
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
