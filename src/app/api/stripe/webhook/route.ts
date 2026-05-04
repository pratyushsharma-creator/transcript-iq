import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { sendReceipt } from '@/lib/resend'
import { generateDownloadToken } from '@/lib/downloadToken'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type Stripe from 'stripe'

// ── Disable body parsing — Stripe requires the raw request body ───────────────
export const runtime = 'nodejs'

// ── Helpers ───────────────────────────────────────────────────────────────────

function generateOrderRef(): string {
  const year = new Date().getFullYear()
  const rand = Math.floor(10000 + Math.random() * 90000)
  return `TIQ-${year}-${rand}`
}

// ── POST /api/stripe/webhook ───────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret)
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // ── Handle events ──────────────────────────────────────────────────────────

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        await handleCheckoutComplete(event.data.object as Stripe.Checkout.Session)
        break
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent
        console.warn('[webhook] Payment failed for PI:', pi.id, pi.last_payment_error?.message)
        // Future: update order status to 'failed' if order was pre-created
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        console.log('[webhook] Charge refunded:', charge.id)
        // Future: mark order as refunded
        break
      }

      default:
        // Unhandled event type — acknowledge receipt
        console.log('[webhook] Unhandled event type:', event.type)
    }
  } catch (err) {
    console.error('[webhook] Error handling event:', event.type, err)
    // Return 200 to prevent Stripe from retrying — log the error for manual review
    return NextResponse.json({ error: 'Handler error', received: true }, { status: 200 })
  }

  return NextResponse.json({ received: true })
}

// ── checkout.session.completed handler ────────────────────────────────────────

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const meta = session.metadata ?? {}

  const customerEmail = session.customer_email ?? meta.customerEmail ?? ''
  const customerName = meta.customerName ?? ''
  const organisation = meta.organisation ?? ''

  if (!customerEmail) {
    console.error('[webhook] No customer email in session:', session.id)
    return
  }

  // Parse items from metadata
  let items: Array<{
    slug: string
    type: 'transcript' | 'earnings'
    title: string
    ticker?: string
    quarter?: string
    priceUsd: number
  }> = []

  try {
    if (meta.itemsJson) {
      items = JSON.parse(meta.itemsJson)
    }
  } catch {
    console.warn('[webhook] Could not parse itemsJson — falling back to line items')
  }

  // If metadata parse failed (too long), reconstruct from Stripe line items
  if (items.length === 0) {
    const lineItemsResponse = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 100,
      expand: ['data.price.product'],
    })

    items = lineItemsResponse.data.map((li) => {
      const product = li.price?.product as Stripe.Product | undefined
      const productMeta = product?.metadata ?? {}
      return {
        slug: productMeta.slug ?? '',
        type: (productMeta.type as 'transcript' | 'earnings') ?? 'transcript',
        title: product?.name ?? li.description ?? '',
        ticker: productMeta.ticker || undefined,
        quarter: productMeta.quarter || undefined,
        priceUsd: (li.amount_total ?? 0) / 100,
      }
    })
  }

  // Calculate totals
  const totalPaid = (session.amount_total ?? 0) / 100
  const totalSubtotal = items.reduce((s, i) => s + i.priceUsd, 0)
  const taxUsd = Math.round((totalPaid - totalSubtotal) * 100) / 100

  const orderRef = generateOrderRef()

  // ── Create Order in Payload (local API — no HTTP round-trip) ─────────────────
  try {
    const payload = await getPayload({ config: await config })
    await payload.create({
      collection: 'orders',
      data: {
        customerEmail,
        customerName,
        organisation,
        lineItems: items,
        totalUsd: totalPaid,
        currency: 'usd',
        status: 'paid',
        paymentProvider: 'stripe',
        stripeCheckoutId: session.id,
        stripePaymentIntentId:
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : (session.payment_intent as Stripe.PaymentIntent | null)?.id ?? '',
        orderRef,
        billingAddress: {
          name: meta.billingName,
          line1: meta.billingAddress,
          city: meta.billingCity,
          country: meta.billingCountry,
          postal: meta.billingPostal,
          vatNumber: meta.vatNumber,
        },
      },
      overrideAccess: true, // bypass access control for server-side creation
    })
  } catch (err) {
    console.error('[webhook] Failed to create Payload order:', err)
    // Don't throw — still send the email even if DB write fails
  }

  // ── Generate signed download tokens for each item ─────────────────────────
  const itemsWithDownloads = items.map((i) => {
    const { url: downloadUrl } = generateDownloadToken(i.slug, i.type)
    return {
      title: i.title,
      type: i.type,
      ticker: i.ticker,
      priceUsd: i.priceUsd,
      downloadUrl,
    }
  })

  // ── Send receipt email ─────────────────────────────────────────────────────
  try {
    await sendReceipt({
      to: customerEmail,
      customerName: customerName || customerEmail,
      orderRef,
      items: itemsWithDownloads,
      subtotalUsd: totalSubtotal,
      taxUsd: Math.max(0, taxUsd),
      totalUsd: totalPaid,
    })
    console.log('[webhook] Receipt sent to:', customerEmail, 'ref:', orderRef)
  } catch (err) {
    console.error('[webhook] Failed to send receipt email:', err)
  }
}
