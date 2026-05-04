import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { ReadingProgress } from './ReadingProgress'
import { ArticleSidebar } from './ArticleSidebar'

export const dynamic = 'force-dynamic'

type Params = { slug: string }

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: await config })
  const res = await payload.find({
    collection: 'blog-posts',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  const post = res.docs[0]
  if (!post) return {}
  return {
    title: `${post.title} — Transcript IQ`,
    description: post.excerpt ?? '',
    openGraph: {
      title: post.title,
      description: post.excerpt ?? '',
      type: 'article',
    },
  }
}

export default async function ResourceArticlePage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const payload = await getPayload({ config: await config })

  const res = await payload.find({
    collection: 'blog-posts',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  const post = res.docs[0] as {
    id: string | number
    title: string
    slug: string
    contentType?: string
    excerpt?: string
    readTime?: number
    publishedAt?: string
    featured?: boolean
    body?: unknown
    author?: { name?: string; role?: string } | null
  } | undefined

  if (!post) notFound()

  // Fetch related articles (same category, excluding current)
  const relatedRes = await payload.find({
    collection: 'blog-posts',
    where: {
      _status: { equals: 'published' },
      slug: { not_equals: slug },
      contentType: { equals: post.contentType ?? 'educational' },
    },
    limit: 3,
    depth: 1,
  })
  const related = relatedRes.docs as Array<{
    id: string | number
    slug: string
    title: string
    contentType?: string
  }>

  // Fetch next article (next in publish order)
  const nextRes = await payload.find({
    collection: 'blog-posts',
    where: {
      _status: { equals: 'published' },
      slug: { not_equals: slug },
    },
    sort: '-publishedAt',
    limit: 1,
    depth: 1,
  })
  const nextPost = nextRes.docs[0] as {
    id: string | number
    slug: string
    title: string
    contentType?: string
    excerpt?: string
    readTime?: number
  } | undefined

  const catLabel = categoryLabel(post.contentType ?? 'educational')
  const authorName = post.author?.name ?? 'Pratyush Sharma'
  const authorRole = post.author?.role ?? 'AVP Marketing · Nextyn Advisory'
  const publishedAt = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  // Extract h2 headings from body for TOC
  const headings = extractBodyHeadings(post.body)

  return (
    <>
      {/* Reading progress bar */}
      <ReadingProgress />

      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 500,
            height: 500,
            borderRadius: '50%',
            filter: 'blur(96px)',
            background: 'radial-gradient(circle,rgba(52,211,153,0.13) 0%,transparent 68%)',
            top: -200,
            right: -80,
          }}
        />
      </div>

      {/* Article header */}
      <div
        style={{
          padding: '64px 0 0',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            maxWidth: 760,
            margin: '0 auto',
            padding: '0 48px 52px',
          }}
        >
          {/* Breadcrumb */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(68,68,64,1)',
              marginBottom: 28,
            }}
          >
            <Link href="/" style={{ color: 'rgba(68,68,64,1)', textDecoration: 'none' }}>
              Home
            </Link>
            <span style={{ color: 'rgba(37,37,40,1)' }}>›</span>
            <Link href="/resources" style={{ color: 'rgba(68,68,64,1)', textDecoration: 'none' }}>
              Resources
            </Link>
            <span style={{ color: 'rgba(37,37,40,1)' }}>›</span>
            <span>{catLabel}</span>
          </div>

          {/* Category badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              background: 'rgba(52,211,153,0.08)',
              border: '1px solid rgba(52,211,153,0.26)',
              padding: '3px 10px',
              borderRadius: 99,
              marginBottom: 18,
            }}
          >
            {catLabel}
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: 'clamp(30px, 4vw, 52px)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: 1.04,
              marginBottom: 20,
            }}
          >
            {post.title}
          </h1>

          {/* Subtitle */}
          {post.excerpt && (
            <p
              style={{
                fontSize: 18,
                color: 'var(--ink-2)',
                lineHeight: 1.65,
                marginBottom: 32,
                fontWeight: 400,
              }}
            >
              {post.excerpt}
            </p>
          )}

          {/* Author meta */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              padding: '20px 0',
              borderTop: '1px solid rgba(255,255,255,0.07)',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg,#10B981,#34D399)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  fontWeight: 600,
                  color: '#064E3B',
                  flexShrink: 0,
                }}
              >
                PS
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{authorName}</div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    letterSpacing: '0.08em',
                    color: 'var(--ink-3)',
                  }}
                >
                  {authorRole}
                </div>
              </div>
            </div>
            <div
              style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.07)' }}
            />
            {publishedAt && (
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.08em',
                  color: 'var(--ink-3)',
                }}
              >
                {publishedAt}
              </div>
            )}
            {post.readTime && (
              <>
                <div
                  style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.07)' }}
                />
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    letterSpacing: '0.08em',
                    color: 'var(--ink-3)',
                  }}
                >
                  {post.readTime} min read
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Article layout: body + sidebar */}
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 48px 96px',
          display: 'grid',
          gridTemplateColumns: '1fr 280px',
          gap: 64,
          alignItems: 'start',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Article body */}
        <article style={{ paddingTop: 48 }}>
          <ArticleBody body={post.body} />

          {/* Article footer */}
          <div
            style={{
              borderTop: '1px solid rgba(255,255,255,0.07)',
              paddingTop: 40,
              marginTop: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 20,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['Expert Networks', 'Primary Research', 'MNPI Compliance', 'Institutional Research'].map(
                (tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9,
                      letterSpacing: '0.06em',
                      color: 'var(--ink-3)',
                      background: 'var(--s2)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      padding: '3px 9px',
                      borderRadius: 4,
                    }}
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <ArticleSidebar headings={headings} related={related} />
      </div>

      {/* Next article */}
      {nextPost && (
        <div
          style={{
            background: 'var(--s1)',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            padding: 48,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--ink-3)',
                marginBottom: 16,
                display: 'block',
              }}
            >
              Next Article
            </span>
            <Link
              href={`/resources/${nextPost.slug}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 0,
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14,
                overflow: 'hidden',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all 0.2s',
              }}
            >
              <div
                style={{
                  padding: '28px 32px',
                  borderRight: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--accent)',
                    marginBottom: 8,
                  }}
                >
                  {categoryLabel(nextPost.contentType ?? 'educational')}
                  {nextPost.readTime ? ` · ${nextPost.readTime} min read` : ''}
                </div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.25,
                    marginBottom: 8,
                  }}
                >
                  {nextPost.title}
                </div>
                {nextPost.excerpt && (
                  <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6 }}>
                    {nextPost.excerpt}
                  </div>
                )}
              </div>
              <div
                style={{
                  padding: '28px 32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: 8,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--accent)',
                }}
              >
                Read next →
              </div>
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────

const CATEGORY_MAP: Record<string, string> = {
  educational: 'Educational',
  'industry-deep-dive': 'Industry Deep-Dive',
  'use-case': 'Use Case',
  'thought-leadership': 'Thought Leadership',
  whitepaper: 'Whitepaper',
  'case-study': 'Case Study',
  pillar: 'Pillar',
}

function categoryLabel(value: string) {
  return CATEGORY_MAP[value] ?? value
}

// Extract h2 headings from Lexical body for TOC
function extractBodyHeadings(
  body: unknown,
): Array<{ id: string; text: string }> {
  if (!body || typeof body !== 'object') return []
  const root = (body as { root?: { children?: unknown[] } }).root
  if (!root?.children) return []

  const headings: Array<{ id: string; text: string }> = []
  for (const node of root.children) {
    if (
      typeof node === 'object' &&
      node !== null &&
      (node as { type?: string }).type === 'heading' &&
      (node as { tag?: string }).tag === 'h2'
    ) {
      const children = (node as { children?: Array<{ text?: string }> }).children ?? []
      const text = children.map((c) => c.text ?? '').join('')
      if (text) {
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
        headings.push({ id, text })
      }
    }
  }
  return headings
}

// ── ArticleBody ───────────────────────────────────────────────────────────
// Renders Lexical JSON body as styled HTML-like React elements

function ArticleBody({ body }: { body: unknown }) {
  if (!body || typeof body !== 'object') {
    return (
      <p style={{ fontSize: 16, color: 'var(--ink-2)', lineHeight: 1.78 }}>
        Article content coming soon.
      </p>
    )
  }

  const root = (body as { root?: { children?: unknown[] } }).root
  if (!root?.children) return null

  return (
    <div>
      {root.children.map((node, i) => (
        <LexicalNode key={i} node={node} />
      ))}
    </div>
  )
}

function LexicalNode({ node }: { node: unknown }) {
  if (!node || typeof node !== 'object') return null
  const n = node as {
    type?: string
    tag?: string
    children?: unknown[]
    text?: string
    format?: number
    url?: string
    value?: { root?: { children?: unknown[] } }
    fields?: Record<string, unknown>
  }

  if (n.type === 'heading') {
    const text = renderChildren(n.children)
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')

    if (n.tag === 'h2') {
      return (
        <h2
          id={id}
          style={{
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: '-0.025em',
            lineHeight: 1.2,
            margin: '40px 0 16px',
            paddingTop: 8,
            color: 'var(--ink)',
          }}
        >
          <InlineChildren children={n.children} />
        </h2>
      )
    }
    if (n.tag === 'h3') {
      return (
        <h3
          style={{
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: '-0.02em',
            lineHeight: 1.25,
            margin: '32px 0 12px',
            color: 'var(--ink)',
          }}
        >
          <InlineChildren children={n.children} />
        </h3>
      )
    }
  }

  if (n.type === 'paragraph') {
    const children = n.children ?? []
    if (children.length === 0) return null
    return (
      <p style={{ fontSize: 16, color: 'var(--ink-2)', lineHeight: 1.78, marginBottom: 20 }}>
        <InlineChildren children={children} />
      </p>
    )
  }

  if (n.type === 'list') {
    const items = n.children ?? []
    if (n.tag === 'ol') {
      return (
        <ol style={{ paddingLeft: 0, marginBottom: 20, listStyle: 'none', counterReset: 'li' }}>
          {items.map((item, i) => (
            <li
              key={i}
              style={{
                fontSize: 16,
                color: 'var(--ink-2)',
                lineHeight: 1.72,
                marginBottom: 10,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
              }}
            >
              <span
                style={{
                  color: 'var(--accent)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  fontWeight: 500,
                  marginTop: 3,
                  minWidth: 16,
                  flexShrink: 0,
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>
                <InlineChildren children={(item as { children?: unknown[] }).children} />
              </span>
            </li>
          ))}
        </ol>
      )
    }
    return (
      <ul style={{ paddingLeft: 0, marginBottom: 20, listStyle: 'none' }}>
        {items.map((item, i) => (
          <li
            key={i}
            style={{
              fontSize: 16,
              color: 'var(--ink-2)',
              lineHeight: 1.72,
              marginBottom: 10,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: 'var(--accent)',
                flexShrink: 0,
                marginTop: 9,
              }}
            />
            <span>
              <InlineChildren children={(item as { children?: unknown[] }).children} />
            </span>
          </li>
        ))}
      </ul>
    )
  }

  if (n.type === 'quote') {
    return (
      <blockquote
        style={{
          margin: '36px 0',
          padding: '24px 28px',
          background: 'var(--s1)',
          border: '1px solid rgba(255,255,255,0.13)',
          borderLeft: '2px solid var(--accent)',
          borderRadius: '0 12px 12px 0',
        }}
      >
        <p
          style={{
            fontSize: 18,
            fontStyle: 'italic',
            color: 'var(--ink)',
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          <InlineChildren children={n.children} />
        </p>
      </blockquote>
    )
  }

  // Fallback: skip unknown block types silently
  return null
}

function InlineChildren({ children }: { children?: unknown[] }) {
  if (!children) return null
  return (
    <>
      {children.map((child, i) => (
        <InlineNode key={i} node={child} />
      ))}
    </>
  )
}

function InlineNode({ node }: { node: unknown }) {
  if (!node || typeof node !== 'object') return null
  const n = node as {
    type?: string
    text?: string
    format?: number
    url?: string
    children?: unknown[]
  }

  if (n.type === 'text' || n.type === undefined) {
    if (!n.text) return null
    let content: React.ReactNode = n.text
    const format = n.format ?? 0
    if (format & 1) content = <strong style={{ color: 'var(--ink)', fontWeight: 500 }}>{content}</strong>
    if (format & 2) content = <em>{content}</em>
    if (format & 8) content = <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875em', color: 'var(--accent)' }}>{content}</code>
    return <>{content}</>
  }

  if (n.type === 'link') {
    return (
      <a
        href={n.url ?? '#'}
        style={{
          color: 'var(--accent)',
          textDecoration: 'none',
          borderBottom: '1px solid rgba(52,211,153,0.26)',
        }}
      >
        <InlineChildren children={n.children} />
      </a>
    )
  }

  if (n.type === 'linebreak') return <br />

  return null
}

function renderChildren(children?: unknown[]): string {
  if (!children) return ''
  return children
    .map((c) => {
      if (typeof c === 'object' && c !== null && 'text' in c) {
        return (c as { text?: string }).text ?? ''
      }
      return ''
    })
    .join('')
}
