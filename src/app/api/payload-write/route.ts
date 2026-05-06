import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

/**
 * POST /api/payload-write
 *
 * Authenticated write proxy for MCP tools (create / patch).
 * Accepts either:
 *   Authorization: Bearer <PAYLOAD_SECRET>          — system access
 *   Authorization: users API-Key <mcpApiKey>        — per-user key (admin/editor only)
 *
 * Body: { collection, operation: 'create'|'patch', id?, data }
 */

export const runtime = 'nodejs'
export const maxDuration = 30

type AllowedCollection = 'blog-posts' | 'expert-transcripts' | 'earnings-analyses'
const ALLOWED: AllowedCollection[] = ['blog-posts', 'expert-transcripts', 'earnings-analyses']

async function verifyAdminOrEditor(authHeader: string): Promise<boolean> {
  // System-level access via PAYLOAD_SECRET
  if (authHeader.startsWith('Bearer ') && authHeader.slice(7) === process.env.PAYLOAD_SECRET) {
    return true
  }
  // Per-user access via mcpApiKey (sent as "users API-Key <key>")
  if (authHeader.startsWith('users API-Key ')) {
    const key = authHeader.slice('users API-Key '.length).trim()
    if (!key) return false
    try {
      const payload = await getPayload({ config: await config })
      const result = await payload.find({
        collection: 'users',
        where: { mcpApiKey: { equals: key } },
        limit: 1,
        overrideAccess: true,
      })
      const user = result.docs[0] as { role?: string } | undefined
      return user?.role === 'admin' || user?.role === 'editor'
    } catch {
      return false
    }
  }
  return false
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get('Authorization') ?? ''
  if (!(await verifyAdminOrEditor(auth))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { collection?: string; operation?: string; id?: string; data?: Record<string, unknown> }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { collection, operation, id, data } = body

  if (!collection || !operation || !data) {
    return NextResponse.json({ error: 'Missing required fields: collection, operation, data' }, { status: 400 })
  }

  if (!ALLOWED.includes(collection as AllowedCollection)) {
    return NextResponse.json({ error: `Invalid collection "${collection}"` }, { status: 400 })
  }

  try {
    const payload = await getPayload({ config: await config })
    const col = collection as AllowedCollection

    if (operation === 'create') {
      const doc = await payload.create({ collection: col, data: data as never, overrideAccess: true })
      return NextResponse.json({ doc })
    }

    if (operation === 'patch') {
      if (!id) return NextResponse.json({ error: 'id is required for patch' }, { status: 400 })
      const doc = await payload.update({ collection: col, id, data: data as never, overrideAccess: true })
      return NextResponse.json({ doc })
    }

    return NextResponse.json({ error: `Unknown operation "${operation}"` }, { status: 400 })
  } catch (err) {
    console.error('[api/payload-write]', err)
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
