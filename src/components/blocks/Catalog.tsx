import { getPayload, type Where } from 'payload'
import config from '@/payload.config'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { SectionShell, SectionHeader, MintGradientHeading } from './SectionShell'
import { TranscriptCard, type TranscriptCardData } from './catalog/TranscriptCard'
import { EarningsAnalysisCard, type EarningsCardData } from './catalog/EarningsAnalysisCard'

async function getPayloadClient() {
  return getPayload({ config: await config })
}

function namesFromRelationship(rel: unknown): string[] {
  if (!Array.isArray(rel)) return []
  return rel
    .map((r) => {
      if (!r) return null
      if (typeof r === 'object' && 'name' in r) return (r as { name?: string }).name ?? null
      return null
    })
    .filter((x): x is string => Boolean(x))
}

function tickersFromRelationship(rel: unknown): string[] {
  if (!Array.isArray(rel)) return []
  return rel
    .map((r) => {
      if (!r) return null
      if (typeof r === 'object' && 'ticker' in r) return (r as { ticker?: string }).ticker ?? null
      return null
    })
    .filter((x): x is string => Boolean(x))
}

// ── FeaturedProducts ──────────────────────────────────────────────────────

type FeaturedProductsBlock = {
  blockType: 'featuredProducts'
  eyebrow?: string
  heading?: string
  description?: string
  productSource: 'expert-transcripts' | 'earnings-analyses' | 'mixed'
  mode?: 'auto' | 'manual'
  manualTranscripts?: Array<{ id: string | number } | string | number>
  manualAnalyses?: Array<{ id: string | number } | string | number>
  autoFilters?: {
    onlyFeatured?: boolean
    sectors?: Array<string | number>
    tier?: string[]
    sortBy?: 'newest' | 'featuredFirst' | 'priceDesc'
  }
  limit?: number
  layout?: 'grid-3' | 'grid-2' | 'grid-4' | 'list' | 'carousel'
  cardHover?: 'none' | 'lift' | 'moving-border' | 'spotlight'
  showAllCta?: { enabled?: boolean; label?: string; url?: string }
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export async function FeaturedProductsRenderer({ block }: { block: FeaturedProductsBlock }) {
  const payload = await getPayloadClient()
  const limit = block.limit ?? 3
  const sortBy = block.autoFilters?.sortBy ?? 'newest'
  const sortClause = sortBy === 'newest' ? '-createdAt' : sortBy === 'priceDesc' ? '-priceUsd' : '-featured,-createdAt'

  const transcripts: TranscriptCardData[] = []
  const analyses: EarningsCardData[] = []

  const fetchTranscripts = async () => {
    if (block.productSource !== 'expert-transcripts' && block.productSource !== 'mixed') return
    let docs: any[] = []
    if (block.mode === 'manual' && block.manualTranscripts && block.manualTranscripts.length > 0) {
      const ids = block.manualTranscripts.map((m) => (typeof m === 'object' ? m.id : m))
      const res = await payload.find({
        collection: 'expert-transcripts',
        where: { id: { in: ids } },
        depth: 2,
        limit,
      })
      docs = res.docs
    } else {
      const where: Where = { _status: { equals: 'published' } }
      if (block.autoFilters?.onlyFeatured) where.featured = { equals: true }
      if (block.autoFilters?.tier && block.autoFilters.tier.length > 0) where.tier = { in: block.autoFilters.tier }
      if (block.autoFilters?.sectors && block.autoFilters.sectors.length > 0) {
        where.sectors = { in: block.autoFilters.sectors }
      }
      const res = await payload.find({ collection: 'expert-transcripts', where, sort: sortClause, depth: 2, limit })
      docs = res.docs
    }
    for (const d of docs) {
      transcripts.push({
        id: d.id,
        slug: d.slug,
        title: d.title,
        expertId: d.expertId,
        expertFormerTitle: d.expertFormerTitle,
        expertLevel: d.expertLevel,
        tier: d.tier,
        dateConducted: d.dateConducted,
        duration: d.duration,
        summary: d.summary,
        priceUsd: d.priceUsd,
        originalPriceUsd: d.originalPriceUsd,
        discountPercent: d.discountPercent,
        geography: d.geography,
        sectorNames: namesFromRelationship(d.sectors),
        tickerSymbols: tickersFromRelationship(d.companies),
        engagementCopy: d.engagementCopy,
        complianceBadges: Array.isArray(d.complianceBadges) ? d.complianceBadges : null,
      })
    }
  }

  const fetchAnalyses = async () => {
    if (block.productSource !== 'earnings-analyses' && block.productSource !== 'mixed') return
    let docs: any[] = []
    if (block.mode === 'manual' && block.manualAnalyses && block.manualAnalyses.length > 0) {
      const ids = block.manualAnalyses.map((m) => (typeof m === 'object' ? m.id : m))
      const res = await payload.find({
        collection: 'earnings-analyses',
        where: { id: { in: ids } },
        depth: 2,
        limit,
      })
      docs = res.docs
    } else {
      const where: Where = { _status: { equals: 'published' } }
      if (block.autoFilters?.onlyFeatured) where.featured = { equals: true }
      const res = await payload.find({ collection: 'earnings-analyses', where, sort: sortClause, depth: 2, limit })
      docs = res.docs
    }
    for (const d of docs) {
      analyses.push({
        id: d.id,
        slug: d.slug,
        title: d.title,
        companyName: d.companyName,
        ticker: d.ticker,
        exchange: d.exchange,
        quarter: d.quarter,
        fiscalYear: d.fiscalYear,
        reportDate: d.reportDate,
        performanceBadges: d.performanceBadges,
        summary: d.summary,
        priceUsd: d.priceUsd,
        originalPriceUsd: d.originalPriceUsd,
        discountPercent: d.discountPercent,
        sectorNames: namesFromRelationship(d.sectors),
        keyTopics: Array.isArray(d.keyTopics) ? d.keyTopics.map((k: { topic?: string }) => k.topic).filter(Boolean) : [],
      })
    }
  }

  await Promise.all([fetchTranscripts(), fetchAnalyses()])

  const layout = block.layout ?? 'grid-3'
  const gridCols = layout === 'grid-2' ? 'sm:grid-cols-2' : layout === 'grid-4' ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3'

  const items: Array<{ kind: 'transcript' | 'analysis'; data: TranscriptCardData | EarningsCardData }> = [
    ...transcripts.map((d) => ({ kind: 'transcript' as const, data: d })),
    ...analyses.map((d) => ({ kind: 'analysis' as const, data: d })),
  ].slice(0, limit)

  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
      <SectionHeader
        eyebrow={block.eyebrow}
        heading={block.heading ? <MintGradientHeading text={block.heading} /> : undefined}
        description={block.description}
      />
      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface)]/40 p-10 text-center font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--mist)]">
          No products to display yet — publish products in admin to populate this section.
        </div>
      ) : (
        <div className={`grid gap-6 ${gridCols}`}>
          {items.map((item, i) =>
            item.kind === 'transcript' ? (
              <TranscriptCard key={`t-${item.data.id}`} data={item.data as TranscriptCardData} hoverEffect={block.cardHover} index={i} />
            ) : (
              <EarningsAnalysisCard key={`a-${item.data.id}`} data={item.data as EarningsCardData} hoverEffect={block.cardHover} index={i} />
            ),
          )}
        </div>
      )}
      {block.showAllCta?.enabled && block.showAllCta?.label && block.showAllCta?.url && (
        <div className="mt-10 flex justify-center">
          <Link
            href={block.showAllCta.url}
            className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm font-medium text-[var(--ink)] transition-all duration-base ease-out hover:-translate-y-px hover:border-[var(--accent-border)]"
          >
            {block.showAllCta.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </SectionShell>
  )
}

// ── ProductFilter — placeholder; will become a full client component later ──

type ProductFilterBlock = {
  blockType: 'productFilter'
  eyebrow?: string
  heading?: string
  description?: string
  productScope: 'expert-transcripts' | 'earnings-analyses' | 'both'
  showFilters?: string[]
  pageSize?: number
  cardHover?: 'none' | 'lift' | 'moving-border' | 'spotlight'
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export async function ProductFilterRenderer({ block }: { block: ProductFilterBlock }) {
  // For v1 phase D we keep this as a renderer that fetches all and renders w/o filter UI.
  // Phase E will add the full filter UI client-side.
  const fakeFeatured: FeaturedProductsBlock = {
    blockType: 'featuredProducts',
    eyebrow: block.eyebrow,
    heading: block.heading,
    description: block.description,
    productSource: block.productScope === 'both' ? 'mixed' : block.productScope,
    mode: 'auto',
    autoFilters: { onlyFeatured: false, sortBy: 'newest' },
    limit: block.pageSize ?? 24,
    layout: 'grid-3',
    cardHover: block.cardHover,
    background: block.background,
    spacing: block.spacing,
    anchorId: block.anchorId,
  }
  return <FeaturedProductsRenderer block={fakeFeatured} />
}

// ── RelatedProducts — placeholder, returns nothing without context ────────

type RelatedProductsBlock = {
  blockType: 'relatedProducts'
  eyebrow?: string
  heading?: string
  matchBy?: string
  limit?: number
  cardHover?: 'none' | 'lift' | 'moving-border' | 'spotlight'
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export async function RelatedProductsRenderer({ block }: { block: RelatedProductsBlock }) {
  // Without the parent product context, fall back to "newest of any type"
  const fakeFeatured: FeaturedProductsBlock = {
    blockType: 'featuredProducts',
    eyebrow: block.eyebrow ?? 'Related',
    heading: block.heading ?? 'You might also like',
    productSource: 'mixed',
    mode: 'auto',
    autoFilters: { onlyFeatured: false, sortBy: 'newest' },
    limit: block.limit ?? 3,
    layout: 'grid-3',
    cardHover: block.cardHover,
    background: block.background,
    spacing: block.spacing,
    anchorId: block.anchorId,
  }
  return <FeaturedProductsRenderer block={fakeFeatured} />
}

// ── BundleShowcase ────────────────────────────────────────────────────────

type BundleShowcaseBlock = {
  blockType: 'bundleShowcase'
  eyebrow?: string
  heading?: string
  description?: string
  bundles?: Array<{ id: string | number } | string | number>
  autoFeatured?: boolean
  layout?: 'grid-2' | 'grid-3' | 'carousel'
  cardHover?: 'none' | 'lift' | 'moving-border' | 'spotlight'
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export async function BundleShowcaseRenderer({ block }: { block: BundleShowcaseBlock }) {
  const payload = await getPayloadClient()
  let docs: any[] = []
  if (block.autoFeatured) {
    const res = await payload.find({
      collection: 'bundles',
      where: { _status: { equals: 'published' }, featured: { equals: true } },
      depth: 1,
      limit: 6,
    })
    docs = res.docs
  } else if (block.bundles && block.bundles.length > 0) {
    const ids = block.bundles.map((b) => (typeof b === 'object' ? b.id : b))
    const res = await payload.find({ collection: 'bundles', where: { id: { in: ids } }, depth: 1 })
    docs = res.docs
  }

  const cols = block.layout === 'grid-2' ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'

  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
      <SectionHeader
        eyebrow={block.eyebrow}
        heading={block.heading ? <MintGradientHeading text={block.heading} /> : undefined}
        description={block.description}
      />
      {docs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface)]/40 p-10 text-center font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--mist)]">
          No bundles published yet.
        </div>
      ) : (
        <div className={`grid gap-6 ${cols}`}>
          {docs.map((b: any, i: number) => (
            <Link
              key={b.id}
              href={`/bundles/${b.slug}`}
              className="group flex flex-col gap-3 rounded-2xl border border-[var(--accent-border)] bg-[var(--surface)] p-6 card-hover-lift"
              style={{ backgroundImage: 'linear-gradient(180deg, var(--accent-tint) 0%, transparent 60%)' }}
            >
              {b.savingsPercent ? (
                <span className="inline-flex w-fit items-center rounded-md bg-gradient-to-r from-mint-500 to-mint-300 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.08em] text-mint-900">
                  Save {b.savingsPercent}%
                </span>
              ) : null}
              <h3 className="text-[20px] font-medium text-[var(--ink)] leading-[1.2]">{b.name}</h3>
              {b.tagline && <p className="text-[14px] text-[var(--accent)] font-medium">{b.tagline}</p>}
              {b.description && <p className="text-[13px] leading-relaxed text-[var(--ink-2)]">{b.description}</p>}
              <div className="mt-2 flex items-end justify-between border-t border-[var(--border)] pt-3">
                <div className="flex items-baseline gap-2">
                  {b.originalTotalUsd && (
                    <span className="font-mono text-[12px] text-[var(--mist)] line-through">${b.originalTotalUsd}</span>
                  )}
                  <span className="font-mono text-[20px] font-semibold text-[var(--accent)]">${b.bundlePriceUsd}</span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--accent)]">
                  {Array.isArray(b.items) ? `${b.items.length} items` : ''}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </SectionShell>
  )
}

// ── LatestArticles — Resources V2 (featured + aside, 3-card row) ─────────

type LatestArticlesBlock = {
  blockType: 'latestArticles'
  eyebrow?: string
  heading?: string
  description?: string
  contentTypeFilter?: string[]
  limit?: number
  layout?: 'featured-with-aside' | 'grid-3' | 'grid-2' | 'list'
  cardHover?: 'none' | 'lift' | 'moving-border' | 'spotlight'
  showAllCta?: { enabled?: boolean; label?: string; url?: string }
  aside?: {
    asideLabel?: string
    pullQuote?: string
    pullQuoteAttr?: string
    stats?: Array<{ value: string; label: string }>
  }
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

function formatDate(d: string | undefined): string {
  if (!d) return ''
  try {
    const date = new Date(d)
    return date
      .toLocaleString('en-US', { month: 'short', year: 'numeric' })
      .toUpperCase()
  } catch {
    return ''
  }
}

export async function LatestArticlesRenderer({ block }: { block: LatestArticlesBlock }) {
  const payload = await getPayloadClient()
  const where: Where = { _status: { equals: 'published' } }
  if (block.contentTypeFilter && block.contentTypeFilter.length > 0) {
    where.contentType = { in: block.contentTypeFilter }
  }
  const res = await payload.find({
    collection: 'blog-posts',
    where,
    sort: '-publishedAt',
    limit: block.limit ?? 4,
    depth: 1,
  })

  const layout = block.layout ?? 'featured-with-aside'

  // ── V2 layout: featured article (left, large) + aside (right) + 3-card row below
  if (layout === 'featured-with-aside') {
    const docs = res.docs as any[]
    const featured = docs[0]
    const rest = docs.slice(1, 4)

    return (
      <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
        {/* Header row — heading on left, "Browse all" on right */}
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 border-b border-[var(--border)] pb-6">
          <div>
            {block.eyebrow && (
              <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]">
                {block.eyebrow}
              </span>
            )}
            {block.heading && (
              <h2 className="mt-3 text-[32px] sm:text-[42px] leading-[1.05] tracking-[-0.02em] font-semibold text-[var(--ink)] text-balance">
                <MintGradientHeading text={block.heading} />
              </h2>
            )}
          </div>
          {block.showAllCta?.enabled && block.showAllCta?.label && block.showAllCta?.url && (
            <Link
              href={block.showAllCta.url}
              className="inline-flex items-center gap-1 border-b border-[var(--mist)] pb-0.5 font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--ink-2)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              {block.showAllCta.label} →
            </Link>
          )}
        </div>

        {!featured ? (
          // Empty state
          <div className="rounded-2xl border border-dashed border-[var(--border-2)] bg-[var(--surface)]/40 p-20 text-center">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--accent-border)] bg-[var(--accent-tint)] text-[var(--accent)]">
              <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                <rect x="4" y="4" width="14" height="14" rx="2" />
                <path d="M8 8h6M8 11h4" />
              </svg>
            </div>
            <h3 className="text-[18px] font-medium text-[var(--ink)]">First articles coming soon</h3>
            <p className="mx-auto mt-2 max-w-md text-[14px] text-[var(--ink-2)]">
              Frameworks, playbooks, and case studies for the modern research workflow. Subscribe to be notified when we publish.
            </p>
            <Link
              href="/free-transcript"
              className="mt-6 inline-flex items-center gap-2 rounded-md border border-[var(--accent-border)] bg-[var(--accent-tint)] px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--accent)] transition-colors hover:bg-[rgba(14,217,138,0.18)]"
            >
              Notify me when live →
            </Link>
          </div>
        ) : (
          <>
            {/* Featured strip — body + aside */}
            <div className="mb-px grid overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] transition-colors hover:bg-[var(--surface-2)] lg:grid-cols-[1fr_380px]">
              <Link
                href={`/resources/${featured.slug}`}
                className="flex flex-col justify-between gap-6 p-10 lg:border-r lg:border-[var(--border)] lg:p-12"
              >
                <div>
                  <div className="mb-5 flex items-center gap-3">
                    {featured.contentType && (
                      <span className="inline-flex items-center rounded-full border border-[var(--accent-border)] bg-[var(--accent-tint)] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--accent)]">
                        {featured.contentType.replaceAll('-', ' ')}
                      </span>
                    )}
                  </div>
                  <h3 className="text-[26px] sm:text-[32px] leading-[1.12] tracking-[-0.022em] font-bold text-[var(--ink)] text-balance">
                    {featured.title}
                  </h3>
                  {featured.excerpt && (
                    <p className="mt-4 max-w-xl text-[15px] leading-[1.7] text-[var(--ink-2)]">
                      {featured.excerpt}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-5 font-mono text-[11px] tracking-[0.1em] text-[var(--mist)]">
                  <span>{formatDate(featured.publishedAt)}</span>
                  {featured.readTime && <span>{featured.readTime} min read</span>}
                  <span className="ml-auto text-[var(--accent)]">Read article →</span>
                </div>
              </Link>

              {/* Aside — pull quote + stat grid */}
              <div
                className="flex flex-col justify-between gap-6 p-10 lg:p-9"
                style={{
                  background: 'linear-gradient(160deg, var(--surface) 0%, rgba(14,217,138,0.06) 100%)',
                }}
              >
                {block.aside?.pullQuote ? (
                  <div>
                    {block.aside.asideLabel && (
                      <div className="mb-4 font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--mist)]">
                        {block.aside.asideLabel}
                      </div>
                    )}
                    <blockquote className="border-l-2 border-[var(--accent)] pl-4 text-[18px] leading-[1.4] tracking-[-0.01em] font-semibold text-[var(--ink)]">
                      "{block.aside.pullQuote}"
                    </blockquote>
                    {block.aside.pullQuoteAttr && (
                      <div className="mt-4 font-mono text-[10px] tracking-[0.1em] text-[var(--mist)]">
                        {block.aside.pullQuoteAttr}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--mist)]">
                    [Add aside.pullQuote on this block to populate]
                  </div>
                )}
                {block.aside?.stats && block.aside.stats.length > 0 && (
                  <div
                    className={`grid overflow-hidden rounded-lg border border-[var(--border)] gap-px bg-[var(--border)]`}
                    style={{
                      gridTemplateColumns: `repeat(${Math.min(block.aside.stats.length, 2)}, minmax(0, 1fr))`,
                    }}
                  >
                    {block.aside.stats.slice(0, 2).map((s, i) => (
                      <div
                        key={i}
                        className="p-4"
                        style={{ background: 'rgba(14,217,138,0.04)' }}
                      >
                        <div className="text-[22px] font-bold tracking-[-0.02em] leading-none text-[var(--accent)]">
                          {s.value}
                        </div>
                        <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--mist)]">
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 3-card row */}
            {rest.length > 0 && (
              <div className="grid overflow-hidden rounded-xl border border-[var(--border)] gap-px bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((p: any) => (
                  <Link
                    key={p.id}
                    href={`/resources/${p.slug}`}
                    className="group relative flex flex-col gap-3 bg-[var(--surface)] p-7 transition-colors duration-base hover:bg-[var(--surface-2)]"
                  >
                    {/* Top accent bar — appears on hover */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--accent)] opacity-0 transition-opacity duration-base group-hover:opacity-100"
                    />
                    <div className="flex items-center justify-between">
                      {p.contentType && (
                        <span className="inline-flex items-center rounded-full border border-[var(--accent-border)] bg-[var(--accent-tint)] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--accent)]">
                          {p.contentType.replaceAll('-', ' ')}
                        </span>
                      )}
                      <span className="font-mono text-[10px] tracking-[0.1em] text-[var(--mist)]">
                        {formatDate(p.publishedAt)}
                      </span>
                    </div>
                    <h3 className="text-[17px] font-bold leading-[1.25] tracking-[-0.015em] text-[var(--ink)]">
                      {p.title}
                    </h3>
                    {p.excerpt && (
                      <p className="text-[13px] leading-[1.6] text-[var(--ink-2)]">{p.excerpt}</p>
                    )}
                    <div className="mt-auto flex items-center justify-between border-t border-[var(--border)] pt-3 font-mono text-[10px] text-[var(--mist)]">
                      {p.readTime && <span>{p.readTime} min</span>}
                      <span className="text-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </SectionShell>
    )
  }

  // ── Legacy grid layouts (grid-3, grid-2, list) ───────────────────────
  const cols = layout === 'grid-2' ? 'sm:grid-cols-2' : layout === 'list' ? 'grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-3'

  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
      <SectionHeader
        eyebrow={block.eyebrow}
        heading={block.heading ? <MintGradientHeading text={block.heading} /> : undefined}
        description={block.description}
      />
      {res.docs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface)]/40 p-10 text-center font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--mist)]">
          No articles published yet.
        </div>
      ) : (
        <div className={`grid gap-6 ${cols}`}>
          {res.docs.map((p: any) => (
            <Link
              key={p.id}
              href={`/resources/${p.slug}`}
              className={`group flex flex-col gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 ${
                block.cardHover === 'moving-border' ? 'card-hover-border card-hover-lift' : 'card-hover-lift'
              }`}
            >
              {p.contentType && (
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--accent)]">
                  {p.contentType.replaceAll('-', ' ')}
                </span>
              )}
              <h3 className="text-[18px] font-medium text-[var(--ink)] leading-[1.25] text-balance">{p.title}</h3>
              {p.excerpt && <p className="text-[13px] leading-relaxed text-[var(--ink-2)]">{p.excerpt}</p>}
              <div className="mt-auto flex items-center gap-2 font-mono text-[11px] text-[var(--mist)]">
                {p.author && typeof p.author === 'object' ? <span>{p.author.name}</span> : null}
                {p.readTime && <span>· {p.readTime} min</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
      {block.showAllCta?.enabled && block.showAllCta?.label && block.showAllCta?.url && (
        <div className="mt-10 flex justify-center">
          <Link
            href={block.showAllCta.url}
            className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-sm font-medium text-[var(--ink)] transition-all duration-base ease-out hover:-translate-y-px hover:border-[var(--accent-border)]"
          >
            {block.showAllCta.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </SectionShell>
  )
}

// ── ResourcesGrid (currently same as LatestArticles without limit) ────────

type ResourcesGridBlock = {
  blockType: 'resourcesGrid'
  eyebrow?: string
  heading?: string
  description?: string
  showFilters?: boolean
  pageSize?: number
  cardHover?: 'none' | 'lift' | 'moving-border' | 'spotlight'
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export async function ResourcesGridRenderer({ block }: { block: ResourcesGridBlock }) {
  const fake: LatestArticlesBlock = {
    blockType: 'latestArticles',
    eyebrow: block.eyebrow,
    heading: block.heading,
    description: block.description,
    limit: block.pageSize ?? 12,
    layout: 'grid-3',
    cardHover: block.cardHover,
    background: block.background,
    spacing: block.spacing,
    anchorId: block.anchorId,
  }
  return <LatestArticlesRenderer block={fake} />
}

// ── EarningsCalendar ──────────────────────────────────────────────────────

type EarningsCalendarBlock = {
  blockType: 'earningsCalendar'
  eyebrow?: string
  heading?: string
  description?: string
  window?: 'next-30' | 'next-90' | 'last-30' | 'this-quarter'
  limit?: number
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export async function EarningsCalendarRenderer({ block }: { block: EarningsCalendarBlock }) {
  const payload = await getPayloadClient()
  const now = new Date()
  let start: Date, end: Date
  if (block.window === 'next-30') {
    start = now
    end = new Date(now.getTime() + 30 * 86400000)
  } else if (block.window === 'next-90') {
    start = now
    end = new Date(now.getTime() + 90 * 86400000)
  } else if (block.window === 'last-30') {
    end = now
    start = new Date(now.getTime() - 30 * 86400000)
  } else {
    const q = Math.floor(now.getMonth() / 3)
    start = new Date(now.getFullYear(), q * 3, 1)
    end = new Date(now.getFullYear(), q * 3 + 3, 0)
  }
  const res = await payload.find({
    collection: 'earnings-analyses',
    where: {
      _status: { equals: 'published' },
      reportDate: { greater_than_equal: start.toISOString(), less_than_equal: end.toISOString() },
    },
    sort: 'reportDate',
    limit: block.limit ?? 8,
  })
  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
      <SectionHeader
        eyebrow={block.eyebrow}
        heading={block.heading ? <MintGradientHeading text={block.heading} /> : undefined}
        description={block.description}
      />
      {res.docs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface)]/40 p-10 text-center font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--mist)]">
          No earnings analyses in this window yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)]">
          {res.docs.map((d: any, i: number) => (
            <Link
              key={d.id}
              href={`/earnings-analysis/${d.slug}`}
              className={`grid grid-cols-[auto_1fr_auto] items-center gap-6 px-6 py-4 transition-colors duration-fast hover:bg-[var(--surface-2)] ${
                i < res.docs.length - 1 ? 'border-b border-[var(--border)]' : ''
              }`}
            >
              <span className="inline-flex items-center rounded-md border border-[var(--border)] px-2 py-0.5 font-mono text-[12px] font-medium text-[var(--ink)]">
                ${d.ticker}
              </span>
              <div>
                <div className="text-[14px] font-medium text-[var(--ink)] leading-tight">
                  {d.companyName} · {d.quarter} FY{d.fiscalYear}
                </div>
                <div className="mt-0.5 font-mono text-[11px] text-[var(--mist)]">
                  {d.reportDate ? new Date(d.reportDate).toISOString().slice(0, 10).replaceAll('-', '.') : ''}
                </div>
              </div>
              <span className="font-mono text-[14px] font-medium text-[var(--accent)]">${d.priceUsd}</span>
            </Link>
          ))}
        </div>
      )}
    </SectionShell>
  )
}
