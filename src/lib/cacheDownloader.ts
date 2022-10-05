import { getGristLabels } from '../lib/requests/getGristLabels'
import { getGristRecords } from '../lib/requests/getGristRecords'
import { getGristTexts } from '../lib/requests/getGristTexts'
import {
  createDirectoriesIfNotAlreadyThere,
  writeJsonFile,
} from '../lib/scriptUtils'

export async function downloadCacheData(): Promise<void> {
  console.log(`DOWNLOADING CACHE DATA`)
  const [texts, records, labels] = await Promise.all([
    getGristTexts(),
    getGristRecords(),
    getGristLabels(),
  ])
  console.log(`  -> ✅ Success`)

  await createDirectoriesIfNotAlreadyThere('data')

  console.log(`SAVING CACHE DATA`)
  await Promise.all([
    writeJsonFile(`data/texts.json`, texts),
    writeJsonFile(`data/records.json`, records),
    writeJsonFile(`data/labels.json`, labels),
  ])
  console.log(`  -> ✅ Success`)
}
