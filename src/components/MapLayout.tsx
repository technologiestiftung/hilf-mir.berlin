import { FeatureType } from '@lib/requests/geocode'
import { FC, useState } from 'react'
import { Search } from './Search'
import { FacilitiesMap } from './Map'
import classNames from '@lib/classNames'
import { useRouter } from 'next/router'
import { MinimalRecordType } from '@lib/mapRecordToMinimum'
import { GristLabelType } from '@common/types/gristData'
import { LabelsProvider } from '@lib/LabelsContext'
import { FiltersList } from './FiltersList'
import { useUrlState } from '@lib/UrlStateContext'

export const MapLayout: FC<{
  records: MinimalRecordType[]
  labels: GristLabelType[]
}> = ({ children, records, labels }) => {
  const { pathname } = useRouter()
  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>()
  const [filterSidebarIsOpened, setFilterSidebarIsOpened] = useState(true)
  const [urlState, setUrlState] = useUrlState()

  const handleMarkerClick = (facilityId: number): void => {
    console.log(facilityId)
    if (!records) return
  }

  const handleSearchResult = (place: FeatureType): void => {
    setMapCenter(place.center)
    setUrlState({
      longitude: place.center[0],
      latitude: place.center[1],
    })
  }

  return (
    <LabelsProvider value={labels}>
      <main>
        <article
          className={classNames(
            `fixed inset-0 lg:left-sidebarW transition-all`,
            `overflow-hidden lg:w-mapW`
          )}
        >
          <div className="relative w-full h-full flex items-center justify-center place-items-center">
            <div className="w-screen h-screen">
              <Search onSelectResult={handleSearchResult} />
              {records && (
                <FacilitiesMap
                  center={mapCenter}
                  markers={records}
                  activeTags={urlState.tags}
                  onMarkerClick={handleMarkerClick}
                />
              )}
            </div>
          </div>
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
        <aside
          className={classNames(
            `fixed inset-0 left-auto w-screen lg:w-sidebarW`,
            `transition-transform bg-white p-5 overflow-y-auto`,
            !filterSidebarIsOpened && `translate-x-full`
          )}
        >
          <button onClick={() => setFilterSidebarIsOpened(false)}>
            toggle
          </button>
          <FiltersList recordsWithOnlyLabels={records.map((r) => r.labels)} />
        </aside>
      </main>
    </LabelsProvider>
  )
}
