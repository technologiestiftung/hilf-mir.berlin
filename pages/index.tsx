import type { NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { Map } from "../src/components/Map";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Grist External Map - Proof of concept</title>
      </Head>
      <Map />
    </div>
  );
};

export default Home;
