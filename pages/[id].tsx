import type { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { GristLabelType, TableRowType } from '@common/types/gristData'
import { getGristTexts } from '@lib/requests/getGristTexts'
import { useTexts } from '@lib/TextsContext'
import { Page } from '@common/types/nextPage'
import { MapLayout } from '@components/MapLayout'
import { FacilityInfo } from '@components/FacilityInfo'
import { getGristRecords } from '@lib/requests/getGristRecords'
import { useRouter } from 'next/router'
import { mapRecordToMinimum, MinimalRecordType } from '@lib/mapRecordToMinimum'
import { getGristLabels } from '@lib/requests/getGristLabels'

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id
  if (!id || Array.isArray(id)) return { notFound: true }
  const [texts, records, labels] = await Promise.all([
    getGristTexts(),
    getGristRecords(),
    getGristLabels(),
  ])
  const minimalRecords = records.map(mapRecordToMinimum)
  const record = records.find((record) => `${record.id}` === `${id}`)

  if (!record) return { notFound: true }

  return {
    props: { texts, records: minimalRecords, record, labels },
    revalidate: 120,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const records = await getGristRecords()
  return {
    paths: records
      .filter((r) => r?.id && r?.fields)
      .map(({ id }) => ({ params: { id: String(id) } })),
    fallback: true,
  }
}

interface MapProps {
  records: MinimalRecordType[]
  labels: GristLabelType[]
  record: TableRowType
}

const FacilityPage: Page<MapProps> = ({ record }) => {
  const texts = useTexts()
  const { push, isFallback } = useRouter()

  return (
    <>
      <Head>
        <title>
          {isFallback
            ? `Seite lädt...`
            : `${record.fields.Einrichtung} - ${texts.siteTitle}`}
        </title>
      </Head>
      {isFallback && `Seite lädt...`}
      {!isFallback && (
        <div className="p-5">
          <FacilityInfo facility={record} onClose={() => void push('/map')} />
        </div>
      )}
    </>
  )
}

export default FacilityPage

FacilityPage.layout = MapLayout
