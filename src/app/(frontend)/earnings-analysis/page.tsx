import type { Metadata } from 'next'
import type { Where } from 'payload'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { EarningsLibrary } from '@/components/library/EarningsLibrary'
import { canonical } from '@/lib/seo/metadata'
import { breadcrumbSchema, JsonLd } from '@/lib/seo/jsonld'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Earnings Analysis Briefs — Institutional-Grade',
  description:
    'Deep-dive earnings analysis briefs for institutional researchers. Sector-by-sector. MNPI-screened. Buy per brief, no subscription.',
  alternates: { canonical: canonical('/earnings-analysis') },
  openGraph: {
    title: 'Earnings Analysis Briefs | Transcript IQ',
    description: 'Institutional-grade earnings analysis. MNPI-screened. Buy per document.',
    url: canonical('/earnings-analysis'),
    type: 'website',
  },
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function EarningsAnalysisPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams

  const sector = typeof sp.sector === 'string' ? sp.sector : undefined
  const exchange = typeof sp.exchange === 'string' ? sp.exchange : undefined
  const quarter = typeof sp.quarter === 'string' ? sp.quarter : undefined
  const performance = typeof sp.performance === 'string' ? sp.performance : undefined

  const payload = await getPayload({ config: await config })

  const andConditions: Where[] = []
  if (sector) {
    const slugs = sector.split(',').filter(Boolean)
    andConditions.push(slugs.length === 1
      ? { 'sectors.slug': { equals: slugs[0] } }
      : { 'sectors.slug': { in: slugs } })
  }
  if (exchange) {
    const vals = exchange.split(',').filter(Boolean)
    andConditions.push(vals.length === 1
      ? { exchange: { equals: vals[0] } }
      : { exchange: { in: vals } })
  }
  if (quarter) {
    const vals = quarter.split(',').filter(Boolean)
    andConditions.push(vals.length === 1
      ? { quarter: { equals: vals[0] } }
      : { quarter: { in: vals } })
  }
  if (performance) {
    const vals = performance.split(',').filter(Boolean)
    andConditions.push(vals.length === 1
      ? { performanceBadges: { equals: vals[0] } }
      : { performanceBadges: { in: vals } })
  }

  const [{ docs, totalDocs }, { docs: industries }] = await Promise.all([
    payload.find({
      collection: 'earnings-analyses',
      where: andConditions.length > 0 ? { and: andConditions } : undefined,
      limit: 24,
      page: 1,
      sort: '-reportDate',
      depth: 2,
    }),
    payload.find({
      collection: 'industries',
      limit: 50,
      sort: 'name',
    }),
  ])

  return (
    <>
      <JsonLd schema={breadcrumbSchema([
        { name: 'Home', url: 'https://transcript-iq.com' },
        { name: 'Earnings Analysis', url: 'https://transcript-iq.com/earnings-analysis' },
      ])} />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <EarningsLibrary initialDocs={docs as any} totalDocs={totalDocs} industries={industries as any} />
    </>
  )
}
