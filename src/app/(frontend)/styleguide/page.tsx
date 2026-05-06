'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { ArrowRight, Sparkles, ShieldCheck, Zap, FileText, Brain, Lock } from 'lucide-react'

// ────────────────────────────────────────────────────────────────────────────
// Hero
// ────────────────────────────────────────────────────────────────────────────

function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, 120])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden border-b border-[var(--border)] pt-20 pb-32 lg:pt-32 lg:pb-40"
    >
      <div aria-hidden className="absolute inset-0 -z-10 bg-hero-glow" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-hero-grid mask-fade-y" />

      <motion.div
        style={{ y, opacity }}
        className="mx-auto w-full max-w-[1240px] px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-border)] bg-[var(--accent-tint)] px-3 py-1 text-[11px] font-mono font-medium uppercase tracking-[0.12em] text-[var(--accent)]"
        >
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="absolute inset-0 rounded-full bg-[var(--accent)] animate-pulse-soft" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          </span>
          Design system v1 · Live demo
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-4xl text-[44px] leading-[1.05] tracking-[-0.035em] text-[var(--ink)] sm:text-[56px] lg:text-[72px] lg:leading-none lg:tracking-[-0.04em] font-semibold text-balance"
        >
          Intelligence at the speed of{' '}
          <span className="text-mint-gradient">now</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-2xl text-[18px] leading-relaxed text-[var(--ink-2)] lg:text-[20px]"
        >
          Anonymized expert call transcripts and earnings analysis briefs. Built for analysts who run six LLM tabs in parallel and read at 2× speed.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <a
            href="/expert-transcripts"
            className="group inline-flex items-center gap-2 rounded-md bg-btn-primary px-5 py-3 text-sm font-medium text-white shadow-cta transition-all duration-base ease-out hover:-translate-y-px hover:bg-btn-primary-hover"
          >
            Browse transcripts
            <ArrowRight className="h-4 w-4 transition-transform duration-base ease-out group-hover:translate-x-0.5" />
          </a>
          <a
            href="/earnings-analysis"
            className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm font-medium text-[var(--ink)] transition-all duration-base ease-out hover:-translate-y-px hover:border-[var(--accent-border)]"
          >
            Earnings briefs
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 gap-x-10 gap-y-6 border-t border-[var(--border)] pt-10 sm:grid-cols-4 lg:grid-cols-5"
        >
          {[
            { label: 'Aesthetic', value: 'Synthesis' },
            { label: 'Accent', value: 'Mint #10B981' },
            { label: 'Display', value: 'Geist · Geist Mono' },
            { label: 'Mode', value: 'Dark · Light' },
            { label: 'Version', value: '1.0 · 2026.04.29' },
          ].map((m) => (
            <div key={m.label} className="flex flex-col gap-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--mist)]">
                {m.label}
              </span>
              <span className="text-[13px] font-medium text-[var(--ink)]">{m.value}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Section wrapper with scroll-reveal
// ────────────────────────────────────────────────────────────────────────────

function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="mx-auto w-full max-w-[1240px] px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12 max-w-2xl"
      >
        {eyebrow && (
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--accent)]">
            {eyebrow}
          </span>
        )}
        <h2 className="mt-3 text-[32px] leading-[1.15] tracking-[-0.025em] text-[var(--ink)] font-medium sm:text-[44px] sm:leading-[1.1] sm:tracking-[-0.03em] text-balance">
          {title}
        </h2>
        {description && (
          <p className="mt-4 text-[16px] leading-relaxed text-[var(--ink-2)]">
            {description}
          </p>
        )}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </section>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Color section
// ────────────────────────────────────────────────────────────────────────────

const MINT_RAMP = [
  { weight: 50, hex: '#ECFDF5' },
  { weight: 100, hex: '#D1FAE5' },
  { weight: 200, hex: '#A7F3D0' },
  { weight: 300, hex: '#6EE7B7' },
  { weight: 400, hex: '#34D399' },
  { weight: 500, hex: '#10B981' },
  { weight: 600, hex: '#059669' },
  { weight: 700, hex: '#047857' },
  { weight: 800, hex: '#065F46' },
  { weight: 900, hex: '#064E3B' },
]

function ColorSection() {
  return (
    <Section
      eyebrow="01 — Colour"
      title={
        <>
          One brand colour, used with{' '}
          <span className="text-mint-gradient">discipline</span>
        </>
      }
      description="The full mint ramp. Tier differentiation comes through gradient, glow, and tinted backgrounds — not a second chromatic."
    >
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
        {MINT_RAMP.map((c, i) => (
          <motion.div
            key={c.weight}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex flex-col gap-1.5"
          >
            <div
              className="aspect-square rounded-md border border-[var(--border)] transition-transform duration-base ease-out group-hover:-translate-y-0.5 group-hover:shadow-card-hover"
              style={{ background: c.hex }}
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--mist)]">
              {c.weight}
            </span>
            <span className="font-mono text-[10px] text-[var(--ink-2)]">{c.hex}</span>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Background', token: '--bg', usage: 'Page background' },
          { label: 'Surface', token: '--surface', usage: 'Cards, panels' },
          { label: 'Surface 2', token: '--surface-2', usage: 'Recessed surfaces' },
          { label: 'Ink', token: '--ink', usage: 'Primary text' },
          { label: 'Ink 2', token: '--ink-2', usage: 'Secondary text' },
          { label: 'Mist', token: '--mist', usage: 'Captions, mono labels' },
        ].map((t) => (
          <div
            key={t.token}
            className="flex items-center gap-4 rounded-md border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <span
              aria-hidden
              className="h-10 w-10 shrink-0 rounded-sm border border-[var(--border)]"
              style={{ background: `var(${t.token})` }}
            />
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-[var(--ink)]">{t.label}</span>
              <span className="font-mono text-[11px] text-[var(--mist)]">{t.token}</span>
              <span className="mt-1 text-[11px] text-[var(--ink-2)]">{t.usage}</span>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Typography section
// ────────────────────────────────────────────────────────────────────────────

function TypographySection() {
  return (
    <Section
      eyebrow="02 — Typography"
      title={
        <>
          One sans, one mono, no{' '}
          <span className="text-mint-gradient">serif</span>
        </>
      }
      description="Hierarchy through weight contrast and size, not from typeface family. Geist sans for everything human-readable, Geist Mono for data and labels."
    >
      <div className="space-y-12">
        {[
          { class: 'text-display-xl', size: '72px', weight: 600, sample: 'Display XL' },
          { class: 'text-display-l', size: '56px', weight: 600, sample: 'Display Large' },
          { class: 'text-display-m', size: '44px', weight: 500, sample: 'Display Medium' },
          { class: 'text-display-s', size: '32px', weight: 500, sample: 'Display Small' },
        ].map((t) => (
          <div key={t.size} className="border-t border-[var(--border)] pt-6">
            <div className="mb-3 flex items-center gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--mist)]">
                {t.class}
              </span>
              <span className="font-mono text-[11px] text-[var(--accent)]">
                {t.size} · {t.weight}
              </span>
            </div>
            <p className={`${t.class} text-[var(--ink)]`}>{t.sample}</p>
          </div>
        ))}

        <div className="border-t border-[var(--border)] pt-6">
          <div className="mb-3 flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--mist)]">
              body / 16px
            </span>
            <span className="font-mono text-[11px] text-[var(--accent)]">Geist 400</span>
          </div>
          <p className="max-w-2xl text-[16px] leading-relaxed text-[var(--ink)]">
            Sentence case throughout. Never title case, never all caps. Numbers run in tabular figures: 2026.04.29 · $499 · 47 min — alignment matters when scanning.
          </p>
        </div>

        <div className="border-t border-[var(--border)] pt-6">
          <div className="mb-3 flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--mist)]">
              mono / 13px
            </span>
            <span className="font-mono text-[11px] text-[var(--accent)]">Geist Mono 500</span>
          </div>
          <p className="font-mono text-[13px] text-[var(--ink-2)]">
            EXP-247 · NASDAQ · 2026.Q2 · $10B · 47min · cv11
          </p>
        </div>
      </div>
    </Section>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Components — Buttons & Tags
// ────────────────────────────────────────────────────────────────────────────

function ComponentsSection() {
  return (
    <Section
      eyebrow="03 — Components"
      title={
        <>
          Buttons, tags, indicators —{' '}
          <span className="text-mint-gradient">canonical forms</span>
        </>
      }
      description="One canonical form per component. Variants exist only where they serve a clear behavioural distinction."
    >
      <div className="space-y-12">
        {/* Buttons */}
        <div>
          <h4 className="mb-4 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--mist)]">
            Buttons
          </h4>
          <div className="flex flex-wrap items-center gap-3">
            <button className="rounded-md bg-btn-primary px-5 py-2.5 text-sm font-medium text-white shadow-cta transition-all duration-base ease-out hover:-translate-y-px hover:bg-btn-primary-hover">
              Buy transcript
            </button>
            <button className="rounded-md bg-[var(--ink)] px-5 py-2.5 text-sm font-medium text-[var(--bg)] transition-all duration-base ease-out hover:-translate-y-px hover:bg-[var(--ink-2)]">
              Subscribe
            </button>
            <button className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm font-medium text-[var(--ink)] transition-all duration-base ease-out hover:-translate-y-px hover:border-[var(--accent-border)]">
              Free summary
            </button>
            <button className="group inline-flex items-center gap-1 px-1 py-2.5 text-sm font-medium text-[var(--accent)] transition-colors">
              See all transcripts
              <ArrowRight className="h-4 w-4 transition-transform duration-base ease-out group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Tags */}
        <div>
          <h4 className="mb-4 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--mist)]">
            Tags
          </h4>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-md border border-[var(--accent-border)] bg-[var(--accent-tint)] px-2.5 py-1 font-mono text-[11px] font-medium text-[var(--accent)]">
              Fintech
            </span>
            <span className="inline-flex items-center rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1 font-mono text-[11px] font-medium text-[var(--ink-2)]">
              India
            </span>
            <span className="inline-flex items-center rounded-md border border-[var(--border)] px-2.5 py-1 font-mono text-[11px] font-medium text-[var(--ink-2)]">
              $PAYTM
            </span>
            <span className="inline-flex items-center rounded-md border border-dashed border-[var(--border-2)] px-2.5 py-1 font-mono text-[11px] font-medium text-[var(--mist)]">
              UPI
            </span>
            <span className="inline-flex items-center rounded-md bg-gradient-to-r from-mint-500 to-mint-300 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-mint-900">
              Elite
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--accent-border)] bg-[var(--accent-tint)] px-2.5 py-1 font-mono text-[11px] font-medium text-[var(--accent)]">
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-[var(--accent)] animate-pulse-soft" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              </span>
              Live · 2 days ago
            </span>
          </div>
        </div>

        {/* Source attribution + confidence bar */}
        <div>
          <h4 className="mb-4 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--mist)]">
            AI-era patterns
          </h4>
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] py-1 pl-1 pr-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-mint-500 to-mint-400 text-mint-900">
                <span className="font-mono text-[8px] font-semibold">P</span>
              </span>
              <span className="font-mono text-[11px] font-medium text-[var(--ink)]">EXP-247</span>
              <span className="text-[11px] text-[var(--mist)]">· Payments</span>
            </span>

            <div className="flex items-center gap-3 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2">
              <span className="font-mono text-[11px] text-[var(--mist)]">Confidence</span>
              <div className="h-1.5 w-32 overflow-hidden rounded-full bg-[var(--surface-2)]">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '84%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  className="h-full rounded-full bg-gradient-to-r from-mint-500 to-mint-300"
                />
              </div>
              <span className="font-mono text-[11px] font-medium text-[var(--accent)]">84%</span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Sample transcript cards — Standard + Elite + Compact list
// ────────────────────────────────────────────────────────────────────────────

function CardsSection() {
  return (
    <Section
      eyebrow="04 — Sample cards"
      title={
        <>
          Two tiers, one accent —{' '}
          <span className="text-mint-gradient">single-accent discipline</span>
        </>
      }
      description="Standard tier is dense and clean. Elite tier earns a mint top-bar and tinted background — same colour, more presence."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Standard tier */}
        <motion.article
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="group relative flex flex-col gap-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 transition-shadow duration-base hover:shadow-card-hover"
        >
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--accent-border)] bg-[var(--accent-tint)] px-2.5 py-1 font-mono text-[11px] font-medium text-[var(--accent)]">
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-[var(--accent)] animate-pulse-soft" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              </span>
              Live · 2 days ago
            </span>
          </div>

          <h3 className="text-[20px] leading-[1.3] font-medium text-[var(--ink)] text-balance">
            UPI margin compression and the path to monetisation for India&apos;s payment majors
          </h3>

          <p className="text-[14px] leading-relaxed text-[var(--ink-2)]">
            Former senior product lead at a top-three Indian payments network on the RBI rule change, merchant economics, and what comes after the zero-MDR era.
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[11px] text-[var(--mist)]">
            <span>2026.03.12</span>
            <span>·</span>
            <span>47min</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] py-0.5 pl-0.5 pr-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-mint-500 to-mint-400 text-mint-900">
                <span className="text-[7px] font-semibold">P</span>
              </span>
              <span className="text-[10px] font-medium text-[var(--ink)]">EXP-247</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center rounded-md border border-[var(--accent-border)] bg-[var(--accent-tint)] px-2 py-0.5 font-mono text-[10px] font-medium text-[var(--accent)]">
              Fintech
            </span>
            <span className="inline-flex items-center rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-2 py-0.5 font-mono text-[10px] font-medium text-[var(--ink-2)]">
              India
            </span>
            <span className="inline-flex items-center rounded-md border border-[var(--border)] px-2 py-0.5 font-mono text-[10px] font-medium text-[var(--ink-2)]">
              $PAYTM
            </span>
            <span className="inline-flex items-center rounded-md border border-dashed border-[var(--border-2)] px-2 py-0.5 font-mono text-[10px] font-medium text-[var(--mist)]">
              UPI
            </span>
            <span className="inline-flex items-center rounded-md border border-dashed border-[var(--border-2)] px-2 py-0.5 font-mono text-[10px] font-medium text-[var(--mist)]">
              Zero-MDR
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-[var(--border)] pt-4">
            <div className="flex flex-col gap-0.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--mist)]">
                From
              </span>
              <span className="font-mono text-[20px] font-medium text-[var(--accent)]">$199</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[13px] font-medium text-[var(--ink)] transition-all duration-fast ease-out hover:border-[var(--accent-border)]">
                Free summary
              </button>
              <button className="rounded-md bg-btn-primary px-3.5 py-2 text-[13px] font-medium text-white shadow-cta transition-all duration-fast ease-out hover:-translate-y-px hover:bg-btn-primary-hover">
                Buy transcript
              </button>
            </div>
          </div>
        </motion.article>

        {/* Elite tier */}
        <motion.article
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="group relative flex flex-col gap-4 overflow-hidden rounded-lg border border-[var(--accent-border)] bg-[var(--surface)] p-6 transition-shadow duration-base hover:shadow-card-hover"
          style={{
            backgroundImage:
              'linear-gradient(180deg, var(--accent-tint) 0%, transparent 60%)',
          }}
        >
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mint-500 to-transparent"
          />

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-md bg-gradient-to-r from-mint-500 to-mint-300 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-mint-900">
              Elite · C-suite
            </span>
          </div>

          <h3 className="text-[20px] leading-[1.3] font-medium text-[var(--ink)] text-balance">
            GLP-1 market dynamics — why big pharma&apos;s pricing power is under threat
          </h3>

          <p className="text-[14px] leading-relaxed text-[var(--ink-2)]">
            Former chief commercial officer of a top-10 pharma company breaks down competitive dynamics of the obesity drug market, payer pushback, and what the next eighteen months look like.
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[11px] text-[var(--mist)]">
            <span>2026.03.12</span>
            <span>·</span>
            <span>61min</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] py-0.5 pl-0.5 pr-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-mint-500 to-mint-400 text-mint-900">
                <span className="text-[7px] font-semibold">H</span>
              </span>
              <span className="text-[10px] font-medium text-[var(--ink)]">EXP-118</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center rounded-md border border-[var(--accent-border)] bg-[var(--accent-tint)] px-2 py-0.5 font-mono text-[10px] font-medium text-[var(--accent)]">
              Healthcare
            </span>
            <span className="inline-flex items-center rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-2 py-0.5 font-mono text-[10px] font-medium text-[var(--ink-2)]">
              Americas
            </span>
            <span className="inline-flex items-center rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-2 py-0.5 font-mono text-[10px] font-medium text-[var(--ink-2)]">
              Europe
            </span>
            <span className="inline-flex items-center rounded-md border border-[var(--border)] px-2 py-0.5 font-mono text-[10px] font-medium text-[var(--ink-2)]">
              $LLY
            </span>
            <span className="inline-flex items-center rounded-md border border-[var(--border)] px-2 py-0.5 font-mono text-[10px] font-medium text-[var(--ink-2)]">
              $NVO
            </span>
            <span className="inline-flex items-center rounded-md border border-dashed border-[var(--border-2)] px-2 py-0.5 font-mono text-[10px] font-medium text-[var(--mist)]">
              GLP-1
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-[var(--border)] pt-4">
            <div className="flex flex-col gap-0.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--mist)]">
                From
              </span>
              <span className="font-mono text-[20px] font-medium text-[var(--accent)]">$499</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[13px] font-medium text-[var(--ink)] transition-all duration-fast ease-out hover:border-[var(--accent-border)]">
                Free summary
              </button>
              <button className="rounded-md bg-btn-primary px-3.5 py-2 text-[13px] font-medium text-white shadow-cta transition-all duration-fast ease-out hover:-translate-y-px hover:bg-btn-primary-hover">
                Buy transcript
              </button>
            </div>
          </div>
        </motion.article>
      </div>

      {/* Compact list view */}
      <div className="mt-12">
        <h4 className="mb-4 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--mist)]">
          Compact list · density
        </h4>
        <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)]">
          {[
            {
              avatar: 'T',
              id: 'EXP-302',
              title: 'Apple Q2 2026 — services margin pressure',
              meta: '2026.04.28 · 38min · Former senior, Major iOS Co',
              price: '$199',
              elite: false,
            },
            {
              avatar: 'G',
              id: 'EXP-189',
              title: 'Nvidia GPU supply constraints into 2027',
              meta: '2026.04.22 · 52min · Former director, Major GPU Maker',
              price: '$199',
              elite: false,
            },
            {
              avatar: 'S',
              id: 'EXP-044',
              title: 'Sovereign wealth allocation shifts post-tariffs',
              meta: '2026.04.19 · 71min · Former MD, Major SWF',
              price: '$499',
              elite: true,
            },
          ].map((row, i) => (
            <motion.div
              key={row.id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className={[
                'grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-4 transition-colors duration-fast hover:bg-[var(--surface-2)]',
                i < 2 ? 'border-b border-[var(--border)]' : '',
                row.elite ? 'bg-[var(--accent-tint)]' : '',
              ].join(' ')}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] py-0.5 pl-0.5 pr-2.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-mint-500 to-mint-400 text-mint-900">
                  <span className="font-mono text-[8px] font-semibold">{row.avatar}</span>
                </span>
                <span className="font-mono text-[11px] font-medium text-[var(--ink)]">
                  {row.id}
                </span>
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {row.elite && (
                    <span className="inline-flex items-center rounded-md bg-gradient-to-r from-mint-500 to-mint-300 px-1.5 py-px font-mono text-[9px] font-semibold uppercase tracking-[0.08em] text-mint-900">
                      Elite
                    </span>
                  )}
                  <span className="text-[14px] font-medium leading-tight text-[var(--ink)]">
                    {row.title}
                  </span>
                </div>
                <div className="mt-1 truncate font-mono text-[11px] text-[var(--mist)]">
                  {row.meta}
                </div>
              </div>
              <span className="font-mono text-[15px] font-medium text-[var(--accent)]">
                {row.price}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Pillars
// ────────────────────────────────────────────────────────────────────────────

function PillarsSection() {
  const pillars = [
    {
      icon: Sparkles,
      title: 'Single-accent discipline',
      desc: 'One mint accent, used across the system at varying intensities. Fewer rules. More confidence.',
    },
    {
      icon: ShieldCheck,
      title: 'Anonymized always',
      desc: 'Every expert ID is `EXP-001`. We never name the company they came from. Trust is the product.',
    },
    {
      icon: Zap,
      title: 'Built for 2× readers',
      desc: 'Tabular figures, sentence case, hairline borders. Information density without noise.',
    },
    {
      icon: FileText,
      title: 'Lexical first',
      desc: 'Markdown-native authoring. Streams into LLMs cleanly. Citation-ready by default.',
    },
    {
      icon: Brain,
      title: 'AI-era affordances',
      desc: 'Source attribution chips, confidence bars, command palette — visible cues your buyers expect.',
    },
    {
      icon: Lock,
      title: 'Dark-mode native',
      desc: 'Designed for late-night reading. Light mode toggles cleanly without re-skinning the brand.',
    },
  ]

  return (
    <Section
      eyebrow="05 — Why this direction"
      title={
        <>
          The brand reads as confident because it&apos;s not trying to do{' '}
          <span className="text-mint-gradient">five things at once</span>
        </>
      }
      description="Six operating principles that shape every visual and interaction decision."
    >
      <div className="grid gap-px overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
        {pillars.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex flex-col gap-3 bg-[var(--bg)] p-6 transition-colors duration-base hover:bg-[var(--surface)]"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[var(--accent-border)] bg-[var(--accent-tint)] text-[var(--accent)] transition-all duration-base group-hover:border-[var(--accent)] group-hover:shadow-cta">
              <p.icon className="h-4 w-4" />
            </span>
            <h4 className="text-[15px] font-medium text-[var(--ink)]">{p.title}</h4>
            <p className="text-[13px] leading-relaxed text-[var(--ink-2)]">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Final CTA band
// ────────────────────────────────────────────────────────────────────────────

function CTABand() {
  return (
    <section className="relative isolate overflow-hidden py-32">
      <div aria-hidden className="absolute inset-0 -z-10 bg-hero-glow opacity-80" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-hero-grid mask-fade-y" />
      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-[44px] leading-[1.1] tracking-[-0.03em] text-[var(--ink)] font-medium sm:text-[56px] sm:leading-[1.05] sm:tracking-[-0.035em] sm:font-semibold text-balance"
        >
          The visual system,{' '}
          <span className="text-mint-gradient">live and ready</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-[var(--ink-2)]"
        >
          This is a Phase C demo. Marketing pages, product pages, and the reader experience get built on top of these tokens in Phase D and beyond.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="/admin"
            className="group inline-flex items-center gap-2 rounded-md bg-btn-primary px-5 py-3 text-sm font-medium text-white shadow-cta transition-all duration-base ease-out hover:-translate-y-px hover:bg-btn-primary-hover"
          >
            Open admin
            <ArrowRight className="h-4 w-4 transition-transform duration-base ease-out group-hover:translate-x-0.5" />
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm font-medium text-[var(--ink)] transition-all duration-base ease-out hover:-translate-y-px hover:border-[var(--accent-border)]"
          >
            Try the dark / light toggle ↗
          </a>
        </motion.div>
      </div>
    </section>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Page
// ────────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <Hero />
      <ColorSection />
      <TypographySection />
      <ComponentsSection />
      <CardsSection />
      <PillarsSection />
      <CTABand />
    </>
  )
}
