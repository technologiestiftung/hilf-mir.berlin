import { FC, useCallback, useEffect, useState } from 'react'
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
import { FacilityCarousel } from './FacilityCarousel'
import { MapHeader } from './MapHeader'
import { MapButtons } from './MapButtons'
import { IconButton } from './IconButton'
import { Arrow } from './icons/Arrow'
import { useIsMobile } from '@lib/hooks/useIsMobile'
import { getColorByFacilityType } from '@lib/facilityTypeUtil'

const SCROLL_THRESHOLD = 300
const LARGE_SCREEN_BREAKPOINT_MIN_WIDTH = 1920

export const MapLayout: FC<{
  records: MinimalRecordType[]
  labels: GristLabelType[]
}> = ({ children, records, labels }) => {
  const { query, pathname } = useRouter()
  const texts = useTexts()
  const [listViewOpen, setListViewOpen] = useState<boolean>(true)
  const [selectedFacility, setSelectedFacility] = useState<MinimalRecordType>()
  const [selectedFacilities, setSelectedFacilities] = useState<
    MinimalRecordType[]
  >([])
  const [filterSidebarIsOpened, setFilterSidebarIsOpened] = useState(false)
  const [urlState] = useUrlState()
  const [hasScrolled, setHasScrolled] = useState<boolean>(false)
  const isMobile = useIsMobile()

  const showMapUi = (isMobile && pathname === '/map') || !isMobile

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

  useEffect(() => {
    setSelectedFacilities([])
    if (!query.id || typeof query.id !== 'string') {
      setSelectedFacility(undefined)
      return
    }
    const currentId = parseInt(`${query.id}`, 10)
    const currentRecord = records.find(({ id }) => id === currentId)
    if (!currentRecord) return
    setSelectedFacility(currentRecord)
  }, [query.id, records])

  const updateSidebarVisibility = useCallback(
    (evt: MediaQueryListEvent | boolean) => {
      const isMatch = typeof evt === 'boolean' ? evt : evt?.matches || false
      setFilterSidebarIsOpened(isMatch)
    },
    [setFilterSidebarIsOpened]
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const minWidth = LARGE_SCREEN_BREAKPOINT_MIN_WIDTH
    updateSidebarVisibility(window.innerWidth > minWidth)
    const windowWidthMediaQuery = window.matchMedia(
      `(min-width: ${minWidth}px)`
    )

    windowWidthMediaQuery.addEventListener('change', updateSidebarVisibility)
    return () =>
      windowWidthMediaQuery.removeEventListener(
        'change',
        updateSidebarVisibility
      )
  }, [setFilterSidebarIsOpened, updateSidebarVisibility])

  const validSelectedFacilities = selectedFacilities.filter(Boolean)
  return (
    <LabelsProvider value={labels}>
      <main
        className={classNames(
          `inset-0 lg:left-sidebarW transition-all`,
          `overflow-hidden lg:w-mapW`
        )}
      >
        <div className="fixed inset-0 z-10 lg:left-sidebarW">
          <FacilitiesMap
            markers={records}
            activeTags={urlState.tags}
            onMarkerClick={handleMarkerClick}
            onMoveStart={() => setSelectedFacilities([])}
            onClickAnywhere={() => setSelectedFacilities([])}
            highlightedFacility={selectedFacility}
          />
          {validSelectedFacilities.map(({ id }) => (
            <div
              key={id}
              className={classNames(
                'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                'opacity-0 delay-700 animate-fadein-delay-400',
                'pointer-events-none w-8 h-8 rounded-full',
                'ring-2 ring-primary',
                'ring-offset-2 ring-offset-white',
                'transition-colors'
              )}
              style={{
                backgroundColor:
                  validSelectedFacilities.length > 1
                    ? 'transparent'
                    : getColorByFacilityType(validSelectedFacilities[0].type),
              }}
            />
          ))}
        </div>
        {showMapUi && <MapButtons />}
        {isMobile && pathname === '/map' && selectedFacilities.length === 0 && (
          <MapListSwitch
            listViewOpen={listViewOpen}
            setListViewOpen={setListViewOpen}
          />
        )}
        {showMapUi && listViewOpen && (
          <div
            className={classNames(
              `fixed left-full lg:left-sidebarW -translate-x-full z-40 pr-5`,
              `top-full -translate-y-full pb-8 lg:pb-5 transition-opacity`,
              hasScrolled ? 'opacity-100' : `opacity-0 pointer-events-none`
            )}
          >
            <IconButton
              className="flex drop-shadow-lg"
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
            `lg:w-sidebarW lg:shadow-xl z-10`,
            `relative bg-white min-h-screen transition-transform`,
            showMapUi && listViewOpen && `translate-y-0 pt-20 lg:pt-0`,
            showMapUi && !listViewOpen && `translate-y-[100vh] lg:translate-y-0`
          )}
        >
          {children}
        </aside>
        {showMapUi && (
          <MapHeader
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
          {
            <>
              <h3
                className={classNames(
                  `sticky top-0 flex justify-between font-bold`,
                  `px-5 py-6 bg-white border-b border-gray-10`,
                  `text-2xl items-center leading-tight z-10`
                )}
              >
                {texts.filterLabel}
                <button
                  className="text-primary"
                  onClick={() => setFilterSidebarIsOpened(false)}
                >
                  <Cross />
                </button>
              </h3>
              <div className="p-5">
                <FiltersList
                  recordsWithOnlyLabels={(records || []).map((r) => [
                    r.id,
                    r.labels,
                  ])}
                  onSubmit={() => setFilterSidebarIsOpened(false)}
                />
              </div>
            </>
          }
        </aside>
      </main>
    </LabelsProvider>
  )
}
