import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

// ── GET /api/stripe/session?session_id=<id> ───────────────────────────────────
// Called by the confirmation page to hydrate the order summary from Stripe data.

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id parameter' }, { status: 400 })
  }

  try {
    // Retrieve the Checkout Session with line items expanded
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'line_items.data.price.product'],
    })

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment has not been completed for this session.' },
        { status: 402 }
      )
    }

    const meta = session.metadata ?? {}

    // Reconstruct items from line items
    const items = (session.line_items?.data ?? []).map((li) => {
      const product = li.price?.product as { name?: string; metadata?: Record<string, string> } | undefined
      const productMeta = product?.metadata ?? {}
      return {
        title: product?.name ?? li.description ?? '',
        type: (productMeta.type as 'transcript' | 'earnings') ?? 'transcript',
        ticker: productMeta.ticker || undefined,
        priceUsd: (li.amount_total ?? 0) / 100,
      }
    })

    const totalUsd = (session.amount_total ?? 0) / 100
    const subtotalUsd = items.reduce((s, i) => s + i.priceUsd, 0)
    const taxUsd = Math.max(0, Math.round((totalUsd - subtotalUsd) * 100) / 100)

    // Generate a deterministic ref from the session ID (same logic as webhook)
    // In production this should be read from the Orders collection
    const year = new Date().getFullYear()
    const shortId = sessionId.slice(-5).toUpperCase()
    const ref = `TIQ-${year}-${shortId}`

    return NextResponse.json({
      ref,
      email: session.customer_email ?? meta.customerEmail ?? '',
      items,
      subtotalUsd,
      taxUsd,
      totalUsd,
    })
  } catch (err) {
    console.error('[stripe/session]', err)
    const message = err instanceof Error ? err.message : 'Failed to retrieve session'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
