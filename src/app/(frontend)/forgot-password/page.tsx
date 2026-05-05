'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { TurnstileWidget } from '@/components/ui/Turnstile'

const HAS_CAPTCHA = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sentTo, setSentTo] = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

  const handleTurnstileSuccess = useCallback((token: string) => setTurnstileToken(token), [])
  const handleTurnstileExpired  = useCallback(() => setTurnstileToken(null), [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (HAS_CAPTCHA && !turnstileToken) {
      setError('Security check in progress — please wait a moment and try again.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, turnstileToken }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data?.errors?.[0]?.message ?? data?.message ?? 'Something went wrong. Please try again.')
        setLoading(false)
        return
      }

      setSentTo(email)
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4 py-16">
      <div className="max-w-md w-full mx-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
        {sentTo ? (
          <div className="text-center">
            <div className="mb-4 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-tint)]">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-[var(--accent)]">
                  <path d="M2 6l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="2" y="4" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
            <h1 className="text-xl font-semibold text-[var(--ink)] tracking-tight">
              Check your inbox
            </h1>
            <p className="mt-3 text-[13px] text-[var(--mist)] leading-relaxed">
              We&apos;ve sent a reset link to{' '}
              <span className="text-[var(--ink-2)]">{sentTo}</span>. It expires in 1 hour.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-block text-[13px] text-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            >
              ← Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-semibold text-[var(--ink)] tracking-tight">
                Reset your{' '}
                <span className="text-[var(--accent)]">password</span>
              </h1>
              <p className="mt-2 text-[13px] text-[var(--mist)]">
                Enter your email and we&apos;ll send a reset link
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--ink-2)]">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-[14px] text-[var(--ink)] placeholder:text-[var(--mist)] focus:border-[var(--accent-border)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-border)] transition-colors"
                  placeholder="you@company.com"
                  autoComplete="email"
                />
              </div>

              {/* Turnstile widget */}
              <TurnstileWidget
                onSuccess={handleTurnstileSuccess}
                onExpired={handleTurnstileExpired}
                className="mt-1"
              />

              {error && (
                <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-[13px] text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || (HAS_CAPTCHA && !turnstileToken)}
                className="w-full rounded-[10px] bg-btn-primary px-4 py-3 text-[14px] font-semibold text-btn-primary-fg shadow-cta transition-all duration-base ease-out hover:-translate-y-px hover:bg-btn-primary-hover disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center">
              <Link
                href="/login"
                className="text-[13px] text-[var(--mist)] hover:text-[var(--accent)] transition-colors"
              >
                ← Back to sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
