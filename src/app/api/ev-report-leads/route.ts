import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getNotificationTo, getNotificationCC } from '@/lib/notifications'
import { isPersonalEmail, BUSINESS_EMAIL_ERROR } from '@/lib/email-domains'
import { sendLeadConfirmation } from '@/lib/resend'

export const runtime = 'nodejs'

type LeadBody = {
  name?: string
  email?: string
  company?: string
  role?: string
  message?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  page_referrer?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * POST /api/ev-report-leads
 *
 * "Talk to our Research Analyst" lead form on /reports/ev-ecosystem.
 * Validates → rate-limits (same email within 60s) → saves to the
 * `ev-report-leads` Payload collection → notifies the team → confirms the lead.
 */
export async function POST(req: NextRequest) {
  let body: LeadBody
  try {
    body = (await req.json()) as LeadBody
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const name = body.name?.trim()
  const email = body.email?.trim().toLowerCase()
  const company = body.company?.trim()

  // 1. Validation — name, email, company are required
  if (!name || !email || !company) {
    return NextResponse.json(
      { error: 'Name, work email, and company are required.' },
      { status: 400 },
    )
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }
  // Business-email gate — reject personal / free inboxes.
  if (isPersonalEmail(email)) {
    return NextResponse.json({ error: BUSINESS_EMAIL_ERROR }, { status: 400 })
  }

  let payload
  try {
    payload = await getPayload({ config: await config })
  } catch (err) {
    console.error('[api/ev-report-leads] payload init failed:', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }

  // 2. Basic rate limit — reject a duplicate submission from the same email within 60s
  try {
    const sixtySecondsAgo = new Date(Date.now() - 60_000).toISOString()
    const recent = await payload.find({
      collection: 'ev-report-leads',
      where: {
        and: [{ email: { equals: email } }, { createdAt: { greater_than: sixtySecondsAgo } }],
      },
      limit: 1,
      overrideAccess: true,
    })
    if (recent.totalDocs > 0) {
      return NextResponse.json(
        { error: 'We just received your request. Please give us a moment.' },
        { status: 429 },
      )
    }
  } catch (err) {
    // Non-fatal — if the rate-limit check fails, continue rather than block a real lead
    console.warn('[api/ev-report-leads] rate-limit check failed:', err)
  }

  // 3. Save to the collection
  try {
    await payload.create({
      collection: 'ev-report-leads',
      data: {
        name,
        email,
        company,
        role: body.role?.trim() || undefined,
        message: body.message?.trim() || undefined,
        utm_source: body.utm_source || undefined,
        utm_medium: body.utm_medium || undefined,
        utm_campaign: body.utm_campaign || undefined,
        utm_content: body.utm_content || undefined,
        page_referrer: body.page_referrer || undefined,
        status: 'new',
      },
      overrideAccess: true,
    })
  } catch (err) {
    console.error('[api/ev-report-leads] failed to save lead:', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }

  // 4. Notify the team (non-fatal)
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL ?? 'hello@transcript-iq.com'
  const to = getNotificationTo()
  const cc = getNotificationCC()

  const utmLines = [
    body.utm_source && `  source:   ${body.utm_source}`,
    body.utm_medium && `  medium:   ${body.utm_medium}`,
    body.utm_campaign && `  campaign: ${body.utm_campaign}`,
    body.utm_content && `  content:  ${body.utm_content}`,
  ].filter(Boolean) as string[]

  const lines = [
    `📈  NEW EV REPORT LEAD — analyst consultation`,
    ``,
    `Name:     ${name}`,
    `Email:    ${email}`,
    `Company:  ${company}`,
    ...(body.role ? [`Role:     ${body.role}`] : []),
    ...(body.message ? [``, `What they're trying to solve:`, body.message] : []),
    ...(utmLines.length ? [``, `Attribution:`, ...utmLines] : []),
    ...(body.page_referrer ? [``, `Referrer: ${body.page_referrer}`] : []),
    ``,
    `Submitted: ${new Date().toISOString()}`,
  ]

  if (apiKey) {
    try {
      await new Resend(apiKey).emails.send({
        from,
        to,
        ...(cc.length > 0 ? { cc } : {}),
        replyTo: email,
        subject: `[EV Report Lead] ${name} — ${company}`,
        text: lines.join('\n'),
      })
    } catch (err) {
      console.error('[api/ev-report-leads] notification email failed:', err)
    }
  } else {
    console.log('[api/ev-report-leads] No RESEND_API_KEY — would send:\n' + lines.join('\n'))
  }

  // 5. Confirmation to the submitter (non-fatal — reuses the generic "contact" template)
  try {
    await sendLeadConfirmation({ to: email, type: 'contact', name })
  } catch (err) {
    console.error('[api/ev-report-leads] confirmation email failed:', err)
  }

  return NextResponse.json({ success: true })
}
