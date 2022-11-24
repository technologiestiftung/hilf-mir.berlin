import {
  FiltersWithActivePropType,
  useFiltersWithActiveProp,
} from './useFiltersWithActiveProp'

interface UseRecordLabelsReturnType {
  allLabels: FiltersWithActivePropType[]
  topicsLabels: FiltersWithActivePropType[]
  targetAudienceLabels: FiltersWithActivePropType[]
}

export const useRecordLabels = (
  labels: number[]
): UseRecordLabelsReturnType => {
  const filters = useFiltersWithActiveProp()
  const recordLabels = labels
    .map((lId) => filters.find((l) => l.id === lId))
    .filter(Boolean) as FiltersWithActivePropType[]
  const topicsLabels = recordLabels.filter(
    ({ fields }) => fields.group2 !== 'zielpublikum'
  )
  const targetAudienceLabels = recordLabels.filter(
    ({ fields }) => fields.group2 === 'zielpublikum'
  )

  return {
    allLabels: recordLabels,
    topicsLabels,
    targetAudienceLabels,
  }
}
