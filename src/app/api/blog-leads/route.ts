import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { getNotificationTo, getNotificationCC } from '@/lib/notifications'
import { sendLeadConfirmation } from '@/lib/resend'

export const runtime = 'nodejs'

type LeadBody = {
  name?: string
  email?: string
  role?: string
  company?: string
  message?: string
  blogTitle?: string
  blogSlug?: string
  recipient?: string
  cc?: string
  page_referrer?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * POST /api/blog-leads
 *
 * "Request a conversation" lead form rendered in the blog sidebar
 * (/resources/[slug]). Validates → rate-limits (same email within 60s) →
 * saves to the `blog-leads` collection → notifies the team → confirms the lead.
 *
 * `recipient` is an optional per-post notification override (the post's
 * leadForm.recipient field); falls back to the global notification address.
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

  // 1. Validation — name + email are always required
  if (!name || !email) {
    return NextResponse.json({ error: 'Name and work email are required.' }, { status: 400 })
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  let payload
  try {
    payload = await getPayload({ config: await config })
  } catch (err) {
    console.error('[api/blog-leads] payload init failed:', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }

  // 2. Basic rate limit — reject a duplicate from the same email within 60s.
  //    `blog-leads` isn't in the generated payload types yet (added in this PR),
  //    so the find/create calls are loosely typed.
  try {
    const sixtySecondsAgo = new Date(Date.now() - 60_000).toISOString()
    const recent = await (payload.find as (args: unknown) => Promise<{ totalDocs: number }>)({
      collection: 'blog-leads',
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
    console.warn('[api/blog-leads] rate-limit check failed:', err)
  }

  // 3. Save to the collection
  try {
    await (payload.create as (args: unknown) => Promise<unknown>)({
      collection: 'blog-leads',
      data: {
        name,
        email,
        role: body.role?.trim() || undefined,
        company: body.company?.trim() || undefined,
        message: body.message?.trim() || undefined,
        blogTitle: body.blogTitle?.trim() || undefined,
        blogSlug: body.blogSlug?.trim() || undefined,
        page_referrer: body.page_referrer || undefined,
        status: 'new',
      },
      overrideAccess: true,
    })
  } catch (err) {
    console.error('[api/blog-leads] failed to save lead:', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }

  // 4. Notify the team (non-fatal). Per-post `recipient` overrides the default.
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL ?? 'hello@transcript-iq.com'
  const override = body.recipient?.trim().toLowerCase()
  const to = override && EMAIL_RE.test(override) ? override : getNotificationTo()
  // CC = global NOTIFICATION_CC_EMAILS + any per-post CC (leadForm.recipientCc,
  // comma/semicolon separated). Validate, de-duplicate, and drop the `to` address.
  const perPostCc = (body.cc ?? '')
    .split(/[,;]/)
    .map((e) => e.trim().toLowerCase())
    .filter((e) => EMAIL_RE.test(e))
  const cc = Array.from(new Set([...getNotificationCC(), ...perPostCc])).filter((e) => e !== to)

  const lines = [
    `📨  NEW BLOG LEAD — request a conversation`,
    ``,
    `Name:     ${name}`,
    `Email:    ${email}`,
    ...(body.role ? [`Role:     ${body.role}`] : []),
    ...(body.company ? [`Company:  ${body.company}`] : []),
    ...(body.message ? [``, `Message:`, body.message] : []),
    ``,
    ...(body.blogTitle ? [`Article:  ${body.blogTitle}`] : []),
    ...(body.blogSlug ? [`URL:      /resources/${body.blogSlug}`] : []),
    ...(body.page_referrer ? [`Referrer: ${body.page_referrer}`] : []),
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
        subject: `[Blog Lead] ${name}${body.company ? ` — ${body.company}` : ''}`,
        text: lines.join('\n'),
      })
    } catch (err) {
      console.error('[api/blog-leads] notification email failed:', err)
    }
  } else {
    console.log('[api/blog-leads] No RESEND_API_KEY — would send:\n' + lines.join('\n'))
  }

  // 5. Confirmation to the submitter (non-fatal — reuses the generic "contact" template)
  try {
    await sendLeadConfirmation({ to: email, type: 'contact', name })
  } catch (err) {
    console.error('[api/blog-leads] confirmation email failed:', err)
  }

  return NextResponse.json({ success: true })
}
