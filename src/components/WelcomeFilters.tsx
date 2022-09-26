import { useTexts } from '@lib/TextsContext'
import { FC } from 'react'
import { BackButton } from './BackButton'
import { GristLabelType, TableRowType } from '@common/types/gristData'
import { FiltersList } from './FiltersList'
import { useIsMobile } from '@lib/hooks/useIsMobile'
import { LegalFooter } from './LegalFooter'
import { SecondaryButton } from './SecondaryButton'
import { useRouter } from 'next/router'
import { Phone } from './icons/Phone'
import classNames from '@lib/classNames'

export const WelcomeFilters: FC<{
  onGoBack: () => void
  labels: GristLabelType[]
  recordsWithOnlyLabels: TableRowType['fields']['Schlagworte'][]
}> = ({ onGoBack, labels, recordsWithOnlyLabels }) => {
  const texts = useTexts()
  const { push } = useRouter()
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
            <h2
              className={classNames(
                `pt-8 pb-2 uppercase font-bold text-3xl`,
                `flex items-center justify-between gap-8`
              )}
            >
              {texts.welcomeFiltersHeadline}
              <SecondaryButton
                onClick={() => void push(`/sofortige-hilfe`)}
                icon={<Phone />}
              >
                {texts.directHelpButtonText}
              </SecondaryButton>
            </h2>
          )}
          <p className="text-lg pb-6 leading-snug">
            {texts.welcomeFiltersText}
          </p>
          <FiltersList
            recordsWithOnlyLabels={recordsWithOnlyLabels}
            labels={labels}
          />
        </div>
        {isMobile && <LegalFooter />}
      </div>
    </>
  )
}
