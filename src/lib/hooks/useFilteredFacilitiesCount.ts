import { TableRowType } from '@common/types/gristData'
import {
  getActiveLabelGroups,
  getFilterStatus,
  isFaclilityActive,
} from '@lib/facilityFilterUtil'
import { useEffect, useState } from 'react'
import { useFiltersWithActiveProp } from './useFiltersWithActiveProp'
import { useActiveIdsBySearchTerm } from './useActiveIdsBySearchTerm'

export type RecordsWithOnlyLabelsType = [
  id: TableRowType['id'],
  labels: TableRowType['fields']['Schlagworte']
]

export const useFilteredFacilitiesCount = (
  facilitiesWithOnlyLabels: RecordsWithOnlyLabelsType[]
): number => {
  const labels = useFiltersWithActiveProp()
  const concatenatedActiveLabelIds = labels
    .filter((label) => label.isActive)
    .map((label) => label.id)
    .join('-')
  const activeIdsBySearchTerm = useActiveIdsBySearchTerm()

  const [filteredFacilities, setFilteredFacilities] = useState(
    facilitiesWithOnlyLabels
  )

  useEffect(() => {
    const { activeTopcisLabels, activeTargetLabels } =
      getActiveLabelGroups(labels)

    const { isNotFilteredAtAll } = getFilterStatus({
      activeIdsBySearchTerm: activeIdsBySearchTerm.ids,
      activeTargetLabels,
      activeTopcisLabels,
    })

    if (isNotFilteredAtAll) {
      setFilteredFacilities([])
      return
    }

    const filteredFacilities = facilitiesWithOnlyLabels.filter(
      ([id, recordLabels]) =>
        isFaclilityActive({
          facilityLabels: recordLabels,
          facilityId: id,
          activeTargetLabels: activeTargetLabels,
          activeTopcisLabels: activeTopcisLabels,
          activeIdsBySearchTerm: activeIdsBySearchTerm.ids,
        })
    )

    setFilteredFacilities(filteredFacilities)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    concatenatedActiveLabelIds,
    facilitiesWithOnlyLabels,
    activeIdsBySearchTerm.key,
  ])

  return filteredFacilities.length
}
