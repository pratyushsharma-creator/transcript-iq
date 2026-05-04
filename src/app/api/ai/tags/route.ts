import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getPayload } from 'payload'
import config from '@/payload.config'

// POST /api/ai/tags
// Body: { body: string; type?: 'blog' | 'transcript' | 'earnings' }
// Returns: { industries: string[]; categories: string[] }
//
// Reads existing taxonomy from Payload, then asks Claude to match.
// Admin-only — protected by PAYLOAD_SECRET Bearer token.

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(req: NextRequest) {
  const auth = req.headers.get('Authorization') ?? ''
  if (!auth.startsWith('Bearer ') || auth.replace('Bearer ', '') !== process.env.PAYLOAD_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 })
  }

  let body: { body?: string; type?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { body: content, type } = body
  if (!content || typeof content !== 'string' || content.trim().length < 50) {
    return NextResponse.json({ error: 'body must be at least 50 characters' }, { status: 400 })
  }

  // Fetch existing taxonomy from Payload so Claude only suggests real tags
  let industryNames: string[] = []
  let categoryNames: string[] = []

  try {
    const payload = await getPayload({ config: await config })
    const [industries, categories] = await Promise.all([
      payload.find({ collection: 'industries', limit: 100, depth: 0 }),
      payload.find({ collection: 'categories', limit: 100, depth: 0 }),
    ])
    industryNames = industries.docs.map((d) => (d as { name: string }).name)
    categoryNames = categories.docs.map((d) => (d as { name: string }).name)
  } catch (err) {
    console.warn('[ai/tags] Could not fetch taxonomy from Payload:', err)
    // Proceed without taxonomy — Claude will suggest its own
  }

  const systemPrompt = `You are a content classifier for Transcript IQ, a marketplace for expert call transcripts and earnings analysis. Classify content into the correct taxonomy tags.

${industryNames.length > 0 ? `Available industries (choose 1-3):\n${industryNames.join(', ')}` : 'Common industries: Technology & SaaS, Healthcare & Pharma, Financial Services, Energy & Utilities, Industrials & Manufacturing, Telecommunications, Chemicals, Metals & Mining, Professional Services, Space Economy, Transportation & Logistics, Real Estate & Infrastructure'}

${categoryNames.length > 0 ? `Available categories (choose 1-3):\n${categoryNames.join(', ')}` : 'Common categories: Primary Research, Earnings Analysis, Market Intelligence, Sector Deep-Dive, Expert Perspective'}

Return ONLY valid JSON: {"industries": ["..."], "categories": ["..."]}
Only use tags from the provided lists. Pick the most relevant 1-3 from each.`

  const userPrompt = `Content type: ${type ?? 'blog'}
Body (first 1500 chars):
${content.slice(0, 1500)}

Classify into industries and categories.`

  try {
    const client = new Anthropic({ apiKey })
    const message = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 128,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : '{}'
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Unexpected Claude response format' }, { status: 500 })
    }
    const parsed = JSON.parse(jsonMatch[0]) as { industries?: string[]; categories?: string[] }

    return NextResponse.json({
      industries: Array.isArray(parsed.industries) ? parsed.industries.slice(0, 3) : [],
      categories: Array.isArray(parsed.categories) ? parsed.categories.slice(0, 3) : [],
    })
  } catch (err) {
    console.error('[ai/tags]', err)
    return NextResponse.json({ error: 'Claude API error' }, { status: 500 })
  }
}
