import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import introImage from '../src/images/intro-header.png'
import stripesPattern from '../src/images/stripe-pattern.svg'
import Image from 'next/image'
import { PrimaryButton } from '@components/PrimaryButton'
import { SecondaryButton } from '@components/SecondaryButton'
import { Phone } from '@components/icons/Phone'
import { useTexts } from '@lib/TextsContext'
import { getGristTexts } from '@lib/requests/getGristTexts'
import { useRouter } from 'next/router'

export const getStaticProps: GetStaticProps = async () => {
  const texts = await getGristTexts()
  return {
    props: { texts },
    revalidate: 120,
  }
}

const Home: NextPage = () => {
  const texts = useTexts()
  const { push } = useRouter()
  return (
    <>
      <Head>
        <title>
          Willkommen - Digitaler Wegweiser Psychiatrie und Suchthilfe Berlin
        </title>
      </Head>
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
        <p className="px-5 bp-8 text-lg leading-snug">
          {texts.homeWelcomeText}
        </p>
        <div className="flex flex-col gap-2 p-5 pt-8">
          <PrimaryButton>{texts.findOffersButtonText}</PrimaryButton>
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
            className="underline transition-colors hover:text-red pt-3"
          >
            {texts.moreOffersKVBLinkText}
          </a>
        </div>
      </div>
    </>
  )
}

export default Home
