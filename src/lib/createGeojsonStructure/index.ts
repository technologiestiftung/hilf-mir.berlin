import { MarkerType } from "../../components/Map";

export const createGeoJsonStructure = (markers: MarkerType[]) => {
  return {
    type: "FeatureCollection",
    features: markers.map((marker) => {
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [marker.fields.X, marker.fields.Y],
        },
        properties: {
          ...marker.fields,
        },
      };
    }),
  };
};
