import { useTexts } from '@lib/TextsContext'
import { FC } from 'react'
import { BackButton } from './BackButton'
import { FiltersList } from './FiltersList'
import { useIsMobile } from '@lib/hooks/useIsMobile'
import { LegalFooter } from './LegalFooter'
import classNames from '@lib/classNames'
import { TextLink } from './TextLink'
import { Footer } from './Footer'
import { RecordsWithOnlyLabelsType } from '@lib/hooks/useFilteredFacilitiesCount'

export const WelcomeFilters: FC<{
  onGoBack: () => void
  recordsWithOnlyLabels: RecordsWithOnlyLabelsType[]
}> = ({ onGoBack, recordsWithOnlyLabels }) => {
  const texts = useTexts()
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
                `pt-8 pb-2 font-bold text-3xl`,
                `flex items-center justify-between gap-8`
              )}
            >
              {texts.welcomeFiltersHeadline}
            </h2>
          )}
          <p
            className="text-lg pb-6 md:pb-0 leading-snug md:max-w-[66%]"
            dangerouslySetInnerHTML={{ __html: texts.welcomeFiltersText }}
          />
          <FiltersList recordsWithOnlyLabels={recordsWithOnlyLabels} />
          <div className="hidden md:block w-full mt-6 pb-0 lg:pb-20">
            <TextLink href={texts.moreOffersKVBLinkUrl}>
              {texts.moreOffersKVBLinkText}
            </TextLink>
          </div>
        </div>
        {isMobile && (
          <>
            <Footer />
            <LegalFooter />
          </>
        )}
      </div>
    </>
  )
}
