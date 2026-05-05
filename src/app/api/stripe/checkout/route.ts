import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { verifyTurnstile } from '@/lib/turnstile'

// ── Types ─────────────────────────────────────────────────────────────────────

type CartItem = {
  id: string
  slug: string
  type: 'transcript' | 'earnings'
  title: string
  ticker?: string
  quarter?: string
  tier?: string
  priceUsd: number
  originalPriceUsd?: number
}

type CheckoutBody = {
  items: CartItem[]
  customer: {
    firstName: string
    lastName: string
    email: string
    organisation: string
    role?: string
  }
  billing: {
    name: string
    addressLine1: string
    city: string
    country: string
    postalCode?: string
    vatNumber?: string
  }
  turnstileToken?: string
}

// ── POST /api/stripe/checkout ─────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutBody = await req.json()
    const { items, customer, billing } = body

    // Verify Turnstile before creating Stripe session (dev bypass when key unset)
    const { success: turnstileOk, errorCode } = await verifyTurnstile(body.turnstileToken)
    if (!turnstileOk) {
      return NextResponse.json(
        { error: 'Bot verification failed. Please refresh and try again.', errorCode },
        { status: 403 },
      )
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }
    if (!customer?.email) {
      return NextResponse.json({ error: 'Customer email is required' }, { status: 400 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://transcript-iq.com'

    // Build line items — using price_data since we don't pre-create Stripe Products
    const lineItems = items.map((item) => {
      const subtitle =
        item.type === 'earnings'
          ? `${item.ticker ?? ''} · ${item.quarter ?? ''} Earnings Analysis`
          : `Expert Transcript · ${item.tier ? item.tier.charAt(0).toUpperCase() + item.tier.slice(1) + ' tier' : 'Standard'}`

      return {
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(item.priceUsd * 100), // Stripe uses cents
          product_data: {
            name: item.title,
            description: subtitle,
            metadata: {
              slug: item.slug,
              type: item.type,
              ticker: item.ticker ?? '',
              quarter: item.quarter ?? '',
            },
          },
        },
        quantity: 1,
      }
    })

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      customer_email: customer.email,

      // Shipping / billing collection disabled — we already have the info
      billing_address_collection: 'auto',

      // Success / cancel URLs
      success_url: `${siteUrl}/checkout/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout?cancelled=true`,

      // Pass our data as metadata so the webhook can reconstruct the order
      metadata: {
        customerFirstName: customer.firstName,
        customerLastName: customer.lastName,
        customerName: `${customer.firstName} ${customer.lastName}`,
        customerEmail: customer.email,
        organisation: customer.organisation,
        role: customer.role ?? '',
        billingName: billing.name,
        billingAddress: billing.addressLine1,
        billingCity: billing.city,
        billingCountry: billing.country,
        billingPostal: billing.postalCode ?? '',
        vatNumber: billing.vatNumber ?? '',
        // JSON-encode items for webhook reconstruction (Stripe metadata is string-only)
        itemSlugs: items.map((i) => i.slug).join(','),
        itemTypes: items.map((i) => i.type).join(','),
        itemsJson: JSON.stringify(
          items.map((i) => ({
            slug: i.slug,
            type: i.type,
            title: i.title,
            ticker: i.ticker,
            quarter: i.quarter,
            priceUsd: i.priceUsd,
          }))
        ).slice(0, 500), // Stripe metadata values have a 500-char limit; full data is in line items
      },

      // Store full items as session-level custom text (no limit)
      // This is passed through to the webhook via the session object
      payment_intent_data: {
        metadata: {
          itemCount: String(items.length),
          customerEmail: customer.email,
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[stripe/checkout]', err)
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
