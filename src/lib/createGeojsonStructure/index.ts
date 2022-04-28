import { MarkerType } from "../../components/Map";

export const createGeoJsonStructure = (markers: MarkerType[]) => {
  return {
    type: "FeatureCollection",
    features: markers.map((marker) => {
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          // It's curious that the Grist API returns the field long2, while actually in the spreadsheet the column is called long:
          coordinates: [marker.fields.long2, marker.fields.lat],
        },
        properties: {
          ...marker.fields,
        },
      };
    }),
  };
};
