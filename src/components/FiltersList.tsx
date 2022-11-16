import { TableRowType } from '@common/types/gristData'
import classNames from '@lib/classNames'
import { getLabelRenderer } from '@lib/getLabelRenderer'
import { useUrlState } from '@lib/UrlStateContext'
import { useUserGeolocation } from '@lib/hooks/useUserGeolocation'
import { useLabels } from '@lib/LabelsContext'
import { useTexts } from '@lib/TextsContext'
import { FC } from 'react'
import { SwitchButton } from './SwitchButton'
import { PrimaryButton } from './PrimaryButton'
import { useRouter } from 'next/router'

export const FiltersList: FC<{
  recordsWithOnlyLabels: TableRowType['fields']['Schlagworte'][]
  onSubmit?: () => void
}> = ({ recordsWithOnlyLabels, onSubmit = () => undefined }) => {
  const { push } = useRouter()
  const texts = useTexts()
  const labels = useLabels()
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

  const filteredRecords = recordsWithOnlyLabels.filter((recordLabels) =>
    tags.every((tagId) => recordLabels.find((labelId) => labelId === tagId))
  )

  const updateFilters = (newTags: number[]): void => {
    updateUrlState({ tags: newTags })
  }

  const renderLabel = getLabelRenderer({
    activeFilters: tags,
    onLabelClick: updateFilters,
  })

  return (
    <div className="">
      <div className="md:pt-10 flex flex-wrap gap-x-8 md:pb-8">
        <ul className="flex flex-wrap gap-2 place-content-start mb-5">
          {group1.map(renderLabel)}
        </ul>
        <ul className="flex flex-wrap gap-2 place-content-start mb-5">
          {group2.map(renderLabel)}
        </ul>
        <ul className="flex flex-wrap gap-2 place-content-start mb-8">
          {group3.map(renderLabel)}
        </ul>
      </div>
      <div className="md:flex md:flex-wrap md:items-start md:gap-x-4">
        <h3 className={classNames(`font-bold text-lg mb-3 w-full`)}>
          {texts.filtersSearchTargetLabel}
        </h3>
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
            `py-1.5 border text-lg leading-6 pl-2 w-full md:w-auto mb-3`,
            !someTargetFiltersActive &&
              `bg-red border-red text-white font-bold pr-2.5`,
            someTargetFiltersActive && ` border-gray-20 pr-3`,
            `focus:outline-none focus:ring-2 focus:ring-red`,
            `focus:ring-offset-2 focus:ring-offset-white`
          )}
        >
          {texts.noTargetPreferenceButtonText}
        </button>
        <div
          className={classNames(
            `relative border-t border-gray-20 text-center uppercase text-lg`,
            `font-medium tracking-widest text-gray-40 leading-4 mb-8 mt-5`,
            `md:w-24`
          )}
        >
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white px-3">
            {texts.orLabel}
          </span>
        </div>
        <ul className="flex flex-wrap gap-2 mb-8">
          {targetGroups.map(renderLabel)}
        </ul>
        <SwitchButton
          value={useGeolocation}
          onToggle={setGeolocationUsage}
          disabled={geolocationIsForbidden}
          tooltip={geolocationIsForbidden ? texts.geolocationForbidden : ``}
        >
          {texts.filtersGeoSearchLabel}
        </SwitchButton>
        <PrimaryButton
          className="md:max-w-sm"
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
