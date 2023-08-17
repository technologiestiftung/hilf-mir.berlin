import { loadData } from '@lib/loadData'
import { MetadataRoute } from 'next'

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://www.hilf-mir.berlin'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { records: facilities } = await loadData()
  const lastModified = new Date()

  return [
    { lastModified, url: `${baseUrl}/` },
    { lastModified, url: `${baseUrl}/info` },
    { lastModified, url: `${baseUrl}/map` },
    { lastModified, url: `${baseUrl}/sofortige-hilfe` },
    { lastModified, url: `${baseUrl}/impressum` },
    { lastModified, url: `${baseUrl}/datenschutz` },
    ...facilities.map((facility) => ({
      lastModified,
      url: `${baseUrl}/${facility.id}`,
    })),
  ]
}
