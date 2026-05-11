'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'

// ── Types ─────────────────────────────────────────────────────────────────

type Industry = { id: string; name: string; slug: string }

export type TranscriptDoc = {
  id: string
  slug: string
  title: string
  summary?: string | null
  tier: 'standard' | 'premium' | 'elite'
  priceUsd: number
  originalPriceUsd?: number | null
  discountPercent?: number | null
  dateConducted: string
  duration?: number | null
  expertFormerTitle: string
  expertLevel: 'c-suite' | 'vp' | 'director'
  sectors?: Array<Industry | string> | null
  geography?: string[] | null
  companies?: string | null
  complianceBadges?: string[] | null
  engagementCopy?: string | null
  featured?: boolean | null
}

type ActiveFilters = {
  industry: Set<string>
  geography: Set<string>
  level: Set<string>
  tier: Set<string>
}

function emptyFilters(): ActiveFilters {
  return { industry: new Set(), geography: new Set(), level: new Set(), tier: new Set() }
}

// ── Static options ────────────────────────────────────────────────────────

const GEO_OPTIONS = [
  { label: 'APAC', value: 'apac' },
  { label: 'North America', value: 'north-america' },
  { label: 'Europe', value: 'europe' },
]

const LEVEL_OPTIONS = [
  { label: 'C-Suite', value: 'c-suite' },
  { label: 'VP / SVP', value: 'vp' },
  { label: 'Director', value: 'director' },
]

const TIER_OPTIONS = [
  { label: 'Elite · $599', value: 'elite' },
  { label: 'Premium · $449', value: 'premium' },
  { label: 'Standard · $349', value: 'standard' },
]

const SORT_OPTIONS = [
  { label: 'Newest first', value: '-dateConducted' },
  { label: 'Oldest first', value: 'dateConducted' },
  { label: 'Price: low to high', value: 'priceUsd' },
  { label: 'Price: high to low', value: '-priceUsd' },
]

const GEO_LABELS: Record<string, string> = {
  'north-america': 'North America',
  'europe': 'Europe',
  'apac': 'APAC',
  'global': 'Global',
}

const LEVEL_LABELS: Record<string, string> = {
  'c-suite': 'C-Suite',
  'vp': 'VP',
  'director': 'Director',
}

// ── Sub-components ────────────────────────────────────────────────────────

function TierBadge({ tier }: { tier: string }) {
  const cls =
    tier === 'elite'
      ? 'text-[var(--accent)] bg-[var(--accent-tint)] border border-[var(--accent-border)]'
      : tier === 'premium'
        ? 'text-[#FBBF24] bg-[rgba(251,191,36,0.1)] border border-[rgba(251,191,36,0.2)]'
        : 'text-[var(--slate)] bg-[var(--surface-2)] border border-[var(--border)]'
  return (
    <span className={`font-mono text-[9px] tracking-[0.1em] uppercase font-medium px-2 py-0.5 rounded ${cls}`}>
      {tier}
    </span>
  )
}

// ── Icons ─────────────────────────────────────────────────────────────────

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

// ── Sidebar filter group (checkbox-style rows) ────────────────────────────

function FilterGroup({
  label,
  items,
  active,
  onToggle,
}: {
  label: string
  items: { label: string; value: string }[]
  active: Set<string>
  onToggle: (value: string) => void
}) {
  const [open, setOpen] = useState(true)
  const hasActive = items.some((i) => active.has(i.value))

  return (
    <div className="border-b border-[var(--border)]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-3.5 text-left"
      >
        <span
          className={`font-mono text-[10px] tracking-[0.12em] uppercase transition-colors ${
            hasActive ? 'text-[var(--accent)]' : 'text-[var(--ink-2)]'
          }`}
        >
          {label}
          {hasActive && (
            <span className="ml-1.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[var(--accent)] text-[7px] text-black font-semibold">
              {items.filter((i) => active.has(i.value)).length}
            </span>
          )}
        </span>
        <svg
          viewBox="0 0 10 6"
          fill="none"
          className={`w-2.5 h-2.5 text-[var(--mist)] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="pb-3 flex flex-col gap-0.5">
          {items.map((item) => {
            const checked = active.has(item.value)
            return (
              <button
                key={item.value}
                onClick={() => onToggle(item.value)}
                className="group flex items-center gap-2.5 w-full rounded-md px-1 py-1.5 text-left transition-colors hover:bg-[var(--surface-2)]"
              >
                {/* Checkbox */}
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
                    checked
                      ? 'bg-[var(--accent)] border-[var(--accent)]'
                      : 'border-[var(--border-2)] bg-transparent group-hover:border-[var(--accent-border)]'
                  }`}
                >
                  {checked && (
                    <svg viewBox="0 0 10 8" fill="none" className="w-2.5 h-2">
                      <path
                        d="M1 4l2.5 2.5L9 1"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <span
                  className={`text-[13px] leading-[1.3] transition-colors ${
                    checked ? 'text-[var(--ink)] font-medium' : 'text-[var(--ink-2)] group-hover:text-[var(--ink)]'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Sidebar panel (shared between desktop sidebar and mobile drawer) ───────

function FilterPanel({
  industries,
  filters,
  onToggle,
  onClearAll,
}: {
  industries: Industry[]
  filters: ActiveFilters
  onToggle: (group: keyof ActiveFilters, value: string) => void
  onClearAll: () => void
}) {
  const hasFilters =
    filters.industry.size > 0 ||
    filters.geography.size > 0 ||
    filters.level.size > 0 ||
    filters.tier.size > 0

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-1">
        <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--mist)]">Filter by</span>
        {hasFilters && (
          <button
            onClick={onClearAll}
            className="font-mono text-[10px] tracking-[0.08em] uppercase text-[var(--mist)] transition-colors hover:text-[#F87171]"
          >
            Clear all
          </button>
        )}
      </div>

      {industries.length > 0 && (
        <FilterGroup
          label="Industry"
          items={industries.map((i) => ({ label: i.name, value: i.slug }))}
          active={filters.industry}
          onToggle={(v) => onToggle('industry', v)}
        />
      )}
      <FilterGroup
        label="Geography"
        items={GEO_OPTIONS}
        active={filters.geography}
        onToggle={(v) => onToggle('geography', v)}
      />
      <FilterGroup
        label="Expert Level"
        items={LEVEL_OPTIONS}
        active={filters.level}
        onToggle={(v) => onToggle('level', v)}
      />
      <FilterGroup
        label="Tier"
        items={TIER_OPTIONS}
        active={filters.tier}
        onToggle={(v) => onToggle('tier', v)}
      />
    </div>
  )
}

function isPopulated<T extends object>(val: T | string | null | undefined): val is T {
  return typeof val === 'object' && val !== null
}

// ── TranscriptCard ────────────────────────────────────────────────────────

function TranscriptCard({ doc, view }: { doc: TranscriptDoc; view: 'grid' | 'list' }) {
  const { addItem, openCart, hasItem } = useCart()
  const inCart = hasItem(doc.slug)
  const router = useRouter()

  const firstSector = doc.sectors?.find(isPopulated) as Industry | undefined
  const sectorName = firstSector?.name ?? null
  const hasElite = doc.tier === 'elite'

  const firstGeo = doc.geography?.[0]
  const geoPart = firstGeo ? (GEO_LABELS[firstGeo] ?? firstGeo) : null

  const companyNames = doc.companies
    ? doc.companies.split(',').map((s) => s.trim()).filter(Boolean)
    : []
  const displayCompanies = companyNames.slice(0, 4)
  const extraCompanies = companyNames.length - displayCompanies.length

  const datePart = doc.dateConducted
    ? new Date(doc.dateConducted).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : ''
  const metaRight = [datePart, geoPart].filter(Boolean).join(' · ')

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!inCart) {
      addItem({ id: doc.slug, slug: doc.slug, type: 'transcript', title: doc.title, tier: doc.tier, priceUsd: doc.priceUsd, originalPriceUsd: doc.originalPriceUsd ?? undefined })
    }
    router.push('/checkout')
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (inCart) { openCart(); return }
    addItem({ id: doc.slug, slug: doc.slug, type: 'transcript', title: doc.title, tier: doc.tier, priceUsd: doc.priceUsd, originalPriceUsd: doc.originalPriceUsd ?? undefined })
    openCart()
  }

  return (
    <Link
      href={`/expert-transcripts/${doc.slug}`}
      className={[
        'group relative flex flex-col overflow-hidden no-underline text-[var(--ink)] cursor-pointer',
        'shadow-[0_2px_8px_-2px_rgba(0,0,0,.08),0_8px_24px_-8px_rgba(0,0,0,.08)]',
        'hover:-translate-y-[3px] hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,.16),0_20px_48px_-12px_rgba(0,0,0,.18)]',
        'transition-[box-shadow,transform,border-color] duration-[280ms] [transition-timing-function:cubic-bezier(.22,1,.36,1)]',
      ].join(' ')}
      style={{
        background: hasElite
          ? 'linear-gradient(180deg, rgba(16,185,129,0.06) 0%, transparent 50%), var(--surface)'
          : 'var(--surface)',
        border: '1px solid var(--accent-border)',
        borderRadius: 14,
        padding: '28px 25px 24px 25px',
      }}
    >
      {hasElite && (
        <span
          aria-hidden
          className="absolute top-0 left-0 right-0 h-px z-10"
          style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)', opacity: 0.6 }}
        />
      )}

      {/* ── Card header: sector + date/region ─────────────────────────── */}
      <div className="mb-[14px] flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]">
          {sectorName ?? ''}
        </span>
        <span className="font-mono text-[10px] tracking-[0.06em] text-[var(--mist)]">
          {metaRight}
        </span>
      </div>

      {/* ── Title ──────────────────────────────────────────────────────── */}
      <h3 className="mb-[14px] line-clamp-3 text-[19px] font-semibold leading-[1.3] tracking-[-0.025em] text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]">
        {doc.title}
      </h3>

      {/* ── Expert designation ─────────────────────────────────────────── */}
      {doc.expertFormerTitle && (
        <div className="mb-[18px] flex items-center gap-[9px]">
          <span
            className="shrink-0 rounded-full flex items-center justify-center font-mono text-[6px] font-semibold tracking-[0.04em] text-[#064E3B]"
            style={{ width: 22, height: 22, background: 'linear-gradient(135deg, var(--accent-deep), var(--accent))' }}
          >
            EXP
          </span>
          <span className="flex-1 text-[12px] leading-[1.45] text-[var(--ink-2)] line-clamp-2">
            {doc.expertFormerTitle}
          </span>
        </div>
      )}

      {/* ── Meta band: Level | Duration | Compliance ───────────────────── */}
      <div className="mb-[14px] flex items-stretch">
        {/* Expert Level */}
        <div className="flex-1 border-r border-[var(--border)] pr-[14px]">
          <div className="mb-[4px] font-mono text-[8px] uppercase tracking-[0.16em] text-[var(--mist)]">Expert Level</div>
          <div className="text-[12px] font-medium text-[var(--ink)]">
            {doc.expertLevel ? (LEVEL_LABELS[doc.expertLevel] ?? doc.expertLevel) : '—'}
          </div>
        </div>
        {/* Duration */}
        <div className="flex-1 border-r border-[var(--border)] px-[14px]">
          <div className="mb-[4px] font-mono text-[8px] uppercase tracking-[0.16em] text-[var(--mist)]">Duration</div>
          <div className="text-[12px] font-medium text-[var(--ink)]">
            {doc.duration ? `${doc.duration} min` : '—'}
          </div>
        </div>
        {/* Compliance */}
        <div className="flex-1 pl-[14px]">
          <div className="mb-[4px] font-mono text-[8px] uppercase tracking-[0.16em] text-[var(--mist)]">Compliance</div>
          <div className="text-[12px] font-medium text-[var(--accent)]">
            {doc.complianceBadges?.includes('mnpi-screened') ? 'MNPI Screened' : 'Verified'}
          </div>
        </div>
      </div>

      {/* ── Company names ──────────────────────────────────────────────── */}
      {displayCompanies.length > 0 && (
        <div className="mb-[20px] flex flex-wrap gap-[6px]">
          {displayCompanies.map((name) => (
            <span key={name} className="font-mono text-[10px] tracking-[0.04em] text-[var(--ink-2)] bg-[var(--surface-2)] border border-[var(--border)] px-[9px] py-[3px] rounded-[5px]">
              {name}
            </span>
          ))}
          {extraCompanies > 0 && (
            <span className="font-mono text-[10px] text-[var(--mist)] bg-[var(--surface-2)] border border-[var(--border)] px-[9px] py-[3px] rounded-[5px]">
              +{extraCompanies} more
            </span>
          )}
        </div>
      )}

      {/* ── Footer: price + tier · buttons ────────────────────────────── */}
      <div className="mt-auto border-t border-[var(--border)] pt-[16px] flex flex-col gap-[10px]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-[8px]">
            <span className="font-mono text-[24px] font-medium leading-none tracking-[-0.04em] text-[var(--accent)]">
              ${doc.priceUsd}
            </span>
            {!!doc.originalPriceUsd && doc.originalPriceUsd > doc.priceUsd && (
              <span className="font-mono text-[13px] leading-none text-[var(--mist)] line-through">${doc.originalPriceUsd}</span>
            )}
            {!!doc.discountPercent && doc.discountPercent > 0 && (
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.08em] leading-none text-btn-primary-fg bg-[var(--accent)] px-[7px] py-[3px] rounded-[4px]">
                {doc.discountPercent}% OFF
              </span>
            )}
          </div>
          <TierBadge tier={doc.tier} />
        </div>
        <div className="flex gap-[8px]">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex-1 flex items-center justify-center gap-1 rounded-[8px] border py-[9px] font-sans text-[12px] font-medium tracking-[-0.01em] transition-all duration-150 ${
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
            className="flex-1 flex items-center justify-center gap-1.5 rounded-[8px] bg-btn-primary py-[9px] font-sans text-[12px] font-semibold tracking-[-0.01em] text-btn-primary-fg shadow-cta transition-all duration-base ease-out hover:-translate-y-px hover:bg-btn-primary-hover"
          >
            <CartIcon />
            Buy Now
          </button>
        </div>
      </div>

      {/* ── Social proof (optional) ───────────────────────────────────── */}
      {doc.engagementCopy && (
        <div className="mt-[12px] flex items-center gap-1.5 text-[11px] text-[var(--mist)] border-t border-[var(--border)] pt-[10px]">
          <span className="w-1 h-1 rounded-full bg-[var(--accent)] opacity-60 shrink-0" />
          {doc.engagementCopy}
        </div>
      )}
    </Link>
  )
}

// ── Icons ─────────────────────────────────────────────────────────────────

function GridIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3">
      <rect x="0" y="0" width="5" height="5" rx="1" /><rect x="7" y="0" width="5" height="5" rx="1" />
      <rect x="0" y="7" width="5" height="5" rx="1" /><rect x="7" y="7" width="5" height="5" rx="1" />
    </svg>
  )
}
function ListIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3">
      <rect x="0" y="0" width="12" height="2.5" rx="1" /><rect x="0" y="4.75" width="12" height="2.5" rx="1" />
      <rect x="0" y="9.5" width="12" height="2.5" rx="1" />
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
      <path d="M2 4h12M5 8h6M8 12h0" strokeLinecap="round" />
    </svg>
  )
}

// ── Main export ───────────────────────────────────────────────────────────

interface TranscriptLibraryProps {
  initialDocs: TranscriptDoc[]
  totalDocs: number
  industries: Industry[]
}

export function TranscriptLibrary({ initialDocs, totalDocs, industries }: TranscriptLibraryProps) {
  const [docs, setDocs] = useState<TranscriptDoc[]>(initialDocs)
  const [total, setTotal] = useState(totalDocs)
  const [filters, setFilters] = useState<ActiveFilters>(emptyFilters())
  const [sort, setSort] = useState('-dateConducted')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(initialDocs.length < totalDocs)
  const [loading, setLoading] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const buildParams = useCallback((f: ActiveFilters, s: string, p: number) => {
    const params = new URLSearchParams()
    params.set('limit', '24')
    params.set('page', String(p))
    params.set('sort', s)
    params.set('depth', '2')
    if (f.industry.size > 0) params.set('where[sectors.slug][in]', [...f.industry].join(','))
    if (f.geography.size > 0) params.set('where[geography][in]', [...f.geography].join(','))
    if (f.level.size > 0) params.set('where[expertLevel][in]', [...f.level].join(','))
    if (f.tier.size > 0) params.set('where[tier][in]', [...f.tier].join(','))
    return params.toString()
  }, [])

  const fetchDocs = useCallback(
    async (f: ActiveFilters, s: string, p: number, append = false) => {
      setLoading(true)
      try {
        const res = await fetch(`/api/expert-transcripts?${buildParams(f, s, p)}`)
        const data = await res.json()
        setDocs((prev) => (append ? [...prev, ...(data.docs ?? [])] : (data.docs ?? [])))
        setTotal(data.totalDocs ?? 0)
        setHasNext(data.hasNextPage ?? false)
        setPage(p)
        const u = new URLSearchParams()
        if (f.industry.size > 0) u.set('industry', [...f.industry].join(','))
        if (f.geography.size > 0) u.set('geography', [...f.geography].join(','))
        if (f.level.size > 0) u.set('level', [...f.level].join(','))
        if (f.tier.size > 0) u.set('tier', [...f.tier].join(','))
        window.history.replaceState({}, '', u.toString() ? `?${u}` : location.pathname)
      } catch {
        // noop — keep existing docs on error
      } finally {
        setLoading(false)
      }
    },
    [buildParams],
  )

  function toggleFilter(group: keyof ActiveFilters, value: string) {
    const next: ActiveFilters = {
      industry: new Set(filters.industry),
      geography: new Set(filters.geography),
      level: new Set(filters.level),
      tier: new Set(filters.tier),
    }
    if (next[group].has(value)) next[group].delete(value)
    else next[group].add(value)
    setFilters(next)
    fetchDocs(next, sort, 1)
  }

  function clearAll() {
    const f = emptyFilters()
    setFilters(f)
    fetchDocs(f, sort, 1)
  }

  function handleSort(val: string) {
    setSort(val)
    fetchDocs(filters, val, 1)
  }

  // Active chips for the results bar
  const activeChips: { group: keyof ActiveFilters; value: string; label: string }[] = []
  ;(Object.keys(filters) as Array<keyof ActiveFilters>).forEach((group) => {
    filters[group].forEach((value) => {
      const label =
        group === 'industry' ? (industries.find((i) => i.slug === value)?.name ?? value)
        : group === 'geography' ? (GEO_OPTIONS.find((o) => o.value === value)?.label ?? value)
        : group === 'level' ? (LEVEL_OPTIONS.find((o) => o.value === value)?.label ?? value)
        : (TIER_OPTIONS.find((o) => o.value === value)?.label ?? value)
      activeChips.push({ group, value, label })
    })
  })
  const hasFilters = activeChips.length > 0
  const activeCount = activeChips.length

  return (
    <>
      {/* ── Page header ────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{
          background:
            'radial-gradient(ellipse 900px 400px at 70% -20%, var(--accent-tint-2), transparent 55%), radial-gradient(ellipse 500px 300px at 0% 100%, var(--accent-tint), transparent 60%), var(--bg)',
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, var(--grid-dot) 1px, transparent 0)',
            backgroundSize: '28px 28px',
            maskImage: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0.4) 70%, transparent)',
            WebkitMaskImage: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0.4) 70%, transparent)',
          }}
        />
        <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6 md:px-10 pb-10 pt-1">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.1em] uppercase text-[var(--mist)] mb-7">
            <a href="/" className="hover:text-[var(--slate)] transition-colors duration-150">Home</a>
            <span className="text-[var(--border-2)]">›</span>
            <span>Transcript Library</span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
            <h1 className="text-[clamp(32px,4vw,52px)] font-semibold tracking-[-0.04em] leading-[1]">
              Expert Call <em className="not-italic text-[var(--accent)] font-[400]">Transcripts</em>
            </h1>
            <div className="flex items-center gap-4 shrink-0 pb-1">
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.1em] uppercase text-[var(--accent)] px-2.5 py-1.5 bg-[var(--accent-tint)] border border-[var(--accent-border)] rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                Expert Research
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.1em] uppercase text-[var(--mist)] px-2.5 py-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-full">
                100% MNPI Screened
              </span>
            </div>
          </div>
          <p className="text-[16px] text-[var(--ink-2)] leading-[1.6] max-w-[540px]">
            Primary research on demand. Every transcript is MNPI-screened, PII-redacted, and compliance-certified. No subscription — buy exactly what you need.
          </p>
        </div>
      </div>

      {/* ── Body: sidebar + content ─────────────────────────────────────── */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-10 py-8 pb-20 flex gap-8 items-start">

        {/* ── Desktop sidebar ───────────────────────────────────────────── */}
        <aside className="hidden lg:block w-[220px] shrink-0 sticky top-[72px]">
          <FilterPanel
            industries={industries}
            filters={filters}
            onToggle={toggleFilter}
            onClearAll={clearAll}
          />
        </aside>

        {/* ── Content column ────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-5 border-b border-[var(--border)]">
            {/* Left: mobile filter button + count + active chips */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Mobile "Filters" button */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.08em] uppercase text-[var(--ink-2)] bg-[var(--surface)] border border-[var(--border)] px-3 py-2 rounded-lg transition-all hover:border-[var(--border-2)]"
              >
                <FilterIcon />
                Filters
                {activeCount > 0 && (
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent)] text-[8px] font-semibold text-black">
                    {activeCount}
                  </span>
                )}
              </button>

              <span className="font-mono text-[11px] text-[var(--mist)] tracking-[0.06em] whitespace-nowrap">
                <strong className="text-[var(--ink)]">{docs.length}</strong>
                {hasFilters ? ' matching' : ''} transcript{docs.length !== 1 ? 's' : ''}
              </span>

              {/* Active filter chips */}
              {activeChips.map(({ group, value, label }) => (
                <button
                  key={`${group}:${value}`}
                  onClick={() => toggleFilter(group, value)}
                  className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.06em] text-[var(--accent)] bg-[var(--accent-tint)] border border-[var(--accent-border)] px-2.5 py-0.5 rounded-full cursor-pointer transition-all hover:bg-[rgba(52,211,153,0.2)]"
                >
                  {label} <span className="text-[12px] leading-none">×</span>
                </button>
              ))}
              {hasFilters && (
                <button
                  onClick={clearAll}
                  className="font-mono text-[10px] tracking-[0.08em] uppercase text-[var(--mist)] bg-none border-none cursor-pointer transition-colors hover:text-[#F87171]"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Right: sort + view toggle */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-[var(--mist)]">Sort</span>
              <select
                value={sort}
                onChange={(e) => handleSort(e.target.value)}
                className="font-mono text-[10px] tracking-[0.06em] text-[var(--ink)] bg-[var(--surface)] border border-[var(--border)] rounded-md px-2.5 py-1.5 cursor-pointer outline-none focus:border-[var(--accent-border)] appearance-none"
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <div className="flex gap-0.5">
                {(['grid', 'list'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    title={`${v === 'grid' ? 'Grid' : 'List'} view`}
                    className={[
                      'w-7 h-7 rounded-md flex items-center justify-center cursor-pointer transition-all duration-150 border',
                      view === v
                        ? 'bg-[var(--surface)] border-[var(--border-2)] text-[var(--ink)]'
                        : 'bg-transparent border-[var(--border)] text-[var(--mist)]',
                    ].join(' ')}
                  >
                    {v === 'grid' ? <GridIcon /> : <ListIcon />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cards */}
          {loading && docs.length === 0 ? (
            <div className="py-20 text-center font-mono text-[11px] text-[var(--mist)]">Loading…</div>
          ) : docs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-[var(--border-2)] rounded-[18px] bg-[var(--surface)]">
              <div className="w-[52px] h-[52px] rounded-[14px] bg-[var(--accent-tint)] border border-[var(--accent-border)] flex items-center justify-center mb-5">
                <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-[22px] h-[22px] text-[var(--accent)]">
                  <circle cx="10" cy="10" r="7" /><path d="m15 15 4 4" /><path d="M10 7v3M10 13h.01" />
                </svg>
              </div>
              <div className="text-[18px] font-medium tracking-[-0.02em] mb-2">No transcripts match these filters</div>
              <p className="text-[14px] text-[var(--ink-2)] leading-[1.6] mb-6">
                Try adjusting or clearing your active filters to see more results.
              </p>
              <button
                onClick={clearAll}
                className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] uppercase text-[var(--accent)] bg-[var(--accent-tint)] border border-[var(--accent-border)] px-5 py-2.5 rounded-lg cursor-pointer transition-all hover:bg-[rgba(52,211,153,0.14)]"
              >
                Clear all filters →
              </button>
            </div>
          ) : (
            <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 'flex flex-col gap-3'}>
              {docs.map((doc) => <TranscriptCard key={doc.id} doc={doc} view={view} />)}
            </div>
          )}

          {/* Load more */}
          {hasNext && docs.length > 0 && (
            <div className="flex justify-center pt-10 mt-10 border-t border-[var(--border)]">
              <button
                onClick={() => fetchDocs(filters, sort, page + 1, true)}
                disabled={loading}
                className="inline-flex items-center gap-2 text-[13px] font-medium text-[var(--ink-2)] bg-[var(--surface)] border border-[var(--border)] px-7 py-2.5 rounded-[9px] cursor-pointer transition-all hover:border-[var(--border-2)] hover:text-[var(--ink)] disabled:opacity-50"
              >
                {loading ? 'Loading…' : 'Load more transcripts →'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile filter drawer ───────────────────────────────────────────── */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />

          {/* Sheet */}
          <div className="relative flex max-h-[85vh] flex-col rounded-t-2xl bg-[var(--bg)] border-t border-[var(--border)] shadow-2xl">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <span className="h-1 w-10 rounded-full bg-[var(--border-2)]" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]">
              <span className="text-[15px] font-semibold tracking-[-0.01em]">
                Filters
                {activeCount > 0 && (
                  <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)] text-[9px] font-semibold text-black">
                    {activeCount}
                  </span>
                )}
              </span>
              <div className="flex items-center gap-4">
                {hasFilters && (
                  <button
                    onClick={clearAll}
                    className="font-mono text-[10px] tracking-[0.08em] uppercase text-[var(--mist)] transition-colors hover:text-[#F87171]"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-[var(--mist)] transition-colors hover:text-[var(--ink)]"
                  aria-label="Close filters"
                >
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                    <path d="M3 3l10 10M13 3L3 13" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Scrollable filter content */}
            <div className="overflow-y-auto flex-1 px-5">
              <FilterPanel
                industries={industries}
                filters={filters}
                onToggle={toggleFilter}
                onClearAll={clearAll}
              />
            </div>

            {/* Footer CTA */}
            <div className="px-5 py-4 border-t border-[var(--border)]">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full rounded-xl bg-[var(--accent)] py-3 text-[14px] font-semibold text-white transition-all hover:bg-[var(--accent-bright)]"
              >
                Show results →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
