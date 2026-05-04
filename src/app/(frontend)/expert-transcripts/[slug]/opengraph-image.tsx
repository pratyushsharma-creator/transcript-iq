// src/app/(frontend)/expert-transcripts/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'
import { getPayload } from 'payload'
import config from '@/payload.config'

// Node.js runtime (edge omitted — no existing codebase file uses edge + getPayload together)
export const alt = 'Expert Call Transcript'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

type Props = { params: Promise<{ slug: string }> }

const TIER_LABELS: Record<string, string> = {
  standard: 'Standard · $349',
  premium: 'Premium · $449',
  elite: 'Elite · $599',
}

export default async function Image({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'expert-transcripts',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  const t = docs[0]

  const title = t?.title ?? 'Expert Call Transcript'
  const tier = t?.tier ? TIER_LABELS[t.tier] ?? t.tier : 'Expert Transcript'
  const sectorName =
    Array.isArray(t?.sectors) && t.sectors.length > 0
      ? ((t.sectors[0] as unknown) as Record<string, unknown>)?.name as string ?? ''
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
            background: 'radial-gradient(circle, rgba(52,211,153,0.12) 0%, transparent 70%)',
            top: -100,
            right: -80,
          }}
        />
        {/* Top: wordmark + badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: '#34D399',
              letterSpacing: '0.1em',
              fontFamily: 'sans-serif',
            }}
          >
            TRANSCRIPT IQ
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {sectorName && (
              <div
                style={{
                  fontSize: 13,
                  color: 'rgba(250,250,250,0.6)',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  padding: '5px 14px',
                  borderRadius: 99,
                  fontFamily: 'monospace',
                  letterSpacing: '0.06em',
                }}
              >
                {sectorName}
              </div>
            )}
            <div
              style={{
                fontSize: 13,
                color: '#34D399',
                background: 'rgba(52,211,153,0.1)',
                border: '1px solid rgba(52,211,153,0.3)',
                padding: '5px 14px',
                borderRadius: 99,
                fontFamily: 'monospace',
                letterSpacing: '0.06em',
              }}
            >
              {tier}
            </div>
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: '#FAFAFA',
            lineHeight: 1.08,
            maxWidth: 900,
            fontFamily: 'sans-serif',
          }}
        >
          {title}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontSize: 15,
              color: 'rgba(250,250,250,0.4)',
              fontFamily: 'monospace',
              letterSpacing: '0.08em',
            }}
          >
            MNPI SCREENED · COMPLIANCE CERTIFIED · PDF DOWNLOAD
          </div>
          <div
            style={{
              fontSize: 15,
              color: 'rgba(250,250,250,0.4)',
              fontFamily: 'monospace',
              letterSpacing: '0.06em',
            }}
          >
            transcript-iq.com
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
