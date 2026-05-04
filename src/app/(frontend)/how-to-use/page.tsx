import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'How to Use Expert Call Transcripts',
  description:
    'From PDF download to investment memo. A practical guide for analysts, portfolio managers, and consultants who want to extract maximum value from every transcript they purchase.',
}

export default async function HowToUseRoute() {
  const payload = await getPayload({ config: await config })
  const res = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'how-to-use' } },
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

  return <RenderBlocks blocks={blocks} />
}
