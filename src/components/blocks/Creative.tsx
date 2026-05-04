'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform, useInView, useMotionValue, animate } from 'motion/react'
import { useEffect, useRef } from 'react'
import { SectionShell, SectionHeader, MintGradientHeading } from './SectionShell'
import { CTAButtons } from './CTAButtons'
import { ComplianceBadgePill } from './shared/ComplianceBadgePill'

// ── MockupBuilder ─────────────────────────────────────────────────────────

type MockupBuilderBlock = {
  blockType: 'mockupBuilder'
  mockupType: 'callRecording' | 'transcriptPreview' | 'dashboardPreview' | 'chartPreview' | 'complianceCert' | 'emailInbox'
  eyebrow?: string
  heading?: string
  description?: string
  callContent?: {
    analystName?: string
    expertName?: string
    lines?: Array<{ speaker: 'analyst' | 'expert'; text: string }>
    badges?: string[]
  }
  transcriptContent?: {
    documentTitle?: string
    expertId?: string
    sector?: string
    sections?: Array<{ heading: string; preview?: string }>
  }
  dashboardContent?: {
    tiles?: Array<{ label: string; value: string; delta?: string }>
  }
  chartContent?: {
    title?: string
    chartType?: 'sparkline' | 'bars' | 'area'
    dataPoints?: Array<{ value: number }>
  }
  frameStyle?: 'glass' | 'surface' | 'borderless'
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function MockupBuilderRenderer({ block }: { block: MockupBuilderBlock }) {
  const frame =
    block.frameStyle === 'glass'
      ? 'glass'
      : block.frameStyle === 'surface'
      ? 'border border-[var(--border)] bg-[var(--surface)]'
      : ''
  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
      <SectionHeader
        eyebrow={block.eyebrow}
        heading={block.heading ? <MintGradientHeading text={block.heading} /> : undefined}
        description={block.description}
        alignment="center"
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`mx-auto max-w-3xl rounded-2xl p-6 ${frame}`}
      >
        {block.mockupType === 'callRecording' && <CallRecording content={block.callContent} />}
        {block.mockupType === 'transcriptPreview' && <TranscriptPreview content={block.transcriptContent} />}
        {block.mockupType === 'dashboardPreview' && <DashboardPreview content={block.dashboardContent} />}
        {block.mockupType === 'chartPreview' && <ChartPreview content={block.chartContent} />}
        {block.mockupType === 'complianceCert' && <ComplianceCert />}
        {block.mockupType === 'emailInbox' && <EmailInbox />}
      </motion.div>
    </SectionShell>
  )
}

function CallRecording({ content }: { content?: MockupBuilderBlock['callContent'] }) {
  const lines = content?.lines ?? []
  const badges = content?.badges ?? ['mnpi-screened', 'pii-redacted', 'compliance-certified', 'expert-anonymised']
  return (
    <div>
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--accent)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse-soft" />
          Recording · 47:21
        </span>
        <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--mist)]">
          <span>{content?.analystName ?? 'Analyst'}</span>
          <span>↔</span>
          <span>{content?.expertName ?? 'Expert'}</span>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {lines.map((l, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: l.speaker === 'analyst' ? -8 : 8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
            className={`flex gap-3 ${l.speaker === 'expert' ? 'flex-row' : ''}`}
          >
            <span className={`mt-0.5 w-16 shrink-0 font-mono text-[10px] uppercase tracking-[0.08em] ${l.speaker === 'expert' ? 'text-[var(--accent)]' : 'text-[var(--mist)]'}`}>
              {l.speaker === 'expert' ? 'Expert' : 'Analyst'}
            </span>
            <p className="text-[14px] leading-relaxed text-[var(--ink)]">{l.text}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-1.5 border-t border-[var(--border)] pt-4">
        {badges.map((b) => (
          <ComplianceBadgePill key={b} value={b} size="xs" />
        ))}
      </div>
    </div>
  )
}

function TranscriptPreview({ content }: { content?: MockupBuilderBlock['transcriptContent'] }) {
  return (
    <div>
      <div className="flex items-start justify-between border-b border-[var(--border)] pb-3">
        <div>
          <h4 className="text-[16px] font-medium text-[var(--ink)]">{content?.documentTitle ?? 'Expert call transcript'}</h4>
          {content?.sector && <span className="mt-1 inline-block font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--accent)]">{content.sector}</span>}
        </div>
        {content?.expertId && (
          <span className="inline-flex items-center rounded-md border border-[var(--border)] px-2 py-0.5 font-mono text-[11px] text-[var(--ink)]">
            {content.expertId}
          </span>
        )}
      </div>
      <div className="mt-4 space-y-4">
        {(content?.sections ?? []).map((s, i) => (
          <div key={i}>
            <h5 className="text-[13px] font-medium text-[var(--accent)]">{s.heading}</h5>
            {s.preview && <p className="mt-1 text-[13px] leading-relaxed text-[var(--ink-2)]">{s.preview}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

function DashboardPreview({ content }: { content?: MockupBuilderBlock['dashboardContent'] }) {
  const tiles = content?.tiles ?? []
  return (
    <div>
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <h4 className="text-[14px] font-medium text-[var(--ink)]">Coverage dashboard</h4>
        <span className="font-mono text-[11px] text-[var(--mist)]">Live</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {tiles.map((t, i) => (
          <div key={i} className="rounded-md border border-[var(--border)] bg-[var(--bg)] p-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--mist)]">{t.label}</span>
            <div className="mt-1 font-mono text-[18px] font-semibold tabular-nums text-[var(--ink)]">{t.value}</div>
            {t.delta && <span className="font-mono text-[11px] text-[var(--accent)]">{t.delta}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

function ChartPreview({ content }: { content?: MockupBuilderBlock['chartContent'] }) {
  const points = content?.dataPoints?.map((p) => p.value) ?? [12, 18, 14, 22, 28, 24, 32, 38]
  const max = Math.max(...points, 1)
  return (
    <div>
      <h4 className="text-[14px] font-medium text-[var(--ink)]">{content?.title ?? 'Trend'}</h4>
      <div className="mt-4 flex h-24 items-end gap-2">
        {points.map((v, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 origin-bottom rounded-t bg-gradient-to-t from-mint-700 to-mint-300"
            style={{ height: `${(v / max) * 100}%` }}
          />
        ))}
      </div>
    </div>
  )
}

function ComplianceCert() {
  return (
    <div className="text-center">
      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--mist)]">Compliance certificate</div>
      <h4 className="mt-2 text-[20px] font-medium text-[var(--ink)]">Transcript IQ · MNPI Screened</h4>
      <p className="mt-2 text-[12px] text-[var(--mist)]">Issued 2026.04.29 · Verified by Nextyn Advisory compliance review</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
        <ComplianceBadgePill value="mnpi-screened" />
        <ComplianceBadgePill value="pii-redacted" />
        <ComplianceBadgePill value="compliance-certified" />
        <ComplianceBadgePill value="expert-anonymised" />
      </div>
    </div>
  )
}

function EmailInbox() {
  return (
    <div>
      <div className="border-b border-[var(--border)] pb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--mist)]">Inbox</div>
      <div className="mt-3 space-y-2">
        {['Your transcript: $LLY GLP-1 dynamics', 'Weekly research briefing', 'Custom transcript ready for review'].map((subject, i) => (
          <div key={i} className="flex items-center justify-between rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2">
            <div>
              <div className="text-[13px] font-medium text-[var(--ink)]">{subject}</div>
              <div className="font-mono text-[10px] text-[var(--mist)]">Transcript IQ · just now</div>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--accent)]">Open</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── MeshGradientPanel ─────────────────────────────────────────────────────

type MeshGradientBlock = {
  blockType: 'meshGradientPanel'
  eyebrow?: string
  heading: string
  body?: string
  ctas?: Array<{ label: string; url: string; variant?: string; magnetic?: boolean }>
  animated?: boolean
  intensity?: 'subtle' | 'medium' | 'vivid'
  minHeightVh?: number
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function MeshGradientPanelRenderer({ block }: { block: MeshGradientBlock }) {
  const intensityOpacity = block.intensity === 'vivid' ? 1 : block.intensity === 'medium' ? 0.7 : 0.4
  return (
    <SectionShell background="clean" spacing={block.spacing} anchorId={block.anchorId} contained={false}>
      <div
        className="relative overflow-hidden"
        style={{ minHeight: `${block.minHeightVh ?? 60}vh`, opacity: 1 }}
      >
        <div className="absolute inset-0 bg-variant-mesh" style={{ opacity: intensityOpacity }} />
        {block.animated && (
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-variant-mesh"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
            style={{ opacity: intensityOpacity * 0.6 }}
          />
        )}
        <div className="relative mx-auto flex h-full max-w-[1240px] items-center px-6 py-24">
          <div className="max-w-2xl">
            {block.eyebrow && (
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--accent)]">{block.eyebrow}</span>
            )}
            <h2 className="mt-3 text-[44px] sm:text-[64px] leading-[1.05] tracking-[-0.04em] font-semibold text-[var(--ink)] text-balance">
              <MintGradientHeading text={block.heading} />
            </h2>
            {block.body && (
              <p className="mt-5 text-[18px] leading-relaxed text-[var(--ink-2)]">{block.body}</p>
            )}
            {block.ctas && block.ctas.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <CTAButtons ctas={block.ctas as never} />
              </div>
            )}
          </div>
        </div>
      </div>
    </SectionShell>
  )
}

// ── TextMaskImage ─────────────────────────────────────────────────────────

type TextMaskBlock = {
  blockType: 'textMaskImage'
  eyebrow?: string
  maskedText: string
  subheading?: string
  image: { url?: string; alt?: string }
  maskFallback?: 'mintGradient' | 'mintSolid' | 'inkSolid'
  parallax?: boolean
  ctas?: Array<{ label: string; url: string; variant?: string; magnetic?: boolean }>
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function TextMaskImageRenderer({ block }: { block: TextMaskBlock }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const yImg = useTransform(scrollYProgress, [0, 1], [0, -50])
  const fallback = block.maskFallback ?? 'mintGradient'
  const fallbackStyle =
    fallback === 'mintGradient'
      ? { background: 'linear-gradient(135deg, #10B981 0%, #6EE7B7 100%)' }
      : fallback === 'mintSolid'
      ? { background: 'var(--accent)' }
      : { background: 'var(--ink)' }

  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
      <div ref={ref} className="relative text-center">
        {block.eyebrow && (
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--accent)]">{block.eyebrow}</span>
        )}
        <h2
          className="mt-3 text-[80px] sm:text-[140px] lg:text-[200px] leading-[0.9] font-bold text-balance text-mask-image"
          style={
            block.image.url
              ? {
                  backgroundImage: `url(${block.image.url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : fallbackStyle
          }
        >
          {block.maskedText}
        </h2>
        {block.subheading && (
          <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-relaxed text-[var(--ink-2)]">{block.subheading}</p>
        )}
        {block.ctas && block.ctas.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <CTAButtons ctas={block.ctas as never} />
          </div>
        )}
      </div>
    </SectionShell>
  )
}

// ── NumberPosters ─────────────────────────────────────────────────────────

type NumberPostersBlock = {
  blockType: 'numberPosters'
  eyebrow?: string
  heading?: string
  description?: string
  posters?: Array<{
    number: string
    caption: string
    subcaption?: string
    tone?: 'mintGradient' | 'inkSolid' | 'mintSolid' | 'outline'
  }>
  layout?: 'horizontal' | 'stacked' | 'single'
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function NumberPostersRenderer({ block }: { block: NumberPostersBlock }) {
  const posters = block.posters ?? []
  const layout = block.layout ?? 'horizontal'
  const grid = layout === 'horizontal' ? `grid-cols-1 sm:grid-cols-${Math.min(posters.length, 4)}` : layout === 'single' ? 'grid-cols-1' : 'grid-cols-1'

  function toneClass(tone?: string) {
    if (tone === 'inkSolid') return 'text-[var(--ink)]'
    if (tone === 'mintSolid') return 'text-[var(--accent)]'
    if (tone === 'outline') return 'text-transparent [-webkit-text-stroke:2px_var(--accent)]'
    return 'text-mint-gradient'
  }

  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
      <SectionHeader
        eyebrow={block.eyebrow}
        heading={block.heading ? <MintGradientHeading text={block.heading} /> : undefined}
        description={block.description}
      />
      <div className={`grid gap-12 ${grid}`}>
        {posters.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <div className={`font-mono leading-none tracking-[-0.04em] font-semibold ${toneClass(p.tone)} ${
              layout === 'single' ? 'text-[120px] sm:text-[200px]' : 'text-[80px] sm:text-[120px]'
            }`}>
              {p.number}
            </div>
            <div className="mt-4 text-[16px] font-medium text-[var(--ink)]">{p.caption}</div>
            {p.subcaption && <div className="mt-1 text-[13px] text-[var(--mist)]">{p.subcaption}</div>}
          </motion.div>
        ))}
      </div>
    </SectionShell>
  )
}

// ── QuoteSpotlight ────────────────────────────────────────────────────────

type QuoteSpotlightBlock = {
  blockType: 'quoteSpotlight'
  eyebrow?: string
  quote: string
  attributionName?: string
  attributionRole?: string
  attributionImage?: { url?: string }
  ctas?: Array<{ label: string; url: string; variant?: string; magnetic?: boolean }>
  visualBg?: 'mintTint' | 'mesh' | 'ink' | 'clean'
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function QuoteSpotlightRenderer({ block }: { block: QuoteSpotlightBlock }) {
  const bgClass =
    block.visualBg === 'ink'
      ? 'bg-[var(--ink)] text-[var(--bg)]'
      : block.visualBg === 'mesh'
      ? 'bg-variant-mesh'
      : block.visualBg === 'clean'
      ? 'bg-[var(--surface)]'
      : 'bg-[var(--accent-tint)]'
  return (
    <SectionShell background="clean" spacing={block.spacing} anchorId={block.anchorId} contained={false}>
      <div className={`relative ${bgClass} py-24 px-6`}>
        <div className="mx-auto max-w-3xl text-center">
          {block.eyebrow && (
            <span className={`font-mono text-[11px] uppercase tracking-[0.12em] ${block.visualBg === 'ink' ? 'text-[var(--accent-bright)]' : 'text-[var(--accent)]'}`}>
              {block.eyebrow}
            </span>
          )}
          <p className={`mt-4 text-[28px] sm:text-[40px] leading-[1.15] tracking-[-0.025em] font-medium text-balance ${block.visualBg === 'ink' ? 'text-[var(--bg)]' : 'text-[var(--ink)]'}`}>
            “{block.quote}”
          </p>
          {(block.attributionName || block.attributionRole) && (
            <div className="mt-8 flex items-center justify-center gap-3">
              {block.attributionImage?.url && (
                <Image src={block.attributionImage.url} alt="" width={40} height={40} className="rounded-full border border-[var(--border)] object-cover" />
              )}
              <div className="text-left">
                {block.attributionName && (
                  <div className={`text-[14px] font-medium ${block.visualBg === 'ink' ? 'text-[var(--bg)]' : 'text-[var(--ink)]'}`}>{block.attributionName}</div>
                )}
                {block.attributionRole && (
                  <div className={`text-[12px] ${block.visualBg === 'ink' ? 'text-[var(--bg)]/70' : 'text-[var(--mist)]'}`}>{block.attributionRole}</div>
                )}
              </div>
            </div>
          )}
          {block.ctas && block.ctas.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <CTAButtons ctas={block.ctas as never} />
            </div>
          )}
        </div>
      </div>
    </SectionShell>
  )
}

// ── ComparisonTicker ──────────────────────────────────────────────────────

type ComparisonTickerBlock = {
  blockType: 'comparisonTicker'
  eyebrow?: string
  heading?: string
  description?: string
  left: { label: string; value: string; note?: string }
  right: { label: string; value: string; note?: string }
  animateOnScroll?: boolean
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

function TickerValue({ value, animate: animateProp = false }: { value: string; animate?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const mv = useMotionValue(0)
  const display = useTransform(mv, (v) => {
    const numeric = parseFloat(value.replace(/[^0-9.]/g, '') || '0')
    const prefix = value.match(/^[^0-9]+/)?.[0] ?? ''
    const suffix = value.match(/[^0-9.]+$/)?.[0] ?? ''
    return `${prefix}${Math.round(v)}${suffix}`
  })

  useEffect(() => {
    if (!animateProp || !inView) return
    const numeric = parseFloat(value.replace(/[^0-9.]/g, '') || '0')
    const controls = animate(mv, numeric, { duration: 1.6, ease: [0.16, 1, 0.3, 1] })
    return () => controls.stop()
  }, [animateProp, inView, mv, value])

  if (!animateProp || !/[0-9]/.test(value)) {
    return <span ref={ref}>{value}</span>
  }
  return <motion.span ref={ref}>{display}</motion.span>
}

export function ComparisonTickerRenderer({ block }: { block: ComparisonTickerBlock }) {
  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
      <SectionHeader
        eyebrow={block.eyebrow}
        heading={block.heading ? <MintGradientHeading text={block.heading} /> : undefined}
        description={block.description}
        alignment="center"
      />
      <div className="mx-auto grid max-w-4xl items-stretch gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-[1fr_auto_1fr]">
        <div className="bg-[var(--surface)] p-8 text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--mist)]">{block.left.label}</div>
          <div className="mt-3 font-mono text-[40px] sm:text-[56px] font-semibold tabular-nums text-[var(--ink-2)]">
            <TickerValue value={block.left.value} animate={block.animateOnScroll} />
          </div>
          {block.left.note && <div className="mt-2 text-[13px] text-[var(--mist)]">{block.left.note}</div>}
        </div>
        <div className="hidden items-center justify-center bg-[var(--bg)] px-3 sm:flex">
          <span className="font-mono text-[14px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">vs</span>
        </div>
        <div className="bg-[var(--accent-tint)] p-8 text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--accent)]">{block.right.label}</div>
          <div className="mt-3 font-mono text-[40px] sm:text-[56px] font-semibold tabular-nums text-[var(--accent)]">
            <TickerValue value={block.right.value} animate={block.animateOnScroll} />
          </div>
          {block.right.note && <div className="mt-2 text-[13px] text-[var(--ink-2)]">{block.right.note}</div>}
        </div>
      </div>
    </SectionShell>
  )
}
