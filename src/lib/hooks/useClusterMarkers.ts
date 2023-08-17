import { ClusterType, getClusteredFacilities } from '@components/Map/mapUtil'
import { useCallback, useEffect, useRef } from 'react'
import { Map as MaptilerMap, Marker } from 'maplibre-gl'
import { MinimalRecordType } from '@lib/mapRecordToMinimum'
import { getColorByFacilityType } from '@lib/facilityTypeUtil'

interface UseClusterMarkersProps {
  map: MaptilerMap | null
  activeFacilitiesMap?: Map<number, MinimalRecordType>
}

function useClusterMarkers({
  map,
  activeFacilitiesMap,
}: UseClusterMarkersProps): {
  showClusters: () => void
  hideCluster: (facilityId: MinimalRecordType['id']) => void
} {
  const clusterMarkers = useRef<Map<string, [Marker, ClusterType]>>(new Map())
  const isReady = !!map && activeFacilitiesMap instanceof Map

  useEffect(() => {
    if (!isReady) return

    clusterMarkers.current.forEach(([marker]) => {
      marker.remove()
    })
    clusterMarkers.current.clear()

    const clusters = getClusteredFacilities(activeFacilitiesMap)
    clusters.forEach((cluster) => {
      const firstFacility = cluster.facilities[0]
      const { longitude, latitude } = firstFacility
      const marker = new Marker(getClusterHTMLElement(cluster))
      marker.setLngLat([longitude, latitude])
      marker.addTo(map)
      clusterMarkers.current.set(cluster.id, [marker, cluster])
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, activeFacilitiesMap])

  const getClusterByFacilityId = useCallback(
    (facilityId: number): [Marker, ClusterType] | undefined => {
      let cluster = clusterMarkers.current.get(facilityId.toString())
      if (cluster) return cluster
      cluster = Array.from(clusterMarkers.current.values()).find(
        ([, cluster]) => cluster.facilities.find((f) => f.id === facilityId)
      )
      return cluster
    },
    []
  )

  const showClusters = useCallback((): void => {
    clusterMarkers.current.forEach(([marker]) => {
      marker.getElement().classList.remove('opacity-0')
    })
  }, [])

  const hideCluster = useCallback(
    (facilityId: MinimalRecordType['id']): void => {
      const cluster = getClusterByFacilityId(facilityId)
      if (!cluster) return
      const [marker] = cluster
      marker.getElement().classList.add('opacity-0')
    },
    [getClusterByFacilityId]
  )

  return { showClusters, hideCluster }
}

function getClusterHTMLElement(cluster: ClusterType): HTMLButtonElement {
  const parentButton = document.createElement('button')
  parentButton.classList.add(
    `w-[34px]`,
    `h-[34px]`,
    `rounded-full`,
    `-translate-x-1/2`,
    `-translate-y-1/2`,
    `pointer-events-none`,
    `transition-opacity`
  )
  parentButton.innerHTML = getClusterSVG(cluster)
  return parentButton
}

function getClusterSVG(cluster: ClusterType): string {
  const { includedTypes } = cluster
  const svgContent =
    [
      [
        'M17 1.5c4.28 0 8.155 1.735 10.96 4.54A15.451 15.451 0 0 1 32.5 17c0 4.28-1.735 8.155-4.54 10.96A15.451 15.451 0 0 1 17 32.5c-4.28 0-8.155-1.735-10.96-4.54A15.451 15.451 0 0 1 1.5 17c0-4.28 1.735-8.155 4.54-10.96A15.451 15.451 0 0 1 17 1.5Z',
      ],
      [
        'M17.315 32.997C26.006 32.829 33 25.731 33 17c0-8.837-7.163-16-16-16v32l.315-.003Z',
        'M16.685 32.997C7.994 32.829 1 25.731 1 17 1 8.163 8.163 1 17 1v32l-.315-.003Z',
      ],
      [
        'M17 1c8.837 0 16 7.163 16 16a17.15 17.15 0 0 1-2.05 8.17l-13.931-8.069L17 1Z',
        'M30.95 25.17c-4.42 7.653-14.205 10.275-21.857 5.856-2.571-1.484-4.49-3.643-5.933-5.985l13.859-7.94 13.93 8.07Z',
        'M17 1C8.163 1 1 8.163 1 17c0 2.969.911 5.71 2.217 8.131l13.802-8.03L17 1Z',
      ],
      [
        'M33 17c0 8.731-6.994 15.83-15.685 15.997L17 33V17h16Z',
        'M33 17c0-8.731-6.994-15.83-15.685-15.997L17 1v16h16Z',
        'M17 17v16l-.315-.003C8.1 32.831 1.171 25.903 1.003 17.319L1 17h16Z',
        'M17 17V1l-.315.003C8.1 1.169 1.171 8.097 1.003 16.681L1 17h16Z',
      ],
      [
        'm17.002 17 9.403 12.944.382-.286.128-.1A15.93 15.93 0 0 1 17 33a15.927 15.927 0 0 1-9.298-2.978l-.107-.078L16.998 17h.004Z',
        'M17 17 7.594 29.943l-.253-.187c-5.567-4.212-7.768-11.44-5.557-17.72l15.032 4.83L17 17Z',
        'm17 17 9.405 12.944.253-.187c5.567-4.212 7.768-11.44 5.557-17.72l-15.032 4.83L17 17Z',
        'M17 17V1l.315.003c6.98.135 13.01 4.69 14.912 11.07L17.226 17H17Z',
        'M17 17V1l-.315.003c-6.98.135-13.01 4.69-14.912 11.07L16.774 17H17Z',
      ],
    ][includedTypes.length - 1] || []
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34">
      <g fill="none" fill-rule="evenodd">
        ${svgContent
          .map(
            (_, index) => `
          <path
            fill="${getColorByFacilityType(includedTypes[index])}"
            stroke="#FFF"
            d="${svgContent[index]}"
          />
        `
          )
          .join('')}
        <circle cx="17" cy="17" r="4" fill="#FFF"/>
      </g>
    </svg>
  `
}

export default useClusterMarkers
