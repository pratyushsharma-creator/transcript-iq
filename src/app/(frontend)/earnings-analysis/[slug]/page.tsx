import type { Metadata } from 'next'
import type { Where } from 'payload'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import config from '@/payload.config'
import { EarningsProductPage } from '@/components/product/EarningsProductPage'
import type { RelatedEarnings } from '@/components/product/EarningsProductPage'

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
  if (!analysis) return { title: 'Analysis Not Found' }

  const quarterLabel = `${analysis.quarter} FY${analysis.fiscalYear}`
  return {
    title: `${analysis.companyName} ${analysis.ticker} ${quarterLabel} Earnings Analysis`,
    description:
      analysis.summary ??
      `Earnings analysis for ${analysis.companyName} (${analysis.ticker}) ${quarterLabel}. EPS, revenue performance, key metrics, and management commentary. $${analysis.priceUsd}.`,
    openGraph: {
      title: `${analysis.companyName} ${analysis.ticker} ${quarterLabel} Earnings Analysis | Transcript IQ`,
      description: analysis.summary ?? undefined,
      type: 'website',
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <EarningsProductPage analysis={analysis as any} related={related} />
}
