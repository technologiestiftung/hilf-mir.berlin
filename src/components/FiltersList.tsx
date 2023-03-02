import { TableRowType } from '@common/types/gristData'
import classNames from '@lib/classNames'
import { useUrlState } from '@lib/UrlStateContext'
import { useUserGeolocation } from '@lib/hooks/useUserGeolocation'
import { useTexts } from '@lib/TextsContext'
import { FC, useEffect, useMemo, useState } from 'react'
import { SwitchButton } from './SwitchButton'
import { PrimaryButton } from './PrimaryButton'
import { useRouter } from 'next/router'
import { useFiltersWithActiveProp } from '@lib/hooks/useFiltersWithActiveProp'
import { FiltersTagsList } from './FiltersTagsList'
import { RadioGroup } from './RadioGroup'
import { useFilteredFacilitiesCount } from '@lib/hooks/useFilteredFacilitiesCount'

export const FiltersList: FC<{
  recordsWithOnlyLabels: TableRowType['fields']['Schlagworte'][]
  onSubmit?: () => void
}> = ({ recordsWithOnlyLabels, onSubmit = () => undefined }) => {
  const { push } = useRouter()
  const texts = useTexts()
  const labels = useFiltersWithActiveProp()
  const [urlState, updateUrlState] = useUrlState()

  const tags = useMemo(() => urlState.tags || [], [urlState.tags])

  const {
    latitude,
    longitude,
    useGeolocation,
    setGeolocationUsage,
    geolocationIsForbidden,
  } = useUserGeolocation()

  const filteredFacilitiesCount = useFilteredFacilitiesCount(
    recordsWithOnlyLabels
  )

  const group1 = labels.filter(({ fields }) => fields.group2 === 'gruppe-1')
  const group2 = labels.filter(({ fields }) => fields.group2 === 'gruppe-2')
  const group3 = labels.filter(({ fields }) => fields.group2 === 'gruppe-3')
  const targetGroups = labels.filter(
    ({ fields }) => fields.group2 === 'zielpublikum'
  )
  const someTargetFiltersActive = targetGroups.some((targetGroup) =>
    tags.find((f) => f === targetGroup.id)
  )

  const targetGroupIds = labels
    .filter((label) => label.fields.group2 === 'zielpublikum')
    .map((label) => label.id)

  const [activeTargetGroupId, setActiveTargetGroupId] = useState(
    tags.find((tag) => {
      return targetGroupIds.includes(tag)
    })
  )

  useEffect(() => {
    if (tags.length === 0) return

    const currentTargetGroupId = tags.find((tag) =>
      targetGroupIds.includes(tag)
    )
    if (currentTargetGroupId) {
      setActiveTargetGroupId(currentTargetGroupId)
    }
  }, [tags, targetGroupIds])

  const someGroupFiltersActive = labels
    .filter(({ fields }) => fields.group2 !== 'zielpublikum')
    .some(({ id }) => tags.find((f) => f === id))

  const updateFilters = (newTags: number[]): void => {
    updateUrlState({ tags: newTags })
  }

  return (
    <div className="pb-20 lg:pb-0">
      <div className="md:pt-10 flex flex-wrap gap-x-8 md:pb-8">
        <ul className="flex flex-wrap gap-2 place-content-start mb-5">
          <FiltersTagsList
            filters={[...group1, ...group2, ...group3]}
            onLabelClick={updateFilters}
          />
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
      <div className="grid">
        <div className="block">
          <RadioGroup
            className="mb-5"
            label={texts.filtersSearchTargetLabel}
            options={targetGroups.map((group) => {
              return {
                value: `${group.id}`,
                label: group.fields.text,
              }
            })}
            activeValue={activeTargetGroupId || ''}
            onChange={(selectedValue) => {
              const targetGroupAlreadyInUrl = tags.some((tag) => {
                return targetGroupIds.includes(tag)
              })

              if (targetGroupAlreadyInUrl) {
                const tagsWithoutOldTargetGroup = tags.filter((tag) => {
                  return !targetGroupIds.includes(tag)
                })
                updateFilters([
                  ...tagsWithoutOldTargetGroup,
                  Number(selectedValue),
                ])
              } else {
                updateFilters([...tags, Number(selectedValue)])
              }
            }}
          />
        </div>
        {someTargetFiltersActive && (
          <button
            onClick={() => {
              updateFilters(
                tags.filter((f) => {
                  return !targetGroupIds.includes(f)
                }) || []
              )
              setActiveTargetGroupId(undefined)
            }}
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
          className="w-max"
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
          disabled={tags.length > 0 && filteredFacilitiesCount === 0}
          tooltip={
            tags.length > 0 && filteredFacilitiesCount === 0
              ? texts.filtersButtonTextFilteredNoResultsHint
              : ''
          }
        >
          {(tags.length === 0 || tags.length === labels.length) &&
            texts.filtersButtonTextResults}
          {tags.length > 0 &&
            filteredFacilitiesCount >= 1 &&
            texts.filtersButtonTextResults}
          {tags.length > 0 &&
            filteredFacilitiesCount === 0 &&
            texts.filtersButtonTextFilteredNoResults}
        </PrimaryButton>
      </div>
    </div>
  )
}
