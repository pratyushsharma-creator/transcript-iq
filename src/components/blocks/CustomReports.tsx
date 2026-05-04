'use client'

import { useState, useRef, useCallback, useEffect, type FormEvent } from 'react'
import { motion } from 'motion/react'
import { Check, X } from 'lucide-react'
import { SectionShell, MintGradientHeading } from './SectionShell'

// ─── Shared animation preset ──────────────────────────────────────────────────

const VIEW = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' } as const,
  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
}

// ─── Eyebrow badge (pulsing dot variant) ─────────────────────────────────────

function EyebrowBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-border)] bg-[var(--accent-tint)] px-3.5 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
      <span className="relative flex h-[5px] w-[5px]">
        <span className="absolute inset-0 animate-ping rounded-full bg-[var(--accent)] opacity-60" />
        <span className="relative inline-flex h-[5px] w-[5px] rounded-full bg-[var(--accent)]" />
      </span>
      {children}
    </div>
  )
}

// ─── Section eyebrow (plain mono) ────────────────────────────────────────────

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]">
      {children}
    </span>
  )
}

// ─── Hero heading parser ──────────────────────────────────────────────────────
// Supports three inline styles within each \n-delimited line:
//   **text**  → solid accent green
//   ~~text~~  → ghost / stroke-only (transparent fill)
//   plain     → normal ink

function HeroHeading({ text }: { text: string }) {
  const lines = text.split('\\n')
  return (
    <>
      {lines.map((line, i) => {
        const parts = line.split(/(\*\*[^*]+\*\*|~~[^~]+~~)/g)
        return (
          <span key={i} className="block">
            {parts.map((p, j) => {
              const bold = p.match(/^\*\*(.+)\*\*$/)
              if (bold)
                return (
                  <span key={j} className="text-[var(--accent)]">
                    {bold[1]}
                  </span>
                )
              const ghost = p.match(/^~~(.+)~~$/)
              if (ghost)
                return (
                  <span
                    key={j}
                    style={{
                      color: 'transparent',
                      WebkitTextStroke: '1.5px rgba(255,255,255,0.22)',
                    }}
                  >
                    {ghost[1]}
                  </span>
                )
              return <span key={j}>{p}</span>
            })}
          </span>
        )
      })}
    </>
  )
}

// ─── Section heading (MintGradientHeading wrapper) ───────────────────────────

function SectionHeading({ text, as: Tag = 'h2' }: { text: string; as?: 'h1' | 'h2' | 'h3' }) {
  return (
    <Tag className="mt-4 text-[clamp(28px,3.5vw,46px)] font-semibold leading-[1.08] tracking-[-0.035em] text-[var(--ink)]">
      <MintGradientHeading text={text} />
    </Tag>
  )
}

// ─── Icons for commissioning steps ───────────────────────────────────────────

const STEP_ICONS: Record<string, React.ReactNode> = {
  submit: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-5 w-5 text-[var(--accent)]">
      <rect x="4" y="4" width="12" height="12" rx="1" />
      <path d="M7 8h6M7 11h4" />
    </svg>
  ),
  match: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-5 w-5 text-[var(--accent)]">
      <circle cx="7" cy="8" r="3" />
      <circle cx="13" cy="8" r="3" />
      <path d="M2 17c0-2.8 2.2-5 5-5h6c2.8 0 5 2.2 5 5" />
    </svg>
  ),
  call: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-5 w-5 text-[var(--accent)]">
      <path d="M4 4l3 3-2 3c1.5 2.5 3.5 4.5 6 6l3-2 3 3-4 2c-5-1-10-7-11-12l2-3z" />
    </svg>
  ),
  deliver: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-5 w-5 text-[var(--accent)]">
      <path d="M3 10l4 4 10-10" />
    </svg>
  ),
}

// ─── Icons for deliverables grid ─────────────────────────────────────────────

const DEL_ICONS: Record<string, React.ReactNode> = {
  document: (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-[18px] w-[18px] text-[var(--accent)]">
      <rect x="4" y="2" width="10" height="14" rx="1" />
      <path d="M6 6h6M6 9h6M6 12h4" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-[18px] w-[18px] text-[var(--accent)]">
      <circle cx="9" cy="9" r="7" />
      <path d="M9 5v4l3 3" />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-[18px] w-[18px] text-[var(--accent)]">
      <circle cx="9" cy="7" r="3" />
      <path d="M3 16c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    </svg>
  ),
  compliance: (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-[18px] w-[18px] text-[var(--accent)]">
      <path d="M9 2l1.5 3 3.5.5-2.5 2.5.6 3.5L9 9.5 5.9 11.5l.6-3.5L4 5.5 7.5 5z" />
    </svg>
  ),
  custom: (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-[18px] w-[18px] text-[var(--accent)]">
      <path d="M3 9h12M9 3l6 6-6 6" />
    </svg>
  ),
  expedited: (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-[18px] w-[18px] text-[var(--accent)]">
      <circle cx="9" cy="9" r="7" />
      <path d="M9 5v4l3 2" />
    </svg>
  ),
}

// ─── Badge tone map ───────────────────────────────────────────────────────────

const BADGE_CLASSES: Record<string, string> = {
  amber: 'text-[#FBBF24] bg-[rgba(251,191,36,0.08)] border border-[rgba(251,191,36,0.22)]',
  mint: 'text-[var(--accent)] bg-[var(--accent-tint)] border border-[var(--accent-border)]',
  muted: 'text-[var(--mist)] bg-[var(--surface-2)] border border-[var(--border)]',
}

// ── Arrow icon used in CTA buttons ────────────────────────────────────────────

function ArrowIcon() {
  return (
    <svg viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 shrink-0">
      <path d="M2 6.5h9M7.5 2.5l4 4-4 4" />
    </svg>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// CustomTranscriptHero
// ══════════════════════════════════════════════════════════════════════════════

type CustomTranscriptHeroBlock = {
  blockType: 'customTranscriptHero'
  eyebrow?: string
  heading?: string
  subtitle?: string
  processSteps?: Array<{ stepLabel: string; title: string; timing?: string }>
  priceStrip?: { amount?: string; label?: string; note?: string }
  ctas?: Array<{ label: string; url: string; variant?: string }>
  formCard?: {
    cardTitle?: string
    cardBadge?: string
    detailsLabel?: string
    briefLabel?: string
    submitLabel?: string
    formNote?: string
    successTitle?: string
    successMessage?: string
    formEndpoint?: string
  }
  trustStats?: Array<{ value: string; label: string }>
  background?: string
  spacing?: string
  anchorId?: string
}

// ─── Phone field with custom-styled country code picker ──────────────────────

function PhoneField() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(COUNTRY_CODES[0]!) // +1 US United States
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false); setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = search
    ? COUNTRY_CODES.filter(([code, iso, name]) =>
        name.toLowerCase().includes(search.toLowerCase()) ||
        code.includes(search) ||
        iso.toLowerCase().includes(search.toLowerCase()),
      )
    : COUNTRY_CODES

  return (
    <div className="flex gap-[6px]">
      {/* Hidden input carries the dial code */}
      <input type="hidden" name="countryCode" value={selected[0]} />

      {/* Dial-code selector */}
      <div ref={ref} className="relative shrink-0" style={{ width: 76 }}>
        <button
          type="button"
          onClick={() => { setOpen((o) => !o); setSearch('') }}
          style={{
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.32)',
            border: '1px solid var(--border)',
            borderRadius: 9,
            padding: '10px 8px',
            fontSize: 12,
            fontFamily: 'var(--font-sans)',
            color: 'var(--ink)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 3,
            transition: 'border-color 0.15s',
          }}
        >
          <span>{selected[0]}</span>
          <svg width={8} height={8} viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth={1.6} style={{ opacity: 0.45, flexShrink: 0 }}>
            <path d="M1 2.5l3 3 3-3" />
          </svg>
        </button>

        {open && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              zIndex: 200,
              width: 240,
              background: '#111713',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 10,
              boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
              overflow: 'hidden',
            }}
          >
            {/* Search */}
            <div style={{ padding: '8px 8px 0' }}>
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country…"
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 7,
                  padding: '7px 10px',
                  fontSize: 12,
                  color: '#e2e8f0',
                  outline: 'none',
                  fontFamily: 'var(--font-sans)',
                }}
              />
            </div>
            {/* List */}
            <div style={{ maxHeight: 220, overflowY: 'auto', padding: '6px 0' }}>
              {filtered.length === 0 ? (
                <div style={{ padding: '10px 14px', fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                  No results
                </div>
              ) : (
                filtered.map(([code, iso, name], idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => { setSelected([code, iso, name]); setOpen(false); setSearch('') }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '7px 14px',
                      background: selected[0] === code && selected[1] === iso ? 'rgba(52,211,153,0.08)' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={(e) => { if (!(selected[0] === code && selected[1] === iso)) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = selected[0] === code && selected[1] === iso ? 'rgba(52,211,153,0.08)' : 'transparent' }}
                  >
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', minWidth: 34 }}>{code}</span>
                    <span style={{ fontSize: 12, color: '#e2e8f0' }}>{name}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 10, color: 'rgba(255,255,255,0.28)', fontFamily: 'var(--font-mono)' }}>{iso}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Phone number input */}
      <input name="phone" type="tel" placeholder="Phone number" className={`${inputCls} min-w-0 flex-1`} />
    </div>
  )
}

// ─── Corporate email validation ──────────────────────────────────────────────
const BLOCKED_DOMAINS = new Set([
  'gmail.com','googlemail.com','yahoo.com','yahoo.co.uk','yahoo.co.in',
  'yahoo.fr','yahoo.de','yahoo.es','yahoo.it','yahoo.com.au','yahoo.ca',
  'hotmail.com','hotmail.co.uk','hotmail.fr','hotmail.de','hotmail.it',
  'outlook.com','outlook.co.uk','outlook.fr','live.com','live.co.uk',
  'msn.com','aol.com','icloud.com','me.com','mac.com',
  'protonmail.com','proton.me','pm.me',
  'zoho.com','zohomail.com','mail.com','email.com',
  'ymail.com','rocketmail.com','inbox.com','fastmail.com','fastmail.fm',
  'tutanota.com','tuta.io','guerrillamail.com','mailinator.com',
  'tempmail.com','10minutemail.com','throwaway.email','dispostable.com',
  'yopmail.com','sharklasers.com','guerrillamailblock.com',
  'qq.com','163.com','126.com','sina.com','sohu.com','naver.com',
  'daum.net','hanmail.net','rediffmail.com','web.de','gmx.de','gmx.com',
  'gmx.net','t-online.de','freenet.de','orange.fr','laposte.net','free.fr',
  'libero.it','virgilio.it','tin.it','tiscali.it','alice.it',
])

function isCorporateEmail(email: string): boolean {
  const parts = email.toLowerCase().split('@')
  if (parts.length !== 2) return false
  const domain = parts[1]!
  return !BLOCKED_DOMAINS.has(domain)
}

export function CustomTranscriptHeroRenderer({ block }: { block: CustomTranscriptHeroBlock }) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const fc = block.formCard ?? {}
  const steps = block.processSteps ?? []
  const stats = block.trustStats ?? []
  const ctas = block.ctas ?? []

  // Left stats strip shows all items; form card bottom shows last 3
  const formStats = stats.length > 3 ? stats.slice(-3) : stats

  const validateEmail = useCallback((val: string) => {
    if (!val) return
    if (!isCorporateEmail(val)) {
      setEmailError('Please use a corporate/work email address')
    } else {
      setEmailError('')
    }
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const form = formRef.current
    if (!form) return

    // Corporate email gate
    const emailInput = form.querySelector<HTMLInputElement>('[name="email"]')
    if (emailInput && !isCorporateEmail(emailInput.value)) {
      setEmailError('Please use a corporate/work email address')
      emailInput.focus()
      return
    }

    setLoading(true)
    try {
      if (fc.formEndpoint && form) {
        await fetch(fc.formEndpoint, {
          method: 'POST',
          body: new FormData(form),
        })
      }
    } catch {
      // fail silently — still show success state
    } finally {
      setLoading(false)
      setSubmitted(true)
    }
  }

  return (
    <section
      id={block.anchorId || undefined}
      className="relative overflow-hidden"
      style={{ paddingTop: '72px' }}
    >
      {/* Ambient orb — top-right green glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-40 h-[640px] w-[640px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(52,211,153,0.22) 0%, transparent 68%)',
          filter: 'blur(96px)',
        }}
      />
      {/* Ambient orb — bottom-left */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -left-36 h-[480px] w-[480px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
          filter: 'blur(96px)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1200px] px-12 pb-20">
        <div className="grid items-start gap-16 lg:grid-cols-[1fr_440px]">

          {/* ── LEFT: Content ──────────────────────────────────────────────── */}
          <div>
            {/* Eyebrow */}
            {block.eyebrow && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="mb-7"
              >
                <EyebrowBadge>{block.eyebrow}</EyebrowBadge>
              </motion.div>
            )}

            {/* Heading — large display */}
            {block.heading && (
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="mb-10 max-w-[900px] font-bold leading-[0.95] tracking-[-0.05em]"
                style={{ fontSize: 'clamp(34px, 4.2vw, 64px)' }}
              >
                <HeroHeading text={block.heading} />
              </motion.h1>
            )}

            {/* Subtitle */}
            {block.subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="mb-11 max-w-[500px] text-[16px] font-normal leading-[1.72] text-[var(--ink-2)]"
              >
                {block.subtitle}
              </motion.p>
            )}

            {/* Stats strip — horizontal, matches HTML .h-stats */}
            {stats.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
                className="mb-11 flex overflow-hidden rounded-[14px] border border-[var(--border)] bg-[rgba(255,255,255,0.02)]"
              >
                {stats.map((s, i) => (
                  <div
                    key={i}
                    className={`flex-1 cursor-default px-5 py-[18px] transition-colors hover:bg-[rgba(255,255,255,0.03)] ${i < stats.length - 1 ? 'border-r border-[var(--border)]' : ''}`}
                  >
                    <div className="font-mono text-[22px] font-medium leading-tight tracking-[-0.03em] text-[var(--accent)]">
                      {s.value}
                    </div>
                    <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--mist)]">
                      {s.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Process timeline */}
            {steps.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="relative pl-0.5"
              >
                {/* Connecting line */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute bottom-[18px] left-[15px] top-[18px] w-px"
                  style={{ background: 'linear-gradient(to bottom, var(--accent), rgba(52,211,153,0.06))' }}
                />
                {steps.map((step, i) => (
                  <div key={i} className="grid grid-cols-[30px_1fr] items-start gap-4 py-[11px]">
                    {/* Dot */}
                    <div className="relative z-10 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border border-[var(--accent-border)] bg-[var(--accent-tint)]">
                      <div className="h-[7px] w-[7px] rounded-full bg-[var(--accent)]" />
                    </div>
                    {/* Body */}
                    <div>
                      <div className="mb-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--mist)]">
                        {step.stepLabel}
                      </div>
                      <div className="text-[15px] font-medium leading-snug tracking-[-0.015em] text-[var(--ink)]">
                        {step.title}
                      </div>
                      {step.timing && (
                        <div className="mt-0.5 font-mono text-[10px] tracking-[0.06em] text-[var(--accent)]">
                          {step.timing}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* CTAs */}
            {ctas.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="mt-10 flex flex-wrap items-center gap-2.5"
              >
                {ctas.map((cta, i) => {
                  const isPrimary = !cta.variant || cta.variant === 'primary'
                  return (
                    <a
                      key={i}
                      href={cta.url}
                      className={[
                        'inline-flex items-center gap-2.5 rounded-[11px] px-[26px] py-[13px] text-[14px] font-semibold tracking-[-0.01em] transition-all duration-200',
                        isPrimary
                          ? 'bg-[var(--accent)] text-[#050A07] shadow-[0_0_0_1px_var(--accent-border),0_8px_28px_-8px_var(--accent-glow)] hover:-translate-y-px hover:bg-[var(--accent-deep)]'
                          : 'border border-[rgba(255,255,255,0.12)] bg-transparent text-[var(--ink-2)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--ink)]',
                      ].join(' ')}
                    >
                      {isPrimary && <ArrowIcon />}
                      {cta.label}
                    </a>
                  )
                })}
              </motion.div>
            )}
          </div>

          {/* ── RIGHT: Commission Brief Card ───────────────────────────────── */}
          <motion.div
            id="brief-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:sticky lg:top-[72px]"
          >
            <div
              className="relative overflow-hidden rounded-[20px] border border-[rgba(255,255,255,0.12)]"
              style={{
                background: 'rgba(255,255,255,0.035)',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                boxShadow: '0 0 0 1px rgba(52,211,153,0.05), 0 32px 96px -24px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.07)',
              }}
            >
              {/* Top-edge mint glow line */}
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 z-10 h-px"
                style={{ background: 'linear-gradient(90deg, transparent 8%, rgba(52,211,153,0.55) 50%, transparent 92%)' }}
              />

              {/* Card header */}
              <div
                className="flex items-center justify-between border-b border-[var(--border)] px-[22px] py-[15px]"
                style={{ background: 'rgba(0,0,0,0.25)' }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-[7px] w-[7px]">
                    <span className="absolute inset-0 animate-ping rounded-full bg-[var(--accent)] opacity-60" />
                    <span className="relative inline-flex h-[7px] w-[7px] rounded-full bg-[var(--accent)]" />
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--ink-2)]">
                    {fc.cardTitle ?? 'Research Brief'}
                  </span>
                </div>
                <span className="rounded px-[9px] py-[3px] font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--accent)] border border-[var(--accent-border)] bg-[var(--accent-tint)]">
                  {fc.cardBadge ?? 'Confidential'}
                </span>
              </div>

              {/* Form / success */}
              {submitted ? (
                <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
                  <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full border border-[var(--accent-border)] bg-[var(--accent-tint)]">
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-[var(--accent)]">
                      <path d="M3 10l5 5 9-9" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="text-[17px] font-semibold tracking-[-0.02em] text-[var(--ink)]">
                    {fc.successTitle ?? 'Brief received'}
                  </div>
                  <p className="max-w-[280px] text-[13px] leading-[1.65] text-[var(--ink-2)]">
                    {fc.successMessage ?? 'A coordinator will respond within 24 hours with expert match options and feasibility confirmation.'}
                  </p>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="px-[22px] py-5">
                  {/* Section: Your details */}
                  <div className="mb-[13px] flex items-center gap-2.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--accent)]">
                    {fc.detailsLabel ?? 'Your details'}
                    <div className="h-px flex-1 bg-[var(--border)]" />
                  </div>

                  <div className="mb-[9px] grid grid-cols-2 gap-[9px]">
                    <FormField label="Full Name *">
                      <input name="name" type="text" placeholder="Jane Smith" required className={inputCls} />
                    </FormField>
                    <FormField label="Organisation *">
                      <input name="org" type="text" placeholder="Acme Capital" required className={inputCls} />
                    </FormField>
                  </div>
                  <div className="mb-[18px] grid grid-cols-2 gap-[9px]">
                    <FormField label="Work Email *">
                      <input
                        name="email"
                        type="email"
                        placeholder="jane@acmecapital.com"
                        required
                        className={`${inputCls}${emailError ? ' !border-red-500/60 focus:!border-red-500' : ''}`}
                        onBlur={(e) => validateEmail(e.target.value)}
                        onChange={(e) => { if (emailError) validateEmail(e.target.value) }}
                      />
                      {emailError && (
                        <span className="text-[10px] text-red-400 leading-tight">{emailError}</span>
                      )}
                    </FormField>
                    <FormField label="Phone">
                      <PhoneField />
                    </FormField>
                  </div>

                  {/* Section: Research Brief */}
                  <div className="mb-[13px] flex items-center gap-2.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--accent)]">
                    {fc.briefLabel ?? 'Research Brief'}
                    <div className="h-px flex-1 bg-[var(--border)]" />
                  </div>

                  <div className="mb-[9px]">
                    <FormField label="Topic / Research Question *">
                      <input
                        name="topic"
                        type="text"
                        placeholder="e.g. GPU allocation at hyperscalers, GLP-1 payer dynamics"
                        required
                        className={`${inputCls} !border-[rgba(52,211,153,0.28)] !bg-[rgba(52,211,153,0.03)] focus:!border-[rgba(52,211,153,0.52)] focus:!bg-[rgba(52,211,153,0.06)]`}
                      />
                    </FormField>
                  </div>
                  <div>
                    <FormField label="Additional Details">
                      <textarea
                        name="details"
                        placeholder="Expert profile, companies, geographies, key questions, timeline, urgency…"
                        className={`${inputCls} min-h-[80px] resize-y leading-[1.55]`}
                      />
                    </FormField>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 flex w-full items-center justify-center gap-[9px] rounded-[11px] bg-[var(--accent)] px-5 py-[14px] text-[14px] font-semibold tracking-[-0.01em] text-[#050A07] transition-all duration-200 hover:-translate-y-px hover:bg-[var(--accent-deep)] disabled:opacity-60"
                    style={{
                      border: 'none',
                      boxShadow: '0 0 0 1px var(--accent-border), 0 8px 28px -8px rgba(52,211,153,0.55)',
                    }}
                  >
                    <ArrowIcon />
                    {loading ? 'Submitting…' : (fc.submitLabel ?? 'Submit Research Brief')}
                  </button>

                  {fc.formNote && (
                    <p className="mt-[11px] text-center font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--mist)]">
                      {fc.formNote}
                    </p>
                  )}
                </form>
              )}

              {/* Trust strip — bottom of card, last 3 stats */}
              {formStats.length > 0 && (
                <div
                  className="grid border-t border-[var(--border)]"
                  style={{
                    gridTemplateColumns: `repeat(${formStats.length}, 1fr)`,
                    background: 'rgba(0,0,0,0.2)',
                  }}
                >
                  {formStats.map((s, i) => (
                    <div
                      key={i}
                      className={`px-3 py-3 text-center ${i < formStats.length - 1 ? 'border-r border-[var(--border)]' : ''}`}
                    >
                      <div className="font-mono text-[15px] font-medium leading-snug tracking-[-0.02em] text-[var(--accent)]">
                        {s.value}
                      </div>
                      <div className="mt-0.5 whitespace-pre-line font-mono text-[8px] uppercase leading-[1.3] tracking-[0.1em] text-[var(--mist)]">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

const inputCls =
  'w-full rounded-[9px] border border-[var(--border)] bg-[rgba(0,0,0,0.32)] px-[13px] py-[10px] font-sans text-[13px] text-[var(--ink)] outline-none placeholder:text-[rgba(255,255,255,0.2)] transition-all duration-200 focus:border-[rgba(52,211,153,0.42)] focus:bg-[rgba(52,211,153,0.04)] focus:shadow-[0_0_0_3px_rgba(52,211,153,0.07)]'

function FormField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-[5px]">
      <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--mist)]">{label}</span>
      {children}
    </div>
  )
}

// [dial code, ISO country code, country name] — used in the dropdown option list
const COUNTRY_CODES: [string, string, string][] = [
  ['+1',   'US', 'United States'],
  ['+1',   'CA', 'Canada'],
  ['+44',  'GB', 'United Kingdom'],
  ['+91',  'IN', 'India'],
  ['+65',  'SG', 'Singapore'],
  ['+971', 'AE', 'UAE'],
  ['+61',  'AU', 'Australia'],
  ['+852', 'HK', 'Hong Kong'],
  ['+49',  'DE', 'Germany'],
  ['+33',  'FR', 'France'],
  ['+81',  'JP', 'Japan'],
  ['+82',  'KR', 'South Korea'],
  ['+86',  'CN', 'China'],
  ['+34',  'ES', 'Spain'],
  ['+39',  'IT', 'Italy'],
  ['+31',  'NL', 'Netherlands'],
  ['+46',  'SE', 'Sweden'],
  ['+47',  'NO', 'Norway'],
  ['+45',  'DK', 'Denmark'],
  ['+41',  'CH', 'Switzerland'],
  ['+43',  'AT', 'Austria'],
  ['+32',  'BE', 'Belgium'],
  ['+351', 'PT', 'Portugal'],
  ['+48',  'PL', 'Poland'],
  ['+7',   'RU', 'Russia'],
  ['+55',  'BR', 'Brazil'],
  ['+52',  'MX', 'Mexico'],
  ['+54',  'AR', 'Argentina'],
  ['+56',  'CL', 'Chile'],
  ['+57',  'CO', 'Colombia'],
  ['+27',  'ZA', 'South Africa'],
  ['+234', 'NG', 'Nigeria'],
  ['+254', 'KE', 'Kenya'],
  ['+20',  'EG', 'Egypt'],
  ['+966', 'SA', 'Saudi Arabia'],
  ['+972', 'IL', 'Israel'],
  ['+90',  'TR', 'Turkey'],
  ['+62',  'ID', 'Indonesia'],
  ['+60',  'MY', 'Malaysia'],
  ['+66',  'TH', 'Thailand'],
  ['+84',  'VN', 'Vietnam'],
  ['+63',  'PH', 'Philippines'],
  ['+64',  'NZ', 'New Zealand'],
  ['+94',  'LK', 'Sri Lanka'],
  ['+92',  'PK', 'Pakistan'],
  ['+880', 'BD', 'Bangladesh'],
  ['+98',  'IR', 'Iran'],
  ['+30',  'GR', 'Greece'],
  ['+36',  'HU', 'Hungary'],
  ['+420', 'CZ', 'Czech Republic'],
  ['+40',  'RO', 'Romania'],
  ['+380', 'UA', 'Ukraine'],
  ['+353', 'IE', 'Ireland'],
  ['+358', 'FI', 'Finland'],
  ['+421', 'SK', 'Slovakia'],
  ['+371', 'LV', 'Latvia'],
  ['+370', 'LT', 'Lithuania'],
  ['+372', 'EE', 'Estonia'],
  ['+354', 'IS', 'Iceland'],
  ['+212', 'MA', 'Morocco'],
  ['+213', 'DZ', 'Algeria'],
  ['+216', 'TN', 'Tunisia'],
  ['+249', 'SD', 'Sudan'],
  ['+233', 'GH', 'Ghana'],
  ['+255', 'TZ', 'Tanzania'],
  ['+251', 'ET', 'Ethiopia'],
  ['+256', 'UG', 'Uganda'],
  ['+263', 'ZW', 'Zimbabwe'],
  ['+260', 'ZM', 'Zambia'],
  ['+58',  'VE', 'Venezuela'],
  ['+51',  'PE', 'Peru'],
  ['+593', 'EC', 'Ecuador'],
  ['+598', 'UY', 'Uruguay'],
  ['+595', 'PY', 'Paraguay'],
  ['+591', 'BO', 'Bolivia'],
  ['+507', 'PA', 'Panama'],
  ['+506', 'CR', 'Costa Rica'],
  ['+53',  'CU', 'Cuba'],
  ['+1787','PR', 'Puerto Rico'],
  ['+974', 'QA', 'Qatar'],
  ['+965', 'KW', 'Kuwait'],
  ['+973', 'BH', 'Bahrain'],
  ['+968', 'OM', 'Oman'],
  ['+962', 'JO', 'Jordan'],
  ['+961', 'LB', 'Lebanon'],
  ['+964', 'IQ', 'Iraq'],
  ['+977', 'NP', 'Nepal'],
  ['+95',  'MM', 'Myanmar'],
  ['+855', 'KH', 'Cambodia'],
  ['+856', 'LA', 'Laos'],
]

// ══════════════════════════════════════════════════════════════════════════════
// CommissioningSteps
// ══════════════════════════════════════════════════════════════════════════════

type CommissioningStepsBlock = {
  blockType: 'commissioningSteps'
  eyebrow?: string
  heading?: string
  description?: string
  steps?: Array<{
    stepNumber: string
    stepLabel: string
    iconKey?: string
    title: string
    description: string
    timing?: string
  }>
  background?: string
  spacing?: string
  anchorId?: string
}

export function CommissioningStepsRenderer({ block }: { block: CommissioningStepsBlock }) {
  const steps = block.steps ?? []
  const cols = Math.min(steps.length, 4)

  return (
    <SectionShell background={block.background as never} spacing={block.spacing as never} anchorId={block.anchorId}>
      <motion.div {...VIEW} className="mb-14">
        {block.eyebrow && <SectionEyebrow>{block.eyebrow}</SectionEyebrow>}
        {block.heading && <SectionHeading text={block.heading} />}
        {block.description && (
          <p className="mt-3.5 max-w-[540px] text-[16px] leading-[1.65] text-[var(--ink-2)]">
            {block.description}
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden rounded-[18px] border border-[var(--border)]"
        style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '1px', background: 'var(--border)' }}
      >
        {steps.map((step, i) => (
          <div
            key={i}
            className="group relative cursor-default bg-[var(--surface)] px-7 py-[30px] transition-colors duration-[180ms] hover:bg-[var(--surface-2)]"
          >
            {/* Top-edge hover glow */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-60" />

            <div className="mb-[18px] font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--mist)]">
              <strong className="text-[var(--accent)]">{step.stepNumber}</strong>
              {' '}— {step.stepLabel}
            </div>
            <div className="mb-4 flex h-[42px] w-[42px] items-center justify-center rounded-[11px] border border-[var(--accent-border)] bg-[var(--accent-tint)]">
              {STEP_ICONS[step.iconKey ?? 'submit'] ?? STEP_ICONS.submit}
            </div>
            <h3 className="mb-2 text-[16px] font-semibold leading-snug tracking-[-0.02em] text-[var(--ink)]">
              {step.title}
            </h3>
            <p className="text-[13px] leading-[1.65] text-[var(--ink-2)]">{step.description}</p>
            {step.timing && (
              <span className="mt-3.5 inline-block rounded px-[9px] py-[3px] font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--accent)] bg-[var(--accent-tint)] border border-[var(--accent-border)]">
                {step.timing}
              </span>
            )}
          </div>
        ))}
      </motion.div>
    </SectionShell>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// DeliverablesGrid
// ══════════════════════════════════════════════════════════════════════════════

type DeliverablesGridBlock = {
  blockType: 'deliverablesGrid'
  eyebrow?: string
  heading?: string
  description?: string
  columns?: '2' | '3'
  items?: Array<{
    iconKey?: string
    title: string
    description: string
    badge?: string
    badgeTone?: 'amber' | 'mint' | 'muted'
  }>
  background?: string
  spacing?: string
  anchorId?: string
}

export function DeliverablesGridRenderer({ block }: { block: DeliverablesGridBlock }) {
  const items = block.items ?? []
  const cols = block.columns === '2' ? 2 : 3

  return (
    <SectionShell background={block.background as never} spacing={block.spacing as never} anchorId={block.anchorId}>
      <motion.div {...VIEW} className="mb-14">
        {block.eyebrow && <SectionEyebrow>{block.eyebrow}</SectionEyebrow>}
        {block.heading && <SectionHeading text={block.heading} />}
        {block.description && (
          <p className="mt-3.5 max-w-[540px] text-[16px] leading-[1.65] text-[var(--ink-2)]">
            {block.description}
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden rounded-[18px] border border-[var(--border)]"
        style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '1px', background: 'var(--border)' }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="bg-[var(--surface)] px-[26px] py-7 transition-colors duration-[180ms] hover:bg-[var(--surface-2)]"
          >
            <div className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-[10px] border border-[var(--accent-border)] bg-[var(--accent-tint)]">
              {DEL_ICONS[item.iconKey ?? 'document'] ?? DEL_ICONS.document}
            </div>
            <h3 className="mb-[7px] text-[15px] font-semibold leading-snug tracking-[-0.015em] text-[var(--ink)]">
              {item.title}
            </h3>
            <p className="text-[13px] leading-[1.65] text-[var(--ink-2)]">{item.description}</p>
            {item.badge && (
              <span className={`mt-2.5 inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.08em] ${BADGE_CLASSES[item.badgeTone ?? 'amber']}`}>
                {item.badge}
              </span>
            )}
          </div>
        ))}
      </motion.div>
    </SectionShell>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// UseCasesBento
// ══════════════════════════════════════════════════════════════════════════════

type UseCasesBentoBlock = {
  blockType: 'useCasesBento'
  eyebrow?: string
  heading?: string
  description?: string
  cases?: Array<{
    persona: string
    title: string
    description: string
    colSpan?: '3' | '4' | '5'
    featured?: boolean
  }>
  background?: string
  spacing?: string
  anchorId?: string
}

export function UseCasesBentoRenderer({ block }: { block: UseCasesBentoBlock }) {
  const cases = block.cases ?? []

  const colSpanClass: Record<string, string> = {
    '3': 'col-span-12 lg:col-span-3',
    '4': 'col-span-12 lg:col-span-4',
    '5': 'col-span-12 lg:col-span-5',
  }

  return (
    <SectionShell background={block.background as never} spacing={block.spacing as never} anchorId={block.anchorId}>
      <motion.div {...VIEW} className="mb-14">
        {block.eyebrow && <SectionEyebrow>{block.eyebrow}</SectionEyebrow>}
        {block.heading && <SectionHeading text={block.heading} />}
        {block.description && (
          <p className="mt-3.5 max-w-[540px] text-[16px] leading-[1.65] text-[var(--ink-2)]">
            {block.description}
          </p>
        )}
      </motion.div>

      <div className="grid grid-cols-12 gap-[10px]">
        {cases.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            className={[
              colSpanClass[c.colSpan ?? '4'],
              'group relative cursor-default overflow-hidden rounded-[16px] border px-7 py-[26px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_48px_-16px_rgba(0,0,0,0.4)]',
              c.featured
                ? 'border-[rgba(52,211,153,0.22)] hover:border-[rgba(52,211,153,0.22)]'
                : 'border-[var(--border)] bg-[var(--surface)] hover:border-[rgba(255,255,255,0.12)]',
            ].join(' ')}
            style={c.featured
              ? { background: 'linear-gradient(145deg, rgba(52,211,153,0.07) 0%, var(--surface) 55%)' }
              : {}}
          >
            {c.featured && (
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-px opacity-50"
                style={{ background: 'linear-gradient(90deg, transparent 8%, var(--accent) 50%, transparent 92%)' }}
              />
            )}
            <div className="mb-[13px] inline-flex items-center rounded-full border border-[var(--accent-border)] bg-[var(--accent-tint)] px-[10px] py-[3px] font-mono text-[9px] uppercase tracking-[0.13em] text-[var(--accent)]">
              {c.persona}
            </div>
            <h3 className="mb-2 text-[17px] font-semibold leading-snug tracking-[-0.02em] text-[var(--ink)]">
              {c.title}
            </h3>
            <p className="text-[13px] leading-[1.65] text-[var(--ink-2)]">{c.description}</p>
          </motion.div>
        ))}
      </div>
    </SectionShell>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// PricingComparison
// ══════════════════════════════════════════════════════════════════════════════

type PricingComparisonBlock = {
  blockType: 'pricingComparison'
  eyebrow?: string
  heading?: string
  description?: string
  leftPanel?: {
    panelLabel?: string
    amount?: string
    period?: string
    note?: string
    features?: Array<{ text: string }>
  }
  rightPanel?: {
    panelLabel?: string
    amount?: string
    period?: string
    amountColor?: 'accent' | 'warning'
    note?: string
    features?: Array<{ text: string }>
  }
  ctaPanel?: {
    overline?: string
    heading?: string
    body?: string
    primaryLabel?: string
    primaryUrl?: string
    browseLinkLabel?: string
    browseLinkUrl?: string
  }
  background?: string
  spacing?: string
  anchorId?: string
}

export function PricingComparisonRenderer({ block }: { block: PricingComparisonBlock }) {
  const lp = block.leftPanel ?? {}
  const rp = block.rightPanel ?? {}
  const cp = block.ctaPanel ?? {}
  const amountColor = rp.amountColor === 'warning' ? '#FBBF24' : 'var(--accent)'

  return (
    <SectionShell background={block.background as never} spacing={block.spacing as never} anchorId={block.anchorId}>
      <motion.div {...VIEW} className="mb-14">
        {block.eyebrow && <SectionEyebrow>{block.eyebrow}</SectionEyebrow>}
        {block.heading && <SectionHeading text={block.heading} />}
        {block.description && (
          <p className="mt-3.5 max-w-[540px] text-[16px] leading-[1.65] text-[var(--ink-2)]">
            {block.description}
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--surface)]"
      >
        {/* ─ Desktop: 3-column grid ─────────────────────────────────────────── */}
        <div className="hidden lg:grid" style={{ gridTemplateColumns: '1fr 1px 1fr 1px 1fr' }}>

          {/* Left panel */}
          <div className="p-10">
            {lp.panelLabel && (
              <div className="mb-3 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--mist)]">
                {lp.panelLabel}
              </div>
            )}
            <div className="font-mono text-[52px] font-medium leading-none tracking-[-0.05em] text-[var(--accent)] mb-[5px]">
              {lp.amount}
            </div>
            {lp.period && (
              <div className="mb-[18px] text-[13px] text-[var(--mist)]">{lp.period}</div>
            )}
            {lp.note && (
              <p className="mb-[22px] text-[14px] leading-[1.7] text-[var(--ink-2)]">{lp.note}</p>
            )}
            <ul className="flex flex-col gap-[10px]">
              {(lp.features ?? []).map((f, i) => (
                <li key={i} className="flex items-start gap-[9px] text-[13px] leading-[1.4] text-[var(--ink-2)]">
                  <div className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded border border-[var(--accent-border)] bg-[var(--accent-tint)]">
                    <Check className="h-2 w-2 text-[var(--accent)]" strokeWidth={2.5} />
                  </div>
                  {f.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Divider */}
          <div className="bg-[var(--border)]" />

          {/* Right panel */}
          <div className="p-10" style={{ background: 'rgba(251,191,36,0.02)' }}>
            {rp.panelLabel && (
              <div className="mb-3 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--mist)]">
                {rp.panelLabel}
              </div>
            )}
            <div
              className="font-mono text-[52px] font-medium leading-none tracking-[-0.05em] mb-[5px]"
              style={{ color: amountColor }}
            >
              {rp.amount}
            </div>
            {rp.period && (
              <div className="mb-[18px] text-[13px] text-[var(--mist)]">{rp.period}</div>
            )}
            {rp.note && (
              <p className="mb-[22px] text-[14px] leading-[1.7] text-[var(--ink-2)]">{rp.note}</p>
            )}
            <ul className="flex flex-col gap-[10px]">
              {(rp.features ?? []).map((f, i) => (
                <li key={i} className="flex items-start gap-[9px] text-[13px] leading-[1.4] text-[var(--mist)]">
                  <div className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded border border-[var(--border)] bg-[rgba(255,255,255,0.03)]">
                    <X className="h-2 w-2 text-[var(--mist)]" strokeWidth={2} />
                  </div>
                  {f.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Divider */}
          <div className="bg-[var(--border)]" />

          {/* CTA panel */}
          <div className="flex flex-col items-center justify-center gap-4 p-10 text-center" style={{ background: 'rgba(52,211,153,0.02)' }}>
            {cp.overline && (
              <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--mist)]">
                {cp.overline}
              </div>
            )}
            {cp.heading && (
              <h3 className="text-[22px] font-semibold leading-[1.2] tracking-[-0.03em] text-[var(--ink)]">
                {cp.heading}
              </h3>
            )}
            {cp.body && (
              <p className="text-[13px] leading-[1.65] text-[var(--ink-2)]">{cp.body}</p>
            )}
            {cp.primaryLabel && cp.primaryUrl && (
              <a
                href={cp.primaryUrl}
                className="inline-flex items-center gap-2 rounded-[11px] bg-[var(--accent)] px-[26px] py-[13px] text-[14px] font-semibold tracking-[-0.01em] text-[#050A07] transition-all duration-200 hover:-translate-y-px hover:bg-[var(--accent-deep)]"
                style={{ boxShadow: '0 0 0 1px var(--accent-border), 0 8px 28px -8px var(--accent-glow)' }}
              >
                <ArrowIcon />
                {cp.primaryLabel}
              </a>
            )}
            {cp.browseLinkLabel && cp.browseLinkUrl && (
              <p className="text-[12px] text-[var(--mist)]">
                Or{' '}
                <a
                  href={cp.browseLinkUrl}
                  className="border-b border-[var(--accent-border)] text-[var(--accent)] transition-opacity hover:opacity-80"
                >
                  {cp.browseLinkLabel}
                </a>
              </p>
            )}
          </div>
        </div>

        {/* ─ Mobile: stacked ────────────────────────────────────────────────── */}
        <div className="divide-y divide-[var(--border)] lg:hidden">
          <div className="p-7">
            {lp.panelLabel && (
              <div className="mb-3 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--mist)]">{lp.panelLabel}</div>
            )}
            <div className="mb-1.5 font-mono text-[40px] font-medium tracking-[-0.05em] text-[var(--accent)]">{lp.amount}</div>
            {lp.period && <div className="mb-4 text-[13px] text-[var(--mist)]">{lp.period}</div>}
            {lp.note && <p className="mb-4 text-[13px] leading-relaxed text-[var(--ink-2)]">{lp.note}</p>}
            <ul className="flex flex-col gap-2.5">
              {(lp.features ?? []).map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-[var(--ink-2)]">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />
                  {f.text}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-7 text-center">
            {cp.heading && (
              <h3 className="mb-3 text-[20px] font-semibold tracking-[-0.025em] text-[var(--ink)]">{cp.heading}</h3>
            )}
            {cp.body && <p className="mb-5 text-[13px] text-[var(--ink-2)]">{cp.body}</p>}
            {cp.primaryLabel && cp.primaryUrl && (
              <a
                href={cp.primaryUrl}
                className="inline-flex items-center gap-2 rounded-[11px] bg-[var(--accent)] px-5 py-3 text-[14px] font-semibold text-[#050A07]"
              >
                <ArrowIcon />
                {cp.primaryLabel}
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </SectionShell>
  )
}
