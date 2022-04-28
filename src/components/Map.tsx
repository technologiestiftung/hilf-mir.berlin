import { useEffect, FC } from "react";
import maplibregl from "maplibre-gl";
import { createGeoJsonStructure } from "../lib/createGeojsonStructure";
import { TableRowType } from "../common/types/gristData";

interface MapType {
  markers?: TableRowType[];
}

export const Map: FC<MapType> = ({ markers }) => {
  useEffect(() => {
    const map = new maplibregl.Map({
      container: "map",
      style: `https://api.maptiler.com/maps/bright/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`,
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
          "circle-color": "#2f2fa2",
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
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-size": 16,
        },
        paint: {
          "text-color": "#fff",
        },
      });

      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "facilities",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#2f2fa2",
          "circle-radius": 8,
          "circle-stroke-width": 2,
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
        if (!e.features) return;
        const coordinates = e.features[0].geometry.coordinates.slice();
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

  return <div id="map" className="w-full h-full"></div>;
};
