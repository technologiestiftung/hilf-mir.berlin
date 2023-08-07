import { useEffect, FC, useRef, useCallback, useState } from 'react'
import { DataDrivenPropertyValueSpecification, Popup } from 'maplibre-gl'
import {
  createGeoJsonStructure,
  GeojsonFeatureType,
} from '@lib/createGeojsonStructure'
import { useRouter } from 'next/router'
import { useDebouncedCallback } from 'use-debounce'
import { URLViewportType } from '@lib/types/map'
import { MinimalRecordType } from '@lib/mapRecordToMinimum'
import { useUrlState } from '@lib/UrlStateContext'
import { MapTilerLogo } from '@components/MaptilerLogo'
import MaplibreglSpiderifier from '@lib/MaplibreglSpiderifier'
import { MOBILE_BREAKPOINT } from '@lib/hooks/useIsMobile'
import { useTexts } from '@lib/TextsContext'
import { getPopupHTML } from './popupUtils'
import {
  getFeaturesOnSameCoordsThanFirstOne,
  getSpiderfier,
  MarkerClickHandlerType,
  ClusterClickHandlerType,
  setCursor,
  zoomIn,
} from './mapUtil'
import { useEaseOnBackToMap } from '@lib/hooks/useEaseOnBackToMap'
import { useMapStylesLoaded } from '@lib/hooks/useMapStylesLoaded'
import { useOnMapFeatureMove } from '@lib/hooks/useOnMapFeatureMove'
import { useMapUserGeolocationMarker } from '@lib/hooks/useMapUserGeolocationMarker'
import { useInitialViewport } from '@lib/hooks/useInitialViewport'
import { useMapHighlightMarker } from '@lib/hooks/useMapHighlightMarker'
import { useMaplibreMap } from '@lib/hooks/useMaplibreMap'
import { useFiltersWithActiveProp } from '@lib/hooks/useFiltersWithActiveProp'
import {
  getActiveLabelGroups,
  isFaclilityActive,
} from '@lib/facilityFilterUtil'

interface MapType {
  markers?: MinimalRecordType[]
  activeTags?: number[] | null
  onMarkerClick?: (facilities: MinimalRecordType[]) => void
  onClickAnywhere?: () => void
  onMoveStart?: () => void
  /** An optional array of [longitude, latitude].
   * If provided, the map's center will be forced to this location.
   * Also, a highlighted marker will be drawn to the map.
   */
  highlightedCenter?: [longitude: number, latitude: number]
}

const easeInOutQuad = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1

export const transitionProps = {
  transitionDuration: 2000,
  transitionEasing: easeInOutQuad,
}

const MAP_CONFIG = {
  defaultZoom: 11,
  defaultLatitude: 52.520008,
  defaultLongitude: 13.404954,
  minZoom: 10,
  maxZoom: 19,
  zoomedInZoom: 17,
}

export const FacilitiesMap: FC<MapType> = ({
  markers,
  activeTags,
  onMarkerClick = () => undefined,
  onClickAnywhere = () => undefined,
  onMoveStart = () => undefined,
  highlightedCenter,
}) => {
  const { query, push } = useRouter()
  const texts = useTexts()
  const popup = useRef(
    new Popup({
      closeButton: false,
      closeOnClick: false,
      maxWidth: '320px',
    })
  )
  const hoveredStateIds = useRef<number[]>(null)
  const [isSpiderfied, setIsSpiderfied] = useState(false)
  const markerClickHandler = useRef<MarkerClickHandlerType>(() => undefined)
  const clusterClickHandler = useRef<ClusterClickHandlerType>(() => undefined)
  const spiderifier =
    useRef<InstanceType<typeof MaplibreglSpiderifier<MinimalRecordType>>>(null)
  const map = useMaplibreMap({ containerId: 'map', ...MAP_CONFIG })
  const labels = useFiltersWithActiveProp()

  const [urlState, setUrlState] = useUrlState()

  const id = typeof query.id === 'string' ? parseInt(query.id, 10) : undefined
  const currentFacilityIdPageIsSpiderfied =
    id && isSpiderfied && spiderifier.current?.expandedIds.includes(id)

  const highlightedMarkerViewport =
    highlightedCenter && !currentFacilityIdPageIsSpiderfied
      ? {
          latitude: highlightedCenter[1],
          longitude: highlightedCenter[0],
          zoom: MAP_CONFIG.zoomedInZoom,
        }
      : null
  const highlightedMarker = useMapHighlightMarker(
    map,
    highlightedMarkerViewport
  )

  useEaseOnBackToMap({
    map: map,
    zoomedInCoords: {
      latitude: highlightedMarker?._lngLat.lat,
      longitude: highlightedMarker?._lngLat.lng,
      zoom: MAP_CONFIG.zoomedInZoom,
    },
  })
  useInitialViewport(map)

  const mapStylesLoaded = useMapStylesLoaded(map)
  const [mapLayersLoaded, setMapLayersLoaded] = useState(false)

  useMapUserGeolocationMarker(map, MAP_CONFIG.zoomedInZoom, mapLayersLoaded)

  useOnMapFeatureMove(map, 'unclustered-point', (features) => {
    if (!map) return
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT
    if (isMobile) return

    const activeFeatures = features.filter(({ state }) => state.active)
    const allFeaturesInactive = activeFeatures.length === 0
    if (allFeaturesInactive) return

    setCursor('pointer')

    if (hoveredStateIds.current && hoveredStateIds.current?.length > 0) {
      hoveredStateIds.current?.forEach((id) => {
        map?.setFeatureState({ source: 'facilities', id }, { hover: false })
      })
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    hoveredStateIds.current = features.map(({ id }) => id as number)
    hoveredStateIds.current?.forEach((id) => {
      map?.setFeatureState({ source: 'facilities', id }, { hover: true })
    })

    if (
      activeFeatures.length >= 1 &&
      !spiderifier.current?.expandedIds.some((id) =>
        activeFeatures.find((marker) => marker.properties.id === id)
      )
    ) {
      const { longitude, latitude } = activeFeatures[0]
        .properties as MinimalRecordType
      popup.current
        .setLngLat([longitude, latitude])
        .setHTML(
          getPopupHTML(
            activeFeatures.map(({ properties }) => properties),
            texts
          )
        )
        .addTo(map)
    }
  })
  //
  // Debounced function that updates the URL query without triggering a rerender:
  const debouncedViewportChange = useDebouncedCallback(
    (viewport: URLViewportType): void => {
      setUrlState({
        ...urlState,
        ...viewport,
      })
    },
    1000
  )

  const updateFilteredFacilities = useCallback(() => {
    if (!map || !markers || !mapLayersLoaded) return
    const { activeTopcisLabels, activeTargetLabels } =
      getActiveLabelGroups(labels)
    const isFilteredByTopic = activeTopcisLabels.length > 0
    const isFilteredByTarget = activeTargetLabels.length > 0
    markers.forEach((marker) => {
      const active = isFaclilityActive({
        facilityLabels: marker.labels,
        activeTopcisLabels,
        activeTargetLabels,
        isFilteredByTopic,
        isFilteredByTarget,
      })
      map.setFeatureState(
        {
          source: 'facilities',
          id: marker.id,
        },
        { active }
      )
    })
  }, [map, markers, urlState.tags?.join('-'), mapLayersLoaded])

  useEffect(() => {
    if (!map) return
    markerClickHandler.current = (facility: MinimalRecordType): void => {
      if (!map || !facility) return
      void push({
        pathname: `/${facility.id}`,
        query: {
          ...urlState,
          latitude: facility.latitude,
          longitude: facility.longitude,
        },
      })
      map.easeTo({
        center: [facility.longitude, facility.latitude],
        zoom: MAP_CONFIG.zoomedInZoom,
      })
    }
  }, [push, urlState, map])

  const unspiderfy = useCallback((): void => {
    spiderifier.current?.expandedIds.forEach((id) => {
      map?.setFeatureState({ source: 'facilities', id }, { spidered: false })
    })
    spiderifier.current?.unspiderfy()
    popup.current.setOffset(0)
    popup.current.remove()
    setIsSpiderfied(false)
  }, [map])

  useEffect(() => {
    clusterClickHandler.current = (
      features?: GeojsonFeatureType<MinimalRecordType>[]
    ): void => {
      if (!features || !markers) return
      if (!map || !spiderifier.current) return

      const activeFeatures = features.filter(({ state }) => state.active)
      const firstFeature = activeFeatures[0]

      if (activeFeatures.length === 0 || !firstFeature.geometry.coordinates)
        return

      const featuresOnSameCoords =
        getFeaturesOnSameCoordsThanFirstOne(activeFeatures)

      const isClusterOfVeryNearButNotOverlappingPoints =
        featuresOnSameCoords.length !== activeFeatures.length
      if (isClusterOfVeryNearButNotOverlappingPoints) {
        zoomIn(
          map,
          featuresOnSameCoords[0].geometry.coordinates,
          2,
          MAP_CONFIG.zoomedInZoom
        )
        return
      }

      const clickedMarkerIds = featuresOnSameCoords.map((f) => f.properties.id)
      const clickedFacilities = markers.filter((marker) =>
        clickedMarkerIds.includes(marker.id)
      )

      map.easeTo({ center: firstFeature.geometry.coordinates })

      const isMobile = window.innerWidth <= MOBILE_BREAKPOINT
      if (isMobile) {
        onMarkerClick(clickedFacilities)
        return
      }
      if (clickedFacilities.length === 1) {
        markerClickHandler.current(clickedFacilities[0])
        return
      }
      popup.current?.remove.bind(popup.current)()
      spiderifier.current.spiderfy(
        firstFeature.geometry.coordinates,
        clickedFacilities,
        typeof query.id === 'string' ? query.id : undefined
      )
      spiderifier.current?.expandedIds.forEach((id) => {
        map?.setFeatureState({ source: 'facilities', id }, { spidered: true })
      })
      setIsSpiderfied(true)
    }
  }, [query.id, markers, map])

  useEffect(() => {
    if (!mapStylesLoaded || !markers || !map) return

    if (!map.getSource('facilities')) {
      map.addSource('facilities', {
        type: 'geojson',
        data: createGeoJsonStructure(markers),
        // We need to set an ID for making setFeatureState work.
        // The ID comes from the markers dataset whoch contains
        // a unique ID.
        promoteId: 'id',
      })
    }

    updateFilteredFacilities()

    const opacityGlCondition = [
      'case',
      [
        'all',
        ['boolean', ['feature-state', 'active'], false],
        ['!', ['boolean', ['feature-state', 'spidered'], false]],
      ],
      1,
      0,
    ] as DataDrivenPropertyValueSpecification<number>

    if (!map.getLayer('unclustered-point')) {
      map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'facilities',
        paint: {
          'circle-radius': 10,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#FAFAFF',
          'circle-color': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            '#999999',
            '#773666',
          ],
          'circle-stroke-opacity': opacityGlCondition,
          'circle-opacity': opacityGlCondition,
        },
      })
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    spiderifier.current = getSpiderfier({
      clickHandler: markerClickHandler.current,
      map: map,
      popup: popup.current,
      texts,
    })

    map.on('movestart', () => {
      onMoveStart()
    })

    map.on('moveend', (e) => {
      debouncedViewportChange({
        latitude: e.target.transform._center.lat,
        longitude: e.target.transform._center.lng,
        zoom: e.target.transform._zoom,
      })
    })

    map.on('click', function () {
      unspiderfy()
      onClickAnywhere()
    })

    map.on('click', 'unclustered-point', (e) => {
      const features = e.features as GeojsonFeatureType<MinimalRecordType>[]
      clusterClickHandler.current(features)
    })

    map.on('mousemove', 'unclustered-point', (e) => {
      if (!map) return
      if (!e.features || e.features.length === 0) return
    })

    map.on('mouseleave', 'unclustered-point', () => {
      if (!map) return

      setCursor('inherit')

      if (hoveredStateIds.current && hoveredStateIds.current.length > 0) {
        hoveredStateIds.current?.forEach((id) => {
          map?.setFeatureState({ source: 'facilities', id }, { hover: false })
        })
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        hoveredStateIds.current = null
      }

      popup.current.remove.bind(popup.current)()
    })

    setMapLayersLoaded(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapStylesLoaded])

  useEffect(() => {
    unspiderfy()
    updateFilteredFacilities()
  }, [activeTags, markers, updateFilteredFacilities, query.id])

  return (
    <>
      <div
        id="map"
        className="w-full h-full bg-[#F8F4F0]"
        aria-label="Kartenansicht der Einrichtungen"
      />
      <MapTilerLogo />
    </>
  )
}
