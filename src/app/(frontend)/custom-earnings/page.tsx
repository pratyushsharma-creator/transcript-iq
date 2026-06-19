'use client'

// ── Configurable content — edit these constants to update the page ────────────
const PAGE_CONFIG = {
  eyebrow:     'Custom Research',
  heading:     'Request a Custom Earnings Analysis',
  subheading:  'Tell us which company and quarter you need covered. We produce deep-dive earnings analyses for any public company — MNPI-screened, buy-side ready, delivered same day.',
  price:       '$99',
  priceLabel:  'per analysis',
  deliverySLA: 'same day',
  whatYouGet: [
    'Full earnings call transcript — verbatim Q&A with management',
    'Analyst-written deep-dive commentary on beats, misses, and guidance',
    'Key metrics table: EPS, revenue, margins, guidance deltas',
    'Segment-by-segment breakdown and year-over-year comparison',
    'MNPI-screened · Compliance certificate included',
    'Delivered as a structured PDF — buy-side ready',
  ],
} as const
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from 'react'
import { Send } from 'lucide-react'
import { TurnstileWidget } from '@/components/ui/Turnstile'
import { trackLeadConversion } from '@/lib/analytics/events'

const HAS_CAPTCHA = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)

// ── Common country codes (Asia-Pacific + major markets) ───────────────────────
const COUNTRY_CODES = [
  { code: '+65', name: 'Singapore' },
  { code: '+91', name: 'India' },
  { code: '+62', name: 'Indonesia' },
  { code: '+60', name: 'Malaysia' },
  { code: '+66', name: 'Thailand' },
  { code: '+84', name: 'Vietnam' },
  { code: '+63', name: 'Philippines' },
  { code: '+94', name: 'Sri Lanka' },
  { code: '+880', name: 'Bangladesh' },
  { code: '+971', name: 'UAE' },
  { code: '+966', name: 'Saudi Arabia' },
  { code: '+974', name: 'Qatar' },
  { code: '+44', name: 'United Kingdom' },
  { code: '+1',  name: 'United States' },
  { code: '+61', name: 'Australia' },
  { code: '+81', name: 'Japan' },
  { code: '+82', name: 'South Korea' },
  { code: '+852', name: 'Hong Kong' },
  { code: '+86', name: 'China' },
  { code: '+49', name: 'Germany' },
  { code: '+33', name: 'France' },
  { code: '+31', name: 'Netherlands' },
  { code: '+41', name: 'Switzerland' },
]

type FormState = {
  name: string
  countryCode: string
  phone: string
  organisation: string
  message: string
}

export default function CustomEarningsPage() {
  const [form, setForm] = useState<FormState>({
    name:         '',
    countryCode:  '+65',
    phone:        '',
    organisation: '',
    message:      '',
  })
  const [status, setStatus]         = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg]     = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

  const handleTurnstileSuccess = useCallback((token: string) => setTurnstileToken(token), [])
  const handleTurnstileExpired  = useCallback(() => setTurnstileToken(null), [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (HAS_CAPTCHA && !turnstileToken) {
      setErrorMsg('Security check in progress — please wait a moment and try again.')
      return
    }

    setStatus('sending')

    try {
      const res = await fetch('/api/lead', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type:          'custom-earnings',
          name:          form.name,
          email:         '', // email is not collected on this form — team follows up
          phone:         `${form.countryCode} ${form.phone}`.trim(),
          org:           form.organisation,
          details:       form.message,
          topic:         form.organisation
                           ? `Custom earnings analysis requested by ${form.name} (${form.organisation})`
                           : `Custom earnings analysis requested by ${form.name}`,
          turnstileToken,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data?.error ?? 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }

      setStatus('sent')
      trackLeadConversion({ category: 'custom_earnings' })
    } catch {
      setErrorMsg('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  const isValid =
    form.name.trim() && form.phone.trim() && form.organisation.trim() && form.message.trim()

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-16">

      {/* Page header */}
      <div className="mb-14">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]">
          {PAGE_CONFIG.eyebrow}
        </p>
        <h1 className="mb-4 text-[44px] font-bold leading-[1.05] tracking-[-0.04em] text-[var(--ink)] sm:text-[52px]">
          {PAGE_CONFIG.heading}
        </h1>
        <p className="max-w-[560px] text-[16px] leading-relaxed text-[var(--ink-2)]">
          {PAGE_CONFIG.subheading}
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1fr_400px]">

        {/* ── Form ──────────────────────────────────────────────────────── */}
        {status === 'sent' ? (
          <div className="flex flex-col items-start justify-center rounded-2xl border border-[var(--accent-border)] bg-[var(--accent-tint)] p-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--accent-border)] bg-[var(--accent-tint)]"
              style={{ boxShadow: '0 0 40px -8px var(--accent-glow)' }}>
              <svg className="h-7 w-7 text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--accent)]">Request received</p>
            <h2 className="mb-3 text-[28px] font-bold tracking-[-0.03em] text-[var(--ink)]">We&apos;ll be in touch.</h2>
            <p className="mb-8 text-[15px] leading-relaxed text-[var(--ink-2)]">
              Thanks, <strong className="font-medium text-[var(--ink)]">{form.name}</strong>. Our team will review your request and follow up within 1 business day to confirm scope and delivery timeline.
            </p>
            <button
              onClick={() => {
                setStatus('idle')
                setForm({ name: '', countryCode: '+65', phone: '', organisation: '', message: '' })
              }}
              className="text-[13px] text-[var(--accent)] underline underline-offset-4 hover:opacity-80"
            >
              Submit another request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name + Organisation */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--ink-2)]">
                  Full Name <span className="text-[var(--accent)]">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Alex Chen"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[14px] text-[var(--ink)] placeholder:text-[var(--mist)] transition-colors focus:border-[var(--accent-border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-border)]/20"
                />
              </div>
              <div>
                <label htmlFor="organisation" className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--ink-2)]">
                  Organisation <span className="text-[var(--accent)]">*</span>
                </label>
                <input
                  id="organisation"
                  name="organisation"
                  type="text"
                  required
                  autoComplete="organization"
                  value={form.organisation}
                  onChange={handleChange}
                  placeholder="Acme Capital Partners"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[14px] text-[var(--ink)] placeholder:text-[var(--mist)] transition-colors focus:border-[var(--accent-border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-border)]/20"
                />
              </div>
            </div>

            {/* Phone with country selector */}
            <div>
              <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--ink-2)]">
                Phone Number <span className="text-[var(--accent)]">*</span>
              </label>
              <div className="flex gap-2">
                <div className="relative">
                  <select
                    name="countryCode"
                    value={form.countryCode}
                    onChange={handleChange}
                    className="h-full appearance-none rounded-lg border border-[var(--border)] bg-[var(--surface)] py-3 pl-3 pr-8 text-[14px] text-[var(--ink)] transition-colors focus:border-[var(--accent-border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-border)]/20"
                    style={{ minWidth: '90px' }}
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code + c.name} value={c.code}>
                        {c.code} {c.name}
                      </option>
                    ))}
                  </select>
                  <svg className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--mist)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <input
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel-national"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="9123 4567"
                  className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[14px] text-[var(--ink)] placeholder:text-[var(--mist)] transition-colors focus:border-[var(--accent-border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-border)]/20"
                />
              </div>
            </div>

            {/* Message / request details */}
            <div>
              <label htmlFor="message" className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--ink-2)]">
                Request Details <span className="text-[var(--accent)]">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                value={form.message}
                onChange={handleChange}
                placeholder="Which company and quarter do you need? e.g. NVDA Q1 FY2026. Any specific focus areas or metrics?"
                className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[14px] text-[var(--ink)] placeholder:text-[var(--mist)] transition-colors focus:border-[var(--accent-border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-border)]/20"
              />
            </div>

            {/* Turnstile */}
            <TurnstileWidget
              onSuccess={handleTurnstileSuccess}
              onExpired={handleTurnstileExpired}
            />

            {errorMsg && (
              <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-[13px] text-red-400">
                {errorMsg}
              </p>
            )}

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={!isValid || status === 'sending' || (HAS_CAPTCHA && !turnstileToken)}
                className="inline-flex items-center gap-2 rounded-[10px] bg-btn-primary px-6 py-3 text-[14px] font-semibold text-btn-primary-fg shadow-cta transition-all duration-base ease-out hover:-translate-y-px hover:bg-btn-primary-hover disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {status === 'sending' ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 11-6.219-8.56" />
                    </svg>
                    Submitting…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Request
                  </>
                )}
              </button>
              <p className="text-[12px] text-[var(--mist)]">
                We follow up within 1 business day
              </p>
            </div>
          </form>
        )}

        {/* ── Sidebar ───────────────────────────────────────────────────── */}
        <aside className="space-y-6">

          {/* Pricing card */}
          <div className="rounded-xl border border-[var(--accent-border)] bg-[var(--accent-tint)] p-6">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--accent)]">
              Pricing
            </p>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="font-mono text-[40px] font-bold tracking-[-0.04em] leading-none text-[var(--accent)]">
                {PAGE_CONFIG.price}
              </span>
              <span className="text-[14px] text-[var(--ink-2)]">{PAGE_CONFIG.priceLabel}</span>
            </div>
            <p className="text-[13px] text-[var(--ink-2)] leading-relaxed">
              One-time fee. Delivered within{' '}
              <span className="font-medium text-[var(--ink)]">{PAGE_CONFIG.deliverySLA}</span> of order confirmation.
            </p>
          </div>

          {/* What you get */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <h3 className="mb-4 text-[15px] font-semibold text-[var(--ink)]">What&apos;s included</h3>
            <ul className="space-y-2.5">
              {PAGE_CONFIG.whatYouGet.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[13px] text-[var(--ink-2)]">
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border border-[var(--accent-border)] bg-[var(--accent-tint)]">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--accent)]">
                      <path d="M1 4l2.5 2.5 4-4" />
                    </svg>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Compliance */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--accent)] mb-2">
              Compliance
            </p>
            <p className="text-[13px] leading-relaxed text-[var(--ink-2)]">
              Every analysis is MNPI-screened and delivered with a compliance certificate suitable for institutional filing.
            </p>
          </div>

        </aside>
      </div>
    </div>
  )
}
