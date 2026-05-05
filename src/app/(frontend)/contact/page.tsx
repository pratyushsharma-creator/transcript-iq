'use client'

import { useState, useCallback } from 'react'
import { Mail, MapPin, Clock, Send, ChevronDown } from 'lucide-react'
import { TurnstileWidget } from '@/components/ui/Turnstile'

// Note: metadata exported from a separate layout.tsx (this file uses 'use client')

const HAS_CAPTCHA = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)

const SUBJECTS = [
  'General enquiry',
  'Custom research request',
  'Enterprise / bulk licensing',
  'Expert network participation',
  'Compliance & due diligence',
  'Technical support',
  'Partnership or press',
  'Other',
]

const OFFICES = [
  { city: 'Singapore', note: 'Headquarters' },
  { city: 'Mumbai', note: 'Research operations' },
  { city: 'Bangalore', note: 'Technology' },
  { city: 'Jakarta', note: 'ASEAN coverage' },
]

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

  const handleTurnstileSuccess = useCallback((token: string) => setTurnstileToken(token), [])
  const handleTurnstileExpired  = useCallback(() => setTurnstileToken(null), [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, turnstileToken }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data?.error ?? 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }

      setStatus('sent')
    } catch {
      setErrorMsg('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  const isValid = form.name.trim() && form.company.trim() && form.email.trim() && form.subject && form.message.trim()

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-16">

      {/* Header */}
      <div className="mb-14">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]">Get in touch</p>
        <h1 className="mb-4 text-[44px] font-bold leading-[1.05] tracking-[-0.04em] text-[var(--ink)] sm:text-[52px]">
          Contact Us
        </h1>
        <p className="max-w-[520px] text-[16px] leading-relaxed text-[var(--ink-2)]">
          Whether you need custom research, want to discuss enterprise licensing, or have a compliance question — our team responds within one business day.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1fr_360px]">

        {/* ── Form ──────────────────────────────────────────────────────── */}
        {status === 'sent' ? (
          <div className="flex flex-col items-start justify-center rounded-2xl border border-[var(--accent-border)] bg-[var(--accent-tint)] p-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--accent-border)] bg-[var(--accent-tint)]" style={{ boxShadow: '0 0 40px -8px var(--accent-glow)' }}>
              <svg className="h-7 w-7 text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--accent)]">Message sent</p>
            <h2 className="mb-3 text-[28px] font-bold tracking-[-0.03em] text-[var(--ink)]">We&apos;ll be in touch.</h2>
            <p className="mb-8 text-[15px] leading-relaxed text-[var(--ink-2)]">
              Thanks for reaching out, <strong className="font-medium text-[var(--ink)]">{form.name}</strong>. Our team will respond to{' '}
              <strong className="font-medium text-[var(--ink)]">{form.email}</strong> within one business day.
            </p>
            <button
              onClick={() => { setStatus('idle'); setForm({ name: '', company: '', email: '', subject: '', message: '' }) }}
              className="text-[13px] text-[var(--accent)] underline underline-offset-4 hover:opacity-80"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name + Company */}
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
                <label htmlFor="company" className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--ink-2)]">
                  Organisation <span className="text-[var(--accent)]">*</span>
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  required
                  autoComplete="organization"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Acme Capital Partners"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[14px] text-[var(--ink)] placeholder:text-[var(--mist)] transition-colors focus:border-[var(--accent-border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-border)]/20"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--ink-2)]">
                Work Email <span className="text-[var(--accent)]">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="alex@acmecapital.com"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[14px] text-[var(--ink)] placeholder:text-[var(--mist)] transition-colors focus:border-[var(--accent-border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-border)]/20"
              />
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--ink-2)]">
                Subject <span className="text-[var(--accent)]">*</span>
              </label>
              <div className="relative">
                <select
                  id="subject"
                  name="subject"
                  required
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 pr-10 text-[14px] text-[var(--ink)] transition-colors focus:border-[var(--accent-border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-border)]/20"
                >
                  <option value="" disabled>Select a topic…</option>
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--mist)]" />
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--ink-2)]">
                Message <span className="text-[var(--accent)]">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us what you need…"
                className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[14px] text-[var(--ink)] placeholder:text-[var(--mist)] transition-colors focus:border-[var(--accent-border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-border)]/20"
              />
            </div>

            {/* Turnstile widget */}
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
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </button>
              <p className="text-[12px] text-[var(--mist)]">
                We respond within 1 business day
              </p>
            </div>
          </form>
        )}

        {/* ── Sidebar ───────────────────────────────────────────────────── */}
        <aside className="space-y-6">

          {/* Direct contact */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <h3 className="mb-4 text-[15px] font-semibold text-[var(--ink)]">Direct contacts</h3>
            <div className="space-y-3">
              {[
                { label: 'General', email: 'hello@transcript-iq.com' },
                { label: 'Support', email: 'support@transcript-iq.com' },
                { label: 'Compliance', email: 'compliance@transcript-iq.com' },
                { label: 'Press', email: 'press@transcript-iq.com' },
              ].map((c) => (
                <div key={c.label} className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--mist)]">{c.label}</span>
                  <a href={`mailto:${c.email}`} className="text-[13px] text-[var(--accent)] hover:underline hover:underline-offset-4">
                    {c.email}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Response time */}
          <div className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
            <div>
              <p className="mb-1 text-[13px] font-semibold text-[var(--ink)]">Response times</p>
              <div className="space-y-1 text-[12px] text-[var(--ink-2)]">
                <p>General enquiries — 1 business day</p>
                <p>Custom research — 2 business days</p>
                <p>Compliance / legal — 1 business day</p>
                <p>Technical support — 4 hours (business hours)</p>
              </div>
            </div>
          </div>

          {/* Offices */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[var(--accent)]" />
              <h3 className="text-[15px] font-semibold text-[var(--ink)]">Our offices</h3>
            </div>
            <div className="space-y-3">
              {OFFICES.map((o) => (
                <div key={o.city} className="flex items-center justify-between">
                  <span className="text-[14px] font-medium text-[var(--ink)]">{o.city}</span>
                  <span className="font-mono text-[11px] text-[var(--mist)]">{o.note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="rounded-xl border border-[var(--accent-border)] bg-[var(--accent-tint)] p-5">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--accent)]">
              Looking for…
            </p>
            <div className="space-y-2 text-[13px]">
              <a href="/free-transcript" className="flex items-center gap-2 text-[var(--ink-2)] hover:text-[var(--accent)]">
                <Mail className="h-3.5 w-3.5 text-[var(--accent)]" />
                Free transcript request
              </a>
              <a href="/compliance" className="flex items-center gap-2 text-[var(--ink-2)] hover:text-[var(--accent)]">
                <Mail className="h-3.5 w-3.5 text-[var(--accent)]" />
                Compliance documentation
              </a>
              <a href="/custom-reports" className="flex items-center gap-2 text-[var(--ink-2)] hover:text-[var(--accent)]">
                <Mail className="h-3.5 w-3.5 text-[var(--accent)]" />
                Custom research briefs
              </a>
            </div>
          </div>

        </aside>
      </div>
    </div>
  )
}
