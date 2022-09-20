import { useTexts } from '@lib/TextsContext'
import { FC } from 'react'
import { BackButton } from './BackButton'
import { GristLabelType, TableRowType } from '@common/types/gristData'
import { FiltersList } from './FiltersList'

export const WelcomeFilters: FC<{
  onGoBack: () => void
  labels: GristLabelType[]
  records: TableRowType[]
}> = ({ onGoBack, labels, records }) => {
  const texts = useTexts()
  return (
    <div className="h-screen flex flex-col overflow-y-auto">
      <BackButton onClick={onGoBack} />
      <div className="px-5 md:px-8 pb-8">
        <h1 className="pt-8 pb-4">{texts.welcomeFiltersHeadline}</h1>
        <p className="text-lg pb-6 leading-snug">{texts.welcomeFiltersText}</p>
        <FiltersList records={records} labels={labels} />
      </div>
    </div>
  )
}
