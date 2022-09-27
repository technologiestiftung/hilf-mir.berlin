import type { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { TableRowType } from '@common/types/gristData'
import { getGristTexts } from '@lib/requests/getGristTexts'
import { useTexts } from '@lib/TextsContext'
import { Page } from '@common/types/nextPage'
import { MapLayout } from '@components/MapLayout'
import { FacilityInfo } from '@components/FacilityInfo'
import { getGristRecords } from '@lib/requests/getGristRecords'
import { useRouter } from 'next/router'

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id
  if (!id || Array.isArray(id)) return { notFound: true }
  const [texts, records] = await Promise.all([
    getGristTexts(),
    getGristRecords(),
  ])
  const record = records.find((record) => `${record.id}` === id)

  return {
    props: { texts, records, record },
    revalidate: 120,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const records = await getGristRecords()
  return {
    paths: records.map(({ id }) => ({ params: { id: String(id) } })),
    fallback: true,
  }
}

interface MapProps {
  records: TableRowType[]
  record: TableRowType
}

const FacilityPage: Page<MapProps> = ({ record }) => {
  const texts = useTexts()
  const { push } = useRouter()
  return (
    <>
      <Head>
        <title>
          {record.fields.Einrichtung} – {texts.siteTitle}
        </title>
      </Head>
      <div className="p-5">
        <FacilityInfo facility={record} onClose={() => void push('/map')} />
      </div>
    </>
  )
}

export default FacilityPage

FacilityPage.layout = MapLayout
