import type { Metadata } from 'next'
import Link from 'next/link'
import { TranscriptLibrary } from '@/components/library/TranscriptLibrary'
import { SECTOR_META, canonical } from '@/lib/seo/metadata'
import { itemListSchema, faqPageSchema, JsonLd, breadcrumbSchema } from '@/lib/seo/jsonld'
import { TRANSCRIPTS_INDEX_FAQS } from '@/lib/seo/faq-data'
import { FaqAccordion } from '@/components/seo/FaqAccordion'
import { getTranscriptList, getIndustries } from '@/lib/cache/queries'

export const revalidate = 3600

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams
}): Promise<Metadata> {
  const sp = await searchParams
  const industry = typeof sp.industry === 'string' ? sp.industry : undefined

  if (industry && SECTOR_META[industry]) {
    const sector = SECTOR_META[industry]
    return {
      title: sector.title,
      description: sector.description,
      alternates: {
        canonical: canonical(`/expert-transcripts?industry=${industry}`),
      },
      openGraph: {
        title: `${sector.title} | Transcript IQ`,
        description: sector.description,
        url: canonical(`/expert-transcripts?industry=${industry}`),
      },
    }
  }

  return {
    title: 'Expert Call Transcript Library — 77+ MNPI-Screened',
    description:
      'Primary research on demand. MNPI-screened, PII-redacted expert call transcripts by sector, geography, and expert level. Buy exactly what you need — no subscription.',
    alternates: { canonical: canonical('/expert-transcripts') },
    openGraph: {
      title: 'Expert Call Transcript Library | Transcript IQ',
      description:
        'MNPI-screened expert call transcripts. C-Suite, VP, and Director level. Standard $349 · Premium $449 · Elite $599.',
      url: canonical('/expert-transcripts'),
      type: 'website',
    },
  }
}

export default async function ExpertTranscriptsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams

  const industry = typeof sp.industry === 'string' ? sp.industry : undefined
  const geography = typeof sp.geography === 'string' ? sp.geography : undefined
  const level = typeof sp.level === 'string' ? sp.level : undefined
  const tier = typeof sp.tier === 'string' ? sp.tier : undefined

  const [{ docs, totalDocs }, industries] = await Promise.all([
    getTranscriptList({ industry, geography, level, tier }),
    getIndustries(),
  ])

  return (
    <>
      <JsonLd schema={breadcrumbSchema([
        { name: 'Home', url: 'https://transcript-iq.com' },
        { name: 'Expert Transcripts', url: 'https://transcript-iq.com/expert-transcripts' },
      ])} />
      <JsonLd schema={faqPageSchema(TRANSCRIPTS_INDEX_FAQS)} />
      <JsonLd schema={itemListSchema(
        docs.slice(0, 20).map((t, i) => ({
          name: t.title,
          url: `https://transcript-iq.com/expert-transcripts/${t.slug ?? ''}`,
          position: i + 1,
        }))
      )} />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <TranscriptLibrary initialDocs={docs as any} totalDocs={totalDocs} industries={industries as any} />

      {/* ── Custom Transcript CTA ─────────────────────────────────────── */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-10 py-16 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--accent)] mb-2">
              Can&apos;t find what you need?
            </p>
            <h2 className="text-[22px] sm:text-[26px] font-semibold tracking-[-0.03em] text-[var(--ink)] leading-[1.2]">
              Commission a Custom Transcript
            </h2>
            <p className="mt-2 text-[14px] text-[var(--ink-2)] leading-[1.6] max-w-[480px]">
              We source and conduct expert calls on any topic, company, or sector you specify. MNPI-screened, PII-redacted, delivered within 36 hours.
            </p>
          </div>
          <Link
            href="/custom-reports"
            className="shrink-0 inline-flex items-center gap-2 rounded-[10px] bg-btn-primary px-7 py-3.5 text-[14px] font-semibold text-btn-primary-fg shadow-cta transition-all duration-base ease-out hover:-translate-y-px hover:bg-btn-primary-hover whitespace-nowrap"
          >
            Request a Custom Transcript
            <svg viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
              <path d="M2 6.5h9M7.5 2.5l4 4-4 4" />
            </svg>
          </Link>
        </div>
      </section>

      <FaqAccordion faqs={TRANSCRIPTS_INDEX_FAQS} />
    </>
  )
}
