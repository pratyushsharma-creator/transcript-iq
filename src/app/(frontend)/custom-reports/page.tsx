import type { Metadata } from 'next'
import { getPageBySlug } from '@/lib/cache/queries'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { canonical } from '@/lib/seo/metadata'

export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('custom-reports')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = page as any
  const defaultTitle = 'Custom Expert Network Research'
  const defaultDesc = 'Commission bespoke expert call research through the Nextyn network. Sector specialists, former executives, C-suite. Delivered within 3–5 business days.'
  const title = p?.metaTitle || defaultTitle
  const description = p?.metaDescription || defaultDesc
  return {
    title,
    description,
    alternates: { canonical: canonical('/custom-reports') },
    openGraph: {
      title: p?.metaTitle || 'Custom Expert Network Research | Transcript IQ',
      description,
      url: canonical('/custom-reports'),
      type: 'website',
    },
  }
}

export default async function CustomReportsRoute() {
  const page = await getPageBySlug('custom-reports')

  if (!page) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--accent)]">
          Setup pending
        </span>
        <h1 className="mt-3 text-balance text-[44px] font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--ink)] sm:text-[56px]">
          Custom reports page not yet seeded
        </h1>
        <p className="mt-4 text-[16px] leading-relaxed text-[var(--ink-2)]">
          Run{' '}
          <code className="font-mono text-[var(--accent)]">npx tsx scripts/seed-custom-reports.ts</code>{' '}
          or visit{' '}
          <a href="/admin" className="text-[var(--accent)] underline underline-offset-4">
            /admin
          </a>{' '}
          and create a Pages document with slug{' '}
          <code className="font-mono text-[var(--accent)]">custom-reports</code>.
        </p>
      </div>
    )
  }

  const blocks = (page.layout ?? []) as Array<{ blockType: string } & Record<string, unknown>>

  return <RenderBlocks blocks={blocks} />
}
