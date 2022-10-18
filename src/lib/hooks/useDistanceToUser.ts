import { useUserGeolocation } from './useUserGeolocation'
import { LngLat } from 'maplibre-gl'
import { useEffect, useState } from 'react'

interface PointType {
  latitude?: number
  longitude?: number
}

export const useDistanceToUser = (pointA: PointType): number | undefined => {
  const pointB = useUserGeolocation()
  const [distance, setDistance] = useState<number | undefined>()
  useEffect(() => {
    if (!pointA?.latitude || !pointA?.longitude) return
    if (!pointB?.latitude || !pointB?.longitude) return

    const userLocation = new LngLat(pointA.longitude, pointA.latitude)
    const facilityLocation = new LngLat(pointB.longitude, pointB.latitude)
    const dist = userLocation.distanceTo(facilityLocation)

    setDistance(Math.round(dist / 100) / 10)
  }, [pointA, pointB])

  return distance
}
