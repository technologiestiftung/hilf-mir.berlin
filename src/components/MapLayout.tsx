import { FeatureType } from '@lib/requests/geocode'
import { FC, useEffect, useState } from 'react'
import { FacilitiesMap } from './Map'
import classNames from '@lib/classNames'
import { useRouter } from 'next/router'
import { MinimalRecordType } from '@lib/mapRecordToMinimum'
import { GristLabelType } from '@common/types/gristData'
import { LabelsProvider } from '@lib/LabelsContext'
import { FiltersList } from './FiltersList'
import { useUrlState } from '@lib/UrlStateContext'
import { useTexts } from '@lib/TextsContext'
import { MapUi } from './MapUi'
import { Cross } from './icons/Cross'
import { LngLatLike } from 'maplibre-gl'
import { FacilityCarousel } from './FacilityCarousel'

export const MapLayout: FC<{
  records: MinimalRecordType[]
  labels: GristLabelType[]
  center?: LngLatLike
}> = ({ children, records, labels, center }) => {
  const { pathname, isFallback } = useRouter()
  const texts = useTexts()
  const [listViewOpen, setListViewOpen] = useState<boolean>(false)
  const [mapCenter, setMapCenter] = useState<LngLatLike | undefined>(center)
  const [selectedFacilities, setSelectedFacilities] = useState<
    MinimalRecordType[]
  >([])
  const [filterSidebarIsOpened, setFilterSidebarIsOpened] = useState(false)
  const [urlState, setUrlState] = useUrlState()

  const handleMarkerClick = (facilities: MinimalRecordType[]): void => {
    console.log(facilities)
    setSelectedFacilities(facilities)
    if (!records) return
  }

  const handleSearchResult = (place: FeatureType): void => {
    setMapCenter(place.center)
    setUrlState({
      longitude: place.center[0],
      latitude: place.center[1],
    })
  }

  useEffect(() => {
    setMapCenter(center)
  }, [center])

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
              markers={records}
              activeTags={urlState.tags}
              onMarkerClick={handleMarkerClick}
              onMoveStart={() => {
                setSelectedFacilities([])
              }}
              onClickAnywhere={() => {
                setSelectedFacilities([])
              }}
              highlightedCenter={mapCenter}
            />
          </div>
        )}
        {pathname === '/map' && (
          <FacilityCarousel facilities={selectedFacilities} />
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
          {!isFallback && children}
        </aside>
        {!isFallback && (
          <MapUi
            handleSearchResult={handleSearchResult}
            filterSidebarIsOpened={filterSidebarIsOpened}
            setFilterSidebarIsOpened={setFilterSidebarIsOpened}
            listViewOpen={listViewOpen}
            setListViewOpen={setListViewOpen}
            hasSelectedFacilities={selectedFacilities.length > 0}
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
