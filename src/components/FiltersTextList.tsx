import classNames from '@lib/classNames'
import {
  FiltersWithActivePropType,
  useFiltersWithActiveProp,
} from '@lib/hooks/useFiltersWithActiveProp'
import { useTexts } from '@lib/TextsContext'
import { FC, Fragment } from 'react'

interface FiltersTextListPropType {
  filters: FiltersWithActivePropType[]
  className?: string
}

export const FiltersTextList: FC<FiltersTextListPropType> = ({
  filters,
  className,
}) => {
  const texts = useTexts()
  const allFilters = useFiltersWithActiveProp()
  const tagsFilters = allFilters.filter(
    (filter) => filter.fields.group2 !== 'zielpublikum'
  )
  const includesAllFilters = filters.length === tagsFilters.length
  const activeFilters = filters.filter(({ isActive }) => isActive)
  const filtersToRender = includesAllFilters ? activeFilters : filters
  const allTopicsLabel =
    filtersToRender.length === 0
      ? texts.allOtherFiltersLabel
      : texts.andAllOtherFiltersLabel
  return (
    <>
      {filtersToRender.map((filter, idx) => (
        <Fragment key={filter.id}>
          <span
            className={classNames(
              className,
              filter.isActive ? `text-red` : `text-black`
            )}
          >
            {filter.fields.text}
          </span>
          {idx !== filtersToRender.length - 1 && ', '}
        </Fragment>
      ))}
      {includesAllFilters && <span>&nbsp;{allTopicsLabel}</span>}
    </>
  )
}
