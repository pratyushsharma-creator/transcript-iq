import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Commission a Custom Expert Call Transcript — Transcript IQ',
  description:
    'Commission a bespoke expert call on any topic. $599 flat fee. We source the expert, moderate the call, transcribe it, and deliver an MNPI-screened PDF tailored to your thesis.',
  openGraph: {
    title: 'Commission a Custom Expert Call Transcript | Transcript IQ',
    description:
      'Commission a bespoke expert call on any topic. $599 flat fee, 36hr turnaround, MNPI screened.',
    type: 'website',
  },
}

export default async function CustomReportsRoute() {
  const payload = await getPayload({ config: await config })
  const res = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'custom-reports' } },
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
