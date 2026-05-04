import { z } from 'zod'
import { apiGet, buildPayloadQuery, type Transcript, type PayloadList } from '../api-client.js'

// ── Tool schemas ──────────────────────────────────────────────────────────────

export const listTranscriptsSchema = z.object({
  sector: z.string().optional().describe('Filter by sector slug (e.g. "technology-saas")'),
  tier: z.enum(['standard', 'premium', 'elite']).optional().describe('Filter by tier'),
  geography: z.string().optional().describe('Filter by geography slug'),
  limit: z.number().int().min(1).max(100).default(20).describe('Number of results (default 20, max 100)'),
  page: z.number().int().min(1).default(1).describe('Page number'),
})

export const getTranscriptSchema = z.object({
  slug: z.string().describe('The transcript slug, e.g. "apple-q4-2024-cfo-expert-call"'),
})

// ── Tool handlers ─────────────────────────────────────────────────────────────

export async function listTranscripts(args: z.infer<typeof listTranscriptsSchema>): Promise<string> {
  const where: Record<string, string> = { _status: 'published' }
  if (args.tier) where.tier = args.tier
  if (args.geography) where.geography = args.geography

  const params = buildPayloadQuery(where, {
    limit: String(args.limit),
    page: String(args.page),
    depth: '1',
    sort: '-reportDate',
  })

  // Sector filter uses a relationship — add manually
  if (args.sector) {
    params[`where[sectors.slug][equals]`] = args.sector
  }

  const result = await apiGet<PayloadList<Transcript>>('/api/expert-transcripts', params)

  if (result.docs.length === 0) {
    return 'No transcripts found matching those filters.'
  }

  const lines = [
    `Found ${result.totalDocs} transcripts (showing page ${args.page} of ${result.totalPages}):`,
    '',
  ]

  for (const t of result.docs) {
    const sectorNames = t.sectors?.map((s) => s.name).join(', ') ?? 'n/a'
    lines.push(`**${t.title}**`)
    lines.push(`  Slug: ${t.slug}`)
    lines.push(`  Tier: ${t.tier ?? 'n/a'} | Price: $${t.priceUsd ?? 'n/a'}`)
    lines.push(`  Sector: ${sectorNames}`)
    if (t.expertFormerTitle) lines.push(`  Expert: ${t.expertFormerTitle}`)
    if (t.executiveSummaryPreview) {
      lines.push(`  Summary: ${t.executiveSummaryPreview.slice(0, 200)}${t.executiveSummaryPreview.length > 200 ? '...' : ''}`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

export async function getTranscript(args: z.infer<typeof getTranscriptSchema>): Promise<string> {
  const params = buildPayloadQuery({ slug: args.slug }, { depth: '2', limit: '1' })
  const result = await apiGet<PayloadList<Transcript>>('/api/expert-transcripts', params)

  if (result.docs.length === 0) {
    return `No transcript found with slug: ${args.slug}`
  }

  const t = result.docs[0]
  const sectorNames = t.sectors?.map((s) => s.name).join(', ') ?? 'n/a'

  return [
    `# ${t.title}`,
    ``,
    `**Slug:** ${t.slug}`,
    `**Tier:** ${t.tier ?? 'n/a'}`,
    `**Price:** $${t.priceUsd ?? 'n/a'}`,
    `**Sector(s):** ${sectorNames}`,
    `**Expert:** ${t.expertFormerTitle ?? 'n/a'}`,
    `**Report Date:** ${t.reportDate ?? 'n/a'}`,
    `**Geography:** ${t.geography ?? 'n/a'}`,
    ``,
    `**Executive Summary:**`,
    t.executiveSummaryPreview ?? '(no summary)',
  ].join('\n')
}
