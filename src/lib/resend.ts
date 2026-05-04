import { Resend } from 'resend'
import { PurchaseReceipt } from '../../emails/PurchaseReceipt'

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

export async function sendReceipt(opts: SendReceiptOptions) {
  const from = process.env.RESEND_FROM_EMAIL ?? 'hello@transcript-iq.com'

  return resend.emails.send({
    from,
    to: opts.to,
    subject: `Your Transcript IQ order — ${opts.orderRef}`,
    react: PurchaseReceipt(opts),
  })
}
