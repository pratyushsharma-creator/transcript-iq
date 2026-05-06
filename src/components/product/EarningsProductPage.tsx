'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'

type PerfKey = 'eps-beat' | 'eps-miss' | 'eps-in-line' | 'rev-beat' | 'rev-miss' | 'rev-in-line'
type CompKey = 'mnpi-screened' | 'pii-redacted' | 'compliance-certified'
type TabId = 'summary' | 'themes' | 'commentary' | 'methodology'

interface Industry { id: string; name: string; slug: string }
interface Company { id: string; name: string; ticker?: string }

interface EarningsDoc {
  id: string
  title: string
  slug: string
  companyName: string
  ticker: string
  exchange: string
  quarter: string
  fiscalYear: number
  reportDate?: string
  performanceBadges?: PerfKey[]
  summary?: string
  executiveSummaryPreview?: string
  keyTopics?: { id?: string; topic: string }[]
  keyMetrics?: { id?: string; metric: string; value: string; yoyChange?: string }[]
  sampleQA?: { question?: string; answer?: string }
  pageCount?: number
  priceUsd: number
  originalPriceUsd?: number
  discountPercent?: number
  complianceBadges?: CompKey[]
  engagementCopy?: string
  sectors?: (string | Industry)[]
  companies?: (string | Company)[]
}

export interface RelatedEarnings {
  id: string
  slug: string
  ticker: string
  quarter: string
  fiscalYear: number
  companyName: string
  reportDate?: string
  title: string
  priceUsd: number
  performanceBadges?: PerfKey[]
}

const PERF: Record<PerfKey, { label: string; icon: string; cls: string }> = {
  'eps-beat':    { label: 'EPS Beat',    icon: '↑', cls: 'text-[var(--beat)] bg-[var(--beat-bg)] border-[var(--beat-border)]' },
  'eps-miss':    { label: 'EPS Miss',    icon: '↓', cls: 'text-[var(--miss)] bg-[var(--miss-bg)] border-[var(--miss-border)]' },
  'eps-in-line': { label: 'EPS In-Line', icon: '—', cls: 'text-[var(--inline-c)] bg-[var(--inline-bg)] border-[var(--inline-border)]' },
  'rev-beat':    { label: 'Rev Beat',    icon: '↑', cls: 'text-[var(--beat)] bg-[var(--beat-bg)] border-[var(--beat-border)]' },
  'rev-miss':    { label: 'Rev Miss',    icon: '↓', cls: 'text-[var(--miss)] bg-[var(--miss-bg)] border-[var(--miss-border)]' },
  'rev-in-line': { label: 'Rev In-Line', icon: '—', cls: 'text-[var(--inline-c)] bg-[var(--inline-bg)] border-[var(--inline-border)]' },
}

const COMP_LABELS: Record<CompKey, string> = {
  'mnpi-screened': 'MNPI Screened',
  'pii-redacted': 'PII Redacted',
  'compliance-certified': 'Compliance Certified',
}

function CompBadge({ badge }: { badge: CompKey }) {
  const icons: Record<CompKey, React.ReactNode> = {
    'mnpi-screened': (
      <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M1.5 5l2.5 2.5 5-5"/>
      </svg>
    ),
    'pii-redacted': (
      <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="4" width="6" height="5" rx="1"/><path d="M3.5 4V3a1.5 1.5 0 1 1 3 0v1"/>
      </svg>
    ),
    'compliance-certified': (
      <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M5 1.5L6.5 4 9 4.5 7 6.5l.5 2.5L5 7.5 2.5 9l.5-2.5-2-2L3.5 4z"/>
      </svg>
    ),
  }
  return (
    <div className="inline-flex items-center gap-[5px] font-mono text-[9px] tracking-[0.1em] uppercase text-[var(--accent)] bg-[var(--accent-tint)] border border-[var(--accent-border)] px-[10px] py-1 rounded-full">
      {icons[badge]}
      {COMP_LABELS[badge]}
    </div>
  )
}

function yoyCls(v?: string) {
  if (!v) return 'text-[var(--slate)] bg-[var(--surface-2)]'
  return v.startsWith('↑') || v.startsWith('+')
    ? 'text-[var(--beat)] bg-[var(--beat-bg)]'
    : v.startsWith('↓') || v.startsWith('-')
    ? 'text-[var(--miss)] bg-[var(--miss-bg)]'
    : 'text-[var(--slate)] bg-[var(--surface-2)]'
}

function RelatedCard({ doc }: { doc: RelatedEarnings }) {
  const hasBeat = doc.performanceBadges?.some(p => p.includes('beat'))
  const hasMiss = !hasBeat && doc.performanceBadges?.some(p => p.includes('miss'))
  const qLabel = `${doc.quarter} FY${doc.fiscalYear}`
  const dateStr = doc.reportDate
    ? new Date(doc.reportDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : ''
  return (
    <Link
      href={`/earnings-analysis/${doc.slug}`}
      className="relative bg-[var(--surface)] border border-[var(--border)] rounded-[14px] overflow-hidden flex flex-col no-underline text-inherit transition-all duration-200 hover:border-[var(--border-md)] hover:-translate-y-0.5 hover:shadow-[0_10px_32px_-10px_rgba(0,0,0,0.3)]"
    >
      {hasBeat && (
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--beat), transparent)', opacity: 0.6 }} />
      )}
      {hasMiss && (
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--miss), transparent)', opacity: 0.5 }} />
      )}
      <div className="px-4 pt-[14px] pb-0 flex items-center justify-between">
        <span className="font-mono text-[18px] font-semibold tracking-[-0.02em] text-[var(--ink)]">
          <span className="text-[10px] text-[var(--mist)] font-normal align-super mr-px">$</span>
          {doc.ticker}
        </span>
        <span className="font-mono text-[9px] tracking-[0.08em] text-[var(--accent)] bg-[var(--accent-tint)] border border-[var(--accent-border)] px-2 py-0.5 rounded-[4px]">
          {qLabel}
        </span>
      </div>
      <div className="px-4 pt-2 pb-0 flex gap-1 flex-wrap">
        {(doc.performanceBadges ?? []).map(p => (
          <span key={p} className={`font-mono text-[8px] font-semibold tracking-[0.08em] uppercase px-[7px] py-0.5 rounded-[3px] border ${PERF[p].cls}`}>
            {PERF[p].icon} {PERF[p].label}
          </span>
        ))}
      </div>
      <div className="px-4 pt-2.5 pb-[14px] flex-1">
        <div className="text-[11px] text-[var(--mist)] mb-[5px]">
          {doc.companyName}{dateStr ? ` · ${dateStr}` : ''}
        </div>
        <div className="text-[13px] font-medium tracking-[-0.01em] leading-[1.35] text-[var(--ink)]">
          {doc.title}
        </div>
      </div>
      <div className="px-4 py-[10px] border-t border-[var(--border)] flex items-center justify-between">
        <span className="font-mono text-[15px] font-medium text-[var(--accent)]">${doc.priceUsd}</span>
        <span className="font-mono text-[9px] tracking-[0.08em] text-[var(--accent)]">View →</span>
      </div>
    </Link>
  )
}

export function EarningsProductPage({
  analysis,
  related,
  executiveSummaryHtml,
}: {
  analysis: EarningsDoc
  related: RelatedEarnings[]
  executiveSummaryHtml?: string
}) {
  const [tab, setTab] = useState<TabId>('summary')
  const [cartAdded, setCartAdded] = useState(false)
  const router = useRouter()
  const { addItem, openCart, hasItem } = useCart()
  const inCart = hasItem(analysis.slug)

  const quarterLabel = `${analysis.quarter} FY${analysis.fiscalYear}`
  const reportDateStr = analysis.reportDate
    ? new Date(analysis.reportDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : ''

  const sectors = (analysis.sectors ?? []).filter((s): s is Industry => typeof s === 'object' && s !== null)
  const companies = (analysis.companies ?? []).filter((c): c is Company => typeof c === 'object' && c !== null)
  const primarySector = sectors[0]

  const badges = analysis.performanceBadges ?? []
  const compBadges = (analysis.complianceBadges ?? ['mnpi-screened', 'pii-redacted', 'compliance-certified']) as CompKey[]

  const TABS: { id: TabId; label: string }[] = [
    { id: 'summary', label: 'Analysis Summary' },
    { id: 'themes', label: 'Key Themes' },
    { id: 'commentary', label: 'Management Commentary' },
    { id: 'methodology', label: 'Methodology' },
  ]

  const methodologyItems = [
    {
      label: 'Source',
      value: `Official earnings call transcript and supplemental financial tables. Public company disclosure. ${analysis.ticker} ${quarterLabel}.${reportDateStr ? ` ${reportDateStr}.` : ''}`,
    },
    {
      label: 'Analysis model',
      value: "Comprehensive analysis by Transcript IQ's proprietary buy-side framework — consensus comparison, segment breakdown, guidance read-through, and investment implications.",
    },
    {
      label: 'Consensus source',
      value: 'Buy-side consensus estimates compiled from Bloomberg, FactSet, and Visible Alpha prior to the earnings release.',
    },
    {
      label: 'Delivery format',
      value: `PDF · ${analysis.pageCount ?? '~28'} pages · Instant download`,
      accent: true,
    },
    {
      label: 'Compliance',
      value: 'Analysis based entirely on public disclosures. MNPI-screened. Suitable for use in investment research and IC materials.',
    },
    {
      label: 'Coverage approach',
      value: 'Structured for institutional buy-side users: EPS/Rev vs. consensus, segment deep-dive, management commentary synthesis, guidance read-throughs, and cross-company implications.',
    },
  ]

  const includedItems = [
    `Full earnings analysis PDF · ${analysis.pageCount ?? 28} pages`,
    'EPS & revenue vs. consensus breakdown',
    'Key management commentary themes',
    'Guidance read-throughs & investment implications',
    'Tagged companies, keywords & metadata',
    'Structured for IC memos & investment research',
  ]

  return (
    <div className="mx-auto max-w-[1280px] px-6 sm:px-10 pb-16">

      {/* Top bar */}
      <div className="flex items-center justify-between pt-5">
        <nav className="hidden md:flex items-center gap-2 font-mono text-[10px] tracking-[0.1em] uppercase text-[var(--mist)]">
          <Link href="/" className="hover:text-[var(--slate)] transition-colors">Home</Link>
          <span className="text-[var(--border-2)]">›</span>
          <Link href="/earnings-analysis" className="hover:text-[var(--slate)] transition-colors">Earnings Library</Link>
          {primarySector && (
            <>
              <span className="text-[var(--border-2)]">›</span>
              <Link href={`/earnings-analysis?sector=${primarySector.slug}`} className="hover:text-[var(--slate)] transition-colors">
                {primarySector.name}
              </Link>
            </>
          )}
          <span className="text-[var(--border-2)]">›</span>
          <span>{analysis.ticker} · {quarterLabel}</span>
        </nav>
        <Link
          href="/earnings-analysis"
          className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.1em] uppercase text-[var(--mist)] bg-[var(--surface)] border border-[var(--border)] px-[14px] py-[6px] rounded-[6px] hover:text-[var(--ink)] hover:border-[var(--border-md)] transition-all no-underline"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2L3 5l3 3"/>
          </svg>
          Back to Earnings Library
        </Link>
      </div>

      {/* Hero grid */}
      <div className="grid gap-8 pt-7 items-start lg:grid-cols-[minmax(0,1fr)_360px]">

        {/* ═══ LEFT COLUMN ═══ */}
        <div>

          {/* Meta badges */}
          <div className="flex items-center gap-2.5 mb-[18px] flex-wrap">
            <div className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.12em] uppercase text-[var(--warning)] bg-[var(--warn-tint)] border border-[var(--warn-border)] px-3 py-1 rounded-full">
              ⚡ Earnings Analysis
            </div>
            {primarySector && (
              <div className="inline-flex items-center gap-[5px] font-mono text-[10px] tracking-[0.1em] uppercase text-[var(--accent)] bg-[var(--accent-tint)] border border-[var(--accent-border)] px-3 py-1 rounded-full">
                <div className="w-[5px] h-[5px] rounded-full bg-[var(--accent)]" />
                {primarySector.name}
              </div>
            )}
            <div className="font-mono text-[10px] tracking-[0.1em] text-[var(--slate)] bg-[var(--surface)] border border-[var(--border)] px-[10px] py-1 rounded-[5px]">
              {analysis.exchange}
            </div>
            {reportDateStr && (
              <span className="font-mono text-[10px] tracking-[0.08em] text-[var(--mist)]">
                Report: {reportDateStr}
              </span>
            )}
          </div>

          {/* Ticker + Quarter + Company */}
          <div className="mb-4">
            <div className="flex items-center gap-[14px] mb-3">
              <span className="font-mono text-[48px] font-semibold tracking-[-0.04em] leading-none text-[var(--ink)]">
                <span className="text-[24px] text-[var(--mist)] font-normal" style={{ verticalAlign: 'super', marginRight: 2 }}>$</span>
                {analysis.ticker}
              </span>
              <span className="font-mono text-[13px] font-medium tracking-[0.04em] text-[var(--accent)] bg-[var(--accent-tint)] border border-[var(--accent-border)] px-[14px] py-[5px] rounded-[7px] flex-shrink-0">
                {quarterLabel}
              </span>
            </div>
            <div className="text-[15px] text-[var(--slate)] tracking-[-0.01em]">{analysis.companyName}</div>
          </div>

          {/* H1 */}
          <h1 className="text-[clamp(22px,2.5vw,32px)] font-medium tracking-[-0.025em] leading-[1.2] mb-[14px] max-w-[640px] text-[var(--ink-2)]">
            {analysis.title}
          </h1>

          {/* Summary */}
          {analysis.summary && (
            <p className="text-[15px] text-[var(--ink-2)] leading-[1.7] max-w-[600px] mb-6">
              {analysis.summary}
            </p>
          )}

          {/* Performance badges */}
          {badges.length > 0 && (
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              {badges.map(p => (
                <div key={p} className={`inline-flex items-center gap-[7px] font-mono text-[12px] font-semibold tracking-[0.08em] uppercase px-4 py-2 rounded-[8px] border ${PERF[p].cls}`}>
                  <span>{PERF[p].icon}</span>
                  <span>{PERF[p].label}</span>
                </div>
              ))}
              <span className="text-[12px] text-[var(--mist)] px-1.5 py-2 font-mono tracking-[0.06em]">vs. consensus</span>
            </div>
          )}

          {/* Key metrics grid */}
          {(analysis.keyMetrics?.length ?? 0) > 0 && (
            <div className="mb-6">
              <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-[var(--mist)] mb-2.5">
                Key metrics from this quarter
              </div>
              <div className="grid gap-px bg-[var(--border)] border border-[var(--border)] rounded-[14px] overflow-hidden" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                {analysis.keyMetrics!.map(m => (
                  <div key={m.id ?? m.metric} className="bg-[var(--surface)] px-[18px] py-4 hover:bg-[var(--surface-2)] transition-colors cursor-default">
                    <div className="text-[12px] text-[var(--mist)] mb-1.5">{m.metric}</div>
                    <div className="font-mono text-[22px] font-medium tracking-[-0.03em] leading-none text-[var(--ink)] mb-[5px]">{m.value}</div>
                    {m.yoyChange && (
                      <span className={`font-mono text-[11px] font-medium inline-flex items-center gap-1 px-[7px] py-0.5 rounded-[4px] ${yoyCls(m.yoyChange)}`}>
                        {m.yoyChange}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compliance + delivery badges */}
          <div className="flex items-center gap-2 flex-wrap mb-7">
            {compBadges.map(b => <CompBadge key={b} badge={b} />)}
            {(['⚡ Same-day delivery', '📄 Instant PDF', '📊 Buy-side ready'] as const).map(label => (
              <div key={label} className="inline-flex items-center gap-[5px] font-mono text-[9px] tracking-[0.1em] uppercase text-[var(--warning)] bg-[var(--warn-tint)] border border-[var(--warn-border)] px-[10px] py-1 rounded-full">
                {label}
              </div>
            ))}
          </div>

          {/* Companies discussed */}
          {companies.length > 0 && (
            <div className="mb-8">
              <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-[var(--mist)] mb-2.5">Companies discussed</div>
              <div className="flex flex-wrap gap-1.5">
                {companies.map(c => (
                  <div key={c.id} className="inline-flex items-center gap-[5px] font-mono text-[10px] tracking-[0.04em] text-[var(--slate)] bg-[var(--surface)] border border-[var(--border)] px-[10px] py-1 rounded-[5px] hover:text-[var(--ink-2)] hover:border-[var(--border-md)] transition-all cursor-default">
                    {c.ticker && <span className="text-[var(--accent)]">${c.ticker}</span>}
                    {c.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content tabs */}
          <div className="border-t border-[var(--border)]">
            <div className="flex border-b border-[var(--border)] overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {TABS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`font-mono text-[11px] tracking-[0.08em] uppercase px-[22px] py-[14px] transition-all whitespace-nowrap bg-transparent cursor-pointer border-0 border-t-0 border-l-0 border-r-0 shrink-0 ${tab === id ? 'text-[var(--accent)]' : 'text-[var(--mist)] hover:text-[var(--slate)]'}`}
                  style={{ borderBottom: tab === id ? '1.5px solid var(--accent)' : '1.5px solid transparent' }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="py-7">

              {/* Analysis Summary */}
              {tab === 'summary' && (
                <div>
                  {/* Free preview */}
                  <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[14px] overflow-hidden mb-5">
                    <div className="px-[22px] py-[13px] border-b border-[var(--border)] bg-[var(--accent-tint)] flex items-center justify-between">
                      <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-[var(--accent)] flex items-center gap-[7px]">
                        <span className="w-[5px] h-[5px] rounded-full bg-[var(--accent)] animate-pulse" />
                        Free Preview — Analysis Summary
                      </div>
                      <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-[var(--accent)] bg-[rgba(52,211,153,0.15)] border border-[var(--accent-border)] px-2 py-0.5 rounded-[4px]">
                        Free
                      </span>
                    </div>
                    <div className="px-[22px] py-[22px] text-[15px] text-[var(--ink-2)] leading-[1.75] prose prose-invert prose-sm max-w-none [&>p]:mb-4 [&>p:last-child]:mb-0 [&>h2]:text-[var(--ink)] [&>h3]:text-[var(--ink)] [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5">
                      {executiveSummaryHtml ? (
                        <div dangerouslySetInnerHTML={{ __html: executiveSummaryHtml }} />
                      ) : (
                        <p>{analysis.summary ?? 'Analysis summary available after purchase.'}</p>
                      )}
                    </div>
                  </div>

                  {/* Locked full analysis */}
                  <div className="relative overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--surface)] mb-5">
                    <div
                      className="px-[22px] py-[22px] font-mono text-[11px] text-[var(--slate)] leading-[1.7]"
                      style={{
                        maskImage: 'linear-gradient(to bottom, black 0%, black 35%, transparent 80%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 35%, transparent 80%)',
                      }}
                    >
                      <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-[var(--accent)] mb-2">Full Analysis — EPS vs. Consensus</div>
                      <p className="text-[12px] text-[var(--mist)] leading-[1.7] mb-2">
                        Adjusted EPS vs. consensus breakdown — primary performance driver, segment revenue contribution, and gross margin trajectory relative to prior guidance...
                      </p>
                      <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-[var(--accent)] mb-2">Revenue Breakdown & Segment Analysis</div>
                      <p className="text-[12px] text-[var(--mist)] leading-[1.7] mb-2">
                        Segment-by-segment revenue analysis, margin profile, and management commentary on demand trajectory vs. consensus range expectations...
                      </p>
                      <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-[var(--accent)] mb-2">Guidance & Read-throughs</div>
                      <p className="text-[12px] text-[var(--mist)] leading-[1.7]">
                        Forward guidance implications for the sector, supply chain read-throughs, and investment implications for the broader competitive landscape...
                      </p>
                    </div>
                    <div
                      className="absolute bottom-0 left-0 right-0 px-[22px] pb-[22px] pt-7 flex flex-col items-center text-center gap-2.5"
                      style={{ background: 'linear-gradient(to bottom, transparent, rgba(24,24,27,0.97) 40%, var(--surface))' }}
                    >
                      <div className="w-[34px] h-[34px] rounded-[9px] bg-[var(--surface-2)] border border-[var(--border-md)] flex items-center justify-center">
                        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--mist)]">
                          <rect x="2" y="6" width="10" height="7" rx="1.5"/>
                          <path d="M4.5 6V4.5a2.5 2.5 0 1 1 5 0V6"/>
                        </svg>
                      </div>
                      <div className="text-[14px] font-medium tracking-[-0.01em]">Full analysis locked</div>
                      <div className="text-[12px] text-[var(--mist)]">
                        {analysis.pageCount ?? 28} pages — EPS breakdown, segment analysis, guidance read-throughs, investment implications
                      </div>
                    </div>
                  </div>

                  <div className="text-center pt-2.5">
                    <button
                      className="inline-flex items-center justify-center gap-[9px] max-w-[300px] mx-auto bg-[var(--accent)] text-white text-[15px] font-semibold tracking-[-0.01em] px-5 py-[14px] rounded-[10px] border-0 transition-all hover:bg-[var(--accent-deep)] hover:-translate-y-px cursor-pointer shadow-[0_0_0_1px_var(--accent-border),0_8px_24px_-8px_var(--accent-glow)]"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 3h9l-1.5 7h-7L3 3z"/>
                        <path d="M1 1h1.5l1.2 2M6 12.5a.5.5 0 100 1 .5.5 0 000-1zM10 12.5a.5.5 0 100 1 .5.5 0 000-1z"/>
                      </svg>
                      Unlock full analysis — ${analysis.priceUsd}
                    </button>
                  </div>
                </div>
              )}

              {/* Key Themes */}
              {tab === 'themes' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(analysis.keyTopics ?? []).map(t => (
                    <div key={t.id ?? t.topic} className="bg-[var(--surface)] border border-[var(--border)] rounded-[10px] px-[18px] py-4 hover:border-[var(--border-md)] transition-all">
                      <div className="text-[14px] font-medium tracking-[-0.01em] flex items-center gap-2 mb-[5px]">
                        <div className="w-[5px] h-[5px] rounded-full bg-[var(--accent)] flex-shrink-0" />
                        {t.topic}
                      </div>
                    </div>
                  ))}
                  {(analysis.keyTopics?.length ?? 0) === 0 && (
                    <div className="col-span-2 text-center text-[var(--mist)] text-[13px] py-8">
                      Key themes included in the full analysis.
                    </div>
                  )}
                </div>
              )}

              {/* Management Commentary */}
              {tab === 'commentary' && (
                <div className="flex flex-col gap-2.5">
                  {analysis.sampleQA?.question && analysis.sampleQA?.answer && (
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[10px] px-[18px] py-4" style={{ borderLeft: '2px solid var(--accent)' }}>
                      <div className="font-mono text-[9px] tracking-[0.1em] uppercase text-[var(--accent)] mb-[7px]">
                        {analysis.sampleQA.question}
                      </div>
                      <div className="text-[14px] text-[var(--ink-2)] leading-[1.6] italic">
                        &ldquo;{analysis.sampleQA.answer}&rdquo;
                      </div>
                      <div className="font-mono text-[9px] tracking-[0.08em] text-[var(--mist)] mt-2">
                        Earnings Call · AI-analysed, not verbatim
                      </div>
                    </div>
                  )}
                  <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[10px] px-[18px] py-4" style={{ borderLeft: '2px solid var(--warn-border)' }}>
                    <div className="font-mono text-[9px] tracking-[0.1em] uppercase text-[var(--mist)] mb-[7px]">
                      ⚠ Full management commentary unlocked with purchase
                    </div>
                    <div className="text-[14px] text-[var(--mist)] leading-[1.6]">
                      The full analysis includes multiple management commentary extracts covering key themes, guidance, segment performance, and cross-company read-throughs.
                    </div>
                    <div className="font-mono text-[9px] tracking-[0.08em] text-[var(--mist)] mt-2">
                      {analysis.pageCount ?? 28} pages total · ${analysis.priceUsd} flat
                    </div>
                  </div>
                </div>
              )}

              {/* Methodology */}
              {tab === 'methodology' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {methodologyItems.map(item => (
                    <div key={item.label} className="bg-[var(--surface)] border border-[var(--border)] rounded-[10px] px-5 py-[18px]">
                      <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-[var(--mist)] mb-2">{item.label}</div>
                      <div className={`text-[14px] leading-[1.5] ${item.accent ? 'text-[var(--accent)] font-mono text-[13px]' : 'text-[var(--ink-2)]'}`}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>

        {/* ═══ RIGHT: PURCHASE CARD ═══ */}
        <div className="lg:sticky lg:top-[68px]">
          <div className="bg-[var(--surface)] border border-[var(--border-md)] rounded-[18px] overflow-hidden shadow-[0_24px_64px_-24px_rgba(0,0,0,0.5)]">

            {/* Ticker identity header */}
            <div
              className="px-[22px] pt-[18px] pb-[14px] border-b border-[var(--border)]"
              style={{ background: 'linear-gradient(135deg, var(--surface-2), var(--surface))' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[28px] font-semibold tracking-[-0.03em] text-[var(--ink)]">
                  <span className="text-[14px] text-[var(--mist)] font-normal" style={{ verticalAlign: 'super', marginRight: 1 }}>$</span>
                  {analysis.ticker}
                </span>
                <span className="font-mono text-[11px] font-medium text-[var(--accent)] bg-[var(--accent-tint)] border border-[var(--accent-border)] px-3 py-1 rounded-[6px]">
                  {quarterLabel}
                </span>
              </div>
              <div className="text-[12px] text-[var(--mist)] tracking-[-0.01em] mb-2.5">
                {analysis.companyName} · {analysis.exchange}
              </div>
              <div className="flex gap-[5px] flex-wrap">
                {badges.map(p => (
                  <span key={p} className={`inline-flex items-center gap-1 font-mono text-[9px] font-semibold tracking-[0.08em] uppercase px-[9px] py-[3px] rounded-[4px] border ${PERF[p].cls}`}>
                    {PERF[p].icon} {PERF[p].label}
                  </span>
                ))}
              </div>
            </div>

            {/* Mini metrics */}
            {(analysis.keyMetrics?.length ?? 0) > 0 && (
              <div className="border-b border-[var(--border)]">
                {analysis.keyMetrics!.slice(0, 4).map(m => (
                  <div key={m.id ?? m.metric} className="flex items-center justify-between px-[22px] py-[9px] border-b border-[var(--border)] last:border-b-0">
                    <span className="text-[12px] text-[var(--mist)]">{m.metric}</span>
                    <span className="font-mono text-[13px] font-medium text-[var(--ink)]">{m.value}</span>
                    {m.yoyChange && (
                      <span className={`font-mono text-[10px] px-[6px] py-px rounded-[3px] ${yoyCls(m.yoyChange)}`}>
                        {m.yoyChange}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Price */}
            <div className="px-[22px] py-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-2.5 mb-[5px]">
                <span className="font-mono text-[40px] font-medium tracking-[-0.04em] leading-none text-[var(--accent)]">
                  ${analysis.priceUsd}
                </span>
                <span className="font-mono text-[10px] tracking-[0.08em] uppercase text-[var(--mist)] bg-[var(--surface-2)] border border-[var(--border)] px-[9px] py-[3px] rounded-[4px]">
                  Flat · No tiers
                </span>
              </div>
              <div className="text-[12px] text-[var(--mist)]">No subscription required · Instant PDF after purchase</div>
            </div>

            {/* Delivery callout */}
            <div className="px-[22px] pb-[14px]">
              <div className="mt-[14px] flex items-center gap-2 bg-[var(--warn-tint)] border border-[var(--warn-border)] rounded-[8px] px-[14px] py-[10px] font-mono text-[12px] text-[var(--warning)] tracking-[0.04em]">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0">
                  <circle cx="6" cy="6" r="5"/><path d="M6 3v3l2 1"/>
                </svg>
                Same-day delivery on the day of the call
              </div>
            </div>

            {/* CTAs */}
            <div className="px-[22px] pb-4 flex flex-col gap-2">
              <button
                onClick={() => {
                  if (!inCart) {
                    addItem({
                      id: analysis.slug,
                      slug: analysis.slug,
                      type: 'earnings',
                      title: analysis.title,
                      ticker: analysis.ticker,
                      quarter: analysis.quarter,
                      priceUsd: analysis.priceUsd,
                      originalPriceUsd: analysis.originalPriceUsd,
                    })
                  }
                  router.push('/checkout')
                }}
                className="w-full flex items-center justify-center gap-[9px] bg-[var(--accent)] text-white text-[15px] font-semibold tracking-[-0.01em] px-5 py-[14px] rounded-[10px] border-0 transition-all hover:bg-[var(--accent-deep)] hover:-translate-y-px cursor-pointer shadow-[0_0_0_1px_var(--accent-border),0_8px_24px_-8px_var(--accent-glow)]"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 3h9l-1.5 7h-7L3 3z"/>
                  <path d="M1 1h1.5l1.2 2M6 12.5a.5.5 0 100 1 .5.5 0 000-1zM10 12.5a.5.5 0 100 1 .5.5 0 000-1z"/>
                </svg>
                Buy Now — ${analysis.priceUsd}
              </button>
              <button
                onClick={() => {
                  if (inCart) { openCart(); return }
                  addItem({
                    id: analysis.slug,
                    slug: analysis.slug,
                    type: 'earnings',
                    title: analysis.title,
                    ticker: analysis.ticker,
                    quarter: analysis.quarter,
                    priceUsd: analysis.priceUsd,
                    originalPriceUsd: analysis.originalPriceUsd,
                  })
                  setCartAdded(true)
                  setTimeout(() => setCartAdded(false), 4000)
                  openCart()
                }}
                className={`w-full flex items-center justify-center gap-[9px] text-[14px] font-medium tracking-[-0.01em] px-5 py-[12px] rounded-[10px] border transition-all cursor-pointer ${
                  inCart
                    ? 'bg-[var(--accent-tint)] border-[var(--accent-border)] text-[var(--accent)]'
                    : 'bg-transparent border-[var(--border-md)] text-[var(--ink-2)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)] hover:border-[var(--border-2)]'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 1h2l2 7h6l1-5H4"/>
                  <circle cx="6" cy="12" r="0.7" fill="currentColor"/>
                  <circle cx="11" cy="12" r="0.7" fill="currentColor"/>
                </svg>
                {inCart ? 'In Cart — View' : 'Add to Cart'}
              </button>
              {cartAdded && (
                <div className="flex items-center gap-2 bg-[var(--accent-tint)] border border-[var(--accent-border)] rounded-[8px] px-[14px] py-[9px] text-[12px] text-[var(--accent)] font-medium">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0">
                    <path d="M1.5 6l3 3 6-6"/>
                  </svg>
                  Added to cart —{' '}
                  <Link href="/checkout" className="text-[var(--accent)] font-semibold no-underline ml-0.5">Proceed to checkout →</Link>
                </div>
              )}
            </div>

            {/* What's included */}
            <div className="px-[22px] py-[14px] border-t border-[var(--border)]">
              <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-[var(--mist)] mb-[11px]">What&apos;s included</div>
              {includedItems.map(f => (
                <div key={f} className="flex items-start gap-2.5 text-[13px] text-[var(--ink-2)] mb-[9px] last:mb-0 leading-[1.4]">
                  <div className="w-4 h-4 rounded-[4px] bg-[var(--accent-tint)] border border-[var(--accent-border)] flex items-center justify-center flex-shrink-0 mt-px">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--accent)]">
                      <path d="M1 4l2.5 2.5 4-4"/>
                    </svg>
                  </div>
                  {f}
                </div>
              ))}
            </div>

            {/* Engagement */}
            <div className="px-[22px] py-[10px] border-t border-[var(--border)] flex items-center gap-2 text-[11px] text-[var(--mist)]">
              <div className="w-[5px] h-[5px] rounded-full bg-[var(--accent)] opacity-70 flex-shrink-0" />
              {analysis.engagementCopy ?? 'Same-day delivery · Buy-side ready · Instant PDF'}
            </div>

            {/* Trust */}
            <div className="px-[22px] py-[10px] border-t border-[var(--border)] font-mono text-[9px] tracking-[0.08em] uppercase text-[var(--mist)] text-center leading-[1.6]">
              Secure checkout via Stripe · Instant delivery · Full compliance guarantee
            </div>
          </div>

          {/* Cross-sell to transcripts */}
          <div className="mt-3 bg-[var(--surface)] border border-[var(--border)] rounded-[14px] px-5 py-[18px]">
            <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-[var(--mist)] mb-[7px]">Want the expert call?</div>
            <div className="text-[13px] font-medium tracking-[-0.01em] mb-2 leading-[1.4]">
              Browse expert transcripts on{primarySector ? ` ${primarySector.name}` : ' related topics'}
            </div>
            <Link
              href={`/expert-transcripts${primarySector ? `?industry=${primarySector.slug}` : ''}`}
              className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.08em] uppercase text-[var(--accent)] no-underline pb-px transition-all"
              style={{ borderBottom: '1px solid var(--accent-border)' }}
            >
              View transcripts →
            </Link>
          </div>
        </div>
      </div>

      {/* Related earnings */}
      {related.length > 0 && (
        <div className="py-12 border-t border-[var(--border)]">
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-6">
            <div>
              <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-[var(--mist)] mb-1.5">You may also like</div>
              <div className="text-[22px] font-medium tracking-[-0.025em]">Related Earnings Analyses</div>
            </div>
            <Link
              href={primarySector ? `/earnings-analysis?sector=${primarySector.slug}` : '/earnings-analysis'}
              className="font-mono text-[10px] tracking-[0.08em] uppercase text-[var(--mist)] no-underline pb-px transition-all hover:text-[var(--accent)]"
              style={{ borderBottom: '1px solid var(--border-2)' }}
            >
              {primarySector ? `View all ${primarySector.name} analyses →` : 'View all analyses →'}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {related.map(r => <RelatedCard key={r.id} doc={r} />)}
          </div>
        </div>
      )}
    </div>
  )
}
