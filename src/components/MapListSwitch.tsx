import classNames from '@lib/classNames'
import { useTexts } from '@lib/TextsContext'
import { FC } from 'react'
import { List } from './icons/List'
import { Map } from './icons/Map'

interface MapListSwitchPropsType {
  listViewOpen: boolean
  setListViewOpen: (newState: boolean) => void
}

export const MapListSwitch: FC<MapListSwitchPropsType> = ({
  setListViewOpen,
  listViewOpen,
}) => {
  const texts = useTexts()
  return (
    <>
      <button
        onClick={() => setListViewOpen(!listViewOpen)}
        className={classNames(
          `lg:hidden max-w-[210px] font-headline font-bold`,
          `fixed sm:left-1/2 sm:-translate-x-1/2 z-30 items-center`,
          `left-1/2 -translate-x-1/2 bottom-8 rounded`,
          `border border-gray-20 px-4 py-2 text-xl`,
          `bg-white flex gap-3 text-left whitespace-nowrap`,
          `focus:outline-none focus:ring-2 focus:ring-primary`,
          `focus:ring-offset-2 focus:ring-offset-white`,
          `shadow-lg shadow-black/10`
        )}
      >
        <span className="-mt-1">{listViewOpen ? <Map /> : <List />}</span>
        {listViewOpen ? texts.seeMap : texts.seeList}
      </button>
    </>
  )
}
