import classNames from '@lib/classNames'
import { FiltersWithActivePropType } from '@lib/hooks/useFiltersWithActiveProp'
import { useTexts } from '@lib/TextsContext'
import { FC, Fragment } from 'react'

interface FiltersTextListPropType {
  filters: FiltersWithActivePropType[]
  className?: string
  includesAllFilters?: boolean
}

export const FiltersTextList: FC<FiltersTextListPropType> = ({
  filters,
  className,
  includesAllFilters = false,
}) => {
  const texts = useTexts()
  const activeFilters = filters.filter(({ isActive }) => isActive)
  const filtersToRender = includesAllFilters ? activeFilters : filters
  const allTopicsLabel =
    filtersToRender.length === 0
      ? texts.allOtherFiltersLabel
      : texts.andAllOtherFiltersLabel
  return (
    <span className="font-bold">
      {filtersToRender.map((filter, idx) => (
        <Fragment key={filter.id}>
          <span
            className={classNames(className, filter.isActive && `text-red`)}
          >
            {filter.fields.text}
          </span>
          {idx !== filtersToRender.length - 1 && ', '}
        </Fragment>
      ))}
      {includesAllFilters && <span>&nbsp;{allTopicsLabel}</span>}
    </span>
  )
}
