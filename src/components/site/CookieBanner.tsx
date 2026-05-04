'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Cookie } from 'lucide-react'

const STORAGE_KEY = 'tiq-cookie-consent'

type ConsentState = 'accepted' | 'declined' | null

export function CookieBanner() {
  const [consent, setConsent] = useState<ConsentState>(null)
  const [visible, setVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as ConsentState | null
      if (stored === 'accepted' || stored === 'declined') {
        setConsent(stored)
        setVisible(false)
      } else {
        // Small delay so the page renders before the banner slides in
        const t = setTimeout(() => setVisible(true), 800)
        return () => clearTimeout(t)
      }
    } catch {
      // localStorage not available (SSR or privacy mode) — skip banner
    }
  }, [])

  const accept = () => {
    try { localStorage.setItem(STORAGE_KEY, 'accepted') } catch { /* noop */ }
    setConsent('accepted')
    setVisible(false)
  }

  const decline = () => {
    try { localStorage.setItem(STORAGE_KEY, 'declined') } catch { /* noop */ }
    setConsent('declined')
    setVisible(false)
  }

  // Dismissed (user made a choice or banner never needed to show)
  if (!visible || consent !== null) return null

  return (
    <>
      {/* Backdrop overlay (subtle) */}
      <div
        className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px] transition-opacity duration-300"
        aria-hidden
      />

      {/* Banner */}
      <div
        role="dialog"
        aria-label="Cookie consent"
        className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-[640px] -translate-x-1/2 rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-2xl transition-all duration-300"
        style={{ boxShadow: '0 24px 64px -12px rgba(0,0,0,0.35)' }}
      >
        {/* Top bar */}
        <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--accent-border)] bg-[var(--accent-tint)]">
              <Cookie className="h-4.5 w-4.5 text-[var(--accent)]" />
            </div>
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--ink)]">
                Cookie preferences
              </p>
              <p className="text-[12px] text-[var(--mist)]">Transcript IQ · transcript-iq.com</p>
            </div>
          </div>
          <button
            onClick={decline}
            aria-label="Dismiss cookie banner"
            className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--mist)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--ink)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="border-t border-[var(--border)] px-6 py-4">
          <p className="text-[13px] leading-[1.65] text-[var(--ink-2)]">
            We use essential cookies to keep your cart and preferences, and optional analytics cookies to understand how the platform is used — never for advertising. You can change your preferences at any time.{' '}
            <Link href="/privacy#cookies" className="text-[var(--accent)] underline underline-offset-4">
              Cookie policy
            </Link>
          </p>

          {showDetails && (
            <div className="mt-4 space-y-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-[12px]">
              {[
                {
                  name: 'Essential',
                  always: true,
                  desc: 'Shopping cart, theme preference, CSRF protection. Required for the platform to work.',
                },
                {
                  name: 'Preference',
                  always: true,
                  desc: 'Saves your dark/light mode and this consent decision.',
                },
                {
                  name: 'Analytics',
                  always: false,
                  desc: 'Anonymised session data to help us improve the platform. No cross-site tracking or advertising.',
                },
              ].map((c) => (
                <div key={c.name} className="flex items-start gap-3">
                  <div className="mt-0.5 flex w-28 shrink-0 items-center gap-1.5">
                    <span className="font-semibold text-[var(--ink)]">{c.name}</span>
                    {c.always && (
                      <span className="rounded font-mono text-[8px] uppercase tracking-[0.06em] text-[var(--accent)]">
                        Always on
                      </span>
                    )}
                  </div>
                  <p className="leading-[1.6] text-[var(--ink-2)]">{c.desc}</p>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => setShowDetails((v) => !v)}
            className="mt-3 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--mist)] transition-colors hover:text-[var(--accent)]"
          >
            {showDetails ? 'Hide details ↑' : 'Show details ↓'}
          </button>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5 px-6 pb-5 sm:flex-row">
          <button
            onClick={accept}
            className="flex-1 rounded-[10px] bg-btn-primary px-4 py-2.5 text-[13px] font-semibold text-btn-primary-fg shadow-cta transition-all duration-base ease-out hover:-translate-y-px hover:bg-btn-primary-hover"
          >
            Accept all
          </button>
          <button
            onClick={decline}
            className="flex-1 rounded-[10px] border border-[var(--border-2)] px-4 py-2.5 text-[13px] font-medium text-[var(--ink-2)] transition-all duration-base ease-out hover:border-[var(--accent-border)] hover:text-[var(--ink)]"
          >
            Essential only
          </button>
        </div>
      </div>
    </>
  )
}
