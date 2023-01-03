import type { GetStaticProps } from 'next'
import Head from 'next/head'
import classNames from '@lib/classNames'
import { WelcomeScreen } from '@components/WelcomeScreen'
import { WelcomeFilters } from '@components/WelcomeFilters'
import { useEffect, useState } from 'react'
import { GristLabelType, TableRowType } from '@common/types/gristData'
import { useIsMobile } from '@lib/hooks/useIsMobile'
import { LegalFooter } from '@components/LegalFooter'
import { Page } from '@common/types/nextPage'
import { LabelsProvider } from '@lib/LabelsContext'
import { loadData } from '@lib/loadData'

export const getStaticProps: GetStaticProps = async () => {
  const { texts, labels, records } = await loadData()
  const recordsWithOnlyLabels = records.map(
    (records) => records.fields.Schlagworte
  )
  return {
    props: { texts, recordsWithOnlyLabels, labels },
    revalidate: 120,
  }
}

interface HomePropsType {
  recordsWithOnlyLabels: TableRowType['fields']['Schlagworte'][]
  labels: GristLabelType[]
}

const Home: Page<HomePropsType> = ({ labels, recordsWithOnlyLabels }) => {
  const [showFilters, setShowFilters] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    document.body.classList.add('overflow-hidden')
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [])

  return (
    <LabelsProvider value={labels}>
      <Head>
        <title>
          Willkommen bei HILF-MIR Berlin - dein digitaler Wegweiser für
          Psychiatrie und Suchthilfe in Berlin
        </title>
      </Head>
      <div
        className={classNames('overflow-hidden', isMobile && 'fixed inset-0')}
      >
        <div
          className={classNames(
            isMobile && showFilters ? `-translate-x-[100vw]` : ``,
            isMobile && `w-[200vw] transition-transform h-full`,
            !isMobile && `container mx-auto md:max-w-7xl`
          )}
        >
          <WelcomeScreen onShowOffers={() => setShowFilters(true)} />
          <WelcomeFilters
            recordsWithOnlyLabels={recordsWithOnlyLabels}
            onGoBack={() => setShowFilters(false)}
          />
        </div>
      </div>
      {!isMobile && <LegalFooter />}
    </LabelsProvider>
  )
}

export default Home
