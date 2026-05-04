'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { SectionShell, SectionHeader, MintGradientHeading } from './SectionShell'

// ── ImageBlock ────────────────────────────────────────────────────────────

type ImageBlockData = {
  blockType: 'imageBlock'
  image: { url?: string; alt?: string }
  caption?: string
  variant?: 'standard' | 'framed' | 'fullBleed' | 'overlay'
  overlayText?: { heading?: string; subheading?: string }
  aspectRatio?: 'auto' | '16-9' | '4-3' | '1-1' | '3-4'
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

const ASPECT_CLASS: Record<string, string> = {
  auto: '',
  '16-9': 'aspect-video',
  '4-3': 'aspect-[4/3]',
  '1-1': 'aspect-square',
  '3-4': 'aspect-[3/4]',
}

export function ImageBlockRenderer({ block }: { block: ImageBlockData }) {
  const variant = block.variant ?? 'standard'
  const aspect = ASPECT_CLASS[block.aspectRatio ?? 'auto'] ?? ''
  const isFullBleed = variant === 'fullBleed'

  const inner = (
    <div className={`relative overflow-hidden ${variant === 'framed' ? 'rounded-2xl border border-[var(--border)]' : ''} ${aspect}`}>
      {block.image.url ? (
        <img src={block.image.url} alt={block.image.alt ?? ''} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-variant-mesh">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--mist)]">[Image]</span>
        </div>
      )}
      {variant === 'overlay' && block.overlayText && (
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-8">
          {block.overlayText.heading && (
            <h3 className="text-[28px] sm:text-[40px] font-semibold leading-[1.1] text-white text-balance">{block.overlayText.heading}</h3>
          )}
          {block.overlayText.subheading && (
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-white/80">{block.overlayText.subheading}</p>
          )}
        </div>
      )}
    </div>
  )

  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId} contained={!isFullBleed}>
      {isFullBleed ? (
        <div className="w-full">{inner}</div>
      ) : (
        <figure>
          {inner}
          {block.caption && <figcaption className="mt-3 text-center text-[12px] text-[var(--mist)]">{block.caption}</figcaption>}
        </figure>
      )}
    </SectionShell>
  )
}

// ── ImageGallery ──────────────────────────────────────────────────────────

type GalleryBlock = {
  blockType: 'imageGallery'
  eyebrow?: string
  heading?: string
  columns?: '2' | '3' | '4' | '5'
  images?: Array<{ image: { url?: string; alt?: string }; caption?: string }>
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function ImageGalleryRenderer({ block }: { block: GalleryBlock }) {
  const cols = block.columns ?? '3'
  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
      <SectionHeader eyebrow={block.eyebrow} heading={block.heading ? <MintGradientHeading text={block.heading} /> : undefined} />
      <div className={`grid gap-3 grid-cols-2 lg:grid-cols-${cols}`}>
        {(block.images ?? []).map((img, i) => (
          <motion.figure
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)]"
          >
            {img.image.url ? (
              <img src={img.image.url} alt={img.image.alt ?? ''} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-variant-mesh" />
            )}
            {img.caption && (
              <figcaption className="absolute bottom-2 left-2 right-2 rounded-sm bg-[var(--bg)]/80 px-2 py-1 font-mono text-[10px] text-[var(--ink)] backdrop-blur">
                {img.caption}
              </figcaption>
            )}
          </motion.figure>
        ))}
      </div>
    </SectionShell>
  )
}

// ── ImageMasonry ──────────────────────────────────────────────────────────

type MasonryBlock = {
  blockType: 'imageMasonry'
  eyebrow?: string
  heading?: string
  columns?: '2' | '3' | '4'
  images?: Array<{ image: { url?: string; alt?: string }; caption?: string }>
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function ImageMasonryRenderer({ block }: { block: MasonryBlock }) {
  const cols = block.columns ?? '3'
  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
      <SectionHeader eyebrow={block.eyebrow} heading={block.heading ? <MintGradientHeading text={block.heading} /> : undefined} />
      <div className={`columns-2 lg:columns-${cols} gap-3`}>
        {(block.images ?? []).map((img, i) => (
          <figure key={i} className="mb-3 break-inside-avoid overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)]">
            {img.image.url ? (
              <img src={img.image.url} alt={img.image.alt ?? ''} className="w-full" />
            ) : (
              <div className="aspect-[3/4] bg-variant-mesh" />
            )}
            {img.caption && <figcaption className="px-3 py-2 font-mono text-[10px] text-[var(--mist)]">{img.caption}</figcaption>}
          </figure>
        ))}
      </div>
    </SectionShell>
  )
}

// ── ImageCarousel ─────────────────────────────────────────────────────────

type CarouselBlock = {
  blockType: 'imageCarousel'
  eyebrow?: string
  heading?: string
  description?: string
  slides?: Array<{ image: { url?: string; alt?: string }; title?: string; caption?: string; href?: string }>
  autoplay?: boolean
  autoplaySeconds?: number
  showDots?: boolean
  showArrows?: boolean
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function ImageCarouselRenderer({ block }: { block: CarouselBlock }) {
  const slides = block.slides ?? []
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    if (!block.autoplay || slides.length < 2) return
    const id = setInterval(() => setIdx((i) => (i + 1) % slides.length), (block.autoplaySeconds ?? 5) * 1000)
    return () => clearInterval(id)
  }, [block.autoplay, block.autoplaySeconds, slides.length])

  const showArrows = block.showArrows ?? true
  const showDots = block.showDots ?? true

  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
      <SectionHeader
        eyebrow={block.eyebrow}
        heading={block.heading ? <MintGradientHeading text={block.heading} /> : undefined}
        description={block.description}
      />
      <div className="relative">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <AnimatePresence mode="wait">
            {slides[idx] && (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                {slides[idx].image.url ? (
                  <img src={slides[idx].image.url} alt={slides[idx].image.alt ?? ''} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-variant-mesh" />
                )}
                {(slides[idx].title || slides[idx].caption) && (
                  <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-[var(--bg)]/80 p-4 backdrop-blur">
                    {slides[idx].title && <h4 className="text-[16px] font-medium text-[var(--ink)]">{slides[idx].title}</h4>}
                    {slides[idx].caption && <p className="text-[12px] text-[var(--mist)]">{slides[idx].caption}</p>}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {showArrows && slides.length > 1 && (
          <>
            <button
              onClick={() => setIdx((i) => (i - 1 + slides.length) % slides.length)}
              aria-label="Previous"
              className="absolute left-4 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg)]/80 text-[var(--ink)] backdrop-blur hover:border-[var(--accent-border)]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIdx((i) => (i + 1) % slides.length)}
              aria-label="Next"
              className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg)]/80 text-[var(--ink)] backdrop-blur hover:border-[var(--accent-border)]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
        {showDots && slides.length > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-fast ${
                  i === idx ? 'w-8 bg-[var(--accent)]' : 'w-2 bg-[var(--border-2)]'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </SectionShell>
  )
}

// ── VideoBlock ────────────────────────────────────────────────────────────

type VideoBlockData = {
  blockType: 'videoBlock'
  eyebrow?: string
  heading?: string
  description?: string
  source: 'youtube' | 'vimeo' | 'hosted' | 'url'
  youtubeId?: string
  vimeoId?: string
  hostedFile?: { url?: string }
  externalUrl?: string
  poster?: { url?: string }
  autoplay?: boolean
  loop?: boolean
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function VideoBlockRenderer({ block }: { block: VideoBlockData }) {
  let src = ''
  if (block.source === 'youtube' && block.youtubeId) src = `https://www.youtube.com/embed/${block.youtubeId}`
  else if (block.source === 'vimeo' && block.vimeoId) src = `https://player.vimeo.com/video/${block.vimeoId}`
  else if (block.source === 'hosted' && block.hostedFile?.url) src = block.hostedFile.url
  else if (block.source === 'url' && block.externalUrl) src = block.externalUrl

  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
      <SectionHeader
        eyebrow={block.eyebrow}
        heading={block.heading ? <MintGradientHeading text={block.heading} /> : undefined}
        description={block.description}
      />
      <div className="aspect-video overflow-hidden rounded-2xl border border-[var(--border)] bg-black">
        {block.source === 'hosted' || block.source === 'url' ? (
          <video
            src={src}
            poster={block.poster?.url}
            autoPlay={block.autoplay}
            muted={block.autoplay}
            loop={block.loop}
            playsInline
            controls={!block.autoplay}
            className="h-full w-full object-cover"
          />
        ) : src ? (
          <iframe src={src} title="Video" allow="accelerometer; autoplay; encrypted-media" allowFullScreen className="h-full w-full" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-variant-mesh">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--mist)]">[Video]</span>
          </div>
        )}
      </div>
    </SectionShell>
  )
}

// ── AnimatedSVG ───────────────────────────────────────────────────────────

type AnimatedSVGBlock = {
  blockType: 'animatedSvg'
  eyebrow?: string
  heading?: string
  description?: string
  preset?: 'dataFlow' | 'pulseRings' | 'network' | 'soundwave' | 'pathDrawing'
  speed?: 'subtle' | 'normal' | 'energetic'
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function AnimatedSVGRenderer({ block }: { block: AnimatedSVGBlock }) {
  const preset = block.preset ?? 'dataFlow'
  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
      <SectionHeader
        eyebrow={block.eyebrow}
        heading={block.heading ? <MintGradientHeading text={block.heading} /> : undefined}
        description={block.description}
        alignment="center"
      />
      <div className="mx-auto flex max-w-3xl items-center justify-center">
        {preset === 'pulseRings' && <PulseRingsSVG />}
        {preset === 'soundwave' && <SoundwaveSVG />}
        {preset === 'dataFlow' && <DataFlowSVG />}
        {preset === 'network' && <NetworkSVG />}
        {preset === 'pathDrawing' && <PathDrawSVG />}
      </div>
    </SectionShell>
  )
}

function PulseRingsSVG() {
  return (
    <svg viewBox="0 0 200 200" className="h-64 w-64">
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx="100" cy="100" r="20"
          fill="none" stroke="var(--accent)" strokeWidth="1"
          initial={{ opacity: 0, r: 20 }}
          animate={{ opacity: [0, 0.6, 0], r: [20, 80, 80] }}
          transition={{ duration: 2.4, delay: i * 0.6, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}
      <circle cx="100" cy="100" r="6" fill="var(--accent)" />
    </svg>
  )
}

function SoundwaveSVG() {
  return (
    <svg viewBox="0 0 200 80" className="h-20 w-full max-w-md">
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.rect
          key={i}
          x={i * 8}
          width="3"
          fill="var(--accent)"
          rx="1.5"
          initial={{ y: 30, height: 20 }}
          animate={{ y: [30, 10, 30], height: [20, 60, 20] }}
          transition={{ duration: 1 + (i % 3) * 0.2, delay: (i * 0.06) % 1, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </svg>
  )
}

function DataFlowSVG() {
  return (
    <svg viewBox="0 0 400 100" className="h-24 w-full">
      <motion.path
        d="M 20 50 Q 100 10, 200 50 T 380 50"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      />
      {[0.0, 0.33, 0.66, 1.0].map((t, i) => (
        <motion.circle
          key={i}
          r="4"
          fill="var(--accent-bright)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: [0, 1, 0] }}
          viewport={{ once: true }}
          transition={{ duration: 2, delay: 1 + i * 0.4, repeat: Infinity, repeatDelay: 1 }}
        >
          <animateMotion
            dur="3s"
            repeatCount="indefinite"
            begin={`${i * 0.7}s`}
            path="M 20 50 Q 100 10, 200 50 T 380 50"
          />
        </motion.circle>
      ))}
    </svg>
  )
}

function NetworkSVG() {
  const nodes = Array.from({ length: 12 }, (_, i) => ({
    x: 50 + Math.random() * 300,
    y: 50 + Math.random() * 200,
    delay: Math.random() * 1.5,
  }))
  return (
    <svg viewBox="0 0 400 300" className="h-64 w-full">
      {nodes.flatMap((n, i) =>
        nodes.slice(i + 1).map((m, j) => {
          const d = Math.hypot(n.x - m.x, n.y - m.y)
          if (d > 120) return null
          return (
            <motion.line
              key={`${i}-${j}`}
              x1={n.x} y1={n.y} x2={m.x} y2={m.y}
              stroke="var(--accent)" strokeOpacity="0.2"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3 + (n.delay + m.delay) / 2, ease: [0.16, 1, 0.3, 1] }}
            />
          )
        }),
      )}
      {nodes.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x} cy={n.y} r="3" fill="var(--accent)"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 + n.delay, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </svg>
  )
}

function PathDrawSVG() {
  return (
    <svg viewBox="0 0 400 200" className="h-48 w-full">
      <motion.path
        d="M 50 100 L 150 50 L 200 150 L 280 80 L 350 120"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  )
}
