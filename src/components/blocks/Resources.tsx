// NOTE: ResourcesHubRenderer uses 'use client' in the interactive sub-component.
// This file exports server components for both ResourcesHero and ResourcesHub.

import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { ResourcesHubClient } from './resources/ResourcesHubClient'

// ── Types ──────────────────────────────────────────────────────────────────

type ResourcesHeroBlock = {
  blockType: 'resourcesHero'
  eyebrow?: string
  heading?: string
  subtitle?: string
  stats?: Array<{ value: string; label: string }>
}

type ResourcesHubBlock = {
  blockType: 'resourcesHub'
  pageSize?: number
  featuredSlug?: string
  newsletterEyebrow?: string
  newsletterHeading?: string
  newsletterBody?: string
}

// ── HeroHeading parser ────────────────────────────────────────────────────

function HeroHeading({ raw }: { raw: string }) {
  const lines = raw.split(/\\n|\n/)
  return (
    <h1
      style={{
        fontSize: 'clamp(42px, 5.5vw, 72px)',
        fontWeight: 700,
        letterSpacing: '-0.05em',
        lineHeight: 0.93,
        marginBottom: 8,
      }}
    >
      {lines.map((line, i) => {
        const boldMatch = line.match(/^\*\*(.+)\*\*$/)
        const ghostMatch = line.match(/^~~(.+)~~$/)
        if (boldMatch) {
          return (
            <span key={i} style={{ color: 'var(--accent)', display: 'block' }}>
              {boldMatch[1]}
            </span>
          )
        }
        if (ghostMatch) {
          return (
            <span
              key={i}
              style={{
                color: 'transparent',
                WebkitTextStroke: '1.5px rgba(255,255,255,0.2)',
                display: 'block',
              }}
            >
              {ghostMatch[1]}
            </span>
          )
        }
        return (
          <span key={i} style={{ display: 'block' }}>
            {line}
          </span>
        )
      })}
    </h1>
  )
}

// ── ResourcesHeroRenderer ─────────────────────────────────────────────────

export function ResourcesHeroRenderer({ block }: { block: ResourcesHeroBlock }) {
  const stats = block.stats ?? []

  return (
    <div
      style={{
        padding: '72px 0 0',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 48px 64px',
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: 80,
          alignItems: 'end',
        }}
      >
        {/* Left */}
        <div>
          {block.eyebrow && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--accent)',
                border: '1px solid rgba(52,211,153,0.26)',
                background: 'rgba(52,211,153,0.08)',
                padding: '5px 14px',
                borderRadius: 99,
                marginBottom: 24,
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: 'var(--accent)',
                }}
              />
              {block.eyebrow}
            </div>
          )}

          <HeroHeading raw={block.heading ?? 'Sharper research.\\n~~Better decisions.~~\\n**Deeper edge.**'} />

          {block.subtitle && (
            <p
              style={{
                fontSize: 17,
                color: 'var(--ink-2)',
                lineHeight: 1.72,
                maxWidth: 480,
                marginTop: 22,
              }}
            >
              {block.subtitle}
            </p>
          )}
        </div>

        {/* Right: stats */}
        {stats.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: 0,
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 14,
              overflow: 'hidden',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            {stats.map((s, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  padding: '18px 20px',
                  borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 24,
                    fontWeight: 500,
                    color: 'var(--accent)',
                    letterSpacing: '-0.03em',
                    marginBottom: 3,
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-3)',
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── ResourcesHubRenderer ──────────────────────────────────────────────────
// Server component that fetches blog posts and passes to client for filtering

export async function ResourcesHubRenderer({ block }: { block: ResourcesHubBlock }) {
  const payload = await getPayload({ config: await config })
  const pageSize = block.pageSize ?? 9

  const res = await payload.find({
    collection: 'blog-posts',
    limit: pageSize + 1, // +1 for featured
    sort: '-publishedAt',
    depth: 1,
    where: { _status: { equals: 'published' } },
  })

  const allPosts = res.docs as Array<{
    id: string | number
    slug: string
    title: string
    contentType?: string
    excerpt?: string
    readTime?: number
    publishedAt?: string
    featured?: boolean
    author?: { name?: string } | null
  }>

  // Determine featured post
  let featured = block.featuredSlug
    ? allPosts.find((p) => p.slug === block.featuredSlug)
    : allPosts.find((p) => p.featured) ?? allPosts[0]

  // Grid posts = all except featured, up to pageSize
  const grid = allPosts.filter((p) => p.id !== featured?.id).slice(0, pageSize)

  // Serialize for client
  const featuredData = featured
    ? {
        id: String(featured.id),
        slug: featured.slug,
        title: featured.title,
        contentType: featured.contentType ?? 'educational',
        excerpt: featured.excerpt ?? '',
        readTime: featured.readTime ?? 10,
        publishedAt: featured.publishedAt ?? null,
        authorName: featured.author?.name ?? 'Pratyush Sharma',
      }
    : null

  const gridData = grid.map((p) => ({
    id: String(p.id),
    slug: p.slug,
    title: p.title,
    contentType: p.contentType ?? 'educational',
    excerpt: p.excerpt ?? '',
    readTime: p.readTime ?? 5,
    publishedAt: p.publishedAt ?? null,
    authorName: p.author?.name ?? 'Pratyush Sharma',
  }))

  return (
    <ResourcesHubClient
      featuredPost={featuredData}
      gridPosts={gridData}
      newsletterEyebrow={block.newsletterEyebrow}
      newsletterHeading={block.newsletterHeading}
      newsletterBody={block.newsletterBody}
    />
  )
}
