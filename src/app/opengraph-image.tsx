// src/app/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Transcript IQ — Expert Call Transcripts Without the Subscription'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0A0A0F',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* Accent glow */}
        <div
          style={{
            position: 'absolute',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(52,211,153,0.15) 0%, transparent 70%)',
            top: -200,
            right: -100,
          }}
        />
        {/* Wordmark */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: '-0.04em',
            color: '#34D399',
            marginBottom: 32,
            fontFamily: 'sans-serif',
          }}
        >
          TRANSCRIPT IQ
        </div>
        {/* Headline */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: '-0.04em',
            color: '#FAFAFA',
            textAlign: 'center',
            lineHeight: 1.05,
            maxWidth: 900,
            fontFamily: 'sans-serif',
          }}
        >
          Expert Call Transcripts Without the Subscription
        </div>
        {/* Sub */}
        <div
          style={{
            marginTop: 24,
            fontSize: 22,
            color: 'rgba(250,250,250,0.55)',
            textAlign: 'center',
            fontFamily: 'sans-serif',
          }}
        >
          77+ MNPI-Screened Transcripts · From $349 · No Subscription
        </div>
        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: '#34D399',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
