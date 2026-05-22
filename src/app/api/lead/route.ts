import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { verifyTurnstile } from '@/lib/turnstile'

/**
 * POST /api/lead
 *
 * Unified lead-capture endpoint for:
 *   - Free transcript requests  (type: 'free-transcript')
 *   - Custom transcript briefs  (type: 'custom-transcript')
 *   - Custom earnings requests  (type: 'custom-earnings')
 *
 * Verifies Cloudflare Turnstile, then sends a notification email via Resend.
 * Recipient is controlled by LEAD_NOTIFICATION_EMAIL env var.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      type?: string
      email?: string
      sector?: string
      name?: string
      org?: string
      phone?: string
      topic?: string
      details?: string
      turnstileToken?: string
    }

    // 1. Turnstile verification
    const { success, errorCode } = await verifyTurnstile(body.turnstileToken)
    if (!success) {
      return NextResponse.json(
        { error: 'Bot verification failed. Please refresh and try again.', errorCode },
        { status: 403 },
      )
    }

    // 2. Basic validation
    if (!body.email?.trim()) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    }

    // 3. Build notification email
    const apiKey = process.env.RESEND_API_KEY
    const from   = process.env.RESEND_FROM_EMAIL       ?? 'hello@transcript-iq.com'
    const to     = process.env.LEAD_NOTIFICATION_EMAIL ?? 'pratyush.sharma@nextyn.com'

    const { type, email, sector, name, org, phone, topic, details } = body

    const typeLabel =
      type === 'free-transcript'
        ? 'Free Transcript Request'
        : type === 'custom-earnings'
        ? 'Custom Earnings Analysis Request'
        : 'Custom Transcript Request'

    const subject = name
      ? `[Lead] ${typeLabel} — ${name} at ${org ?? 'Unknown Org'}`
      : `[Lead] ${typeLabel} — ${email}${sector ? ` · ${sector}` : ''}`

    const lines: string[] = [
      `Type:   ${typeLabel}`,
      `Email:  ${email}`,
    ]
    if (name)    lines.push(`Name:   ${name}`)
    if (org)     lines.push(`Org:    ${org}`)
    if (phone)   lines.push(`Phone:  ${phone}`)
    if (sector)  lines.push(`Sector: ${sector}`)
    if (topic)   lines.push(``, `Topic:`, topic)
    if (details) lines.push(``, `Details:`, details)
    lines.push(``, `Submitted: ${new Date().toISOString()}`)

    if (apiKey) {
      const resend = new Resend(apiKey)
      await resend.emails.send({
        from,
        to,
        replyTo: email,
        subject,
        text: lines.join('\n'),
      })
    } else {
      // Dev fallback — log so we can see the lead in console
      console.log('[api/lead] No RESEND_API_KEY — would send:\n' + lines.join('\n'))
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[api/lead]', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
