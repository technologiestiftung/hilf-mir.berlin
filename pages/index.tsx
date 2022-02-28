import type { NextPage } from "next";
import Head from "next/head";
import useSWR from "swr";
import { Map } from "../src/components/Map";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }
  return data;
};

const Home: NextPage = () => {
  const { data, error } = useSWR(`/api/grist`, fetcher);

  if (error) return <div>{error.message}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <Head>
        <title>Grist External Map - Proof of concept</title>
      </Head>
      <Map markers={data.records} />
    </div>
  );
};

export default Home;
