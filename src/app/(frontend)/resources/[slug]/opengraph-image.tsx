// src/app/(frontend)/resources/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'
import { getPayload } from 'payload'
import config from '@/payload.config'

// Node.js runtime (edge omitted — no existing codebase file uses edge + getPayload together)
export const alt = 'Transcript IQ Research Article'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

type Props = { params: Promise<{ slug: string }> }

const CATEGORY_LABELS: Record<string, string> = {
  educational: 'Educational',
  'industry-deep-dive': 'Industry Deep-Dive',
  'use-case': 'Use Case',
  'thought-leadership': 'Thought Leadership',
  whitepaper: 'Whitepaper',
  'case-study': 'Case Study',
  pillar: 'Pillar',
}

export default async function Image({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'blog-posts',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
    select: { title: true, contentType: true, author: true, publishedAt: true },
  })
  const post = docs[0]

  const title = post?.title ?? 'Research & Insights'
  const category = post?.contentType
    ? CATEGORY_LABELS[post.contentType as string] ?? post.contentType
    : 'Article'
  const authorName =
    (post?.author as { name?: string } | null)?.name ?? 'Pratyush Sharma'
  const publishedAt = post?.publishedAt
    ? new Date(post.publishedAt as string).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#0A0A0F',
          padding: '64px 72px',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(52,211,153,0.1) 0%, transparent 70%)',
            top: -100,
            right: -80,
          }}
        />
        {/* Top */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            style={{
              fontSize: 13,
              color: '#34D399',
              background: 'rgba(52,211,153,0.08)',
              border: '1px solid rgba(52,211,153,0.25)',
              padding: '5px 14px',
              borderRadius: 99,
              fontFamily: 'monospace',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {category as string}
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: '#34D399',
              fontFamily: 'sans-serif',
              letterSpacing: '0.1em',
            }}
          >
            TRANSCRIPT IQ
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: '#FAFAFA',
            lineHeight: 1.1,
            maxWidth: 960,
            fontFamily: 'sans-serif',
          }}
        >
          {title}
        </div>

        {/* Bottom */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10B981, #34D399)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 600,
                color: '#064E3B',
                fontFamily: 'monospace',
              }}
            >
              PS
            </div>
            <div style={{ fontSize: 15, color: 'rgba(250,250,250,0.6)', fontFamily: 'sans-serif' }}>
              {authorName as string}{publishedAt ? ` · ${publishedAt}` : ''}
            </div>
          </div>
          <div
            style={{
              fontSize: 14,
              color: 'rgba(250,250,250,0.35)',
              fontFamily: 'monospace',
              letterSpacing: '0.06em',
            }}
          >
            transcript-iq.com/resources
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: '#34D399',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
