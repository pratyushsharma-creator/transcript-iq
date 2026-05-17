import type { Metadata } from 'next'
import Link from 'next/link'
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

      {/* ── Custom Earnings Analysis CTA ──────────────────────────────── */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-10 py-16 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--accent)] mb-2">
              Need a specific company or quarter?
            </p>
            <h2 className="text-[22px] sm:text-[26px] font-semibold tracking-[-0.03em] text-[var(--ink)] leading-[1.2]">
              Commission a Custom Earnings Analysis
            </h2>
            <p className="mt-2 text-[14px] text-[var(--ink-2)] leading-[1.6] max-w-[480px]">
              We produce deep-dive earnings analyses for any public company on request. Same buy-side ready format, MNPI-screened, delivered within 36 hours.
            </p>
          </div>
          <Link
            href="/custom-reports"
            className="shrink-0 inline-flex items-center gap-2 rounded-[10px] bg-btn-primary px-7 py-3.5 text-[14px] font-semibold text-btn-primary-fg shadow-cta transition-all duration-base ease-out hover:-translate-y-px hover:bg-btn-primary-hover whitespace-nowrap"
          >
            Request a Custom Earnings Analysis
            <svg viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
              <path d="M2 6.5h9M7.5 2.5l4 4-4 4" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  )
}
