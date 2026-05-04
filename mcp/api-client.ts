/**
 * Thin REST client over the Transcript IQ Next.js API.
 *
 * All tools in this MCP server call this client rather than hitting
 * Payload or the DB directly — keeping the MCP server as a clean,
 * deployable-anywhere side-car process.
 *
 * Configuration (env vars):
 *   TIQ_API_URL    Base URL for the Next.js app (default: http://localhost:3000)
 *   TIQ_API_KEY    PAYLOAD_SECRET value — used for admin routes only
 */

export const BASE_URL = (process.env.TIQ_API_URL ?? 'http://localhost:3000').replace(/\/$/, '')
const API_KEY = process.env.TIQ_API_KEY ?? ''

// ── Types shared across tools ─────────────────────────────────────────────────

export interface Transcript {
  id: string
  slug: string
  title: string
  tier?: 'standard' | 'premium' | 'elite'
  priceUsd?: number
  executiveSummaryPreview?: string
  sectors?: Array<{ name: string; slug: string }>
  reportDate?: string
  expertFormerTitle?: string
  geography?: string
}

export interface EarningsAnalysis {
  id: string
  slug: string
  title: string
  ticker?: string
  companyName?: string
  quarter?: string
  fiscalYear?: number
  priceUsd?: number
  summary?: string
  sectors?: Array<{ name: string; slug: string }>
  reportDate?: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt?: string
  contentType?: string
  publishedAt?: string
  readTime?: number
  author?: { name?: string }
}

export interface Order {
  id: string
  orderRef?: string
  customerEmail: string
  customerName?: string
  organisation?: string
  totalUsd: number
  status: string
  createdAt: string
}

// ── Generic fetcher ────────────────────────────────────────────────────────────

export async function apiGet<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`)
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  }
  const res = await fetch(url.toString())
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`API error ${res.status}: ${text}`)
  }
  return res.json() as Promise<T>
}

export async function apiPost<T>(path: string, body: unknown, adminAuth = false): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (adminAuth && API_KEY) {
    headers['Authorization'] = `Bearer ${API_KEY}`
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`API error ${res.status}: ${text}`)
  }
  return res.json() as Promise<T>
}

// ── Payload REST helpers ──────────────────────────────────────────────────────

export interface PayloadList<T> {
  docs: T[]
  totalDocs: number
  limit: number
  page: number
  totalPages: number
}

/**
 * Build a Payload REST query string from an object of where conditions.
 * e.g. buildWhere({ _status: 'published', tier: 'elite' }) →
 *   "where[_status][equals]=published&where[tier][equals]=elite"
 */
export function buildPayloadQuery(where: Record<string, string>, extra?: Record<string, string>): Record<string, string> {
  const params: Record<string, string> = {}
  for (const [field, value] of Object.entries(where)) {
    params[`where[${field}][equals]`] = value
  }
  if (extra) Object.assign(params, extra)
  return params
}
