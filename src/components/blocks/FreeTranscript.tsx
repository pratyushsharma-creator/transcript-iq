'use client'

import React, { useState, useCallback } from 'react'

// ── Corporate email validation ─────────────────────────────────────────────
const BLOCKED_DOMAINS = new Set([
  'gmail.com','googlemail.com','yahoo.com','yahoo.co.uk','yahoo.co.in',
  'yahoo.fr','yahoo.de','yahoo.es','yahoo.it','yahoo.com.au','yahoo.ca',
  'hotmail.com','hotmail.co.uk','hotmail.fr','hotmail.de','hotmail.it',
  'outlook.com','outlook.co.uk','outlook.fr','live.com','live.co.uk',
  'msn.com','aol.com','icloud.com','me.com','mac.com',
  'protonmail.com','proton.me','pm.me','zoho.com','zohomail.com',
  'mail.com','email.com','ymail.com','rocketmail.com','inbox.com',
  'fastmail.com','fastmail.fm','tutanota.com','tuta.io',
  'guerrillamail.com','mailinator.com','tempmail.com','10minutemail.com',
  'throwaway.email','dispostable.com','yopmail.com',
  'qq.com','163.com','126.com','sina.com','sohu.com','naver.com',
  'daum.net','hanmail.net','rediffmail.com','web.de','gmx.de','gmx.com',
  'gmx.net','t-online.de','freenet.de','orange.fr','laposte.net','free.fr',
  'libero.it','virgilio.it','tin.it','tiscali.it','alice.it',
])

function isCorporateEmail(email: string): boolean {
  const parts = email.toLowerCase().split('@')
  if (parts.length !== 2) return false
  return !BLOCKED_DOMAINS.has(parts[1]!)
}

// ── Types ──────────────────────────────────────────────────────────────────

type FreeTranscriptHeroBlock = {
  blockType: 'freeTranscriptHero'
  eyebrow?: string
  heading?: string
  subtitle?: string
  checklist?: Array<{ item: string }>
  socialProof?: string
  sectors?: Array<{ label: string; value: string }>
  ctaLabel?: string
  complianceItems?: Array<{ label: string }>
}

type FreeTranscriptFeaturesBlock = {
  blockType: 'freeTranscriptFeatures'
  eyebrow?: string
  heading?: string
  features?: Array<{ title: string; description?: string }>
}

// ── HeroHeading parser (same as CustomReports) ────────────────────────────

function HeroHeading({ raw }: { raw: string }) {
  const lines = raw.split(/\\n|\n/)
  return (
    <h1
      style={{
        fontSize: 'clamp(42px, 5.5vw, 72px)',
        fontWeight: 700,
        letterSpacing: '-0.05em',
        lineHeight: 0.93,
        marginBottom: 10,
      }}
    >
      {lines.map((line, i) => {
        const boldMatch = line.match(/^\*\*(.+)\*\*$/)
        const ghostMatch = line.match(/^~~(.+)~~$/)
        if (boldMatch) {
          return (
            <span key={i} style={{ color: 'var(--accent)', display: 'block' }}>
              {boldMatch[1]}
            </span>
          )
        }
        if (ghostMatch) {
          return (
            <span
              key={i}
              style={{
                color: 'transparent',
                WebkitTextStroke: '1.5px rgba(255,255,255,0.2)',
                display: 'block',
              }}
            >
              {ghostMatch[1]}
            </span>
          )
        }
        return (
          <span key={i} style={{ display: 'block' }}>
            {line}
          </span>
        )
      })}
    </h1>
  )
}

// ── CheckIcon ─────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg
      width={10}
      height={10}
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path d="M1.5 5l2.5 2.5 4.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── ArrowIcon ─────────────────────────────────────────────────────────────

function ArrowIcon() {
  return (
    <svg
      width={13}
      height={13}
      viewBox="0 0 13 13"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6.5 1.5L11 6.5M11 6.5L6.5 11.5M11 6.5H2" />
    </svg>
  )
}

// ── FreeTranscriptHeroRenderer ────────────────────────────────────────────

export function FreeTranscriptHeroRenderer({ block }: { block: FreeTranscriptHeroBlock }) {
  const [activeSector, setActiveSector] = useState(0)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const sectors = block.sectors ?? [
    { label: 'Technology / SaaS', value: 'tech' },
    { label: 'Healthcare', value: 'health' },
    { label: 'Financial Services', value: 'fin' },
    { label: 'Industrials', value: 'ind' },
    { label: 'Consumer', value: 'cons' },
    { label: 'Energy', value: 'energy' },
  ]

  const checklist = block.checklist ?? []
  const complianceItems = block.complianceItems ?? []

  const validateEmail = useCallback((val: string) => {
    if (!val) { setEmailError(''); return }
    if (!val.includes('@')) { setEmailError('Enter a valid email address'); return }
    if (!isCorporateEmail(val)) {
      setEmailError('Please use your corporate / work email')
    } else {
      setEmailError('')
    }
  }, [])

  function handleClaim() {
    if (!email) { setEmailError('Enter your work email'); return }
    if (!isCorporateEmail(email)) {
      setEmailError('Please use your corporate / work email')
      return
    }
    setSubmitted(true)
  }

  return (
    <section
      className="flex flex-col gap-10 px-4 py-12 lg:grid lg:items-center lg:gap-[72px] lg:px-12 lg:py-16"
      style={{
        position: 'relative',
        minHeight: 'calc(100vh - 54px)',
        gridTemplateColumns: '1fr 460px',
        maxWidth: 1100,
        margin: '0 auto',
        zIndex: 1,
      }}
    >
      {/* ── Left: value prop ── */}
      <div>
        {/* Eyebrow */}
        {block.eyebrow && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              border: '1px solid rgba(52,211,153,0.26)',
              background: 'rgba(52,211,153,0.08)',
              padding: '5px 14px',
              borderRadius: 99,
              marginBottom: 28,
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: 'var(--accent)',
              }}
            />
            {block.eyebrow}
          </div>
        )}

        {/* Heading */}
        <HeroHeading raw={block.heading ?? 'Your first\\n~~expert call~~\\n**transcript. Free.**'} />

        {/* Subtitle */}
        {block.subtitle && (
          <p
            style={{
              fontSize: 17,
              color: 'var(--ink-2)',
              lineHeight: 1.72,
              maxWidth: 480,
              marginBottom: 40,
              fontWeight: 400,
            }}
          >
            {block.subtitle}
          </p>
        )}

        {/* Checklist */}
        {checklist.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
            {checklist.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: 'var(--ink-2)' }}>
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 5,
                    background: 'rgba(52,211,153,0.08)',
                    border: '1px solid rgba(52,211,153,0.26)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: 'var(--accent)',
                  }}
                >
                  <CheckIcon />
                </div>
                {c.item}
              </div>
            ))}
          </div>
        )}

        {/* Social proof */}
        {block.socialProof && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '16px 0',
              borderTop: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            {/* Avatar stack */}
            <div style={{ display: 'flex' }}>
              {['PM', 'AH', 'KR', 'SL'].map((init, i) => (
                <div
                  key={i}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    border: '2px solid var(--bg)',
                    background: 'linear-gradient(135deg,#10B981,#34D399)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 8,
                    fontWeight: 600,
                    color: '#064E3B',
                    marginLeft: i === 0 ? 0 : -8,
                  }}
                >
                  {init}
                </div>
              ))}
            </div>
            <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>
              <strong style={{ color: 'var(--ink)' }}>
                {block.socialProof.split(' ').slice(0, 2).join(' ')}
              </strong>{' '}
              {block.socialProof.split(' ').slice(2).join(' ')}
            </span>
          </div>
        )}
      </div>

      {/* ── Right: Claim card ── */}
      <div>
        <div
          style={{
            background: 'rgba(255,255,255,0.035)',
            border: '1px solid rgba(255,255,255,0.13)',
            borderRadius: 20,
            overflow: 'hidden',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            boxShadow:
              '0 0 0 1px rgba(52,211,153,0.05), 0 32px 96px -24px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.07)',
            position: 'relative',
          }}
        >
          {/* Top glow line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              zIndex: 2,
              background:
                'linear-gradient(90deg, transparent 8%, rgba(52,211,153,0.55) 50%, transparent 92%)',
            }}
          />

          {/* Card header */}
          <div
            style={{
              padding: '16px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              background: 'rgba(0,0,0,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  boxShadow: '0 0 8px rgba(52,211,153,0.28)',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-2)',
                }}
              >
                Claim Free Transcript
              </span>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--accent)',
                background: 'rgba(52,211,153,0.08)',
                border: '1px solid rgba(52,211,153,0.26)',
                padding: '3px 9px',
                borderRadius: 4,
              }}
            >
              Free · No card
            </span>
          </div>

          {/* Card body */}
          {!submitted ? (
            <div style={{ padding: 24 }}>
              {/* Transcript preview */}
              <div
                style={{
                  background: 'rgba(0,0,0,0.35)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 12,
                  overflow: 'hidden',
                  marginBottom: 22,
                }}
              >
                <div
                  style={{
                    padding: '10px 16px',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 7,
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--accent)',
                    }}
                  >
                    <span
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        background: 'var(--accent)',
                      }}
                    />
                    Sample Transcript
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9,
                      letterSpacing: '0.1em',
                      color: 'rgba(68,68,64,1)',
                      background: 'var(--s2)',
                      padding: '2px 7px',
                      borderRadius: 3,
                    }}
                  >
                    Standard · $349 value
                  </div>
                </div>
                <div style={{ padding: 16 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      letterSpacing: '-0.01em',
                      marginBottom: 6,
                      lineHeight: 1.35,
                    }}
                  >
                    AI Compute Migration in ASEAN: Shift to AI Infrastructure and Sovereign Data
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9,
                      letterSpacing: '0.08em',
                      color: 'var(--ink-3)',
                      marginBottom: 10,
                    }}
                  >
                    49 min · APAC · Former VP Infrastructure · EXP-198
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                    {['$GOOGL', '$AMZN', '$AMD', '+5 more'].map((t) => (
                      <span
                        key={t}
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 9,
                          color: 'var(--ink-3)',
                          background: 'var(--s3)',
                          border: '1px solid rgba(255,255,255,0.07)',
                          padding: '2px 7px',
                          borderRadius: 3,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: 'rgba(68,68,64,1)',
                      paddingTop: 10,
                      borderTop: '1px solid rgba(255,255,255,0.07)',
                      lineHeight: 1.6,
                    }}
                  >
                    Full transcript unlocked on signup. Preview: <span style={{ background: 'var(--s3)', color: 'transparent', borderRadius: 2, padding: '0 2px' }}>████████████</span> infrastructure economics in ASEAN <span style={{ background: 'var(--s3)', color: 'transparent', borderRadius: 2, padding: '0 2px' }}>██████</span> hyperscaler demand…
                  </div>
                </div>
              </div>

              {/* Sector select */}
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-3)',
                  marginBottom: 10,
                  display: 'block',
                }}
              >
                01 — Choose your sector
              </span>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 6,
                  marginBottom: 16,
                }}
              >
                {sectors.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSector(i)}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: activeSector === i ? 'var(--accent)' : 'var(--ink-3)',
                      background: activeSector === i ? 'rgba(52,211,153,0.08)' : 'rgba(0,0,0,0.3)',
                      border: activeSector === i
                        ? '1px solid rgba(52,211,153,0.26)'
                        : '1px solid rgba(255,255,255,0.07)',
                      padding: '9px 12px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s',
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Email */}
              <div style={{ marginBottom: 14, marginTop: 16 }}>
                <label
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-3)',
                    marginBottom: 7,
                    display: 'block',
                  }}
                >
                  02 — Your work email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (emailError) validateEmail(e.target.value) }}
                  onBlur={(e) => validateEmail(e.target.value)}
                  placeholder="you@fund.com"
                  style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.32)',
                    border: emailError ? '1px solid rgba(239,68,68,0.6)' : '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 9,
                    padding: '11px 14px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 14,
                    color: 'var(--ink)',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = emailError ? 'rgba(239,68,68,0.8)' : 'rgba(52,211,153,0.42)'
                    e.currentTarget.style.background = 'rgba(52,211,153,0.04)'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(52,211,153,0.07)'
                  }}
                />
                {emailError && (
                  <span style={{ fontSize: 11, color: '#f87171', display: 'block', marginTop: 4 }}>
                    {emailError}
                  </span>
                )}
              </div>

              {/* CTA */}
              <button
                onClick={handleClaim}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 9,
                  background: 'var(--accent)',
                  color: '#050A07',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  padding: 14,
                  borderRadius: 11,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow:
                    '0 0 0 1px rgba(52,211,153,0.26), 0 8px 28px -8px rgba(52,211,153,0.28)',
                  marginBottom: 12,
                }}
              >
                <ArrowIcon />
                {block.ctaLabel ?? 'Get My Free Transcript'}
              </button>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'rgba(68,68,64,1)',
                  textAlign: 'center',
                }}
              >
                No credit card · No subscription · Delivered within 24 hours
              </div>
            </div>
          ) : (
            /* Success state */
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: 14,
                padding: '40px 24px',
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: 'rgba(52,211,153,0.08)',
                  border: '1px solid rgba(52,211,153,0.26)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg
                  width={22}
                  height={22}
                  viewBox="0 0 22 22"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth={1.5}
                >
                  <path d="M3 11l6 6 10-10" strokeLinecap="round" />
                </svg>
              </div>
              <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em' }}>
                Check your inbox
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.65 }}>
                Your free transcript is on its way. We&apos;ve matched one to your sector — expect it
                within 24 hours.
              </div>
            </div>
          )}

          {/* Compliance strip */}
          {complianceItems.length > 0 && (
            <div
              style={{
                borderTop: '1px solid rgba(255,255,255,0.07)',
                padding: '10px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                background: 'rgba(0,0,0,0.15)',
                flexWrap: 'wrap',
              }}
            >
              {complianceItems.map((ci, i) => (
                <div
                  key={i}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'rgba(68,68,64,1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  <span style={{ color: 'var(--accent)' }}>
                    <CheckIcon />
                  </span>
                  {ci.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ── FreeTranscriptFeaturesRenderer ────────────────────────────────────────
// "What's in your free PDF" — doc mockup left, features right

export function FreeTranscriptFeaturesRenderer({
  block,
}: {
  block: FreeTranscriptFeaturesBlock
}) {
  const features = block.features ?? []

  return (
    <section
      style={{
        padding: '96px 0',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 48px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 64,
            alignItems: 'center',
          }}
        >
          {/* Left: document mockup */}
          <div
            style={{
              background: 'rgba(255,255,255,0.035)',
              border: '1px solid rgba(255,255,255,0.13)',
              borderRadius: 16,
              overflow: 'hidden',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div
              style={{
                padding: '12px 18px',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: 'var(--accent)',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--accent)',
                }}
              >
                Your Free PDF
              </span>
            </div>
            <div style={{ padding: 20 }}>
              {/* Section: Executive Summary */}
              <DocSection label="Executive Summary" free>
                <Line accent width="55%" />
                <Line width="80%" />
                <Line width="60%" />
                <Line width="90%" />
                <Line width="70%" />
              </DocSection>
              {/* Section: Expert Profile */}
              <DocSection label="Expert Profile" free>
                <Line width="45%" />
                <Line width="60%" />
              </DocSection>
              {/* Section: Full Verbatim Transcript */}
              <DocSection label="Full Verbatim Transcript">
                <Line width="100%" />
                <Line width="80%" />
                <Line width="95%" />
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 12px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 8,
                    marginTop: 8,
                  }}
                >
                  <svg
                    width={11}
                    height={11}
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="rgba(68,68,64,1)"
                    strokeWidth={1.3}
                  >
                    <rect x="2" y="6" width="10" height="7" rx="1.5" />
                    <path d="M4.5 6V4.5a2.5 2.5 0 1 1 5 0V6" />
                  </svg>
                  <span style={{ fontSize: 11, color: 'rgba(68,68,64,1)' }}>
                    Free transcript unlocks the full content
                  </span>
                </div>
              </DocSection>
              {/* Section: Compliance Cert */}
              <DocSection label="Compliance Cert" free>
                <Line width="50%" />
              </DocSection>
            </div>
          </div>

          {/* Right: features */}
          <div>
            {block.eyebrow && (
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--accent)',
                  display: 'block',
                  marginBottom: 14,
                }}
              >
                {block.eyebrow}
              </span>
            )}
            {block.heading && (
              <h2
                style={{
                  fontSize: 'clamp(28px, 3.5vw, 44px)',
                  fontWeight: 600,
                  letterSpacing: '-0.035em',
                  lineHeight: 1.08,
                  marginBottom: 24,
                }}
                dangerouslySetInnerHTML={{
                  __html: block.heading.replace(
                    /<em>(.*?)<\/em>/g,
                    '<em style="color:var(--accent);font-style:italic;font-weight:400">$1</em>',
                  ),
                }}
              />
            )}
            {features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 18 }}>
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 5,
                    background: 'rgba(52,211,153,0.08)',
                    border: '1px solid rgba(52,211,153,0.26)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 2,
                    color: 'var(--accent)',
                  }}
                >
                  <CheckIcon />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 500,
                      letterSpacing: '-0.01em',
                      marginBottom: 2,
                    }}
                  >
                    {f.title}
                  </div>
                  {f.description && (
                    <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6 }}>
                      {f.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Doc section helper ────────────────────────────────────────────────────

function DocSection({
  label,
  free,
  children,
}: {
  label: string
  free?: boolean
  children: React.ReactNode
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 8,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--accent)',
          marginBottom: 6,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {label}
        {free && (
          <span
            style={{
              background: 'rgba(52,211,153,0.08)',
              border: '1px solid rgba(52,211,153,0.26)',
              padding: '1px 6px',
              borderRadius: 3,
              fontSize: 8,
              color: 'var(--accent)',
            }}
          >
            Free
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

function Line({ accent, width }: { accent?: boolean; width?: string }) {
  return (
    <div
      style={{
        height: 8,
        background: accent ? 'rgba(52,211,153,0.2)' : 'rgba(37,37,40,1)',
        borderRadius: 4,
        marginBottom: 5,
        width: width ?? '100%',
      }}
    />
  )
}
