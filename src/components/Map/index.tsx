import { useEffect, FC, useRef, useState, useCallback } from 'react'
import maplibregl, {
  DataDrivenPropertyValueSpecification,
  LngLatLike,
  Map,
  Marker,
  Popup,
} from 'maplibre-gl'
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
  setCursor,
  zoomIn,
} from './mapUtil'
import { useEaseOnBackToMap } from '@lib/hooks/useEaseOnBackToMap'
import { useMapIsFullyLoaded } from '@lib/hooks/useMapIsFullyLoaded'
import { useOnMapFeatureMove } from '@lib/hooks/useOnMapFeatureMove'
import { useMapUserGeolocationMarker } from '@lib/hooks/useMapUserGeolocationMarker'
import { useInitialViewport } from '@lib/hooks/useInitialViewport'
import { useMapHighlightMarker } from '@lib/hooks/useMapHighlightMarker'
import { useMapSearchMarker } from '@lib/hooks/useMapSearchMarker'
import { useMaplibreMap } from '@lib/hooks/useMaplibreMap'

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
  searchCenter?: [longitude: number, latitude: number]
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
  searchCenter,
}) => {
  const { push } = useRouter()
  const texts = useTexts()
  const popup = useRef(
    new Popup({
      closeButton: false,
      closeOnClick: false,
      maxWidth: '320px',
    })
  )
  const hoveredStateIds = useRef<number[]>(null)
  const spideredFeatureIds = useRef<number[]>(null)
  const markerClickHandler = useRef<MarkerClickHandlerType>(() => undefined)
  const spiderifier =
    useRef<InstanceType<typeof MaplibreglSpiderifier<MinimalRecordType>>>(null)
  const map = useMaplibreMap({ containerId: 'map', ...MAP_CONFIG })

  const [urlState, setUrlState] = useUrlState()

  const highlightedSearchViewport = searchCenter
    ? {
        latitude: searchCenter[1],
        longitude: searchCenter[0],
        zoom: MAP_CONFIG.zoomedInZoom,
      }
    : null
  useMapSearchMarker(map, highlightedSearchViewport)
  const highlightedMarkerViewport = highlightedCenter
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

  const mapIsFullyLoaded = useMapIsFullyLoaded(map)

  useMapUserGeolocationMarker(map, MAP_CONFIG.zoomedInZoom, mapIsFullyLoaded)

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

  const updateFilteredFacilities = useCallback(
    (activeTags: number[]) => {
      if (!map || !mapIsFullyLoaded) return

      markers?.forEach((marker) => {
        map?.setFeatureState(
          {
            source: 'facilities',
            id: marker.id,
          },
          {
            active: activeTags?.every((tag) => marker.labels.includes(tag)),
          }
        )
      })
    },
    [map, markers, mapIsFullyLoaded]
  )

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
  }, [push, urlState])

  useEffect(() => {
    if (!markers || !map) return

    map.on('load', function () {
      if (!map) return

      map.addSource('facilities', {
        type: 'geojson',
        data: createGeoJsonStructure(markers),
        // We need to set an ID for making setFeatureState work.
        // The ID comes from the markers dataset whoch contains
        // a unique ID.
        promoteId: 'id',
      })

      updateFilteredFacilities(activeTags as number[])

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

      map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'facilities',
        paint: {
          'circle-radius': 10,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff',
          'circle-color': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            '#999999',
            '#E40422',
          ],
          'circle-stroke-opacity': opacityGlCondition,
          'circle-opacity': opacityGlCondition,
        },
      })

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

      function unspiderfy(): void {
        spiderifier.current?.unspiderfy()
        popup.current.setOffset(0)
        popup.current.remove()
        if (
          map &&
          spideredFeatureIds.current &&
          spideredFeatureIds.current.length > 0
        ) {
          spideredFeatureIds.current.forEach((id) => {
            map?.setFeatureState(
              { source: 'facilities', id },
              { spidered: false }
            )
          })
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          spideredFeatureIds.current = null
        }
      }

      map.on('click', function () {
        unspiderfy()
        onClickAnywhere()
      })

      map.on('click', 'unclustered-point', (e) => {
        if (!e.features) return
        if (!map || !spiderifier.current) return

        const features = e.features as GeojsonFeatureType<MinimalRecordType>[]
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

        const clickedMarkerIds = featuresOnSameCoords.map(
          (f) => f.properties.id
        )
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
          clickedFacilities
        )
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        spideredFeatureIds.current = activeFeatures.map(
          ({ properties }) => properties.id
        )
        spideredFeatureIds.current.forEach((id) => {
          map?.setFeatureState({ source: 'facilities', id }, { spidered: true })
        })
      })
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers])

  useEffect(
    () => updateFilteredFacilities(activeTags as number[]),
    [activeTags, markers, updateFilteredFacilities]
  )

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
