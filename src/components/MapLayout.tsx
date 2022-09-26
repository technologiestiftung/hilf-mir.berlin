import { TableRowType } from '@common/types/gristData'
import { FeatureType } from '@lib/requests/geocode'
import { FC, useState } from 'react'
import { Search } from './Search'
import { FacilitiesMap } from './Map'

export const MapLayout: FC<{
  records: TableRowType[]
}> = ({ children, records }) => {
  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>()

  const handleMarkerClick = (facilityId: number): void => {
    console.log(facilityId)
    if (!records) return
  }

  const handleSearchResult = (place: FeatureType): void => {
    setMapCenter(place.center)
  }
  return (
    <section>
      <div className="fixed w-screen h-screen inset-0 lg:left-sidebarW lg:w-mapW">
        <Search onSelectResult={handleSearchResult} />
        {records && (
          <FacilitiesMap
            center={mapCenter}
            markers={records}
            onMarkerClick={handleMarkerClick}
          />
        )}
      </div>
      <article>{children}</article>
    </section>
  )
}
