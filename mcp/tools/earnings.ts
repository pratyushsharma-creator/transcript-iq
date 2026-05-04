import { z } from 'zod'
import { apiGet, buildPayloadQuery, type EarningsAnalysis, type PayloadList } from '../api-client.js'

export const listEarningsSchema = z.object({
  sector: z.string().optional().describe('Filter by sector slug'),
  ticker: z.string().optional().describe('Filter by stock ticker (e.g. "AAPL")'),
  quarter: z.enum(['Q1', 'Q2', 'Q3', 'Q4']).optional().describe('Filter by fiscal quarter'),
  fiscalYear: z.number().int().optional().describe('Filter by fiscal year (e.g. 2024)'),
  limit: z.number().int().min(1).max(100).default(20).describe('Number of results'),
  page: z.number().int().min(1).default(1).describe('Page number'),
})

export const getEarningsSchema = z.object({
  slug: z.string().describe('The earnings analysis slug'),
})

export async function listEarnings(args: z.infer<typeof listEarningsSchema>): Promise<string> {
  const where: Record<string, string> = { _status: 'published' }
  if (args.ticker) where.ticker = args.ticker.toUpperCase()
  if (args.quarter) where.quarter = args.quarter
  if (args.fiscalYear) where.fiscalYear = String(args.fiscalYear)

  const params = buildPayloadQuery(where, {
    limit: String(args.limit),
    page: String(args.page),
    depth: '1',
    sort: '-reportDate',
  })

  if (args.sector) {
    params[`where[sectors.slug][equals]`] = args.sector
  }

  const result = await apiGet<PayloadList<EarningsAnalysis>>('/api/earnings-analyses', params)

  if (result.docs.length === 0) {
    return 'No earnings analyses found matching those filters.'
  }

  const lines = [
    `Found ${result.totalDocs} earnings analyses (page ${args.page}/${result.totalPages}):`,
    '',
  ]

  for (const a of result.docs) {
    lines.push(`**${a.title}**`)
    lines.push(`  Slug: ${a.slug}`)
    lines.push(`  Ticker: ${a.ticker ?? 'n/a'} | Company: ${a.companyName ?? 'n/a'}`)
    lines.push(`  Quarter: ${a.quarter ?? '?'} FY${a.fiscalYear ?? '?'} | Price: $${a.priceUsd ?? 'n/a'}`)
    if (a.summary) {
      lines.push(`  Summary: ${a.summary.slice(0, 200)}${a.summary.length > 200 ? '...' : ''}`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

export async function getEarnings(args: z.infer<typeof getEarningsSchema>): Promise<string> {
  const params = buildPayloadQuery({ slug: args.slug }, { depth: '2', limit: '1' })
  const result = await apiGet<PayloadList<EarningsAnalysis>>('/api/earnings-analyses', params)

  if (result.docs.length === 0) {
    return `No earnings analysis found with slug: ${args.slug}`
  }

  const a = result.docs[0]
  const sectorNames = a.sectors?.map((s) => s.name).join(', ') ?? 'n/a'

  return [
    `# ${a.title}`,
    ``,
    `**Slug:** ${a.slug}`,
    `**Ticker:** ${a.ticker ?? 'n/a'} | **Company:** ${a.companyName ?? 'n/a'}`,
    `**Quarter:** ${a.quarter ?? '?'} FY${a.fiscalYear ?? '?'}`,
    `**Price:** $${a.priceUsd ?? 'n/a'}`,
    `**Sector(s):** ${sectorNames}`,
    `**Report Date:** ${a.reportDate ?? 'n/a'}`,
    ``,
    `**Summary:**`,
    a.summary ?? '(no summary)',
  ].join('\n')
}
