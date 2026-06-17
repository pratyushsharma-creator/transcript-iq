import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, AlertCircle, Mail } from 'lucide-react'
import { stripe } from '@/lib/stripe'
import { EV_REPORT } from '@/lib/ev-report/content'
import { ThankYouTracking } from '@/components/ev-report/ThankYouTracking'

export const metadata: Metadata = {
  title: 'Thank you — Can Europe Win the EV Ecosystem? | Nextyn Research',
  description: 'Your purchase is confirmed. Your report will be emailed to you shortly.',
  robots: { index: false, follow: false },
}

type VerifiedSession = { paid: boolean; email: string; amountUsd: number; sessionId: string }

async function verifySession(sessionId: string | undefined): Promise<VerifiedSession | null> {
  if (!sessionId) return null
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return {
      paid: session.payment_status === 'paid',
      email: session.customer_email ?? session.customer_details?.email ?? '',
      amountUsd: (session.amount_total ?? EV_REPORT.priceUsd * 100) / 100,
      sessionId,
    }
  } catch {
    return null
  }
}

const RETURN_LINK =
  'mt-10 inline-flex items-center gap-2 rounded-[11px] border border-[var(--border-2)] px-6 py-3 font-medium text-[var(--ink-2)] transition-all duration-200 hover:-translate-y-px hover:border-[var(--border)] hover:bg-[var(--surface-2)]'

export default async function EvReportThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; preview?: string }>
}) {
  const { session_id, preview } = await searchParams
  const isPreview = preview === '1'
  const verified = await verifySession(session_id)
  const ok = verified?.paid === true

  // Preview mode renders the exact success layout with placeholder data, without
  // calling Stripe and WITHOUT firing the purchase/conversion tracking.
  const result: VerifiedSession | null =
    verified ?? (isPreview ? { paid: true, email: 'you@yourfirm.com', amountUsd: EV_REPORT.priceUsd, sessionId: 'preview' } : null)
  const showSuccess = ok || (isPreview && result !== null)

  return (
    <div className="min-h-[70vh] bg-[var(--bg)] text-[var(--ink)]">
      <div className="mx-auto max-w-2xl px-6 py-24">
        {showSuccess && result ? (
          <>
            {ok && <ThankYouTracking sessionId={result.sessionId} value={result.amountUsd} />}

            <div className="flex flex-col items-center text-center">
              <CheckCircle2 className="h-14 w-14 text-[var(--accent)]" aria-hidden />
              <h1 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-[var(--ink)] sm:text-4xl">
                Your report is on its way.
              </h1>
              <p className="mt-4 max-w-md text-[var(--ink-2)]">
                Payment confirmed. Our research team will email the full {EV_REPORT.pages}-page report and data
                appendix{result.email ? <> to <span className="text-[var(--ink)]">{result.email}</span></> : null}{' '}
                shortly — typically within one business day.
              </p>

              <div className="mt-8 flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 text-left">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]" aria-hidden />
                <p className="text-sm text-[var(--ink-2)]">
                  Keep an eye on your inbox
                  {result.email ? <> at <span className="text-[var(--ink)]">{result.email}</span></> : null}. Want to
                  book time with the practitioner behind the report (${EV_REPORT.consultRateUsd}/hr)? Just reply to that
                  email.
                </p>
              </div>

              <Link href="/reports/ev-ecosystem" className={RETURN_LINK}>
                Return to report page
              </Link>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-center">
            <AlertCircle className="h-14 w-14 text-[var(--mist)]" aria-hidden />
            <h1 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-[var(--ink)]">
              We couldn&rsquo;t confirm this purchase.
            </h1>
            <p className="mt-4 max-w-md text-[var(--ink-2)]">
              If you completed payment, your report will still be emailed to you. If you have any concerns, contact us
              at{' '}
              <a href="mailto:info@nextyn.com" className="text-[var(--accent)] hover:underline">
                info@nextyn.com
              </a>
              .
            </p>
            <Link href="/reports/ev-ecosystem" className={RETURN_LINK}>
              Return to report page
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
