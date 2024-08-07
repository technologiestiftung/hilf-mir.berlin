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
import { FacilityListItem } from '@components/FacilityListItem'
import { useActiveIdsBySearchTerm } from '@lib/hooks/useActiveIdsBySearchTerm'
import ActiveFiltersList from '@components/ActiveFiltersList'

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
  }
}

interface MapProps {
  records: MinimalRecordType[]
  labels: GristLabelType[]
}

const MapPage: Page<MapProps> = ({ records: originalRecords }) => {
  const [urlState] = useUrlState()
  const texts = useTexts()
  const { query, isFallback } = useRouter()
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

  const tagsKey = urlState.tags?.join('-') || ''
  useEffect(() => {
    const filteredRecords = getFilteredFacilities({
      facilities: originalRecords,
      labels,
      activeIdsBySearchTerm: activeIdsBySearchTerm.ids,
    })
    return setFilteredRecords(sortFacilities(filteredRecords))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagsKey, activeIdsBySearchTerm.key, activeIdsBySearchTerm.isLoading])

  useEffect(() => {
    if (!query.back || typeof query.back !== 'string') return
    const prevItemId = query.back.replace('/', '')
    if (!prevItemId) return
    const listEl = document.getElementById(`facility-${prevItemId}`)
    if (!listEl) return
    listEl.scrollIntoView({ behavior: 'instant' as ScrollBehavior })
    listEl?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Head>
        <title>
          {isFallback
            ? 'Seite Lädt...'
            : `${texts.resultPageTitle} – ${texts.siteTitle}`}
        </title>
      </Head>
      <ActiveFiltersList />

      {filteredRecords.length === 0 && (
        <div className="p-5 border-b border-gray-20 bg-gray-10 bg-opacity-25">
          <p className="text-sm font-bold">{texts.noResults}</p>
        </div>
      )}

      {filteredRecords.length > 0 && (
        <ul className="pb-28">
          {filteredRecords.map((record) => (
            <li key={record.id}>
              <FacilityListItem facility={record} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default MapPage

MapPage.layout = MapLayout
