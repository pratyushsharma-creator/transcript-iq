import type { Metadata } from 'next'
import type { Where } from 'payload'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import config from '@/payload.config'
import { EarningsProductPage } from '@/components/product/EarningsProductPage'
import type { RelatedEarnings } from '@/components/product/EarningsProductPage'
import { canonical, truncate } from '@/lib/seo/metadata'
import { breadcrumbSchema, JsonLd } from '@/lib/seo/jsonld'

export const dynamic = 'force-dynamic'

type Params = Promise<{ slug: string }>

async function getAnalysis(slug: string) {
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'earnings-analyses',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return docs[0] ?? null
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const analysis = await getAnalysis(slug)
  if (!analysis) return { title: 'Analysis Not Found', robots: { index: false } }

  const quarterLabel = `${analysis.quarter} FY${analysis.fiscalYear}`
  return {
    title: `${analysis.companyName} ${analysis.ticker} ${quarterLabel} Earnings Analysis`,
    description:
      analysis.summary ??
      `Earnings analysis for ${analysis.companyName} (${analysis.ticker}) ${quarterLabel}. EPS, revenue performance, key metrics, and management commentary. $${analysis.priceUsd}.`,
    alternates: { canonical: canonical(`/earnings-analysis/${slug}`) },
    openGraph: {
      title: `${analysis.companyName} ${analysis.ticker} ${quarterLabel} Earnings Analysis | Transcript IQ`,
      description: truncate(analysis.summary, 155) || undefined,
      url: canonical(`/earnings-analysis/${slug}`),
      type: 'article',
    },
  }
}

export default async function EarningsAnalysisDetailPage({ params }: { params: Params }) {
  const { slug } = await params
  const analysis = await getAnalysis(slug)
  if (!analysis) notFound()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sectors = ((analysis.sectors ?? []) as any[]).filter(
    (s) => typeof s === 'object' && s !== null && 'slug' in s,
  ) as Array<{ id: string; name: string; slug: string }>
  const sectorSlugs = sectors.map(s => s.slug)

  const payload = await getPayload({ config: await config })
  const relatedWhere: Where = sectorSlugs.length > 0
    ? { and: [{ slug: { not_equals: slug } }, { 'sectors.slug': { in: sectorSlugs } }] }
    : { slug: { not_equals: slug } }

  const { docs: relatedDocs } = await payload.find({
    collection: 'earnings-analyses',
    where: relatedWhere,
    limit: 3,
    sort: '-reportDate',
    depth: 0,
  })

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

  return (
    <>
      <JsonLd schema={breadcrumbSchema([
        { name: 'Home', url: 'https://transcript-iq.com' },
        { name: 'Earnings Analysis', url: 'https://transcript-iq.com/earnings-analysis' },
        { name: analysis.title, url: `https://transcript-iq.com/earnings-analysis/${slug}` },
      ])} />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <EarningsProductPage analysis={analysis as any} related={related} />
    </>
  )
}
