import { useTexts } from '@lib/TextsContext'
import { FC } from 'react'
import { BackButton } from './BackButton'
import { TableRowType } from '@common/types/gristData'
import { FiltersList } from './FiltersList'
import { useIsMobile } from '@lib/hooks/useIsMobile'
import { LegalFooter } from './LegalFooter'
import { SecondaryButton } from './SecondaryButton'
import { useRouter } from 'next/router'
import { Phone } from './icons/Phone'
import classNames from '@lib/classNames'
import { TextLink } from './TextLink'

export const WelcomeFilters: FC<{
  onGoBack: () => void
  recordsWithOnlyLabels: TableRowType['fields']['Schlagworte'][]
}> = ({ onGoBack, recordsWithOnlyLabels }) => {
  const texts = useTexts()
  const { push } = useRouter()
  const isMobile = useIsMobile()

  return (
    <>
      <div
        className={classNames(
          'h-full md:h-auto flex flex-col overflow-y-auto overflow-x-auto',
          isMobile && `w-screen float-left`
        )}
      >
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
          <p className="text-lg pb-6 md:pb-0 leading-snug md:max-w-[66%]">
            {texts.welcomeFiltersText}
          </p>
          <FiltersList recordsWithOnlyLabels={recordsWithOnlyLabels} />
          <div className="hidden md:block w-full mt-6">
            <TextLink href={texts.moreOffersKVBLinkUrl}>
              {texts.moreOffersKVBLinkText}
            </TextLink>
          </div>
        </div>
        {isMobile && <LegalFooter />}
      </div>
    </>
  )
}
