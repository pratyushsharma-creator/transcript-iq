'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform } from 'motion/react'
import { useRef, useState, useEffect } from 'react'
import { SectionShell, SectionHeader, MintGradientHeading } from './SectionShell'

// ── ScrollPinned ──────────────────────────────────────────────────────────

type ScrollPinnedBlock = {
  blockType: 'scrollPinned'
  eyebrow?: string
  heading?: string
  pinSide?: 'left' | 'right'
  panels?: Array<{ title: string; body?: string; image?: { url?: string } }>
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function ScrollPinnedRenderer({ block }: { block: ScrollPinnedBlock }) {
  const panels = block.panels ?? []
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })
  const activePanel = useTransform(scrollYProgress, (v) =>
    Math.min(panels.length - 1, Math.max(0, Math.floor(v * panels.length))),
  )
  const [active, setActive] = useState(0)
  useEffect(() => activePanel.on('change', (v) => setActive(v)), [activePanel])

  const pinRight = block.pinSide === 'right'

  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
      {(block.eyebrow || block.heading) && (
        <SectionHeader
          eyebrow={block.eyebrow}
          heading={block.heading ? <MintGradientHeading text={block.heading} /> : undefined}
        />
      )}
      <div ref={containerRef} className="relative" style={{ height: `${panels.length * 80}vh` }}>
        <div className={`sticky top-20 grid items-center gap-12 lg:grid-cols-2`}>
          <div className={pinRight ? 'order-1' : 'order-2 lg:order-1'}>
            <div className="space-y-12 py-8">
              {panels.map((p, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: i === active ? 1 : 0.3 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--accent)]">
                    {String(i + 1).padStart(2, '0')} / {String(panels.length).padStart(2, '0')}
                  </span>
                  <h3 className="mt-2 text-[24px] sm:text-[32px] font-medium leading-[1.2] text-[var(--ink)]">{p.title}</h3>
                  {p.body && <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--ink-2)]">{p.body}</p>}
                </motion.div>
              ))}
            </div>
          </div>
          <div className={`relative aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] ${pinRight ? 'order-2' : 'order-1 lg:order-2'}`}>
            {panels.map((p, i) => (
              <motion.div
                key={i}
                animate={{ opacity: i === active ? 1 : 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                {p.image?.url ? (
                  <Image src={p.image.url} alt="" fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-variant-mesh">
                    <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--mist)]">
                      Panel {i + 1}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  )
}

// ── BeforeAfterSlider ─────────────────────────────────────────────────────

type BeforeAfterSliderBlock = {
  blockType: 'beforeAfterSlider'
  eyebrow?: string
  heading?: string
  description?: string
  before: { label?: string; image: { url?: string }; caption?: string }
  after: { label?: string; image: { url?: string }; caption?: string }
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function BeforeAfterSliderRenderer({ block }: { block: BeforeAfterSliderBlock }) {
  const [pos, setPos] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX
      const next = ((x - rect.left) / rect.width) * 100
      setPos(Math.max(2, Math.min(98, next)))
    }
    const onUp = () => { dragging.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchend', onUp)
    }
  }, [])

  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
      <SectionHeader
        eyebrow={block.eyebrow}
        heading={block.heading ? <MintGradientHeading text={block.heading} /> : undefined}
        description={block.description}
      />
      <div
        ref={containerRef}
        className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] select-none"
      >
        {block.before.image.url && (
          <Image src={block.before.image.url} alt={block.before.label ?? 'Before'} fill className="object-cover" />
        )}
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
          {block.after.image.url && (
            <Image src={block.after.image.url} alt={block.after.label ?? 'After'} fill className="object-cover" />
          )}
        </div>
        <div className="absolute inset-y-0" style={{ left: `${pos}%` }}>
          <div className="absolute inset-y-0 -translate-x-1/2 w-px bg-[var(--accent)] shadow-cta" />
          <button
            onMouseDown={() => { dragging.current = true }}
            onTouchStart={() => { dragging.current = true }}
            className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--accent)] bg-[var(--bg)] text-[var(--accent)] cursor-ew-resize shadow-cta"
            aria-label="Drag to compare"
          >
            ⇄
          </button>
        </div>
        <span className="absolute bottom-4 left-4 inline-flex items-center rounded-md border border-[var(--border)] bg-[var(--bg)]/80 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--ink)] backdrop-blur">
          {block.before.label ?? 'Before'}
        </span>
        <span className="absolute bottom-4 right-4 inline-flex items-center rounded-md border border-[var(--accent-border)] bg-[var(--accent-tint)] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--accent)] backdrop-blur">
          {block.after.label ?? 'After'}
        </span>
      </div>
    </SectionShell>
  )
}

// ── ImageReveal ───────────────────────────────────────────────────────────

type ImageRevealBlock = {
  blockType: 'imageReveal'
  eyebrow?: string
  heading?: string
  body?: string
  image: { url?: string; alt?: string }
  revealStyle?: 'mask-up' | 'iris' | 'sweep-right' | 'pixelate'
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function ImageRevealRenderer({ block }: { block: ImageRevealBlock }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const clip = useTransform(scrollYProgress, [0, 0.5], ['inset(100% 0 0 0)', 'inset(0% 0 0 0)'])
  const sweepClip = useTransform(scrollYProgress, [0, 0.5], ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'])
  const irisClip = useTransform(scrollYProgress, [0, 0.5], ['circle(0% at 50% 50%)', 'circle(80% at 50% 50%)'])

  const style = block.revealStyle ?? 'mask-up'
  const clipValue =
    style === 'sweep-right' ? sweepClip : style === 'iris' ? irisClip : clip

  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
      <SectionHeader
        eyebrow={block.eyebrow}
        heading={block.heading ? <MintGradientHeading text={block.heading} /> : undefined}
        description={block.body}
        alignment="center"
      />
      <div ref={ref} className="relative mx-auto aspect-[16/9] w-full max-w-5xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        {block.image.url ? (
          <motion.img
            src={block.image.url}
            alt={block.image.alt ?? ''}
            style={style === 'iris' ? { clipPath: clipValue as never } : { clipPath: clipValue as never }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-variant-mesh">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--mist)]">[Image]</span>
          </div>
        )}
      </div>
    </SectionShell>
  )
}

// ── StackedCards ──────────────────────────────────────────────────────────

type StackedCardsBlock = {
  blockType: 'stackedCards'
  eyebrow?: string
  heading?: string
  description?: string
  cards?: Array<{ eyebrow?: string; title: string; body?: string; image?: { url?: string }; tone?: 'neutral' | 'mint' | 'ink' }>
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

const STACKED_TONE: Record<string, string> = {
  neutral: 'bg-[var(--surface)] border-[var(--border)]',
  mint: 'bg-[var(--accent-tint)] border-[var(--accent-border)]',
  ink: 'bg-[var(--ink)] text-[var(--bg)] border-[var(--ink-2)]',
}

export function StackedCardsRenderer({ block }: { block: StackedCardsBlock }) {
  const cards = block.cards ?? []
  const containerRef = useRef<HTMLDivElement>(null)
  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
      <SectionHeader
        eyebrow={block.eyebrow}
        heading={block.heading ? <MintGradientHeading text={block.heading} /> : undefined}
        description={block.description}
      />
      <div ref={containerRef} className="relative" style={{ height: `${cards.length * 70}vh` }}>
        {cards.map((c, i) => (
          <StackedCardItem key={i} index={i} total={cards.length} card={c} containerRef={containerRef} />
        ))}
      </div>
    </SectionShell>
  )
}

function StackedCardItem({
  index,
  total,
  card,
  containerRef,
}: {
  index: number
  total: number
  card: NonNullable<StackedCardsBlock['cards']>[number]
  containerRef: React.RefObject<HTMLDivElement | null>
}) {
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })
  const start = index / total
  const end = (index + 1) / total
  const y = useTransform(scrollYProgress, [start, end], [0, -50])
  const scale = useTransform(scrollYProgress, [start, end], [1, 0.96])
  return (
    <motion.div
      style={{ y, scale, top: `${index * 8}vh` }}
      className={`sticky mx-auto max-w-3xl rounded-2xl border p-8 ${STACKED_TONE[card.tone ?? 'neutral']}`}
    >
      {card.eyebrow && (
        <span className={`font-mono text-[10px] uppercase tracking-[0.12em] ${card.tone === 'ink' ? 'text-[var(--accent-bright)]' : 'text-[var(--accent)]'}`}>
          {card.eyebrow}
        </span>
      )}
      <h3 className={`mt-2 text-[24px] sm:text-[32px] font-medium leading-[1.2] text-balance`}>{card.title}</h3>
      {card.body && <p className={`mt-4 text-[15px] leading-relaxed ${card.tone === 'ink' ? 'text-[var(--bg)]/80' : 'text-[var(--ink-2)]'}`}>{card.body}</p>}
      {card.image?.url && (
        <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-xl border border-[var(--border)]">
          <Image src={card.image.url} alt="" fill className="object-cover" />
        </div>
      )}
    </motion.div>
  )
}
