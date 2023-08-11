import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { FeatureCollection } from 'geojson'
export async function main() {
  const content = await readFile(
    resolve(__dirname, '../data/railways.geo.json'),
    'utf-8'
  )
  const data = JSON.parse(content) as FeatureCollection

  // find all objects in the data (it is a geojson) that have the same name in properties and add the the duplicate the property hidden: true and to the first occurrence the property hidden: false.
  // Create an empty object to store counts of each name.
  let counts: Record<string, number> = {}

  // Iterate over each feature in the collection.
  data.features.forEach((feature) => {
    // Get the value of the 'name' property for this feature.
    let name = feature.properties!.name

    // If this name has already been seen, increment its count. Otherwise, initialize it to 1.
    if (counts[name]) {
      counts[name]++
      // If we've seen this name before, mark this feature as hidden
      feature.properties!.hidden = 1
    } else {
      counts[name] = 1
      // Initialize hidden property as false
      feature.properties!.hidden = 0
    }
  })

  // write the data back to the file
  await writeFile(
    resolve(__dirname, '../data/railways.filtered.geo.json'),
    JSON.stringify(data),
    'utf-8'
  )
}

// 	{
// 		type: 'FeatureCollection',
// 		features: [
// 			{
// 				type: 'Feature',
// 				id: 'node/21302157',
// 				properties: {name: '<NAME>'},
// 				geometry: [Object]
// 			}]
// }

main().catch(console.error)
