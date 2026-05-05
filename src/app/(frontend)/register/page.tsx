'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const body: Record<string, string> = { email, password, name }
      if (company.trim()) body.company = company.trim()

      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data?.errors?.[0]?.message ?? data?.message ?? 'Registration failed. Please try again.')
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
            Join{' '}
            <span className="text-[var(--accent)]">Transcript IQ</span>
          </h1>
          <p className="mt-2 text-[13px] text-[var(--mist)]">
            Create your account to access purchases
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--ink-2)]">
              Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-[14px] text-[var(--ink)] placeholder:text-[var(--mist)] focus:border-[var(--accent-border)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-border)] transition-colors"
              placeholder="Your full name"
              autoComplete="name"
            />
          </div>

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
              Company{' '}
              <span className="text-[var(--mist)] normal-case tracking-normal text-[11px]">(optional)</span>
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-[14px] text-[var(--ink)] placeholder:text-[var(--mist)] focus:border-[var(--accent-border)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-border)] transition-colors"
              placeholder="Your firm or organisation"
              autoComplete="organization"
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
              autoComplete="new-password"
              minLength={8}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--ink-2)]">
              Confirm password
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

          {error && (
            <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-[13px] text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[10px] bg-btn-primary px-4 py-3 text-[14px] font-semibold text-btn-primary-fg shadow-cta transition-all duration-base ease-out hover:-translate-y-px hover:bg-btn-primary-hover disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center">
          <Link
            href="/login"
            className="text-[13px] text-[var(--ink-2)] hover:text-[var(--accent)] transition-colors"
          >
            Already have an account?{' '}
            <span className="text-[var(--accent)]">Sign in</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
