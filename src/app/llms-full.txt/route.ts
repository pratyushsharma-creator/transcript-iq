// src/app/llms-full.txt/route.ts
import { getPayload } from 'payload'
import config from '@/payload.config'

export const revalidate = 3600

const BASE_URL = 'https://transcript-iq.com'

export async function GET() {
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
    // Industries collection uses `name`, not `title`.
    // sectors is `(number | Industry)[]` when depth=1; cast through unknown to access the name field.
    const sectorName =
      Array.isArray(t.sectors) && t.sectors.length > 0
        ? ((t.sectors[0] as unknown) as Record<string, unknown>)?.name as string ?? ''
        : ''
    lines.push(`### ${t.title}`)
    lines.push(`URL: ${BASE_URL}/expert-transcripts/${t.slug}`)
    if (t.tier) lines.push(`Tier: ${t.tier}`)
    if (sectorName) lines.push(`Sector: ${sectorName}`)
    if (t.executiveSummaryPreview) {
      lines.push(`Summary: ${(t.executiveSummaryPreview as string).slice(0, 300)}`)
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
    if (a.executiveSummaryPreview) {
      lines.push(`Summary: ${(a.executiveSummaryPreview as string).slice(0, 300)}`)
    }
    lines.push('')
  }

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
    },
  })
}
