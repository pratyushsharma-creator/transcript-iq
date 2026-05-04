import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Get Your Free Expert Call Transcript — Transcript IQ',
  description:
    'Get one MNPI-screened expert call transcript delivered to your inbox — matched to your sector. No subscription, no billing details. Just the research.',
  openGraph: {
    title: 'Get Your Free Expert Call Transcript | Transcript IQ',
    description:
      'Free expert call transcript matched to your sector. No credit card. No subscription. Delivered within 24 hours.',
    type: 'website',
  },
}

export default async function FreeTranscriptRoute() {
  const payload = await getPayload({ config: await config })
  const res = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'free-transcript' } },
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
  return <RenderBlocks blocks={blocks} />
}
