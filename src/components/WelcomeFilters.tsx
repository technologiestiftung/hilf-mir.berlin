import { useTexts } from '@lib/TextsContext'
import { FC, useState } from 'react'
import { PrimaryButton } from '@components/PrimaryButton'
import { useRouter } from 'next/router'
import { BackButton } from './BackButton'
import { FilterLabelType } from '@lib/getLabelsFromRecords'
import classNames from '@lib/classNames'
import { TableRowType } from '@common/types/gristData'

export const WelcomeFilters: FC<{
  onGoBack: () => void
  labels: FilterLabelType[]
  records: TableRowType[]
}> = ({ onGoBack, labels, records }) => {
  const texts = useTexts()
  const [activeFilters, setActiveFilters] = useState<FilterLabelType[]>([])
  const { push } = useRouter()
  const filteredRecords = records.filter((r) =>
    activeFilters.find((f) => r.fields.Schlagworte.includes(f.text))
  )
  return (
    <div className="h-screen flex flex-col overflow-y-auto">
      <BackButton onClick={onGoBack} />
      <div className="px-5 md:px-8">
        <h1 className="pt-8 pb-4">{texts.welcomeFiltersHeadline}</h1>
        <p className="text-lg pb-6 leading-snug">{texts.welcomeFiltersText}</p>
        <ul className="flex flex-wrap gap-2 mb-8">
          {labels.map(({ slug, text }) => {
            const isActive = !!activeFilters.find(
              (activeFilter) => activeFilter.slug === slug
            )
            const newFilters = isActive
              ? activeFilters.filter((f) => f.slug !== slug)
              : [...activeFilters, { slug, text }]
            return (
              <li key={slug} className="inline-block">
                <button
                  onClick={() => setActiveFilters(newFilters)}
                  className={classNames(
                    `px-3 py-1.5 border text-lg`,
                    isActive && `bg-red border-red text-white font-bold`,
                    !isActive && ` border-gray-20`
                  )}
                >
                  {text}
                </button>
              </li>
            )
          })}
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
