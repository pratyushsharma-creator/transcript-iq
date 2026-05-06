import type { Metadata } from 'next'
import { getPageBySlug } from '@/lib/cache/queries'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { howToSchema, breadcrumbSchema, JsonLd } from '@/lib/seo/jsonld'
import { canonical } from '@/lib/seo/metadata'

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('how-to-use')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = page as any
  const defaultTitle = 'How to Use Expert Transcripts for Research'
  const defaultDesc = 'From PDF download to investment memo. A 6-step guide for analysts, portfolio managers, and consultants to extract maximum value from expert call transcripts.'
  const title = p?.metaTitle || defaultTitle
  const description = p?.metaDescription || defaultDesc
  return {
    title,
    description,
    alternates: { canonical: canonical('/how-to-use') },
    openGraph: {
      title: p?.metaTitle || 'How to Use Expert Call Transcripts | Transcript IQ',
      description,
      url: canonical('/how-to-use'),
      type: 'website',
    },
  }
}

const HOW_TO = howToSchema({
  name: 'How to Use Expert Call Transcripts for Investment Research',
  description:
    'A step-by-step guide to integrating expert call transcripts into an investment research or deal diligence workflow.',
  totalTime: 'PT30M',
  steps: [
    {
      position: 1,
      name: 'Define your research question',
      text: 'Before searching the library, write down the specific question your transcript needs to answer — about competitive dynamics, pricing, management quality, or customer behaviour.',
    },
    {
      position: 2,
      name: 'Filter by sector and expert level',
      text: 'Use the sector, geography, and tier filters to narrow to transcripts relevant to your company or industry. Elite (C-suite) transcripts are best for strategic questions; Standard (Director) for operational detail.',
    },
    {
      position: 3,
      name: 'Read the executive summary',
      text: 'Each transcript includes a moderator-written executive summary. Read this first to assess relevance before committing to the full document.',
    },
    {
      position: 4,
      name: 'Purchase and download',
      text: 'Buy the transcript as a one-time purchase ($349–$599). Instant PDF download. No subscription. The compliance certificate is included in the download.',
    },
    {
      position: 5,
      name: 'Annotate and synthesise',
      text: "Read the transcript twice: first for orientation, second for annotation. Tag passages as Confirms, Challenges, or New Information relative to your thesis. Synthesise — write what the expert's view means for your investment case, not what they said.",
    },
    {
      position: 6,
      name: 'Cite in your deliverable',
      text: 'Cite as: Expert call, [Sector], via Transcript IQ, [Date]. File the compliance certificate with your institutional compliance team before use in a regulated investment process.',
    },
  ],
})

export default async function HowToUseRoute() {
  const page = await getPageBySlug('how-to-use')

  if (!page) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--accent)]">
          Setup pending
        </span>
        <h1 className="mt-3 text-[44px] sm:text-[56px] leading-[1.05] tracking-[-0.04em] font-semibold text-[var(--ink)] text-balance">
          How-to-use page not yet seeded
        </h1>
        <p className="mt-4 text-[16px] leading-relaxed text-[var(--ink-2)]">
          Run{' '}
          <code className="font-mono text-[var(--accent)]">npx tsx scripts/seed-how-to-use.ts</code>{' '}
          or visit{' '}
          <a href="/admin" className="text-[var(--accent)] underline underline-offset-4">/admin</a>{' '}
          and create a Pages document with slug{' '}
          <code className="font-mono text-[var(--accent)]">how-to-use</code>.
        </p>
      </div>
    )
  }

  const blocks = (page.layout ?? []) as Array<{ blockType: string } & Record<string, unknown>>

  return (
    <>
      <JsonLd schema={HOW_TO} />
      <JsonLd schema={breadcrumbSchema([
        { name: 'Home', url: 'https://transcript-iq.com' },
        { name: 'How to Use', url: 'https://transcript-iq.com/how-to-use' },
      ])} />
      <RenderBlocks blocks={blocks} />
    </>
  )
}
