import type { GetStaticProps } from 'next'
import Head from 'next/head'
import { TableRowType } from '@common/types/gristData'
import { getGristTexts } from '@lib/requests/getGristTexts'
import { getGristRecords } from '@lib/requests/getGristRecords'
import { useTexts } from '@lib/TextsContext'
import { Page } from '@common/types/nextPage'
import { MapLayout } from '@components/MapLayout'

export const getStaticProps: GetStaticProps = async () => {
  const [texts, records] = await Promise.all([
    getGristTexts(),
    getGristRecords(),
  ])
  return {
    props: { texts, records },
    revalidate: 120,
  }
}

interface MapProps {
  records: TableRowType[]
}

const MapPage: Page<MapProps> = () => {
  const texts = useTexts()
  return (
    <>
      <Head>
        <title>
          {texts.mapPageTitle} – {texts.siteTitle}
        </title>
        <link
          href="https://unpkg.com/maplibre-gl@2.1.6/dist/maplibre-gl.css"
          rel="stylesheet"
        />
      </Head>
    </>
  )
}

export default MapPage

MapPage.layout = MapLayout
