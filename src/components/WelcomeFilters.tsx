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
import { PrimaryButton } from './PrimaryButton'
import { useUrlState } from '@lib/UrlStateContext'
import { useUserGeolocation } from '@lib/hooks/useUserGeolocation'
import { TextLink } from './TextLink'
import { useLabels } from '@lib/LabelsContext'

export const WelcomeFilters: FC<{
  onGoBack: () => void
  recordsWithOnlyLabels: TableRowType['fields']['Schlagworte'][]
}> = ({ onGoBack, recordsWithOnlyLabels }) => {
  const texts = useTexts()
  const { push } = useRouter()
  const isMobile = useIsMobile()
  const [urlState] = useUrlState()
  const labels = useLabels()
  const { latitude, longitude } = useUserGeolocation()
  const tags = urlState.tags || []

  const filteredRecords = recordsWithOnlyLabels.filter((recordLabels) =>
    tags.every((tagId) => recordLabels.find((labelId) => labelId === tagId))
  )
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
          <p className="text-lg pb-6 md:pb-0 leading-snug md:max-w-[66%]">
            {texts.welcomeFiltersText}
          </p>
          <FiltersList recordsWithOnlyLabels={recordsWithOnlyLabels} />
          <PrimaryButton
            className="md:max-w-sm"
            onClick={() =>
              void push({
                pathname: '/map',
                query: {
                  ...urlState,
                  ...(latitude && longitude ? { latitude, longitude } : {}),
                },
              })
            }
            disabled={tags.length > 0 && filteredRecords.length === 0}
            tooltip={
              tags.length > 0 && filteredRecords.length === 0
                ? texts.filtersButtonTextFilteredNoResultsHint
                : ''
            }
          >
            {(tags.length === 0 || tags.length === labels.length) &&
              texts.filtersButtonTextAllFilters}
            {tags.length > 0 &&
              filteredRecords.length === 1 &&
              texts.filtersButtonTextFilteredSingular}
            {tags.length > 0 &&
              filteredRecords.length > 1 &&
              texts.filtersButtonTextFilteredPlural.replace(
                '#number',
                `${filteredRecords.length}`
              )}
            {tags.length > 0 &&
              filteredRecords.length === 0 &&
              texts.filtersButtonTextFilteredNoResults}
          </PrimaryButton>
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
