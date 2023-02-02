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
import { useFiltersWithActiveProp } from '@lib/hooks/useFiltersWithActiveProp'
import { getFilteredFacilities } from '@components/Map/mapUtil'

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
  const labels = useFiltersWithActiveProp()
  const [filteredRecords, setFilteredRecords] =
    useState<MinimalRecordType[]>(originalRecords)

  const sortByTagsCount = useCallback(
    (a: MinimalRecordType, b: MinimalRecordType) => {
      const amountActiveLabelsA =
        urlState.tags?.filter((id) => a.labels.includes(id)).length || 0
      const amountActiveLabelsB =
        urlState.tags?.filter((id) => b.labels.includes(id)).length || 0

      return amountActiveLabelsB - amountActiveLabelsA
    },
    [urlState.tags]
  )

  const defaultSort = useCallback(
    (a: MinimalRecordType, b: MinimalRecordType) => {
      return (
        b.prioriy - a.prioriy ||
        sortByTagsCount(a, b) ||
        a.title.localeCompare(b.title)
      )
    },
    [sortByTagsCount]
  )

  const sortFacilities = useCallback(
    (facilities: MinimalRecordType[]) => {
      if (!useGeolocation) return facilities.sort(defaultSort)

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
        if (!distanceToUserFromFacilityA || !distanceToUserFromFacilityB) {
          return defaultSort(a, b)
        }

        return (
          b.prioriy - a.prioriy ||
          sortByTagsCount(a, b) ||
          distanceToUserFromFacilityA - distanceToUserFromFacilityB ||
          a.title.localeCompare(b.title)
        )
      })
    },
    [getDistanceToUser, useGeolocation, defaultSort, sortByTagsCount]
  )

  useEffect(() => {
    const filteredRecords = getFilteredFacilities({
      facilities: originalRecords,
      labels,
    })
    return setFilteredRecords(sortFacilities(filteredRecords))
  }, [labels, sortFacilities])

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
      <ul className="pb-28">
        {!isFallback &&
          (filteredRecords.length !== originalRecords.length ||
            filteredRecords.length === 0) && (
            <div className="p-5 text-lg border-y border-gray-20 bg-gray-10/50">
              <button
                onClick={() => setUrlState({ tags: [] })}
                className={classNames(
                  `cursor-pointer`,
                  `underline transition-colors hover:text-primary`,
                  `focus:outline-none focus:ring-2 focus:ring-primary`,
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
