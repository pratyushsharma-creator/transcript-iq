'use client'

import { useRef, useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { getStoredUtm } from '@/components/site/UTMCapture'
import { trackEvent, trackAdsConversion, trackBingEvent, trackTaboolaEvent } from '@/lib/analytics/events'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function AnalystLeadForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const startedRef = useRef(false)

  function handleFirstFocus() {
    if (startedRef.current) return
    startedRef.current = true
    trackEvent('form_start', { form: 'analyst_lead' })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setStatus('submitting')

    const form = e.currentTarget
    const data = new FormData(form)
    const utm = getStoredUtm()

    const payload = {
      name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      company: String(data.get('company') ?? '').trim(),
      role: String(data.get('role') ?? '').trim(),
      message: String(data.get('message') ?? '').trim(),
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      utm_content: utm.utm_content,
      page_referrer: utm.page_referrer,
    }

    try {
      const res = await fetch('/api/ev-report-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(body.error || 'Something went wrong. Please try again.')
      }

      setStatus('success')
      trackEvent('generate_lead', {
        event_category: 'ev_report',
        event_label: 'analyst_consultation',
      })
      // Separate Ads conversion action for leads (uses NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION
      // when set; otherwise dormant until configured).
      trackAdsConversion({ conversionLabel: process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION })
      // Microsoft Ads + Taboola lead conversions (dormant until their IDs are set)
      trackBingEvent('lead', { event_category: 'ev_report', event_label: 'analyst_consultation' })
      trackTaboolaEvent('lead')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-[var(--accent-border)] bg-[var(--accent-tint)] p-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-[var(--accent)]" aria-hidden />
        <h3 className="text-xl font-semibold text-[var(--ink)]">Thanks — we&rsquo;ll be in touch within 24 hours.</h3>
        <p className="max-w-md text-sm text-[var(--ink-2)]">
          Our research analyst will reach out to walk you through the findings and how they apply to your context.
        </p>
      </div>
    )
  }

  const inputClass =
    'w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--ink)] placeholder:text-[var(--mist)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-glow)]'

  return (
    <form onSubmit={handleSubmit} onFocusCapture={handleFirstFocus} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="lead-name" className="mb-1.5 block text-sm font-medium text-[var(--ink-2)]">
            Full name <span className="text-[var(--accent)]">*</span>
          </label>
          <input id="lead-name" name="name" type="text" required autoComplete="name" className={inputClass} placeholder="Jane Doe" />
        </div>
        <div>
          <label htmlFor="lead-email" className="mb-1.5 block text-sm font-medium text-[var(--ink-2)]">
            Work email <span className="text-[var(--accent)]">*</span>
          </label>
          <input id="lead-email" name="email" type="email" required autoComplete="email" className={inputClass} placeholder="jane@firm.com" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="lead-company" className="mb-1.5 block text-sm font-medium text-[var(--ink-2)]">
            Company <span className="text-[var(--accent)]">*</span>
          </label>
          <input id="lead-company" name="company" type="text" required autoComplete="organization" className={inputClass} placeholder="Firm / fund / org" />
        </div>
        <div>
          <label htmlFor="lead-role" className="mb-1.5 block text-sm font-medium text-[var(--ink-2)]">
            Role / title
          </label>
          <input id="lead-role" name="role" type="text" className={inputClass} placeholder="Partner, Analyst, VP Strategy…" />
        </div>
      </div>

      <div>
        <label htmlFor="lead-message" className="mb-1.5 block text-sm font-medium text-[var(--ink-2)]">
          What are you trying to solve?
        </label>
        <textarea id="lead-message" name="message" rows={4} className={inputClass} placeholder="Your portfolio, your platform, your policy question…" />
      </div>

      {status === 'error' && error && (
        <p className="text-sm text-[#EF4444]" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex w-full items-center justify-center gap-2 rounded-[11px] bg-btn-primary px-7 py-3.5 font-semibold text-btn-primary-fg transition-all duration-200 hover:-translate-y-px hover:bg-btn-primary-hover disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Sending…
          </>
        ) : (
          'Request a Conversation'
        )}
      </button>
    </form>
  )
}
