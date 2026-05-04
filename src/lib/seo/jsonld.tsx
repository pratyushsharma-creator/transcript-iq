// src/lib/seo/jsonld.tsx
// All builder functions wrap their output with @context automatically.
// Inject output as: <script type="application/ld+json">{JSON.stringify(schema)}</script>

const BASE_URL = 'https://transcript-iq.com'
const LOGO_URL = `${BASE_URL}/logo.png`
const ORG_NAME = 'Transcript IQ'

// ── Types ────────────────────────────────────────────────────────────────────

export type BreadcrumbItem = { name: string; url: string }

export type FaqItem = { question: string; answer: string }

export type HowToStepItem = {
  name: string
  text: string
  position: number
}

// ── Organization ─────────────────────────────────────────────────────────────

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORG_NAME,
    url: BASE_URL,
    logo: LOGO_URL,
    description:
      'The first retail marketplace for institutional-grade, MNPI-screened expert call transcripts.',
    foundingDate: '2024',
    areaServed: 'Worldwide',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'support@transcript-iq.com',
    },
  }
}

// ── WebSite + SearchAction ───────────────────────────────────────────────────

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: ORG_NAME,
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/expert-transcripts?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

// ── Product (transcript) ─────────────────────────────────────────────────────

export function productSchema(transcript: {
  title: string
  summary?: string | null
  slug: string
  tier?: string | null
  priceUsd?: number | null
  sectors?: Array<{ title?: string; name?: string }> | null
}) {
  const sectorName =
    transcript.sectors?.[0]?.title ?? transcript.sectors?.[0]?.name ?? ''
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: transcript.title,
    description: transcript.summary ?? undefined,
    brand: { '@type': 'Brand', name: ORG_NAME },
    category: sectorName || undefined,
    offers: {
      '@type': 'Offer',
      price: transcript.priceUsd ?? 349,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${BASE_URL}/expert-transcripts/${transcript.slug}`,
      seller: { '@type': 'Organization', name: ORG_NAME },
    },
  }
}

// ── BlogPosting ──────────────────────────────────────────────────────────────

export function blogPostingSchema(post: {
  title: string
  slug: string
  excerpt?: string | null
  publishedAt?: string | null
  updatedAt?: string | null
  author?: { name?: string } | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt ?? undefined,
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt ?? post.publishedAt ?? undefined,
    author: {
      '@type': 'Person',
      name: post.author?.name ?? 'Pratyush Sharma',
      jobTitle: 'AVP Marketing, Nextyn Advisory',
      url: `${BASE_URL}/resources`,
    },
    publisher: {
      '@type': 'Organization',
      name: ORG_NAME,
      logo: { '@type': 'ImageObject', url: LOGO_URL },
    },
    mainEntityOfPage: `${BASE_URL}/resources/${post.slug}`,
    image: `${BASE_URL}/resources/${post.slug}/opengraph-image`,
  }
}

// ── BreadcrumbList ───────────────────────────────────────────────────────────

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// ── FAQPage ──────────────────────────────────────────────────────────────────

export function faqPageSchema(faqs: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// ── HowTo ────────────────────────────────────────────────────────────────────

/**
 * @param opts.totalTime ISO 8601 duration string, e.g. "PT30M" for 30 minutes
 */
export function howToSchema(opts: {
  name: string
  description: string
  totalTime: string
  steps: HowToStepItem[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: opts.name,
    description: opts.description,
    totalTime: opts.totalTime,
    step: opts.steps.map((s) => ({
      '@type': 'HowToStep',
      position: s.position,
      name: s.name,
      text: s.text,
    })),
  }
}

// ── ItemList ─────────────────────────────────────────────────────────────────

export function itemListSchema(
  items: Array<{ name: string; url: string; position: number }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      url: item.url,
    })),
  }
}

// ── Helper: inject as script tag (use in JSX) ────────────────────────────────

function serializeLd(schema: object): string {
  const json = JSON.stringify(schema)
  let result = ''
  for (let i = 0; i < json.length; i++) {
    const code = json.charCodeAt(i)
    if (code === 0x2028) result += '\\u2028'
    else if (code === 0x2029) result += '\\u2029'
    else if (json[i] === '<') result += '\u003c'
    else if (json[i] === '>') result += '\u003e'
    else if (json[i] === '&') result += '\u0026'
    else result += json[i]
  }
  return result
}

export function JsonLd({ schema }: { schema: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeLd(schema) }}
    />
  )
}
