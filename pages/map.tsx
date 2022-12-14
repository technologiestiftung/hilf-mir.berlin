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
import { useCallback, useEffect, useState } from 'react'
import { useDistanceToUser } from '@lib/hooks/useDistanceToUser'
import { useUserGeolocation } from '@lib/hooks/useUserGeolocation'

export const getStaticProps: GetStaticProps = async () => {
  const { texts, labels, records } = await loadData()
  const recordsWithOnlyMinimum = records
    .map(mapRecordToMinimum)
    .filter((r) => r.prioriy >= 0)
    .sort((a, b) => b.prioriy - a.prioriy || a.title.localeCompare(b.title))

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

const MapPage: Page<MapProps> = ({ records: originalRecords }) => {
  const [urlState, setUrlState] = useUrlState()
  const texts = useTexts()
  const { isFallback } = useRouter()
  const { getDistanceToUser } = useDistanceToUser()
  const { useGeolocation } = useUserGeolocation()

  const [filteredRecords, setFilteredRecords] =
    useState<MinimalRecordType[]>(originalRecords)

  const sortFacilities = useCallback(
    (facilities: MinimalRecordType[]) => {
      if (!useGeolocation) return facilities
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
          return b.prioriy - a.prioriy

        return (
          b.prioriy - a.prioriy ||
          distanceToUserFromFacilityA - distanceToUserFromFacilityB
        )
      })
    },
    [getDistanceToUser, useGeolocation]
  )

  useEffect(() => {
    if (!urlState.tags || urlState.tags?.length < 0) return
    const newFilteredRecords = originalRecords.filter((record) =>
      urlState.tags?.every((t) => record.labels.find((l) => l === t))
    )
    return setFilteredRecords(sortFacilities(newFilteredRecords))
  }, [urlState.tags, originalRecords, sortFacilities])

  const [pageTitle, setPageTitle] = useState(texts.mapPageTitle)

  useEffect(() => {
    setPageTitle(
      texts.mapPageTitle.replace(/^\d\d?\d?/g, `${filteredRecords.length}`)
    )
  }, [filteredRecords, texts.mapPageTitle])

  return (
    <>
      <Head>
        <title>
          {isFallback ? 'Seite Lädt...' : `${pageTitle} – ${texts.siteTitle}`}
        </title>
      </Head>
      <h1
        className={classNames(
          `hidden lg:block sticky top-0 z-10`,
          `px-5 py-8 bg-white border-b border-gray-10`
        )}
      >
        {isFallback ? `Seite Lädt...` : `${pageTitle}`}
      </h1>
      <ul>
        {!isFallback &&
          (filteredRecords.length !== originalRecords.length ||
            filteredRecords.length === 0) && (
            <div className="p-5 text-lg border-y border-gray-20 bg-gray-10/50">
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
