import classNames from '@lib/classNames'
import { FeatureType } from '@lib/requests/geocode'
import { useTexts } from '@lib/TextsContext'
import { useUrlState } from '@lib/UrlStateContext'
import Link from 'next/link'
import { FC } from 'react'
import { House } from './icons/House'
import { Info } from './icons/Info'
import { List } from './icons/List'
import { Map } from './icons/Map'
import { Phone } from './icons/Phone'
import { Search } from './Search'

interface MapUiPropsType {
  filterSidebarIsOpened: boolean
  listViewOpen: boolean
  setFilterSidebarIsOpened: (newState: boolean) => void
  setListViewOpen: (newState: boolean) => void
  handleSearchResult: ((place: FeatureType) => void) | undefined
  hasSelectedFacilities?: boolean
}

interface IconButtonPropsType {
  className?: string
  'aria-label'?: string
  pathName: string
}

const IconButton: FC<IconButtonPropsType> = ({
  className = '',
  pathName,
  children,
  'aria-label': ariaLabel,
}) => {
  const [urlState] = useUrlState()
  return (
    <Link href={{ pathname: pathName, query: { ...urlState } }}>
      <a
        className={classNames(
          className,
          `h-12 w-12 border border-black bg-white`,
          `justify-center items-center shrink-0`,
          `hover:bg-red hover:text-white transition-colors`,
          `focus:outline-none focus:ring-2 focus:ring-red`,
          `focus:ring-offset-2 focus:ring-offset-white focus:z-30`
        )}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    </Link>
  )
}

const OtherButtons: FC<{
  hasSelectedFacilities?: boolean
}> = ({ hasSelectedFacilities = false }) => {
  const texts = useTexts()
  return (
    <div
      className={classNames(
        `fixed flex flex-col right-4 z-10 focus-within:z-20`,
        hasSelectedFacilities ? `bottom-32` : `bottom-8`
      )}
    >
      <IconButton
        pathName="/sofortige-hilfe"
        className="flex text-red border-b-0 focus:border-b"
        aria-label={texts.directHelpButtonText}
      >
        <Phone />
      </IconButton>
      <IconButton
        pathName="/info"
        className="flex"
        aria-label={texts.footerInfoPageLinkText}
      >
        <Info />
      </IconButton>
    </div>
  )
}

export const MapUi: FC<MapUiPropsType> = ({
  filterSidebarIsOpened,
  setListViewOpen,
  setFilterSidebarIsOpened,
  handleSearchResult,
  listViewOpen,
  hasSelectedFacilities = false,
}) => {
  const texts = useTexts()
  const [urlState] = useUrlState()

  return (
    <>
      <div
        className={classNames(
          `fixed inset-0 z-20 bottom-auto h-20`,
          listViewOpen ? `opacity-100` : `opacity-0`,
          `lg:opacity-0 transition-opacity`,
          `bg-white border-b border-black`
        )}
      ></div>
      <IconButton
        pathName="/"
        className={classNames(
          'flex border-r-0 md:border-r',
          `fixed lg:left-sidebarW ml-4 top-4 z-20`
        )}
        aria-label={texts.backToHome}
      >
        <House />
      </IconButton>
      <div
        className={classNames(
          `flex fixed top-4 right-4 transition-transform z-20 sm:z-20`,
          `w-full max-w-[calc(100vw-2rem)] md:max-w-xs lg:max-w-sm justify-between`,
          filterSidebarIsOpened
            ? `2xl:-translate-x-sidebarW`
            : `2xl:translate-x-0`
        )}
      >
        <IconButton
          pathName="/"
          className="flex md:hidden border-r-0 md:border-r"
          aria-label={texts.backToHome}
        >
          <House />
        </IconButton>
        <Search onSelectResult={handleSearchResult} />
        <button
          onClick={() => setFilterSidebarIsOpened(!filterSidebarIsOpened)}
          className={classNames(
            `flex items-center group relative`,
            `focus:border-l focus:z-20`,
            `focus:outline-none focus:ring-2 focus:ring-red`,
            `focus:ring-offset-2 focus:ring-offset-white`
          )}
        >
          <span
            className={classNames(
              `border border-black border-l-0`,
              `px-4 py-2 h-12 text-xl font-bold`,
              `bg-white text-left whitespace-nowrap`,
              `transition-colors group-hover:bg-red group-hover:text-white`
            )}
          >
            {texts.filterLabel}
          </span>
          {urlState.tags && urlState.tags.length > 0 && (
            <span
              className={classNames(
                `border border-black border-l-0`,
                `flex items-center h-12 w-12 text-lg justify-center`,
                `bg-red text-white font-bold text-center leading-4`
              )}
            >
              {urlState.tags.length}
            </span>
          )}
        </button>
      </div>
      <button
        onClick={() => setListViewOpen(!listViewOpen)}
        className={classNames(
          `lg:hidden max-w-[210px]`,
          `fixed sm:left-1/2 sm:-translate-x-1/2 z-20 items-center`,
          listViewOpen && `left-1/2 -translate-x-1/2 bottom-8`,
          !listViewOpen && [
            `right-16 border-r-0 sm:border-r h-12 focus:border-r`,
            hasSelectedFacilities ? `bottom-32` : `bottom-8`,
          ],
          `border border-black px-4 py-2 text-xl font-bold`,
          `bg-white flex gap-3 text-left whitespace-nowrap`,
          `focus:outline-none focus:ring-2 focus:ring-red`,
          `focus:ring-offset-2 focus:ring-offset-white focus:z-30`
        )}
      >
        {listViewOpen ? <Map /> : <List />}
        {listViewOpen ? texts.seeMap : texts.seeList}
      </button>
      <OtherButtons hasSelectedFacilities={hasSelectedFacilities} />
    </>
  )
}
