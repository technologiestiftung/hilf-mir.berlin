import {
  FiltersWithActivePropType,
  useFiltersWithActiveProp,
} from '@lib/hooks/useFiltersWithActiveProp'
import { useRecordLabels } from '@lib/hooks/useRecordLabels'
import { useTexts } from '@lib/TextsContext'
import { FC } from 'react'
import { FiltersTextList } from './FiltersTextList'

interface FacilityLabelsType {
  labels: number[]
}

const isGroup = (filter: FiltersWithActivePropType): boolean =>
  filter.fields.group2 !== 'zielpublikum'
const isTarget = (filter: FiltersWithActivePropType): boolean =>
  filter.fields.group2 === 'zielpublikum'

export const FacilityLabels: FC<FacilityLabelsType> = ({ labels }) => {
  const texts = useTexts()
  const { topicsLabels, targetAudienceLabels } = useRecordLabels(labels)

  const allFilters = useFiltersWithActiveProp()
  const tagsFilters = allFilters.filter(isGroup)
  const targetFilters = allFilters.filter(isTarget)
  const tagsIncludesAllFilters = tagsFilters.every(({ id }) =>
    topicsLabels.find((filter) => filter.id === id)
  )
  const targetIncludesAllFilters = targetFilters.every(({ id }) =>
    targetAudienceLabels.find((filter) => filter.id === id)
  )

  return (
    <>
      {topicsLabels.length > 0 && (
        <div className="px-5 mt-5 mb-3 text-sm leading-4">
          {texts.filtersTagsLabelOnCard}:{' '}
          <FiltersTextList
            filters={topicsLabels}
            includesAllFilters={tagsIncludesAllFilters}
          />
        </div>
      )}
      {targetAudienceLabels.length > 0 && (
        <div className="px-5 text-sm leading-4">
          {texts.filtersSearchTargetLabelOnCard}:{' '}
          <FiltersTextList
            filters={targetAudienceLabels}
            includesAllFilters={targetIncludesAllFilters}
          />
        </div>
      )}
    </>
  )
}
