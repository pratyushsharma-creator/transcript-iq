'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────────

type OrderItem = {
  title: string
  type: 'transcript' | 'earnings'
  ticker?: string
  priceUsd: number
}

type OrderData = {
  ref: string
  email: string
  items: OrderItem[]
  subtotalUsd: number
  taxUsd: number
  totalUsd: number
}

// ── Progress steps ─────────────────────────────────────────────────────────────

function Steps({ current }: { current: 1 | 2 | 3 }) {
  const steps = ['Cart', 'Checkout', 'Confirmation']
  return (
    <div className="mb-10 flex items-center gap-0">
      {steps.map((label, i) => {
        const n = i + 1
        const done = n <= current
        return (
          <div key={label} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border font-mono text-[10px] font-semibold transition-all ${
                  done
                    ? 'border-[var(--accent)] bg-[var(--accent)] text-[#052A18]'
                    : 'border-[var(--border)] bg-transparent text-[var(--mist)]'
                }`}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1.5 5l2.5 2.5 4.5-4.5" />
                </svg>
              </div>
              <span className={`font-mono text-[11px] tracking-[0.06em] ${done ? 'text-[var(--ink-2)]' : 'text-[var(--mist)]'}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && <div className="mx-3 h-px w-12 bg-[var(--border)]" />}
          </div>
        )
      })}
    </div>
  )
}

// ── Loading state ──────────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="mx-auto max-w-[680px] px-6 py-12">
      <Steps current={3} />
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)]" />
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--mist)]">
          Confirming your order…
        </p>
      </div>
    </div>
  )
}

// ── Error state ────────────────────────────────────────────────────────────────

function ErrorState({ message }: { message: string }) {
  return (
    <div className="mx-auto max-w-[680px] px-6 py-12">
      <Steps current={3} />
      <div className="rounded-xl border border-[rgba(248,113,113,0.3)] bg-[rgba(248,113,113,0.07)] p-8 text-center">
        <AlertCircle className="mx-auto mb-4 h-10 w-10 text-[#F87171]" />
        <h1 className="mb-3 text-[24px] font-semibold tracking-[-0.03em] text-[var(--ink)]">
          Something went wrong
        </h1>
        <p className="mb-6 text-[14px] text-[var(--ink-2)]">{message}</p>
        <p className="mb-8 font-mono text-[11px] text-[var(--mist)]">
          If you were charged, please email{' '}
          <a href="mailto:hello@transcript-iq.com" className="text-[var(--accent)] underline">
            hello@transcript-iq.com
          </a>{' '}
          and we will resolve it immediately.
        </p>
        <Link
          href="/expert-transcripts"
          className="inline-flex items-center gap-2 rounded-[10px] bg-btn-primary px-6 py-3 text-[14px] font-semibold text-btn-primary-fg shadow-cta transition-all duration-base ease-out hover:-translate-y-px hover:bg-btn-primary-hover"
        >
          Back to Library <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [order, setOrder] = useState<OrderData | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const fetchSession = useCallback(async (sid: string) => {
    try {
      const res = await fetch(`/api/stripe/session?session_id=${encodeURIComponent(sid)}`)
      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error ?? 'Could not retrieve your order details.')
      }

      setOrder(data)
      setStatus('success')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred.')
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    if (!sessionId) {
      setErrorMsg('No order session found. If you completed a purchase, check your email for a receipt.')
      setStatus('error')
      return
    }
    fetchSession(sessionId)
  }, [sessionId, fetchSession])

  if (status === 'loading') return <LoadingState />
  if (status === 'error') return <ErrorState message={errorMsg} />

  const o = order!

  return (
    <div className="mx-auto max-w-[680px] px-6 py-12">
      <Steps current={3} />

      {/* Success header */}
      <div className="mb-10 text-center">
        <div
          className="mx-auto mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 border-[var(--accent-border)] bg-[var(--accent-tint)]"
          style={{ boxShadow: '0 0 40px -8px var(--accent-glow)' }}
        >
          <CheckCircle2 className="h-8 w-8 text-[var(--accent)]" />
        </div>
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--accent)]">
          Order confirmed
        </p>
        <h1 className="mb-3 text-[36px] font-bold tracking-[-0.04em] text-[var(--ink)]">
          Your research is ready.
        </h1>
        <p className="text-[15px] leading-relaxed text-[var(--ink-2)]">
          A receipt and PDF download links have been sent to{' '}
          <strong className="font-medium text-[var(--ink)]">{o.email}</strong>.
        </p>
      </div>

      {/* Order details */}
      <div className="mb-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--mist)]">
          Order reference
        </div>
        <div className="mb-5 font-mono text-[15px] font-medium tracking-[0.04em] text-[var(--accent)]">
          {o.ref}
        </div>

        <div className="flex flex-col gap-3 border-t border-[var(--border)] pt-5">
          {o.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono text-[8px] font-semibold"
                  style={
                    item.type === 'earnings'
                      ? { background: 'rgba(251,191,36,.08)', border: '1px solid rgba(251,191,36,.28)', color: '#FBBF24' }
                      : { background: 'var(--accent-tint)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }
                  }
                >
                  {item.type === 'earnings' && item.ticker ? `$${item.ticker}` : 'EXP'}
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--mist)]">
                    {item.type === 'earnings' ? 'Earnings Analysis' : 'Expert Transcript'}
                  </p>
                  <p className="mt-0.5 text-[12px] leading-[1.35] text-[var(--ink)] max-w-[360px]">{item.title}</p>
                </div>
              </div>
              <span className="shrink-0 font-mono text-[13px] font-medium text-[var(--accent)]">
                ${item.priceUsd.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-1.5 border-t border-[var(--border)] pt-4 text-[13px]">
          <div className="flex justify-between text-[var(--ink-2)]">
            <span>Subtotal</span>
            <span className="font-mono">${o.subtotalUsd.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[var(--ink-2)]">
            <span>GST / Tax</span>
            <span className="font-mono">${o.taxUsd.toFixed(2)}</span>
          </div>
          <div className="mt-1 flex justify-between border-t border-[var(--border)] pt-2 font-semibold text-[var(--ink)]">
            <span>Total charged</span>
            <span className="font-mono text-[var(--accent)]">${o.totalUsd.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* What happens next */}
      <div className="mb-5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
        <h2 className="mb-3 text-[13px] font-semibold text-[var(--ink)]">What happens next?</h2>
        <div className="flex flex-col gap-3">
          {[
            { step: '01', text: 'Receipt sent to your email with order summary' },
            { step: '02', text: 'PDF download links delivered within minutes' },
            { step: '03', text: 'MNPI screening certificate included with each transcript' },
            { step: '04', text: 'Support available at hello@transcript-iq.com' },
          ].map(({ step, text }) => (
            <div key={step} className="flex items-start gap-3">
              <span className="font-mono text-[9px] font-semibold text-[var(--accent)] shrink-0 mt-0.5">{step}</span>
              <p className="text-[12px] text-[var(--ink-2)]">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance note */}
      <div className="mb-8 flex items-start gap-3 rounded-xl border border-[var(--accent-border)] bg-[var(--accent-tint)] p-4">
        <ShieldCheck className="mt-px h-4 w-4 shrink-0 text-[var(--accent)]" />
        <div>
          <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--accent)]">
            Compliance note
          </p>
          <p className="font-mono text-[9px] leading-[1.7] text-[var(--accent)]">
            All transcripts include an MNPI screening certificate. Cite as: "Expert call, [Sector], via Transcript-IQ, [Date]"
            in IC memos and research notes. Aligned with SEC §10b-5 and FCA expert network guidelines.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/expert-transcripts"
          className="group inline-flex items-center gap-2 rounded-[10px] bg-btn-primary px-6 py-3 text-[14px] font-semibold text-btn-primary-fg shadow-cta transition-all duration-base ease-out hover:-translate-y-px hover:bg-btn-primary-hover"
          style={{ letterSpacing: '-0.01em' }}
        >
          Continue Shopping
          <ArrowRight className="h-4 w-4 transition-transform duration-base ease-out group-hover:translate-x-0.5" />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-[10px] border border-[var(--border-2)] px-6 py-3 text-[14px] font-medium text-[var(--ink-2)] transition-all duration-base ease-out hover:-translate-y-px hover:border-[var(--accent-border)] hover:text-[var(--ink)]"
          style={{ letterSpacing: '-0.01em' }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
