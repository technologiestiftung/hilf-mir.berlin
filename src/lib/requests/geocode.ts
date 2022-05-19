export interface FeatureType {
  bbox: [number, number, number, number]
  center: [number, number]
  geometry: {
    type: string
    coordinates: [number, number]
  }
  id: string
  place_name: string
  place_type: string[]
  properties: unknown
  relevance: number
  text: string
  type: string
}

interface SearchResultType {
  attribution: string
  features: FeatureType[]
  query: string[]
  type: string
  waste: unknown
}

export const geocode = async (query: string): Promise<SearchResultType> => {
  const BBOX_BERLIN = '13.155924,52.350898,13.795208,52.676446'

  try {
    const response = await fetch(
      `https://api.maptiler.com/geocoding/${query}.json?bbox=${BBOX_BERLIN}&key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`
    )
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = (await response.json()) as SearchResultType
    return data
  } catch (error: unknown) {
    throw error as Error
  }
}
