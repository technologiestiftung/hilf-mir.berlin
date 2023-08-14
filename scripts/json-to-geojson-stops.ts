import { readFile, writeFile } from 'fs/promises'
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Point,
  Geometry,
} from 'geojson'
import { resolve } from 'path'
import * as turf from '@turf/turf'

interface Stop {
  stop_id: string
  stop_code?: string
  stop_name?: string
  stop_desc?: string
  lat: number
  lon: number
  location_type?: string // This could also be a custom type or enum if there are specific known values
  parent_station?: string // Optional if some stops don't have parent stations
  wheelchair_boarding?: boolean // Assuming this is boolean but could be other types (number/string) depending on your data
  platform_code?: string // Optional if some stops don't have platform codes
  zone_id?: string // Optional if some stops don't have zones
  level_id?: number | null // Assuming this is numeric ID. It's optional or possibly nullable.
}

// https://daten.odis-berlin.de/de/dataset/bezirksgrenzen/
async function main(): Promise<void> {
  const contentBezirksgrenzen = await readFile(
    resolve(__dirname, '../data/bezirksgrenzen.geojson'),
    'utf-8'
  )

  const bezirkeFeatureCollection = JSON.parse(
    contentBezirksgrenzen
  ) as FeatureCollection

  // const bbox = turf.bbox(bezirkeFeatureCollection)
  // Create a Polygon from the Bounding Box.
  // const bboxPolygon = turf.bboxPolygon(bbox)

  const contentStops = await readFile(
    resolve(__dirname, '../data/stops.json'),
    'utf-8'
  )
  const stops = JSON.parse(contentStops) as Stop[]
  const geojsonStops: FeatureCollection<Point, GeoJsonProperties> = {
    type: 'FeatureCollection',
    features: stops.map((stop: Stop) => ({
      type: 'Feature',
      properties: {
        // filll the propeties here
        id: stop.stop_id,
        code: stop.stop_code,
        name: stop.stop_name?.replace(/\(Berlin\)/g, '').trim(),
        desc: stop.stop_desc,
        lat: stop.lat,
        lon: stop.lon,
        location_type: stop.location_type,
        parent_station: stop.parent_station,
        wheelchair_boarding: stop.wheelchair_boarding,
        platform_code: stop.platform_code,
        zone_id: stop.zone_id,
        level_id: stop.level_id,
      },
      geometry: {
        type: 'Point',
        coordinates: [stop.lon, stop.lat],
      },
    })),
  }

  await writeFile(
    resolve(__dirname, '../data/stops.geo.json'),
    JSON.stringify(geojsonStops, null, 2)
  )
  // createa a new gejson from the geojson and filter all features that have their property parent_station equal to null
  const parentStationGeojson = geojsonStops.features.filter(
    (feature: Feature<Point, GeoJsonProperties>) =>
      feature.properties!.parent_station === null
  )
  // create a new feature collection from the filtered geojson
  const parentStationFeatueCollection = {
    type: 'FeatureCollection',
    features: parentStationGeojson,
  }

  // // Filter features that fall within the Bounding Box.
  // const filteredFeatures = parentStationFeatueCollection.features.filter(
  //   (feature) => {
  //     const point = turf.centroid(feature)
  //     return turf.booleanPointInPolygon(point, bboxPolygon)
  //   }
  // )
  // const filteredFeatureCollection = turf.featureCollection(filteredFeatures)

  const filteredFeatures: Feature<Point, GeoJsonProperties>[] = []

  parentStationFeatueCollection.features.forEach((feature) => {
    let isInside = false

    for (let i = 0; i < bezirkeFeatureCollection.features.length; i++) {
      if (turf.booleanWithin(feature, bezirkeFeatureCollection.features[i])) {
        isInside = true
        break
      }
    }

    if (isInside) filteredFeatures.push(feature)
  })

  // Create new Feature Collection with filtered features.
  const filteredFeatureCollection: FeatureCollection =
    turf.featureCollection(filteredFeatures)

  // split the filteredFeatureCollection into several based on their property location_type
  const splitFeatures: Record<string, Feature<Geometry, GeoJsonProperties>[]> =
    {}

  const splitFeatureCollections: Record<string, FeatureCollection> = {}

  // Loop through each feature
  filteredFeatureCollection.features.forEach((feature) => {
    const locationType = feature.properties!.location_type as string

    // If this type hasn't been seen before, initialize it with an empty array
    if (!splitFeatures[locationType]) {
      splitFeatures[locationType] = []
    }

    // Add the feature to the appropriate array
    splitFeatures[locationType].push(feature)
  })

  // Convert each item in splitFeatures into a FeatureCollection
  for (const locationType in splitFeatures) {
    splitFeatureCollections[locationType] = turf.featureCollection(
      splitFeatures[locationType]
    )
  }

  // write each item of splitFeatureCollections to a GeoJSON file
  for (const locationType in splitFeatureCollections) {
    await writeFile(
      resolve(
        __dirname,
        `../data/stops.location_type_${locationType}.geo.json`
      ),
      JSON.stringify(splitFeatureCollections[locationType]),
      'utf-8'
    )
  }
}

main().catch(console.error)
