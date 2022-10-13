import type { GetStaticProps } from 'next'
import Head from 'next/head'
import { useTexts } from '@lib/TextsContext'
import { Page } from '@common/types/nextPage'
import { MapLayout } from '@components/MapLayout'
import classNames from '@lib/classNames'
import { FacilityListItem } from '@components/FacilityListItem'
import { mapRecordToMinimum, MinimalRecordType } from '@lib/mapRecordToMinimum'
import { GristLabelType } from '@common/types/gristData'
import { useUrlState } from '@lib/UrlStateContext'
import { useRouter } from 'next/router'
import { loadData } from '@lib/loadData'
import { useDistanceToUser } from '@lib/hooks/useDistanceToUser'
import { useCallback } from 'react'

export const getStaticProps: GetStaticProps = async () => {
  const { texts, labels, records } = await loadData()
  const recordsWithOnlyMinimum = records.map(mapRecordToMinimum)
  return {
    props: {
      texts,
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

const MapPage: Page<MapProps> = ({ records: originalRecords }) => {
  const [urlState, setUrlState] = useUrlState()
  const texts = useTexts()
  const { isFallback } = useRouter()
  const { getDistanceToUser } = useDistanceToUser()

  const sortFacilities = useCallback(
    (facilities: MinimalRecordType[]): MinimalRecordType[] => {
      return facilities.sort((a, b) => {
        const distanceToUserFromFacilityA = getDistanceToUser({
          latitude: a.latitude,
          longitude: a.longitude,
        })
        const distanceToUserFromFacilityB = getDistanceToUser({
          latitude: b.latitude,
          longitude: b.longitude,
        })

        // When we don't have a user geolocation we simply skip the sorting:
        if (!distanceToUserFromFacilityA || !distanceToUserFromFacilityB)
          return 0

        return distanceToUserFromFacilityA - distanceToUserFromFacilityB
      })
    },
    [getDistanceToUser]
  )

  const records = originalRecords || []

  const filteredRecords =
    urlState.tags && urlState.tags?.length > 0
      ? records.filter((record) =>
          urlState.tags?.every((t) => record.labels.find((l) => l === t))
        )
      : records

  const filteredAndSortedRecords = sortFacilities(filteredRecords)

  return (
    <>
      <Head>
        <title>
          {isFallback
            ? 'Seite Lädt...'
            : `${texts.mapPageTitle.replace(
                '#number',
                `${filteredAndSortedRecords.length}`
              )} – ${texts.siteTitle}`}
        </title>
      </Head>
      <h1
        className={classNames(
          `hidden lg:block sticky top-0`,
          `px-5 py-8 bg-white border-b border-gray-10`
        )}
      >
        {isFallback
          ? `Seite Lädt...`
          : texts.mapPageTitle.replace(
              '#number',
              `${filteredAndSortedRecords.length}`
            )}
      </h1>
      <ul>
        {!isFallback &&
          (filteredAndSortedRecords.length !== records.length ||
            filteredAndSortedRecords.length === 0) && (
            <div className="text-lg p-5 border-y border-gray-20 bg-gray-10/50">
              <p>
                {filteredAndSortedRecords.length === 0 && texts.noResults}
                {filteredAndSortedRecords.length === 1 &&
                  texts.filteredResultsAmountSingular
                    .replace('#number', `${filteredAndSortedRecords.length}`)
                    .replace('#total', `${records.length}`)}
                {filteredAndSortedRecords.length > 1 &&
                  texts.filteredResultsAmountPlural
                    .replace('#number', `${filteredAndSortedRecords.length}`)
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
        {filteredAndSortedRecords.map((record) => (
          <FacilityListItem key={record.id} {...record} />
        ))}
      </ul>
    </>
  )
}

export default MapPage

MapPage.layout = MapLayout
