import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import useSWR from "swr";
import { TableRowType } from "../src/common/types/gristData";
import { FacilityInfo } from "../src/components/FacilityInfo";
import { Map } from "../src/components/Map";
import { Sidebar } from "../src/components/Sidebar";
const citylabLogo = "images/citylab_logo.svg";

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

  const handleMarkerClick = (facilityId: number) => {
    if (!data) return;
    const sel = data?.records.find((facility) => facility.id === facilityId);
    if (!sel) return;
    console.log(sel);
    setSelectedFacility(sel);
  };

  if (error) return <div>{error.message}</div>;

  return (
    <>
      <Head>
        <title>Psychologische Unterstützung in Berlin - Prototyp</title>
      </Head>
      <div className="w-screen h-screen grid grid-cols-1 grid-rows-[auto_1fr]">
        <header className="px-4 py-3 flex flex-wrap gap-2 items-center justify-between border-b border-gray-200">
          <h1 className="text-gray-800">
            <strong>Psychologische Unterstützung</strong> <span>in Berlin</span>
          </h1>
          <div className="flex gap-3 items-center">
            <span className="text-sm text-gray-800">Ein Prototyp des</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={citylabLogo}
              alt="Logo des CityLAB Berlin"
              className="h-8 w-auto"
            />
          </div>
        </header>
        <div className="w-full h-full grid grid-cols-[4fr_8fr]">
          <Sidebar>
            {selectedFacility && (
              <FacilityInfo
                facility={selectedFacility}
                onClose={() => setSelectedFacility(null)}
              />
            )}
            {!selectedFacility && (
              <p>Bitte wähle eine Einrichtung auf der Karte aus.</p>
            )}
          </Sidebar>
          {!data && !error && <p>Lade ...</p>}
          {data && (
            <Map markers={data.records} onMarkerClick={handleMarkerClick} />
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
