import { getPageBySlug } from '@/lib/cache/queries'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { organizationSchema, websiteSchema, faqPageSchema, JsonLd } from '@/lib/seo/jsonld'
import { HOME_FAQS } from '@/lib/seo/faq-data'
import { canonical } from '@/lib/seo/metadata'

export const revalidate = 3600

export async function generateMetadata() {
  const page = await getPageBySlug('home')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = page as any
  const defaultTitle = 'Expert Call Transcripts Without the Subscription'
  const defaultDesc = 'Buy individual MNPI-screened expert call transcripts from $349. No subscription. Compliance certified.'
  const title = p?.metaTitle || defaultTitle
  const description = p?.metaDescription || defaultDesc
  return {
    title,
    description,
    alternates: { canonical: canonical('/') },
    openGraph: {
      title: p?.metaTitle || `${defaultTitle} | Transcript IQ`,
      description,
      url: canonical('/'),
      type: 'website',
    },
  }
}

export default async function HomePage() {
  const page = await getPageBySlug('home')

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
    </>
  )
}
