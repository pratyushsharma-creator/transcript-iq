import { z } from 'zod'
import { apiGet, apiPost, buildPayloadQuery, type Order, type PayloadList } from '../api-client.js'

// ── List Orders ────────────────────────────────────────────────────────────────

export const listOrdersSchema = z.object({
  status: z.enum(['paid', 'pending', 'refunded', 'failed']).optional().describe('Filter by order status'),
  customerEmail: z.string().email().optional().describe('Filter by customer email'),
  limit: z.number().int().min(1).max(100).default(20).describe('Number of results'),
  page: z.number().int().min(1).default(1).describe('Page number'),
})

export async function listOrders(args: z.infer<typeof listOrdersSchema>): Promise<string> {
  const where: Record<string, string> = {}
  if (args.status) where.status = args.status
  if (args.customerEmail) where.customerEmail = args.customerEmail

  const params = buildPayloadQuery(where, {
    limit: String(args.limit),
    page: String(args.page),
    sort: '-createdAt',
  })

  const result = await apiGet<PayloadList<Order>>('/api/orders', params)

  if (result.docs.length === 0) {
    return 'No orders found.'
  }

  const lines = [
    `Found ${result.totalDocs} orders (page ${args.page}/${result.totalPages}):`,
    '',
  ]

  for (const o of result.docs) {
    lines.push(`**${o.orderRef ?? o.id}** — ${o.status.toUpperCase()}`)
    lines.push(`  Customer: ${o.customerName ?? 'n/a'} <${o.customerEmail}>`)
    lines.push(`  Organisation: ${o.organisation ?? 'n/a'}`)
    lines.push(`  Total: $${o.totalUsd} | Date: ${o.createdAt.split('T')[0]}`)
    lines.push('')
  }

  return lines.join('\n')
}

// ── Draft Content (calls Claude via the Next.js AI route) ─────────────────────

export const draftContentSchema = z.object({
  brief: z.string().min(20).describe('The brief or outline for the content'),
  type: z.enum(['blog', 'transcript-summary', 'earnings-summary']).default('blog').describe('Type of content to draft'),
})

export async function draftContent(args: z.infer<typeof draftContentSchema>): Promise<string> {
  const result = await apiPost<{ draft?: string; error?: string }>(
    '/api/ai/draft',
    { brief: args.brief, type: args.type },
    true, // admin auth
  )

  if (result.error) {
    throw new Error(`Draft failed: ${result.error}`)
  }

  return result.draft ?? '(empty draft returned)'
}

// ── Generate SEO Meta ─────────────────────────────────────────────────────────

export const generateMetaSchema = z.object({
  body: z.string().min(50).describe('The content body to generate meta for (first 2000 chars used)'),
  title: z.string().optional().describe('Existing title (optional, helps context)'),
  type: z.enum(['blog', 'transcript', 'earnings']).default('blog').describe('Content type'),
})

export async function generateMeta(args: z.infer<typeof generateMetaSchema>): Promise<string> {
  const result = await apiPost<{ title?: string; description?: string; error?: string }>(
    '/api/ai/meta',
    { body: args.body, title: args.title, type: args.type },
    true,
  )

  if (result.error) {
    throw new Error(`Meta generation failed: ${result.error}`)
  }

  return [
    `**SEO Title** (${(result.title ?? '').length}/60 chars):`,
    result.title ?? '(none)',
    '',
    `**Meta Description** (${(result.description ?? '').length}/155 chars):`,
    result.description ?? '(none)',
  ].join('\n')
}

// ── Suggest Tags ──────────────────────────────────────────────────────────────

export const suggestTagsSchema = z.object({
  body: z.string().min(50).describe('The content body to classify'),
  type: z.enum(['blog', 'transcript', 'earnings']).default('blog').describe('Content type'),
})

export async function suggestTags(args: z.infer<typeof suggestTagsSchema>): Promise<string> {
  const result = await apiPost<{ industries?: string[]; categories?: string[]; error?: string }>(
    '/api/ai/tags',
    { body: args.body, type: args.type },
    true,
  )

  if (result.error) {
    throw new Error(`Tag suggestion failed: ${result.error}`)
  }

  return [
    `**Suggested Industries:** ${(result.industries ?? []).join(', ') || 'none'}`,
    `**Suggested Categories:** ${(result.categories ?? []).join(', ') || 'none'}`,
  ].join('\n')
}
