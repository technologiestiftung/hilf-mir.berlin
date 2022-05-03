import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import useSWR from "swr";
import { TableRowType } from "../src/common/types/gristData";
import { FacilityInfo } from "../src/components/FacilityInfo";
import { FacilityPagination } from "../src/components/FacilityPagination";
import { FacilitiesMap } from "../src/components/Map";
import { Search } from "../src/components/Search";
import { Sidebar } from "../src/components/Sidebar";
import { FeatureType } from "../src/lib/requests/geocode";
const citylabLogo = "images/citylab_logo.svg";
const sengpgLogo = "images/sengpg_logo.svg";

interface FetcherReturnType {
  records: TableRowType[];
}
const fetcher = async (url: string): Promise<FetcherReturnType> => {
  const res = await fetch(url);
  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }
  return data;
};

const Home: NextPage = () => {
  const { data, error } = useSWR(`/api/grist`, fetcher);
  const [selectedFacility, setSelectedFacility] = useState<TableRowType | null>(
    null
  );

  const [facilityIdsAtLocation, setFacilityIdsAtLocation] = useState<number[]>(
    []
  );
  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>();

  const handleMarkerClick = (facilityIds: number[]) => {
    if (!data) return;
    setFacilityIdsAtLocation(facilityIds);

    const selectedFacility = data?.records.find(
      (facility) => facility.id === facilityIds[0]
    );

    if (!selectedFacility) return;
    setSelectedFacility(selectedFacility);
  };

  const handleSearchResult = (place: FeatureType) => {
    setMapCenter(place.center);
  };

  if (error) return <div>{error.message}</div>;

  return (
    <>
      <Head>
        <title>Psychologischer Wegweiser - Prototyp</title>
      </Head>
      <div className="w-screen h-screen grid grid-cols-1 grid-rows-[auto_1fr]">
        <header className="h-16 pl-4 pr-3 py-3 flex flex-wrap gap-2 items-center justify-between border-b border-gray-50">
          <h1 className="font-bold">Psychologischer Wegweiser</h1>
          <div className="hidden md:flex gap-4 items-center">
            <span className="text-sm">Eine Kooperation von</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={citylabLogo}
              alt="Logo des CityLAB Berlin"
              className="h-8 w-auto"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
                    const selectedFacility = data?.records.find(
                      (facility) => facility.id === facilityId
                    );
                    if (!selectedFacility) return;
                    setSelectedFacility(selectedFacility);
                  }}
                />
              )}
            </>
            {selectedFacility && (
              <FacilityInfo
                facility={selectedFacility}
                onClose={() => {
                  setFacilityIdsAtLocation([]);
                  setSelectedFacility(null);
                }}
              />
            )}
          </Sidebar>
          <Search onSelectResult={handleSearchResult} />
          {!data && !error && <p>Lade ...</p>}
          {data && (
            <FacilitiesMap
              center={mapCenter}
              markers={data.records}
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
  );
};

export default Home;
