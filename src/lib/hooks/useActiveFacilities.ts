import { GristLabelType } from '@common/types/gristData'
import {
  getActiveLabelGroups,
  isFacilityActive,
  mapIdsString,
} from '@lib/facilityFilterUtil'
import { MinimalRecordType } from '@lib/mapRecordToMinimum'
import { useMemo } from 'react'
import { useActiveIdsBySearchTerm } from './useActiveIdsBySearchTerm'

interface UseActiveFacilitiesPropsType {
  labels: GristLabelType[]
  joinedLabelIds: string
  facilities: MinimalRecordType[]
}

export function useActiveFacilities({
  labels,
  joinedLabelIds,
  facilities,
}: UseActiveFacilitiesPropsType): Map<number, MinimalRecordType> {
  const activeIdsBySearchTerm = useActiveIdsBySearchTerm()
  const { activeTopicsLabels, activeTargetLabels } = useMemo(
    () => getActiveLabelGroups(labels),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [joinedLabelIds]
  )
  const activeTopicsLabelsIds = mapIdsString(activeTopicsLabels, 'id')
  const activeTargetLabelsIds = mapIdsString(activeTargetLabels, 'id')
  const markerIds = mapIdsString(facilities || [], 'id')

  const activeFacilities = useMemo(() => {
    const activeFacilitiesMap = new Map<number, MinimalRecordType>()
    facilities.forEach((facility) => {
      const isActive = isFacilityActive({
        facilityId: facility.id,
        facilityLabels: facility.labels,
        activeTopicsLabels,
        activeTargetLabels,
        activeIdsBySearchTerm: activeIdsBySearchTerm.ids,
      })
      if (isActive) {
        activeFacilitiesMap.set(facility.id, facility)
      }
    })
    return activeFacilitiesMap
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    markerIds,
    activeTargetLabelsIds,
    activeTopicsLabelsIds,
    activeIdsBySearchTerm.key,
  ])

  return activeFacilities
}
