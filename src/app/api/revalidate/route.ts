import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

export const runtime = 'nodejs'

/**
 * POST /api/revalidate
 *
 * Cache-only on-demand revalidation. Busts the given Next.js cache tags so
 * freshly-seeded / externally-mutated content shows without waiting for the
 * time-based TTL. Touches NO database — safe regardless of Payload schema state.
 *
 * Auth: Authorization: Bearer <PAYLOAD_SECRET>
 * Body: { "tags": ["blog-posts", ...] }
 */
export async function POST(req: NextRequest) {
  const auth = req.headers.get('Authorization') ?? ''
  if (!(auth.startsWith('Bearer ') && auth.slice(7) === process.env.PAYLOAD_SECRET)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { tags?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const tags = Array.isArray(body.tags)
    ? body.tags.filter((t): t is string => typeof t === 'string' && t.length > 0)
    : []
  if (tags.length === 0) {
    return NextResponse.json({ error: 'Provide a non-empty "tags" array.' }, { status: 400 })
  }

  for (const tag of tags) {
    revalidateTag(tag, 'max')
  }
  return NextResponse.json({ revalidated: tags })
}
