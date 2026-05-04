'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import * as Lucide from 'lucide-react'
import Link from 'next/link'
import { SectionShell, SectionHeader, MintGradientHeading } from './SectionShell'

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

function lexicalToText(node: unknown): string {
  if (!node) return ''
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(lexicalToText).join('')
  if (typeof node === 'object' && node !== null) {
    const n = node as Record<string, unknown>
    if (typeof n.text === 'string') return n.text
    if (n.children) return lexicalToText(n.children)
    if (n.root) return lexicalToText(n.root)
  }
  return ''
}

// ── MarqueeText ───────────────────────────────────────────────────────────

type MarqueeTextBlock = {
  blockType: 'marqueeText'
  variant?: 'chips' | 'text' | 'logos'
  eyebrow?: string
  items?: Array<{ label: string; image?: { url?: string } }>
  speedSeconds?: number
  reverse?: boolean
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function MarqueeTextRenderer({ block }: { block: MarqueeTextBlock }) {
  const items = block.items ?? []
  const speed = block.speedSeconds ?? 22
  const variant = block.variant ?? 'chips'

  const renderItem = (it: NonNullable<MarqueeTextBlock['items']>[number], k: string) => {
    if (variant === 'logos') {
      return (
        <span key={k} className="inline-flex h-10 items-center px-3 logo-cloud-item">
          {it.image?.url ? (
            <Image src={it.image.url} alt={it.label} width={120} height={32} className="max-h-8 w-auto object-contain" />
          ) : (
            <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-[var(--ink-2)]">{it.label}</span>
          )}
        </span>
      )
    }
    if (variant === 'text') {
      // Trust strip — mono ✓ accent + label, items separated by spacing
      // Detect optional ✓ prefix in the label and render it in accent
      const checkMatch = it.label.match(/^([✓✔])\s*(.+)$/)
      if (checkMatch) {
        return (
          <span
            key={k}
            className="inline-flex shrink-0 items-center font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--mist)]"
          >
            <span className="mr-3 text-[var(--accent)]">{checkMatch[1]}</span>
            {checkMatch[2]}
          </span>
        )
      }
      return (
        <span
          key={k}
          className="inline-flex shrink-0 items-center font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--mist)]"
        >
          {it.label}
        </span>
      )
    }
    return (
      <span
        key={k}
        className="inline-flex shrink-0 items-center rounded-md border border-[var(--accent-border)] bg-[var(--accent-tint)] px-3 py-1 font-mono text-[12px] font-medium text-[var(--accent)]"
      >
        {it.label}
      </span>
    )
  }

  // Trust-strip variant has its own band styling — full-width band, no contained shell
  if (variant === 'text') {
    return (
      <div
        id={block.anchorId}
        className="relative overflow-hidden border-y border-[var(--border)] bg-[var(--surface)] py-3.5"
      >
        <motion.div
          className="flex w-max gap-12"
          animate={{ x: block.reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
          transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
        >
          <div className="flex shrink-0 gap-12">
            {items.map((it, i) => renderItem(it, `a-${i}`))}
          </div>
          <div className="flex shrink-0 gap-12" aria-hidden>
            {items.map((it, i) => renderItem(it, `b-${i}`))}
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <SectionShell background={block.background} spacing={block.spacing ?? 'compact'} anchorId={block.anchorId}>
      {block.eyebrow && (
        <div className="mb-3 px-2 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--mist)]">
          {block.eyebrow}
        </div>
      )}
      <div className="relative overflow-hidden mask-fade-x">
        <motion.div
          className="flex w-max gap-3"
          animate={{ x: block.reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
          transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
        >
          <div className="flex shrink-0 gap-3">
            {items.map((it, i) => renderItem(it, `a-${i}`))}
          </div>
          <div className="flex shrink-0 gap-3" aria-hidden>
            {items.map((it, i) => renderItem(it, `b-${i}`))}
          </div>
        </motion.div>
      </div>
    </SectionShell>
  )
}

// ── AnnouncementBanner ────────────────────────────────────────────────────

type AnnouncementBlock = {
  blockType: 'announcementBanner'
  tone?: 'mint' | 'ink' | 'surface'
  message: string
  linkLabel?: string
  linkUrl?: string
  dismissible?: boolean
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function AnnouncementBannerRenderer({ block }: { block: AnnouncementBlock }) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null
  const tone = block.tone ?? 'mint'
  const cls =
    tone === 'mint'
      ? 'bg-[var(--accent)] text-white'
      : tone === 'ink'
      ? 'bg-[var(--ink)] text-[var(--bg)]'
      : 'bg-[var(--surface)] text-[var(--ink)] border-y border-[var(--border)]'
  return (
    <div id={block.anchorId} className={`relative ${cls}`}>
      <div className="mx-auto flex max-w-[1240px] items-center gap-4 px-6 py-3">
        <p className="flex-1 text-center text-[13px]">
          {block.message}
          {block.linkLabel && block.linkUrl && (
            <Link href={block.linkUrl} className="ml-3 underline underline-offset-4 font-medium">
              {block.linkLabel} →
            </Link>
          )}
        </p>
        {block.dismissible && (
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
            className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full opacity-70 transition-opacity hover:opacity-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}

// ── FAQBlock ──────────────────────────────────────────────────────────────

type FAQBlockData = {
  blockType: 'faq'
  variant?: 'hairline' | 'boxed' | 'twoColumn'
  eyebrow?: string
  heading?: string
  description?: string
  defaultOpen?: 'first' | 'all' | 'none'
  items?: Array<{ question: string; answer: unknown }>
  contactLabel?: string
  contactEmail?: string
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function FAQBlockRenderer({ block }: { block: FAQBlockData }) {
  const items = block.items ?? []
  const initialOpen =
    block.defaultOpen === 'all'
      ? items.map((_, i) => i)
      : block.defaultOpen === 'first'
      ? [0]
      : []
  const [openSet, setOpenSet] = useState<Set<number>>(new Set(initialOpen))

  const toggle = (i: number) => {
    const next = new Set(openSet)
    if (next.has(i)) next.delete(i)
    else next.add(i)
    setOpenSet(next)
  }

  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
      {/* 2-col sidebar layout per design upgrade reference */}
      <div className="grid items-start gap-12 lg:grid-cols-[320px_1fr] lg:gap-20">
        {/* LEFT — eyebrow + heading + contact prompt */}
        <div className="lg:sticky lg:top-24">
          {block.eyebrow && (
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]">
              {block.eyebrow}
            </span>
          )}
          {block.heading && (
            <h2 className="mt-3 text-[28px] sm:text-[32px] leading-[1.15] tracking-[-0.02em] font-medium text-[var(--ink)] text-balance">
              <MintGradientHeading text={block.heading} />
            </h2>
          )}
          {block.description && (
            <p className="mt-4 text-[14px] leading-relaxed text-[var(--ink-2)]">{block.description}</p>
          )}
          {block.contactEmail && (
            <div className="mt-8 flex flex-col gap-1">
              <span className="text-[13px] text-[var(--mist)]">
                {block.contactLabel ?? 'Still have questions?'}
              </span>
              <a
                href={`mailto:${block.contactEmail}`}
                className="font-mono text-[13px] text-[var(--accent)] tracking-[0.05em] transition-opacity hover:opacity-80"
              >
                {block.contactEmail} →
              </a>
            </div>
          )}
        </div>

        {/* RIGHT — accordion list */}
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          {items.map((item, i) => {
            const isOpen = openSet.has(i)
            return (
              <div
                key={i}
                className={`transition-colors duration-base ${isOpen ? 'bg-[var(--surface-2)]' : 'bg-[var(--surface)]'} ${
                  i < items.length - 1 ? 'border-b border-[var(--border)]' : ''
                }`}
              >
                <button
                  onClick={() => toggle(i)}
                  className="flex w-full items-center justify-between gap-4 px-7 py-6 text-left"
                >
                  <h3 className="text-[16px] font-medium text-[var(--ink)] leading-snug tracking-[-0.005em]">
                    {item.question}
                  </h3>
                  <span
                    className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--accent-border)] bg-[var(--accent-tint)] text-[var(--accent)] transition-transform duration-base ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </span>
                </button>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="px-7 pb-6 -mt-1"
                  >
                    <div className="text-[14px] leading-relaxed text-[var(--ink-2)] space-y-3">
                      {lexicalToText(item.answer).split('\n\n').map((p, j) => (
                        <p key={j}>{p}</p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </SectionShell>
  )
}

// ── AccordionContent ──────────────────────────────────────────────────────

type AccordionContentBlock = {
  blockType: 'accordionContent'
  eyebrow?: string
  heading?: string
  sections?: Array<{ title: string; body: unknown; icon?: string }>
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function AccordionContentRenderer({ block }: { block: AccordionContentBlock }) {
  return (
    <FAQBlockRenderer
      block={{
        blockType: 'faq',
        variant: 'boxed',
        eyebrow: block.eyebrow,
        heading: block.heading,
        items: (block.sections ?? []).map((s) => ({ question: s.title, answer: s.body })),
        defaultOpen: 'first',
        background: block.background,
        spacing: block.spacing,
        anchorId: block.anchorId,
      }}
    />
  )
}

// ── Layout helpers (Divider, Spacer, Anchor) ──────────────────────────────

type DividerBlock = {
  blockType: 'divider'
  style?: 'hairline' | 'accent' | 'pattern' | 'sectionBreak'
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const DIVIDER_SPACING: Record<string, string> = {
  xs: 'py-2',
  sm: 'py-4',
  md: 'py-8',
  lg: 'py-16',
  xl: 'py-24',
}

export function DividerRenderer({ block }: { block: DividerBlock }) {
  const spacing = DIVIDER_SPACING[block.spacing ?? 'md']
  const style = block.style ?? 'hairline'
  return (
    <div className={`mx-auto w-full max-w-[1240px] px-6 ${spacing}`}>
      {style === 'hairline' && <div className="h-px bg-[var(--border)]" />}
      {style === 'accent' && <div className="h-px stroke-gradient-mint" />}
      {style === 'pattern' && (
        <div className="flex items-center justify-center gap-2 text-[var(--mist)]">
          <span className="h-px w-12 bg-[var(--border)]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em]">·</span>
          <span className="h-px w-12 bg-[var(--border)]" />
        </div>
      )}
      {style === 'sectionBreak' && (
        <div className="flex flex-col items-center gap-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">§</span>
          <div className="h-px w-24 bg-[var(--border)]" />
        </div>
      )}
    </div>
  )
}

type SpacerBlock = { blockType: 'spacer'; size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }
const SPACER_SIZE: Record<string, string> = { xs: 'h-4', sm: 'h-8', md: 'h-16', lg: 'h-24', xl: 'h-40' }

export function SpacerRenderer({ block }: { block: SpacerBlock }) {
  return <div aria-hidden className={SPACER_SIZE[block.size ?? 'md']} />
}

type AnchorBlock = { blockType: 'anchor'; anchorId: string }

export function AnchorRenderer({ block }: { block: AnchorBlock }) {
  return <div id={block.anchorId} aria-hidden className="scroll-mt-20" />
}
