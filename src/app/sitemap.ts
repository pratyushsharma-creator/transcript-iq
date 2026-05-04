// src/app/sitemap.ts
import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const revalidate = 3600 // rebuild hourly

const BASE_URL = 'https://transcript-iq.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: await config })

  const [transcripts, analyses, posts] = await Promise.all([
    payload.find({
      collection: 'expert-transcripts',
      where: { _status: { equals: 'published' } },
      limit: 500,
      depth: 0,
    }),
    payload.find({
      collection: 'earnings-analyses',
      where: { _status: { equals: 'published' } },
      limit: 500,
      depth: 0,
    }),
    payload.find({
      collection: 'blog-posts',
      where: { _status: { equals: 'published' } },
      limit: 200,
      depth: 0,
    }),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, priority: 1.0, changeFrequency: 'daily', lastModified: new Date() },
    { url: `${BASE_URL}/expert-transcripts`, priority: 0.9, changeFrequency: 'daily', lastModified: new Date() },
    { url: `${BASE_URL}/earnings-analysis`, priority: 0.9, changeFrequency: 'daily', lastModified: new Date() },
    { url: `${BASE_URL}/resources`, priority: 0.8, changeFrequency: 'weekly', lastModified: new Date() },
    { url: `${BASE_URL}/free-transcript`, priority: 0.8, changeFrequency: 'monthly', lastModified: new Date() },
    { url: `${BASE_URL}/how-to-use`, priority: 0.7, changeFrequency: 'monthly', lastModified: new Date() },
    { url: `${BASE_URL}/custom-reports`, priority: 0.7, changeFrequency: 'monthly', lastModified: new Date() },
    { url: `${BASE_URL}/why-primary-research-wins`, priority: 0.7, changeFrequency: 'monthly', lastModified: new Date() },
    { url: `${BASE_URL}/contact`, priority: 0.6, changeFrequency: 'monthly', lastModified: new Date() },
  ]

  const transcriptPages: MetadataRoute.Sitemap = transcripts.docs.map((t) => ({
    url: `${BASE_URL}/expert-transcripts/${t.slug}`,
    priority: 0.8,
    changeFrequency: 'weekly',
    lastModified: t.updatedAt ? new Date(t.updatedAt) : new Date(),
  }))

  const analysisPages: MetadataRoute.Sitemap = analyses.docs.map((a) => ({
    url: `${BASE_URL}/earnings-analysis/${a.slug}`,
    priority: 0.8,
    changeFrequency: 'weekly',
    lastModified: a.updatedAt ? new Date(a.updatedAt) : new Date(),
  }))

  const blogPages: MetadataRoute.Sitemap = posts.docs.map((p) => ({
    url: `${BASE_URL}/resources/${p.slug}`,
    priority: 0.7,
    changeFrequency: 'weekly',
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
  }))

  return [...staticPages, ...transcriptPages, ...analysisPages, ...blogPages]
}
