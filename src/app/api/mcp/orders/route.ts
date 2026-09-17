import { NextRequest, NextResponse } from 'next/server'
import { getPayload, type Where } from 'payload'
import config from '@/payload.config'

/**
 * GET /api/mcp/orders
 *
 * Order listing for the MCP `list_orders` tool. Payload's own /api/orders only accepts a
 * logged-in admin session, not the per-user MCP key, so the tool always got 403.
 * Accepts either:
 *   Authorization: users API-Key <mcpApiKey>   — admin users only (orders hold customer data)
 *   Authorization: Bearer <PAYLOAD_SECRET>     — system access
 *
 * Query: limit (1–100, default 20), page (default 1), status, customerEmail
 */

export const runtime = 'nodejs'
export const maxDuration = 30

async function verifyAdmin(authHeader: string): Promise<boolean> {
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
      return user?.role === 'admin'
    } catch {
      return false
    }
  }
  return false
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('Authorization') ?? ''
  if (!(await verifyAdmin(auth))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const params = req.nextUrl.searchParams
  const limit = Math.min(Math.max(Number(params.get('limit')) || 20, 1), 100)
  const page = Math.max(Number(params.get('page')) || 1, 1)
  const where: Where = {}
  const status = params.get('status')
  const customerEmail = params.get('customerEmail')
  if (status) where.status = { equals: status }
  if (customerEmail) where.customerEmail = { equals: customerEmail }

  try {
    const payload = await getPayload({ config: await config })
    const result = await payload.find({
      collection: 'orders',
      where,
      limit,
      page,
      sort: '-createdAt',
      depth: 0,
      overrideAccess: true,
    })
    return NextResponse.json(result)
  } catch (err) {
    console.error('[api/mcp/orders]', err)
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
