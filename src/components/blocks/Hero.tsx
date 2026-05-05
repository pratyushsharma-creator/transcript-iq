'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import Link from 'next/link'
import { SectionShell, MintGradientHeading } from './SectionShell'
import { CTAButtons } from './CTAButtons'
import { ComplianceBadgePill } from './shared/ComplianceBadgePill'

// ── Types ──────────────────────────────────────────────────────────────────────

type HeroBlock = {
  blockType: 'hero'
  variant?: 'split' | 'center' | 'massive' | 'fullBleed' | 'mockup' | 'animated' | 'spotlight' | 'stencil'
  eyebrow?: string
  eyebrowStyle?: 'pulse' | 'mono' | 'none'
  heading: string
  subheading?: string
  ctas?: Array<{ label: string; url: string; variant?: 'primary' | 'secondary' | 'ghost' | 'tertiary'; magnetic?: boolean }>
  visual?: {
    image?: { url?: string; alt?: string }
    video?: string
    mockupType?: 'callRecording' | 'transcriptPreview' | 'dashboardPreview' | 'chartPreview'
    animatedDiagram?: 'network' | 'dataFlow' | 'pulseRings' | 'soundwave'
  }
  stats?: Array<{ label: string; value: string }>
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

// ══════════════════════════════════════════════════════════════════════════════
// Stencil variant — full-width, left-aligned, 3-line heading + slim stats bar
// Matches the HTML prototype exactly.
// ══════════════════════════════════════════════════════════════════════════════

function StencilHero({ block }: { block: HeroBlock }) {
  // Split heading on \n:
  //   line1 → ghost / stencil (transparent fill, white outline)
  //   line2 → solid white
  //   line3 → italic accent-green
  const lines = block.heading.replace(/\*\*/g, '').split(/\n/)
  const line1 = lines[0] ?? ''
  const line2 = lines[1] ?? ''
  const line3 = lines[2] ?? ''

  const primaryCta   = block.ctas?.find((c) => c.variant === 'primary')
  const secondaryCta = block.ctas?.find((c) => c.variant === 'secondary')
  const stats        = block.stats ?? []

  const ease = [0.22, 1, 0.36, 1] as const

  return (
    <>
      <style>{`
        @keyframes stencil-orb-drift {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(14px,18px) scale(1.03); }
        }
        @keyframes stencil-eyebrow-pulse {
          0%,100% { opacity: 1; }
          50%      { opacity: .25; }
        }
      `}</style>

      {/* ── Hero section ── */}
      <section
        id={block.anchorId ?? undefined}
        className="relative overflow-hidden"
        style={{ background: 'var(--bg)', minHeight: 'calc(100vh - 56px)' }}
      >
        {/* Ambient orbs — spread full width since there is no right-side graphic */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
          <div style={{
            position: 'absolute', width: 900, height: 900, borderRadius: '50%',
            filter: 'blur(110px)',
            background: 'radial-gradient(circle, rgba(52,211,153,.22) 0%, transparent 68%)',
            top: -320, right: -200,
            animation: 'stencil-orb-drift ease-in-out 30s infinite alternate',
          }} />
          <div style={{
            position: 'absolute', width: 600, height: 600, borderRadius: '50%',
            filter: 'blur(110px)',
            background: 'radial-gradient(circle, rgba(16,185,129,.16) 0%, transparent 70%)',
            bottom: 0, left: -160,
            animation: 'stencil-orb-drift ease-in-out 38s infinite alternate',
            animationDelay: '-16s',
          }} />
          <div style={{
            position: 'absolute', width: 400, height: 400, borderRadius: '50%',
            filter: 'blur(110px)',
            background: 'radial-gradient(circle, rgba(52,211,153,.12) 0%, transparent 70%)',
            top: '30%', left: '40%',
            animation: 'stencil-orb-drift ease-in-out 45s infinite alternate',
            animationDelay: '-22s',
          }} />
        </div>

        {/* Grid line overlay — centred mask, full width */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            zIndex: 0,
            backgroundImage:
              'linear-gradient(var(--grid-line) 1px, transparent 1px),' +
              'linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            maskImage: 'radial-gradient(ellipse 90% 80% at 50% 40%, black 10%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 40%, black 10%, transparent 80%)',
            opacity: 0.8,
          }}
        />

        {/* ── Copy — left-aligned, max-width container ── */}
        <div
          className="relative mx-auto max-w-[1280px] px-5 pt-10 pb-10 sm:px-8 sm:pt-14 sm:pb-12 lg:px-12 lg:pt-20 lg:pb-18"
          style={{ zIndex: 1 }}
        >
          {/* Eyebrow pill */}
          {block.eyebrow && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease }}
              className="inline-flex items-center gap-2 rounded-full font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]"
              style={{
                padding: '5px 16px',
                background: 'var(--accent-tint)',
                border: '1px solid var(--accent-border)',
                marginBottom: 40,
              }}
            >
              <span
                className="h-[5px] w-[5px] rounded-full bg-[var(--accent)]"
                style={{ animation: 'stencil-eyebrow-pulse 2.4s infinite' }}
              />
              {block.eyebrow}
            </motion.div>
          )}

          {/* ── 3-line heading ── */}
          <div style={{ marginBottom: 36 }}>
            {line1 && (
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.05, ease }}
                style={{
                  fontSize: 'clamp(56px, 8.5vw, 128px)',
                  fontWeight: 700,
                  letterSpacing: '-0.055em',
                  lineHeight: 0.91,
                  color: 'var(--ink)',
                }}
              >
                {line1}
              </motion.span>
            )}

            {line2 && (
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.12, ease }}
                style={{
                  fontSize: 'clamp(56px, 8.5vw, 128px)',
                  fontWeight: 700,
                  letterSpacing: '-0.055em',
                  lineHeight: 0.91,
                  color: 'var(--ink)',
                }}
              >
                {line2}
              </motion.span>
            )}

            {line3 && (
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.19, ease }}
                style={{
                  fontSize: 'clamp(56px, 8.5vw, 128px)',
                  fontWeight: 700,
                  letterSpacing: '-0.055em',
                  lineHeight: 1.0,
                  color: 'var(--accent)',
                  fontStyle: 'italic',
                }}
              >
                {line3}
              </motion.span>
            )}
          </div>

          {/* Subheading */}
          {block.subheading && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.19, ease }}
              style={{
                fontSize: 18,
                lineHeight: 1.70,
                maxWidth: 680,
                marginBottom: 44,
                fontWeight: 400,
                color: 'var(--ink-2)',
              }}
            >
              {block.subheading}
            </motion.p>
          )}

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.26, ease }}
            className="flex flex-wrap gap-3"
          >
            {primaryCta && (
              <Link
                href={primaryCta.url}
                className="group inline-flex items-center gap-[9px] rounded-[11px] bg-btn-primary px-[30px] py-[14px] text-[15px] font-semibold text-btn-primary-fg transition-all duration-200 hover:-translate-y-px hover:bg-btn-primary-hover"
                style={{
                  letterSpacing: '-0.01em',
                  boxShadow: '0 0 0 1px var(--accent-border), 0 8px 28px -8px var(--accent-glow)',
                }}
              >
                <svg
                  width="14" height="14" viewBox="0 0 13 13"
                  fill="none" stroke="currentColor" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  <path d="M2 6.5h9M7.5 2.5l4 4-4 4" />
                </svg>
                {primaryCta.label}
              </Link>
            )}
            {secondaryCta && (
              <Link
                href={secondaryCta.url}
                className="inline-flex items-center rounded-[11px] border border-[var(--border-2)] px-[26px] py-[14px] text-[15px] font-medium text-[var(--ink-2)] transition-all duration-200 hover:-translate-y-px hover:border-[var(--border)] hover:bg-[var(--surface-2)]"
                style={{ letterSpacing: '-0.01em', background: 'transparent' }}
              >
                {secondaryCta.label}
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Slim stats bar — sits directly below hero, full-width border-top ── */}
      {stats.length > 0 && (
        <div
          style={{
            position: 'relative', zIndex: 1,
            borderTop: '1px solid var(--border)',
            background: 'color-mix(in srgb, var(--bg) 85%, transparent)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <motion.div
            className="mx-auto max-w-[1280px] px-5 py-5 sm:px-8 lg:px-12 lg:py-[22px] grid grid-cols-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {stats.map((s, i) => (
              <div
                key={i}
                className="px-4 lg:px-8"
                style={{
                  borderRight: i < stats.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                <div
                  className="font-mono uppercase"
                  style={{ fontSize: 8, letterSpacing: '.14em', color: 'var(--mist)', marginBottom: 4 }}
                >
                  {s.label}
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
                  {s.value}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      )}
    </>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// Classic variant — split layout with right-side visual / mockup (original)
// ══════════════════════════════════════════════════════════════════════════════

function ClassicHero({ block }: { block: HeroBlock }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y       = useTransform(scrollYProgress, [0, 1], [0, 100])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const variant   = block.variant ?? 'split'
  const isCentered = variant === 'center' || variant === 'massive'
  const headingSize =
    variant === 'massive'
      ? 'text-[56px] sm:text-[80px] lg:text-[112px] leading-[0.95] tracking-[-0.045em] font-semibold'
      : 'text-[44px] sm:text-[56px] lg:text-[72px] leading-[1.05] lg:leading-none tracking-[-0.04em] font-semibold'

  const showVisual = ['split', 'mockup', 'animated', 'fullBleed'].includes(variant) && block.visual
  const isSplit   = variant === 'split' || variant === 'mockup' || variant === 'animated'

  return (
    <div ref={ref}>
      <SectionShell
        background={block.background ?? 'glow'}
        spacing={block.spacing ?? 'spacious'}
        anchorId={block.anchorId}
      >
        {(block.background === 'glow' || !block.background) && (
          <div aria-hidden className="absolute inset-0 -z-10 bg-hero-grid mask-fade-y" />
        )}

        <motion.div style={{ y, opacity }} className="w-full">
          <div className={isSplit ? 'grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]' : ''}>
            <div className={isCentered ? 'mx-auto max-w-3xl text-center' : ''}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <Eyebrow text={block.eyebrow} style={block.eyebrowStyle} />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={`${block.eyebrow ? 'mt-6' : 'mt-0'} ${isCentered ? 'mx-auto max-w-4xl' : 'max-w-4xl'} text-[var(--ink)] text-balance ${headingSize}`}
              >
                <MintGradientHeading text={block.heading} />
              </motion.h1>

              {block.subheading && (
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  className={`mt-6 ${isCentered ? 'mx-auto' : ''} max-w-2xl text-[18px] leading-relaxed text-[var(--ink-2)] lg:text-[20px]`}
                >
                  {block.subheading}
                </motion.p>
              )}

              {block.ctas && block.ctas.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
                  className={`mt-10 flex flex-wrap items-center gap-3 ${isCentered ? 'justify-center' : ''}`}
                >
                  <CTAButtons ctas={block.ctas} />
                </motion.div>
              )}
            </div>

            {showVisual && isSplit && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative mx-auto aspect-[4/3] w-full max-w-[560px] rounded-2xl overflow-hidden glass"
              >
                <HeroVisual visual={block.visual!} variant={variant} />
              </motion.div>
            )}
          </div>

          {block.stats && block.stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className={`mt-16 grid grid-cols-2 gap-x-10 gap-y-6 border-t border-[var(--border)] pt-10 ${
                block.stats.length <= 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-4 lg:grid-cols-' + block.stats.length
              }`}
            >
              {block.stats.map((m, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--mist)]">{m.label}</span>
                  <span className="text-[13px] font-medium text-[var(--ink)]">{m.value}</span>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </SectionShell>
    </div>
  )
}

// ── Eyebrow (used by ClassicHero) ──────────────────────────────────────────────

function Eyebrow({ text, style }: { text?: string; style?: 'pulse' | 'mono' | 'none' }) {
  if (!text || style === 'none') return null
  if (style === 'mono') {
    return (
      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--accent)]">
        {text}
      </span>
    )
  }
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-border)] bg-[var(--accent-tint)] px-3 py-1 text-[11px] font-mono font-medium uppercase tracking-[0.12em] text-[var(--accent)]">
      <span className="relative inline-flex h-1.5 w-1.5">
        <span className="absolute inset-0 rounded-full bg-[var(--accent)] animate-pulse-soft" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
      </span>
      {text}
    </div>
  )
}

// ── Visual panel (used by ClassicHero) ────────────────────────────────────────

function HeroVisual({
  visual,
  variant,
}: {
  visual: NonNullable<HeroBlock['visual']>
  variant: HeroBlock['variant']
}) {
  if (variant === 'mockup' && visual.mockupType === 'callRecording') return <CallRecordingMockup />
  if (variant === 'mockup') return <GenericMockup label={visual.mockupType ?? 'transcriptPreview'} />
  if (variant === 'animated' || variant === 'split') {
    if (visual.image?.url) {
      return <Image src={visual.image.url} alt={visual.image.alt ?? ''} fill className="object-cover" priority />
    }
    return <AbstractGraphic />
  }
  return <AbstractGraphic />
}

function CallRecordingMockup() {
  return (
    <div className="absolute inset-0 flex flex-col bg-[var(--surface)] p-5 text-[12px]">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--accent)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse-soft" />
          Recording · 47:21
        </span>
        <span className="font-mono text-[10px] text-[var(--mist)]">EXP-247</span>
      </div>
      <div className="mt-3 space-y-3 overflow-hidden">
        <div className="flex gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--mist)] mt-0.5 w-16 shrink-0">Analyst</span>
          <p className="text-[var(--ink)] leading-relaxed text-[12px]">What's the realistic margin trajectory after the RBI rule change?</p>
        </div>
        <div className="flex gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--accent)] mt-0.5 w-16 shrink-0">Expert</span>
          <p className="text-[var(--ink)] leading-relaxed text-[12px]">In our internal modelling, take rate compresses 18-22 bps over the next four quarters before stabilising…</p>
        </div>
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-4">
        <ComplianceBadgePill label="MNPI Screened" />
        <ComplianceBadgePill label="PII Redacted" />
        <ComplianceBadgePill label="Anonymised" />
      </div>
    </div>
  )
}

function GenericMockup({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface)]">
      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--mist)]">{label}</span>
    </div>
  )
}

function AbstractGraphic() {
  return <div className="absolute inset-0 bg-variant-mesh opacity-60" />
}

// ══════════════════════════════════════════════════════════════════════════════
// Main renderer — routes to the correct variant component
// Hooks are never called conditionally; each sub-component owns its own hooks.
// ══════════════════════════════════════════════════════════════════════════════

export function HeroBlockRenderer({ block }: { block: HeroBlock }) {
  if (block.variant === 'stencil') return <StencilHero block={block} />
  return <ClassicHero block={block} />
}
