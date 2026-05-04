// src/app/llms-full.txt/route.ts
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { CACHE_TAGS } from '@/lib/cache/revalidation'

export const revalidate = 3600

const BASE_URL = 'https://transcript-iq.com'

/**
 * Fetch and format all published content for AI crawlers.
 * Wrapped in unstable_cache so:
 *  - Hourly ISR via `revalidate = 3600` (page-level)
 *  - On-demand bust via revalidateTag(CACHE_TAGS.llmsFull, 'default')
 *    called from afterChange hooks on publish (see ExpertTranscripts, EarningsAnalyses, BlogPosts)
 */
const getLlmsFullContent = unstable_cache(
  async () => {
    const payload = await getPayload({ config: await config })

    const [transcripts, posts, analyses] = await Promise.all([
      payload.find({
        collection: 'expert-transcripts',
        where: { _status: { equals: 'published' } },
        limit: 500,
        depth: 1,
        select: {
          title: true,
          slug: true,
          executiveSummaryPreview: true,
          tier: true,
          sectors: true,
        },
      }),
      payload.find({
        collection: 'blog-posts',
        where: { _status: { equals: 'published' } },
        limit: 200,
        depth: 0,
        select: { title: true, slug: true, excerpt: true },
      }),
      payload.find({
        collection: 'earnings-analyses',
        where: { _status: { equals: 'published' } },
        limit: 200,
        depth: 0,
        select: { title: true, slug: true, executiveSummaryPreview: true },
      }),
    ])

    const lines: string[] = [
      '# Transcript IQ — Full Content Index',
      '# Generated automatically from published content',
      `# ${new Date().toISOString()}`,
      '',
      `## Expert Call Transcripts (${transcripts.docs.length} published)`,
      '',
    ]

    for (const t of transcripts.docs) {
      const sectorName =
        Array.isArray(t.sectors) && t.sectors.length > 0
          ? ((t.sectors[0] as unknown) as Record<string, unknown>)?.name as string ?? ''
          : ''
      lines.push(`### ${t.title}`)
      lines.push(`URL: ${BASE_URL}/expert-transcripts/${t.slug}`)
      if (t.tier) lines.push(`Tier: ${t.tier}`)
      if (sectorName) lines.push(`Sector: ${sectorName}`)
      if (typeof t.executiveSummaryPreview === 'string') {
        lines.push(`Summary: ${t.executiveSummaryPreview.slice(0, 300)}`)
      }
      lines.push('')
    }

    lines.push(`## Blog Posts & Research Guides (${posts.docs.length} published)`, '')
    for (const p of posts.docs) {
      lines.push(`### ${p.title}`)
      lines.push(`URL: ${BASE_URL}/resources/${p.slug}`)
      if (p.excerpt) lines.push(`Excerpt: ${p.excerpt}`)
      lines.push('')
    }

    lines.push(`## Earnings Analysis Briefs (${analyses.docs.length} published)`, '')
    for (const a of analyses.docs) {
      lines.push(`### ${a.title}`)
      lines.push(`URL: ${BASE_URL}/earnings-analysis/${a.slug}`)
      if (typeof a.executiveSummaryPreview === 'string') {
        lines.push(`Summary: ${a.executiveSummaryPreview.slice(0, 300)}`)
      }
      lines.push('')
    }

    return lines.join('\n')
  },
  ['llms-full-content'],
  { tags: [CACHE_TAGS.llmsFull], revalidate: 3600 },
)

export async function GET() {
  const content = await getLlmsFullContent()

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
    },
  })
}
