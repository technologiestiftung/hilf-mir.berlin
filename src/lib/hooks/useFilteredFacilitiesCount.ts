import { TableRowType } from '@common/types/gristData'
import {
  getActiveLabelGroups,
  isFaclilityActive,
} from '@lib/facilityFilterUtil'
import { useEffect, useState } from 'react'
import { useFiltersWithActiveProp } from './useFiltersWithActiveProp'

export const useFilteredFacilitiesCount = (
  facilitiesWithOnlyLabels: TableRowType['fields']['Schlagworte'][]
): number => {
  const labels = useFiltersWithActiveProp()

  const [filteredFacilities, setFilteredFacilities] = useState(
    facilitiesWithOnlyLabels
  )

  useEffect(() => {
    const { activeTopcisLabels, activeTargetLabels } =
      getActiveLabelGroups(labels)

    const isFilteredByTopic = activeTopcisLabels.length > 0
    const isFilteredByTarget = activeTargetLabels.length > 0

    const filteredFacilities = facilitiesWithOnlyLabels.filter(
      (recordLabels) => {
        if (!isFilteredByTopic && !isFilteredByTarget) return true
        return isFaclilityActive({
          isFilteredByTopic,
          isFilteredByTarget,
          facilityLabels: recordLabels,
          activeTargetLabels: activeTargetLabels,
          activeTopcisLabels: activeTopcisLabels,
        })
      }
    )
    setFilteredFacilities(filteredFacilities)
  }, [labels.join('-'), facilitiesWithOnlyLabels])

  return filteredFacilities.length
}
