'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { ShieldCheck, Lock, ArrowRight, ChevronLeft, CreditCard } from 'lucide-react'
import { useCart } from '@/context/CartContext'

// ── Types ──────────────────────────────────────────────────────────────────────

type FormData = {
  firstName: string
  lastName: string
  email: string
  organisation: string
  role: string
  billingName: string
  addressLine1: string
  city: string
  country: string
  postalCode: string
  vatNumber: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

// ── Consumer email blocklist ───────────────────────────────────────────────────

const BLOCKED_DOMAINS = new Set([
  'gmail.com','yahoo.com','hotmail.com','outlook.com','icloud.com',
  'aol.com','protonmail.com','mail.com','yandex.com','zoho.com',
  'live.com','msn.com','rediffmail.com','me.com','mac.com',
])

function isCorporateEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase() ?? ''
  return domain.length > 0 && !BLOCKED_DOMAINS.has(domain)
}

// ── Progress steps ─────────────────────────────────────────────────────────────

function Steps({ current }: { current: 1 | 2 | 3 }) {
  const steps = ['Cart', 'Checkout', 'Confirmation']
  return (
    <div className="flex items-center gap-0 mb-10">
      {steps.map((label, i) => {
        const n = i + 1
        const done   = n < current
        const active = n === current
        return (
          <div key={label} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border font-mono text-[10px] font-semibold transition-all ${
                  done
                    ? 'border-[var(--accent)] bg-[var(--accent)] text-[#052A18]'
                    : active
                    ? 'border-[var(--accent)] bg-transparent text-[var(--accent)]'
                    : 'border-[var(--border)] bg-transparent text-[var(--mist)]'
                }`}
              >
                {done ? (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1.5 5l2.5 2.5 4.5-4.5" />
                  </svg>
                ) : n}
              </div>
              <span className={`font-mono text-[11px] tracking-[0.06em] ${done || active ? 'text-[var(--ink-2)]' : 'text-[var(--mist)]'}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="mx-3 h-px w-12 bg-[var(--border)]" />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Field ──────────────────────────────────────────────────────────────────────

function Field({
  label,
  required,
  error,
  children,
  hint,
  className = '',
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
  hint?: string
  className?: string
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--mist)]">
        {label}{required && <span className="ml-0.5 text-[var(--accent)]"> *</span>}
      </label>
      {children}
      {hint && !error && <p className="font-mono text-[9px] text-[var(--mist)]">{hint}</p>}
      {error && <p className="font-mono text-[9px] text-[#F87171]">{error}</p>}
    </div>
  )
}

const inputClass = (error?: string) =>
  `h-10 w-full rounded-lg border bg-[var(--surface-2)] px-3 font-sans text-[13px] text-[var(--ink)] outline-none placeholder:text-[var(--mist)] transition-colors duration-fast focus:border-[var(--accent-border)] ${
    error ? 'border-[rgba(248,113,113,0.5)]' : 'border-[var(--border)]'
  }`

// ── Order summary (right column) ───────────────────────────────────────────────

function OrderSummary({
  subtotal,
  loading,
}: {
  subtotal: number
  loading: boolean
}) {
  const { items } = useCart()
  const tax = Math.round(subtotal * 0.09 * 100) / 100
  const total = subtotal + tax

  return (
    <div className="sticky top-24 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <h2 className="mb-5 border-b border-[var(--border)] pb-4 text-[14px] font-semibold tracking-[-0.01em] text-[var(--ink)]">
        Order Summary
        <span className="ml-2 font-mono text-[11px] font-normal text-[var(--mist)]">
          ({items.length} item{items.length !== 1 ? 's' : ''})
        </span>
      </h2>

      {/* Items */}
      <div className="mb-5 flex flex-col gap-3 border-b border-[var(--border)] pb-5">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
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
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--mist)]">
                {item.type === 'earnings' ? 'Earnings Analysis' : 'Expert Transcript'}
                {item.tier && ` · ${item.tier.charAt(0).toUpperCase() + item.tier.slice(1)}`}
              </p>
              <p className="mt-0.5 line-clamp-2 text-[12px] leading-[1.35] text-[var(--ink)]">{item.title}</p>
              <p className="mt-1 font-mono text-[13px] font-medium text-[var(--accent)]">${item.priceUsd}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="flex flex-col gap-2 text-[13px]">
        <div className="flex justify-between text-[var(--ink-2)]">
          <span>Subtotal</span>
          <span className="font-mono">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[var(--ink-2)]">
          <span>GST / Tax (9%)</span>
          <span className="font-mono">${tax.toFixed(2)}</span>
        </div>
        <div className="mt-2 flex justify-between border-t border-[var(--border)] pt-3 font-semibold text-[var(--ink)]">
          <span className="text-[15px]">Total due</span>
          <span className="font-mono text-[17px] text-[var(--accent)]">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* CTA — submits the form */}
      <button
        type="submit"
        form="checkout-form"
        disabled={loading || items.length === 0}
        className="group mt-5 flex w-full items-center justify-center gap-2 rounded-[10px] bg-btn-primary py-[14px] text-[14px] font-semibold text-btn-primary-fg shadow-cta transition-all duration-base ease-out hover:-translate-y-px hover:bg-btn-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        style={{ letterSpacing: '-0.01em' }}
      >
        {loading ? (
          <>Redirecting to payment…</>
        ) : (
          <>
            <Lock className="h-4 w-4" />
            Continue to Payment — ${total.toFixed(2)}
            <ArrowRight className="h-4 w-4 transition-transform duration-base ease-out group-hover:translate-x-0.5" />
          </>
        )}
      </button>

      {/* Trust badge */}
      <div className="mt-4 flex items-start gap-2 rounded-lg border border-[var(--accent-border)] bg-[var(--accent-tint)] p-3">
        <ShieldCheck className="mt-px h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />
        <p className="font-mono text-[9px] leading-[1.6] text-[var(--accent)]">
          Instant PDF delivery to your email. Every transcript is MNPI-screened and PII-redacted. Refund available within 24 hours if content is materially mis-described.
        </p>
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { items, subtotal } = useCart()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [apiError, setApiError] = useState<string | null>(null)

  const [form, setForm] = useState<FormData>({
    firstName: '', lastName: '', email: '', organisation: '', role: '',
    billingName: '', addressLine1: '', city: '', country: '', postalCode: '', vatNumber: '',
  })

  const set = useCallback((field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => { const next = { ...prev }; delete next[field]; return next })
    setApiError(null)
  }, [])

  const validate = (): boolean => {
    const e: FormErrors = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim())  e.lastName  = 'Required'
    if (!form.email.trim())     e.email = 'Required'
    else if (!isCorporateEmail(form.email)) e.email = 'Please use a corporate email address'
    if (!form.organisation.trim()) e.organisation = 'Required'
    if (!form.billingName.trim())  e.billingName  = 'Required'
    if (!form.addressLine1.trim()) e.addressLine1 = 'Required'
    if (!form.city.trim())         e.city         = 'Required'
    if (!form.country.trim())      e.country      = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setApiError(null)

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customer: {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            organisation: form.organisation,
            role: form.role,
          },
          billing: {
            name: form.billingName,
            addressLine1: form.addressLine1,
            city: form.city,
            country: form.country,
            postalCode: form.postalCode,
            vatNumber: form.vatNumber,
          },
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? 'Failed to create checkout session')
      }

      // Redirect to Stripe's hosted checkout page
      window.location.href = data.url
    } catch (err) {
      setLoading(false)
      setApiError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  // Empty cart guard
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--accent)]">Nothing here</p>
        <h1 className="mb-4 text-[32px] font-semibold tracking-[-0.04em] text-[var(--ink)]">Your cart is empty</h1>
        <p className="mb-8 text-[15px] text-[var(--ink-2)]">Add transcripts or earnings analyses before checking out.</p>
        <Link
          href="/expert-transcripts"
          className="inline-flex items-center gap-2 rounded-[10px] bg-btn-primary px-6 py-3 text-[14px] font-semibold text-btn-primary-fg shadow-cta transition-all duration-base ease-out hover:-translate-y-px hover:bg-btn-primary-hover"
        >
          Browse Transcripts <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-12">
      {/* Back link */}
      <Link
        href="/expert-transcripts"
        className="mb-8 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--mist)] transition-colors duration-fast hover:text-[var(--ink-2)]"
      >
        <ChevronLeft className="h-3.5 w-3.5" /> Back to Library
      </Link>

      <Steps current={2} />

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* ── LEFT: Form ── */}
        <form id="checkout-form" onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

          {/* Section 1: Contact */}
          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="mb-5 flex items-center gap-2.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[var(--accent-border)] bg-[var(--accent-tint)] font-mono text-[9px] font-semibold text-[var(--accent)]">1</span>
              <h2 className="text-[13px] font-semibold tracking-[-0.01em] text-[var(--ink)]">Contact Information</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="First name" required error={errors.firstName}>
                <input className={inputClass(errors.firstName)} value={form.firstName} onChange={(e) => set('firstName', e.target.value)} placeholder="Pratyush" />
              </Field>
              <Field label="Last name" required error={errors.lastName}>
                <input className={inputClass(errors.lastName)} value={form.lastName} onChange={(e) => set('lastName', e.target.value)} placeholder="Sharma" />
              </Field>
              <Field label="Corporate email" required error={errors.email} hint="Personal email addresses are not accepted." className="col-span-2">
                <input className={inputClass(errors.email)} type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@company.com" />
              </Field>
              <Field label="Organisation" required error={errors.organisation} className="col-span-2">
                <input className={inputClass(errors.organisation)} value={form.organisation} onChange={(e) => set('organisation', e.target.value)} placeholder="Hedge fund, asset manager, corp dev…" />
              </Field>
              <Field label="Role / title" className="col-span-2">
                <input className={inputClass()} value={form.role} onChange={(e) => set('role', e.target.value)} placeholder="e.g. Portfolio Manager, Research Analyst" />
              </Field>
            </div>
          </section>

          {/* Section 2: Billing */}
          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="mb-5 flex items-center gap-2.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[var(--accent-border)] bg-[var(--accent-tint)] font-mono text-[9px] font-semibold text-[var(--accent)]">2</span>
              <h2 className="text-[13px] font-semibold tracking-[-0.01em] text-[var(--ink)]">Billing Details</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Company / Billing name" required error={errors.billingName} className="col-span-2">
                <input className={inputClass(errors.billingName)} value={form.billingName} onChange={(e) => set('billingName', e.target.value)} placeholder="Nextyn Advisory Pte. Ltd." />
              </Field>
              <Field label="Address" required error={errors.addressLine1} className="col-span-2">
                <input className={inputClass(errors.addressLine1)} value={form.addressLine1} onChange={(e) => set('addressLine1', e.target.value)} placeholder="Street address" />
              </Field>
              <Field label="City" required error={errors.city}>
                <input className={inputClass(errors.city)} value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Singapore" />
              </Field>
              <Field label="Country" required error={errors.country}>
                <input className={inputClass(errors.country)} value={form.country} onChange={(e) => set('country', e.target.value)} placeholder="Singapore" />
              </Field>
              <Field label="GST / VAT number" hint="Optional — included on tax receipt.">
                <input className={inputClass()} value={form.vatNumber} onChange={(e) => set('vatNumber', e.target.value)} placeholder="e.g. SG200012345A" />
              </Field>
              <Field label="Postal code">
                <input className={inputClass()} value={form.postalCode} onChange={(e) => set('postalCode', e.target.value)} placeholder="123456" />
              </Field>
            </div>
          </section>

          {/* Section 3: Payment — Stripe hosted */}
          <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="mb-5 flex items-center gap-2.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[var(--accent-border)] bg-[var(--accent-tint)] font-mono text-[9px] font-semibold text-[var(--accent)]">3</span>
              <h2 className="text-[13px] font-semibold tracking-[-0.01em] text-[var(--ink)]">Payment</h2>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--accent-border)] bg-[var(--accent-tint)]">
                  <CreditCard className="h-5 w-5 text-[var(--accent)]" />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[var(--ink)]">Secure payment via Stripe</p>
                  <p className="font-mono text-[10px] text-[var(--mist)]">Cards, Apple Pay, Google Pay accepted</p>
                </div>
              </div>
              <p className="mb-4 font-mono text-[10px] leading-[1.7] text-[var(--mist)]">
                Clicking "Continue to Payment" will take you to Stripe's secure checkout page. Your payment
                information never touches our servers.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {['VISA', 'MC', 'AMEX', 'APPLE PAY', 'GOOGLE PAY'].map((brand) => (
                  <span
                    key={brand}
                    className="rounded border border-[var(--border)] bg-[var(--surface)] px-2 py-1 font-mono text-[8px] font-semibold tracking-[0.08em] text-[var(--mist)]"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>

            {apiError && (
              <div className="mt-4 rounded-lg border border-[rgba(248,113,113,0.4)] bg-[rgba(248,113,113,0.08)] p-3">
                <p className="font-mono text-[11px] text-[#F87171]">{apiError}</p>
              </div>
            )}

            <div className="mt-4 flex items-center gap-2">
              <Lock className="h-3 w-3 shrink-0 text-[var(--mist)]" />
              <p className="font-mono text-[9px] text-[var(--mist)]">
                256-bit TLS encryption · PCI DSS Level 1 certified · Stripe processes all card data
              </p>
            </div>
          </section>
        </form>

        {/* ── RIGHT: Summary ── */}
        <OrderSummary subtotal={subtotal} loading={loading} />
      </div>
    </div>
  )
}
