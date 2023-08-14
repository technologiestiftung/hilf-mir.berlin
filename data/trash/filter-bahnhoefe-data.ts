import { readFile } from 'fs/promises'
import { FeatureCollection } from 'geojson'
import { resolve } from 'path'

async function main(): Promise<void> {
  const content = await readFile(
    resolve(__dirname, '../data/bahnhoefe-cleaned.geo.json'),
    'utf-8'
  )
  const data = JSON.parse(content) as FeatureCollection

  const names: string[] = []
  data.features.forEach((feature) => {
    if (feature.properties!.typ === 'Bauwerk') {
      names.push(feature.properties!.name as string)
      feature.properties!.hidden = 0
    } else {
      feature.properties!.hidden = 1
    }
    // const name = feature.properties!.name as string
    // // If this name has already been seen, increment its count. Otherwise, initialize it to 1.
    // if (counts[name]) {
    //   counts[name]++
    //   // If we've seen this name before, mark this feature as hidden
    //   feature.properties!.hidden = 1
    // } else {
    //   counts[name] = 1
    //   // Initialize hidden property as false
    //   feature.properties!.hidden = 0
    // }
  })
  console.log(JSON.stringify(names, null, 2))
}

main().catch(console.error)
