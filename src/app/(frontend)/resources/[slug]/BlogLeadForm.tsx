'use client'

import { useState, type FormEvent } from 'react'

export type BlogLeadFormConfig = {
  enabled?: boolean | null
  eyebrow?: string | null
  heading?: string | null
  subline?: string | null
  selectLabel?: string | null
  selectOptions?: string | null
  collectCompany?: boolean | null
  collectMessage?: boolean | null
  submitLabel?: string | null
  successMessage?: string | null
  fineprint?: string | null
  recipient?: string | null
}

const labelCls =
  'mb-1.5 block font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--mist)]'
const inputCls =
  'w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-[13.5px] text-[var(--ink)] placeholder:text-[var(--mist)] outline-none transition-colors duration-150 focus:border-[var(--accent)] focus:shadow-focus'

export function BlogLeadForm({
  config,
  blogSlug,
  blogTitle,
}: {
  config: BlogLeadFormConfig
  blogSlug: string
  blogTitle: string
}) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const options = (config.selectOptions ?? '')
    .split('\n')
    .map((o) => o.trim())
    .filter(Boolean)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'submitting') return
    const form = e.currentTarget
    const data = new FormData(form)
    setStatus('submitting')
    setErrorMsg('')
    try {
      const res = await fetch('/api/blog-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          role: data.get('role') || undefined,
          company: data.get('company') || undefined,
          message: data.get('message') || undefined,
          blogTitle,
          blogSlug,
          recipient: config.recipient || undefined,
          page_referrer: typeof window !== 'undefined' ? window.location.href : undefined,
        }),
      })
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(j.error || 'Something went wrong. Please try again.')
      }
      setStatus('success')
      form.reset()
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-[var(--accent-border)] p-5"
      style={{ background: 'linear-gradient(160deg, var(--accent-tint), var(--surface) 55%)' }}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg,transparent,var(--accent),transparent)' }}
      />

      {config.eyebrow && (
        <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--accent-deep)]">
          {config.eyebrow}
        </span>
      )}
      <h4 className="mt-2 text-[17px] font-semibold tracking-[-0.02em] text-[var(--ink)]">
        {config.heading || 'Request a conversation'}
      </h4>
      {config.subline && (
        <p className="mt-1.5 text-[12.5px] leading-[1.55] text-[var(--slate)]">{config.subline}</p>
      )}

      {status === 'success' ? (
        <div className="mt-4 rounded-lg border border-[var(--accent-border)] bg-[var(--accent-tint)] p-4 text-[13px] leading-relaxed text-[var(--ink)]">
          {config.successMessage || 'Thank you — we’ll be in touch within one business day.'}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4">
          <label className="block">
            <span className={labelCls}>Full name</span>
            <input name="name" type="text" required placeholder="Jane Doe" className={inputCls} />
          </label>

          <label className="mt-2.5 block">
            <span className={labelCls}>Work email</span>
            <input name="email" type="email" required placeholder="jane@firm.com" className={inputCls} />
          </label>

          {config.collectCompany && (
            <label className="mt-2.5 block">
              <span className={labelCls}>Company</span>
              <input name="company" type="text" placeholder="Your firm" className={inputCls} />
            </label>
          )}

          {options.length > 0 && (
            <label className="mt-2.5 block">
              <span className={labelCls}>{config.selectLabel || 'You are a…'}</span>
              <select name="role" defaultValue="" className={`${inputCls} cursor-pointer`}>
                <option value="" disabled>
                  Select one…
                </option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </label>
          )}

          {config.collectMessage && (
            <label className="mt-2.5 block">
              <span className={labelCls}>What are you researching?</span>
              <textarea name="message" rows={3} placeholder="A sentence or two helps us match the right expert." className={inputCls} />
            </label>
          )}

          {status === 'error' && (
            <p className="mt-3 text-[12px] leading-snug text-[#b91c1c]">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[9px] bg-[var(--accent)] px-5 py-3 text-[14px] font-semibold text-white shadow-cta transition-all duration-150 hover:-translate-y-px hover:bg-[var(--accent-bright)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === 'submitting' ? 'Sending…' : config.submitLabel || 'Request conversation'}
            {status !== 'submitting' && (
              <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M2.5 7h9M7.5 3l4 4-4 4" />
              </svg>
            )}
          </button>

          {config.fineprint && (
            <p className="mt-3 text-center font-mono text-[9px] tracking-[0.04em] text-[var(--mist)]">
              {config.fineprint}
            </p>
          )}
        </form>
      )}
    </div>
  )
}
