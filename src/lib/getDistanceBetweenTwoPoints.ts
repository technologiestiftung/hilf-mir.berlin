import { LngLat } from 'maplibre-gl'

export interface PointType {
  latitude?: number
  longitude?: number
}

export function getDistanceBetweenTwoPoints(
  pointA: PointType,
  pointB: PointType
): number | undefined {
  if (!pointA?.latitude || !pointA?.longitude) return
  if (!pointB?.latitude || !pointB?.longitude) return

  const pointALatLng = new LngLat(pointA.longitude, pointA.latitude)
  const pointBLatLng = new LngLat(pointB.longitude, pointB.latitude)
  const dist = pointALatLng.distanceTo(pointBLatLng)

  const distance = Math.round(dist / 100) / 10
  return distance
}
