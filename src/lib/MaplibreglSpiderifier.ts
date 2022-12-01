import { Marker, Map, LngLatLike, Offset } from 'maplibre-gl'

interface SpiderParamType {
  x: number
  y: number
  angle: number
  legLength: number
  index: number
}

interface MarkerElementsType {
  parent: HTMLDivElement
  line: HTMLDivElement
  marker: HTMLDivElement
}

interface MarkerObjectType<MarkerType> {
  marker: MarkerType
  elements: MarkerElementsType
  maplibreMarker: Marker
  spiderParam: SpiderParamType
}

interface UserOptionsType<MarkerType> {
  onClick: (e: Event, markerObject: MarkerObjectType<MarkerType>) => void
  onMouseenter: (e: Event, markerObject: MarkerObjectType<MarkerType>) => void
  onMouseleave: (e: Event, markerObject: MarkerObjectType<MarkerType>) => void
  markerWidth: number
  markerHeight: number
  initializeMarker: (markerObject: MarkerObjectType<MarkerType>) => void
}

const util = {
  each: eachFn,
  map: mapFn,
  mapTimes: mapTimesFn,
  eachTimes: eachTimesFn,
}

const twoPi = Math.PI * 2

const NULL_FUNCTION = (): void => undefined

export default class MaplibreglSpiderifier<MarkerType extends { id: number }> {
  map: Map
  options: {
    circleSpiralSwitchover: number
    circleFootSeparation: number
    spiralFootSeparation: number
    spiralLengthStart: number
    spiralLengthFactor: number
    onClick: UserOptionsType<MarkerType>['onClick']
    onMouseenter: UserOptionsType<MarkerType>['onMouseenter']
    onMouseleave: UserOptionsType<MarkerType>['onMouseleave']
    initializeMarker: UserOptionsType<MarkerType>['initializeMarker']
  }
  previousMarkerObjects: MarkerObjectType<MarkerType>[]
  expandedIds: number[]

  constructor(map: Map, userOptions: Partial<UserOptionsType<MarkerType>>) {
    this.map = map
    this.options = {
      circleSpiralSwitchover: 9, // show spiral instead of circle from this marker count upwards
      // 0 -> always spiral; Infinity -> always circle
      circleFootSeparation: 32, // related to circumference of circle
      spiralFootSeparation: 28, // related to size of spiral
      spiralLengthStart: 24,
      spiralLengthFactor: 4,
      onClick: NULL_FUNCTION,
      onMouseenter: NULL_FUNCTION,
      onMouseleave: NULL_FUNCTION,
      initializeMarker: NULL_FUNCTION,
      ...userOptions,
    }
    this.previousMarkerObjects = []
    this.expandedIds = []
  }

  public each(callback: (marker: MarkerObjectType<MarkerType>) => void): void {
    util.each<MarkerObjectType<MarkerType>>(
      this.previousMarkerObjects,
      callback
    )
  }

  public spiderfy(lngLat: LngLatLike, markers: MarkerType[]): void {
    const spiderParams = this.generateSpiderParams(markers.length)
    let markerObjects: MarkerObjectType<MarkerType>[] = []

    this.unspiderfy()
    this.expandedIds = markers.map(({ id }) => id)

    markerObjects = util.map<MarkerType, MarkerObjectType<MarkerType>>(
      markers,
      (marker, index) => {
        const spiderParam = spiderParams[index]
        const elements = this.createMarkerElements(spiderParam)

        const maplibreMarker = new Marker(elements.parent).setLngLat(lngLat)

        const markerObject: MarkerObjectType<MarkerType> = {
          marker,
          elements,
          maplibreMarker,
          spiderParam,
        }

        this.options.initializeMarker(markerObject)

        elements.marker.addEventListener('click', (e: Event) => {
          this.options.onClick(e, markerObject)
        })
        elements.marker.addEventListener('mouseenter', (e: Event) => {
          this.options.onMouseenter(e, markerObject)
        })
        elements.marker.addEventListener('mouseleave', (e: Event) => {
          this.options.onMouseleave(e, markerObject)
        })

        return markerObject
      }
    )

    util.each<MarkerObjectType<MarkerType>>(
      markerObjects.reverse(),
      (markerObject) => {
        markerObject.maplibreMarker.addTo(this.map)
      }
    )

    util.each(markerObjects.reverse(), (markerObject) => {
      markerObject.elements.parent.className = (
        markerObject.elements.parent.className || ''
      ).replace('initial', '')
    })

    this.previousMarkerObjects = markerObjects
  }

  public unspiderfy(): void {
    util.each<MarkerObjectType<MarkerType>>(
      this.previousMarkerObjects.reverse(),
      (oldMarkerObject) => oldMarkerObject.maplibreMarker.remove()
    )
    this.previousMarkerObjects = []
    this.expandedIds = []
  }

  private generateSpiderParams(count: number): SpiderParamType[] {
    if (count >= this.options.circleSpiralSwitchover) {
      return this.generateSpiralParams(count)
    } else {
      return this.generateCircleParams(count)
    }
  }

  private generateSpiralParams(count: number): SpiderParamType[] {
    let legLength = this.options.spiralLengthStart
    let angle = 0
    return util.mapTimes(count, (index) => {
      angle =
        angle + (this.options.spiralFootSeparation / legLength + index * 0.0005)
      const pt = {
        x: legLength * Math.cos(angle),
        y: legLength * Math.sin(angle),
        angle: angle,
        legLength: legLength,
        index: index,
      }
      legLength = legLength + (twoPi * this.options.spiralLengthFactor) / angle
      return pt
    })
  }

  private generateCircleParams(count: number): SpiderParamType[] {
    const circumference = this.options.circleFootSeparation * (2 + count)
    const legLength = circumference / twoPi // = radius from circumference
    const angleStep = twoPi / count

    return util.mapTimes<SpiderParamType>(count, (index) => {
      const angle = index * angleStep
      return {
        x: legLength * Math.cos(angle),
        y: legLength * Math.sin(angle),
        angle: angle,
        legLength,
        index: index,
      }
    })
  }

  private createMarkerElements(
    spiderParam: SpiderParamType
  ): MarkerElementsType {
    const parentElem = document.createElement('div')
    const markerElem = document.createElement('div')
    const lineElem = document.createElement('div')

    parentElem.className = 'spidered-marker'
    lineElem.className = 'line-div'
    markerElem.className = 'icon-div'

    parentElem.appendChild(lineElem)
    parentElem.appendChild(markerElem)

    parentElem.style.marginLeft = `${spiderParam.x}px`
    parentElem.style.marginTop = `${spiderParam.y}px`

    lineElem.style.height = `${spiderParam.legLength}px`
    lineElem.style.transform = `rotate(${spiderParam.angle - Math.PI / 2}rad)`

    return { parent: parentElem, line: lineElem, marker: markerElem }
  }
}

export function popupOffsetForSpiderLeg(
  spiderParam: SpiderParamType,
  offset = 0
): Offset {
  const pinOffsetX = spiderParam.x
  const pinOffsetY = spiderParam.y

  offset = offset || 0
  return {
    top: offsetVariant([0, offset], pinOffsetX, pinOffsetY),
    'top-left': offsetVariant([offset, offset], pinOffsetX, pinOffsetY),
    'top-right': offsetVariant([-offset, offset], pinOffsetX, pinOffsetY),
    bottom: offsetVariant([0, -offset], pinOffsetX, pinOffsetY),
    'bottom-left': offsetVariant([offset, -offset], pinOffsetX, pinOffsetY),
    'bottom-right': offsetVariant([-offset, -offset], pinOffsetX, pinOffsetY),
    left: offsetVariant([offset, -offset], pinOffsetX, pinOffsetY),
    right: offsetVariant([-offset, -offset], pinOffsetX, pinOffsetY),
  }
}

// Utility
function offsetVariant(
  offset: [number, number],
  variantX?: number,
  variantY?: number
): [number, number] {
  return [offset[0] + (variantX || 0), offset[1] + (variantY || 0)]
}

function eachFn<ItemType = unknown>(
  array: ItemType[],
  iterator: (item: ItemType, idx: number) => unknown
): void {
  let i = 0
  if (!array || !array.length) return
  for (i = 0; i < array.length; i++) {
    iterator(array[i], i)
  }
}

function eachTimesFn(count: number, iterator: (idx: number) => void): void {
  if (!count) return
  for (let i = 0; i < count; i++) {
    iterator(i)
  }
}

function mapFn<ItemType = unknown, ReturnedType = unknown>(
  array: ItemType[],
  iterator: (item: ItemType, idx: number) => ReturnedType
): ReturnedType[] {
  const result: ReturnedType[] = []
  eachFn(array, (item, i) => {
    result.push(iterator(item, i))
  })
  return result
}

function mapTimesFn<ReturnedType = unknown>(
  count: number,
  iterator: (idx: number) => ReturnedType
): ReturnedType[] {
  const result: ReturnedType[] = []
  eachTimesFn(count, (i) => {
    result.push(iterator(i))
  })
  return result
}
