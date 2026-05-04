'use client'

import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'

export type TranscriptCardData = {
  id: string | number
  slug: string
  title: string
  expertId?: string | null
  expertFormerTitle?: string | null
  expertLevel?: string | null
  tier?: string | null
  dateConducted?: string | null
  duration?: number | null
  summary?: string | null
  priceUsd: number
  originalPriceUsd?: number | null
  discountPercent?: number | null
  geography?: string[] | null
  sectorNames?: string[]
  tickerSymbols?: string[]
  engagementCopy?: string | null
}

const TIER_LABEL: Record<string, string> = {
  standard: 'Standard',
  premium: 'Premium',
  elite: 'Elite',
}

function hoverClass(effect?: string) {
  switch (effect) {
    case 'lift':          return 'card-hover-lift'
    case 'moving-border': return 'card-hover-border card-hover-lift'
    case 'spotlight':     return 'card-hover-spotlight card-hover-lift'
    default:              return 'card-hover-lift'
  }
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function PersonIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="h-[8px] w-[8px]">
      <circle cx="6" cy="4.5" r="2.5" />
      <path d="M1.5 11c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className="h-[11px] w-[11px] shrink-0">
      <path d="M1 1h1.5l1.5 6h6l1-4H4" />
      <circle cx="5.5" cy="10.5" r="1" />
      <circle cx="9.5" cy="10.5" r="1" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-[11px] w-[11px] shrink-0">
      <path d="M6 2v8M2 6h8" />
    </svg>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// TranscriptCard
// ══════════════════════════════════════════════════════════════════════════════

export function TranscriptCard({
  data,
  hoverEffect,
  index = 0,
}: {
  data: TranscriptCardData
  hoverEffect?: 'none' | 'lift' | 'moving-border' | 'spotlight'
  index?: number
}) {
  const isElite = data.tier === 'elite'
  const { addItem, openCart, hasItem } = useCart()
  const inCart = hasItem(data.slug)
  const router = useRouter()

  const productUrl = `/expert-transcripts/${data.slug}`

  // Buy Now: add to cart (if not already) then go straight to checkout
  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!inCart) {
      addItem({
        id: data.slug,
        slug: data.slug,
        type: 'transcript',
        title: data.title,
        tier: data.tier ?? undefined,
        priceUsd: data.priceUsd,
        originalPriceUsd: data.originalPriceUsd ?? undefined,
      })
    }
    router.push('/checkout')
  }

  // Add to Cart: add item and open cart drawer
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (inCart) { openCart(); return }
    addItem({
      id: data.slug,
      slug: data.slug,
      type: 'transcript',
      title: data.title,
      tier: data.tier ?? undefined,
      priceUsd: data.priceUsd,
      originalPriceUsd: data.originalPriceUsd ?? undefined,
    })
    openCart()
  }

  // Clicking anywhere on the card body navigates to the product page
  const handleCardClick = () => {
    router.push(productUrl)
  }

  const expertDisplay = data.expertFormerTitle?.trim() || data.expertId || null

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      onClick={handleCardClick}
      className={[
        'group relative flex flex-col overflow-hidden rounded-lg border bg-[var(--surface)] p-5 cursor-pointer',
        isElite ? 'border-[var(--accent-border)]' : 'border-[var(--border)]',
        hoverClass(hoverEffect),
      ].join(' ')}
      style={
        isElite
          ? { backgroundImage: 'linear-gradient(180deg, rgba(52,211,153,0.04) 0%, var(--surface) 60%)' }
          : undefined
      }
    >
      {/* Elite top glow line */}
      {isElite && (
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-60"
        />
      )}

      {/* ── Card content ──────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-0">

        {/* Tier + date */}
        <div className="mb-3 flex items-center justify-between">
          {data.tier && (
            isElite ? (
              <span className="bg-gradient-to-r from-[#34D399] to-[#6EE7B7] bg-clip-text font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-transparent">
                {TIER_LABEL[data.tier] ?? data.tier}
              </span>
            ) : (
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--mist)]">
                {TIER_LABEL[data.tier] ?? data.tier}
              </span>
            )
          )}
          {data.dateConducted && (
            <span className="font-mono text-[10px] text-[var(--mist)]">
              {new Date(data.dateConducted).toISOString().slice(0, 10).replaceAll('-', '.')}
            </span>
          )}
        </div>

        {/* Title — fixed 3-line height */}
        <h3
          className="mb-[10px] line-clamp-3 overflow-hidden text-[15px] font-medium leading-[1.35] tracking-[-0.015em] text-[var(--ink)]"
          style={{ height: 'calc(15px * 1.35 * 3)' }}
        >
          {data.title}
        </h3>

        {/* Summary — fixed 3-line height */}
        {data.summary && (
          <p
            className="mb-3 line-clamp-3 overflow-hidden text-[12px] leading-[1.6] text-[var(--ink-2)]"
            style={{ height: 'calc(12px * 1.6 * 3)' }}
          >
            {data.summary}
          </p>
        )}

        {/* Expert designation row */}
        {(expertDisplay || data.duration) && (
          <div className="mb-[10px] flex items-center gap-2">
            {expertDisplay && (
              <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-2)] py-[3px] pl-[3px] pr-2.5">
                <div className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#34D399] to-[#10B981] text-[#052A18]">
                  <PersonIcon />
                </div>
                <span className="truncate font-mono text-[10px] font-medium text-[var(--ink)]">
                  {expertDisplay}
                </span>
              </div>
            )}
            {data.duration && (
              <span className="shrink-0 font-mono text-[10px] text-[var(--mist)]">
                {data.duration} min
              </span>
            )}
          </div>
        )}

        {/* Tags */}
        {(data.sectorNames?.length || data.geography?.length || data.tickerSymbols?.length) ? (
          <div className="mb-3 flex flex-wrap items-center gap-1">
            {data.sectorNames?.map((s) => (
              <span
                key={s}
                className="inline-flex items-center rounded-md border border-[var(--accent-border)] bg-[var(--accent-tint)] px-1.5 py-0.5 font-mono text-[9px] font-medium text-[var(--accent)]"
              >
                {s}
              </span>
            ))}
            {data.geography?.slice(0, 1).map((g) => (
              <span
                key={g}
                className="inline-flex items-center rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-1.5 py-0.5 font-mono text-[9px] font-medium text-[var(--ink-2)]"
              >
                {g}
              </span>
            ))}
            {data.tickerSymbols?.slice(0, 3).map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-md border border-[var(--border)] px-1.5 py-0.5 font-mono text-[9px] font-medium text-[var(--ink-2)]"
              >
                ${t}
              </span>
            ))}
          </div>
        ) : null}

        {/* ── Footer ────────────────────────────────────────────────────────── */}
        <div className="mt-auto border-t border-[var(--border)] pt-3">

          {/* Price row */}
          <div className="mb-3 flex items-baseline gap-2">
            {data.originalPriceUsd && data.originalPriceUsd > data.priceUsd && (
              <span className="font-mono text-[11px] text-[var(--mist)] line-through">
                ${data.originalPriceUsd}
              </span>
            )}
            <span className="font-mono text-[19px] font-semibold leading-none tracking-[-0.02em] text-[var(--accent)]">
              ${data.priceUsd}
            </span>
            {data.discountPercent && data.discountPercent > 0 ? (
              <span className="inline-flex items-center rounded-md bg-[var(--accent)] px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-[0.08em] text-[#052A18]">
                {data.discountPercent}% OFF
              </span>
            ) : null}
          </div>

          {/* Action buttons — stopPropagation prevents card navigation */}
          <div className="grid grid-cols-2 gap-[7px]">
            {/* Buy Now → add to cart + go to /checkout */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="flex items-center justify-center gap-1.5 rounded-[8px] bg-btn-primary px-2 py-[9px] font-sans text-[12px] font-semibold tracking-[-0.01em] text-btn-primary-fg shadow-cta transition-all duration-base ease-out hover:-translate-y-px hover:bg-btn-primary-hover"
            >
              <CartIcon />
              Buy Now
            </button>

            {/* Add to Cart → add + open cart drawer */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex items-center justify-center gap-1.5 rounded-[8px] border px-2 py-[9px] font-sans text-[12px] font-medium tracking-[-0.01em] transition-all duration-150 ${
                inCart
                  ? 'border-[var(--accent-border)] bg-[var(--accent-tint)] text-[var(--accent)]'
                  : 'border-[var(--border)] bg-transparent text-[var(--ink-2)] hover:border-[var(--border-2)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]'
              }`}
            >
              <PlusIcon />
              {inCart ? 'In Cart' : 'Add to Cart'}
            </button>
          </div>

          {/* Engagement copy */}
          {data.engagementCopy && (
            <div className="mt-2.5 font-mono text-[9px] leading-[1.4] text-[var(--mist)]">
              {data.engagementCopy}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  )
}
