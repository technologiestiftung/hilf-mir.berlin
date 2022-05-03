import { useEffect, FC, useRef } from "react";
import maplibregl, { LngLatLike, Map, Marker } from "maplibre-gl";
import { createGeoJsonStructure } from "../lib/createGeojsonStructure";
import { TableRowType } from "../common/types/gristData";

interface MapType {
  center?: LngLatLike;
  markers?: TableRowType[];
  onMarkerClick?: (facilityIds: number[]) => void;
  highlightedLocation?: [number, number];
}

const DEFAULT_CENTER = [13.404954, 52.520008] as LngLatLike;

export const FacilitiesMap: FC<MapType> = ({
  center,
  markers,
  onMarkerClick = () => undefined,
  highlightedLocation,
}) => {
  const map = useRef<Map>(null);
  const highlightedMarker = useRef<Marker>(null);

  useEffect(() => {
    // @ts-ignore
    map.current = new maplibregl.Map({
      container: "map",
      style: `https://api.maptiler.com/maps/bright/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`,
      center: DEFAULT_CENTER,
      zoom: 11,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!markers || !map.current) return;

    map.current.on("load", function () {
      if (!map.current) return;
      map.current.addSource("facilities", {
        type: "geojson",
        data: createGeoJsonStructure(markers),
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
      });

      map.current.addLayer({
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

      map.current.addLayer({
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

      map.current.addLayer({
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

      map.current.on("click", "clusters", function (e) {
        if (!map.current) return;
        const features = map.current.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        const clusterId = features[0].properties.cluster_id;
        // @ts-ignore
        map.current
          .getSource("facilities")
          // @ts-ignore
          .getClusterExpansionZoom(clusterId, function (err, zoom) {
            if (err) return;
            if (!zoom) return;
            if (!map.current) return;

            map.current.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom,
            });
          });
      });

      map.current.on("click", "unclustered-point", function (e) {
        if (!e.features) return;

        onMarkerClick(e.features.map((f) => f.properties.id));

        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        /* while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        } */

        //new maplibregl.Popup().setLngLat(coordinates).setText(name).addTo(map);
      });

      map.current.on("mouseenter", "clusters", function () {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = "pointer";
      });
      map.current.on("mouseleave", "clusters", function () {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = "";
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers]);

  useEffect(() => {
    if (!map.current || !center) return;

    map.current.flyTo({
      center: center,
      zoom: 15,
      essential: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center]);

  useEffect(() => {
    if (!map.current) return;
    if (!highlightedLocation) {
      // Without a highlightedLocation we want to remove any highlightedMarker:
      highlightedMarker && highlightedMarker.current?.remove();
      return;
    } else {
      // Remove possibly existent markers:
      highlightedMarker.current?.remove();

      const customMarker = document.createElement("div");
      customMarker.className =
        "rounded-full w-8 h-8 bg-blue-500 ring-4 ring-magenta-500";

      // @ts-ignore
      highlightedMarker.current = new maplibregl.Marker(customMarker)
        .setLngLat(highlightedLocation as LngLatLike)
        .addTo(map.current);
    }
  }, [highlightedLocation]);

  return <div id="map" className="w-full h-full bg-[#F8F4F0]"></div>;
};
