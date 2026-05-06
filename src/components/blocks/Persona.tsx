'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { SectionShell, SectionHeader, MintGradientHeading } from './SectionShell'
import { CTAButtons } from './CTAButtons'

// ── Geometric persona markers — proper SVG, not unicode glyphs ───────────

function PersonaMark({ shape, size = 56 }: { shape?: string; size?: number }) {
  const stroke = 'var(--accent)'
  const fill = 'transparent'
  const props = { width: size, height: size, viewBox: '0 0 56 56', fill: 'none' as const }
  switch (shape) {
    case 'diamond':
      return (
        <svg {...props}>
          <path d="M28 4 L52 28 L28 52 L4 28 Z" stroke={stroke} strokeWidth="1.5" fill="var(--accent-tint)" />
          <path d="M28 16 L40 28 L28 40 L16 28 Z" stroke={stroke} strokeWidth="1" fill={fill} />
          <circle cx="28" cy="28" r="2" fill={stroke} />
        </svg>
      )
    case 'diamondOpen':
      return (
        <svg {...props}>
          <path d="M28 4 L52 28 L28 52 L4 28 Z" stroke={stroke} strokeWidth="1.5" fill={fill} strokeDasharray="2 3" />
          <path d="M28 16 L40 28 L28 40 L16 28 Z" stroke={stroke} strokeWidth="1" fill="var(--accent-tint)" />
        </svg>
      )
    case 'grid':
      return (
        <svg {...props}>
          <rect x="4" y="4" width="48" height="48" stroke={stroke} strokeWidth="1.5" fill="var(--accent-tint)" />
          <line x1="20" y1="4" x2="20" y2="52" stroke={stroke} strokeWidth="0.75" />
          <line x1="36" y1="4" x2="36" y2="52" stroke={stroke} strokeWidth="0.75" />
          <line x1="4" y1="20" x2="52" y2="20" stroke={stroke} strokeWidth="0.75" />
          <line x1="4" y1="36" x2="52" y2="36" stroke={stroke} strokeWidth="0.75" />
          <rect x="20" y="20" width="16" height="16" fill={stroke} fillOpacity="0.6" />
        </svg>
      )
    case 'triangle':
      return (
        <svg {...props}>
          <path d="M28 6 L52 50 L4 50 Z" stroke={stroke} strokeWidth="1.5" fill="var(--accent-tint)" />
          <path d="M28 22 L40 46 L16 46 Z" stroke={stroke} strokeWidth="1" fill={fill} />
        </svg>
      )
    case 'square':
      return (
        <svg {...props}>
          <rect x="6" y="6" width="44" height="44" stroke={stroke} strokeWidth="1.5" fill="var(--accent-tint)" />
          <rect x="18" y="18" width="20" height="20" stroke={stroke} strokeWidth="1" fill={fill} />
          <circle cx="28" cy="28" r="2" fill={stroke} />
        </svg>
      )
    case 'circle':
      return (
        <svg {...props}>
          <circle cx="28" cy="28" r="22" stroke={stroke} strokeWidth="1.5" fill="var(--accent-tint)" />
          <circle cx="28" cy="28" r="10" stroke={stroke} strokeWidth="1" fill={fill} />
          <circle cx="28" cy="28" r="2" fill={stroke} />
        </svg>
      )
    default:
      return (
        <svg {...props}>
          <circle cx="28" cy="28" r="22" stroke={stroke} strokeWidth="1.5" fill="var(--accent-tint)" />
        </svg>
      )
  }
}

// ── PersonaGrid — editorial standard OR bento with featured snippet ──────

type PersonaSnippetLine = { speaker: 'analyst' | 'expert'; text: string }

type Persona = {
  icon?: string
  title: string
  description?: string
  bullets?: Array<{ item: string }>
  snippet?: {
    expertId?: string
    duration?: string
    lines?: PersonaSnippetLine[]
  }
  href?: string
}

type PersonaGridBlock = {
  blockType: 'personaGrid'
  eyebrow?: string
  heading?: string
  description?: string
  columns?: '2' | '3' | '4'
  layout?: 'standard' | 'bento' | 'guidebook'
  cardHover?: 'none' | 'lift' | 'moving-border' | 'spotlight'
  cards?: Persona[]
  guidebookCta?: { label?: string; url?: string }
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

function renderHighlightedText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((p, i) => {
    const m = p.match(/^\*\*(.+)\*\*$/)
    if (m) {
      return (
        <em
          key={i}
          className="not-italic rounded-sm px-1 py-0"
          style={{ background: 'rgba(232, 217, 138, 0.12)', color: '#e8d98a' }}
        >
          {m[1]}
        </em>
      )
    }
    return <span key={i}>{p}</span>
  })
}

function PersonaSnippet({
  expertId,
  duration,
  lines,
}: {
  expertId?: string
  duration?: string
  lines: PersonaSnippetLine[]
}) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-5">
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--mist)]">
        <span>
          {expertId ?? 'EXP-247'} · RECORDING · {duration ?? '47:21'}
        </span>
        <span className="inline-flex items-center gap-1.5 text-[var(--accent)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          MNPI SCREENED
        </span>
      </div>
      <div className="space-y-3">
        {lines.map((l, i) => (
          <div key={i} className="flex gap-3">
            <span
              className={`shrink-0 pt-px font-mono text-[9px] uppercase tracking-[0.1em] ${
                l.speaker === 'expert' ? 'text-[var(--accent)]' : 'text-[var(--mist)]'
              }`}
              style={{ minWidth: '55px' }}
            >
              {l.speaker === 'expert' ? 'Expert' : 'Analyst'}
            </span>
            <p className="text-[12px] leading-[1.5] text-[var(--ink-2)]">
              {renderHighlightedText(l.text)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function PersonaGridRenderer({ block }: { block: PersonaGridBlock }) {
  const layout = block.layout ?? 'standard'
  const personas = block.cards ?? []
  const cols = block.columns ?? '4'

  // ── Guidebook layout — sticky left, scrollytelling cards on right ────
  if (layout === 'guidebook') {
    return <PersonaGuidebookLayout block={block} personas={personas} />
  }

  // ── Bento layout — first persona is featured (full-width with snippet)
  if (layout === 'bento' && personas.length >= 2) {
    const [featured, ...rest] = personas
    return (
      <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
        <SectionHeader
          eyebrow={block.eyebrow}
          heading={block.heading ? <MintGradientHeading text={block.heading} /> : undefined}
          description={block.description}
        />
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--border)]">
          {/* Featured row — full width, internal 2-col */}
          <div
            className="grid items-stretch gap-px bg-[var(--border)] lg:grid-cols-2"
            style={{
              backgroundImage:
                'linear-gradient(135deg, var(--surface) 0%, rgba(14,217,138,0.04) 100%)',
            }}
          >
            <div className="bg-[var(--surface)] p-9 lg:p-10">
              <div className="mb-3.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--accent)]">
                {featured.title}
              </div>
              <h3 className="text-[24px] sm:text-[28px] leading-[1.15] tracking-[-0.015em] font-semibold text-[var(--ink)] text-balance">
                {featured.description?.split('.')[0]}
                {featured.description?.includes('.') ? '.' : ''}
              </h3>
              {featured.description && featured.description.includes('.') && (
                <p className="mt-3 text-[14px] leading-[1.6] text-[var(--ink-2)]">
                  {featured.description.split('.').slice(1).join('.').trim()}
                </p>
              )}
              {featured.bullets && featured.bullets.length > 0 && (
                <ul className="mt-5 flex flex-col gap-2.5">
                  {featured.bullets.map((b, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-[13px] leading-[1.5] text-[var(--ink-2)]"
                    >
                      <span className="mt-[7px] inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
                      {b.item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div
              className="bg-[var(--surface)] p-7 lg:p-9"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, var(--surface) 0%, rgba(14,217,138,0.06) 100%)',
              }}
            >
              {featured.snippet?.lines && featured.snippet.lines.length > 0 ? (
                <PersonaSnippet
                  expertId={featured.snippet.expertId}
                  duration={featured.snippet.duration}
                  lines={featured.snippet.lines}
                />
              ) : (
                <div className="flex h-full items-center justify-center font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--mist)]">
                  [Add a snippet on this persona to render a transcript excerpt here]
                </div>
              )}
            </div>
          </div>
          {/* Remaining personas — equal cards in a row */}
          {rest.length > 0 && (
            <div
              className="grid grid-cols-1 gap-px bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-3"
            >
              {rest.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-[var(--surface)] p-9 transition-colors duration-base hover:bg-[var(--surface-2)]"
                >
                  <div className="mb-3.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--accent)]">
                    {p.title}
                  </div>
                  {p.description && (
                    <h4 className="text-[20px] leading-[1.2] tracking-[-0.015em] font-semibold text-[var(--ink)] mb-3 text-balance">
                      {p.description.split('.')[0]}
                      {p.description.includes('.') ? '.' : ''}
                    </h4>
                  )}
                  {p.description && p.description.includes('.') && (
                    <p className="text-[13px] leading-[1.6] text-[var(--ink-2)] mb-4">
                      {p.description.split('.').slice(1).join('.').trim()}
                    </p>
                  )}
                  {p.bullets && p.bullets.length > 0 && (
                    <ul className="flex flex-col gap-2">
                      {p.bullets.map((b, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-2.5 text-[13px] leading-[1.5] text-[var(--ink-2)]"
                        >
                          <span className="mt-[7px] inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
                          {b.item}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </SectionShell>
    )
  }

  // ── Standard layout — HoverEffect pattern with animated accent pad ────
  return <PersonaStandardGrid block={block} personas={personas} cols={cols} />
}

/**
 * Guidebook layout — pinned scrollytelling pattern.
 *
 * The section is taller than the viewport (its height grows with the number
 * of cards). Inside it, a sticky inner container fills the viewport while
 * the section is in view. The right column is a fixed-height "track" with
 * overflow-hidden; the cards inside translate vertically based on page
 * scroll progress, bringing one card into view at a time. Left column with
 * eyebrow + heading + CTA stays static. Mobile (<lg) falls back to a simple
 * vertical stack with no scrollytelling.
 */
function PersonaGuidebookLayout({
  block,
  personas,
}: {
  block: PersonaGridBlock
  personas: Persona[]
}) {
  const [isLg, setIsLg] = useState(false)

  // Detect lg+ viewport for parallax mode
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const update = () => setIsLg(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const renderCardContent = (p: Persona, i: number) => (
    <>
      <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--mist)]">
        <span className="text-[var(--accent)]">{String(i + 1).padStart(2, '0')}</span>
        <span>/</span>
        <span>{String(personas.length).padStart(2, '0')}</span>
      </div>
      <h3 className="text-[20px] sm:text-[22px] font-semibold leading-[1.3] tracking-[-0.015em] text-[var(--ink)]">
        {p.title}
      </h3>
      {p.description && (
        <p className="mt-3 text-[14px] sm:text-[15px] leading-[1.65] text-[var(--ink-2)]">
          {p.description}
        </p>
      )}
      {p.bullets && p.bullets.length > 0 && (
        <ul className="mt-4 flex flex-col gap-1.5">
          {p.bullets.map((b, j) => (
            <li
              key={j}
              className="flex items-start gap-2 text-[13px] leading-[1.55] text-[var(--ink-2)]"
            >
              <span className="mt-[7px] inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
              {b.item}
            </li>
          ))}
        </ul>
      )}
    </>
  )

  // ── Mobile fallback — no parallax, simple vertical stack ──────────────
  if (!isLg) {
    return (
      <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          {block.eyebrow && (
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]">
              {block.eyebrow}
            </span>
          )}
          {block.heading && (
            <h2 className="mt-3 text-[32px] sm:text-[40px] leading-[1.08] tracking-[-0.025em] font-semibold text-[var(--ink)] text-balance">
              <MintGradientHeading text={block.heading} />
            </h2>
          )}
          {block.description && (
            <p className="mt-4 text-[15px] leading-[1.65] text-[var(--ink-2)]">
              {block.description}
            </p>
          )}
          {block.guidebookCta?.label && block.guidebookCta?.url && (
            <Link
              href={block.guidebookCta.url}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-btn-primary px-6 py-3 text-[14px] font-medium text-btn-primary-fg shadow-cta transition-all duration-base ease-out hover:-translate-y-px hover:bg-btn-primary-hover"
            >
              {block.guidebookCta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </motion.div>
        <div className="flex flex-col gap-4">
          {personas.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
            >
              {renderCardContent(p, i)}
            </motion.div>
          ))}
        </div>
      </SectionShell>
    )
  }

  // ── Desktop pinned scrollytelling — extracted to its own component so
  //    useScroll only runs when the section is mounted (avoids hydration
  //    warning about target ref not being attached). ─────────────────────
  return (
    <PersonaGuidebookDesktop block={block} personas={personas} renderCardContent={renderCardContent} />
  )
}

/**
 * Desktop click/autoplay-driven carousel. Replaces the broken scroll-pinning
 * approach that inflated the section to N×90vh. Section now fits its content
 * (~700px). Cards advance via progress-bar clicks or auto-cycle every 4 s.
 */
function PersonaGuidebookDesktop({
  block,
  personas,
  renderCardContent,
}: {
  block: PersonaGridBlock
  personas: Persona[]
  renderCardContent: (p: Persona, i: number) => React.ReactNode
}) {
  const [activeIdx, setActiveIdx] = useState(0)

  const TRACK_HEIGHT = 380
  const CARD_HEIGHT = 300
  const CARD_GAP = 20
  const STRIDE = CARD_HEIGHT + CARD_GAP
  const INITIAL_OFFSET = (TRACK_HEIGHT - CARD_HEIGHT) / 2

  // Auto-advance every 4 s; resets when user clicks a segment
  useEffect(() => {
    const id = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % personas.length)
    }, 4000)
    return () => clearInterval(id)
  }, [personas.length])

  const goTo = (idx: number) => {
    setActiveIdx(idx)
  }

  // Translate the card stack so the active card is centred in the track
  const y = -(activeIdx * STRIDE)

  return (
    <section
      id={block.anchorId}
      className="relative bg-[var(--bg)] py-24"
    >
      <div className="mx-auto w-full max-w-[1240px] px-6">
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_1.4fr]">
          {/* LEFT — static text + CTA + clickable progress */}
          <div>
            {block.eyebrow && (
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]">
                {block.eyebrow}
              </span>
            )}
            {block.heading && (
              <h2 className="mt-3 text-[40px] xl:text-[52px] leading-[1.05] tracking-[-0.025em] font-semibold text-[var(--ink)] text-balance">
                <MintGradientHeading text={block.heading} />
              </h2>
            )}
            {block.description && (
              <p className="mt-5 max-w-md text-[16px] leading-[1.65] text-[var(--ink-2)]">
                {block.description}
              </p>
            )}
            {block.guidebookCta?.label && block.guidebookCta?.url && (
              <Link
                href={block.guidebookCta.url}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-btn-primary px-7 py-3.5 text-[14px] font-medium text-btn-primary-fg shadow-cta transition-all duration-base ease-out hover:-translate-y-px hover:bg-btn-primary-hover"
              >
                {block.guidebookCta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}

            {/* Clickable progress indicator */}
            <div className="mt-12">
              <div className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--mist)]">
                <span className="text-[var(--accent)] tabular-nums">
                  {String(activeIdx + 1).padStart(2, '0')}
                </span>
                <span>/</span>
                <span className="tabular-nums">{String(personas.length).padStart(2, '0')}</span>
                <span className="ml-2 truncate text-[var(--ink-2)]">
                  {personas[activeIdx]?.title?.split(' — ')[0]?.split('—')[0]?.trim()}
                </span>
              </div>
              <div className="flex gap-1.5">
                {personas.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goTo(idx)}
                    aria-label={`Go to persona ${idx + 1}`}
                    className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-[var(--border)] cursor-pointer"
                  >
                    <motion.span
                      aria-hidden
                      className="absolute inset-y-0 left-0 bg-[var(--accent)]"
                      animate={{
                        width:
                          idx < activeIdx ? '100%' : idx === activeIdx ? '100%' : '0%',
                      }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — fixed-height track, cards translate via activeIdx */}
          <div
            className="relative overflow-hidden"
            style={{ height: `${TRACK_HEIGHT}px` }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16"
              style={{
                background:
                  'linear-gradient(180deg, var(--bg) 0%, transparent 100%)',
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16"
              style={{
                background:
                  'linear-gradient(0deg, var(--bg) 0%, transparent 100%)',
              }}
            />
            <motion.div
              animate={{ y }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ paddingTop: INITIAL_OFFSET }}
              className="flex flex-col"
            >
              {personas.map((p, i) => {
                const isActive = i === activeIdx
                return (
                  <div
                    key={i}
                    style={{
                      height: CARD_HEIGHT,
                      marginBottom: i < personas.length - 1 ? CARD_GAP : 0,
                    }}
                    className="shrink-0"
                  >
                    <motion.div
                      animate={{
                        opacity: isActive ? 1 : 0.35,
                        scale: isActive ? 1 : 0.97,
                      }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className={`relative h-full overflow-hidden rounded-2xl border p-7 transition-colors duration-base ${
                        isActive
                          ? 'border-[var(--accent-border)] bg-[var(--surface)]'
                          : 'border-[var(--border)] bg-[var(--surface)]'
                      }`}
                      style={{
                        boxShadow: isActive
                          ? '0 16px 48px -12px rgba(14, 217, 138, 0.22)'
                          : 'none',
                      }}
                    >
                      <motion.span
                        aria-hidden
                        className="pointer-events-none absolute inset-y-6 left-0 w-[2px] origin-top bg-[var(--accent)]"
                        animate={{
                          scaleY: isActive ? 1 : 0,
                          opacity: isActive ? 1 : 0,
                        }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      />
                      {renderCardContent(p, i)}
                    </motion.div>
                  </div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * Standard PersonaGrid layout using the Aceternity-style HoverEffect pattern:
 * a soft accent pad slides between hovered cards via Framer Motion's layoutId.
 * Cards are larger, support optional bullets, and feel premium without being noisy.
 */
function PersonaStandardGrid({
  block,
  personas,
  cols,
}: {
  block: PersonaGridBlock
  personas: Persona[]
  cols: '2' | '3' | '4'
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const gridCols = cols === '2' ? 'lg:grid-cols-2' : cols === '3' ? 'lg:grid-cols-3' : 'lg:grid-cols-4'

  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
      <SectionHeader
        eyebrow={block.eyebrow}
        heading={block.heading ? <MintGradientHeading text={block.heading} /> : undefined}
        description={block.description}
      />
      <div
        className={`relative grid gap-3 sm:grid-cols-2 ${gridCols}`}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {personas.map((p, i) => {
          const isHovered = hoveredIndex === i
          const inner = (
            <div
              role={p.href ? undefined : 'group'}
              onMouseEnter={() => setHoveredIndex(i)}
              className="group relative h-full"
            >
              {/* Animated accent pad — slides between hovered cards via layoutId */}
              <AnimatePresence>
                {isHovered && (
                  <motion.span
                    layoutId="persona-hover-pad"
                    aria-hidden
                    className="absolute inset-0 -z-10 rounded-2xl"
                    style={{
                      background:
                        'linear-gradient(180deg, var(--accent-tint-2) 0%, var(--accent-tint) 100%)',
                    }}
                    transition={{ type: 'spring', bounce: 0.18, duration: 0.55 }}
                  />
                )}
              </AnimatePresence>

              {/* Card content */}
              <div
                className={`relative flex h-full flex-col gap-5 rounded-2xl border bg-[var(--surface)] p-7 transition-all duration-base ${
                  isHovered
                    ? 'border-[var(--accent-border)]'
                    : 'border-[var(--border)]'
                }`}
              >
                {/* Top row — geometric marker + index */}
                <div className="flex items-start justify-between">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    animate={isHovered ? { rotate: 12, scale: 1.05 } : { rotate: 0, scale: 1 }}
                    className="transition-transform"
                  >
                    <PersonaMark shape={p.icon} size={52} />
                  </motion.div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--mist)]">
                    / {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Title + description */}
                <div>
                  <h3 className="text-[20px] sm:text-[22px] font-semibold leading-[1.2] tracking-[-0.015em] text-[var(--ink)]">
                    {p.title}
                  </h3>
                  {p.description && (
                    <p className="mt-3 text-[14px] leading-[1.6] text-[var(--ink-2)]">
                      {p.description}
                    </p>
                  )}
                </div>

                {/* Optional bullets */}
                {p.bullets && p.bullets.length > 0 && (
                  <ul className="flex flex-col gap-2">
                    {p.bullets.map((b, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2.5 text-[13px] leading-[1.5] text-[var(--ink-2)]"
                      >
                        <span className="mt-[7px] inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
                        {b.item}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Bottom row — accent line that draws on hover + Learn more link */}
                <div className="mt-auto flex items-end justify-between gap-3 pt-2">
                  <span
                    aria-hidden
                    className={`block h-px origin-left bg-[var(--accent)] transition-all duration-slow ease-out ${
                      isHovered ? 'w-16' : 'w-8 opacity-50'
                    }`}
                  />
                  {p.href && (
                    <span
                      className={`inline-flex items-center gap-1 text-[12px] font-medium text-[var(--accent)] transition-opacity duration-base ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      Learn more
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              {p.href ? (
                <Link href={p.href} className="block h-full">
                  {inner}
                </Link>
              ) : (
                inner
              )}
            </motion.div>
          )
        })}
      </div>
    </SectionShell>
  )
}

// ── PersonaCarousel ───────────────────────────────────────────────────────

type PersonaCarouselBlock = {
  blockType: 'personaCarousel'
  eyebrow?: string
  heading?: string
  description?: string
  personas?: Array<{
    title: string
    tagline?: string
    body?: unknown
    image?: { url?: string }
    ctas?: Array<{ label: string; url: string; variant?: string; magnetic?: boolean }>
  }>
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

export function PersonaCarouselRenderer({ block }: { block: PersonaCarouselBlock }) {
  const personas = block.personas ?? []
  const [active, setActive] = useState(0)
  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
      <SectionHeader
        eyebrow={block.eyebrow}
        heading={block.heading ? <MintGradientHeading text={block.heading} /> : undefined}
        description={block.description}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {personas.map((p, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`rounded-md border px-4 py-3 text-left text-[13px] transition-all duration-fast ${
              i === active
                ? 'border-[var(--accent)] bg-[var(--accent-tint)] text-[var(--accent)]'
                : 'border-[var(--border)] bg-[var(--surface)] text-[var(--ink-2)] hover:border-[var(--accent-border)]'
            }`}
          >
            <div className="font-medium">{p.title}</div>
            {p.tagline && <div className="mt-1 text-[11px] text-[var(--mist)]">{p.tagline}</div>}
          </button>
        ))}
      </div>
      {personas[active] && (
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="grid items-center gap-8 lg:grid-cols-2"
        >
          <div>
            <h3 className="text-[24px] font-medium text-[var(--ink)] leading-[1.2]">{personas[active].title}</h3>
            {personas[active].tagline && (
              <p className="mt-2 text-[14px] text-[var(--accent)] font-medium">{personas[active].tagline}</p>
            )}
            {!!personas[active].body && (
              <div className="mt-4 text-[15px] leading-relaxed text-[var(--ink-2)] space-y-3">
                {lexicalToText(personas[active].body as never).split('\n\n').map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}
            {personas[active].ctas && personas[active].ctas!.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <CTAButtons ctas={personas[active].ctas as never} />
              </div>
            )}
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[var(--border)] bg-variant-mesh">
            {personas[active].image?.url && (
              <Image src={personas[active].image!.url} alt="" fill className="object-cover" />
            )}
          </div>
        </motion.div>
      )}
    </SectionShell>
  )
}
