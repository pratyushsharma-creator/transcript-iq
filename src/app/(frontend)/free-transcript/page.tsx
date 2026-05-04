import type { Metadata } from 'next'
import { getPageBySlug } from '@/lib/cache/queries'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { faqPageSchema, breadcrumbSchema, JsonLd } from '@/lib/seo/jsonld'
import { FREE_TRANSCRIPT_FAQS } from '@/lib/seo/faq-data'
import { FaqAccordion } from '@/components/seo/FaqAccordion'
import { canonical } from '@/lib/seo/metadata'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Get a Free Expert Call Transcript',
  description:
    'Get one MNPI-screened expert call transcript matched to your sector. No credit card, no subscription. Work email only. Delivered within one business day.',
  alternates: { canonical: canonical('/free-transcript') },
  openGraph: {
    title: 'Get a Free Expert Call Transcript | Transcript IQ',
    description: 'Free full transcript matched to your sector. No credit card. No subscription.',
    url: canonical('/free-transcript'),
    type: 'website',
  },
}

export default async function FreeTranscriptRoute() {
  const page = await getPageBySlug('free-transcript')

  if (!page) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--accent)]">
          Setup pending
        </span>
        <h1 className="mt-3 text-balance text-[44px] font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--ink)] sm:text-[56px]">
          Free transcript page not yet seeded
        </h1>
        <p className="mt-4 text-[16px] leading-relaxed text-[var(--ink-2)]">
          Run{' '}
          <code className="font-mono text-[var(--accent)]">
            npx tsx scripts/seed-free-transcript.ts
          </code>{' '}
          or visit{' '}
          <a href="/admin" className="text-[var(--accent)] underline underline-offset-4">
            /admin
          </a>{' '}
          and create a Pages document with slug{' '}
          <code className="font-mono text-[var(--accent)]">free-transcript</code>.
        </p>
      </div>
    )
  }

  const blocks = (page.layout ?? []) as Array<{ blockType: string } & Record<string, unknown>>
  return (
    <>
      <JsonLd schema={faqPageSchema(FREE_TRANSCRIPT_FAQS)} />
      <JsonLd schema={breadcrumbSchema([
        { name: 'Home', url: 'https://transcript-iq.com' },
        { name: 'Free Transcript', url: 'https://transcript-iq.com/free-transcript' },
      ])} />
      <RenderBlocks blocks={blocks} />
      <FaqAccordion faqs={FREE_TRANSCRIPT_FAQS} />
    </>
  )
}
