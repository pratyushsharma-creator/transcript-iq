import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

// POST /api/ai/meta
// Body: { body: string; title?: string; type?: 'blog' | 'transcript' | 'earnings' }
// Returns: { title: string; description: string }
//
// Generates SEO meta title + description from content body.
// Admin-only — protected by PAYLOAD_SECRET Bearer token.

export const runtime = 'nodejs'
export const maxDuration = 30

const SYSTEM_PROMPT = `You are an SEO specialist for Transcript IQ, a marketplace for expert call
transcripts and earnings analysis. Generate concise, keyword-targeted meta titles and descriptions.

Rules:
- Title: max 60 characters, sentence case, no brand suffix (the CMS adds it)
- Description: max 155 characters, includes a clear benefit/hook, ends with a period
- Transcripts: include tier (Standard/Premium/Elite), sector, and MNPI-screened angle
- Earnings: include company name, ticker, quarter, and a performance signal if clear
- Blog: start with the primary keyword, state the key takeaway

Return ONLY valid JSON: {"title": "...", "description": "..."}`

export async function POST(req: NextRequest) {
  const auth = req.headers.get('Authorization') ?? ''
  if (!auth.startsWith('Bearer ') || auth.replace('Bearer ', '') !== process.env.PAYLOAD_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 })
  }

  let body: { body?: string; title?: string; type?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { body: content, title, type } = body
  if (!content || typeof content !== 'string' || content.trim().length < 50) {
    return NextResponse.json({ error: 'body must be at least 50 characters' }, { status: 400 })
  }

  const userPrompt = `Content type: ${type ?? 'blog'}
${title ? `Existing title: ${title}\n` : ''}Body (first 2000 chars):
${content.slice(0, 2000)}

Generate the meta title and description.`

  try {
    const client = new Anthropic({ apiKey })
    const message = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : '{}'
    // Extract JSON from the response (Claude may wrap in markdown code block)
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Unexpected Claude response format' }, { status: 500 })
    }
    const parsed = JSON.parse(jsonMatch[0]) as { title?: string; description?: string }

    return NextResponse.json({
      title: (parsed.title ?? '').slice(0, 60),
      description: (parsed.description ?? '').slice(0, 155),
    })
  } catch (err) {
    console.error('[ai/meta]', err)
    return NextResponse.json({ error: 'Claude API error' }, { status: 500 })
  }
}
