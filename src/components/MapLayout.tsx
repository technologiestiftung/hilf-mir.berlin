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
import { MapListSwitch } from './MapListSwitch'
import { Cross } from './icons/Cross'
import { LngLatLike } from 'maplibre-gl'
import { FacilityCarousel } from './FacilityCarousel'
import { MapHeader } from './MapHeader'
import { MapButtons } from './MapButtons'
import { IconButton } from './IconButton'
import { Arrow } from './icons/Arrow'

const SCROLL_THRESHOLD = 300

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
  const [hasScrolled, setHasScrolled] = useState<boolean>(false)

  useEffect(() => {
    const scrollContainer = document.getElementById('main-sidebar')
    if (!scrollContainer) return
    const onScroll: EventListener = (evt) => {
      if (!evt?.target) return
      const container = evt.target as unknown as { scrollTop: number }
      if (container.scrollTop > SCROLL_THRESHOLD) {
        setHasScrolled(true)
      } else {
        setHasScrolled(false)
      }
    }
    scrollContainer.addEventListener('scroll', onScroll)
    return () => scrollContainer.removeEventListener('scroll', onScroll)
  }, [setHasScrolled])

  const handleMarkerClick = (facilities: MinimalRecordType[]): void => {
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
        {!isFallback && pathname === '/map' && <MapButtons />}
        {!isFallback && selectedFacilities.length === 0 && (
          <MapListSwitch
            listViewOpen={listViewOpen}
            setListViewOpen={setListViewOpen}
          />
        )}
        {((pathname === '/map' && listViewOpen) ||
          (pathname !== '/' && pathname !== '/map')) && (
          <div
            className={classNames(
              `fixed left-full lg:left-sidebarW -translate-x-full z-40 pr-5`,
              `top-full -translate-y-full pb-8 lg:pb-5 transition-opacity`,
              hasScrolled ? 'opacity-100' : `opacity-0 pointer-events-none`
            )}
          >
            <IconButton
              className="flex"
              onClick={() => {
                const aside = document.getElementById(`main-sidebar`)
                if (!aside) return
                aside.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              tabIndex={hasScrolled ? 0 : -1}
            >
              <Arrow orientation="up" />
            </IconButton>
          </div>
        )}
        <FacilityCarousel facilities={selectedFacilities} />
        <aside
          id="main-sidebar"
          className={classNames(
            `fixed w-screen h-screen top-0 left-0 overflow-y-auto`,
            `lg:w-sidebarW lg:shadow-xl`,
            pathname === '/map' ? 'z-20' : 'z-30',
            `relative bg-white min-h-screen transition-transform`,
            pathname === '/map' &&
              listViewOpen &&
              `translate-y-0 pt-20 lg:pt-0`,
            pathname === '/map' &&
              !listViewOpen &&
              `translate-y-[100vh] lg:translate-y-0`
          )}
        >
          {!isFallback && children}
        </aside>
        {pathname === '/map' && (
          <MapHeader
            handleSearchResult={handleSearchResult}
            filterSidebarIsOpened={filterSidebarIsOpened}
            setFilterSidebarIsOpened={setFilterSidebarIsOpened}
            listViewOpen={listViewOpen}
          />
        )}
        <aside
          id="main-sidebar"
          className={classNames(
            `fixed inset-0 left-auto w-screen lg:w-sidebarW z-40`,
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
