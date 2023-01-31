import { TableRowType } from '@common/types/gristData'
import classNames from '@lib/classNames'
import { useUrlState } from '@lib/UrlStateContext'
import { useUserGeolocation } from '@lib/hooks/useUserGeolocation'
import { useTexts } from '@lib/TextsContext'
import { FC } from 'react'
import { SwitchButton } from './SwitchButton'
import { PrimaryButton } from './PrimaryButton'
import { useRouter } from 'next/router'
import { useFiltersWithActiveProp } from '@lib/hooks/useFiltersWithActiveProp'
import { FiltersTagsList } from './FiltersTagsList'

export const FiltersList: FC<{
  recordsWithOnlyLabels: TableRowType['fields']['Schlagworte'][]
  onSubmit?: () => void
}> = ({ recordsWithOnlyLabels, onSubmit = () => undefined }) => {
  const { push } = useRouter()
  const texts = useTexts()
  const labels = useFiltersWithActiveProp()
  const [urlState, updateUrlState] = useUrlState()
  const tags = urlState.tags || []
  const {
    latitude,
    longitude,
    useGeolocation,
    setGeolocationUsage,
    geolocationIsForbidden,
  } = useUserGeolocation()

  const group1 = labels.filter(({ fields }) => fields.group2 === 'gruppe-1')
  const group2 = labels.filter(({ fields }) => fields.group2 === 'gruppe-2')
  const group3 = labels.filter(({ fields }) => fields.group2 === 'gruppe-3')
  const targetGroups = labels.filter(
    ({ fields }) => fields.group2 === 'zielpublikum'
  )
  const someTargetFiltersActive = targetGroups.some((targetGroup) =>
    tags.find((f) => f === targetGroup.id)
  )

  const someGroupFiltersActive = labels
    .filter(({ fields }) => fields.group2 !== 'zielpublikum')
    .some(({ id }) => tags.find((f) => f === id))

  const filteredRecords = recordsWithOnlyLabels.filter((recordLabels) =>
    tags.some((tagId) => recordLabels.find((labelId) => labelId === tagId))
  )

  const updateFilters = (newTags: number[]): void => {
    updateUrlState({ tags: newTags })
  }

  return (
    <div className="">
      <div className="md:pt-10 flex flex-wrap gap-x-8 md:pb-8">
        <ul className="flex flex-wrap gap-2 place-content-start mb-5">
          <FiltersTagsList filters={group1} onLabelClick={updateFilters} />
        </ul>
        <ul className="flex flex-wrap gap-2 place-content-start mb-5">
          <FiltersTagsList filters={group2} onLabelClick={updateFilters} />
        </ul>
        <ul className="flex flex-wrap gap-2 place-content-start mb-5">
          <FiltersTagsList filters={group3} onLabelClick={updateFilters} />
        </ul>
        {someGroupFiltersActive && (
          <button
            onClick={() =>
              updateFilters(
                tags.filter((f) => {
                  const label = labels.find(({ id }) => id === f)
                  return label?.fields.group2 === `zielpublikum`
                }) || []
              )
            }
            className={classNames(
              `text-lg leading-6 text-left font-normal mb-8`,
              `focus:outline-none focus:ring-2 focus:ring-primary`,
              `focus:ring-offset-2 focus:ring-offset-white`,
              `underline text-gray-80 hover-primary transition-colors`
            )}
          >
            {texts.reset}
          </button>
        )}
      </div>
      <div className="md:flex md:flex-wrap md:items-start md:gap-x-4">
        <h3
          className={classNames(
            `font-headline font-bold text-xl mb-3 w-full flex justify-between`
          )}
        >
          {texts.filtersSearchTargetLabel}
        </h3>
        <ul className="flex flex-wrap gap-2 mb-5">
          <FiltersTagsList
            filters={targetGroups}
            onLabelClick={updateFilters}
          />
        </ul>
        {someTargetFiltersActive && (
          <button
            onClick={() =>
              updateFilters(
                tags.filter((f) => {
                  const label = labels.find(({ id }) => id === f)
                  return label?.fields.group2 !== `zielpublikum`
                }) || []
              )
            }
            className={classNames(
              `text-lg leading-6 text-left font-normal mb-8`,
              `focus:outline-none focus:ring-2 focus:ring-primary`,
              `focus:ring-offset-2 focus:ring-offset-white`,
              `underline text-gray-80 hover-primary transition-colors`
            )}
          >
            {texts.reset}
          </button>
        )}
        <SwitchButton
          value={useGeolocation}
          onToggle={setGeolocationUsage}
          disabled={geolocationIsForbidden}
          tooltip={geolocationIsForbidden ? texts.geolocationForbidden : ``}
        >
          {texts.filtersGeoSearchLabel}
        </SwitchButton>
        <PrimaryButton
          className="w-auto"
          onClick={() => {
            onSubmit()
            void push({
              pathname: '/map',
              query: {
                ...urlState,
                ...(latitude && longitude ? { latitude, longitude } : {}),
              },
            })
          }}
          disabled={tags.length > 0 && filteredRecords.length === 0}
          tooltip={
            tags.length > 0 && filteredRecords.length === 0
              ? texts.filtersButtonTextFilteredNoResultsHint
              : ''
          }
        >
          {(tags.length === 0 || tags.length === labels.length) &&
            texts.filtersButtonTextAllFilters}
          {tags.length > 0 &&
            filteredRecords.length === 1 &&
            texts.filtersButtonTextFilteredSingular}
          {tags.length > 0 &&
            filteredRecords.length > 1 &&
            texts.filtersButtonTextFilteredPlural.replace(
              '#number',
              `${filteredRecords.length}`
            )}
          {tags.length > 0 &&
            filteredRecords.length === 0 &&
            texts.filtersButtonTextFilteredNoResults}
        </PrimaryButton>
      </div>
    </div>
  )
}
