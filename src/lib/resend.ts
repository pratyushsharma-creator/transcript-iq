import { Resend } from 'resend'
import { PurchaseReceipt } from '../../emails/PurchaseReceipt'
import { LeadConfirmation, type LeadConfirmationProps } from '../../emails/LeadConfirmation'
import { getNotificationTo, getNotificationCC, getEvReportNotificationTo } from './notifications'

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable')
}

export const resend = new Resend(process.env.RESEND_API_KEY)

export type ReceiptItem = {
  title: string
  type: 'transcript' | 'earnings'
  ticker?: string
  priceUsd: number
  downloadUrl?: string
}

export type SendReceiptOptions = {
  to: string
  customerName: string
  orderRef: string
  items: ReceiptItem[]
  subtotalUsd: number
  taxUsd: number
  totalUsd: number
}

/** Send the customer-facing purchase receipt. */
export async function sendReceipt(opts: SendReceiptOptions) {
  const from = process.env.RESEND_FROM_EMAIL ?? 'hello@transcript-iq.com'

  return resend.emails.send({
    from,
    to: opts.to,
    subject: `Your Transcript IQ order — ${opts.orderRef}`,
    react: PurchaseReceipt(opts),
  })
}

/**
 * Send a confirmation email to the user who submitted a lead form.
 * Variant (free-transcript / custom-transcript / custom-earnings / contact)
 * is driven by the `type` field — same enum as LeadConfirmationProps.
 */
export async function sendLeadConfirmation(opts: LeadConfirmationProps & { to: string }) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    // Dev fallback — skip silently (notification already logged)
    return
  }

  const from    = process.env.RESEND_FROM_EMAIL ?? 'hello@transcript-iq.com'
  const { to, ...props } = opts

  const subjectMap: Record<LeadConfirmationProps['type'], string> = {
    'free-transcript':  'Your free transcript is on its way — Transcript IQ',
    'custom-transcript':'Your research brief has been received — Transcript IQ',
    'custom-earnings':  'Your earnings analysis request has been received — Transcript IQ',
    'contact':          "We've received your message — Transcript IQ",
  }

  return new Resend(apiKey).emails.send({
    from,
    to,
    subject: subjectMap[props.type],
    react: LeadConfirmation(props),
  })
}

export type PurchaseAlertOptions = {
  orderRef: string
  customerName: string
  customerEmail: string
  organisation?: string
  items: ReceiptItem[]
  totalUsd: number
}

/**
 * Send an internal purchase alert to the team.
 * Goes to LEAD_NOTIFICATION_EMAIL (primary) + NOTIFICATION_CC_EMAILS (CC list).
 */
export async function sendPurchaseAlert(opts: PurchaseAlertOptions) {
  const from = process.env.RESEND_FROM_EMAIL ?? 'hello@transcript-iq.com'
  const to   = getNotificationTo()
  const cc   = getNotificationCC()

  const { orderRef, customerName, customerEmail, organisation, items, totalUsd } = opts

  const itemLines = items.map(
    (item, i) =>
      `  ${i + 1}. [${item.type === 'earnings' ? 'Earnings' : 'Transcript'}] ${item.title}  —  $${item.priceUsd}`,
  )

  const lines = [
    `🛒  NEW PURCHASE — ${orderRef}`,
    ``,
    `Customer:     ${customerName}`,
    `Email:        ${customerEmail}`,
    ...(organisation ? [`Organisation: ${organisation}`] : []),
    ``,
    `Items:`,
    ...itemLines,
    ``,
    `Total:        $${totalUsd.toFixed(2)} USD`,
    ``,
    `Purchased:    ${new Date().toISOString()}`,
    ``,
    `─── Action required ────────────────────────────────`,
    `Upload PDF(s) and send download link(s) to the`,
    `customer within 2 hours of this alert.`,
    `────────────────────────────────────────────────────`,
  ]

  return resend.emails.send({
    from,
    to,
    ...(cc.length > 0 ? { cc } : {}),
    replyTo: customerEmail,
    subject: `[Purchase] ${orderRef} — ${customerName} · $${totalUsd.toFixed(2)}`,
    text: lines.join('\n'),
  })
}

// ── EV Ecosystem report — manual-fulfilment emails ──────────────────────────────
// The 25-page report is delivered manually by the research team (no auto download),
// so the buyer gets a "we'll email it to you" confirmation and the team gets an alert.

export type EvReportPurchaseOptions = {
  to: string
  customerName?: string
  orderRef: string
}

/** Buyer-facing confirmation: payment received, report will be emailed by the team. */
export async function sendEvReportConfirmation(opts: EvReportPurchaseOptions) {
  const from = process.env.RESEND_FROM_EMAIL ?? 'hello@transcript-iq.com'
  const { to, customerName, orderRef } = opts

  const lines = [
    `Hi${customerName ? ' ' + customerName : ''},`,
    ``,
    `Thank you for purchasing "Can Europe Win the EV Ecosystem?" — Nextyn Research.`,
    `Your payment has been received (order ${orderRef}).`,
    ``,
    `Our research team will email the full 25-page report (PDF) and data appendix`,
    `to this address shortly — typically within one business day.`,
    ``,
    `Want to go deeper? You can book time with the practitioner behind the report`,
    `at $350/hr — just reply to this email and we'll arrange it.`,
    ``,
    `— Nextyn Research`,
  ]

  return resend.emails.send({
    from,
    to,
    subject: `Your report is on its way — Nextyn Research (${orderRef})`,
    text: lines.join('\n'),
  })
}

export type EvReportAlertOptions = {
  orderRef: string
  customerEmail: string
  customerName?: string
  totalUsd: number
  utm?: Record<string, string | undefined>
}

/** Internal alert to the research/sales team: an EV report was purchased — send the PDF. */
export async function sendEvReportAlert(opts: EvReportAlertOptions) {
  const from = process.env.RESEND_FROM_EMAIL ?? 'hello@transcript-iq.com'
  const to   = getEvReportNotificationTo()
  const cc   = getNotificationCC()

  const { orderRef, customerEmail, customerName, totalUsd, utm } = opts

  const utmLines = utm
    ? Object.entries(utm)
        .filter(([, v]) => Boolean(v))
        .map(([k, v]) => `  ${k}: ${v}`)
    : []

  const lines = [
    `🛒  EV ECOSYSTEM REPORT PURCHASED — ${orderRef}`,
    ``,
    `Customer:  ${customerName || customerEmail}`,
    `Email:     ${customerEmail}`,
    `Amount:    $${totalUsd.toFixed(2)} USD`,
    ...(utmLines.length ? [``, `Attribution:`, ...utmLines] : []),
    ``,
    `Purchased: ${new Date().toISOString()}`,
    ``,
    `─── ACTION REQUIRED ────────────────────────────────`,
    `Email the 25-page EV report PDF + data appendix to`,
    `the customer above. Fulfilment is manual for this product.`,
    `────────────────────────────────────────────────────`,
  ]

  return resend.emails.send({
    from,
    to,
    ...(cc.length > 0 ? { cc } : {}),
    replyTo: customerEmail,
    subject: `[EV Report] Purchase ${orderRef} — send PDF to ${customerEmail}`,
    text: lines.join('\n'),
  })
}
