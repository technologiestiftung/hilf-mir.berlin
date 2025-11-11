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
import { loadData } from '@lib/loadData'
import { LngLatLike } from 'maplibre-gl'
import sanitizeHtml from 'sanitize-html'

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id
  if (!id || Array.isArray(id)) return { notFound: true }
  const { texts, labels, records } = await loadData()
  const record = records.find((r) => `${r.id}` === `${id}`)

  if (!record) return { notFound: true }

  const minimalRecords = records
    .map(mapRecordToMinimum)
    .filter((r): r is MinimalRecordType => r !== null)

  return {
    props: {
      texts,
      records: minimalRecords,
      record: {
        ...record,
        Uber_uns: sanitizeHtml(record.fields.Uber_uns, {
          allowedTags: ['a', 'b', 'i', 'em', 'strong', 'u', 'sup', 'sub'],
          allowedAttributes: {
            a: ['href', 'title'],
          },
          disallowedTagsMode: 'discard',
        }),
      },
      labels,
      center: [record.fields.long, record.fields.lat],
    },
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
  center?: LngLatLike
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
