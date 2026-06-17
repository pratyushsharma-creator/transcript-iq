import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export const runtime = 'nodejs'

type CheckoutBody = {
  email?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
}

/**
 * POST /api/ev-report-checkout
 *
 * Creates a one-time Stripe Checkout Session for the EV Ecosystem report ($3,499)
 * and returns the hosted-checkout URL for client-side redirect.
 *
 * If STRIPE_EV_REPORT_PRICE_ID is not configured, returns 503 with
 * { fallback: 'invoice' } so the page can show the "Request an invoice" path.
 */
export async function POST(req: NextRequest) {
  const priceId = process.env.STRIPE_EV_REPORT_PRICE_ID
  if (!priceId) {
    return NextResponse.json(
      { error: 'Checkout is not available right now.', fallback: 'invoice' },
      { status: 503 },
    )
  }

  let body: CheckoutBody = {}
  try {
    body = (await req.json()) as CheckoutBody
  } catch {
    // Body is optional — proceed with defaults
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.transcript-iq.com'

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      ...(body.email ? { customer_email: body.email } : {}),
      automatic_tax: { enabled: false },
      billing_address_collection: 'auto',
      success_url: `${siteUrl}/reports/ev-ecosystem/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/reports/ev-ecosystem`,
      metadata: {
        product: 'ev-ecosystem-report',
        campaign: 'ev-report-jun26',
        utm_source: body.utm_source ?? '',
        utm_medium: body.utm_medium ?? '',
        utm_campaign: body.utm_campaign ?? '',
        utm_content: body.utm_content ?? '',
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[ev-report-checkout]', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
