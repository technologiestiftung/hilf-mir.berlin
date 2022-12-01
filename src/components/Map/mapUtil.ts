import { GeojsonFeatureType } from '@lib/createGeojsonStructure'
import { LngLat, Map, LngLatLike } from 'maplibre-gl'

export function getFeaturesOnSameCoordsThanFirstOne<PropsType>(
  features: GeojsonFeatureType<PropsType>[]
): GeojsonFeatureType<PropsType>[] {
  const pointACoords = features[0].geometry.coordinates || [0, 0]
  const pointA = new LngLat(...pointACoords)
  return features.filter((feat) => {
    const coordinates = feat.geometry.coordinates || [0, 0]
    const pointB = new LngLat(...coordinates)
    const dist = pointA.distanceTo(pointB)
    const distance = Math.round(dist / 100) / 10
    return distance < 0.1
  })
}

export function zoomIn(
  map: Map,
  coordinates?: LngLatLike,
  zoomIncrease = 1,
  maxZoom = 17
): void {
  map.easeTo({
    center: coordinates,
    zoom: Math.min(maxZoom, map.getZoom() + zoomIncrease),
  })
}

export function setCursor(cursor = 'grab'): void {
  const container$ = document.querySelector<HTMLDivElement>(
    '.mapboxgl-canvas-container.mapboxgl-interactive'
  )
  if (container$) container$.style.cursor = cursor
}
