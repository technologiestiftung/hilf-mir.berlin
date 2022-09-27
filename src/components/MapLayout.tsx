import { TableRowType } from '@common/types/gristData'
import { useTexts } from '@lib/TextsContext'
import { FeatureType } from '@lib/requests/geocode'
import { FC, useState } from 'react'
import { Search } from './Search'
import { FacilitiesMap } from './Map'
import { useRouter } from 'next/router'
import { mapRawQueryToState } from '@lib/mapRawQueryToState'

export const MAP_CONFIG = {
  defaultZoom: 11,
  defaultLatitude: 52.520008,
  defaultLongitude: 13.404954,
}

export const MapLayout: FC<{
  records: TableRowType[]
}> = ({ children, records }) => {
  const texts = useTexts()
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
    <div className="w-screen h-screen grid grid-cols-1 grid-rows-[auto_1fr]">
      <header className="h-16 pl-4 pr-3 py-3 flex flex-wrap gap-2 items-center justify-between border-b border-gray-50">
        <h1 className="font-bold">{texts.siteTitle}</h1>
      </header>
      <div className="w-full h-full">
        <Search onSelectResult={handleSearchResult} />
        {records && (
          <FacilitiesMap
            center={mapCenter}
            markers={records}
            activeTags={mappedQuery.tags}
            onMarkerClick={handleMarkerClick}
            initialViewportProps={{
              latitude: MAP_CONFIG.defaultLatitude,
              longitude: MAP_CONFIG.defaultLongitude,
              zoom: MAP_CONFIG.defaultZoom,
            }}
          />
        )}
        {children}
      </div>
    </div>
  )
}
