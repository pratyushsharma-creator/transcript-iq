'use client'

import type { ReactNode } from 'react'
import { motion } from 'motion/react'

export type BackgroundVariant = 'clean' | 'glow' | 'grid' | 'mesh' | 'flood' | undefined
export type Spacing = 'compact' | 'default' | 'spacious' | undefined

const bgClass: Record<NonNullable<BackgroundVariant>, string> = {
  clean: 'bg-variant-clean',
  glow: 'bg-variant-glow',
  grid: 'bg-variant-grid',
  mesh: 'bg-variant-mesh',
  flood: 'bg-variant-flood',
}

const spacingClass: Record<NonNullable<Spacing>, string> = {
  compact: 'section-compact',
  default: 'section-default',
  spacious: 'section-spacious',
}

export function SectionShell({
  background = 'clean',
  spacing = 'default',
  anchorId,
  className = '',
  contained = true,
  children,
}: {
  background?: BackgroundVariant
  spacing?: Spacing
  anchorId?: string | null
  className?: string
  contained?: boolean
  children: ReactNode
}) {
  return (
    <section
      id={anchorId || undefined}
      className={`relative isolate overflow-clip ${bgClass[background ?? 'clean']} ${spacingClass[spacing ?? 'default']} ${className}`}
    >
      {contained ? (
        <div className="mx-auto w-full max-w-[1240px] px-6">{children}</div>
      ) : (
        children
      )}
    </section>
  )
}

export function SectionHeader({
  eyebrow,
  heading,
  description,
  alignment = 'left',
  size = 'default',
}: {
  eyebrow?: string | null
  heading?: ReactNode
  description?: ReactNode
  alignment?: 'left' | 'center'
  size?: 'default' | 'massive'
}) {
  if (!eyebrow && !heading && !description) return null
  const alignClass = alignment === 'center' ? 'text-center mx-auto' : ''
  const headingClass =
    size === 'massive'
      ? 'text-[44px] sm:text-[56px] lg:text-[72px] leading-[1.05] tracking-[-0.04em] font-semibold'
      : 'text-[32px] sm:text-[44px] leading-[1.1] tracking-[-0.03em] font-medium'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`mb-10 max-w-2xl ${alignClass}`}
    >
      {eyebrow && (
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--accent)]">
          {eyebrow}
        </span>
      )}
      {heading && (
        <h2 className={`mt-3 text-[var(--ink)] text-balance ${headingClass}`}>
          {heading}
        </h2>
      )}
      {description && (
        <p className="mt-4 text-[16px] leading-relaxed text-[var(--ink-2)]">
          {description}
        </p>
      )}
    </motion.div>
  )
}

/**
 * Parse a heading string with **double-asterisks** wrapping a phrase, and
 * render that phrase with the mint gradient utility.
 */
export function MintGradientHeading({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((p, i) => {
        const m = p.match(/^\*\*(.+)\*\*$/)
        if (m) return <span key={i} className="text-mint-gradient">{m[1]}</span>
        return <span key={i}>{p}</span>
      })}
    </>
  )
}
