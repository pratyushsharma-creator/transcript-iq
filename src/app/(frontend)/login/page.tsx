'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { TurnstileWidget } from '@/components/ui/Turnstile'

const HAS_CAPTCHA = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

  const handleTurnstileSuccess = useCallback((token: string) => setTurnstileToken(token), [])
  const handleTurnstileExpired  = useCallback(() => setTurnstileToken(null), [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    // Block submission in production if Turnstile hasn't verified yet
    if (HAS_CAPTCHA && !turnstileToken) {
      setError('Security check in progress — please wait a moment and try again.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, turnstileToken }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data?.errors?.[0]?.message ?? data?.message ?? 'Invalid email or password.')
        setLoading(false)
        return
      }

      router.push('/account')
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4 py-16">
      <div className="max-w-md w-full mx-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
        {/* Brand heading */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-[var(--ink)] tracking-tight">
            Sign in to{' '}
            <span className="text-[var(--accent)]">Transcript IQ</span>
          </h1>
          <p className="mt-2 text-[13px] text-[var(--mist)]">
            Access your purchases and account
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

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--ink-2)]">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-[14px] text-[var(--ink)] placeholder:text-[var(--mist)] focus:border-[var(--accent-border)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-border)] transition-colors"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {/* Turnstile widget — Managed type, mostly invisible */}
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
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-3">
          <Link
            href="/forgot-password"
            className="text-[13px] text-[var(--mist)] hover:text-[var(--accent)] transition-colors"
          >
            Forgot password?
          </Link>
          <Link
            href="/register"
            className="text-[13px] text-[var(--ink-2)] hover:text-[var(--accent)] transition-colors"
          >
            New here?{' '}
            <span className="text-[var(--accent)]">Create account</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
