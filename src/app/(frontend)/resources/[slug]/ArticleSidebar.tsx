'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BlogLeadForm, type BlogLeadFormConfig } from './BlogLeadForm'

type Heading = { id: string; text: string }
type RelatedPost = {
  id: string | number
  slug: string
  title: string
  contentType?: string
}

const CATEGORY_MAP: Record<string, string> = {
  educational: 'Educational',
  'industry-deep-dive': 'Industry Deep-Dive',
  'use-case': 'Use Case',
  'thought-leadership': 'Thought Leadership',
  whitepaper: 'Whitepaper',
  'case-study': 'Case Study',
  pillar: 'Pillar',
}

function catLabel(v: string) {
  return CATEGORY_MAP[v] ?? v
}

export function ArticleSidebar({
  headings,
  related,
  leadForm,
  blogSlug,
  blogTitle,
}: {
  headings: Heading[]
  related: RelatedPost[]
  leadForm?: BlogLeadFormConfig | null
  blogSlug: string
  blogTitle: string
}) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null)
  const formEnabled = Boolean(leadForm?.enabled)

  useEffect(() => {
    if (headings.length === 0) return
    const observers: IntersectionObserver[] = []

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveId(id)
          })
        },
        { rootMargin: '0px 0px -60% 0px', threshold: 0 },
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [headings])

  return (
    <aside style={{ position: 'sticky', top: 88, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Lead form (per-post, controlled in Payload) */}
      {formEnabled && leadForm && (
        <BlogLeadForm config={leadForm} blogSlug={blogSlug} blogTitle={blogTitle} />
      )}

      {/* TOC */}
      {headings.length > 0 && (
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: 20,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: 9,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--mist)',
              marginBottom: 14,
              display: 'block',
            }}
          >
            In this article
          </span>
          {headings.map((h, i) => {
            const active = activeId === h.id
            return (
              <a
                key={h.id}
                href={`#${h.id}`}
                style={{
                  display: 'flex',
                  gap: 10,
                  padding: '7px 0',
                  borderBottom: i < headings.length - 1 ? '1px solid var(--border)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  textDecoration: 'none',
                  alignItems: 'flex-start',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-geist-mono)',
                    fontSize: 9,
                    color: active ? 'var(--accent)' : 'var(--mist)',
                    minWidth: 20,
                    paddingTop: 1,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: active ? 'var(--ink-2)' : 'var(--mist)',
                    lineHeight: 1.4,
                    transition: 'color 0.15s',
                  }}
                >
                  {h.text}
                </span>
              </a>
            )
          })}
        </div>
      )}

      {/* Static "free to claim" CTA — only when the per-post lead form isn't enabled */}
      {!formEnabled && (
        <div
          style={{
            background: 'linear-gradient(145deg,var(--accent-tint-2),var(--surface))',
            border: '1px solid var(--accent-border)',
            borderRadius: 16,
            padding: 20,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background: 'linear-gradient(90deg,transparent,var(--accent),transparent)',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: 9,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--accent-deep)',
              marginBottom: 10,
              display: 'block',
            }}
          >
            Free to claim
          </span>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: '-0.015em',
              lineHeight: 1.3,
              marginBottom: 8,
            }}
          >
            Get your first transcript free
          </div>
          <p
            style={{
              fontSize: 12,
              color: 'var(--slate)',
              lineHeight: 1.6,
              marginBottom: 14,
            }}
          >
            Choose your sector, enter your work email. Full PDF delivered within 24 hours. No credit card.
          </p>
          <Link
            href="/free-transcript"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 7,
              background: 'var(--accent)',
              color: '#fff',
              fontFamily: 'var(--font-geist)',
              fontSize: 13,
              fontWeight: 600,
              padding: '10px 16px',
              borderRadius: 9,
              textDecoration: 'none',
              boxShadow: '0 8px 24px -8px rgba(16,185,129,0.38)',
            }}
          >
            <svg
              width={12}
              height={12}
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 6h8M6.5 2.5l4 3.5-4 3.5" />
            </svg>
            Claim Free Transcript
          </Link>
        </div>
      )}

      {/* Related articles */}
      {related.length > 0 && (
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '14px 16px',
              borderBottom: '1px solid var(--border)',
              fontFamily: 'var(--font-geist-mono)',
              fontSize: 9,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--mist)',
            }}
          >
            Related articles
          </div>
          {related.map((r, i) => (
            <Link
              key={r.id}
              href={`/resources/${r.slug}`}
              style={{
                padding: '12px 16px',
                borderBottom: i < related.length - 1 ? '1px solid var(--border)' : 'none',
                textDecoration: 'none',
                display: 'block',
                transition: 'background 0.15s',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-geist-mono)',
                  fontSize: 8,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--accent)',
                  marginBottom: 5,
                }}
              >
                {catLabel(r.contentType ?? 'educational')}
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: '-0.01em',
                  color: 'var(--ink-2)',
                  lineHeight: 1.35,
                }}
              >
                {r.title}
              </div>
            </Link>
          ))}
        </div>
      )}
    </aside>
  )
}
