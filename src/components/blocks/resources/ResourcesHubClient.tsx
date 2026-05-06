'use client'

import React, { useState } from 'react'
import Link from 'next/link'

type PostData = {
  id: string
  slug: string
  title: string
  contentType: string
  excerpt: string
  readTime: number
  publishedAt: string | null
  authorName: string
}

type Props = {
  featuredPost: PostData | null
  gridPosts: PostData[]
  newsletterEyebrow?: string
  newsletterHeading?: string
  newsletterBody?: string
}

const CATEGORIES = [
  { label: 'All', value: 'all' },
  { label: 'Educational', value: 'educational' },
  { label: 'Use Case', value: 'use-case' },
  { label: 'Thought Leadership', value: 'thought-leadership' },
  { label: 'Industry Deep-Dive', value: 'industry-deep-dive' },
  { label: 'Whitepaper', value: 'whitepaper' },
  { label: 'Case Study', value: 'case-study' },
]

function categoryLabel(value: string) {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value
}

function formatDate(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function ResourcesHubClient({
  featuredPost,
  gridPosts,
  newsletterEyebrow,
  newsletterHeading,
  newsletterBody,
}: Props) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const filtered = activeCategory === 'all'
    ? gridPosts
    : gridPosts.filter((p) => p.contentType === activeCategory)

  return (
    <>
      {/* ── Category filter bar ── */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.07)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          position: 'sticky',
          top: 64,
          zIndex: 90,
          background: 'rgba(9,9,11,0.9)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 48px',
            display: 'flex',
            alignItems: 'center',
            gap: 0,
            overflowX: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: activeCategory === cat.value ? 'var(--accent)' : 'var(--ink-3)',
                padding: '14px 20px',
                border: 'none',
                borderBottom: activeCategory === cat.value
                  ? '1.5px solid var(--accent)'
                  : '1.5px solid transparent',
                background: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main content ── */}
      <main
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '48px 48px 96px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Featured article */}
        {featuredPost && (activeCategory === 'all' || featuredPost.contentType === activeCategory) && (
          <div style={{ marginBottom: 64 }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--ink-3)',
                marginBottom: 20,
                display: 'block',
              }}
            >
              Featured Article
            </span>
            <Link
              href={`/resources/${featuredPost.slug}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                border: '1px solid rgba(255,255,255,0.13)',
                borderRadius: 18,
                overflow: 'hidden',
                background: 'var(--s1)',
                transition: 'all 0.2s',
                cursor: 'pointer',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              {/* Visual left */}
              <div
                style={{
                  background: 'linear-gradient(145deg,rgba(52,211,153,0.12) 0%,var(--s2) 60%)',
                  padding: 40,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRight: '1px solid rgba(255,255,255,0.07)',
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
                    background: 'linear-gradient(90deg,transparent,rgba(52,211,153,0.4),transparent)',
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--accent)',
                  }}
                >
                  {categoryLabel(featuredPost.contentType)} · Explainer
                </span>
                {/* Doc mockup */}
                <div
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 10,
                    padding: 16,
                    marginTop: 24,
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 8,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--accent)',
                      marginBottom: 8,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        background: 'var(--accent)',
                      }}
                    />
                    Expert Call Transcript
                  </div>
                  {[55, 85, 70, 90, 65].map((w, i) => (
                    <div
                      key={i}
                      style={{
                        height: 7,
                        background: i === 0 ? 'rgba(52,211,153,0.18)' : 'rgba(37,37,40,1)',
                        borderRadius: 3,
                        marginBottom: 5,
                        width: `${w}%`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Content right */}
              <div style={{ padding: 40 }}>
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
                  {categoryLabel(featuredPost.contentType)}
                </div>
                <h2
                  style={{
                    fontSize: 'clamp(20px, 2.5vw, 30px)',
                    fontWeight: 600,
                    letterSpacing: '-0.025em',
                    lineHeight: 1.2,
                    marginBottom: 14,
                  }}
                >
                  {featuredPost.title}
                </h2>
                <p
                  style={{
                    fontSize: 15,
                    color: 'var(--ink-2)',
                    lineHeight: 1.7,
                    marginBottom: 24,
                  }}
                >
                  {featuredPost.excerpt}
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 13,
                      color: 'var(--ink-2)',
                    }}
                  >
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg,#10B981,#34D399)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 8,
                        fontWeight: 600,
                        color: '#064E3B',
                        flexShrink: 0,
                      }}
                    >
                      PS
                    </div>
                    {featuredPost.authorName}
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      letterSpacing: '0.08em',
                      color: 'var(--ink-3)',
                      marginLeft: 'auto',
                    }}
                  >
                    {featuredPost.readTime} min read
                    {featuredPost.publishedAt && ` · ${formatDate(featuredPost.publishedAt)}`}
                  </span>
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--accent)',
                    marginTop: 20,
                    borderBottom: '1px solid rgba(52,211,153,0.26)',
                    paddingBottom: 1,
                  }}
                >
                  Read article →
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Articles grid */}
        <div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--ink-3)',
              marginBottom: 20,
              display: 'block',
            }}
          >
            All Articles
          </span>
          <div
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
            {/* Placeholder "coming soon" card */}
            <div
              style={{
                background: 'var(--s1)',
                border: '1px dashed rgba(255,255,255,0.07)',
                borderRadius: 16,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                opacity: 0.5,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  minHeight: 200,
                  gap: 12,
                  padding: '22px 22px 16px',
                  flex: 1,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: 'rgba(52,211,153,0.08)',
                    border: '1px solid rgba(52,211,153,0.26)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg
                    width={18}
                    height={18}
                    viewBox="0 0 18 18"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth={1.4}
                    strokeLinecap="round"
                  >
                    <path d="M9 3v12M3 9h12" />
                  </svg>
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-3)' }}>
                  More articles coming soon
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'rgba(68,68,64,1)',
                  }}
                >
                  Subscribe for updates →
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.07)',
            background: 'var(--s1)',
            marginTop: 64,
            borderRadius: 18,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background:
                'linear-gradient(90deg,transparent 8%,rgba(52,211,153,0.4) 50%,transparent 92%)',
            }}
          />
          <div
            style={{
              padding: 52,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 60,
              alignItems: 'center',
            }}
          >
            <div>
              {newsletterEyebrow && (
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'var(--accent)',
                    marginBottom: 14,
                    display: 'block',
                  }}
                >
                  {newsletterEyebrow}
                </span>
              )}
              {newsletterHeading && (
                <h2
                  style={{
                    fontSize: 'clamp(22px, 2.5vw, 34px)',
                    fontWeight: 600,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.1,
                    marginBottom: 10,
                  }}
                >
                  {newsletterHeading}
                </h2>
              )}
              {newsletterBody && (
                <p style={{ fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.65 }}>
                  {newsletterBody}
                </p>
              )}
            </div>
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-3)',
                    marginBottom: 8,
                  }}
                >
                  Work email
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {subscribed ? (
                    <div
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        color: 'var(--accent)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 13,
                      }}
                    >
                      <svg
                        width={14}
                        height={14}
                        viewBox="0 0 14 14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path d="M2 7l4 4 6-6" strokeLinecap="round" />
                      </svg>
                      Subscribed — watch your inbox
                    </div>
                  ) : (
                    <>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@fund.com"
                        style={{
                          flex: 1,
                          background: 'rgba(0,0,0,0.32)',
                          border: '1px solid rgba(255,255,255,0.07)',
                          borderRadius: 9,
                          padding: '12px 14px',
                          fontFamily: 'var(--font-sans)',
                          fontSize: 14,
                          color: 'var(--ink)',
                          outline: 'none',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(52,211,153,0.42)'
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                        }}
                      />
                      <button
                        onClick={() => email.includes('@') && setSubscribed(true)}
                        style={{
                          background: 'var(--accent)',
                          color: '#050A07',
                          fontFamily: 'var(--font-sans)',
                          fontSize: 14,
                          fontWeight: 600,
                          padding: '12px 22px',
                          borderRadius: 9,
                          border: 'none',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          boxShadow:
                            '0 0 0 1px rgba(52,211,153,0.26), 0 6px 20px -6px rgba(52,211,153,0.28)',
                        }}
                      >
                        Subscribe
                      </button>
                    </>
                  )}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'rgba(68,68,64,1)',
                  }}
                >
                  No spam · Unsubscribe any time · Sent from the Nextyn research desk
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

// ── Article card ──────────────────────────────────────────────────────────

function ArticleCard({ post }: { post: PostData }) {
  const catLabel =
    CATEGORIES.find((c) => c.value === post.contentType)?.label ?? post.contentType

  return (
    <Link
      href={`/resources/${post.slug}`}
      style={{
        background: 'var(--s1)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16,
        overflow: 'hidden',
        transition: 'all 0.2s',
        textDecoration: 'none',
        color: 'inherit',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ padding: '22px 22px 16px', flex: 1 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              background: 'rgba(52,211,153,0.08)',
              border: '1px solid rgba(52,211,153,0.26)',
              padding: '2px 9px',
              borderRadius: 99,
            }}
          >
            {catLabel}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              letterSpacing: '0.08em',
              color: 'var(--ink-3)',
            }}
          >
            {post.readTime} min read
          </span>
        </div>
        <h3
          style={{
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: '-0.02em',
            lineHeight: 1.3,
            marginBottom: 10,
          }}
        >
          {post.title}
        </h3>
        <p
          style={{
            fontSize: 13,
            color: 'var(--ink-2)',
            lineHeight: 1.65,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {post.excerpt}
        </p>
      </div>
      <div
        style={{
          padding: '14px 22px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            fontSize: 12,
            color: 'var(--ink-2)',
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: 'linear-gradient(135deg,#10B981,#34D399)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: 7,
              fontWeight: 600,
              color: '#064E3B',
              flexShrink: 0,
            }}
          >
            PS
          </div>
          {post.authorName}
        </div>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            letterSpacing: '0.1em',
            color: 'var(--accent)',
          }}
        >
          Read →
        </span>
      </div>
    </Link>
  )
}
