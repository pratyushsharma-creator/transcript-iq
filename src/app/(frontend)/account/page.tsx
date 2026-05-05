import { getCurrentUser } from '@/lib/auth'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SignOutButton } from './SignOutButton'
import type { User } from '@/payload-types'

export default async function AccountPage() {
  const user = await getCurrentUser() as User | null
  if (!user) return notFound()

  const displayName = user.name ?? user.email

  return (
    <main className="flex min-h-screen flex-col bg-[var(--bg)] px-4 py-16">
      <div className="mx-auto w-full max-w-2xl">
        {/* Header */}
        <div className="mb-10 flex items-start justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--accent)] mb-1">
              Account
            </p>
            <h1 className="text-2xl font-semibold text-[var(--ink)] tracking-tight">
              Hello, {displayName}
            </h1>
          </div>
          <SignOutButton />
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-4">
          {/* My Purchases card */}
          <Link
            href="/account/purchases"
            className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all hover:border-[var(--accent-border)] hover:bg-[var(--surface-2)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--mist)] mb-1.5">
                  Library
                </p>
                <h2 className="text-[17px] font-semibold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                  My Purchases
                </h2>
                <p className="mt-1 text-[13px] text-[var(--mist)]">
                  View and download your transcripts and reports
                </p>
              </div>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="text-[var(--mist)] group-hover:text-[var(--accent)] transition-colors flex-shrink-0"
              >
                <path
                  d="M7 10h6m-3-3 3 3-3 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </Link>

          {/* Account settings card */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="mb-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--mist)] mb-1.5">
                Details
              </p>
              <h2 className="text-[17px] font-semibold text-[var(--ink)]">
                Account settings
              </h2>
            </div>

            <dl className="flex flex-col gap-4">
              {user.name && (
                <div className="flex flex-col gap-0.5">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--mist)]">
                    Name
                  </dt>
                  <dd className="text-[14px] text-[var(--ink-2)]">{user.name}</dd>
                </div>
              )}

              <div className="flex flex-col gap-0.5">
                <dt className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--mist)]">
                  Email
                </dt>
                <dd className="text-[14px] text-[var(--ink-2)]">{user.email}</dd>
              </div>

              {user.company && (
                <div className="flex flex-col gap-0.5">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--mist)]">
                    Company
                  </dt>
                  <dd className="text-[14px] text-[var(--ink-2)]">{user.company}</dd>
                </div>
              )}
            </dl>

            <p className="mt-5 text-[12px] text-[var(--mist)]">
              To update your details,{' '}
              <Link href="/contact" className="text-[var(--accent)] hover:underline">
                email us
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
