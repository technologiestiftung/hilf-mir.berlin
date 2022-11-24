import { FiltersWithActivePropType } from '@lib/hooks/useFiltersWithActiveProp'
import { useUrlState } from '@lib/UrlStateContext'
import { FC } from 'react'
import { Label } from './Label'

interface FiltersTagsListPropType {
  onLabelClick?: (activeFilters: number[]) => void
  filters: FiltersWithActivePropType[]
  className?: string
}

export const FiltersTagsList: FC<FiltersTagsListPropType> = ({
  onLabelClick,
  filters,
  className,
}) => {
  const [urlState] = useUrlState()
  const activeFilters = urlState.tags || []
  const clickHandler = onLabelClick || (() => undefined)
  return (
    <>
      {filters.map((filter) => (
        <Label
          label={filter}
          key={filter.id}
          isActive={filter.isActive}
          onClick={() =>
            clickHandler(
              filter.isActive
                ? activeFilters.filter((f) => f !== filter.id)
                : [...activeFilters, filter.id]
            )
          }
          className={className}
          isInteractive={!!onLabelClick}
        />
      ))}
    </>
  )
}
