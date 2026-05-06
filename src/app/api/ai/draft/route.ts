import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getPayload } from 'payload'
import config from '@/payload.config'

// POST /api/ai/draft
// Body: { brief: string; type: 'blog' | 'transcript-summary' | 'earnings-summary' }
// Returns: { draft: string }
//
// Admin-only route — called from Payload custom views.
// Protected by checking PAYLOAD_SECRET in Authorization header.

export const runtime = 'nodejs'
export const maxDuration = 60

async function verifyAuth(authHeader: string): Promise<boolean> {
  // Legacy: PAYLOAD_SECRET bearer token
  if (authHeader.startsWith('Bearer ') && authHeader.slice(7) === process.env.PAYLOAD_SECRET) {
    return true
  }
  // Payload API key (format: "users API-Key <key>")
  if (authHeader.startsWith('users API-Key ')) {
    const apiKey = authHeader.slice('users API-Key '.length).trim()
    if (!apiKey) return false
    try {
      const payload = await getPayload({ config: await config })
      const users = await payload.find({
        collection: 'users',
        where: { apiKey: { equals: apiKey } },
        limit: 1,
        overrideAccess: true,
      })
      const user = users.docs[0] as { role?: string } | undefined
      return user?.role === 'admin' || user?.role === 'editor'
    } catch {
      return false
    }
  }
  return false
}

const SYSTEM_PROMPT = `You are a senior research analyst and writer at Transcript IQ, a marketplace for
institutional-grade expert call transcripts and earnings analysis. Your writing is direct,
precise, and data-led — no fluff, no hyperbole. You write for institutional investors,
equity researchers, and M&A professionals.

Style guide:
- Sentence case for headings (not Title Case)
- Short paragraphs, 2-4 sentences max
- Lead with the finding, not the context
- Use specific numbers, sector names, and company names — never vague descriptions
- No em-dashes, no exclamation marks, no marketing clichés
- MNPI note: never speculate about undisclosed financials or forward guidance

For blog posts: 600–900 words, H2 subheadings, tight executive summary in the first paragraph.
For transcript summaries: 150–250 words covering expert background, key themes, and main findings.
For earnings summaries: 200–300 words covering EPS vs consensus, revenue drivers, guidance, and management tone.`

export async function POST(req: NextRequest) {
  // Verify admin token or Payload API key
  const auth = req.headers.get('Authorization') ?? ''
  if (!(await verifyAuth(auth))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 })
  }

  let body: { brief?: string; type?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { brief, type } = body
  if (!brief || typeof brief !== 'string' || brief.trim().length < 20) {
    return NextResponse.json({ error: 'brief must be at least 20 characters' }, { status: 400 })
  }

  const validTypes = ['blog', 'transcript-summary', 'earnings-summary']
  const contentType = validTypes.includes(type ?? '') ? type : 'blog'

  const userPrompt =
    contentType === 'transcript-summary'
      ? `Write a transcript executive summary (150–250 words) for the following brief:\n\n${brief}`
      : contentType === 'earnings-summary'
        ? `Write an earnings analysis summary (200–300 words) for the following brief:\n\n${brief}`
        : `Write a blog post (600–900 words) for the following brief:\n\n${brief}`

  try {
    const client = new Anthropic({ apiKey })
    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const draft =
      message.content[0].type === 'text' ? message.content[0].text : ''

    return NextResponse.json({ draft })
  } catch (err) {
    console.error('[ai/draft]', err)
    return NextResponse.json({ error: 'Claude API error' }, { status: 500 })
  }
}
