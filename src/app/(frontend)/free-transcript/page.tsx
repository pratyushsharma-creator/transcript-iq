import type { Metadata } from 'next'
import { getPageBySlug } from '@/lib/cache/queries'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { faqPageSchema, breadcrumbSchema, JsonLd } from '@/lib/seo/jsonld'
import { FREE_TRANSCRIPT_FAQS } from '@/lib/seo/faq-data'
import { canonical } from '@/lib/seo/metadata'

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('free-transcript')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = page as any
  const defaultTitle = 'Get a Free Expert Call Transcript'
  const defaultDesc = 'Get one MNPI-screened expert call transcript matched to your sector. No credit card, no subscription. Work email only. Delivered within one business day.'
  const title = p?.metaTitle || defaultTitle
  const description = p?.metaDescription || defaultDesc
  return {
    title,
    description,
    alternates: { canonical: canonical('/free-transcript') },
    openGraph: {
      title: p?.metaTitle || 'Get a Free Expert Call Transcript | Transcript IQ',
      description,
      url: canonical('/free-transcript'),
      type: 'website',
    },
  }
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
    </>
  )
}
