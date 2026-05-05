'use client'

import { use, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TurnstileWidget } from '@/components/ui/Turnstile'

const HAS_CAPTCHA = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)

export default function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

  const handleTurnstileSuccess = useCallback((t: string) => setTurnstileToken(t), [])
  const handleTurnstileExpired  = useCallback(() => setTurnstileToken(null), [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (HAS_CAPTCHA && !turnstileToken) {
      setError('Security check in progress — please wait a moment and try again.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, turnstileToken }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data?.errors?.[0]?.message ?? data?.message ?? 'Reset failed. The link may have expired.')
        setLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => router.push('/login'), 2000)
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4 py-16">
      <div className="max-w-md w-full mx-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
        {success ? (
          <div className="text-center">
            <div className="mb-4 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-tint)]">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-[var(--accent)]">
                  <path d="M4 11l5 5 9-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <h1 className="text-xl font-semibold text-[var(--ink)] tracking-tight">
              Password updated
            </h1>
            <p className="mt-3 text-[13px] text-[var(--mist)]">
              Redirecting to sign in…
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-semibold text-[var(--ink)] tracking-tight">
                Set new{' '}
                <span className="text-[var(--accent)]">password</span>
              </h1>
              <p className="mt-2 text-[13px] text-[var(--mist)]">
                Choose a strong password for your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--ink-2)]">
                  New password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-[14px] text-[var(--ink)] placeholder:text-[var(--mist)] focus:border-[var(--accent-border)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-border)] transition-colors"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  minLength={8}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--ink-2)]">
                  Confirm new password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-[14px] text-[var(--ink)] placeholder:text-[var(--mist)] focus:border-[var(--accent-border)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-border)] transition-colors"
                  placeholder="••••••••"
                  autoComplete="new-password"
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
                {loading ? 'Updating…' : 'Update password'}
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
