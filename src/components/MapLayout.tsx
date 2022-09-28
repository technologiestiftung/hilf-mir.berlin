import { FeatureType } from '@lib/requests/geocode'
import { FC, useState } from 'react'
import { Search } from './Search'
import { FacilitiesMap } from './Map'
import classNames from '@lib/classNames'
import { useRouter } from 'next/router'
import { mapRawQueryToState } from '@lib/mapRawQueryToState'
import { MinimalRecordType } from '@lib/mapRecordToMinimum'
import { GristLabelType } from '@common/types/gristData'
import { LabelsProvider } from '@lib/LabelsContext'

export const MapLayout: FC<{
  records: MinimalRecordType[]
  labels: GristLabelType[]
}> = ({ children, records, labels }) => {
  const { pathname } = useRouter()
  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>()

  const { query } = useRouter()
  const mappedQuery = mapRawQueryToState(query)

  const handleMarkerClick = (facilityId: number): void => {
    console.log(facilityId)
    if (!records) return
  }

  const handleSearchResult = (place: FeatureType): void => {
    setMapCenter(place.center)
  }
  return (
    <main>
      <article className="fixed w-screen h-screen inset-0 lg:left-sidebarW lg:w-mapW">
        <Search onSelectResult={handleSearchResult} />
        {records && (
          <FacilitiesMap
            center={mapCenter}
            markers={records}
            activeTags={mappedQuery.tags || []}
            onMarkerClick={handleMarkerClick}
          />
        )}
      </article>
      <aside
        className={classNames(
          `lg:w-sidebarW shadow-2xl lg:shadow-xl lg:h-screen lg:overflow-y-auto`,
          `z-10 relative bg-white mt-[80vh] md:lg:mt-0 rounded-t-2xl border-t border-gray-20`,
          pathname === '/map' && `mt-[50vh]`
        )}
      >
        {children}
      </aside>
    </main>
    <LabelsProvider value={labels}>
      <main>
        <article className="fixed w-screen h-screen inset-0 lg:left-sidebarW lg:w-mapW">
          <Search onSelectResult={handleSearchResult} />
          {records && (
            <FacilitiesMap
              center={mapCenter}
              markers={records}
              activeTags={mappedQuery.tags || []}
              onMarkerClick={handleMarkerClick}
            />
          )}
        </article>
        <aside
          className={classNames(
            `lg:w-sidebarW shadow-2xl lg:shadow-xl lg:h-screen lg:overflow-y-auto`,
            `z-10 relative bg-white mt-[80vh] md:lg:mt-0 rounded-t-2xl border-t border-gray-20`,
            pathname === '/map' && `mt-[50vh]`
          )}
        >
          {children}
        </aside>
      </main>
    </LabelsProvider>
  )
}
