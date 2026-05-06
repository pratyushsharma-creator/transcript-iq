import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { EarningsProductPage } from '@/components/product/EarningsProductPage'
import type { RelatedEarnings } from '@/components/product/EarningsProductPage'
import { canonical, truncate } from '@/lib/seo/metadata'
import { breadcrumbSchema, JsonLd } from '@/lib/seo/jsonld'
import { getEarningsAnalysisBySlug, getRelatedEarningsAnalyses } from '@/lib/cache/queries'

/** Convert Payload Lexical JSON to a simple HTML string (server-side only). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderNode(node: any): string {
  if (!node) return ''
  if (node.type === 'text') {
    let text = (node.text ?? '') as string
    // Escape HTML entities
    text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    if (node.format & 1) text = `<strong>${text}</strong>`
    if (node.format & 2) text = `<em>${text}</em>`
    if (node.format & 8) text = `<u>${text}</u>`
    return text
  }
  const inner = (node.children ?? []).map(renderNode).join('')
  switch (node.type) {
    case 'paragraph': return `<p>${inner}</p>`
    case 'heading':   return `<${node.tag ?? 'h2'}>${inner}</${node.tag ?? 'h2'}>`
    case 'list':      return node.listType === 'bullet' ? `<ul>${inner}</ul>` : `<ol>${inner}</ol>`
    case 'listitem':  return `<li>${inner}</li>`
    default:          return inner
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lexicalToHtml(lexicalJson: unknown): string {
  if (!lexicalJson || typeof lexicalJson !== 'object') return ''
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const root = (lexicalJson as any)?.root
  if (!root?.children) return ''
  return (root.children as unknown[]).map(renderNode).join('')
}

export const revalidate = 86400

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const analysis = await getEarningsAnalysisBySlug(slug)
  if (!analysis) return { title: 'Analysis Not Found', robots: { index: false } }

  const quarterLabel = `${analysis.quarter} FY${analysis.fiscalYear}`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const a = analysis as any
  const autoTitle = `${analysis.companyName} ${analysis.ticker} ${quarterLabel} Earnings Analysis`
  const autoDescription =
    analysis.summary ??
    `Earnings analysis for ${analysis.companyName} (${analysis.ticker}) ${quarterLabel}. EPS, revenue performance, key metrics, and management commentary. $${analysis.priceUsd}.`
  const title = a.metaTitle || autoTitle
  const description = a.metaDescription ? truncate(a.metaDescription, 160) : truncate(autoDescription, 155)

  return {
    title,
    description,
    alternates: { canonical: canonical(`/earnings-analysis/${slug}`) },
    openGraph: {
      title: a.metaTitle || `${autoTitle} | Transcript IQ`,
      description: description || undefined,
      url: canonical(`/earnings-analysis/${slug}`),
      type: 'article',
    },
  }
}

export default async function EarningsAnalysisDetailPage({ params }: { params: Params }) {
  const { slug } = await params
  const analysis = await getEarningsAnalysisBySlug(slug)
  if (!analysis) notFound()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sectors = ((analysis.sectors ?? []) as any[]).filter(
    (s) => typeof s === 'object' && s !== null && 'slug' in s,
  ) as Array<{ id: string; name: string; slug: string }>
  const sectorSlugs = sectors.map(s => s.slug)

  const relatedDocs = await getRelatedEarningsAnalyses(slug, sectorSlugs)

  const related: RelatedEarnings[] = relatedDocs.map(r => ({
    id: String(r.id),
    slug: r.slug,
    ticker: r.ticker,
    quarter: r.quarter,
    fiscalYear: r.fiscalYear,
    companyName: r.companyName,
    reportDate: r.reportDate ?? undefined,
    title: r.title,
    priceUsd: r.priceUsd,
    performanceBadges: r.performanceBadges as RelatedEarnings['performanceBadges'],
  }))

  // Convert Lexical rich text to HTML for the executive summary preview
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const executiveSummaryHtml = lexicalToHtml((analysis as any).executiveSummaryPreview)

  return (
    <>
      <JsonLd schema={breadcrumbSchema([
        { name: 'Home', url: 'https://transcript-iq.com' },
        { name: 'Earnings Analysis', url: 'https://transcript-iq.com/earnings-analysis' },
        { name: analysis.title, url: `https://transcript-iq.com/earnings-analysis/${slug}` },
      ])} />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <EarningsProductPage analysis={analysis as any} related={related} executiveSummaryHtml={executiveSummaryHtml || undefined} />
    </>
  )
}
