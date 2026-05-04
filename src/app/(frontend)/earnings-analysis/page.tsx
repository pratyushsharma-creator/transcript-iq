import type { Metadata } from 'next'
import { EarningsLibrary } from '@/components/library/EarningsLibrary'
import { canonical } from '@/lib/seo/metadata'
import { breadcrumbSchema, JsonLd } from '@/lib/seo/jsonld'
import { getEarningsAnalysisList, getIndustries } from '@/lib/cache/queries'

export const revalidate = 3600

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

  const [{ docs, totalDocs }, industries] = await Promise.all([
    getEarningsAnalysisList({ sector, exchange, quarter, performance }),
    getIndustries(),
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
