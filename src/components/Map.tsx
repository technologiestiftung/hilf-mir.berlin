import { useEffect, FC } from "react";
import maplibregl from "maplibre-gl";

export interface MapType {
  markers?: unknown[];
}

export const Map: FC<MapType> = ({ markers, ...otherProps }) => {
  useEffect(() => {
    const map = new maplibregl.Map({
      container: "map",
      style: `https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`,
      center: [13.404954, 52.520008],
      zoom: 12,
    });

    const popup = new maplibregl.Popup({ offset: 5 }).setText(`hellooooooooo`);

    new maplibregl.Marker({
      //color: "#FF7319",
    })
      .setLngLat([13.2990416259517, 52.4193151047283])
      .setPopup(popup)
      .addTo(map);
  }, [markers]);

  return <div id="map" style={{ width: "100vw", height: "100vh" }}></div>;
};
