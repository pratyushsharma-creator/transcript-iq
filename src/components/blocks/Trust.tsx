'use client'

import Image from 'next/image'
import { motion, useInView, useMotionValue, useTransform, animate } from 'motion/react'
import { useEffect, useRef } from 'react'
import { SectionShell, SectionHeader, MintGradientHeading } from './SectionShell'
import { CTAButtons } from './CTAButtons'
import { ComplianceBadgePill } from './shared/ComplianceBadgePill'
import { ShieldCheck, Lock, UserX, FileText, CheckCircle, Eye } from 'lucide-react'
import { NumberTicker } from '@/components/ui/number-ticker'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  'shield-check': ShieldCheck,
  lock: Lock,
  'user-x': UserX,
  'file-text': FileText,
  'check-circle': CheckCircle,
  eye: Eye,
}

// ── ComplianceBadgeRow ────────────────────────────────────────────────────

type BadgeRowBlock = {
  blockType: 'complianceBadgeRow'
  eyebrow?: string
  heading?: string
  badges?: string[]
  alignment?: 'left' | 'center'
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function ComplianceBadgeRowRenderer({ block }: { block: BadgeRowBlock }) {
  const align = block.alignment ?? 'center'
  return (
    <SectionShell background={block.background} spacing={block.spacing ?? 'compact'} anchorId={block.anchorId}>
      <div className={align === 'center' ? 'text-center' : ''}>
        {block.eyebrow && (
          <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--mist)]">
            {block.eyebrow}
          </div>
        )}
        {block.heading && (
          <h3 className={`mt-2 text-[18px] font-medium text-[var(--ink)] ${align === 'center' ? '' : ''}`}>
            {block.heading}
          </h3>
        )}
        <div className={`mt-4 flex flex-wrap items-center gap-2 ${align === 'center' ? 'justify-center' : ''}`}>
          {(block.badges ?? []).map((b) => (
            <ComplianceBadgePill key={b} value={b} size="md" />
          ))}
        </div>
      </div>
    </SectionShell>
  )
}

// ── TrustNumbers ──────────────────────────────────────────────────────────

type TrustNumbersBlock = {
  blockType: 'trustNumbers'
  eyebrow?: string
  heading?: string
  description?: string
  stats?: Array<{ value: string; label: string; sublabel?: string }>
  animateOnScroll?: boolean
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

function AnimatedNumberCell({ value, animate: animateProp }: { value: string; animate?: boolean }) {
  // Pure numeric values use NumberTicker; mixed/text values render as-is.
  const numericMatch = value.match(/^([^0-9-]*)(-?[0-9]+(?:\.[0-9]+)?)([^0-9]*)$/)
  if (animateProp && numericMatch) {
    const [, prefix, num, suffix] = numericMatch
    return (
      <>
        {prefix}
        <NumberTicker value={parseFloat(num)} />
        {suffix}
      </>
    )
  }
  // Render mixed values like "NA · EU · APAC" with span-style markup support
  // (parts wrapped in **double asterisks** become accent-coloured)
  const parts = value.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((p, i) => {
        const m = p.match(/^\*\*(.+)\*\*$/)
        if (m) {
          return (
            <span key={i} className="text-[var(--accent)]">
              {m[1]}
            </span>
          )
        }
        return <span key={i}>{p}</span>
      })}
    </>
  )
}

export function TrustNumbersRenderer({ block }: { block: TrustNumbersBlock }) {
  const stats = block.stats ?? []
  if (stats.length === 0) return null

  // Stats Bar layout — bordered grid container, 5 cells with internal dividers,
  // hover bottom-line gradient. From design upgrade reference.
  return (
    <SectionShell background={block.background} spacing={block.spacing ?? 'compact'} anchorId={block.anchorId}>
      {(block.eyebrow || block.heading || block.description) && (
        <SectionHeader
          eyebrow={block.eyebrow}
          heading={block.heading ? <MintGradientHeading text={block.heading} /> : undefined}
          description={block.description}
          alignment="center"
        />
      )}
      <div
        className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]"
        style={{
          gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))`,
        }}
      >
        <div className="grid" style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}>
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative flex flex-col gap-2 px-6 py-7 transition-colors duration-base hover:bg-[var(--surface-2)] ${
                i < stats.length - 1 ? 'border-r border-[var(--border)]' : ''
              }`}
            >
              {/* Hover bottom-line accent gradient */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-px opacity-0 transition-opacity duration-base group-hover:opacity-100"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, var(--accent), transparent)',
                }}
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--mist)]">
                {s.label}
              </span>
              <span className="text-[24px] sm:text-[28px] font-semibold tracking-[-0.02em] tabular-nums text-[var(--ink)] leading-none">
                <AnimatedNumberCell value={s.value} animate={block.animateOnScroll} />
              </span>
              {s.sublabel && (
                <span className="text-[12px] text-[var(--ink-2)]">{s.sublabel}</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}

// ── LogosCloud ────────────────────────────────────────────────────────────

type LogosCloudBlock = {
  blockType: 'logosCloud'
  eyebrow?: string
  heading?: string
  logos?: Array<{ name: string; image?: { url?: string; alt?: string }; url?: string }>
  columns?: '3' | '4' | '5' | '6'
  grayscale?: boolean
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function LogosCloudRenderer({ block }: { block: LogosCloudBlock }) {
  const cols = block.columns ?? '6'
  return (
    <SectionShell background={block.background} spacing={block.spacing ?? 'compact'} anchorId={block.anchorId}>
      <div className="text-center">
        {block.eyebrow && (
          <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--mist)]">{block.eyebrow}</div>
        )}
        {block.heading && (
          <h3 className="mt-2 text-[18px] font-medium text-[var(--ink)]">{block.heading}</h3>
        )}
      </div>
      <div className={`mt-8 grid gap-x-10 gap-y-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-${cols} items-center`}>
        {(block.logos ?? []).map((logo, i) => {
          const inner = logo.image?.url ? (
            <Image src={logo.image.url} alt={logo.image.alt ?? logo.name} width={160} height={32} className="h-8 w-auto object-contain" />
          ) : (
            <span className="text-[14px] font-mono uppercase tracking-[0.1em] text-[var(--ink-2)]">{logo.name}</span>
          )
          return (
            <div
              key={i}
              className={`flex items-center justify-center ${block.grayscale ? 'logo-cloud-item' : ''}`}
            >
              {logo.url ? <a href={logo.url}>{inner}</a> : inner}
            </div>
          )
        })}
      </div>
    </SectionShell>
  )
}

// ── ComplianceCallout ─────────────────────────────────────────────────────

type ComplianceCalloutBlock = {
  blockType: 'complianceCallout'
  eyebrow?: string
  heading: string
  description?: string
  pillars?: Array<{ icon?: string; title: string; description?: string }>
  ctas?: Array<{ label: string; url: string; variant?: string; magnetic?: boolean }>
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function ComplianceCalloutRenderer({ block }: { block: ComplianceCalloutBlock }) {
  return (
    <SectionShell background={block.background ?? 'flood'} spacing={block.spacing} anchorId={block.anchorId}>
      <SectionHeader eyebrow={block.eyebrow} heading={<MintGradientHeading text={block.heading} />} description={block.description} alignment="center" />
      <div className="mx-auto max-w-5xl grid gap-px overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
        {(block.pillars ?? []).map((p, i) => {
          const Icon = (p.icon && ICON_MAP[p.icon]) || ShieldCheck
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col gap-3 bg-[var(--bg)] p-6 transition-colors duration-base hover:bg-[var(--surface)]"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--accent-border)] bg-[var(--accent-tint)] text-[var(--accent)] transition-all duration-base group-hover:shadow-cta">
                <Icon className="h-4 w-4" />
              </span>
              <h4 className="text-[15px] font-medium text-[var(--ink)]">{p.title}</h4>
              {p.description && (
                <p className="text-[13px] leading-relaxed text-[var(--ink-2)]">{p.description}</p>
              )}
            </motion.div>
          )
        })}
      </div>
      {block.ctas && block.ctas.length > 0 && (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <CTAButtons ctas={block.ctas as never} />
        </div>
      )}
    </SectionShell>
  )
}
