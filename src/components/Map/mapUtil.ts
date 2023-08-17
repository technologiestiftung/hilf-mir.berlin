import { GeojsonFeatureType } from '@lib/createGeojsonStructure'
import MaplibreglSpiderifier, {
  popupOffsetForSpiderLeg,
} from '@lib/MaplibreglSpiderifier'
import { MinimalRecordType } from '@lib/mapRecordToMinimum'
import { TextsMapType } from '@lib/TextsContext'
import { LngLat, Map as MaplibreMap, LngLatLike, Popup } from 'maplibre-gl'
import { getPopupHTML } from './popupUtils'
import { getColorByFacilityType } from '@lib/facilityTypeUtil'

export type MarkerClickHandlerType = (facility: MinimalRecordType) => void
export type ClusterClickHandlerType = (
  facilites: GeojsonFeatureType<MinimalRecordType>[]
) => void

export function getSpiderfier(config: {
  popup: Popup
  map: MaplibreMap
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

export function getFacilitiesOnSameCoords(
  facility: {
    longitude: number
    latitude: number
  },
  facilities: Map<number, MinimalRecordType>
): MinimalRecordType[] {
  const pointACoords = [facility.longitude, facility.latitude] as [
    number,
    number
  ]
  const pointA = new LngLat(...pointACoords)
  const features = Array.from(facilities.values())
  return features.filter((feat) => {
    const coordinates = [feat.longitude, feat.latitude] as [number, number]
    const pointB = new LngLat(...coordinates)
    const dist = pointA.distanceTo(pointB)
    const distance = dist
    return distance < 1
  })
}

export type ClusterType = {
  id: string
  facilities: MinimalRecordType[]
  includedTypes: MinimalRecordType['type'][]
}
type ClusterMapType = Map<string, ClusterType>
export function getClusteredFacilities(
  facilities: Map<number, MinimalRecordType>
): ClusterType[] {
  const clusters: ClusterMapType = new Map()
  const alreadySearchedIds: Set<MinimalRecordType['id']> = new Set()

  facilities.forEach((facility) => {
    if (alreadySearchedIds.has(facility.id)) return
    const facilitiesOnSameCoords = getFacilitiesOnSameCoords(
      facility,
      facilities
    )
    if (facilitiesOnSameCoords.length > 1) {
      clusters.set(`${facility.id}`, {
        id: `${facility.id}`,
        facilities: facilitiesOnSameCoords,
        includedTypes: [
          ...facilitiesOnSameCoords
            .reduce(
              (acc, curr) => acc.add(curr.type),
              new Set<MinimalRecordType['type']>()
            )
            .values(),
        ].sort(),
      })
    }
    facilitiesOnSameCoords.forEach((f) => alreadySearchedIds.add(f.id))
  })

  return [...clusters.values()]
}

export function zoomIn(
  map: MaplibreMap,
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
