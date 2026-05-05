'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'

// ── Types ─────────────────────────────────────────────────────────────────

type Industry = { id: string; name: string; slug: string }
type Company = { id: string; name: string; ticker?: string }

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
  companies?: Array<Company | string> | null
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

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={[
        'inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.06em] uppercase px-3 py-1.5 rounded-full border cursor-pointer transition-all duration-150 whitespace-nowrap shrink-0',
        active
          ? 'text-[var(--accent)] bg-[var(--accent-tint)] border-[var(--accent-border)]'
          : 'text-[var(--mist)] bg-transparent border-[var(--border)] hover:text-[var(--ink-2)] hover:border-[var(--border-md)]',
      ].join(' ')}
    >
      <span className="w-1 h-1 rounded-full bg-current shrink-0" />
      {label}
    </button>
  )
}

function isPopulated<T extends object>(val: T | string | null | undefined): val is T {
  return typeof val === 'object' && val !== null
}

function TranscriptCard({ doc, view }: { doc: TranscriptDoc; view: 'grid' | 'list' }) {
  const firstSector = doc.sectors?.find(isPopulated) as Industry | undefined
  const sectorName = firstSector?.name ?? null
  const hasElite = doc.tier === 'elite'

  const firstGeo = doc.geography?.[0]
  const geoLabel = firstGeo ? (GEO_LABELS[firstGeo] ?? firstGeo) : null

  const tickers = (doc.companies ?? [])
    .filter(isPopulated)
    .map((c: Company) => c.ticker)
    .filter(Boolean) as string[]
  const displayTickers = tickers.slice(0, 3)
  const extraTickers = tickers.length - displayTickers.length

  const dateStr = doc.dateConducted
    ? new Date(doc.dateConducted).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null

  return (
    <Link
      href={`/expert-transcripts/${doc.slug}`}
      className={[
        'group relative flex overflow-hidden rounded-[14px] border transition-all duration-200 no-underline text-[var(--ink)]',
        'hover:border-[var(--border-md)] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.3)]',
        hasElite
          ? 'border-[var(--accent-border)]'
          : 'border-[var(--border)]',
        view === 'list' ? 'flex-row' : 'flex-col',
      ].join(' ')}
      style={{
        background: hasElite
          ? 'linear-gradient(180deg, rgba(16,185,129,0.06) 0%, transparent 50%), var(--surface)'
          : 'var(--surface)',
      }}
    >
      {hasElite && (
        <span
          aria-hidden
          className="absolute top-0 left-0 right-0 h-px z-10"
          style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)', opacity: 0.6 }}
        />
      )}
      {/* Body */}
      <div className="flex flex-col flex-1 p-[22px] pb-4">
        {/* Sector + discount */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {sectorName ? (
            <span className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.1em] uppercase text-[var(--accent)] px-2 py-0.5 bg-[var(--accent-tint)] border border-[var(--accent-border)] rounded-full">
              <span className="w-1 h-1 rounded-full bg-[var(--accent)]" />
              {sectorName}
            </span>
          ) : (
            <span />
          )}
          {!!doc.discountPercent && (
            <span className="font-mono text-[9px] tracking-[0.08em] font-semibold text-[#FBBF24] bg-[rgba(251,191,36,0.1)] border border-[rgba(251,191,36,0.25)] px-1.5 py-0.5 rounded">
              {doc.discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Title */}
        <div className="text-[15px] font-medium tracking-[-0.015em] leading-[1.35] text-[var(--ink)] mb-2.5 flex-1">
          {doc.title}
        </div>

        {/* Summary */}
        {doc.summary && (
          <p className="text-[12px] text-[var(--slate)] dark:text-[#A0A0AA] leading-[1.6] mb-3.5 line-clamp-2">
            {doc.summary}
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-3 font-mono text-[10px] text-[var(--mist)] dark:text-[#A0A0AA] mb-2.5 flex-wrap">
          {dateStr && <span>{dateStr}</span>}
          {geoLabel && (
            <>
              <span className="text-[var(--border-2)]">·</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] opacity-70" />
                {geoLabel}
              </span>
            </>
          )}
          {!!doc.duration && (
            <>
              <span className="text-[var(--border-2)]">·</span>
              <span>{doc.duration} min</span>
            </>
          )}
        </div>

        {/* Expert */}
        {doc.expertFormerTitle && (
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--slate)] dark:text-[#A0A0AA] mb-3">
            <span
              className="rounded-full flex items-center justify-center font-mono text-[6px] text-[#064E3B] font-semibold shrink-0"
              style={{ width: 18, height: 18, background: 'linear-gradient(135deg, var(--accent-deep), var(--accent))' }}
            >
              EXP
            </span>
            <span className="flex-1 truncate">{doc.expertFormerTitle}</span>
            {doc.expertLevel && (
              <span className="font-mono text-[9px] tracking-[0.08em] uppercase text-[var(--mist)] dark:text-[#A0A0AA] bg-[var(--surface-2)] px-1.5 py-0.5 rounded shrink-0 ml-auto">
                {LEVEL_LABELS[doc.expertLevel] ?? doc.expertLevel}
              </span>
            )}
          </div>
        )}

        {/* Tickers */}
        {displayTickers.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {displayTickers.map((t) => (
              <span key={t} className="font-mono text-[9px] tracking-[0.04em] text-[var(--slate)] dark:text-[#A0A0AA] bg-[var(--bg)] border border-[var(--border)] px-1.5 py-0.5 rounded">
                ${t}
              </span>
            ))}
            {extraTickers > 0 && (
              <span className="font-mono text-[9px] text-[var(--mist)] dark:text-[#A0A0AA] self-center">+{extraTickers} more</span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className={[
          'flex items-center justify-between gap-3 px-[22px] py-3 border-t border-[var(--border)]',
          view === 'list' ? 'border-t-0 border-l flex-col justify-center min-w-[160px] gap-3 py-5' : '',
        ].join(' ')}
      >
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-[18px] font-medium text-[var(--accent)] tracking-[-0.02em]">
            ${doc.priceUsd}
          </span>
          {!!doc.originalPriceUsd && (
            <span className="font-mono text-[12px] text-[var(--mist)] dark:text-[#A0A0AA] line-through">${doc.originalPriceUsd}</span>
          )}
        </div>
        <TierBadge tier={doc.tier} />
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
          className="text-[12px] font-medium text-black bg-[var(--accent-deep)] px-3.5 py-1.5 rounded-[7px] border-none cursor-pointer transition-all duration-150 hover:bg-[var(--accent)] whitespace-nowrap shrink-0"
        >
          Buy →
        </button>
      </div>

      {/* Social proof */}
      {doc.engagementCopy && view !== 'list' && (
        <div className="flex items-center gap-1.5 bg-[var(--bg)] px-[22px] py-2 text-[11px] text-[var(--mist)] dark:text-[#A0A0AA] border-t border-[var(--border)]">
          <span className="w-1 h-1 rounded-full bg-[var(--accent)] opacity-60" />
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
    const next: ActiveFilters = { industry: new Set(filters.industry), geography: new Set(filters.geography), level: new Set(filters.level), tier: new Set(filters.tier) }
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

  // Active chips
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
                {total} transcripts
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

      {/* ── Filter bar ─────────────────────────────────────────────────── */}
      <div className="sticky top-16 z-40 border-b border-[var(--border)] backdrop-blur-[16px]" style={{ background: 'color-mix(in srgb, var(--bg) 92%, transparent)' }}>
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-10">
          {/* Filter tabs */}
          <div className="flex gap-0 border-b border-[var(--border)] overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {[
              { label: 'All Filters', id: 'all' },
              { label: 'Industry', id: 'industry' },
              { label: 'Geography', id: 'geography' },
              { label: 'Expert Level', id: 'level' },
              { label: 'Tier', id: 'tier' },
            ].map(({ label, id }) => (
              <button
                key={id}
                onClick={() => id !== 'all' && document.getElementById(`group-${id}`)?.scrollIntoView({ inline: 'start', behavior: 'smooth' })}
                className="font-mono text-[10px] tracking-[0.1em] uppercase text-[var(--mist)] px-5 py-3.5 bg-none border-none cursor-pointer transition-colors duration-150 whitespace-nowrap hover:text-[var(--slate)]"
                style={{ borderBottom: '1.5px solid transparent' }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Pills row */}
          <div className="flex items-center gap-0 py-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {industries.length > 0 && (
              <div id="group-industry" className="flex items-center gap-1.5 pr-5 mr-5 border-r border-[var(--border)] shrink-0">
                <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-[var(--mist)] whitespace-nowrap mr-0.5">Industry</span>
                {industries.map((ind) => (
                  <FilterPill key={ind.slug} label={ind.name} active={filters.industry.has(ind.slug)} onClick={() => toggleFilter('industry', ind.slug)} />
                ))}
              </div>
            )}
            <div id="group-geography" className="flex items-center gap-1.5 pr-5 mr-5 border-r border-[var(--border)] shrink-0">
              <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-[var(--mist)] whitespace-nowrap mr-0.5">Geography</span>
              {GEO_OPTIONS.map((o) => (
                <FilterPill key={o.value} label={o.label} active={filters.geography.has(o.value)} onClick={() => toggleFilter('geography', o.value)} />
              ))}
            </div>
            <div id="group-level" className="flex items-center gap-1.5 pr-5 mr-5 border-r border-[var(--border)] shrink-0">
              <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-[var(--mist)] whitespace-nowrap mr-0.5">Expert Level</span>
              {LEVEL_OPTIONS.map((o) => (
                <FilterPill key={o.value} label={o.label} active={filters.level.has(o.value)} onClick={() => toggleFilter('level', o.value)} />
              ))}
            </div>
            <div id="group-tier" className="flex items-center gap-1.5 shrink-0">
              <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-[var(--mist)] whitespace-nowrap mr-0.5">Tier</span>
              {TIER_OPTIONS.map((o) => (
                <FilterPill key={o.value} label={o.label} active={filters.tier.has(o.value)} onClick={() => toggleFilter('tier', o.value)} />
              ))}
            </div>
          </div>

          {/* Results bar */}
          <div className="flex flex-wrap items-center justify-between py-2.5 gap-3 border-t border-[var(--border)]">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-[11px] text-[var(--mist)] tracking-[0.06em] whitespace-nowrap">
                Showing <strong className="text-[var(--ink)]">{docs.length}</strong> of <strong className="text-[var(--ink)]">{total}</strong> transcripts
              </span>
              {activeChips.map(({ group, value, label }) => (
                <button
                  key={`${group}:${value}`}
                  onClick={() => toggleFilter(group, value)}
                  className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.06em] text-[var(--accent)] bg-[var(--accent-tint)] border border-[var(--accent-border)] px-2.5 py-0.5 rounded-full cursor-pointer transition-all duration-150 hover:bg-[rgba(52,211,153,0.2)]"
                >
                  {label} <span className="text-[12px] leading-none">×</span>
                </button>
              ))}
              {hasFilters && (
                <button onClick={clearAll} className="font-mono text-[10px] tracking-[0.08em] uppercase text-[var(--mist)] bg-none border-none cursor-pointer transition-colors duration-150 hover:text-[#F87171]">
                  Clear all
                </button>
              )}
            </div>
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
                      view === v ? 'bg-[var(--surface)] border-[var(--border-md)] text-[var(--ink)]' : 'bg-transparent border-[var(--border)] text-[var(--mist)]',
                    ].join(' ')}
                  >
                    {v === 'grid' ? <GridIcon /> : <ListIcon />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ───────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-10 py-8 pb-20">
        {loading && docs.length === 0 ? (
          <div className="py-20 text-center font-mono text-[11px] text-[var(--mist)]">Loading…</div>
        ) : docs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-[var(--border-md)] rounded-[18px] bg-[var(--surface)]">
            <div className="w-[52px] h-[52px] rounded-[14px] bg-[var(--accent-tint)] border border-[var(--accent-border)] flex items-center justify-center mb-5">
              <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-[22px] h-[22px] text-[var(--accent)]">
                <circle cx="10" cy="10" r="7" /><path d="m15 15 4 4" /><path d="M10 7v3M10 13h.01" />
              </svg>
            </div>
            <div className="text-[18px] font-medium tracking-[-0.02em] mb-2">No transcripts match these filters</div>
            <p className="text-[14px] text-[var(--ink-2)] leading-[1.6] mb-6">Try adjusting or clearing your active filters to see more results.</p>
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] uppercase text-[var(--accent)] bg-[var(--accent-tint)] border border-[var(--accent-border)] px-5 py-2.5 rounded-lg cursor-pointer transition-all duration-150 hover:bg-[rgba(52,211,153,0.14)]"
            >
              Clear all filters →
            </button>
          </div>
        ) : (
          <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3' : 'flex flex-col gap-3'}>
            {docs.map((doc) => <TranscriptCard key={doc.id} doc={doc} view={view} />)}
          </div>
        )}

        {hasNext && docs.length > 0 && (
          <div className="flex justify-center pt-10 mt-10 border-t border-[var(--border)]">
            <button
              onClick={() => fetchDocs(filters, sort, page + 1, true)}
              disabled={loading}
              className="inline-flex items-center gap-2 text-[13px] font-medium text-[var(--ink-2)] bg-[var(--surface)] border border-[var(--border)] px-7 py-2.5 rounded-[9px] cursor-pointer transition-all duration-150 hover:border-[var(--border-md)] hover:text-[var(--ink)] disabled:opacity-50"
            >
              {loading ? 'Loading…' : 'Load more transcripts'}
              {!loading && (
                <span className="font-mono text-[10px] text-[var(--mist)] tracking-[0.06em]">{total - docs.length} remaining</span>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
