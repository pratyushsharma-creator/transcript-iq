'use client'

import { motion } from 'motion/react'
import * as Lucide from 'lucide-react'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { SectionShell, SectionHeader, MintGradientHeading } from './SectionShell'
import { CTAButtons } from './CTAButtons'

function getIcon(name?: string) {
  if (!name) return Lucide.Sparkles
  const variants = [
    name.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(''),
    name.charAt(0).toUpperCase() + name.slice(1),
  ]
  for (const v of variants) {
    const I = (Lucide as never as Record<string, React.ComponentType<{ className?: string }>>)[v]
    if (I) return I
  }
  return Lucide.Sparkles
}

function hoverClass(effect?: string) {
  switch (effect) {
    case 'lift': return 'card-hover-lift'
    case 'moving-border': return 'card-hover-border card-hover-lift'
    case 'spotlight': return 'card-hover-spotlight card-hover-lift'
    default: return ''
  }
}

function SpotlightCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      el.style.setProperty('--spotlight-x', `${e.clientX - rect.left}px`)
      el.style.setProperty('--spotlight-y', `${e.clientY - rect.top}px`)
    }
    el.addEventListener('pointermove', onMove)
    return () => el.removeEventListener('pointermove', onMove)
  }, [])
  return <div ref={ref} className={className}>{children}</div>
}

// ── FeatureGrid ──────────────────────────────────────────────────────────

type FeatureGridBlock = {
  blockType: 'featureGrid'
  eyebrow?: string
  heading?: string
  description?: string
  columns?: '2' | '3' | '4'
  cardStyle?: 'hairline' | 'filled' | 'borderless' | 'editorial'
  cardHover?: 'none' | 'lift' | 'moving-border' | 'spotlight'
  features?: Array<{ icon?: string; title: string; description?: string; href?: string }>
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function FeatureGridRenderer({ block }: { block: FeatureGridBlock }) {
  const cols = block.columns ?? '3'
  const cardStyle = block.cardStyle ?? 'hairline'
  const cardClasses =
    cardStyle === 'filled'
      ? 'bg-[var(--surface)] border border-[var(--border)]'
      : cardStyle === 'borderless'
      ? ''
      : 'border border-[var(--border)]'
  const hover = hoverClass(block.cardHover)
  const isSpotlight = block.cardHover === 'spotlight'

  // ── Editorial variant — long-form per persona ──────────────────────────
  if (cardStyle === 'editorial') {
    return (
      <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
        <SectionHeader
          eyebrow={block.eyebrow}
          heading={block.heading ? <MintGradientHeading text={block.heading} /> : undefined}
          description={block.description}
        />
        <div className="mx-auto max-w-5xl space-y-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)]">
          {(block.features ?? []).map((f, i) => {
            const Icon = getIcon(f.icon)
            const isEven = i % 2 === 0
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative grid items-start gap-6 bg-[var(--bg)] p-8 transition-colors duration-base hover:bg-[var(--surface)] sm:gap-10 sm:p-10 lg:grid-cols-[180px_1fr_auto] ${isEven ? '' : ''}`}
              >
                {/* Massive index number */}
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[64px] sm:text-[88px] leading-none font-semibold tracking-[-0.04em] text-[var(--accent)] opacity-60 transition-opacity duration-base group-hover:opacity-100">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="hidden h-px w-10 self-center bg-[var(--accent)] opacity-30 sm:block" />
                </div>
                {/* Title + body */}
                <div className="flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[var(--accent-border)] bg-[var(--accent-tint)] text-[var(--accent)]">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <h3 className="text-[20px] sm:text-[24px] leading-[1.2] tracking-[-0.015em] font-medium text-[var(--ink)]">
                      {f.title}
                    </h3>
                  </div>
                  {f.description && (
                    <p className="mt-3 max-w-xl text-[14px] sm:text-[15px] leading-relaxed text-[var(--ink-2)]">
                      {f.description}
                    </p>
                  )}
                </div>
                {/* Trailing arrow on hover */}
                {f.href && (
                  <span className="hidden self-center text-[var(--accent)] opacity-0 transition-opacity duration-base group-hover:opacity-100 lg:inline-flex">
                    →
                  </span>
                )}
              </motion.div>
            )
          })}
        </div>
      </SectionShell>
    )
  }

  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
      <SectionHeader
        eyebrow={block.eyebrow}
        heading={block.heading ? <MintGradientHeading text={block.heading} /> : undefined}
        description={block.description}
      />
      <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-${cols}`}>
        {(block.features ?? []).map((f, i) => {
          const Icon = getIcon(f.icon)
          const inner = (
            <>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--accent-border)] bg-[var(--accent-tint)] text-[var(--accent)]">
                <Icon className="h-4 w-4" />
              </span>
              <h3 className="text-[16px] font-medium text-[var(--ink)]">{f.title}</h3>
              {f.description && (
                <p className="text-[13px] leading-relaxed text-[var(--ink-2)]">{f.description}</p>
              )}
            </>
          )
          const cardCls = `relative flex flex-col gap-3 rounded-lg p-6 ${cardClasses} ${hover}`
          const Wrap = isSpotlight ? SpotlightCard : 'div'
          const content = (
            <Wrap className={cardCls}>
              {inner}
            </Wrap>
          )
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              {f.href ? (
                <Link href={f.href} className="block">
                  {content}
                </Link>
              ) : (
                content
              )}
            </motion.div>
          )
        })}
      </div>
    </SectionShell>
  )
}

// ── FeatureSplit (zigzag) ─────────────────────────────────────────────────

type FeatureSplitBlock = {
  blockType: 'featureSplit'
  eyebrow?: string
  heading?: string
  description?: string
  rows?: Array<{
    eyebrow?: string
    title: string
    body?: string
    image?: { url?: string; alt?: string }
    imageSide?: 'auto' | 'right' | 'left'
    tintBackground?: boolean
    ctas?: Array<{ label: string; url: string; variant?: string; magnetic?: boolean }>
  }>
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function FeatureSplitRenderer({ block }: { block: FeatureSplitBlock }) {
  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
      <SectionHeader
        eyebrow={block.eyebrow}
        heading={block.heading ? <MintGradientHeading text={block.heading} /> : undefined}
        description={block.description}
      />
      <div className="space-y-24">
        {(block.rows ?? []).map((r, i) => {
          const side = r.imageSide ?? 'auto'
          const imageRight = side === 'right' || (side === 'auto' && i % 2 === 0)
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`relative grid items-center gap-12 lg:grid-cols-2 ${r.tintBackground ? 'rounded-2xl bg-[var(--accent-tint)] p-8 lg:p-12' : ''}`}
            >
              <div className={imageRight ? 'order-1' : 'order-1 lg:order-2'}>
                {r.eyebrow && (
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--accent)]">
                    {r.eyebrow}
                  </span>
                )}
                <h3 className="mt-3 text-[28px] sm:text-[36px] leading-[1.15] tracking-[-0.025em] font-medium text-[var(--ink)] text-balance">
                  <MintGradientHeading text={r.title} />
                </h3>
                {r.body && (
                  <p className="mt-4 text-[16px] leading-relaxed text-[var(--ink-2)]">{r.body}</p>
                )}
                {r.ctas && r.ctas.length > 0 && (
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <CTAButtons ctas={r.ctas as never} />
                  </div>
                )}
              </div>
              <div className={`${imageRight ? 'order-2' : 'order-2 lg:order-1'}`}>
                <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                  {r.image?.url ? (
                    <img src={r.image.url} alt={r.image.alt ?? ''} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-variant-mesh">
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--mist)]">[Image]</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </SectionShell>
  )
}

// ── FeatureBento (Apple-style) ────────────────────────────────────────────

type FeatureBentoBlock = {
  blockType: 'featureBento'
  eyebrow?: string
  heading?: string
  description?: string
  layout?: '2-col-mixed' | '3-col-mixed' | 'hero-and-quad' | 'asymmetric'
  cardHover?: 'none' | 'lift' | 'moving-border' | 'spotlight'
  tiles?: Array<{
    span?: '1' | '2' | 'tall' | 'hero'
    eyebrow?: string
    title: string
    description?: string
    image?: { url?: string; alt?: string }
    tone?: 'neutral' | 'mint' | 'ink' | 'mesh'
    href?: string
  }>
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

const TONE_BG: Record<string, string> = {
  neutral: 'bg-[var(--surface)]',
  mint: 'bg-[var(--accent-tint)]',
  ink: 'bg-[var(--ink)] text-[var(--bg)]',
  mesh: 'bg-variant-mesh',
}

const SPAN_CLASS: Record<string, string> = {
  '1': 'col-span-1 row-span-1',
  '2': 'col-span-1 lg:col-span-2 row-span-1',
  tall: 'col-span-1 row-span-1 lg:row-span-2',
  hero: 'col-span-1 lg:col-span-2 row-span-1 lg:row-span-2',
}

export function FeatureBentoRenderer({ block }: { block: FeatureBentoBlock }) {
  const layout = block.layout ?? '3-col-mixed'
  const cols = layout === '2-col-mixed' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
  const hover = hoverClass(block.cardHover)
  const isSpotlight = block.cardHover === 'spotlight'

  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
      <SectionHeader
        eyebrow={block.eyebrow}
        heading={block.heading ? <MintGradientHeading text={block.heading} /> : undefined}
        description={block.description}
      />
      <div className={`grid gap-4 ${cols}`} style={{ gridAutoRows: '180px' }}>
        {(block.tiles ?? []).map((t, i) => {
          const span = SPAN_CLASS[t.span ?? '1']
          const tone = TONE_BG[t.tone ?? 'neutral']
          const isInk = t.tone === 'ink'
          const inner = (
            <>
              {t.image?.url && (
                <div className="absolute inset-0 -z-10">
                  <img src={t.image.url} alt={t.image.alt ?? ''} className="h-full w-full object-cover opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/80 via-transparent to-transparent" />
                </div>
              )}
              {t.eyebrow && (
                <span className={`font-mono text-[10px] uppercase tracking-[0.12em] ${isInk ? 'text-[var(--accent-bright)]' : 'text-[var(--accent)]'}`}>
                  {t.eyebrow}
                </span>
              )}
              <h3 className={`mt-2 text-[18px] sm:text-[22px] font-medium leading-[1.2] text-balance ${isInk ? 'text-[var(--bg)]' : 'text-[var(--ink)]'}`}>
                {t.title}
              </h3>
              {t.description && (
                <p className={`mt-2 text-[13px] leading-relaxed ${isInk ? 'text-[var(--bg)]/80' : 'text-[var(--ink-2)]'}`}>
                  {t.description}
                </p>
              )}
            </>
          )
          const cardCls = `relative flex flex-col rounded-2xl border border-[var(--border)] p-6 overflow-hidden ${tone} ${span} ${hover}`
          const Wrap = isSpotlight ? SpotlightCard : 'div'
          const content = (
            <Wrap className={cardCls}>
              {inner}
            </Wrap>
          )
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className={span}
            >
              {t.href ? <Link href={t.href}>{content}</Link> : content}
            </motion.div>
          )
        })}
      </div>
    </SectionShell>
  )
}

// ── FeatureSpotlight ──────────────────────────────────────────────────────

type FeatureSpotlightBlock = {
  blockType: 'featureSpotlight'
  eyebrow?: string
  heading?: string
  description?: string
  spotlight?: {
    title: string
    description?: string
    image?: { url?: string }
    ctas?: Array<{ label: string; url: string; variant?: string; magnetic?: boolean }>
  }
  supporting?: Array<{ icon?: string; title: string; description?: string }>
  cardHover?: 'none' | 'lift' | 'moving-border' | 'spotlight'
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function FeatureSpotlightRenderer({ block }: { block: FeatureSpotlightBlock }) {
  const hover = hoverClass(block.cardHover ?? 'lift')
  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
      <SectionHeader
        eyebrow={block.eyebrow}
        heading={block.heading ? <MintGradientHeading text={block.heading} /> : undefined}
        description={block.description}
      />
      {block.spotlight && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative grid items-stretch gap-0 overflow-hidden rounded-2xl border border-[var(--accent-border)] lg:grid-cols-[1.2fr_1fr]"
          style={{
            backgroundImage:
              'linear-gradient(135deg, var(--accent-tint) 0%, transparent 50%), linear-gradient(180deg, var(--surface) 0%, var(--bg) 100%)',
          }}
        >
          {/* Mint accent stripe at the top */}
          <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mint-500 to-transparent" />

          {/* LEFT — narrative + CTAs */}
          <div className="relative flex flex-col justify-between gap-8 p-8 lg:p-12">
            <div>
              <h3 className="text-[28px] sm:text-[40px] leading-[1.1] tracking-[-0.03em] font-semibold text-[var(--ink)] text-balance">
                <MintGradientHeading text={block.spotlight.title} />
              </h3>
              {block.spotlight.description && (
                <p className="mt-5 text-[15px] sm:text-[16px] leading-relaxed text-[var(--ink-2)]">{block.spotlight.description}</p>
              )}
            </div>
            {block.spotlight.ctas && block.spotlight.ctas.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 border-t border-[var(--border)] pt-6">
                <CTAButtons ctas={block.spotlight.ctas as never} />
              </div>
            )}
          </div>

          {/* RIGHT — visual: pricing card with checkmark feature list */}
          <div className="relative flex flex-col justify-center border-t border-[var(--border)] bg-[var(--surface)] p-8 lg:border-l lg:border-t-0 lg:p-10">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--accent)]">
              Custom Transcript
            </span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-[40px] sm:text-[56px] leading-none font-semibold tabular-nums text-[var(--ink)]">$599</span>
              <span className="text-[13px] text-[var(--mist)]">per transcript · one-time fee</span>
            </div>
            <ul className="mt-6 space-y-2.5">
              {[
                '1 expert call with vetted industry specialist',
                'Custom discussion guide built for your topic',
                'MNPI-screened & PII-redacted transcript',
                'Full editorial review and formatting',
                'Tagged with companies, keywords, metadata',
                'Delivered in as low as 36 hours',
              ].map((line, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-2.5 text-[13px] text-[var(--ink-2)]"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    className="mt-0.5 shrink-0 text-[var(--accent)]"
                  >
                    <circle cx="7" cy="7" r="6" fill="var(--accent-tint)" stroke="currentColor" strokeWidth="1" />
                    <path d="M4.5 7L6 8.5L9.5 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {line}
                </motion.li>
              ))}
            </ul>
            <p className="mt-5 border-t border-[var(--border)] pt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--mist)]">
              Volume pricing from $499/transcript for 5+ commissions
            </p>
          </div>
        </motion.div>
      )}
      {block.supporting && block.supporting.length > 0 && (
        <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-3">
          {block.supporting.map((s, i) => {
            const Icon = getIcon(s.icon)
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex flex-col gap-3 bg-[var(--bg)] p-7 transition-colors duration-base hover:bg-[var(--surface)]"
              >
                <div className="flex items-start justify-between">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--accent-border)] bg-[var(--accent-tint)] text-[var(--accent)] transition-all duration-base group-hover:shadow-cta">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="font-mono text-[40px] leading-none font-semibold tracking-[-0.04em] text-[var(--accent)] opacity-25">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h4 className="text-[16px] font-medium text-[var(--ink)] leading-[1.3]">{s.title}</h4>
                {s.description && <p className="text-[13px] leading-relaxed text-[var(--ink-2)]">{s.description}</p>}
              </motion.div>
            )
          })}
        </div>
      )}
    </SectionShell>
  )
}

// ── FeatureTabs ───────────────────────────────────────────────────────────

type FeatureTabsBlock = {
  blockType: 'featureTabs'
  eyebrow?: string
  heading?: string
  description?: string
  tabs?: Array<{
    tabLabel: string
    icon?: string
    panelTitle: string
    panelBody?: string
    panelImage?: { url?: string }
    ctas?: Array<{ label: string; url: string; variant?: string; magnetic?: boolean }>
  }>
  orientation?: 'horizontal' | 'vertical'
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function FeatureTabsRenderer({ block }: { block: FeatureTabsBlock }) {
  const tabs = block.tabs ?? []
  const [active, setActive] = useState(0)
  const orientation = block.orientation ?? 'horizontal'

  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
      <SectionHeader
        eyebrow={block.eyebrow}
        heading={block.heading ? <MintGradientHeading text={block.heading} /> : undefined}
        description={block.description}
      />
      <div className={orientation === 'vertical' ? 'grid gap-8 lg:grid-cols-[260px_1fr]' : ''}>
        <div className={orientation === 'horizontal' ? 'flex flex-wrap gap-2 border-b border-[var(--border)]' : 'flex flex-col gap-1'}>
          {tabs.map((t, i) => {
            const Icon = getIcon(t.icon)
            const isActive = i === active
            return (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-[13px] font-medium transition-colors duration-fast ${
                  isActive
                    ? 'bg-[var(--accent-tint)] text-[var(--accent)] border border-[var(--accent-border)]'
                    : 'text-[var(--ink-2)] hover:bg-[var(--surface)]'
                } ${orientation === 'horizontal' && isActive ? '-mb-px border-b-[var(--accent-border)]' : ''}`}
              >
                {t.icon && <Icon className="h-4 w-4" />}
                {t.tabLabel}
              </button>
            )
          })}
        </div>
        {tabs[active] && (
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={orientation === 'horizontal' ? 'mt-8 grid items-center gap-8 lg:grid-cols-2' : 'grid items-center gap-8 lg:grid-cols-2'}
          >
            <div>
              <h3 className="text-[22px] font-medium text-[var(--ink)] leading-[1.2]">{tabs[active].panelTitle}</h3>
              {tabs[active].panelBody && (
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink-2)]">{tabs[active].panelBody}</p>
              )}
              {tabs[active].ctas && (
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <CTAButtons ctas={tabs[active].ctas as never} />
                </div>
              )}
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-xl border border-[var(--border)] bg-variant-mesh">
              {tabs[active].panelImage?.url && (
                <img src={tabs[active].panelImage!.url} alt="" className="h-full w-full object-cover" />
              )}
            </div>
          </motion.div>
        )}
      </div>
    </SectionShell>
  )
}
