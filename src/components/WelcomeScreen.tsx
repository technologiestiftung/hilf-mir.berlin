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

export const WelcomeScreen: FC<{
  onShowOffers: () => void
}> = ({ onShowOffers }) => {
  const texts = useTexts()
  const { push } = useRouter()
  return (
    <div className="min-h-screen grid grid-cols-1 grid-rows-[auto,auto,1fr,auto,auto]">
      <div className="relative">
        <Image
          src={introImage}
          height={202}
          objectFit="fill"
          className="w-full"
        />
        <span className="absolute right-0 bottom-0">
          <Image
            {...stripesPattern}
            alt="decorative pattern"
            aria-hidden="true"
          />
        </span>
      </div>
      <h1 className="p-5 pt-6 ">{texts.homeWelcomeTitle}</h1>
      <p className="px-5 bp-8 text-lg leading-snug">{texts.homeWelcomeText}</p>
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
    </div>
  )
}
