import type { Metadata } from 'next'
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
      <FaqAccordion faqs={TRANSCRIPTS_INDEX_FAQS} />
    </>
  )
}
