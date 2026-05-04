// src/lib/cache/queries.ts
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Where } from 'payload'
import { CACHE_TAGS } from './revalidation'

// ── Pages collection ──────────────────────────────────────────────────────

export const getPageBySlug = unstable_cache(
  async (slug: string) => {
    const payload = await getPayload({ config: await config })
    const res = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    })
    return res.docs[0] ?? null
  },
  ['page-by-slug'],
  { tags: [CACHE_TAGS.pages], revalidate: 3600 },
)

// ── Industries ────────────────────────────────────────────────────────────

export const getIndustries = unstable_cache(
  async () => {
    const payload = await getPayload({ config: await config })
    const res = await payload.find({
      collection: 'industries',
      limit: 50,
      sort: 'name',
    })
    return res.docs
  },
  ['industries-list'],
  { tags: [CACHE_TAGS.industries], revalidate: 3600 },
)

// ── Expert Transcripts ────────────────────────────────────────────────────

export const getTranscriptList = unstable_cache(
  async (filters: {
    industry?: string
    geography?: string
    level?: string
    tier?: string
  }) => {
    const payload = await getPayload({ config: await config })
    const andConditions: Where[] = []
    if (filters.industry) {
      const slugs = filters.industry.split(',').filter(Boolean)
      andConditions.push(
        slugs.length === 1
          ? { 'sectors.slug': { equals: slugs[0] } }
          : { 'sectors.slug': { in: slugs } },
      )
    }
    if (filters.geography) {
      const vals = filters.geography.split(',').filter(Boolean)
      andConditions.push(
        vals.length === 1
          ? { geography: { equals: vals[0] } }
          : { geography: { in: vals } },
      )
    }
    if (filters.level) {
      const vals = filters.level.split(',').filter(Boolean)
      andConditions.push(
        vals.length === 1
          ? { expertLevel: { equals: vals[0] } }
          : { expertLevel: { in: vals } },
      )
    }
    if (filters.tier) {
      const vals = filters.tier.split(',').filter(Boolean)
      andConditions.push(
        vals.length === 1
          ? { tier: { equals: vals[0] } }
          : { tier: { in: vals } },
      )
    }
    const res = await payload.find({
      collection: 'expert-transcripts',
      where: andConditions.length > 0 ? { and: andConditions } : undefined,
      limit: 24,
      page: 1,
      sort: '-dateConducted',
      depth: 2,
    })
    return { docs: res.docs, totalDocs: res.totalDocs }
  },
  ['expert-transcripts-list'],
  { tags: [CACHE_TAGS.expertTranscripts, CACHE_TAGS.industries], revalidate: 3600 },
)

export const getTranscriptBySlug = unstable_cache(
  async (slug: string) => {
    const payload = await getPayload({ config: await config })
    const { docs } = await payload.find({
      collection: 'expert-transcripts',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    })
    return docs[0] ?? null
  },
  ['expert-transcript-by-slug'],
  { tags: [CACHE_TAGS.expertTranscripts], revalidate: 86400 },
)

export const getRelatedTranscripts = unstable_cache(
  async (currentSlug: string, sectorSlugs: string[]) => {
    const payload = await getPayload({ config: await config })
    const where: Where =
      sectorSlugs.length > 0
        ? { and: [{ slug: { not_equals: currentSlug } }, { 'sectors.slug': { in: sectorSlugs } }] }
        : { slug: { not_equals: currentSlug } }
    const { docs } = await payload.find({
      collection: 'expert-transcripts',
      where,
      limit: 3,
      sort: '-dateConducted',
      depth: 1,
    })
    return docs
  },
  ['expert-transcripts-related'],
  { tags: [CACHE_TAGS.expertTranscripts], revalidate: 86400 },
)

// ── Earnings Analyses ─────────────────────────────────────────────────────

export const getEarningsAnalysisList = unstable_cache(
  async (filters: {
    sector?: string
    exchange?: string
    quarter?: string
    performance?: string
  }) => {
    const payload = await getPayload({ config: await config })
    const andConditions: Where[] = []
    if (filters.sector) {
      const slugs = filters.sector.split(',').filter(Boolean)
      andConditions.push(
        slugs.length === 1
          ? { 'sectors.slug': { equals: slugs[0] } }
          : { 'sectors.slug': { in: slugs } },
      )
    }
    if (filters.exchange) {
      const vals = filters.exchange.split(',').filter(Boolean)
      andConditions.push(
        vals.length === 1
          ? { exchange: { equals: vals[0] } }
          : { exchange: { in: vals } },
      )
    }
    if (filters.quarter) {
      const vals = filters.quarter.split(',').filter(Boolean)
      andConditions.push(
        vals.length === 1
          ? { quarter: { equals: vals[0] } }
          : { quarter: { in: vals } },
      )
    }
    if (filters.performance) {
      const vals = filters.performance.split(',').filter(Boolean)
      andConditions.push(
        vals.length === 1
          ? { performanceBadges: { equals: vals[0] } }
          : { performanceBadges: { in: vals } },
      )
    }
    const res = await payload.find({
      collection: 'earnings-analyses',
      where: andConditions.length > 0 ? { and: andConditions } : undefined,
      limit: 24,
      page: 1,
      sort: '-reportDate',
      depth: 2,
    })
    return { docs: res.docs, totalDocs: res.totalDocs }
  },
  ['earnings-analyses-list'],
  { tags: [CACHE_TAGS.earningsAnalyses, CACHE_TAGS.industries], revalidate: 3600 },
)

export const getEarningsAnalysisBySlug = unstable_cache(
  async (slug: string) => {
    const payload = await getPayload({ config: await config })
    const { docs } = await payload.find({
      collection: 'earnings-analyses',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    })
    return docs[0] ?? null
  },
  ['earnings-analysis-by-slug'],
  { tags: [CACHE_TAGS.earningsAnalyses], revalidate: 86400 },
)

export const getRelatedEarningsAnalyses = unstable_cache(
  async (currentSlug: string, sectorSlugs: string[]) => {
    const payload = await getPayload({ config: await config })
    const where: Where =
      sectorSlugs.length > 0
        ? { and: [{ slug: { not_equals: currentSlug } }, { 'sectors.slug': { in: sectorSlugs } }] }
        : { slug: { not_equals: currentSlug } }
    const { docs } = await payload.find({
      collection: 'earnings-analyses',
      where,
      limit: 3,
      sort: '-reportDate',
      depth: 0,
    })
    return docs
  },
  ['earnings-analyses-related'],
  { tags: [CACHE_TAGS.earningsAnalyses], revalidate: 86400 },
)

// ── Blog Posts ────────────────────────────────────────────────────────────

export const getBlogPostBySlug = unstable_cache(
  async (slug: string) => {
    const payload = await getPayload({ config: await config })
    const res = await payload.find({
      collection: 'blog-posts',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    })
    return res.docs[0] ?? null
  },
  ['blog-post-by-slug'],
  { tags: [CACHE_TAGS.blogPosts], revalidate: 86400 },
)

export const getRelatedBlogPosts = unstable_cache(
  async (currentSlug: string, contentType: string) => {
    const payload = await getPayload({ config: await config })
    const res = await payload.find({
      collection: 'blog-posts',
      where: {
        _status: { equals: 'published' },
        slug: { not_equals: currentSlug },
        contentType: { equals: contentType },
      },
      limit: 3,
      depth: 1,
    })
    return res.docs
  },
  ['blog-posts-related'],
  { tags: [CACHE_TAGS.blogPosts], revalidate: 86400 },
)

export const getNextBlogPost = unstable_cache(
  async (currentSlug: string) => {
    const payload = await getPayload({ config: await config })
    const res = await payload.find({
      collection: 'blog-posts',
      where: {
        _status: { equals: 'published' },
        slug: { not_equals: currentSlug },
      },
      sort: '-publishedAt',
      limit: 1,
      depth: 1,
    })
    return res.docs[0] ?? null
  },
  ['blog-post-next'],
  { tags: [CACHE_TAGS.blogPosts], revalidate: 3600 },
)
