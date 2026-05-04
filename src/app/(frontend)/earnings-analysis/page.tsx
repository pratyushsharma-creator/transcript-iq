import type { Metadata } from 'next'
import type { Where } from 'payload'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { EarningsLibrary } from '@/components/library/EarningsLibrary'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Earnings Analysis Library',
  description:
    'Comprehensive earnings analysis reports for public companies. EPS beat/miss, revenue performance, management commentary, and 12–15 key metrics. $99 flat — same-day delivery.',
  openGraph: {
    title: 'Earnings Analysis Library | Transcript IQ',
    description:
      'Same-day earnings analysis at $99 flat. EPS beats, revenue performance, buy-side ready PDFs.',
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <EarningsLibrary initialDocs={docs as any} totalDocs={totalDocs} industries={industries as any} />
}
