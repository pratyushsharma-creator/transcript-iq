'use client'

import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import { SectionShell, SectionHeader, MintGradientHeading } from './SectionShell'

// ── ComparisonTable ───────────────────────────────────────────────────────

type ComparisonTableBlock = {
  blockType: 'comparisonTable'
  eyebrow?: string
  heading?: string
  description?: string
  leftLabel: string
  rightLabel: string
  rightHighlighted?: boolean
  rows?: Array<{ left: string; right: string }>
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function ComparisonTableRenderer({ block }: { block: ComparisonTableBlock }) {
  const highlight = block.rightHighlighted ?? true
  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
      <SectionHeader
        eyebrow={block.eyebrow}
        heading={block.heading ? <MintGradientHeading text={block.heading} /> : undefined}
        description={block.description}
        alignment="center"
      />
      {/* Column headers — left dimmed, right glow + accent */}
      <div className="relative mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2">
          <div className="bg-[var(--surface)] p-6 sm:p-8">
            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--mist)]">— Status quo</div>
            <h3 className="mt-2 text-[18px] font-medium text-[var(--ink-2)] opacity-70">{block.leftLabel}</h3>
          </div>
          <div
            className="relative bg-[var(--surface)] p-6 sm:p-8"
            style={
              highlight
                ? {
                    backgroundImage:
                      'linear-gradient(135deg, var(--accent-tint) 0%, transparent 60%)',
                  }
                : undefined
            }
          >
            {highlight && (
              <span aria-hidden className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-[var(--accent)] to-transparent" />
            )}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--accent)]">+ Primary research</span>
              {highlight && (
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse-soft" />
              )}
            </div>
            <h3 className="mt-2 text-[18px] font-medium text-[var(--ink)]">{block.rightLabel}</h3>
          </div>
        </div>

        {/* Rows — each pair as a single grid row, with subtle shaping */}
        <div className="mt-px grid grid-cols-1 gap-px overflow-hidden rounded-b-2xl border border-t-0 border-[var(--border)] bg-[var(--border)] sm:grid-cols-2">
          {(block.rows ?? []).map((r, i) => (
            <div key={i} className="contents">
              <motion.div
                initial={{ opacity: 0, x: -4 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[var(--bg)] p-5 sm:p-6 text-[14px] leading-relaxed text-[var(--ink-2)] opacity-60"
              >
                {r.left}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 4 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: 0.05 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className="relative bg-[var(--surface)] p-5 sm:p-6 text-[14px] leading-relaxed text-[var(--ink)]"
                style={
                  highlight
                    ? { backgroundImage: 'linear-gradient(90deg, var(--accent-tint) 0%, transparent 80%)' }
                    : undefined
                }
              >
                {highlight && (
                  <span aria-hidden className="absolute inset-y-0 left-0 w-px bg-[var(--accent)] opacity-30" />
                )}
                {r.right}
              </motion.div>
            </div>
          ))}
        </div>

        {/* Connector arrows pointing right, subtle */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 hidden -translate-x-1/2 items-center justify-center sm:flex">
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--accent-border)] bg-[var(--bg)] text-[var(--accent)] shadow-cta">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6 L10 6 M7 3 L10 6 L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </SectionShell>
  )
}

// ── TierComparison ────────────────────────────────────────────────────────

type TierComparisonBlock = {
  blockType: 'tierComparison'
  eyebrow?: string
  heading?: string
  description?: string
  tiers?: Array<{
    name: string
    price: string
    priceCadence?: string
    tagline?: string
    features?: Array<{ item: string }>
    highlighted?: boolean
    ctaLabel?: string
    ctaUrl?: string
  }>
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function TierComparisonRenderer({ block }: { block: TierComparisonBlock }) {
  const tiers = block.tiers ?? []
  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
      <SectionHeader
        eyebrow={block.eyebrow}
        heading={block.heading ? <MintGradientHeading text={block.heading} /> : undefined}
        description={block.description}
        alignment="center"
      />
      <div className={`grid gap-6 ${tiers.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-' + tiers.length}`}>
        {tiers.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className={`flex flex-col gap-4 rounded-2xl p-8 transition-all duration-base ${
              t.highlighted
                ? 'border-2 border-[var(--accent)] bg-[var(--surface)] shadow-cta'
                : 'border border-[var(--border)] bg-[var(--surface)]'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-medium text-[var(--ink)]">{t.name}</h3>
              {t.highlighted && (
                <span className="inline-flex items-center rounded-md bg-gradient-to-r from-mint-500 to-mint-300 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.08em] text-mint-900">
                  Recommended
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[36px] font-semibold tabular-nums text-[var(--ink)]">{t.price}</span>
              {t.priceCadence && <span className="text-[13px] text-[var(--mist)]">{t.priceCadence}</span>}
            </div>
            {t.tagline && <p className="text-[14px] leading-relaxed text-[var(--ink-2)]">{t.tagline}</p>}
            <ul className="mt-2 flex-1 space-y-2">
              {(t.features ?? []).map((f, j) => (
                <li key={j} className="flex items-start gap-2 text-[14px] text-[var(--ink-2)]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
                  <span>{f.item}</span>
                </li>
              ))}
            </ul>
            {t.ctaLabel && t.ctaUrl && (
              <a
                href={t.ctaUrl}
                className={`mt-2 inline-flex items-center justify-center rounded-md px-4 py-2.5 text-[13px] font-medium transition-all duration-base ease-out ${
                  t.highlighted
                    ? 'bg-btn-primary text-white shadow-cta hover:-translate-y-px hover:bg-btn-primary-hover'
                    : 'border border-[var(--border)] bg-[var(--bg)] text-[var(--ink)] hover:border-[var(--accent-border)]'
                }`}
              >
                {t.ctaLabel}
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </SectionShell>
  )
}

// ── FeatureMatrix ─────────────────────────────────────────────────────────

type FeatureMatrixBlock = {
  blockType: 'featureMatrix'
  eyebrow?: string
  heading?: string
  description?: string
  columns?: Array<{ name: string; highlighted?: boolean }>
  rows?: Array<{ feature: string; values?: Array<{ value?: string }> }>
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function FeatureMatrixRenderer({ block }: { block: FeatureMatrixBlock }) {
  const cols = block.columns ?? []
  const rows = block.rows ?? []
  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
      <SectionHeader
        eyebrow={block.eyebrow}
        heading={block.heading ? <MintGradientHeading text={block.heading} /> : undefined}
        description={block.description}
      />
      <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="p-4 text-left font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--mist)]">Feature</th>
              {cols.map((c, i) => (
                <th
                  key={i}
                  className={`p-4 text-center text-[14px] font-medium ${c.highlighted ? 'bg-[var(--accent-tint)] text-[var(--accent)]' : 'text-[var(--ink)]'}`}
                >
                  {c.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri} className={ri < rows.length - 1 ? 'border-b border-[var(--border)]' : ''}>
                <td className="p-4 text-[14px] text-[var(--ink-2)]">{r.feature}</td>
                {cols.map((c, ci) => {
                  const value = r.values?.[ci]?.value ?? ''
                  return (
                    <td
                      key={ci}
                      className={`p-4 text-center text-[14px] ${c.highlighted ? 'bg-[var(--accent-tint)]/40' : ''}`}
                    >
                      {value === '✓' ? (
                        <Check className="mx-auto h-4 w-4 text-[var(--accent)]" />
                      ) : value === '✗' ? (
                        <span className="text-[var(--mist)]">—</span>
                      ) : (
                        <span className="text-[var(--ink)]">{value}</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionShell>
  )
}
