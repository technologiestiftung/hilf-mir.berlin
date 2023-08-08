import type { GetStaticProps } from 'next'
import Head from 'next/head'
import { useTexts } from '@lib/TextsContext'
import { Page } from '@common/types/nextPage'
import { MapLayout } from '@components/MapLayout'
import { mapRecordToMinimum, MinimalRecordType } from '@lib/mapRecordToMinimum'
import { GristLabelType } from '@common/types/gristData'
import { useUrlState } from '@lib/UrlStateContext'
import { useRouter } from 'next/router'
import { loadData } from '@lib/loadData'
import { useCallback, useEffect, useState } from 'react'
import { useDistanceToUser } from '@lib/hooks/useDistanceToUser'
import { useUserGeolocation } from '@lib/hooks/useUserGeolocation'
import { useFiltersWithActiveProp } from '@lib/hooks/useFiltersWithActiveProp'
import { getFilteredFacilities } from '@lib/facilityFilterUtil'
import { Button } from '@components/Button'
import { FacilityListItem } from '@components/FacilityListItem'
import { useActiveIdsBySearchTerm } from '@lib/hooks/useActiveIdsBySearchTerm'

export const getStaticProps: GetStaticProps = async () => {
  const { texts, labels, records } = await loadData()
  const recordsWithOnlyMinimum = records
    .map(mapRecordToMinimum)
    .filter((r) => r.prioriy >= 0)
    .sort((a, b) => b.prioriy - a.prioriy || a.title.localeCompare(b.title))

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
  const [urlState] = useUrlState()
  const texts = useTexts()
  const { isFallback } = useRouter()
  const { getDistanceToUser } = useDistanceToUser()
  const { useGeolocation } = useUserGeolocation()
  const labels = useFiltersWithActiveProp()
  const [filteredRecords, setFilteredRecords] =
    useState<MinimalRecordType[]>(originalRecords)
  const activeIdsBySearchTerm = useActiveIdsBySearchTerm()

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
      activeIdsBySearchTerm: activeIdsBySearchTerm.ids,
    })
    return setFilteredRecords(sortFacilities(filteredRecords))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlState.tags?.join('-'), activeIdsBySearchTerm.key])

  return (
    <>
      <Head>
        <title>
          {isFallback
            ? 'Seite Lädt...'
            : `${texts.resultPageTitle} – ${texts.siteTitle}`}
        </title>
      </Head>
      {labels.filter((label) => label.isActive).length > 0 && (
        <div className="p-5 border-b border-gray-20 bg-gray-10 bg-opacity-25">
          <p className="text-sm font-bold">{texts.resultPageIntro}</p>
          <ul className="mt-2 md:mt-3 flex flex-wrap gap-1 md:gap-2">
            {labels
              .filter((label) => label.isActive)
              .map((label) => (
                <Button
                  key={label.id}
                  tag="button"
                  disabled={true}
                  scheme="primary"
                  size="extrasmall"
                  className="!bg-primary !text-white !cursor-default flex gap-x-1 items-center"
                >
                  {label.fields.text}
                </Button>
              ))}
          </ul>
        </div>
      )}

      <ul className="pb-28">
        {filteredRecords.map((record) => (
          <li key={record.id}>
            <FacilityListItem facility={record} />
          </li>
        ))}
      </ul>
    </>
  )
}

export default MapPage

MapPage.layout = MapLayout
