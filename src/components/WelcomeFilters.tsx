import { useTexts } from '@lib/TextsContext'
import { FC, useState } from 'react'
import { PrimaryButton } from '@components/PrimaryButton'
import { useRouter } from 'next/router'
import { BackButton } from './BackButton'
import classNames from '@lib/classNames'
import { GristLabelType, TableRowType } from '@common/types/gristData'

export const WelcomeFilters: FC<{
  onGoBack: () => void
  labels: GristLabelType[]
  records: TableRowType[]
}> = ({ onGoBack, labels, records }) => {
  const texts = useTexts()
  const [activeFilters, setActiveFilters] = useState<GristLabelType[]>([])
  const { push } = useRouter()
  const filteredRecords = records.filter((r) =>
    activeFilters.find((f) => r.fields.Schlagworte.find((id) => id === f.id))
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
            !isActive && ` border-gray-20 pr-3`
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
    <div className="h-screen flex flex-col overflow-y-auto">
      <BackButton onClick={onGoBack} />
      <div className="px-5 md:px-8 pb-8">
        <h1 className="pt-8 pb-4">{texts.welcomeFiltersHeadline}</h1>
        <p className="text-lg pb-6 leading-snug">{texts.welcomeFiltersText}</p>
        <ul className="flex flex-wrap gap-2 mb-5">
          {group1.map(renderLabels)}
        </ul>
        <ul className="flex flex-wrap gap-2 mb-5">
          {group2.map(renderLabels)}
        </ul>
        <ul className="flex flex-wrap gap-2 mb-8">
          {group3.map(renderLabels)}
        </ul>
        <h3 className={classNames(`font-bold text-lg mb-3`)}>
          {texts.filtersSearchTargetLabel}
        </h3>
        <button
          onClick={() =>
            setActiveFilters(
              activeFilters.filter((f) => f.fields.group !== 'zielpublikum')
            )
          }
          className={classNames(
            `py-1.5 border text-lg leading-6 pl-2 w-full mb-3`,
            !someTargetFiltersActive &&
              `bg-red border-red text-white font-bold pr-2.5`,
            someTargetFiltersActive && ` border-gray-20 pr-3`
          )}
        >
          {texts.noTargetPreferenceButtonText}
        </button>
        <div
          className={classNames(
            `relative border-t border-gray-20 text-center uppercase text-lg`,
            `font-medium tracking-widest text-gray-40 leading-4 mb-8 mt-5`
          )}
        >
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white px-3">
            {texts.orLabel}
          </span>
        </div>
        <ul className="flex flex-wrap gap-2 mb-8">
          {targetAudience.map(renderLabels)}
        </ul>
        <PrimaryButton onClick={() => void push(`/map`)}>
          {activeFilters.length > 0
            ? texts.filtersButtonTextFiltered.replace(
                '#number',
                `${filteredRecords.length}`
              )
            : texts.filtersButtonTextAllFilters}
        </PrimaryButton>
      </div>
    </div>
  )
}
