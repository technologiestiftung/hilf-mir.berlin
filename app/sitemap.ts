import { loadData } from '@lib/loadData'
import { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { records: facilities } = await loadData()
  const lastModified = new Date()
  if (typeof baseUrl !== 'string') {
    throw new Error('Missing NEXT_PUBLIC_BASE_URL env var')
  }

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
