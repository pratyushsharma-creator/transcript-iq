import { getCurrentUser } from '@/lib/auth'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { generateDownloadToken } from '@/lib/downloadToken'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Download, FileText, BarChart2 } from 'lucide-react'
import type { Order, User } from '@/payload-types'

export const revalidate = 0 // always fresh — user's purchase list must be current

type LineItem = {
  slug: string
  type: 'transcript' | 'earnings'
  title: string
  ticker?: string
  priceUsd: number
}

type PurchasedItem = LineItem & {
  downloadUrl: string
  orderRef: string
  purchasedAt: string
}

export default async function PurchasesPage() {
  const user = await getCurrentUser() as User | null
  if (!user) return notFound()

  const payload = await getPayload({ config: await config })
  const ordersResult = await payload.find({
    collection: 'orders',
    where: {
      customerEmail: { equals: user.email },
      status: { equals: 'paid' },
    },
    sort: '-createdAt',
    limit: 100,
    depth: 0,
    overrideAccess: true,
  })

  const orders = ordersResult.docs as Order[]

  // Flatten all line items from all orders with fresh download tokens
  const items: PurchasedItem[] = []

  for (const order of orders) {
    const lineItems = (Array.isArray(order.lineItems) ? order.lineItems : []) as LineItem[]
    for (const item of lineItems) {
      if (!item.slug) continue
      const { url } = generateDownloadToken(item.slug, item.type)
      items.push({
        ...item,
        downloadUrl: url,
        orderRef: order.orderRef ?? String(order.id),
        purchasedAt: order.createdAt.split('T')[0],
      })
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-[var(--bg)] px-4 py-16">
      <div className="mx-auto w-full max-w-2xl">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/account"
            className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--mist)] hover:text-[var(--accent)] transition-colors mb-4 inline-block"
          >
            ← Account
          </Link>
          <h1 className="text-2xl font-semibold text-[var(--ink)] tracking-tight">
            My purchases
          </h1>
          {items.length > 0 && (
            <p className="mt-1.5 text-[13px] text-[var(--mist)]">
              {items.length} item{items.length !== 1 ? 's' : ''} in your library
            </p>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty state */
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center">
            <div className="mb-4 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-2)]">
                <FileText className="h-6 w-6 text-[var(--mist)]" />
              </div>
            </div>
            <h2 className="text-[16px] font-semibold text-[var(--ink)] mb-2">
              No purchases yet
            </h2>
            <p className="text-[13px] text-[var(--mist)] mb-6 max-w-xs mx-auto">
              Browse our library of expert call transcripts and earnings analysis reports.
            </p>
            <Link
              href="/expert-transcripts"
              className="inline-flex items-center gap-2 rounded-[10px] bg-btn-primary px-5 py-2.5 text-[13px] font-semibold text-btn-primary-fg shadow-cta transition-all hover:-translate-y-px hover:bg-btn-primary-hover"
            >
              Browse transcripts
            </Link>
          </div>
        ) : (
          /* Purchases list */
          <div className="flex flex-col gap-3">
            {items.map((item, i) => (
              <div
                key={`${item.slug}-${i}`}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3 min-w-0">
                  {/* Type icon */}
                  <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--surface-2)]">
                    {item.type === 'transcript' ? (
                      <FileText className="h-4 w-4 text-[var(--accent)]" />
                    ) : (
                      <BarChart2 className="h-4 w-4 text-[var(--accent)]" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono text-[10px] uppercase tracking-[0.1em] px-2 py-0.5 rounded-full border border-[var(--border)] text-[var(--mist)]">
                        {item.type === 'transcript' ? 'Transcript' : 'Earnings'}
                      </span>
                      {item.ticker && (
                        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--accent)]">
                          {item.ticker}
                        </span>
                      )}
                    </div>
                    <p className="text-[14px] font-medium text-[var(--ink)] leading-snug line-clamp-2">
                      {item.title}
                    </p>
                    <p className="mt-1.5 font-mono text-[11px] text-[var(--mist)]">
                      Purchased {item.purchasedAt} · Ref {item.orderRef}
                    </p>
                  </div>
                </div>

                {/* Download button */}
                <a
                  href={item.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--ink-2)] hover:border-[var(--accent-border)] hover:text-[var(--accent)] transition-all"
                >
                  <Download className="h-3.5 w-3.5" />
                  PDF
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
