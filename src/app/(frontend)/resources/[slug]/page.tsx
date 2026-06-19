import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getBlogPostBySlug, getRelatedBlogPosts, getNextBlogPost } from '@/lib/cache/queries'
import { ReadingProgress } from './ReadingProgress'
import { ArticleSidebar } from './ArticleSidebar'
import type { BlogLeadFormConfig } from './BlogLeadForm'
import { blogPostingSchema, breadcrumbSchema, faqPageSchema, JsonLd } from '@/lib/seo/jsonld'
import { canonical, truncate } from '@/lib/seo/metadata'
import { ARTICLE_FAQS } from '@/lib/seo/faq-data'
import { ARTICLE_CLOSING } from '@/lib/seo/article-closing'
import { FaqAccordion } from '@/components/seo/FaqAccordion'

export const revalidate = 86400

type Params = { slug: string }

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return { title: 'Article Not Found', robots: { index: false } }

  // Prefer the per-post SEO fields (Payload SEO plugin's `meta` group) when set,
  // falling back to the post title / excerpt. `meta.title` is emitted as an
  // absolute <title> (no " | Transcript IQ" suffix) so a hand-tuned ≤60-char
  // title isn't pushed over length by the global template.
  const seo = (post as { meta?: { title?: string | null; description?: string | null } }).meta
  const metaTitle = seo?.title?.trim() || undefined
  const metaDescription = seo?.description?.trim() || truncate(post.excerpt, 155) || undefined

  return {
    title: metaTitle ? { absolute: metaTitle } : post.title,
    description: metaDescription,
    alternates: { canonical: canonical(`/resources/${slug}`) },
    openGraph: {
      title: metaTitle ?? post.title,
      description: metaDescription,
      url: canonical(`/resources/${slug}`),
      type: 'article',
      publishedTime: post.publishedAt ?? undefined,
      authors: (typeof post.author === 'object' && post.author?.name) ? [post.author.name] : ['Pratyush Sharma'],
    },
  }
}

export default async function ResourceArticlePage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params

  // CALL 1: main post (via cached helper)
  const postDoc = await getBlogPostBySlug(slug)
  if (!postDoc) notFound()
  const post = postDoc as unknown as {
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
    coverImage?: { url?: string; alt?: string } | null
    leadForm?: BlogLeadFormConfig | null
  }

  // CALL 2: related articles (via cached helper)
  const relatedDocs = await getRelatedBlogPosts(slug, post.contentType ?? 'educational')
  const related = relatedDocs as unknown as Array<{ id: string | number; slug: string; title: string; contentType?: string }>

  // CALL 3: next article (via cached helper)
  const nextDoc = await getNextBlogPost(slug)
  const nextPost = (nextDoc ?? undefined) as { id: string | number; slug: string; title: string; contentType?: string; excerpt?: string; readTime?: number } | undefined

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

  const coverUrl =
    post.coverImage && typeof post.coverImage === 'object' ? post.coverImage.url ?? null : null
  const coverAlt =
    (post.coverImage && typeof post.coverImage === 'object' && post.coverImage.alt) || post.title

  // Extract h2 headings from body for TOC
  const headings = extractBodyHeadings(post.body)

  const articleFaqs = ARTICLE_FAQS[slug] ?? []
  const closing = ARTICLE_CLOSING[slug]

  return (
    <>
      <JsonLd schema={blogPostingSchema(post as any)} />
      <JsonLd schema={breadcrumbSchema([
        { name: 'Home', url: 'https://transcript-iq.com' },
        { name: 'Resources', url: 'https://transcript-iq.com/resources' },
        { name: post.title, url: `https://transcript-iq.com/resources/${slug}` },
      ])} />
      {articleFaqs.length > 0 && <JsonLd schema={faqPageSchema(articleFaqs)} />}

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
            background: 'radial-gradient(circle,var(--accent-tint-2) 0%,transparent 68%)',
            top: -200,
            right: -80,
          }}
        />
      </div>

      {/* Widened container (was 1200 → 1500, +25%). Header + body share this frame
          and a common left edge. */}
      <div className="max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-12 relative z-[1]">
        {/* ── Article header — left-aligned, capped to the reading-column width ── */}
        <header className="pt-12 lg:pt-16 lg:max-w-[calc(100%_-_404px)]">
          {/* Breadcrumb */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'var(--font-geist-mono)',
              fontSize: 10,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--mist)',
              marginBottom: 26,
            }}
          >
            <Link href="/" style={{ color: 'var(--mist)', textDecoration: 'none' }}>
              Home
            </Link>
            <span style={{ color: 'var(--border-2)' }}>›</span>
            <Link href="/resources" style={{ color: 'var(--mist)', textDecoration: 'none' }}>
              Resources
            </Link>
            <span style={{ color: 'var(--border-2)' }}>›</span>
            <span>{catLabel}</span>
          </div>

          {/* Category badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: 'var(--font-geist-mono)',
              fontSize: 10,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--accent-deep)',
              background: 'var(--accent-tint-2)',
              border: '1px solid var(--accent-border)',
              padding: '4px 11px',
              borderRadius: 99,
              marginBottom: 20,
            }}
          >
            {catLabel}
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: 'clamp(32px, 4.2vw, 56px)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: 1.04,
              marginBottom: 20,
              maxWidth: '20ch',
            }}
          >
            {post.title}
          </h1>

          {/* Subtitle */}
          {post.excerpt && (
            <p
              style={{
                fontSize: 19,
                color: 'var(--slate)',
                lineHeight: 1.6,
                marginBottom: 32,
                fontWeight: 400,
                maxWidth: '60ch',
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
              padding: '18px 0',
              borderTop: '1px solid var(--border)',
              borderBottom: '1px solid var(--border)',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg,#10B981,#34D399)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-geist-mono)',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#04341f',
                  flexShrink: 0,
                }}
              >
                {initials(authorName)}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{authorName}</div>
                <div
                  style={{
                    fontFamily: 'var(--font-geist-mono)',
                    fontSize: 9,
                    letterSpacing: '0.06em',
                    color: 'var(--mist)',
                  }}
                >
                  {authorRole}
                </div>
              </div>
            </div>
            <div style={{ width: 1, height: 24, background: 'var(--border)' }} />
            {publishedAt && (
              <div
                style={{
                  fontFamily: 'var(--font-geist-mono)',
                  fontSize: 10,
                  letterSpacing: '0.06em',
                  color: 'var(--mist)',
                }}
              >
                {publishedAt}
              </div>
            )}
            {post.readTime && (
              <>
                <div style={{ width: 1, height: 24, background: 'var(--border)' }} />
                <div
                  style={{
                    fontFamily: 'var(--font-geist-mono)',
                    fontSize: 10,
                    letterSpacing: '0.06em',
                    color: 'var(--mist)',
                  }}
                >
                  {post.readTime} min read
                </div>
              </>
            )}
          </div>
        </header>

        {/* ── Body + sidebar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-10 lg:gap-16 items-start pt-10 lg:pt-12 pb-16 lg:pb-24">
          {/* Content column: cover image + article */}
          <div>
            {coverUrl && (
              <figure
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 9',
                  borderRadius: 16,
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-2)',
                  margin: '0 0 40px',
                }}
              >
                <Image
                  src={coverUrl}
                  alt={coverAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1000px"
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </figure>
            )}

            <article>
              <ArticleBody body={post.body} />

              {/* Article footer */}
              <div
                style={{
                  borderTop: '1px solid var(--border)',
                  paddingTop: 32,
                  marginTop: 44,
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
                          fontFamily: 'var(--font-geist-mono)',
                          fontSize: 10,
                          letterSpacing: '0.05em',
                          color: 'var(--mist)',
                          background: 'var(--surface-2)',
                          border: '1px solid var(--border)',
                          padding: '4px 10px',
                          borderRadius: 5,
                        }}
                      >
                        {tag}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <ArticleSidebar
            headings={headings}
            related={related}
            leadForm={post.leadForm ?? null}
            blogSlug={post.slug}
            blogTitle={post.title}
          />
        </div>

        {/* ── FAQ — moved ABOVE the next-article section, left-aligned to column ── */}
        {articleFaqs.length > 0 && (
          <div className={`lg:max-w-[calc(100%_-_404px)] ${closing ? '' : 'pb-16 lg:pb-24'}`}>
            <FaqAccordion faqs={articleFaqs} headingAs="h3" contained={false} />
          </div>
        )}

        {/* ── Closing block — rendered AFTER the FAQ (price + report link) ── */}
        {closing && (
          <div
            className="lg:max-w-[calc(100%_-_404px)] pb-16 lg:pb-24"
            style={{ marginTop: 40, paddingTop: 28, borderTop: '1px solid var(--border)' }}
          >
            {closing.title && (
              <p
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  letterSpacing: '-0.025em',
                  lineHeight: 1.2,
                  color: 'var(--ink)',
                  margin: '0 0 8px',
                }}
              >
                {closing.title}
              </p>
            )}
            {closing.body && (
              <p style={{ fontSize: 17, color: 'var(--ink-2)', lineHeight: 1.75, margin: '0 0 14px' }}>
                {closing.body}
              </p>
            )}
            {closing.linkLabel && closing.linkUrl && (
              <a
                href={closing.linkUrl}
                style={{
                  color: 'var(--accent-deep)',
                  fontWeight: 500,
                  textDecoration: 'none',
                  borderBottom: '1px solid var(--accent-border)',
                }}
              >
                {closing.linkLabel}
              </a>
            )}
          </div>
        )}
      </div>

      {/* ── Next article — full-bleed band, AFTER the FAQ ── */}
      {nextPost && (
        <div className="bg-[var(--surface)] border-t border-[var(--border)] px-5 py-8 sm:px-8 lg:px-12 lg:py-12 relative z-[1]">
          <div style={{ maxWidth: 1500, margin: '0 auto' }}>
            <span
              style={{
                fontFamily: 'var(--font-geist-mono)',
                fontSize: 9,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--mist)',
                marginBottom: 16,
                display: 'block',
              }}
            >
              Next Article
            </span>
            <Link
              href={`/resources/${nextPost.slug}`}
              className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-[var(--border)] rounded-[14px] overflow-hidden no-underline text-inherit transition-all duration-200 hover:border-[var(--accent-border)] max-w-[920px]"
            >
              <div className="p-7 sm:px-8 border-b border-[var(--border)] sm:border-b-0 sm:border-r">
                <div
                  style={{
                    fontFamily: 'var(--font-geist-mono)',
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
                  <div style={{ fontSize: 13, color: 'var(--slate)', lineHeight: 1.6 }}>
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
                  fontFamily: 'var(--font-geist-mono)',
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

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
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
      <p style={{ fontSize: 17, color: 'var(--ink-2)', lineHeight: 1.78 }}>
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

// In-body CTA banner — renders the `blogCta` Lexical block (see blocks/BlogCta.ts).
// Button design is intentionally identical to the sidebar lead-form button.
function BlogCtaBanner({
  eyebrow,
  heading,
  subline,
  buttonLabel,
  buttonUrl,
}: {
  eyebrow?: string
  heading?: string
  subline?: string
  buttonLabel?: string
  buttonUrl?: string
}) {
  if (!heading && !buttonLabel) return null
  const url = buttonUrl || '/free-transcript'
  const isExternal = /^https?:\/\//i.test(url)
  const btnClass =
    'inline-flex items-center justify-center gap-2 rounded-[9px] bg-[var(--accent)] px-5 py-3 text-[14px] font-semibold text-white shadow-cta transition-all duration-150 hover:-translate-y-px hover:bg-[var(--accent-bright)]'
  const arrow = (
    <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2.5 7h9M7.5 3l4 4-4 4" />
    </svg>
  )
  return (
    <div
      style={{
        position: 'relative',
        margin: '44px 0',
        padding: '36px 38px',
        borderRadius: 18,
        background: 'linear-gradient(150deg, var(--accent-tint-2), var(--surface) 60%)',
        border: '1px solid var(--accent-border)',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: 2,
          background: 'linear-gradient(90deg,transparent,var(--accent),transparent)',
        }}
      />
      {eyebrow && (
        <span
          style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: 10,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--accent-deep)',
            display: 'block',
            marginBottom: 12,
          }}
        >
          {eyebrow}
        </span>
      )}
      {heading && (
        <h3
          style={{
            fontSize: 25,
            fontWeight: 600,
            letterSpacing: '-0.03em',
            lineHeight: 1.18,
            margin: '0 0 12px',
            color: 'var(--ink)',
            maxWidth: '24ch',
          }}
        >
          {heading}
        </h3>
      )}
      {subline && (
        <p style={{ fontSize: 16, color: 'var(--slate)', lineHeight: 1.6, margin: '0 0 24px', maxWidth: '56ch' }}>
          {subline}
        </p>
      )}
      {buttonLabel &&
        (isExternal ? (
          <a href={url} className={btnClass} target="_blank" rel="noopener noreferrer">
            {buttonLabel}
            {arrow}
          </a>
        ) : (
          <Link href={url} className={btnClass}>
            {buttonLabel}
            {arrow}
          </Link>
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

  // Inline rich-text block (e.g. the CTA banner)
  if (n.type === 'block') {
    const fields = (n.fields ?? {}) as {
      blockType?: string
      eyebrow?: string
      heading?: string
      subline?: string
      buttonLabel?: string
      buttonUrl?: string
    }
    if (fields.blockType === 'blogCta') {
      return (
        <BlogCtaBanner
          eyebrow={fields.eyebrow}
          heading={fields.heading}
          subline={fields.subline}
          buttonLabel={fields.buttonLabel}
          buttonUrl={fields.buttonUrl}
        />
      )
    }
    return null
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
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: '-0.025em',
            lineHeight: 1.2,
            margin: '46px 0 18px',
            paddingTop: 8,
            scrollMarginTop: 90,
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
            fontSize: 21,
            fontWeight: 600,
            letterSpacing: '-0.02em',
            lineHeight: 1.25,
            margin: '34px 0 12px',
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
      <p style={{ fontSize: 17, color: 'var(--ink-2)', lineHeight: 1.78, marginBottom: 22 }}>
        <InlineChildren children={children} />
      </p>
    )
  }

  if (n.type === 'list') {
    const items = n.children ?? []
    if (n.tag === 'ol') {
      return (
        <ol style={{ paddingLeft: 0, marginBottom: 22, listStyle: 'none', counterReset: 'li' }}>
          {items.map((item, i) => (
            <li
              key={i}
              style={{
                fontSize: 17,
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
                  fontFamily: 'var(--font-geist-mono)',
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
      <ul style={{ paddingLeft: 0, marginBottom: 22, listStyle: 'none' }}>
        {items.map((item, i) => (
          <li
            key={i}
            style={{
              fontSize: 17,
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
          background: 'var(--surface-2)',
          border: '1px solid var(--border-2)',
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
    if (format & 1) content = <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>{content}</strong>
    if (format & 2) content = <em>{content}</em>
    if (format & 8) content = <code style={{ fontFamily: 'var(--font-geist-mono)', fontSize: '0.875em', color: 'var(--accent)' }}>{content}</code>
    return <>{content}</>
  }

  if (n.type === 'link') {
    return (
      <a
        href={n.url ?? '#'}
        style={{
          color: 'var(--accent)',
          textDecoration: 'none',
          borderBottom: '1px solid var(--accent-border)',
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
