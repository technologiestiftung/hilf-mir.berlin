import { GristLabelType, TableRowType } from '@common/types/gristData'
import classNames from '@lib/classNames'
import { useUserGeolocation } from '@lib/hooks/useUserGeolocation'
import { useTexts } from '@lib/TextsContext'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'
import { PrimaryButton } from './PrimaryButton'
import { SwitchButton } from './SwitchButton'

export const FiltersList: FC<{
  recordsWithOnlyLabels: TableRowType['fields']['Schlagworte'][]
  labels: GristLabelType[]
}> = ({ recordsWithOnlyLabels, labels }) => {
  const texts = useTexts()
  const [activeFilters, setActiveFilters] = useState<GristLabelType[]>([])
  const { push, query } = useRouter()
  const {
    useGeolocation,
    setGeolocationUsage,
    geolocationIsForbidden,
    latitude,
    longitude,
  } = useUserGeolocation()
  const filteredRecords = recordsWithOnlyLabels.filter((r) =>
    activeFilters.every((f) => r.find((id) => id === f.id))
  )
  const group1 = labels.filter(({ fields }) => fields.group === 'gruppe-1')
  const group2 = labels.filter(({ fields }) => fields.group === 'gruppe-2')
  const group3 = labels.filter(({ fields }) => fields.group === 'gruppe-3')
  const targetAudience = labels.filter(
    ({ fields }) => fields.group === 'zielpublikum'
  )
  const someTargetFiltersActive = targetAudience.some((f) =>
    activeFilters.find((l) => l.fields.key === f.fields.key)
  )

  const renderLabels = (label: GristLabelType): JSX.Element => {
    const isActive = !!activeFilters.find(
      (activeFilter) => activeFilter.fields.key === label.fields.key
    )
    const newFilters = isActive
      ? activeFilters.filter((f) => f.fields.key !== label.fields.key)
      : [...activeFilters, label]
    return (
      <li key={label.fields.key} className="inline-block">
        <button
          onClick={() => setActiveFilters(newFilters)}
          className={classNames(
            `py-1.5 border text-lg flex gap-2 text-left leading-6 pl-2 group`,
            isActive && `bg-red border-red text-white font-bold pr-2.5`,
            !isActive && ` border-gray-20 pr-3`,
            `focus:outline-none focus:ring-2 focus:ring-red`,
            `focus:ring-offset-2 focus:ring-offset-white`
          )}
        >
          {label.fields.icon && (
            <img
              src={`/images/icons/filters/${label.fields.icon}.svg`}
              alt={`Icon for "${label.fields.text}" label`}
              style={{
                filter: isActive ? `invert(1)` : ``,
              }}
            />
          )}
          <span>{label.fields.text}</span>
        </button>
      </li>
    )
  }
  return (
    <div className="">
      <div className="md:pt-10 md:grid md:grid-cols-3 md:gap-x-8 md:pb-8">
        <ul className="flex flex-wrap gap-2 place-content-start mb-5">
          {group1.map(renderLabels)}
        </ul>
        <ul className="flex flex-wrap gap-2 place-content-start mb-5">
          {group2.map(renderLabels)}
        </ul>
        <ul className="flex flex-wrap gap-2 place-content-start mb-8">
          {group3.map(renderLabels)}
        </ul>
      </div>
      <div className="md:flex md:flex-wrap md:items-start md:gap-x-4">
        <h3 className={classNames(`font-bold text-lg mb-3 w-full`)}>
          {texts.filtersSearchTargetLabel}
        </h3>
        <button
          onClick={() =>
            setActiveFilters(
              activeFilters.filter((f) => f.fields.group !== 'zielpublikum')
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
          {targetAudience.map(renderLabels)}
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
          onClick={() =>
            void push({
              pathname: `/map`,
              query: {
                ...query,
                ...(latitude && longitude ? { latitude, longitude } : {}),
              },
            })
          }
          disabled={activeFilters.length > 0 && filteredRecords.length === 0}
          tooltip={
            activeFilters.length > 0 && filteredRecords.length === 0
              ? texts.filtersButtonTextFilteredNoResultsHint
              : ''
          }
        >
          {(activeFilters.length === 0 ||
            activeFilters.length === labels.length) &&
            texts.filtersButtonTextAllFilters}
          {activeFilters.length > 0 &&
            filteredRecords.length === 1 &&
            texts.filtersButtonTextFilteredSingular}
          {activeFilters.length > 0 &&
            filteredRecords.length > 1 &&
            texts.filtersButtonTextFilteredPlural.replace(
              '#number',
              `${filteredRecords.length}`
            )}
          {activeFilters.length > 0 &&
            filteredRecords.length === 0 &&
            texts.filtersButtonTextFilteredNoResults}
        </PrimaryButton>
        <div className="hidden md:block w-full mt-6">
          <a
            href={texts.moreOffersKVBLinkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={classNames(
              `underline transition-colors hover:text-red pt-3`,
              `focus:outline-none focus:ring-2 focus:ring-red`,
              `focus:ring-offset-2 focus:ring-offset-white`
            )}
          >
            {texts.moreOffersKVBLinkText}
          </a>
        </div>
      </div>
    </div>
  )
}
