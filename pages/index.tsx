import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import { getGristTexts } from '@lib/requests/getGristTexts'
import classNames from '@lib/classNames'
import { WelcomeScreen } from '@components/WelcomeScreen'
import { WelcomeFilters } from '@components/WelcomeFilters'
import { useState } from 'react'
import { getGristRecords } from '@lib/requests/getGristRecords'
import { GristLabelType, TableRowType } from '@common/types/gristData'
import { getGristLabels } from '@lib/requests/getGristLabels'
import { useIsMobile } from '@lib/hooks/useIsMobile'
import { LegalFooter } from '@components/LegalFooter'

export const getStaticProps: GetStaticProps = async () => {
  const [texts, records, labels] = await Promise.all([
    getGristTexts(),
    getGristRecords(),
    getGristLabels(),
  ])
  return {
    props: { texts, records, labels },
    revalidate: 120,
  }
}

const Home: NextPage<{
  records: TableRowType[]
  labels: GristLabelType[]
}> = ({ labels, records }) => {
  const [showFilters, setShowFilters] = useState(false)
  const isMobile = useIsMobile()
  return (
    <>
      <Head>
        <title>
          Willkommen - Digitaler Wegweiser Psychiatrie und Suchthilfe Berlin
        </title>
      </Head>
      <div className="overflow-hidden">
        <div
          className={classNames(
            isMobile && showFilters ? `-translate-x-[100vw]` : ``,
            isMobile && `w-[200vw] transition-transform grid grid-cols-2`,
            !isMobile && `container mx-auto md:max-w-7xl`
          )}
        >
          <WelcomeScreen onShowOffers={() => setShowFilters(true)} />
          <WelcomeFilters
            records={records}
            onGoBack={() => setShowFilters(false)}
            labels={labels}
          />
        </div>
      </div>
      {!isMobile && <LegalFooter />}
    </>
  )
}

export default Home
