import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { verifyTurnstile } from '@/lib/turnstile'

/**
 * POST /api/contact
 *
 * Verifies Cloudflare Turnstile, then sends the contact form submission to
 * the team via Resend. Returns 200 on success.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      name?: string
      company?: string
      email?: string
      subject?: string
      message?: string
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

    // 2. Basic field validation
    const { name, company, email, subject, message } = body
    if (!name?.trim() || !company?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    // 3. Send email via Resend
    const from = process.env.RESEND_FROM_EMAIL ?? 'hello@transcript-iq.com'
    const to   = process.env.CONTACT_TO_EMAIL  ?? 'hello@transcript-iq.com'
    const apiKey = process.env.RESEND_API_KEY

    if (apiKey) {
      const resend = new Resend(apiKey)
      await resend.emails.send({
        from,
        to,
        replyTo: email,
        subject: `[Contact] ${subject} — ${name} (${company})`,
        text: [
          `Name: ${name}`,
          `Company: ${company}`,
          `Email: ${email}`,
          `Subject: ${subject}`,
          '',
          message,
        ].join('\n'),
      })
    } else {
      // Dev: log to console instead of sending
      console.log('[contact] Would send email:', { name, company, email, subject, message })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[api/contact]', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
