import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TranscriptProductPage } from '@/components/product/TranscriptProductPage'
import type { RelatedTranscript } from '@/components/product/TranscriptProductPage'
import { productSchema, breadcrumbSchema, JsonLd } from '@/lib/seo/jsonld'
import { canonical, truncate } from '@/lib/seo/metadata'
import { getTranscriptBySlug, getRelatedTranscripts } from '@/lib/cache/queries'

export const revalidate = 86400

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const transcript = await getTranscriptBySlug(slug)
  if (!transcript) return { title: 'Transcript Not Found', robots: { index: false } }

  const tier = transcript.tier
    ? `${transcript.tier.charAt(0).toUpperCase()}${transcript.tier.slice(1)}`
    : 'Expert'
  const price = transcript.priceUsd ?? 349
  const description =
    transcript.summary
      ? truncate(transcript.summary, 155)
      : `${tier} expert call transcript. MNPI-screened, compliance certified. Available from $${price}.`

  return {
    title: `${transcript.title} — Expert Call Transcript`,
    description,
    alternates: { canonical: canonical(`/expert-transcripts/${slug}`) },
    openGraph: {
      title: `${transcript.title} | Expert Transcript — Transcript IQ`,
      description,
      url: canonical(`/expert-transcripts/${slug}`),
      type: 'website',
    },
  }
}

export default async function ExpertTranscriptDetailPage({ params }: { params: Params }) {
  const { slug } = await params
  const transcript = await getTranscriptBySlug(slug)
  if (!transcript) notFound()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sectors = ((transcript.sectors ?? []) as any[]).filter(
    (s) => typeof s === 'object' && s !== null && 'slug' in s,
  ) as Array<{ id: string; name: string; slug: string }>
  const sectorSlugs = sectors.map(s => s.slug)

  const relatedDocs = await getRelatedTranscripts(slug, sectorSlugs)

  const related: RelatedTranscript[] = relatedDocs.map(r => ({
    id: String(r.id),
    slug: r.slug,
    title: r.title,
    tier: r.tier as RelatedTranscript['tier'],
    priceUsd: r.priceUsd,
    discountPercent: r.discountPercent ?? undefined,
    duration: r.duration ?? undefined,
    expertId: r.expertId,
    expertFormerTitle: r.expertFormerTitle,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sectors: r.sectors as any,
    geography: r.geography as RelatedTranscript['geography'],
  }))

  return (
    <>
      <JsonLd schema={productSchema(transcript as any)} />
      <JsonLd schema={breadcrumbSchema([
        { name: 'Home', url: 'https://transcript-iq.com' },
        { name: 'Expert Transcripts', url: 'https://transcript-iq.com/expert-transcripts' },
        { name: transcript.title, url: `https://transcript-iq.com/expert-transcripts/${slug}` },
      ])} />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <TranscriptProductPage transcript={transcript as any} related={related} />
    </>
  )
}
