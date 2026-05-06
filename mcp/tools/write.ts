import { z } from 'zod'
import { payloadCreate, payloadPatch, textToLexical } from '../api-client.js'

// ── Shared response shape from Payload create/update ─────────────────────────

interface PayloadDoc {
  doc?: { id?: string }
  id?: string
}

// ── Blog post tools ────────────────────────────────────────────────────────────

export const createBlogPostSchema = z.object({
  title: z.string().min(5).describe('Post title'),
  excerpt: z.string().max(280).optional().describe('Short teaser shown on listing (max 280 chars)'),
  contentType: z
    .enum(['educational', 'industry-deep-dive', 'use-case', 'thought-leadership', 'whitepaper', 'case-study', 'pillar'])
    .default('educational')
    .describe('Content type'),
  bodyText: z.string().optional().describe('Full body as plain text / markdown. Will be stored as Lexical rich text.'),
  featured: z.boolean().optional().describe('Pin to top of listing'),
})

export async function createBlogPost(input: z.infer<typeof createBlogPostSchema>): Promise<string> {
  const { title, excerpt, contentType, bodyText, featured } = input
  const data: Record<string, unknown> = { title, contentType }
  if (excerpt !== undefined) data.excerpt = excerpt
  if (featured !== undefined) data.featured = featured
  if (bodyText) data.body = textToLexical(bodyText)

  const result = await payloadCreate<PayloadDoc>('blog-posts', data)
  const id = result?.doc?.id ?? result?.id ?? 'unknown'
  return `Created blog post "${title}" (id: ${id})`
}

export const updateBlogPostSchema = z.object({
  id: z.string().describe('The Payload document ID of the blog post to update'),
  title: z.string().optional(),
  excerpt: z.string().max(280).optional(),
  contentType: z
    .enum(['educational', 'industry-deep-dive', 'use-case', 'thought-leadership', 'whitepaper', 'case-study', 'pillar'])
    .optional(),
  bodyText: z.string().optional().describe('New full body as plain text'),
  featured: z.boolean().optional(),
})

export async function updateBlogPost(input: z.infer<typeof updateBlogPostSchema>): Promise<string> {
  const { id, bodyText, ...rest } = input
  const data: Record<string, unknown> = {}
  if (rest.title !== undefined) data.title = rest.title
  if (rest.excerpt !== undefined) data.excerpt = rest.excerpt
  if (rest.contentType !== undefined) data.contentType = rest.contentType
  if (rest.featured !== undefined) data.featured = rest.featured
  if (bodyText) data.body = textToLexical(bodyText)

  await payloadPatch<PayloadDoc>('blog-posts', id, data)
  return `Updated blog post (id: ${id})`
}

// ── Transcript tools ───────────────────────────────────────────────────────────

export const createTranscriptSchema = z.object({
  title: z.string().min(5).describe('Transcript title, e.g. "Former VP Engineering (Major SaaS Co) — AI Infrastructure Strategy"'),
  expertFormerTitle: z.string().describe('e.g. "Former VP Engineering, Major SaaS Co" — never name companies'),
  expertLevel: z.enum(['c-suite', 'vp', 'director']).describe('Expert seniority'),
  dateConducted: z.string().describe('ISO date string YYYY-MM-DD'),
  tier: z.enum(['standard', 'premium', 'elite']).default('standard'),
  priceUsd: z.number().positive().default(349),
  geography: z.enum(['north-america', 'europe', 'global', 'apac']).optional(),
  summary: z.string().optional().describe('One-paragraph public summary (shown on listings)'),
  executiveSummaryPreview: z.string().optional().describe('Teaser shown locked on product page before purchase'),
  topicsCovered: z.array(z.string()).optional().describe('List of topics covered in the call'),
})

export async function createTranscript(input: z.infer<typeof createTranscriptSchema>): Promise<string> {
  const { topicsCovered, ...rest } = input
  const data: Record<string, unknown> = { ...rest }
  if (topicsCovered && topicsCovered.length > 0) {
    data.topicsCovered = topicsCovered.map((t) => ({ topic: t }))
  }

  const result = await payloadCreate<PayloadDoc>('expert-transcripts', data)
  const id = result?.doc?.id ?? result?.id ?? 'unknown'
  return `Created expert transcript "${input.title}" (id: ${id})`
}

export const updateTranscriptSchema = z.object({
  id: z.string().describe('The Payload document ID of the expert transcript to update'),
  title: z.string().min(5).optional(),
  expertFormerTitle: z.string().optional(),
  expertLevel: z.enum(['c-suite', 'vp', 'director']).optional(),
  dateConducted: z.string().optional(),
  tier: z.enum(['standard', 'premium', 'elite']).optional(),
  priceUsd: z.number().positive().optional(),
  geography: z.enum(['north-america', 'europe', 'global', 'apac']).optional(),
  summary: z.string().optional(),
  executiveSummaryPreview: z.string().optional(),
  topicsCovered: z.array(z.string()).optional(),
})

export async function updateTranscript(input: z.infer<typeof updateTranscriptSchema>): Promise<string> {
  const { id, topicsCovered, ...rest } = input
  const data: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(rest)) {
    if (v !== undefined) data[k] = v
  }
  if (topicsCovered !== undefined) {
    data.topicsCovered = topicsCovered.map((t) => ({ topic: t }))
  }

  await payloadPatch<PayloadDoc>('expert-transcripts', id, data)
  return `Updated expert transcript (id: ${id})`
}

// ── Earnings tools ─────────────────────────────────────────────────────────────

export const createEarningsSchema = z.object({
  title: z.string().min(5).describe('e.g. "Apple — Q2 FY2026 Earnings Analysis"'),
  companyName: z.string().describe('Full company name, e.g. "Apple Inc."'),
  ticker: z.string().describe('Uppercase ticker, e.g. AAPL'),
  exchange: z.enum(['NASDAQ', 'NYSE', 'NSE', 'BSE', 'LSE', 'HKEX', 'SGX', 'TSE', 'ASX']),
  quarter: z.enum(['Q1', 'Q2', 'Q3', 'Q4', 'FY']),
  fiscalYear: z.number().int().min(2000).max(2099),
  reportDate: z.string().describe('ISO date string YYYY-MM-DD'),
  priceUsd: z.number().positive().default(99),
  summary: z.string().optional().describe('Public one-paragraph summary for listings'),
  performanceBadges: z
    .array(z.enum(['eps-beat', 'eps-miss', 'eps-in-line', 'rev-beat', 'rev-miss', 'rev-in-line']))
    .optional(),
  keyTopics: z.array(z.string()).optional().describe('Themes covered, e.g. ["iPhone Demand", "Services Revenue"]'),
  keyMetrics: z
    .array(z.object({ metric: z.string(), value: z.string(), yoyChange: z.string().optional() }))
    .optional(),
})

export async function createEarnings(input: z.infer<typeof createEarningsSchema>): Promise<string> {
  const { keyTopics, keyMetrics, ...rest } = input
  const data: Record<string, unknown> = { ...rest }
  if (keyTopics && keyTopics.length > 0) {
    data.keyTopics = keyTopics.map((t) => ({ topic: t }))
  }
  if (keyMetrics) {
    data.keyMetrics = keyMetrics
  }

  const result = await payloadCreate<PayloadDoc>('earnings-analyses', data)
  const id = result?.doc?.id ?? result?.id ?? 'unknown'
  return `Created earnings analysis "${input.title}" (id: ${id})`
}

export const updateEarningsSchema = z.object({
  id: z.string().describe('The Payload document ID of the earnings analysis to update'),
  title: z.string().min(5).optional(),
  companyName: z.string().optional(),
  ticker: z.string().optional(),
  exchange: z.enum(['NASDAQ', 'NYSE', 'NSE', 'BSE', 'LSE', 'HKEX', 'SGX', 'TSE', 'ASX']).optional(),
  quarter: z.enum(['Q1', 'Q2', 'Q3', 'Q4', 'FY']).optional(),
  fiscalYear: z.number().int().min(2000).max(2099).optional(),
  reportDate: z.string().optional(),
  priceUsd: z.number().positive().optional(),
  summary: z.string().optional(),
  performanceBadges: z
    .array(z.enum(['eps-beat', 'eps-miss', 'eps-in-line', 'rev-beat', 'rev-miss', 'rev-in-line']))
    .optional(),
  keyTopics: z.array(z.string()).optional(),
  keyMetrics: z
    .array(z.object({ metric: z.string(), value: z.string(), yoyChange: z.string().optional() }))
    .optional(),
})

export async function updateEarnings(input: z.infer<typeof updateEarningsSchema>): Promise<string> {
  const { id, keyTopics, keyMetrics, ...rest } = input
  const data: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(rest)) {
    if (v !== undefined) data[k] = v
  }
  if (keyTopics !== undefined) {
    data.keyTopics = keyTopics.map((t) => ({ topic: t }))
  }
  if (keyMetrics !== undefined) {
    data.keyMetrics = keyMetrics
  }

  await payloadPatch<PayloadDoc>('earnings-analyses', id, data)
  return `Updated earnings analysis (id: ${id})`
}

// ── Publish / unpublish ────────────────────────────────────────────────────────

export const publishContentSchema = z.object({
  collection: z
    .enum(['blog-posts', 'expert-transcripts', 'earnings-analyses'])
    .describe('Which collection'),
  id: z.string().describe('Payload document ID'),
})

export async function publishContent(input: z.infer<typeof publishContentSchema>): Promise<string> {
  const { collection, id } = input
  await payloadPatch<PayloadDoc>(collection, id, { _status: 'published' })
  return `Published ${collection} document (id: ${id})`
}

export const unpublishContentSchema = z.object({
  collection: z
    .enum(['blog-posts', 'expert-transcripts', 'earnings-analyses'])
    .describe('Which collection'),
  id: z.string().describe('Payload document ID'),
})

export async function unpublishContent(input: z.infer<typeof unpublishContentSchema>): Promise<string> {
  const { collection, id } = input
  await payloadPatch<PayloadDoc>(collection, id, { _status: 'draft' })
  return `Unpublished (set to draft) ${collection} document (id: ${id})`
}
