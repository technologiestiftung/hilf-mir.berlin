import { useTexts } from '@lib/TextsContext'
import { FC } from 'react'
import { BackButton } from './BackButton'
import { GristLabelType, TableRowType } from '@common/types/gristData'
import { FiltersList } from './FiltersList'
import { useIsMobile } from '@lib/hooks/useIsMobile'
import { LegalFooter } from './LegalFooter'

export const WelcomeFilters: FC<{
  onGoBack: () => void
  labels: GristLabelType[]
  records: TableRowType[]
}> = ({ onGoBack, labels, records }) => {
  const texts = useTexts()
  const isMobile = useIsMobile()
  return (
    <>
      <div className="h-screen md:h-auto flex flex-col overflow-y-auto">
        {isMobile && <BackButton onClick={onGoBack} />}
        <div className="px-5 md:px-8 pb-8">
          {isMobile && (
            <h1 className="pt-8 pb-4">{texts.welcomeFiltersHeadline}</h1>
          )}
          {!isMobile && (
            <h2 className="pt-8 pb-2 uppercase font-bold text-3xl">
              {texts.welcomeFiltersHeadline}
            </h2>
          )}
          <p className="text-lg pb-6 leading-snug">
            {texts.welcomeFiltersText}
          </p>
          <FiltersList records={records} labels={labels} />
        </div>
        {isMobile && <LegalFooter />}
      </div>
    </>
  )
}
