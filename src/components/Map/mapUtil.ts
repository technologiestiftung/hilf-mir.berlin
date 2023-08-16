import { GeojsonFeatureType } from '@lib/createGeojsonStructure'
import MaplibreglSpiderifier, {
  popupOffsetForSpiderLeg,
} from '@lib/MaplibreglSpiderifier'
import { MinimalRecordType } from '@lib/mapRecordToMinimum'
import { TextsMapType } from '@lib/TextsContext'
import { LngLat, Map, LngLatLike, Popup } from 'maplibre-gl'
import { getPopupHTML } from './popupUtils'
import { getColorByFacilityType } from '@lib/facilityTypeUtil'

export type MarkerClickHandlerType = (facility: MinimalRecordType) => void
export type ClusterClickHandlerType = (
  facilites: GeojsonFeatureType<MinimalRecordType>[]
) => void

export function getSpiderfier(config: {
  popup: Popup
  map: Map
  clickHandler: MarkerClickHandlerType
  texts: TextsMapType
}): MaplibreglSpiderifier<MinimalRecordType> {
  const { map, texts, clickHandler, popup } = config
  return new MaplibreglSpiderifier<MinimalRecordType>(map, {
    onClick(_e, markerObject) {
      clickHandler(markerObject.marker)
    },
    onMouseenter(_e, { marker, spiderParam }) {
      if (!map) return

      popup.setOffset(popupOffsetForSpiderLeg(spiderParam))

      popup
        .setLngLat([marker.longitude, marker.latitude])
        .setHTML(getPopupHTML([marker], texts))
        .addTo(map)
    },
    onMouseleave() {
      popup.setOffset(0)
      popup.remove()
    },
    initializeMarker({ elements, marker }) {
      elements.parent.style.setProperty(
        `--markerColor`,
        getColorByFacilityType(marker.type)
      )
    },
  })
}

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
  const container = document.querySelector<HTMLDivElement>(
    '.mapboxgl-canvas-container.mapboxgl-interactive'
  )
  if (container) container.style.cursor = cursor
}

export function normalizeLatLng(latOrLng?: number): number | undefined {
  if (typeof latOrLng !== 'number') return undefined
  return Math.round(latOrLng * 100000000) / 100000000
}
