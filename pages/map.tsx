import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import { TableRowType } from '@common/types/gristData'
import { FacilityInfo } from '@components/FacilityInfo'
import { FacilityPagination } from '@components/FacilityPagination'
import { FacilitiesMap } from '@components/Map'
import { Search } from '@components/Search'
import { Sidebar } from '@components/Sidebar'
import { FeatureType } from '@lib/requests/geocode'
import { getGristTexts } from '@lib/requests/getGristTexts'
import { getGristRecords } from '@lib/requests/getGristRecords'
const citylabLogo = 'images/citylab_logo.svg'
const sengpgLogo = 'images/sengpg_logo.svg'

export const getStaticProps: GetStaticProps = async () => {
  const [texts, records] = await Promise.all([
    getGristTexts(),
    getGristRecords(),
  ])
  return {
    props: { texts, records },
    revalidate: 120,
  }
}

const Home: NextPage<{
  records: TableRowType[]
}> = ({ records }) => {
  const [selectedFacility, setSelectedFacility] = useState<TableRowType | null>(
    null
  )

  const [facilityIdsAtLocation, setFacilityIdsAtLocation] = useState<number[]>(
    []
  )
  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>()

  const handleMarkerClick = (facilityIds: number[]): void => {
    if (!records) return
    setFacilityIdsAtLocation(facilityIds)

    const selectedFacility = records.find(
      (facility) => facility.id === facilityIds[0]
    )

    if (!selectedFacility) return
    setSelectedFacility(selectedFacility)
  }

  const handleSearchResult = (place: FeatureType): void => {
    setMapCenter(place.center)
  }

  return (
    <>
      <Head>
        <title>
          Digitaler Wegweiser Psychiatrie und Suchthilfe Berlin - Prototyp
        </title>
        <link
          href="https://unpkg.com/maplibre-gl@2.1.6/dist/maplibre-gl.css"
          rel="stylesheet"
        />
      </Head>
      <div className="w-screen h-screen grid grid-cols-1 grid-rows-[auto_1fr]">
        <header className="h-16 pl-4 pr-3 py-3 flex flex-wrap gap-2 items-center justify-between border-b border-gray-50">
          <h1 className="font-bold">
            Digitaler Wegweiser Psychiatrie und Suchthilfe Berlin
          </h1>
          <div className="hidden md:flex gap-4 items-center">
            <span className="text-sm">Eine Kooperation von</span>
            <img
              src={citylabLogo}
              alt="Logo des CityLAB Berlin"
              className="h-8 w-auto"
            />
            <img
              src={sengpgLogo}
              alt="Logo der Senatsverwaltung für Wissenschaft, Gesundheit, Pflege und Gleichstellung in Berlin"
              className="h-9 w-auto"
            />
          </div>
        </header>
        <div className="w-full h-full">
          <Sidebar isOpen={!!selectedFacility}>
            <>
              {facilityIdsAtLocation.length > 1 && (
                <FacilityPagination
                  facilityIds={facilityIdsAtLocation}
                  onChange={(facilityId) => {
                    const selectedFacility = records.find(
                      (facility) => facility.id === facilityId
                    )
                    if (!selectedFacility) return
                    setSelectedFacility(selectedFacility)
                  }}
                />
              )}
            </>
            {selectedFacility && (
              <FacilityInfo
                facility={selectedFacility}
                onClose={() => {
                  setFacilityIdsAtLocation([])
                  setSelectedFacility(null)
                }}
              />
            )}
          </Sidebar>
          <Search onSelectResult={handleSearchResult} />
          {records && (
            <FacilitiesMap
              center={mapCenter}
              markers={records}
              onMarkerClick={handleMarkerClick}
              highlightedLocation={
                !!selectedFacility?.fields.long2 &&
                !!selectedFacility?.fields.lat
                  ? [
                      selectedFacility?.fields.long2,
                      selectedFacility?.fields.lat,
                    ]
                  : undefined
              }
            />
          )}
        </div>
      </div>
    </>
  )
}

export default Home
