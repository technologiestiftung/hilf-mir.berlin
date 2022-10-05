import type { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { GristLabelType, TableRowType } from '@common/types/gristData'
import { useTexts } from '@lib/TextsContext'
import { Page } from '@common/types/nextPage'
import { MapLayout } from '@components/MapLayout'
import { FacilityInfo } from '@components/FacilityInfo'
import { useRouter } from 'next/router'
import { mapRecordToMinimum, MinimalRecordType } from '@lib/mapRecordToMinimum'
import { useEffect } from 'react'
import { loadCacheData } from '@lib/loadCacheData'
import { downloadCacheData } from '@lib/cacheDownloader'

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id
  if (!id || Array.isArray(id)) return { notFound: true }
  let { texts, records, labels } = await loadCacheData()
  let record = records.find((r) => `${r.id}` === `${id}`)

  if (!record) {
    await downloadCacheData()
    const newCacheData = await loadCacheData()
    texts = newCacheData.texts
    records = newCacheData.records
    labels = newCacheData.labels
    record = records.find((r) => `${r.id}` === `${id}`)
    if (!record) return { notFound: true }
  }

  const minimalRecords = records.map(mapRecordToMinimum)

  return {
    props: { texts, records: minimalRecords, record, labels },
    revalidate: 120,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { records } = await loadCacheData()
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
  const { isFallback } = useRouter()

  useEffect(() => {
    document.querySelector(`main > aside`)?.scrollTo(0, 0)
  }, [])

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
      {!isFallback && <FacilityInfo facility={record} />}
    </>
  )
}

export default FacilityPage

FacilityPage.layout = MapLayout
