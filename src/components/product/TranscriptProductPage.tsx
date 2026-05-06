'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'

type TierKey = 'standard' | 'premium' | 'elite'
type CompKey = 'mnpi-screened' | 'pii-redacted' | 'compliance-certified' | 'expert-anonymised'
type TabId = 'exec' | 'topics' | 'expert' | 'transcript'

interface Industry { id: string; name: string; slug: string }
interface Company { id: string; name: string; ticker?: string }

interface TranscriptDoc {
  id: string
  title: string
  slug: string
  expertId: string
  expertFormerTitle: string
  expertLevel: string
  dateConducted?: string
  duration?: number
  pageCount?: number
  summary?: string
  executiveSummaryPreview?: string
  topicsCovered?: { id?: string; topic: string }[]
  sampleQA?: { question?: string; answer?: string }
  tier: TierKey
  priceUsd: number
  originalPriceUsd?: number
  discountPercent?: number
  complianceBadges?: CompKey[]
  engagementCopy?: string
  sectors?: (string | Industry)[]
  geography?: string | string[]
  companies?: (string | Company)[]
}

export interface RelatedTranscript {
  id: string
  slug: string
  title: string
  tier: TierKey
  priceUsd: number
  discountPercent?: number
  duration?: number
  expertId: string
  expertFormerTitle: string
  sectors?: (string | Industry)[]
  geography?: string | string[]
}

const TIER_CLS: Record<TierKey, string> = {
  standard: 'text-[var(--slate)] bg-[var(--surface-2)] border-[var(--border-2)]',
  premium:  'text-[var(--warning)] bg-[var(--warn-tint)] border-[var(--warn-border)]',
  elite:    'text-[var(--accent)] bg-[var(--accent-tint)] border-[var(--accent-border)]',
}

const TIER_LABELS: Record<TierKey, string> = {
  standard: 'Standard',
  premium:  'Premium',
  elite:    'Elite',
}

const LEVEL_LABELS: Record<string, string> = {
  'c-suite':  'C-Suite',
  'vp':       'VP Level',
  'director': 'Director Level',
}

const GEO_LABELS: Record<string, string> = {
  'north-america': 'North America',
  'europe':        'Europe',
  'global':        'Global',
  'apac':          'APAC',
}

const COMP_LABELS: Record<CompKey, string> = {
  'mnpi-screened':      'MNPI Screened',
  'pii-redacted':       'PII Redacted',
  'compliance-certified': 'Compliance Certified',
  'expert-anonymised':  'Expert Anonymised',
}

const COMP_ICONS: Record<CompKey, React.ReactNode> = {
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
  'expert-anonymised': (
    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="5" cy="3" r="1.5"/><path d="M1.5 8.5c0-1.66 1.57-3 3.5-3s3.5 1.34 3.5 3"/>
    </svg>
  ),
}

function RelatedCard({ doc }: { doc: RelatedTranscript }) {
  const sectors = (doc.sectors ?? []).filter((s): s is Industry => typeof s === 'object' && s !== null)
  const primarySector = sectors[0]
  const geoArr = Array.isArray(doc.geography) ? doc.geography : doc.geography ? [doc.geography] : []
  const geoStr = geoArr.map(g => GEO_LABELS[g] ?? g).join(', ')
  const initials = doc.expertId.replace('EXP-', '').slice(0, 3)

  return (
    <Link
      href={`/expert-transcripts/${doc.slug}`}
      className="bg-[var(--surface)] border border-[var(--border)] rounded-[14px] overflow-hidden flex flex-col no-underline text-inherit transition-all duration-200 hover:border-[var(--border-md)] hover:-translate-y-0.5 hover:shadow-[0_10px_32px_-10px_rgba(0,0,0,0.3)]"
    >
      <div className="px-[18px] pt-[18px] pb-[14px] flex-1">
        <div className="flex items-center justify-between mb-2.5">
          <div className="inline-flex items-center gap-[5px] font-mono text-[9px] tracking-[0.1em] uppercase text-[var(--accent)] bg-[var(--accent-tint)] border border-[var(--accent-border)] px-2 py-0.5 rounded-full">
            <div className="w-1 h-1 rounded-full bg-[var(--accent)]" />
            {primarySector?.name ?? 'Research'}
          </div>
          {(doc.discountPercent ?? 0) > 0 && (
            <span className="font-mono text-[9px] font-semibold text-[var(--warning)]">{doc.discountPercent}% OFF</span>
          )}
        </div>
        <div className="text-[13px] font-medium tracking-[-0.01em] leading-[1.35] mb-2.5 text-[var(--ink)]">
          {doc.title}
        </div>
        {(doc.duration || geoStr) && (
          <div className="font-mono text-[9px] text-[var(--mist)] mb-2">
            {[doc.duration ? `${doc.duration} min` : null, geoStr || null].filter(Boolean).join(' · ')}
          </div>
        )}
        <div className="flex items-center gap-[5px] text-[11px] text-[var(--slate)]">
          <div
            className="w-[14px] h-[14px] rounded-full flex items-center justify-center font-mono text-[6px] font-semibold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--accent-deep), var(--accent))', color: '#064E3B' }}
          >
            {initials}
          </div>
          {doc.expertFormerTitle}
        </div>
      </div>
      <div className="px-[18px] py-[10px] border-t border-[var(--border)] flex items-center justify-between">
        <span className="font-mono text-[15px] font-medium text-[var(--accent)] tracking-[-0.02em]">${doc.priceUsd}</span>
        <span className={`font-mono text-[8px] tracking-[0.1em] uppercase px-[6px] py-0.5 rounded-[3px] border ${TIER_CLS[doc.tier]}`}>
          {TIER_LABELS[doc.tier]}
        </span>
        <span className="font-mono text-[9px] tracking-[0.08em] text-[var(--accent)]">View →</span>
      </div>
    </Link>
  )
}

export function TranscriptProductPage({
  transcript,
  related,
}: {
  transcript: TranscriptDoc
  related: RelatedTranscript[]
}) {
  const [tab, setTab] = useState<TabId>('exec')
  const [cartAdded, setCartAdded] = useState(false)
  const router = useRouter()
  const { addItem, openCart, hasItem } = useCart()
  const inCart = hasItem(transcript.slug)

  const conductedDateStr = transcript.dateConducted
    ? new Date(transcript.dateConducted).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : ''

  const sectors = (transcript.sectors ?? []).filter((s): s is Industry => typeof s === 'object' && s !== null)
  const companies = (transcript.companies ?? []).filter((c): c is Company => typeof c === 'object' && c !== null)
  const primarySector = sectors[0]

  const geoArr = Array.isArray(transcript.geography)
    ? transcript.geography
    : transcript.geography ? [transcript.geography] : []
  const geoDisplay = geoArr.map(g => GEO_LABELS[g] ?? g).join(', ')

  const compBadges = (transcript.complianceBadges ?? ['mnpi-screened', 'pii-redacted', 'compliance-certified', 'expert-anonymised']) as CompKey[]

  const expertInitials = transcript.expertId.slice(0, 3)
  const levelDisplay = LEVEL_LABELS[transcript.expertLevel] ?? transcript.expertLevel

  const TABS: { id: TabId; label: string }[] = [
    { id: 'exec', label: 'Executive Summary' },
    { id: 'topics', label: 'Topics Covered' },
    { id: 'expert', label: 'Expert Profile' },
    { id: 'transcript', label: 'Full Transcript' },
  ]

  const metaCells = [
    { label: 'Duration', value: transcript.duration ? `${transcript.duration} min` : '—', accent: true },
    { label: 'Pages', value: transcript.pageCount ? `${transcript.pageCount} pages` : '—', accent: false },
    { label: 'Expert Level', value: levelDisplay, accent: false },
    { label: 'Geography', value: geoDisplay || '—', accent: false },
    { label: 'Expert ID', value: transcript.expertId, accent: true },
  ]

  const expertSpecs = [
    { label: 'Seniority', value: levelDisplay, accent: false },
    { label: 'Sector', value: primarySector?.name ?? '—', accent: false },
    { label: 'Geography', value: geoDisplay || '—', accent: false },
    { label: 'Status', value: 'Former (no active conflicts)', accent: false },
    { label: 'Compliance', value: 'Pre-screened ✓', accent: true },
    { label: 'Expert ID', value: transcript.expertId, accent: false },
  ]

  const includedItems = [
    `Full verbatim transcript (PDF) · ${transcript.pageCount ?? 35} pages`,
    'Executive summary with key takeaways',
    'Tagged companies, keywords & metadata',
    'MNPI-screened · PII-redacted · Compliance certificate',
    'Instant download after purchase',
    'Licensed for internal team distribution',
  ]

  const hasDiscount = (transcript.discountPercent ?? 0) > 0
  const discountLabel = hasDiscount ? `${transcript.discountPercent}% OFF` : null

  return (
    <div className="mx-auto max-w-[1280px] px-6 sm:px-10 pb-16">

      {/* Top bar */}
      <div className="flex items-center justify-between pt-5">
        <nav className="hidden md:flex items-center gap-2 font-mono text-[10px] tracking-[0.1em] uppercase text-[var(--mist)]">
          <Link href="/" className="hover:text-[var(--slate)] transition-colors">Home</Link>
          <span className="text-[var(--border-2)]">›</span>
          <Link href="/expert-transcripts" className="hover:text-[var(--slate)] transition-colors">Transcript Library</Link>
          {primarySector && (
            <>
              <span className="text-[var(--border-2)]">›</span>
              <Link href={`/expert-transcripts?industry=${primarySector.slug}`} className="hover:text-[var(--slate)] transition-colors">
                {primarySector.name}
              </Link>
            </>
          )}
          <span className="text-[var(--border-2)]">›</span>
          <span>{transcript.expertId}</span>
        </nav>
        <Link
          href="/expert-transcripts"
          className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.1em] uppercase text-[var(--mist)] bg-[var(--surface)] border border-[var(--border)] px-[14px] py-[6px] rounded-[6px] hover:text-[var(--ink)] hover:border-[var(--border-md)] transition-all no-underline"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2L3 5l3 3"/>
          </svg>
          Back to Library
        </Link>
      </div>

      {/* Hero grid */}
      <div className="grid gap-8 pt-8 items-start lg:grid-cols-[minmax(0,1fr)_360px]">

        {/* ═══ LEFT COLUMN ═══ */}
        <div>

          {/* Sector + date */}
          <div className="flex items-center gap-3 mb-5">
            {primarySector && (
              <div className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.1em] uppercase text-[var(--accent)] bg-[var(--accent-tint)] border border-[var(--accent-border)] px-3 py-1 rounded-full">
                <div className="w-[5px] h-[5px] rounded-full bg-[var(--accent)]" />
                {primarySector.name}
              </div>
            )}
            {conductedDateStr && (
              <span className="font-mono text-[10px] tracking-[0.08em] text-[var(--mist)]">{conductedDateStr}</span>
            )}
          </div>

          {/* H1 */}
          <h1 className="text-[clamp(26px,3vw,40px)] font-semibold tracking-[-0.035em] leading-[1.1] mb-[18px] max-w-[680px]">
            {transcript.title}
          </h1>

          {/* Summary */}
          {transcript.summary && (
            <p className="text-[16px] text-[var(--ink-2)] leading-[1.7] max-w-[620px] mb-7">
              {transcript.summary}
            </p>
          )}

          {/* Meta strip */}
          <div className="grid grid-cols-2 md:grid-cols-5 border border-[var(--border)] rounded-[10px] overflow-hidden bg-[var(--surface)] mb-6">
            {metaCells.map((cell, i) => (
              <div
                key={cell.label}
                className={`px-4 md:px-[18px] py-3 border-r border-[var(--border)] last:border-r-0 border-b border-[var(--border)] md:border-b-0${i === metaCells.length - 1 && metaCells.length % 2 !== 0 ? ' col-span-2 md:col-span-1' : ''}`}
              >
                <div className="font-mono text-[8px] tracking-[0.14em] uppercase text-[var(--mist)] mb-1">{cell.label}</div>
                <div className={`text-[13px] font-medium tracking-[-0.01em] ${cell.accent ? 'text-[var(--accent)] font-mono' : 'text-[var(--ink-2)]'}`}>
                  {cell.value}
                </div>
              </div>
            ))}
          </div>

          {/* Compliance badges */}
          <div className="flex items-center gap-2 flex-wrap mb-8">
            {compBadges.map(b => (
              <div key={b} className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.1em] uppercase text-[var(--accent)] bg-[var(--accent-tint)] border border-[var(--accent-border)] px-[10px] py-1 rounded-full">
                {COMP_ICONS[b]}
                {COMP_LABELS[b]}
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
                  className={`font-mono text-[10px] sm:text-[11px] tracking-[0.08em] uppercase px-4 sm:px-[22px] py-[14px] transition-all whitespace-nowrap shrink-0 bg-transparent cursor-pointer border-0 border-t-0 border-l-0 border-r-0 ${tab === id ? 'text-[var(--accent)]' : 'text-[var(--mist)] hover:text-[var(--slate)]'}`}
                  style={{ borderBottom: tab === id ? '1.5px solid var(--accent)' : '1.5px solid transparent' }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="py-7">

              {/* Executive Summary */}
              {tab === 'exec' && (
                <div>
                  <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[14px] overflow-hidden">
                    <div className="px-[22px] py-[14px] border-b border-[var(--border)] bg-[var(--accent-tint)] flex items-center justify-between">
                      <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-[var(--accent)] flex items-center gap-[7px]">
                        <span className="w-[5px] h-[5px] rounded-full bg-[var(--accent)] animate-pulse" />
                        Free Preview — Executive Summary
                      </div>
                      <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-[var(--accent)] bg-[rgba(52,211,153,0.15)] border border-[var(--accent-border)] px-2 py-0.5 rounded-[4px]">
                        Free
                      </span>
                    </div>
                    <div className="px-6 py-6 text-[15px] text-[var(--ink-2)] leading-[1.75] space-y-4">
                      {(transcript.executiveSummaryPreview ?? transcript.summary ?? 'Executive summary available after purchase.')
                        .split(/\n\n+/)
                        .map((para, i) => (
                          <p key={i}>{para}</p>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Topics Covered */}
              {tab === 'topics' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(transcript.topicsCovered ?? []).map(t => (
                    <div key={t.id ?? t.topic} className="flex items-start gap-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-[10px] px-4 py-[14px] hover:border-[var(--border-md)] transition-all">
                      <div className="w-[6px] h-[6px] rounded-full bg-[var(--accent)] flex-shrink-0 mt-[5px]" />
                      <span className="text-[14px] text-[var(--ink-2)] leading-[1.45]">{t.topic}</span>
                    </div>
                  ))}
                  {(transcript.topicsCovered?.length ?? 0) === 0 && (
                    <div className="col-span-2 text-center text-[var(--mist)] text-[13px] py-8">
                      Topics covered available after purchase.
                    </div>
                  )}
                </div>
              )}

              {/* Expert Profile */}
              {tab === 'expert' && (
                <div>
                  <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[14px] px-7 py-7 mb-4">
                    <div className="flex items-center gap-[14px] mb-5">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center font-mono text-[11px] font-semibold flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, var(--accent-deep), var(--accent))', color: '#064E3B' }}
                      >
                        {expertInitials}
                      </div>
                      <div>
                        <div className="font-mono text-[12px] text-[var(--accent)] tracking-[0.06em] mb-0.5">
                          {transcript.expertId} · Verified
                        </div>
                        <div className="text-[15px] font-medium tracking-[-0.01em] leading-[1.3]">
                          {transcript.expertFormerTitle}
                        </div>
                      </div>
                    </div>
                    <div
                      className="grid grid-cols-2 sm:grid-cols-3 gap-px rounded-[8px] overflow-hidden"
                      style={{ background: 'var(--border)', border: '1px solid var(--border)' }}
                    >
                      {expertSpecs.map(spec => (
                        <div key={spec.label} className="bg-[var(--bg)] px-[14px] py-3">
                          <div className="font-mono text-[8px] tracking-[0.14em] uppercase text-[var(--mist)] mb-1">{spec.label}</div>
                          <div className={`text-[13px] font-medium ${spec.accent ? 'text-[var(--accent)]' : 'text-[var(--ink-2)]'}`}>
                            {spec.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-[12px] text-[var(--mist)] leading-[1.6] px-0.5">
                    Expert identity is fully anonymised per Transcript IQ compliance policy. The expert profile above shows verified credentials without disclosing personally identifiable information.
                  </div>
                </div>
              )}

              {/* Full Transcript (locked) */}
              {tab === 'transcript' && (
                <div>
                  <div className="relative overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--surface)] mb-5">
                    <div
                      className="px-6 py-6 text-[14px] text-[var(--slate)] font-mono leading-[1.7]"
                      style={{
                        maskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 85%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 85%)',
                      }}
                    >
                      {transcript.sampleQA?.question ? (
                        <>
                          <div className="flex gap-3 mb-3">
                            <div className="text-[9px] tracking-[0.12em] uppercase text-[var(--accent)] min-w-[52px] pt-0.5 flex-shrink-0">Analyst</div>
                            <div className="text-[11px] text-[var(--slate)] leading-[1.65]">{transcript.sampleQA.question}</div>
                          </div>
                          {transcript.sampleQA.answer && (
                            <div className="flex gap-3 mb-3">
                              <div className="text-[9px] tracking-[0.12em] uppercase text-[var(--accent)] min-w-[52px] pt-0.5 flex-shrink-0">Expert</div>
                              <div className="text-[11px] text-[var(--slate)] leading-[1.65]">{transcript.sampleQA.answer}</div>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="flex gap-3 mb-3">
                            <div className="text-[9px] tracking-[0.12em] uppercase text-[var(--accent)] min-w-[52px] pt-0.5 flex-shrink-0">Analyst</div>
                            <div className="text-[11px] text-[var(--slate)] leading-[1.65]">Can you walk us through how you&apos;re seeing the market evolve and what the primary drivers are from your vantage point?</div>
                          </div>
                          <div className="flex gap-3">
                            <div className="text-[9px] tracking-[0.12em] uppercase text-[var(--accent)] min-w-[52px] pt-0.5 flex-shrink-0">Expert</div>
                            <div className="text-[11px] text-[var(--slate)] leading-[1.65]">There are a few things happening simultaneously. The first is structural — you&apos;re seeing demand patterns shift in ways that weren&apos;t anticipated twelve months ago...</div>
                          </div>
                        </>
                      )}
                    </div>
                    <div
                      className="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-8 flex flex-col items-center text-center gap-[14px]"
                      style={{ background: 'linear-gradient(to bottom, transparent, rgba(24,24,27,0.98) 40%, var(--surface))' }}
                    >
                      <div className="w-9 h-9 rounded-[10px] bg-[var(--surface-2)] border border-[var(--border-md)] flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--mist)]">
                          <rect x="2" y="6" width="10" height="7" rx="1.5"/>
                          <path d="M4.5 6V4.5a2.5 2.5 0 1 1 5 0V6"/>
                        </svg>
                      </div>
                      <div className="text-[15px] font-medium tracking-[-0.01em]">Full transcript locked</div>
                      <div className="text-[12px] text-[var(--mist)]">
                        {transcript.pageCount ? `${transcript.pageCount} pages` : '35+ pages'} of expert insights and data points
                      </div>
                    </div>
                  </div>

                  <div className="text-center pt-3">
                    <button className="inline-flex items-center justify-center gap-[9px] max-w-[340px] mx-auto bg-[var(--accent)] text-black text-[15px] font-semibold tracking-[-0.01em] px-5 py-[14px] rounded-[10px] border-0 transition-all hover:bg-[var(--accent-deep)] hover:text-white hover:-translate-y-px cursor-pointer shadow-[0_0_0_1px_var(--accent-border),0_8px_24px_-8px_var(--accent-glow)]">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M1 1h2l2 7h6l1-5H4"/>
                        <circle cx="6" cy="12" r="0.7" fill="currentColor"/>
                        <circle cx="11" cy="12" r="0.7" fill="currentColor"/>
                      </svg>
                      Unlock full transcript — ${transcript.priceUsd}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ═══ RIGHT: PURCHASE CARD ═══ */}
        <div className="lg:sticky lg:top-[68px]">
          <div className="bg-[var(--surface)] border border-[var(--border-md)] rounded-[18px] overflow-hidden shadow-[0_24px_64px_-24px_rgba(0,0,0,0.5)]">

            {/* Header */}
            <div className="px-[22px] py-4 border-b border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between">
              <span className={`font-mono text-[10px] tracking-[0.12em] uppercase px-[9px] py-[3px] rounded-[5px] border ${TIER_CLS[transcript.tier]}`}>
                {TIER_LABELS[transcript.tier]}
              </span>
              <span className="font-mono text-[10px] text-[var(--mist)] tracking-[0.06em]">One-time purchase</span>
            </div>

            {/* Pricing */}
            <div className="px-[22px] pt-5 pb-4 border-b border-[var(--border)]">
              <div className="flex items-baseline gap-2.5 mb-1.5">
                <span className="font-mono text-[40px] font-medium tracking-[-0.04em] leading-none text-[var(--accent)]">
                  ${transcript.priceUsd}
                </span>
                {transcript.originalPriceUsd && (
                  <span className="font-mono text-[16px] text-[var(--mist)] line-through">${transcript.originalPriceUsd}</span>
                )}
                {discountLabel && (
                  <span className="font-mono text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--warning)] bg-[var(--warn-tint)] border border-[var(--warn-border)] px-2 py-[3px] rounded-[4px]">
                    {discountLabel}
                  </span>
                )}
              </div>
              <div className="text-[12px] text-[var(--mist)]">No subscription required · Instant PDF after purchase</div>
            </div>

            {/* CTAs */}
            <div className="px-[22px] py-4 flex flex-col gap-2">
              <button
                onClick={() => {
                  if (!inCart) {
                    addItem({
                      id: transcript.slug,
                      slug: transcript.slug,
                      type: 'transcript',
                      title: transcript.title,
                      tier: transcript.tier,
                      priceUsd: transcript.priceUsd,
                      originalPriceUsd: transcript.originalPriceUsd,
                    })
                  }
                  router.push('/checkout')
                }}
                className="w-full flex items-center justify-center gap-[9px] bg-[var(--accent)] text-black text-[15px] font-semibold tracking-[-0.01em] px-5 py-[14px] rounded-[10px] border-0 transition-all hover:bg-[var(--accent-deep)] hover:text-white hover:-translate-y-px cursor-pointer shadow-[0_0_0_1px_var(--accent-border),0_8px_24px_-8px_var(--accent-glow)]"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 3h9l-1.5 7h-7L3 3z"/>
                  <path d="M1 1h1.5l1.2 2M6 12.5a.5.5 0 100 1 .5.5 0 000-1zM10 12.5a.5.5 0 100 1 .5.5 0 000-1z"/>
                </svg>
                Buy Now — ${transcript.priceUsd}
              </button>
              <button
                onClick={() => {
                  if (inCart) { openCart(); return }
                  addItem({
                    id: transcript.slug,
                    slug: transcript.slug,
                    type: 'transcript',
                    title: transcript.title,
                    tier: transcript.tier,
                    priceUsd: transcript.priceUsd,
                    originalPriceUsd: transcript.originalPriceUsd,
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
            <div className="px-[22px] py-4 border-t border-[var(--border)]">
              <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-[var(--mist)] mb-3">What&apos;s included</div>
              {includedItems.map(f => (
                <div key={f} className="flex items-start gap-2.5 text-[13px] text-[var(--ink-2)] mb-2.5 last:mb-0 leading-[1.4]">
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
            <div className="px-[22px] py-[10px] border-t border-[var(--border)] flex items-center gap-2 text-[11px] text-[var(--mist)]" style={{ background: 'rgba(52,211,153,0.03)' }}>
              <div className="w-[5px] h-[5px] rounded-full bg-[var(--accent)] opacity-70 flex-shrink-0" />
              {transcript.engagementCopy ?? '100+ buyers last 30 days · Buy-side ready'}
            </div>

            {/* Trust */}
            <div className="px-[22px] py-[10px] border-t border-[var(--border)] font-mono text-[9px] tracking-[0.08em] uppercase text-[var(--mist)] text-center leading-[1.6]">
              Secure checkout via Stripe · Instant delivery · Full compliance guarantee
            </div>
          </div>

          {/* Custom research upsell */}
          <div className="mt-3 bg-[var(--surface)] border border-[var(--border)] rounded-[14px] px-5 py-5 text-center">
            <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-[var(--mist)] mb-2">Need a custom angle?</div>
            <div className="text-[14px] font-medium tracking-[-0.01em] mb-2 leading-[1.4]">
              Commission a bespoke expert call on any topic
            </div>
            <Link
              href="/custom-reports"
              className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.08em] uppercase text-[var(--accent)] no-underline pb-px transition-all"
              style={{ borderBottom: '1px solid var(--accent-border)' }}
            >
              Learn about custom transcripts →
            </Link>
          </div>
        </div>
      </div>

      {/* Bundles section */}
      <div className="pt-12 border-t border-[var(--border)]">
        <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--mist)] mb-5">Save more with bundles</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[14px] px-[26px] py-6 hover:border-[var(--border-md)] hover:-translate-y-px transition-all cursor-pointer">
            <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-[var(--accent)] mb-2">3 Transcripts</div>
            <div className="text-[16px] font-medium tracking-[-0.015em] mb-2.5">
              {primarySector ? `${primarySector.name} Deep-Dive Pack` : 'Sector Deep-Dive Pack'}
            </div>
            <div className="flex flex-wrap gap-[5px] mb-4">
              {(primarySector ? [primarySector.name, 'Adjacent Research', 'Competitive Analysis'] : ['Primary Research', 'Adjacent Research', 'Competitive Analysis']).map(topic => (
                <span key={topic} className="font-mono text-[9px] tracking-[0.04em] text-[var(--slate)] bg-[var(--bg)] border border-[var(--border)] px-[7px] py-0.5 rounded-[4px]">{topic}</span>
              ))}
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="font-mono text-[22px] font-medium text-[var(--accent)] tracking-[-0.02em]">$999</span>
              <span className="font-mono text-[12px] text-[var(--mist)] line-through">$1,297</span>
              <span className="font-mono text-[9px] font-semibold tracking-[0.08em] text-[var(--warning)] bg-[var(--warn-tint)] border border-[var(--warn-border)] px-[7px] py-0.5 rounded-[4px]">Save 23%</span>
            </div>
            <div className="text-[11px] text-[var(--mist)] mb-4">You save $298 compared to individual purchases</div>
            <button className="w-full flex items-center justify-center text-[12px] font-medium text-[var(--ink-2)] bg-[var(--bg)] border border-[var(--border)] px-4 py-[9px] rounded-[7px] hover:border-[var(--border-md)] hover:text-[var(--ink)] transition-all cursor-pointer">
              Buy 3-Transcript Pack →
            </button>
          </div>
          <div className="border border-[var(--accent-border)] rounded-[14px] px-[26px] py-6 hover:-translate-y-px transition-all cursor-pointer" style={{ background: 'linear-gradient(145deg, var(--surface), rgba(16,185,129,0.05))' }}>
            <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-[var(--accent)] mb-2">6 Transcripts</div>
            <div className="text-[16px] font-medium tracking-[-0.015em] mb-2.5">
              Full Sector Research Pack
            </div>
            <div className="flex flex-wrap gap-[5px] mb-4">
              {['Primary Research', 'Adjacent Sectors', 'AI Infrastructure', 'Cloud CapEx'].map(topic => (
                <span key={topic} className="font-mono text-[9px] tracking-[0.04em] text-[var(--slate)] bg-[var(--bg)] border border-[var(--border)] px-[7px] py-0.5 rounded-[4px]">{topic}</span>
              ))}
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="font-mono text-[22px] font-medium text-[var(--accent)] tracking-[-0.02em]">$1,899</span>
              <span className="font-mono text-[12px] text-[var(--mist)] line-through">$2,694</span>
              <span className="font-mono text-[9px] font-semibold tracking-[0.08em] text-[var(--warning)] bg-[var(--warn-tint)] border border-[var(--warn-border)] px-[7px] py-0.5 rounded-[4px]">Save 30%</span>
            </div>
            <div className="text-[11px] text-[var(--mist)] mb-4">You save $795 compared to individual purchases</div>
            <button className="w-full flex items-center justify-center text-[12px] font-semibold text-black bg-[var(--accent)] border border-[var(--accent)] px-4 py-[9px] rounded-[7px] hover:bg-[var(--accent-deep)] hover:text-white transition-all cursor-pointer">
              Buy Full Research Pack →
            </button>
          </div>
        </div>
      </div>

      {/* Related transcripts */}
      {related.length > 0 && (
        <div className="py-12 border-t border-[var(--border)]">
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-6">
            <div>
              <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-[var(--mist)] mb-1.5">You may also like</div>
              <div className="text-[22px] font-medium tracking-[-0.025em]">Related Transcripts</div>
            </div>
            <Link
              href={primarySector ? `/expert-transcripts?industry=${primarySector.slug}` : '/expert-transcripts'}
              className="font-mono text-[10px] tracking-[0.08em] uppercase text-[var(--mist)] no-underline pb-px transition-all hover:text-[var(--accent)]"
              style={{ borderBottom: '1px solid var(--border-2)' }}
            >
              {primarySector ? `View all ${primarySector.name} transcripts →` : 'View all transcripts →'}
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
