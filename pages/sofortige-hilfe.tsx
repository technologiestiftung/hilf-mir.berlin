import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import { useTexts } from '@lib/TextsContext'
import { getGristTexts } from '@lib/requests/getGristTexts'
import { Arrow } from '@components/icons/Arrow'
import { useRouter } from 'next/router'
import classNames from '@lib/classNames'
import { Phone } from '@components/icons/Phone'
import { useState } from 'react'
import { Chevron } from '@components/icons/Chevron'

export const getStaticProps: GetStaticProps = async () => {
  const texts = await getGristTexts()
  return {
    props: { texts },
    revalidate: 120,
  }
}

const Home: NextPage = () => {
  const texts = useTexts()
  const neigborhoodKeys = Object.keys(texts).filter(
    (key) => key.startsWith('neighborhood') && key.endsWith('Label')
  )
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(
    neigborhoodKeys[0]
  )
  const { back } = useRouter()
  const neighborhoodNumber =
    texts[
      selectedNeighborhood.replace('Label', 'PhoneNumber') as keyof typeof texts
    ]
  return (
    <>
      <Head>
        <title>
          {texts.directHelpButtonText} - Digitaler Wegweiser Psychiatrie und
          Suchthilfe Berlin
        </title>
      </Head>
      <div className="min-h-screen">
        <div className="p-2">
          <button
            className={classNames(
              `flex gap-2 p-3 md:p-8 items-center`,
              `transition-colors hover:text-red`,
              `focus:outline-none focus:ring-2 focus:ring-red`,
              `focus:ring-offset-2 focus:ring-offset-white`
            )}
            onClick={() => back()}
            aria-label={texts.backText}
          >
            <Arrow orientation="left" className="scale-75" />
            <span className="font-bold text-lg">{texts.backText}</span>
          </button>
        </div>
        <div className="p-5 md:p-8 flex flex-col gap-8">
          <h1 className="relative pr-16">
            {texts.directHelpButtonText}
            <Phone className="absolute top-1/2 right-0 -translate-y-1/2 text-red" />
          </h1>
          <section className="flex flex-col gap-1">
            <h4 className="font-bold text-lg">
              {texts.suicidePreventionLabel}
            </h4>
            <a
              className={classNames(
                `p-0 text-3xl`,
                `focus:outline-none focus:ring-2 focus:ring-red`,
                `focus:ring-offset-2 focus:ring-offset-white`
              )}
              href={`tel:${texts.suicidePreventionPhoneNumber}`}
            >
              {texts.suicidePreventionPhoneNumber}
            </a>
          </section>
          <section className="flex flex-col gap-1">
            <h4 className="font-bold text-lg">
              {texts.psychiatricServicesLabel}
            </h4>
            <div className="relative">
              <select
                name="neighbourhood"
                id="neighbourhood"
                value={selectedNeighborhood}
                onChange={(evt) => setSelectedNeighborhood(evt.target.value)}
                className={classNames(
                  `border border-black p-3 text-lg pr-12`,
                  `my-2 bg-white form-select appearance-none`,
                  `block w-full bg-white bg-clip-padding bg-no-repeat`,
                  `focus:outline-none focus:ring-2 focus:ring-red`,
                  `focus:ring-offset-2 focus:ring-offset-white`
                )}
              >
                {neigborhoodKeys.map((key) => (
                  <option value={key} key={key}>
                    {texts[key as keyof typeof texts]}
                  </option>
                ))}
              </select>
              <Chevron
                orientation="down"
                className="absolute top-1/2 right-4 -translate-y-1/2 scale-75"
              />
            </div>
            <a
              className={classNames(
                `p-0 text-3xl`,
                `focus:outline-none focus:ring-2 focus:ring-red`,
                `focus:ring-offset-2 focus:ring-offset-white`
              )}
              href={`tel:${neighborhoodNumber}`}
            >
              {neighborhoodNumber}
            </a>
          </section>
          <section className="flex flex-col gap-1">
            <h4 className="font-bold text-lg">
              {texts.psychiatricServicesLabel}
            </h4>
            <a
              className={classNames(
                `p-0 text-3xl`,
                `focus:outline-none focus:ring-2 focus:ring-red`,
                `focus:ring-offset-2 focus:ring-offset-white`
              )}
              href={`tel:texts.suicidePreventionPhoneNumber`}
            >
              {texts.suicidePreventionPhoneNumber}
            </a>
          </section>
        </div>
      </div>
    </>
  )
}

export default Home
