import { useTexts } from '@lib/TextsContext'
import Image from 'next/image'
import { FC } from 'react'
import introImage from '../images/intro-header.png'
import StripesPattern from '../images/stripe-pattern.svg'
import { PrimaryButton } from '@components/PrimaryButton'
import { SecondaryButton } from '@components/SecondaryButton'
import { Phone } from '@components/icons/Phone'
import { useRouter } from 'next/router'
import classNames from '@lib/classNames'
import { useIsMobile } from '@lib/hooks/useIsMobile'
import { LegalFooter } from './LegalFooter'

export const WelcomeScreen: FC<{
  onShowOffers: () => void
}> = ({ onShowOffers }) => {
  const texts = useTexts()
  const { push } = useRouter()
  const isMobile = useIsMobile()
  return (
    <div
      className={classNames(
        isMobile &&
          `w-screen float-left overflow-y-auto h-full overflow-x-hidden`
      )}
    >
      <div
        className={classNames(
          `grid grid-cols-1 grid-rows-[auto,auto,1fr,auto,auto,auto]`,
          isMobile && `min-h-full`
        )}
      >
        <div>
          <section className="w-full h-32 md:h-[202px] relative mb-6">
            <Image src={introImage} layout="fill" objectFit="cover" />
          </section>
        </div>
        <h1 className="p-5 pt-6 md:px-8 md:pt-12">{texts.homeWelcomeTitle}</h1>
        <p
          className="px-5 text-lg leading-snug md:px-8 bp-8 max-w-prose md:mb-8"
          dangerouslySetInnerHTML={{ __html: texts.homeWelcomeText }}
        />
        {isMobile && (
          <div className="flex flex-col p-5 pt-8 gap-2">
            <PrimaryButton onClick={onShowOffers}>
              {texts.findOffersButtonText}
            </PrimaryButton>
            <SecondaryButton
              onClick={() => void push(`/sofortige-hilfe`)}
              icon={<Phone />}
            >
              {texts.directHelpButtonText}
            </SecondaryButton>
            <a
              href={texts.moreOffersKVBLinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={classNames(
                `underline transition-colors hover:text-primary pt-3`,
                `focus:outline-none focus:ring-2 focus:ring-primary`,
                `focus:ring-offset-2 focus:ring-offset-white`
              )}
            >
              {texts.moreOffersKVBLinkText}
            </a>
          </div>
        )}
        {isMobile && <LegalFooter />}
      </div>
    </div>
  )
}
