import { FeatureType } from '@lib/requests/geocode'
import { FC, useState } from 'react'
import { FacilitiesMap } from './Map'
import classNames from '@lib/classNames'
import { useRouter } from 'next/router'
import { MinimalRecordType } from '@lib/mapRecordToMinimum'
import { GristLabelType } from '@common/types/gristData'
import { LabelsProvider } from '@lib/LabelsContext'
import { FiltersList } from './FiltersList'
import { useUrlState } from '@lib/UrlStateContext'
import { useTexts } from '@lib/TextsContext'
import { Map } from './icons/Map'
import { List } from './icons/List'
import { MapUi } from './MapUi'
import { Cross } from './icons/Cross'

export const MapLayout: FC<{
  records: MinimalRecordType[]
  labels: GristLabelType[]
}> = ({ children, records, labels }) => {
  const { pathname, isFallback } = useRouter()
  const texts = useTexts()
  const [listViewOpen, setListViewOpen] = useState<boolean>(false)
  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>()
  const [filterSidebarIsOpened, setFilterSidebarIsOpened] = useState(false)
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
      <main
        className={classNames(
          `inset-0 lg:left-sidebarW transition-all`,
          `overflow-hidden lg:w-mapW`
        )}
      >
        {!isFallback && (
          <div className="fixed inset-0 z-10 lg:left-sidebarW">
            <FacilitiesMap
              center={mapCenter}
              markers={records}
              activeTags={urlState.tags}
              onMarkerClick={handleMarkerClick}
            />
          </div>
        )}
        <aside
          className={classNames(
            `fixed w-screen h-screen top-0 left-0 overflow-y-auto`,
            `lg:w-sidebarW lg:shadow-xl`,
            `z-20 relative bg-white min-h-screen transition-transform`,
            pathname === '/map' && listViewOpen && `translate-y-0 pt-20`,
            pathname === '/map' &&
              !listViewOpen &&
              `translate-y-[100vh] lg:translate-y-0`
          )}
        >
          {children}
        </aside>
        {!isFallback && (
          <MapUi
            handleSearchResult={handleSearchResult}
            filterSidebarIsOpened={filterSidebarIsOpened}
            setFilterSidebarIsOpened={setFilterSidebarIsOpened}
            listViewOpen={listViewOpen}
            setListViewOpen={setListViewOpen}
          />
        )}
        <aside
          className={classNames(
            `fixed inset-0 left-auto w-screen lg:w-sidebarW z-20`,
            `transition-transform bg-white overflow-y-auto`,
            !filterSidebarIsOpened && `translate-x-full`
          )}
        >
          {!isFallback && (
            <>
              <h3
                className={classNames(
                  `sticky top-0 flex justify-between`,
                  `px-5 py-6 bg-white border-b border-gray-10`,
                  `font-bold uppercase text-2xl items-center leading-tight`
                )}
              >
                {texts.filterLabel}
                <button
                  className="text-red"
                  onClick={() => setFilterSidebarIsOpened(false)}
                >
                  <Cross />
                </button>
              </h3>
              <div className="p-5">
                <FiltersList
                  recordsWithOnlyLabels={(records || []).map((r) => r.labels)}
                />
              </div>
            </>
          )}
        </aside>
      </main>
    </LabelsProvider>
  )
}
