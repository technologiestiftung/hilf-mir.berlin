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
import { useUrlState } from '@lib/UrlStateContext'

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
  const [urlState, setUrlState] = useUrlState()
  const texts = useTexts()

  const filteredRecords =
    urlState.tags && urlState.tags?.length > 0
      ? records.filter((record) =>
          urlState.tags?.every((t) => record.labels.find((l) => l === t))
        )
      : records
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
        {(filteredRecords.length !== records.length ||
          filteredRecords.length === 0) && (
          <div className="text-lg p-5 border-y border-gray-20 bg-gray-10/50">
            <p>
              {filteredRecords.length === 0 && texts.noResults}
              {filteredRecords.length === 1 &&
                texts.filteredResultsAmountSingular
                  .replace('#number', `${filteredRecords.length}`)
                  .replace('#total', `${records.length}`)}
              {filteredRecords.length > 1 &&
                texts.filteredResultsAmountPlural
                  .replace('#number', `${filteredRecords.length}`)
                  .replace('#total', `${records.length}`)}
            </p>
            <button
              onClick={() => setUrlState({ tags: [] })}
              className={classNames(
                `cursor-pointer`,
                `underline transition-colors hover:text-red`,
                `focus:outline-none focus:ring-2 focus:ring-red`,
                `focus:ring-offset-2 focus:ring-offset-white`
              )}
            >
              {texts.resetFilters}
            </button>
          </div>
        )}
        {filteredRecords.map((record) => (
          <FacilityListItem key={record.id} {...record} />
        ))}
      </ul>
    </>
  )
}

export default MapPage

MapPage.layout = MapLayout
