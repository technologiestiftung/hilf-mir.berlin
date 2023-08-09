import classNames from '@lib/classNames'
import { useTexts } from '@lib/TextsContext'
import { FC } from 'react'
import { IconButtonLink } from './IconButton'
import { House } from './icons/House'

interface MapHeaderPropsType {
  filterSidebarIsOpened: boolean
  listViewOpen: boolean
  setFilterSidebarIsOpened: (newState: boolean) => void
}

export const MapHeader: FC<MapHeaderPropsType> = ({
  filterSidebarIsOpened,
  setFilterSidebarIsOpened,
  listViewOpen,
}) => {
  const texts = useTexts()

  return (
    <>
      <div
        className={classNames(
          `fixed inset-0 z-30 bottom-auto h-20`,
          listViewOpen ? `opacity-100` : `opacity-0`,
          `lg:opacity-0 transition-opacity shadow-md shadow-black/5`,
          `bg-white border-b border-gray-20 pointer-events-none`
        )}
      />
      <IconButtonLink
        pathName="/"
        className={classNames(
          'flex border-r-0 md:border-r',
          `fixed lg:left-sidebarW ml-4 top-4 z-30`,
          !listViewOpen && `shadow-md shadow-black/5`
        )}
        aria-label={texts.backToHome}
      >
        <House />
      </IconButtonLink>
      <div
        className={classNames(
          `flex fixed top-4 right-4 transition-transform z-30 md:gap-5`,
          filterSidebarIsOpened
            ? `2xl:-translate-x-sidebarW`
            : `2xl:translate-x-0`
        )}
      >
        <IconButtonLink
          pathName="/"
          className={classNames(
            'flex md:hidden border-r md:rounded-r focus:rounded',
            !listViewOpen &&
              '!border-r-trasparent !focus:border-r-gray-20 rounded-r-none'
          )}
          aria-label={texts.backToHome}
        >
          <House />
        </IconButtonLink>

        {!filterSidebarIsOpened && (
          <button
            onClick={() => setFilterSidebarIsOpened(!filterSidebarIsOpened)}
            className={classNames(
              `flex items-center group relative border-gray-20`,
              `focus:border-l focus:z-20 focus:rounded`,
              `focus:outline-none focus:ring-2 focus:ring-primary`,
              `focus:ring-offset-2 focus:ring-offset-white`
            )}
          >
            <span
              className={classNames(
                `border border-gray-20 font-bold`,
                `px-4 py-2.5 h-12 text-xl`,
                `rounded group-focus:rounded`,
                !listViewOpen && `shadow-md shadow-black/5`,
                `text-left whitespace-nowrap items-center`,
                `transition-colors group-hover:bg-primary group-hover:text-white`,
                `bg-white`
              )}
            >
              {texts.filterLabel}
            </span>
          </button>
        )}
      </div>
    </>
  )
}
