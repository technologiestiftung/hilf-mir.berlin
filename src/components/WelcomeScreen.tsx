import { useTexts } from '@lib/TextsContext'
import Image from 'next/image'
import { FC } from 'react'
import introImage from '../images/intro-header.png'
import stripesPattern from '../images/stripe-pattern.svg'
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
    <div>
      <div
        className={classNames(
          `grid grid-cols-1 grid-rows-[auto,auto,1fr,auto,auto,auto]`,
          isMobile && `min-h-screen`
        )}
      >
        <div>
          <section className="w-full h-32 md:h-[202px] relative">
            <Image src={introImage} layout="fill" objectFit="cover" />
            <span className="absolute right-0 bottom-0 w-20 h-20">
              <Image
                {...stripesPattern}
                alt="decorative pattern"
                aria-hidden="true"
              />
            </span>
          </section>
        </div>
        <h1 className="p-5 md:px-8 pt-6 md:pt-12">{texts.homeWelcomeTitle}</h1>
        <p className="px-5 md:px-8 bp-8 text-lg leading-snug max-w-prose md:mb-8">
          {texts.homeWelcomeText}
        </p>
        {isMobile && (
          <div className="flex flex-col gap-2 p-5 pt-8">
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
                `underline transition-colors hover:text-red pt-3`,
                `focus:outline-none focus:ring-2 focus:ring-red`,
                `focus:ring-offset-2 focus:ring-offset-white`
              )}
            >
              {texts.moreOffersKVBLinkText}
            </a>
          </div>
        )}
      </div>
      {isMobile && <LegalFooter />}
    </div>
  )
}