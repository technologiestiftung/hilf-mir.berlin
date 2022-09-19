import type { NextPage } from 'next'
import Head from 'next/head'
import introImage from '../src/images/intro-header.png'
import stripesPattern from '../src/images/stripe-pattern.svg'
import Image from 'next/image'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>
          Willkommen - Digitaler Wegweiser Psychiatrie und Suchthilfe Berlin
        </title>
      </Head>
      <div className="">
        <div className="relative">
          <Image src={introImage} width={750} height={202} objectFit="cover" />
          <span className="absolute right-0 bottom-0">
            <Image
              {...stripesPattern}
              alt="decorative pattern"
              aria-hidden="true"
            />
          </span>
        </div>
        <h1 className="p-5 pt-6 uppercase font-bold text-4xl leading-8">
          Willkommen beim digitalen Wegweiser
        </h1>
        <p className="px-5 bp-8">
          Hier findest Du schnell und einfach Hilfe und eine Übersicht der
          richtigen Ansprechpartner:innen sowie weiterführende Informationen zu
          den Angeboten der psychosozialen Kontakt- und Beratungsstellen in
          allen Berliner Bezirken.
        </p>
      </div>
    </>
  )
}

export default Home
