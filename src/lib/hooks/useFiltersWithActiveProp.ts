import { GristLabelType } from '@common/types/gristData'
import { useLabels } from '@lib/LabelsContext'
import { useUrlState } from '@lib/UrlStateContext'

export interface FiltersWithActivePropType extends GristLabelType {
  isActive: boolean
}

export const useFiltersWithActiveProp = (): FiltersWithActivePropType[] => {
  const labelsWithData = useLabels()
  const [urlState] = useUrlState()
  const activeFilters = urlState.tags || []
  return labelsWithData.map((label) => ({
    ...label,
    isActive: !!activeFilters.find((fId) => fId === label.id),
  }))
}
