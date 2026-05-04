import { getPayload } from 'payload'
import config from '@/payload.config'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { organizationSchema, websiteSchema, faqPageSchema, JsonLd } from '@/lib/seo/jsonld'
import { HOME_FAQS } from '@/lib/seo/faq-data'
import { canonical } from '@/lib/seo/metadata'
import { FaqAccordion } from '@/components/seo/FaqAccordion'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  return {
    title: 'Expert Call Transcripts Without the Subscription',
    description:
      'Buy individual MNPI-screened expert call transcripts from $349. 77+ transcripts across 12 sectors. No subscription. Compliance certified.',
    alternates: { canonical: canonical('/') },
    openGraph: {
      title: 'Expert Call Transcripts Without the Subscription | Transcript IQ',
      description:
        'Institutional primary research. Buy per transcript — no subscription, no platform fee. MNPI-screened, compliance certified.',
      url: canonical('/'),
      type: 'website',
    },
  }
}

export default async function HomePage() {
  const payload = await getPayload({ config: await config })
  const res = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
    depth: 2,
  })
  const page = res.docs[0]

  if (!page) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--accent)]">
          Setup pending
        </span>
        <h1 className="mt-3 text-[44px] sm:text-[56px] leading-[1.05] tracking-[-0.04em] font-semibold text-[var(--ink)] text-balance">
          Home page not yet seeded
        </h1>
        <p className="mt-4 text-[16px] leading-relaxed text-[var(--ink-2)]">
          Run the seed script (<code className="font-mono text-[var(--accent)]">npx tsx scripts/seed-home.ts</code>) or visit{' '}
          <a href="/admin" className="text-[var(--accent)] underline underline-offset-4">/admin</a> and create a Pages document with slug{' '}
          <code className="font-mono text-[var(--accent)]">home</code>.
        </p>
      </div>
    )
  }

  const blocks = (page.layout ?? []) as Array<{ blockType: string } & Record<string, unknown>>

  return (
    <>
      <JsonLd schema={organizationSchema()} />
      <JsonLd schema={websiteSchema()} />
      <JsonLd schema={faqPageSchema(HOME_FAQS)} />
      <RenderBlocks blocks={blocks} />
      <FaqAccordion faqs={HOME_FAQS} />
    </>
  )
}
