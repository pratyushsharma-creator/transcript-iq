'use client'

import { motion } from 'motion/react'
import { Info, AlertTriangle, CheckCircle, FileText } from 'lucide-react'
import { SectionShell, SectionHeader, MintGradientHeading } from './SectionShell'
import { CTAButtons } from './CTAButtons'

// ── RichTextBlock ─────────────────────────────────────────────────────────

type RichTextBlockData = {
  blockType: 'richText'
  content?: unknown
  maxWidth?: 'prose' | 'wide' | 'full'
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
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

export function RichTextRenderer({ block }: { block: RichTextBlockData }) {
  const widthClass =
    block.maxWidth === 'full' ? 'max-w-full' : block.maxWidth === 'wide' ? 'max-w-4xl' : 'max-w-2xl'
  const text = lexicalToText(block.content)
  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
      <article className={`${widthClass} prose-rich text-[16px] leading-relaxed text-[var(--ink)]`}>
        {text.split('\n\n').map((p, i) => (
          <p key={i} className="mb-4 last:mb-0">{p}</p>
        ))}
      </article>
    </SectionShell>
  )
}

// ── PullQuote ─────────────────────────────────────────────────────────────

type PullQuoteBlock = {
  blockType: 'pullQuote'
  variant?: 'standard' | 'withStats' | 'founderVoice'
  quote: string
  attributionName?: string
  attributionRole?: string
  attributionImage?: { url?: string }
  stats?: Array<{ value: string; label: string }>
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function PullQuoteRenderer({ block }: { block: PullQuoteBlock }) {
  const variant = block.variant ?? 'standard'
  const founderBg = variant === 'founderVoice' ? 'flood' : block.background

  return (
    <SectionShell background={founderBg} spacing={block.spacing} anchorId={block.anchorId}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-3xl text-center"
      >
        <p className="text-[24px] sm:text-[32px] leading-[1.2] tracking-[-0.02em] font-medium text-[var(--ink)] text-balance">
          “{block.quote}”
        </p>
        {(block.attributionName || block.attributionRole) && (
          <div className="mt-6 flex items-center justify-center gap-3">
            {block.attributionImage?.url && (
              <img
                src={block.attributionImage.url}
                alt={block.attributionName ?? ''}
                className="h-9 w-9 rounded-full border border-[var(--border)] object-cover"
              />
            )}
            <div className="text-left">
              {block.attributionName && (
                <div className="text-[14px] font-medium text-[var(--ink)]">{block.attributionName}</div>
              )}
              {block.attributionRole && (
                <div className="text-[12px] text-[var(--mist)]">{block.attributionRole}</div>
              )}
            </div>
          </div>
        )}
      </motion.div>
      {variant === 'withStats' && block.stats && block.stats.length > 0 && (
        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-6 border-t border-[var(--border)] pt-10 sm:grid-cols-4">
          {block.stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-mono text-[28px] font-semibold tabular-nums text-[var(--accent)]">{s.value}</div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.12em] text-[var(--mist)] font-mono">{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </SectionShell>
  )
}

// ── Callout ───────────────────────────────────────────────────────────────

type CalloutBlock = {
  blockType: 'callout'
  tone?: 'info' | 'note' | 'warning' | 'success'
  icon?: string
  heading?: string
  body: string
  ctas?: Array<{ label: string; url: string; variant?: string; magnetic?: boolean }>
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

const TONE_STYLES: Record<string, string> = {
  info: 'border-[var(--accent-border)] bg-[var(--accent-tint)] text-[var(--ink)]',
  note: 'border-[var(--border)] bg-[var(--surface)] text-[var(--ink)]',
  warning: 'border-amber-500/30 bg-amber-500/10 text-[var(--ink)]',
  success: 'border-[var(--accent)] bg-[var(--accent-tint-2)] text-[var(--ink)]',
}

const TONE_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  info: Info,
  note: FileText,
  warning: AlertTriangle,
  success: CheckCircle,
}

export function CalloutRenderer({ block }: { block: CalloutBlock }) {
  const Icon = TONE_ICON[block.tone ?? 'info']
  return (
    <SectionShell background={block.background} spacing={block.spacing ?? 'compact'} anchorId={block.anchorId}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`mx-auto max-w-3xl rounded-lg border p-6 ${TONE_STYLES[block.tone ?? 'info']}`}
      >
        <div className="flex items-start gap-4">
          <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--accent-border)] bg-[var(--accent-tint)] text-[var(--accent)]">
            <Icon className="h-4 w-4" />
          </span>
          <div className="flex-1">
            {block.heading && <h4 className="text-[15px] font-medium">{block.heading}</h4>}
            <p className={`text-[14px] leading-relaxed ${block.heading ? 'mt-1' : ''}`}>{block.body}</p>
            {block.ctas && block.ctas.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <CTAButtons ctas={block.ctas as never} />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </SectionShell>
  )
}

// ── ArgumentBlock (pillar piece structured argument) ──────────────────────

type ArgumentBlockData = {
  blockType: 'argument'
  eyebrow?: string
  heading: string
  body?: unknown
  pullquote?: { quote?: string; attribution?: string }
  ctas?: Array<{ label: string; url: string; variant?: string; magnetic?: boolean }>
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function ArgumentRenderer({ block }: { block: ArgumentBlockData }) {
  const text = lexicalToText(block.body)
  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
      <article className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {block.eyebrow && (
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--accent)]">{block.eyebrow}</span>
          )}
          <h2 className="mt-3 text-[28px] sm:text-[36px] leading-[1.15] tracking-[-0.025em] font-medium text-[var(--ink)] text-balance">
            <MintGradientHeading text={block.heading} />
          </h2>
          {text && (
            <div className="mt-6 space-y-4 text-[16px] leading-relaxed text-[var(--ink-2)]">
              {text.split('\n\n').map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}
          {block.pullquote?.quote && (
            <blockquote className="my-10 border-l-2 border-[var(--accent)] pl-6">
              <p className="text-[20px] leading-[1.3] font-medium text-[var(--ink)] text-balance">
                “{block.pullquote.quote}”
              </p>
              {block.pullquote.attribution && (
                <cite className="mt-3 block text-[13px] not-italic text-[var(--mist)]">
                  — {block.pullquote.attribution}
                </cite>
              )}
            </blockquote>
          )}
          {block.ctas && block.ctas.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <CTAButtons ctas={block.ctas as never} />
            </div>
          )}
        </motion.div>
      </article>
    </SectionShell>
  )
}
