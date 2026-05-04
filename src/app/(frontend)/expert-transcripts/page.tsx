import type { Metadata } from 'next'
import type { Where } from 'payload'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { TranscriptLibrary } from '@/components/library/TranscriptLibrary'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Expert Call Transcript Library',
  description:
    'Primary research on demand. MNPI-screened, PII-redacted expert call transcripts by sector, geography, and expert level. Buy exactly what you need — no subscription.',
  openGraph: {
    title: 'Expert Call Transcript Library | Transcript IQ',
    description:
      'MNPI-screened expert call transcripts. C-Suite, VP, and Director level. Standard $349 · Premium $449 · Elite $599.',
    type: 'website',
  },
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function ExpertTranscriptsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams

  const industry = typeof sp.industry === 'string' ? sp.industry : undefined
  const geography = typeof sp.geography === 'string' ? sp.geography : undefined
  const level = typeof sp.level === 'string' ? sp.level : undefined
  const tier = typeof sp.tier === 'string' ? sp.tier : undefined

  const payload = await getPayload({ config: await config })

  const andConditions: Where[] = []
  if (industry) {
    const slugs = industry.split(',').filter(Boolean)
    andConditions.push(slugs.length === 1
      ? { 'sectors.slug': { equals: slugs[0] } }
      : { 'sectors.slug': { in: slugs } })
  }
  if (geography) {
    const vals = geography.split(',').filter(Boolean)
    andConditions.push(vals.length === 1
      ? { geography: { equals: vals[0] } }
      : { geography: { in: vals } })
  }
  if (level) {
    const vals = level.split(',').filter(Boolean)
    andConditions.push(vals.length === 1
      ? { expertLevel: { equals: vals[0] } }
      : { expertLevel: { in: vals } })
  }
  if (tier) {
    const vals = tier.split(',').filter(Boolean)
    andConditions.push(vals.length === 1
      ? { tier: { equals: vals[0] } }
      : { tier: { in: vals } })
  }

  const [{ docs, totalDocs }, { docs: industries }] = await Promise.all([
    payload.find({
      collection: 'expert-transcripts',
      where: andConditions.length > 0 ? { and: andConditions } : undefined,
      limit: 24,
      page: 1,
      sort: '-dateConducted',
      depth: 2,
    }),
    payload.find({
      collection: 'industries',
      limit: 50,
      sort: 'name',
    }),
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <TranscriptLibrary initialDocs={docs as any} totalDocs={totalDocs} industries={industries as any} />
}
