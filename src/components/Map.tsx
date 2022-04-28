import { useEffect, FC } from "react";
import maplibregl from "maplibre-gl";
import { createGeoJsonStructure } from "../lib/createGeojsonStructure";

interface MapType {
  markers?: MarkerType[];
}

export interface MarkerType {
  id: number;
  fields: {
    X: number;
    Y: number;
    e_name: string;
    [key: string]: unknown;
  };
}

export const Map: FC<MapType> = ({ markers }) => {
  useEffect(() => {
    const map = new maplibregl.Map({
      container: "map",
      style: `https://api.maptiler.com/maps/basic/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`,
      center: [13.404954, 52.520008],
      zoom: 11,
    });

    if (!markers) return;

    map.on("load", function () {
      map.addSource("facilities", {
        type: "geojson",
        data: createGeoJsonStructure(markers),
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "facilities",
        paint: {
          // Use step expressions (https://maplibre.org/maplibre-gl-js-docs/style-spec/#expressions-step)
          // with three steps to implement three types of circles:
          //   * Blue, 20px circles when point count is less than 100
          //   * Yellow, 30px circles when point count is between 100 and 750
          //   * Pink, 40px circles when point count is greater than or equal to 750
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#51bbd6",
            50,
            "#f1f075",
            100,
            "#f28cb1",
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            50,
            30,
            100,
            35,
          ],
        },
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "facilities",
        //filter: ['has', 'point_count'],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
      });

      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "facilities",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#11b4da",
          "circle-radius": 8,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
      });

      map.on("click", "clusters", function (e) {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        const clusterId = features[0].properties.cluster_id;
        // @ts-ignore
        map
          .getSource("facilities")
          // @ts-ignore
          .getClusterExpansionZoom(clusterId, function (err, zoom) {
            if (err) return;
            if (!zoom) return;

            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom,
            });
          });
      });

      map.on("click", "unclustered-point", function (e) {
        // @ts-ignore
        const coordinates = e.features[0].geometry.coordinates.slice();
        // @ts-ignore
        const name = e.features[0].properties.Projekt;

        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        /* while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        } */

        new maplibregl.Popup().setLngLat(coordinates).setText(name).addTo(map);
      });

      map.on("mouseenter", "clusters", function () {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "clusters", function () {
        map.getCanvas().style.cursor = "";
      });
    });
  }, [markers]);

  return <div id="map" style={{ width: "100vw", height: "100vh" }}></div>;
};
