'use client'

import { motion } from 'motion/react'
import { ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'

export type EarningsCardData = {
  id: string | number
  slug: string
  title: string
  companyName: string
  ticker: string
  exchange?: string | null
  quarter?: string | null
  fiscalYear?: number | null
  reportDate?: string | null
  performanceBadges?: string[] | null
  summary?: string | null
  priceUsd: number
  originalPriceUsd?: number | null
  discountPercent?: number | null
  sectorNames?: string[]
  keyTopics?: string[]
}

const PERF_LABEL: Record<string, { text: string; tone: 'beat' | 'miss' | 'neutral' }> = {
  'eps-beat': { text: 'EPS BEAT', tone: 'beat' },
  'eps-miss': { text: 'EPS MISS', tone: 'miss' },
  'eps-in-line': { text: 'EPS IN-LINE', tone: 'neutral' },
  'rev-beat': { text: 'REV BEAT', tone: 'beat' },
  'rev-miss': { text: 'REV MISS', tone: 'miss' },
  'rev-in-line': { text: 'REV IN-LINE', tone: 'neutral' },
}

function PerfBadge({ value }: { value: string }) {
  const meta = PERF_LABEL[value]
  if (!meta) return null
  const cls =
    meta.tone === 'beat'
      ? 'border-[var(--accent-border)] bg-[var(--accent-tint)] text-[var(--accent)]'
      : meta.tone === 'miss'
      ? 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400'
      : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--ink-2)]'
  return (
    <span className={`inline-flex items-center rounded-sm border px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.08em] ${cls}`}>
      {meta.text}
    </span>
  )
}

function hoverClass(effect?: string) {
  switch (effect) {
    case 'lift': return 'card-hover-lift'
    case 'moving-border': return 'card-hover-border card-hover-lift'
    case 'spotlight': return 'card-hover-spotlight card-hover-lift'
    default: return 'card-hover-lift'
  }
}

export function EarningsAnalysisCard({
  data,
  hoverEffect,
  index = 0,
}: {
  data: EarningsCardData
  hoverEffect?: 'none' | 'lift' | 'moving-border' | 'spotlight'
  index?: number
}) {
  const { addItem, openCart, hasItem } = useCart()
  const inCart = hasItem(String(data.slug))
  const router = useRouter()

  const productUrl = `/earnings-analysis/${data.slug}`

  // Buy Now → add to cart + navigate directly to checkout
  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!inCart) {
      addItem({
        id: String(data.slug),
        slug: data.slug,
        type: 'earnings',
        title: data.title,
        ticker: data.ticker,
        quarter: data.quarter ?? undefined,
        priceUsd: data.priceUsd,
        originalPriceUsd: data.originalPriceUsd ?? undefined,
      })
    }
    router.push('/checkout')
  }

  // Add to Cart → add + open cart drawer
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (inCart) { openCart(); return }
    addItem({
      id: String(data.slug),
      slug: data.slug,
      type: 'earnings',
      title: data.title,
      ticker: data.ticker,
      quarter: data.quarter ?? undefined,
      priceUsd: data.priceUsd,
      originalPriceUsd: data.originalPriceUsd ?? undefined,
    })
    openCart()
  }

  // Clicking anywhere on the card navigates to the product page
  const handleCardClick = () => {
    router.push(productUrl)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      onClick={handleCardClick}
      className={`group relative flex flex-col gap-3 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 cursor-pointer ${hoverClass(hoverEffect)}`}
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center rounded-md border border-[var(--border)] px-2 py-0.5 font-mono text-[11px] font-medium text-[var(--ink)]">
          ${data.ticker}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--mist)]">
          {data.quarter} FY{data.fiscalYear}
        </span>
      </div>
      <h3 className="text-[16px] leading-[1.3] font-medium text-[var(--ink)] text-balance">{data.title}</h3>
      {data.summary && (
        <p className="text-[13px] leading-relaxed text-[var(--ink-2)] line-clamp-3">{data.summary}</p>
      )}
      {data.performanceBadges && data.performanceBadges.length > 0 && (
        <div className="flex flex-wrap items-center gap-1">
          {data.performanceBadges.map((b) => (
            <PerfBadge key={b} value={b} />
          ))}
        </div>
      )}
      {data.keyTopics && data.keyTopics.length > 0 && (
        <div className="flex flex-wrap items-center gap-1">
          {data.keyTopics.slice(0, 4).map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded-md border border-dashed border-[var(--border-2)] px-1.5 py-0.5 font-mono text-[10px] font-medium text-[var(--mist)]"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-1 border-t border-[var(--border)] pt-3 flex flex-col gap-3">
        <div className="flex items-end justify-between">
          <div className="flex items-baseline gap-2">
            {data.originalPriceUsd && data.originalPriceUsd > data.priceUsd && (
              <span className="font-mono text-[12px] text-[var(--mist)] line-through">${data.originalPriceUsd}</span>
            )}
            <span className="font-mono text-[18px] font-semibold text-[var(--accent)]">${data.priceUsd}</span>
            {data.discountPercent && data.discountPercent > 0 && (
              <span className="inline-flex items-center rounded-md bg-[var(--accent)] px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.08em] text-white">
                {data.discountPercent}% OFF
              </span>
            )}
          </div>
          <p className="text-[11px] text-[var(--mist)] font-mono pb-0.5">flat · instant PDF</p>
        </div>

        {/* Action buttons — stopPropagation prevents card navigation */}
        <div className="flex gap-[8px]">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex-1 inline-flex items-center justify-center gap-1 rounded-[8px] border py-[9px] font-sans text-[12px] font-medium tracking-[-0.01em] transition-all duration-150 ${
              inCart
                ? 'border-[var(--accent-border)] bg-[var(--accent-tint)] text-[var(--accent)]'
                : 'border-[var(--border)] bg-transparent text-[var(--ink-2)] hover:border-[var(--border-2)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]'
            }`}
          >
            <ShoppingCart className="h-[11px] w-[11px] shrink-0" />
            {inCart ? 'In Cart' : 'Add to Cart'}
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-[8px] bg-btn-primary py-[9px] font-sans text-[12px] font-semibold tracking-[-0.01em] text-btn-primary-fg shadow-cta transition-all duration-base ease-out hover:-translate-y-px hover:bg-btn-primary-hover"
          >
            <ShoppingCart className="h-[11px] w-[11px] shrink-0" />
            Buy Now
          </button>
        </div>
      </div>
    </motion.article>
  )
}
