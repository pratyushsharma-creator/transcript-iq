'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'

// ── Types ─────────────────────────────────────────────────────────────────

type Industry = { id: string; name: string; slug: string }

export type EarningsDoc = {
  id: string
  slug: string
  title: string
  companyName: string
  ticker: string
  exchange: string
  quarter: string
  fiscalYear: number
  reportDate: string
  summary?: string | null
  performanceBadges?: string[] | null
  keyMetrics?: Array<{ id?: string; metric: string; value: string; yoyChange?: string | null }> | null
  keyTopics?: Array<{ id?: string; topic: string }> | null
  priceUsd: number
  engagementCopy?: string | null
  sectors?: Array<Industry | string> | null
}

type ActiveFilters = {
  sector: Set<string>
  exchange: Set<string>
  quarter: Set<string>
  performance: Set<string>
}

function emptyFilters(): ActiveFilters {
  return { sector: new Set(), exchange: new Set(), quarter: new Set(), performance: new Set() }
}

// ── Static options ────────────────────────────────────────────────────────

const EXCHANGE_OPTIONS = [
  { label: 'NASDAQ', value: 'NASDAQ' },
  { label: 'NYSE', value: 'NYSE' },
  { label: 'NSE / BSE', value: 'NSE' },
  { label: 'LSE', value: 'LSE' },
  { label: 'HKEX', value: 'HKEX' },
  { label: 'SGX', value: 'SGX' },
]

const QUARTER_OPTIONS = [
  { label: 'Q1', value: 'Q1' },
  { label: 'Q2', value: 'Q2' },
  { label: 'Q3', value: 'Q3' },
  { label: 'Q4', value: 'Q4' },
  { label: 'Full Year', value: 'FY' },
]

type PerfVariant = 'beat' | 'miss' | 'inline'

const PERF_OPTIONS: Array<{ label: string; value: string; variant: PerfVariant }> = [
  { label: 'EPS Beat', value: 'eps-beat', variant: 'beat' },
  { label: 'Rev Beat', value: 'rev-beat', variant: 'beat' },
  { label: 'EPS In-Line', value: 'eps-in-line', variant: 'inline' },
  { label: 'Rev In-Line', value: 'rev-in-line', variant: 'inline' },
  { label: 'EPS Miss', value: 'eps-miss', variant: 'miss' },
  { label: 'Rev Miss', value: 'rev-miss', variant: 'miss' },
]

const SORT_OPTIONS = [
  { label: 'Newest first', value: '-reportDate' },
  { label: 'By report date', value: 'reportDate' },
  { label: 'Ticker A–Z', value: 'ticker' },
]

// ── Sub-components ────────────────────────────────────────────────────────

function PerfBadge({ value }: { value: string }) {
  const isBeat = value.includes('beat')
  const isMiss = value.includes('miss')
  const label =
    value === 'eps-beat' ? 'EPS Beat'
    : value === 'rev-beat' ? 'Rev Beat'
    : value === 'eps-miss' ? 'EPS Miss'
    : value === 'rev-miss' ? 'Rev Miss'
    : value === 'eps-in-line' ? 'EPS In-Line'
    : value === 'rev-in-line' ? 'Rev In-Line'
    : value

  if (isBeat) return (
    <span className="inline-flex items-center gap-1 font-mono text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-0.5 rounded bg-[rgba(52,211,153,0.10)] border border-[rgba(52,211,153,0.28)] text-[#34D399]">
      <span className="text-[8px]">↑</span>{label}
    </span>
  )
  if (isMiss) return (
    <span className="inline-flex items-center gap-1 font-mono text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-0.5 rounded bg-[rgba(248,113,113,0.10)] border border-[rgba(248,113,113,0.28)] text-[#F87171]">
      <span className="text-[8px]">↓</span>{label}
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 font-mono text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-0.5 rounded bg-[rgba(161,161,170,0.08)] border border-[rgba(161,161,170,0.2)] text-[#A1A1AA]">
      {label}
    </span>
  )
}

// ── Standard sidebar filter group ─────────────────────────────────────────

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
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
                    checked
                      ? 'bg-[var(--accent)] border-[var(--accent)]'
                      : 'border-[var(--border-2)] bg-transparent group-hover:border-[var(--accent-border)]'
                  }`}
                >
                  {checked && (
                    <svg viewBox="0 0 10 8" fill="none" className="w-2.5 h-2">
                      <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className={`text-[13px] leading-[1.3] transition-colors ${checked ? 'text-[var(--ink)] font-medium' : 'text-[var(--ink-2)] group-hover:text-[var(--ink)]'}`}>
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

// ── Performance filter group (colour-coded beat/miss/inline) ──────────────

function PerfFilterGroup({
  active,
  onToggle,
}: {
  active: Set<string>
  onToggle: (value: string) => void
}) {
  const [open, setOpen] = useState(true)
  const hasActive = PERF_OPTIONS.some((o) => active.has(o.value))

  const variantColor: Record<PerfVariant, { text: string; bg: string; border: string; check: string }> = {
    beat: { text: 'text-[#34D399]', bg: 'bg-[rgba(52,211,153,0.15)]', border: 'border-[rgba(52,211,153,0.35)]', check: '#34D399' },
    miss: { text: 'text-[#F87171]', bg: 'bg-[rgba(248,113,113,0.15)]', border: 'border-[rgba(248,113,113,0.35)]', check: '#F87171' },
    inline: { text: 'text-[#A1A1AA]', bg: 'bg-[rgba(161,161,170,0.1)]', border: 'border-[rgba(161,161,170,0.25)]', check: '#A1A1AA' },
  }

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
          Performance
          {hasActive && (
            <span className="ml-1.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[var(--accent)] text-[7px] text-black font-semibold">
              {PERF_OPTIONS.filter((o) => active.has(o.value)).length}
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
          {PERF_OPTIONS.map((opt) => {
            const checked = active.has(opt.value)
            const vc = variantColor[opt.variant]
            return (
              <button
                key={opt.value}
                onClick={() => onToggle(opt.value)}
                className={`group flex items-center gap-2.5 w-full rounded-md px-1 py-1.5 text-left transition-colors ${
                  checked ? `${vc.bg}` : 'hover:bg-[var(--surface-2)]'
                }`}
              >
                {/* Colour-coded checkbox */}
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
                    checked ? `${vc.border}` : 'border-[var(--border-2)] group-hover:border-[var(--border-2)]'
                  }`}
                  style={checked ? { background: vc.check + '33' } : {}}
                >
                  {checked && (
                    <svg viewBox="0 0 10 8" fill="none" className="w-2.5 h-2">
                      <path d="M1 4l2.5 2.5L9 1" stroke={vc.check} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className={`text-[13px] leading-[1.3] transition-colors ${checked ? `${vc.text} font-medium` : 'text-[var(--ink-2)] group-hover:text-[var(--ink)]'}`}>
                  {opt.label}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Filter panel (shared between sidebar and mobile drawer) ───────────────

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
    filters.sector.size > 0 ||
    filters.exchange.size > 0 ||
    filters.quarter.size > 0 ||
    filters.performance.size > 0

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
          label="Sector"
          items={industries.map((i) => ({ label: i.name, value: i.slug }))}
          active={filters.sector}
          onToggle={(v) => onToggle('sector', v)}
        />
      )}
      <FilterGroup
        label="Exchange"
        items={EXCHANGE_OPTIONS}
        active={filters.exchange}
        onToggle={(v) => onToggle('exchange', v)}
      />
      <FilterGroup
        label="Quarter"
        items={QUARTER_OPTIONS}
        active={filters.quarter}
        onToggle={(v) => onToggle('quarter', v)}
      />
      <PerfFilterGroup
        active={filters.performance}
        onToggle={(v) => onToggle('performance', v)}
      />
    </div>
  )
}

// ── Card ──────────────────────────────────────────────────────────────────

function EarningsCard({ doc, view }: { doc: EarningsDoc; view: 'grid' | 'list' }) {
  const badges = doc.performanceBadges ?? []
  const hasBeat = badges.some((b) => b.includes('beat'))
  const hasMiss = !hasBeat && badges.some((b) => b.includes('miss'))

  const quarterLabel = doc.quarter && doc.fiscalYear ? `${doc.quarter} FY${doc.fiscalYear}` : doc.quarter ?? ''
  const reportDateStr = doc.reportDate
    ? new Date(doc.reportDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null

  const metrics = (doc.keyMetrics ?? []).slice(0, 3)
  const topics = doc.keyTopics ?? []
  const displayTopics = topics.slice(0, 3)
  const extraTopics = topics.length - displayTopics.length

  return (
    <Link
      href={`/earnings-analysis/${doc.slug}`}
      className={[
        'group relative flex overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--surface)] transition-all duration-200 no-underline text-[var(--ink)]',
        'hover:border-[var(--border-md)] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.3)]',
        view === 'list' ? 'flex-row' : 'flex-col',
      ].join(' ')}
    >
      {hasBeat && (
        <span aria-hidden className="absolute top-0 left-0 right-0 h-px z-10" style={{ background: 'linear-gradient(90deg, transparent, #34D399, transparent)', opacity: 0.7 }} />
      )}
      {hasMiss && (
        <span aria-hidden className="absolute top-0 left-0 right-0 h-px z-10" style={{ background: 'linear-gradient(90deg, transparent, #F87171, transparent)', opacity: 0.5 }} />
      )}

      {/* Ticker strip */}
      <div
        className={[
          'flex items-center justify-between gap-2.5',
          view === 'list'
            ? 'flex-col items-start justify-start pt-[18px] px-5 pb-3 min-w-[140px] border-r border-[var(--border)] bg-[var(--surface-2)]/30'
            : 'px-[18px] pt-3.5',
        ].join(' ')}
      >
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[16px] font-semibold tracking-[-0.01em] text-[var(--ink)]">
            <span className="text-[11px] text-[var(--mist)] font-normal mr-0.5">$</span>
            {doc.ticker}
          </span>
          <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-[var(--mist)] bg-[var(--surface-2)] px-1.5 py-0.5 rounded border border-[var(--border)]">
            {doc.exchange}
          </span>
        </div>
        {quarterLabel && (
          <span className="font-mono text-[9px] tracking-[0.08em] font-medium text-[var(--accent)] bg-[var(--accent-tint)] border border-[var(--accent-border)] px-2 py-0.5 rounded whitespace-nowrap">
            {quarterLabel}
          </span>
        )}
      </div>

      {/* Performance badges */}
      {badges.length > 0 && (
        <div className={['flex items-center gap-1.5 flex-wrap', view === 'list' ? 'flex-col items-start pl-5 pt-[18px] pb-0' : 'px-[18px] pt-2.5 pb-2'].join(' ')}>
          {badges.map((b, i) => <PerfBadge key={i} value={b} />)}
        </div>
      )}

      {/* Body */}
      <div className={['flex-1 flex flex-col', view === 'list' ? 'px-5 py-[18px]' : 'px-[18px] pb-3.5'].join(' ')}>
        <div className="text-[11px] text-[var(--mist)] dark:text-[#A0A0AA] mb-2">
          {doc.companyName}{reportDateStr && ` · Report date: ${reportDateStr}`}
        </div>
        <div className="text-[14px] font-medium tracking-[-0.015em] leading-[1.35] text-[var(--ink)] mb-2.5 flex-1">
          {doc.title}
        </div>
        {doc.summary && (
          <p className="text-[11px] text-[var(--slate)] dark:text-[#A0A0AA] leading-[1.6] mb-3 line-clamp-2">
            {doc.summary}
          </p>
        )}

        {/* Metrics mini-table (grid view only) */}
        {metrics.length > 0 && view !== 'list' && (
          <div className="bg-[var(--bg)] border border-[var(--border)] rounded-[7px] overflow-hidden mb-3">
            {metrics.map((m, i) => (
              <div
                key={i}
                className="grid gap-2 px-2.5 py-[7px] border-b border-[var(--border)] last:border-b-0 items-center"
                style={{ gridTemplateColumns: '1fr 80px 60px' }}
              >
                <span className="text-[11px] text-[var(--slate)] dark:text-[#A0A0AA]">{m.metric}</span>
                <span className="font-mono text-[11px] font-medium text-[var(--ink)] text-right">{m.value}</span>
                {m.yoyChange && (
                  <span
                    className={[
                      'font-mono text-[10px] text-right',
                      m.yoyChange.startsWith('+') || m.yoyChange.startsWith('↑') ? 'text-[#34D399]'
                        : m.yoyChange.startsWith('-') || m.yoyChange.startsWith('↓') ? 'text-[#F87171]'
                          : 'text-[var(--mist)]',
                    ].join(' ')}
                  >
                    {m.yoyChange}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Topics */}
        {displayTopics.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {displayTopics.map((t, i) => (
              <span key={i} className="font-mono text-[9px] tracking-[0.04em] text-[var(--slate)] bg-[var(--bg)] border border-[var(--border)] px-1.5 py-0.5 rounded">
                {t.topic}
              </span>
            ))}
            {extraTopics > 0 && <span className="font-mono text-[9px] text-[var(--mist)] self-center">+{extraTopics} more</span>}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className={[
          'flex items-center justify-between gap-2.5 border-t border-[var(--border)]',
          view === 'list' ? 'flex-col justify-center items-start border-t-0 border-l px-5 py-[18px] min-w-[150px]' : 'px-[18px] py-2.5',
        ].join(' ')}
      >
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[20px] font-medium text-[var(--accent)] tracking-[-0.02em]">
              ${doc.priceUsd}
            </span>
            <span className="text-[11px] text-[var(--mist)] dark:text-[#A0A0AA]">flat · instant PDF</span>
          </div>
          {reportDateStr && view === 'list' && (
            <div className="font-mono text-[10px] text-[var(--mist)] dark:text-[#A0A0AA] tracking-[0.06em] mt-0.5">{reportDateStr}</div>
          )}
        </div>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
          className="text-[12px] font-medium text-black bg-[var(--accent-deep)] px-3.5 py-1.5 rounded-[7px] border-none cursor-pointer transition-all duration-150 hover:bg-[var(--accent)] whitespace-nowrap shrink-0"
        >
          Buy →
        </button>
      </div>

      {/* Social proof */}
      {doc.engagementCopy && view !== 'list' && (
        <div className="flex items-center gap-1.5 bg-[var(--bg)] px-[18px] py-[7px] text-[11px] text-[var(--mist)] dark:text-[#A0A0AA] border-t border-[var(--border)]">
          <span className="w-1 h-1 rounded-full bg-[var(--accent)] opacity-60" />
          {doc.engagementCopy}
        </div>
      )}
    </Link>
  )
}

// ── Stats panel ───────────────────────────────────────────────────────────

function StatsPanel() {
  const cells = [
    { val: '$99', color: 'text-[var(--accent)]', label: 'Flat price · no tiers' },
    { val: 'Same\nday', color: 'text-[var(--ink)]', label: 'Delivery on call date' },
    { val: '68%', color: 'text-[var(--accent)]', label: 'EPS beats in library' },
    { val: '8', color: 'text-[#FBBF24]', label: 'Exchanges covered' },
    { val: 'Q1–Q4', color: 'text-[var(--ink)]', label: 'All quarters covered' },
    { val: '12–15', color: 'text-[var(--ink)]', label: 'Extractable metrics' },
  ]
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[14px] overflow-hidden mb-1">
      <div className="grid grid-cols-3">
        {cells.map((c, i) => {
          const isLastInRow = (i + 1) % 3 === 0
          const isSecondRow = i >= 3
          return (
            <div
              key={i}
              className={[
                'p-4',
                !isLastInRow ? 'border-r border-[var(--border)]' : '',
                !isSecondRow ? 'border-b border-[var(--border)]' : '',
              ].join(' ')}
            >
              <div className={`font-mono text-[22px] font-medium tracking-[-0.03em] leading-[1] mb-1 whitespace-pre ${c.color}`}>
                {c.val}
              </div>
              <div className="font-mono text-[9px] tracking-[0.1em] uppercase text-[var(--mist)] leading-[1.3]">
                {c.label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
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

interface EarningsLibraryProps {
  initialDocs: EarningsDoc[]
  totalDocs: number
  industries: Industry[]
}

export function EarningsLibrary({ initialDocs, totalDocs, industries }: EarningsLibraryProps) {
  const [docs, setDocs] = useState<EarningsDoc[]>(initialDocs)
  const [total, setTotal] = useState(totalDocs)
  const [filters, setFilters] = useState<ActiveFilters>(emptyFilters())
  const [sort, setSort] = useState('-reportDate')
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
    if (f.sector.size > 0) params.set('where[sectors.slug][in]', [...f.sector].join(','))
    if (f.exchange.size > 0) params.set('where[exchange][in]', [...f.exchange].join(','))
    if (f.quarter.size > 0) params.set('where[quarter][in]', [...f.quarter].join(','))
    if (f.performance.size > 0) params.set('where[performanceBadges][in]', [...f.performance].join(','))
    return params.toString()
  }, [])

  const fetchDocs = useCallback(
    async (f: ActiveFilters, s: string, p: number, append = false) => {
      setLoading(true)
      try {
        const res = await fetch(`/api/earnings-analyses?${buildParams(f, s, p)}`)
        const data = await res.json()
        setDocs((prev) => (append ? [...prev, ...(data.docs ?? [])] : (data.docs ?? [])))
        setTotal(data.totalDocs ?? 0)
        setHasNext(data.hasNextPage ?? false)
        setPage(p)
        const u = new URLSearchParams()
        if (f.sector.size > 0) u.set('sector', [...f.sector].join(','))
        if (f.exchange.size > 0) u.set('exchange', [...f.exchange].join(','))
        if (f.quarter.size > 0) u.set('quarter', [...f.quarter].join(','))
        if (f.performance.size > 0) u.set('performance', [...f.performance].join(','))
        window.history.replaceState({}, '', u.toString() ? `?${u}` : location.pathname)
      } catch {
        // noop
      } finally {
        setLoading(false)
      }
    },
    [buildParams],
  )

  function toggleFilter(group: keyof ActiveFilters, value: string) {
    const next: ActiveFilters = {
      sector: new Set(filters.sector),
      exchange: new Set(filters.exchange),
      quarter: new Set(filters.quarter),
      performance: new Set(filters.performance),
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

  // Active chips
  const activeChips: { group: keyof ActiveFilters; value: string; label: string }[] = []
  ;(Object.keys(filters) as Array<keyof ActiveFilters>).forEach((group) => {
    filters[group].forEach((value) => {
      const label =
        group === 'sector' ? (industries.find((i) => i.slug === value)?.name ?? value)
        : group === 'exchange' ? (EXCHANGE_OPTIONS.find((o) => o.value === value)?.label ?? value)
        : group === 'quarter' ? (QUARTER_OPTIONS.find((o) => o.value === value)?.label ?? value)
        : (PERF_OPTIONS.find((o) => o.value === value)?.label ?? value)
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
            'radial-gradient(ellipse 1000px 500px at 80% -10%, var(--accent-tint-2), transparent 55%), radial-gradient(ellipse 500px 350px at -5% 110%, var(--accent-tint), transparent 60%), var(--bg)',
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, var(--grid-dot) 1px, transparent 0)',
            backgroundSize: '28px 28px',
            maskImage: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.5) 70%, transparent)',
            WebkitMaskImage: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.5) 70%, transparent)',
          }}
        />
        <div className="relative z-10 mx-auto max-w-[1280px] px-4 sm:px-6 md:px-10 pb-10 pt-1">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.1em] uppercase text-[var(--mist)] mb-7">
            <a href="/" className="hover:text-[var(--slate)] transition-colors duration-150">Home</a>
            <span className="text-[var(--border-2)]">›</span>
            <span>Earnings Analysis</span>
          </div>
          <div className="grid gap-6 lg:gap-10 items-end lg:grid-cols-[1fr_420px]">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] uppercase text-[var(--accent)] px-3 py-1.5 bg-[var(--accent-tint)] border border-[var(--accent-border)] rounded-full mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                AI-Powered · Buy-Side Ready
              </div>
              <h1 className="text-[clamp(34px,4.5vw,58px)] font-semibold tracking-[-0.04em] leading-[1] mb-4">
                Earnings calls, <em className="not-italic text-[var(--accent)] font-[400]">dissected.</em>
              </h1>
              <p className="text-[16px] text-[var(--ink-2)] leading-[1.65] max-w-[480px]">
                Comprehensive earnings analysis of public company calls — delivered as a buy-side ready PDF at $99 flat. Same-day delivery on the day of the call.
              </p>
            </div>
            <StatsPanel />
          </div>
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
                {hasFilters ? ' matching' : ''} anal{docs.length !== 1 ? 'yses' : 'ysis'}
              </span>

              {activeChips.map(({ group, value, label }) => (
                <button
                  key={`${group}:${value}`}
                  onClick={() => toggleFilter(group, value)}
                  className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.06em] text-[var(--accent)] bg-[var(--accent-tint)] border border-[var(--accent-border)] px-2.5 py-0.5 rounded-full cursor-pointer transition-all hover:bg-[rgba(52,211,153,0.18)]"
                >
                  {label} <span className="text-[12px] leading-none">×</span>
                </button>
              ))}
              {hasFilters && (
                <button
                  onClick={clearAll}
                  className="font-mono text-[10px] tracking-[0.08em] uppercase text-[var(--mist)] bg-none border-none cursor-pointer hover:text-[#F87171] transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-[var(--mist)]">Sort</span>
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); fetchDocs(filters, e.target.value, 1) }}
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
                      view === v ? 'bg-[var(--surface)] border-[var(--border-2)] text-[var(--ink)]' : 'bg-transparent border-[var(--border)] text-[var(--mist)]',
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
              <div className="text-[18px] font-medium tracking-[-0.02em] mb-2">No analyses match these filters</div>
              <p className="text-[14px] text-[var(--ink-2)] leading-[1.6] mb-6">Try adjusting or clearing your active filters.</p>
              <button
                onClick={clearAll}
                className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] uppercase text-[var(--accent)] bg-[var(--accent-tint)] border border-[var(--accent-border)] px-5 py-2.5 rounded-lg cursor-pointer transition-all hover:bg-[rgba(52,211,153,0.14)]"
              >
                Clear all filters →
              </button>
            </div>
          ) : (
            <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3' : 'flex flex-col gap-3'}>
              {docs.map((doc) => <EarningsCard key={doc.id} doc={doc} view={view} />)}
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
                {loading ? 'Loading…' : 'Load more analyses →'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile filter drawer ───────────────────────────────────────────── */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative flex max-h-[85vh] flex-col rounded-t-2xl bg-[var(--bg)] border-t border-[var(--border)] shadow-2xl">
            <div className="flex justify-center pt-3 pb-1">
              <span className="h-1 w-10 rounded-full bg-[var(--border-2)]" />
            </div>
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
                  <button onClick={clearAll} className="font-mono text-[10px] tracking-[0.08em] uppercase text-[var(--mist)] transition-colors hover:text-[#F87171]">
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
            <div className="overflow-y-auto flex-1 px-5">
              <FilterPanel
                industries={industries}
                filters={filters}
                onToggle={toggleFilter}
                onClearAll={clearAll}
              />
            </div>
            <div className="px-5 py-4 border-t border-[var(--border)]">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full rounded-xl bg-[var(--accent)] py-3 text-[14px] font-semibold text-black transition-all hover:bg-[var(--accent-bright)]"
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
