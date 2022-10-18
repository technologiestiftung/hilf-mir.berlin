import fsSync from 'node:fs'
import fs from 'node:fs/promises'

export const createDirectoriesIfNotAlreadyThere = async (
  path: string
): Promise<void> => {
  const dirExists = fsSync.existsSync(path)
  if (!dirExists) {
    await fs.mkdir(path, { recursive: true })
  }
}

export const writeJsonFile = async <T = unknown>(
  path: string,
  content: Record<string, T> | Record<string, T>[]
): Promise<void> => {
  const jsonString = JSON.stringify(content, null, 2)
  await fs.writeFile(path, jsonString, 'utf-8')
}

export async function loadJson<
  T = Record<string, unknown> | Record<string, unknown>[]
>(pathToFile: string): Promise<T> {
  const file = await fs.readFile(pathToFile, 'utf-8')
  const json = (await JSON.parse(file)) as T
  return json
}
