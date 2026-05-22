import { Resend } from 'resend'
import { PurchaseReceipt } from '../../emails/PurchaseReceipt'
import { getNotificationTo, getNotificationCC } from './notifications'

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
