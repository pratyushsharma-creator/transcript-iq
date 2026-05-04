import type { Metadata } from 'next'
import { getPageBySlug } from '@/lib/cache/queries'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { canonical } from '@/lib/seo/metadata'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Expert Network Research & Insights',
  description:
    'Practical guides on expert call transcripts, MNPI compliance, primary research workflows, and institutional research practices.',
  alternates: { canonical: canonical('/resources') },
  openGraph: {
    title: 'Expert Network Research & Insights | Transcript IQ',
    description: 'Research guides for analysts, portfolio managers, and deal teams.',
    url: canonical('/resources'),
    type: 'website',
  },
}

export default async function ResourcesRoute() {
  const page = await getPageBySlug('resources')

  if (!page) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--accent)]">
          Setup pending
        </span>
        <h1 className="mt-3 text-balance text-[44px] font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--ink)] sm:text-[56px]">
          Resources page not yet seeded
        </h1>
        <p className="mt-4 text-[16px] leading-relaxed text-[var(--ink-2)]">
          Run{' '}
          <code className="font-mono text-[var(--accent)]">
            npx tsx scripts/seed-resources.ts
          </code>{' '}
          or visit{' '}
          <a href="/admin" className="text-[var(--accent)] underline underline-offset-4">
            /admin
          </a>{' '}
          and create a Pages document with slug{' '}
          <code className="font-mono text-[var(--accent)]">resources</code>.
        </p>
      </div>
    )
  }

  const blocks = (page.layout ?? []) as Array<{ blockType: string } & Record<string, unknown>>
  return <RenderBlocks blocks={blocks} />
}
