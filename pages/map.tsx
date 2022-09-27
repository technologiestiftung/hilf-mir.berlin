import type { GetStaticProps } from 'next'
import Head from 'next/head'
import { getGristTexts } from '@lib/requests/getGristTexts'
import { getGristRecords } from '@lib/requests/getGristRecords'
import { useTexts } from '@lib/TextsContext'
import { Page } from '@common/types/nextPage'
import { MapLayout } from '@components/MapLayout'
import classNames from '@lib/classNames'
import { FacilityListItem } from '@components/FacilityListItem'
import { mapRecordToMinimum, MinimalRecordType } from '@lib/mapRecordToMinimum'
import { getGristLabels } from '@lib/requests/getGristLabels'
import { GristLabelType } from '@common/types/gristData'

export const getStaticProps: GetStaticProps = async () => {
  const [texts, records, labels] = await Promise.all([
    getGristTexts(),
    getGristRecords(),
    getGristLabels(),
  ])
  const recordsWithOnlyMinimum = records.map(mapRecordToMinimum)
  return {
    props: {
      texts: {
        ...texts,
        mapPageTitle: texts.mapPageTitle.replace(
          '#number',
          `${records.length}`
        ),
      },
      records: recordsWithOnlyMinimum,
      labels,
    },
    revalidate: 120,
  }
}

interface MapProps {
  records: MinimalRecordType[]
  labels: GristLabelType[]
}

const MapPage: Page<MapProps> = ({ records }) => {
  const texts = useTexts()
  return (
    <>
      <Head>
        <title>
          {texts.mapPageTitle} – {texts.siteTitle}
        </title>
      </Head>
      <h1
        className={classNames(
          `hidden lg:block sticky top-0`,
          `px-5 py-8 bg-white border-b border-gray-10`
        )}
      >
        {texts.mapPageTitle}
      </h1>
      <ul>
        {records.map((record) => (
          <FacilityListItem key={record.id} {...record} />
        ))}
      </ul>
    </>
  )
}

export default MapPage

MapPage.layout = MapLayout
