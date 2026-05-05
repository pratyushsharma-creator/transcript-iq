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
  complianceBadges?: string[] | null
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCardDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function TierBadge({ tier }: { tier: string }) {
  const isElite = tier === 'elite'
  const isPremium = tier === 'premium'
  if (isElite) {
    return (
      <span className="self-center whitespace-nowrap rounded-[4px] border border-[var(--accent-border)] bg-[var(--accent-tint)] px-[8px] py-[3px] font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--accent)]">
        Elite
      </span>
    )
  }
  if (isPremium) {
    return (
      <span
        className="self-center whitespace-nowrap rounded-[4px] border border-[rgba(202,138,4,.22)] bg-[rgba(202,138,4,.06)] px-[8px] py-[3px] font-mono text-[9px] uppercase tracking-[0.1em]"
        style={{ color: 'var(--tier-premium-color, #92400E)' }}
      >
        Premium
      </span>
    )
  }
  return (
    <span className="self-center whitespace-nowrap rounded-[4px] border border-[var(--border-2)] bg-[var(--surface-2)] px-[8px] py-[3px] font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--mist)]">
      {tier.charAt(0).toUpperCase() + tier.slice(1)}
    </span>
  )
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function CartIcon() {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      className="h-[11px] w-[11px] shrink-0"
    >
      <path d="M1 1h1.5l1.5 6h6l1-4H4" />
      <circle cx="5.5" cy="10.5" r="1" />
      <circle cx="9.5" cy="10.5" r="1" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className="h-[11px] w-[11px] shrink-0"
    >
      <path d="M6 2v8M2 6h8" />
    </svg>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// TranscriptCard
// ══════════════════════════════════════════════════════════════════════════════

export function TranscriptCard({
  data,
  hoverEffect: _hoverEffect,
  index = 0,
}: {
  data: TranscriptCardData
  hoverEffect?: 'none' | 'lift' | 'moving-border' | 'spotlight'
  index?: number
}) {
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
    if (inCart) {
      openCart()
      return
    }
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

  // Build header meta pieces
  const sectorDisplay = data.sectorNames?.[0] ?? ''
  const datePart = formatCardDate(data.dateConducted)
  const geoPart = data.geography?.[0] ?? ''
  const durationPart = data.duration ? `${data.duration} min` : ''
  const metaRight = [datePart, geoPart, durationPart].filter(Boolean).join(' · ')

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      onClick={handleCardClick}
      className="group relative flex flex-col overflow-hidden cursor-pointer card-hover-lift hover:-translate-y-[3px] hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,.18),0_20px_48px_-12px_rgba(0,0,0,.22)]"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderLeft: '3px solid var(--accent)',
        borderRadius: 14,
        padding: '28px 25px 24px 25px',
        boxShadow: '0 2px 8px -2px rgba(0,0,0,.12), 0 12px 32px -8px rgba(0,0,0,.10)',
        transition:
          'box-shadow .28s cubic-bezier(.22,1,.36,1), transform .28s cubic-bezier(.22,1,.36,1), border-color .28s',
      }}
    >
      {/* ── Card header: sector + date/region/duration ─────────────────── */}
      <div className="mb-[14px] flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]">
          {sectorDisplay}
        </span>
        <span className="font-mono text-[10px] tracking-[0.06em] text-[var(--mist)]">
          {metaRight}
        </span>
      </div>

      {/* ── Title ──────────────────────────────────────────────────────── */}
      <h3 className="mb-[10px] line-clamp-3 text-[17px] font-semibold leading-[1.35] tracking-[-0.02em] text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]">
        {data.title}
      </h3>

      {/* ── Excerpt ────────────────────────────────────────────────────── */}
      {data.summary && (
        <p className="mb-[20px] line-clamp-2 text-[13px] leading-[1.68] text-[var(--ink-2)]">
          {data.summary}
        </p>
      )}

      {/* ── Meta band: Expert | Level | Duration | Compliance ──────────── */}
      <div className="mb-[16px] flex items-stretch border-y border-[var(--border)] py-[12px]">
        {/* Expert */}
        <div className="flex-1 border-r border-[var(--border)] pr-[14px]">
          <div className="mb-[4px] font-mono text-[8px] uppercase tracking-[0.16em] text-[var(--mist)]">
            Expert
          </div>
          <div className="text-[12px] font-medium text-[var(--ink)]">
            {data.expertId ?? '—'}
          </div>
        </div>
        {/* Level */}
        <div className="flex-1 border-r border-[var(--border)] px-[14px]">
          <div className="mb-[4px] font-mono text-[8px] uppercase tracking-[0.16em] text-[var(--mist)]">
            Level
          </div>
          <div className="text-[12px] font-medium text-[var(--ink)]">
            {data.expertLevel ?? '—'}
          </div>
        </div>
        {/* Duration */}
        <div className="flex-1 border-r border-[var(--border)] px-[14px]">
          <div className="mb-[4px] font-mono text-[8px] uppercase tracking-[0.16em] text-[var(--mist)]">
            Duration
          </div>
          <div className="text-[12px] font-medium text-[var(--ink)]">
            {data.duration ? `${data.duration} min` : '—'}
          </div>
        </div>
        {/* Compliance */}
        <div className="flex-1 pl-[14px]">
          <div className="mb-[4px] font-mono text-[8px] uppercase tracking-[0.16em] text-[var(--mist)]">
            Compliance
          </div>
          <div className="text-[12px] font-medium text-[var(--accent)]">
            {data.complianceBadges?.includes('mnpi-screened') ? 'MNPI Screened' : 'Verified'}
          </div>
        </div>
      </div>

      {/* ── Ticker symbols ─────────────────────────────────────────────── */}
      {(data.tickerSymbols?.length || data.geography?.length) ? (
        <div className="mb-[20px] flex flex-wrap gap-[6px]">
          {data.tickerSymbols?.slice(0, 4).map((t) => (
            <span
              key={t}
              className="font-mono text-[10px] tracking-[0.04em] text-[var(--ink-2)] bg-[var(--surface-2)] border border-[var(--border)] px-[9px] py-[3px] rounded-[5px]"
            >
              ${t}
            </span>
          ))}
          {(data.tickerSymbols?.length ?? 0) > 4 && (
            <span className="font-mono text-[10px] text-[var(--mist)] bg-[var(--surface-2)] border border-[var(--border)] px-[9px] py-[3px] rounded-[5px]">
              +{(data.tickerSymbols?.length ?? 0) - 4} more
            </span>
          )}
        </div>
      ) : null}

      {/* ── Footer: price + tier + buttons ─────────────────────────────── */}
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-[var(--border)] pt-[16px]">
        {/* Price block */}
        <div className="flex items-baseline gap-[8px]">
          <span className="font-mono text-[24px] font-medium leading-none tracking-[-0.04em] text-[var(--accent)]">
            ${data.priceUsd}
          </span>
          {data.originalPriceUsd && data.originalPriceUsd > data.priceUsd && (
            <span className="font-mono text-[13px] text-[var(--mist)] line-through">
              ${data.originalPriceUsd}
            </span>
          )}
          {data.discountPercent && data.discountPercent > 0 && (
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.08em] text-btn-primary-fg bg-[var(--accent)] px-[7px] py-[2px] rounded-[4px]">
              {data.discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Tier badge */}
        {data.tier && <TierBadge tier={data.tier} />}

        {/* Action buttons */}
        <div className="flex gap-[8px] shrink-0">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex items-center gap-1 rounded-[8px] border px-[15px] py-[9px] font-sans text-[12px] font-medium tracking-[-0.01em] transition-all duration-150 ${
              inCart
                ? 'border-[var(--accent-border)] bg-[var(--accent-tint)] text-[var(--accent)]'
                : 'border-[var(--border)] bg-transparent text-[var(--ink-2)] hover:border-[var(--border-2)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]'
            }`}
          >
            <PlusIcon />
            {inCart ? 'In Cart' : 'Add to Cart'}
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="flex items-center gap-1.5 rounded-[8px] bg-btn-primary px-[18px] py-[9px] font-sans text-[12px] font-semibold tracking-[-0.01em] text-btn-primary-fg shadow-cta transition-all duration-base ease-out hover:-translate-y-px hover:bg-btn-primary-hover"
          >
            <CartIcon />
            Buy Now
          </button>
        </div>
      </div>
    </motion.article>
  )
}
