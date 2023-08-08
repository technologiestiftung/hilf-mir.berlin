import classNames from '@lib/classNames'
import {
  urlSearchCategoriesToStateSearchCategories,
  stateSearchCategoriesToUrlSearchCategories,
  useUrlState,
} from '@lib/UrlStateContext'
import { useUserGeolocation } from '@lib/hooks/useUserGeolocation'
import { useTexts } from '@lib/TextsContext'
import { FC, useEffect, useMemo, useState } from 'react'
import { SwitchButton } from './SwitchButton'
import { useRouter } from 'next/router'
import { useFiltersWithActiveProp } from '@lib/hooks/useFiltersWithActiveProp'
import { FiltersTagsList } from './FiltersTagsList'
import {
  RecordsWithOnlyLabelsType,
  useFilteredFacilitiesCount,
} from '@lib/hooks/useFilteredFacilitiesCount'
import { Listbox } from './Listbox'
import { Button } from './Button'
import { Arrow } from './icons/Arrow'
import TextSearch from './TextSearch'

export const FiltersList: FC<{
  recordsWithOnlyLabels: RecordsWithOnlyLabelsType[]
  onSubmit?: () => void
}> = ({ recordsWithOnlyLabels, onSubmit = () => undefined }) => {
  const { push } = useRouter()
  const texts = useTexts()
  const labels = useFiltersWithActiveProp()
  const [urlState, updateUrlState] = useUrlState()

  const queryTagIds = useMemo(() => urlState.tags || [], [urlState.tags])

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

  const targetGroupIds = labels
    .filter((label) => label.fields.group2 === 'zielpublikum')
    .map((label) => label.id)

  const [activeTargetGroupId, setActiveTargetGroupId] = useState(
    queryTagIds.find((tagId) => {
      return targetGroupIds.includes(tagId)
    })
  )

  useEffect(() => {
    if (queryTagIds.length === 0) return

    const currentTargetGroupId = queryTagIds.find((tagId) =>
      targetGroupIds.includes(tagId)
    )
    if (currentTargetGroupId) {
      setActiveTargetGroupId(currentTargetGroupId)
    }
  }, [queryTagIds, targetGroupIds])

  const someGroupFiltersActive = labels
    .filter(({ fields }) => fields.group2 !== 'zielpublikum')
    .some(({ id }) => queryTagIds.find((f) => f === id))

  const updateFilters = (newTags: number[]): void => {
    updateUrlState({ tags: newTags })
  }

  const getSubmitText = (): string => {
    switch (filteredFacilitiesCount) {
      case recordsWithOnlyLabels.length:
        return texts.filtersButtonTextAllFilters
      case 1:
        return texts.filtersButtonTextFilteredSingular
      case 0:
        return texts.filtersButtonTextFilteredNoResults
      default:
        return texts.filtersButtonTextFilteredPlural.replace(
          '#number',
          `${filteredFacilitiesCount}`
        )
    }
  }

  return (
    <div className="pb-20 lg:pb-0">
      <div className="md:pt-10 flex flex-wrap gap-x-8 pb-6 md:pb-8">
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
                queryTagIds.filter((f) => {
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
      <p className="text-lg mb-6">{texts.optionalFurtherSearchIntroText}</p>
      <div className="flex gap-8 flex-wrap text-lg mb-6">
        <TextSearch
          onChange={({ text, categories }) =>
            updateUrlState({
              ...urlState,
              q: text,
              qCategories:
                stateSearchCategoriesToUrlSearchCategories(categories),
            })
          }
          text={urlState.q || ''}
          categories={urlSearchCategoriesToStateSearchCategories(
            urlState.qCategories
          )}
        />
        <div className="block w-full md:w-[324px] z-10">
          <Listbox
            label={texts.filtersSearchTargetLabel}
            options={targetGroups
              .sort((a, b) => {
                if (!a.fields.order) return 1
                if (!b.fields.order) return -1

                return a.fields.order - b.fields.order
              })
              .map((group) => {
                return {
                  value: group.id,
                  label: group.fields.text,
                }
              })}
            activeValue={activeTargetGroupId || null}
            nullSelectionLabel={texts.noTargetPreferenceButtonText}
            onChange={(selectedValue) => {
              const hasValidTargetGroup = !!selectedValue
              const targetGroupAlreadyInUrl = queryTagIds.some((tagId) => {
                return targetGroupIds.includes(tagId)
              })

              const tagsWithoutOldTargetGroup = queryTagIds.filter((tagId) => {
                return !targetGroupIds.includes(tagId)
              })

              switch (true) {
                case targetGroupAlreadyInUrl && hasValidTargetGroup:
                  updateFilters([
                    ...tagsWithoutOldTargetGroup,
                    selectedValue as number,
                  ])
                  break
                case targetGroupAlreadyInUrl && !hasValidTargetGroup:
                  updateFilters([...tagsWithoutOldTargetGroup])
                  setActiveTargetGroupId(undefined)
                  break
                case !targetGroupAlreadyInUrl && hasValidTargetGroup:
                  updateFilters([...queryTagIds, selectedValue as number])
                  break
                case !targetGroupAlreadyInUrl && !hasValidTargetGroup:
                  updateFilters([...queryTagIds])
                  setActiveTargetGroupId(undefined)
                  break
                default:
                  break
              }
            }}
            className="mb-12"
          />
        </div>
      </div>

      <SwitchButton
        value={useGeolocation}
        onToggle={setGeolocationUsage}
        disabled={geolocationIsForbidden}
        tooltip={geolocationIsForbidden ? texts.geolocationForbidden : ``}
      >
        {texts.filtersGeoSearchLabel}
      </SwitchButton>
      <Button
        scheme="primary"
        size="large"
        className={classNames('w-full md:w-max md:min-w-[324px]', 'group')}
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
        icon={
          <Arrow
            className={classNames(
              'transition-transform group-hover:translate-x-0.5 group-disabled:group-hover:translate-x-0'
            )}
          />
        }
        disabled={queryTagIds.length > 0 && filteredFacilitiesCount === 0}
        tooltip={
          queryTagIds.length > 0 &&
          filteredFacilitiesCount === 0 && (
            <span>{texts.filtersButtonTextFilteredNoResultsHint}</span>
          )
        }
      >
        {getSubmitText()}
      </Button>
    </div>
  )
}
