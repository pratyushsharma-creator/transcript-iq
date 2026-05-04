'use client'

import { motion } from 'motion/react'
import * as Lucide from 'lucide-react'
import { SectionShell, SectionHeader, MintGradientHeading } from './SectionShell'

type VisualRow = { label: string; tag?: string; tone?: 'accent' | 'neutral' | 'muted' }

type ProcessStepsBlock = {
  blockType: 'processSteps'
  variant?: 'horizontal' | 'vertical' | 'flow'
  eyebrow?: string
  heading?: string
  description?: string
  numbering?: 'mono' | 'massive' | 'iconOnly' | 'iconAndNumber'
  steps?: Array<{
    title: string
    description?: string
    icon?: string
    image?: { url?: string }
    visualRows?: VisualRow[]
  }>
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

function VisualArtifact({ rows }: { rows?: VisualRow[] }) {
  if (!rows || rows.length === 0) return null
  return (
    <div className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4">
      {rows.map((r, i) => {
        const tagClass =
          r.tone === 'muted'
            ? 'text-[var(--mist)] line-through'
            : r.tone === 'neutral'
            ? 'text-[var(--ink-2)]'
            : 'text-[var(--accent)]'
        const tagBg =
          r.tone === 'accent'
            ? 'bg-[var(--accent-tint)] border border-[var(--accent-border)]'
            : 'bg-transparent'
        return (
          <div
            key={i}
            className={`flex items-center gap-2 py-1.5 font-mono text-[11px] text-[var(--ink-2)] ${
              i < rows.length - 1 ? 'border-b border-[var(--border)]' : ''
            }`}
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
            <span className="flex-1 truncate">{r.label}</span>
            {r.tag && (
              <span className={`shrink-0 rounded px-2 py-0.5 ${tagBg} ${tagClass}`}>{r.tag}</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

function getIcon(name?: string): React.ComponentType<{ className?: string }> {
  if (!name) return Lucide.Sparkles
  const camel = name.split('-').map((s, i) => i === 0 ? s.charAt(0).toUpperCase() + s.slice(1) : s.charAt(0).toUpperCase() + s.slice(1)).join('')
  // try common variations
  const candidates = [
    camel,
    name.charAt(0).toUpperCase() + name.slice(1),
    name.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(''),
  ]
  for (const c of candidates) {
    const Icon = (Lucide as never as Record<string, React.ComponentType<{ className?: string }>>)[c]
    if (Icon) return Icon
  }
  return Lucide.Sparkles
}

export function ProcessStepsRenderer({ block }: { block: ProcessStepsBlock }) {
  const variant = block.variant ?? 'horizontal'
  const numbering = block.numbering ?? 'mono'
  const steps = block.steps ?? []

  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
      <SectionHeader
        eyebrow={block.eyebrow}
        heading={<MintGradientHeading text={block.heading ?? ''} />}
        description={block.description}
      />
      {variant === 'horizontal' && (
        <div
          className="grid gap-px overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--border)]"
          style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
        >
          {steps.map((s, i) => {
            const Icon = getIcon(s.icon)
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group flex flex-col bg-[var(--surface)] p-9 transition-colors duration-base hover:bg-[var(--surface-2)]"
              >
                {/* Step number — top, mono, with mint accent on number */}
                <div className="mb-5 font-mono text-[11px] tracking-[0.12em] text-[var(--mist)]">
                  <span className="text-[var(--accent)] mr-1.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {s.title.split(' ')[0]}
                </div>
                {/* Icon block */}
                <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-[10px] border border-[var(--accent-border)] bg-[var(--accent-tint)] text-[var(--accent)] transition-all duration-base group-hover:shadow-cta">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-[20px] font-semibold text-[var(--ink)] leading-[1.2] tracking-[-0.01em] mb-2.5">
                  {s.title}
                </h3>
                {s.description && (
                  <p className="text-[14px] leading-[1.6] text-[var(--ink-2)]">{s.description}</p>
                )}
                <VisualArtifact rows={s.visualRows} />
              </motion.div>
            )
          })}
        </div>
      )}

      {variant === 'vertical' && (
        <div className="relative ml-4 border-l border-[var(--border)] pl-8">
          {steps.map((s, i) => {
            const Icon = getIcon(s.icon)
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="relative pb-12"
              >
                <span className="absolute -left-[44px] inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--accent-border)] bg-[var(--bg)] text-[var(--accent)]">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--mist)]">
                  Step {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-2 text-[20px] font-medium text-[var(--ink)] leading-[1.3]">{s.title}</h3>
                {s.description && (
                  <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[var(--ink-2)]">{s.description}</p>
                )}
              </motion.div>
            )
          })}
        </div>
      )}

      {variant === 'flow' && (
        <div className="relative">
          <div className="grid gap-8 sm:grid-cols-3 lg:gap-4">
            {steps.map((s, i) => {
              const Icon = getIcon(s.icon)
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex flex-col items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--accent-border)] bg-[var(--accent-tint)] text-[var(--accent)] shadow-cta">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-[16px] font-medium text-[var(--ink)]">{s.title}</h3>
                  {s.description && (
                    <p className="text-[13px] leading-relaxed text-[var(--ink-2)]">{s.description}</p>
                  )}
                  {i < steps.length - 1 && (
                    <span aria-hidden className="absolute -right-3 top-1/2 hidden h-px w-6 -translate-y-1/2 bg-[var(--accent)] sm:block" />
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      )}
    </SectionShell>
  )
}
