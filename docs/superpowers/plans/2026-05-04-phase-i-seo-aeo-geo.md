# Phase I — SEO / AEO / GEO Infrastructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete SEO, AEO, and GEO infrastructure for transcript-iq.com — sitemap, robots, llms.txt files, JSON-LD schemas, per-page metadata, OG images, FAQs, HowTo schema, and sector metadata — all auto-generated from Payload CMS data.

**Architecture:** Two-file utility layer (`src/lib/seo/jsonld.ts`, `faq-data.ts`, `metadata.ts`) provides all schema builders and FAQ data. Page files consume these utilities to inject `<script type="application/ld+json">` tags server-side. Sitemap and AI crawler files query Payload directly with `revalidate = 3600` for hourly freshness. OG images use Next.js `ImageResponse` at the edge — generated on first request, cached forever by Vercel CDN.

**Tech Stack:** Next.js 15 App Router, Payload CMS 3, TypeScript, Next.js `ImageResponse` (edge OG images), `next/navigation` search params, schema.org JSON-LD

**Codebase note:** Collection slugs are `expert-transcripts`, `earnings-analyses`, `blog-posts`. The spec mentions `earnings-briefs` — the correct slug is `earnings-analyses`. OG image files belong inside the `(frontend)` route group.

---

## File Map

### New files
```
src/lib/seo/jsonld.tsx                             JSON-LD schema builder functions + JsonLd component
src/lib/seo/faq-data.ts                            FAQ Q&A datasets keyed by page
src/lib/seo/metadata.ts                            Shared generateMetadata helpers + sector map
src/app/robots.ts                                  robots.txt
src/app/sitemap.ts                                 Dynamic XML sitemap
src/app/llms.txt/route.ts                          llms.txt (static, editorial)
src/app/llms-full.txt/route.ts                     llms-full.txt (dynamic, Payload-sourced)
src/app/opengraph-image.tsx                        Global brand OG image
src/app/(frontend)/expert-transcripts/[slug]/opengraph-image.tsx   Transcript OG image
src/app/(frontend)/resources/[slug]/opengraph-image.tsx            Blog post OG image
```

### Modified files
```
src/app/(frontend)/layout.tsx                      Global metadata defaults upgraded
src/app/(frontend)/page.tsx                        Organization + WebSite + FAQPage schemas
src/app/(frontend)/expert-transcripts/page.tsx     Metadata + ItemList + FAQPage + sector meta
src/app/(frontend)/expert-transcripts/[slug]/page.tsx  Product + BreadcrumbList schemas
src/app/(frontend)/earnings-analysis/page.tsx      Metadata upgrade + BreadcrumbList
src/app/(frontend)/earnings-analysis/[slug]/page.tsx   Article + BreadcrumbList schemas
src/app/(frontend)/resources/page.tsx              Metadata upgrade
src/app/(frontend)/resources/[slug]/page.tsx       BlogPosting + BreadcrumbList + FAQPage
src/app/(frontend)/free-transcript/page.tsx        FAQPage schema + metadata upgrade
src/app/(frontend)/how-to-use/page.tsx             HowTo schema + metadata upgrade
src/app/(frontend)/custom-reports/page.tsx         Metadata upgrade
src/app/(frontend)/why-primary-research-wins/page.tsx  Metadata upgrade
src/app/(frontend)/checkout/page.tsx               noindex
src/app/(frontend)/checkout/confirmation/page.tsx  noindex
src/app/(frontend)/privacy/page.tsx                noindex
src/app/(frontend)/terms/page.tsx                  noindex
src/app/(frontend)/compliance/page.tsx             noindex
src/app/(frontend)/styleguide/page.tsx             noindex (if it exists)
```

---

## Task 1: JSON-LD Schema Builders (`src/lib/seo/jsonld.ts`)

**Files:**
- Create: `src/lib/seo/jsonld.tsx`

- [ ] **Step 1: Create the file with all typed schema builder functions**

```typescript
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
    transcript.sectors?.[0]
      ? (transcript.sectors[0] as Record<string, unknown>).title as string ??
        (transcript.sectors[0] as Record<string, unknown>).name as string ?? ''
      : ''
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: transcript.title,
    description: transcript.summary ?? undefined,
    brand: { '@type': 'Brand', name: ORG_NAME },
    category: sectorName || undefined,
    offers: {
      '@type': 'Offer',
      price: transcript.priceUsd ?? undefined,
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

export function JsonLd({ schema }: { schema: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd "C:\Transcript IQ (Claude Build)"
npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors in `src/lib/seo/jsonld.tsx`

- [ ] **Step 3: Commit**

```bash
git add src/lib/seo/jsonld.tsx
git commit -m "feat(seo): add JSON-LD schema builder library"
```

---

## Task 2: FAQ Data Constants (`src/lib/seo/faq-data.ts`)

**Files:**
- Create: `src/lib/seo/faq-data.ts`

- [ ] **Step 1: Create the FAQ data file**

```typescript
// src/lib/seo/faq-data.ts
import type { FaqItem } from './jsonld'
// Note: import from './jsonld' not './jsonld.tsx' — TypeScript resolves the extension automatically

// ── Homepage ─────────────────────────────────────────────────────────────────

export const HOME_FAQS: FaqItem[] = [
  {
    question: 'What is Transcript IQ?',
    answer:
      'The first retail marketplace for institutional-grade expert call transcripts. You can buy individual transcripts from $349 without a subscription — the same documents hedge funds and PE firms use for primary research, now available per document.',
  },
  {
    question: 'What is an expert call transcript?',
    answer:
      'A verbatim record of a structured conversation between an institutional researcher and an industry practitioner — typically a former executive or sector specialist. The document captures the full dialogue, question by question, and is used as primary research in investment analysis, deal diligence, and consulting engagements.',
  },
  {
    question: 'How much does a transcript cost?',
    answer:
      'Standard (Director-level): $349. Premium (VP-level): $449. Elite (C-suite): $599. One-time purchase, PDF download, no subscription.',
  },
  {
    question: 'Is there a subscription required?',
    answer:
      'No. You pay per transcript. There is no platform fee, no seat license, and no minimum commitment. Buy exactly what you need.',
  },
  {
    question: 'Are transcripts MNPI compliant?',
    answer:
      'Yes. Every transcript in the library is screened for material non-public information before publication and includes a compliance certification document suitable for filing with an institutional compliance team.',
  },
  {
    question: 'What sectors are covered?',
    answer:
      '12 sectors: Technology & SaaS, Healthcare & Pharma, Financial Services, Energy & Utilities, Industrials & Manufacturing, Telecommunications, Chemicals, Metals & Mining, Professional Services, Space Economy, Transportation & Logistics, and Real Estate & Infrastructure.',
  },
  {
    question: 'How is Transcript IQ different from Tegus or Third Bridge?',
    answer:
      'Tegus and Third Bridge require annual subscriptions starting at $15,000+ per seat. Transcript IQ charges per transcript with no subscription, no platform fee, and no lock-in. Every transcript is MNPI-screened and delivered as a portable PDF you own outright.',
  },
  {
    question: 'How quickly can I access a transcript after purchase?',
    answer:
      'Immediately. PDF download is available the moment payment clears — no waiting period, no approval queue.',
  },
  {
    question: 'Can I use transcripts in an investment memo or IC presentation?',
    answer:
      'Yes. Each transcript includes a compliance certification. The recommended citation format is: Expert call, [Sector], via Transcript IQ, [Date]. This is sufficient for institutional compliance documentation.',
  },
]

// ── Expert Transcripts Index ──────────────────────────────────────────────────

export const TRANSCRIPTS_INDEX_FAQS: FaqItem[] = [
  {
    question: 'What expert levels are available?',
    answer:
      'Three levels: Standard (Director and Senior Manager, $349), Premium (VP and SVP, $449), and Elite (C-suite: CEO, CFO, CTO, COO, $599). The level reflects the seniority of the practitioner who participated in the call, not the complexity of the content.',
  },
  {
    question: 'How are transcripts screened for MNPI?',
    answer:
      'Every transcript undergoes a compliance review by the Nextyn team before publication. The review checks for forward-looking guidance, undisclosed financial information, customer-specific data, and regulatory non-public information. Each document that passes receives a compliance certification with the review date and methodology. Documents that do not pass are not published.',
  },
  {
    question: 'Can I preview a transcript before buying?',
    answer:
      'Yes. Every transcript listing includes a moderator-written executive summary (150–300 words) covering the key themes, expert background, and main findings. You can assess relevance from the summary before purchasing the full document.',
  },
  {
    question: 'What file format do I receive?',
    answer:
      'PDF. The document is downloaded immediately after purchase and is yours to keep. It is not locked inside a platform — you can store, share, and cite it freely within your organisation.',
  },
  {
    question: 'How many transcripts are in the library?',
    answer:
      '77+ published transcripts at launch, across 12 industry sectors. New transcripts are added regularly. If you need a transcript on a topic not currently in the library, you can commission a custom expert call.',
  },
  {
    question: 'Are new transcripts added regularly?',
    answer:
      'Yes. New transcripts are added to the library as they are produced and cleared through the MNPI review process. Subscribe to the research newsletter for notifications when transcripts relevant to your sectors are published.',
  },
  {
    question: 'Do you offer bulk or team pricing?',
    answer:
      'Custom pricing is available for teams purchasing five or more transcripts. Contact us at the link below to discuss volume pricing and team access arrangements.',
  },
]

// ── Free Transcript ───────────────────────────────────────────────────────────

export const FREE_TRANSCRIPT_FAQS: FaqItem[] = [
  {
    question: 'What do I get in the free transcript?',
    answer:
      'A full expert call transcript — the same format and quality as a paid document. Verbatim dialogue, expert profile, compliance certification, and sector tags. The free transcript is matched to the industry sector you specify when you sign up.',
  },
  {
    question: 'Do I need a credit card?',
    answer:
      'No. A work email address and a sector selection are all that is required. No payment information is collected at any point in the free transcript flow.',
  },
  {
    question: 'Can I get more than one free transcript?',
    answer:
      'One free transcript is available per registered email address. Additional transcripts are available for purchase from $349.',
  },
  {
    question: 'Is the free transcript a full document or a summary?',
    answer:
      'It is the full verbatim transcript — not an excerpt or a summary. The only difference between the free transcript and a paid document is that the free transcript is selected by the Transcript IQ team based on your sector, rather than chosen by you from the full library.',
  },
  {
    question: 'How do I qualify for a free transcript?',
    answer:
      'Register with a work email address (institutional email preferred) and select your primary research sector. The matched transcript is delivered to your inbox within one business day.',
  },
]

// ── Per-article FAQs keyed by blog slug ──────────────────────────────────────

export const ARTICLE_FAQS: Record<string, FaqItem[]> = {
  'what-are-expert-call-transcripts': [
    {
      question: 'What is an expert call transcript?',
      answer:
        'A verbatim record of a structured conversation between an institutional researcher and an industry practitioner — typically a former executive or sector specialist. Used for primary research in investment analysis, deal diligence, and strategy engagements.',
    },
    {
      question: 'How long is a typical expert call transcript?',
      answer:
        'A standard 45–60 minute expert call produces 8,000–12,000 words of verbatim dialogue. At a comfortable reading pace, that is 30–40 minutes.',
    },
    {
      question:
        'What is the difference between an expert call transcript and an earnings call transcript?',
      answer:
        'An earnings call transcript records the formal quarterly investor call between company management and the public market. An expert call transcript records a private, structured conversation with a practitioner who has direct operating experience — typically a former employee, supplier, or customer of the company being researched.',
    },
    {
      question: 'Are expert call transcripts legal to use?',
      answer:
        'Yes, when sourced from a reputable provider that conducts MNPI screening. The legal framework is well established: expert networks have operated within SEC and FCA guidance for over two decades.',
    },
    {
      question: 'Where can I buy expert call transcripts?',
      answer:
        'Transcript IQ offers individual expert call transcripts from $349 per document, with no subscription required. Browse 77+ published transcripts at transcript-iq.com/expert-transcripts.',
    },
  ],
  'expert-call-transcript-to-investment-memo-workflow': [
    {
      question: 'How do you use an expert call transcript in an investment memo?',
      answer:
        'Identify the 2–3 insights from the transcript that directly bear on your thesis. Write those as explicit sentences connecting the expert\'s view to your investment case. Cite as: Expert call, [Sector], via Transcript IQ, [Date].',
    },
    {
      question: 'What is the difference between summarising and synthesising a transcript?',
      answer:
        'A summary answers "what did the expert say?" A synthesis answers "what does that mean for my thesis?" IC memos need synthesis, not summaries.',
    },
    {
      question: 'How many transcripts do you need for a conviction investment thesis?',
      answer:
        'Three to five transcripts from independent sources covering the same question generates a pattern. Convergent views build conviction; divergent views reveal the most interesting analytical question.',
    },
    {
      question: 'Can I cite an expert call transcript in a regulated investment process?',
      answer:
        'Yes. Each Transcript IQ document includes a compliance certification. Recommended citation: Expert call, [Sector], via Transcript IQ, [Date].',
    },
  ],
  'hedge-fund-expert-transcripts-earnings-research': [
    {
      question: 'How do hedge funds use expert call transcripts for earnings research?',
      answer:
        'Primarily for channel checks (demand, pricing, competitive dynamics), management quality calibration, thesis stress-testing before the call, and post-earnings variance analysis.',
    },
    {
      question: 'How much does a quarterly transcript library cost?',
      answer:
        'At Transcript IQ pricing, maintaining a refresh library for 15 positions costs approximately $3,000–$5,000 per quarter — a fraction of the cost of a platform subscription or fresh expert call programme.',
    },
    {
      question: 'When should you buy transcripts relative to earnings season?',
      answer:
        'Ideally 2–3 weeks before the earnings date, to allow time for two reads and synthesis before the call.',
    },
    {
      question: 'Can transcripts replace fresh expert calls for earnings prep?',
      answer:
        'For structural questions (competitive dynamics, management quality, cost structure), existing transcripts are usually sufficient. For time-sensitive questions (what happened in the last 90 days), a fresh call is still the right tool.',
    },
  ],
  'mnpi-compliance-expert-networks-analyst-guide': [
    {
      question: 'What is MNPI in the context of expert networks?',
      answer:
        'Material Non-Public Information — information a reasonable investor would consider significant for an investment decision that has not been publicly disclosed. In expert network research, MNPI risk arises when an expert inadvertently discloses forward-looking financial guidance, customer data, or non-public regulatory developments.',
    },
    {
      question: 'How do expert network platforms screen for MNPI?',
      answer:
        'Most platforms use a combination of pre-call compliance training for experts, interviewer guidelines, and post-call review of transcripts or notes. The weakness is reliance on self-disclosure by the expert. Transcript IQ reviews each transcript against a compliance framework before publication.',
    },
    {
      question: 'What does a transcript compliance certificate include?',
      answer:
        'The compliance certification date, the review methodology used, confirmation that no MNPI was identified, and the expert anonymisation confirmation.',
    },
    {
      question:
        'What should institutional compliance teams ask when approving a transcript platform?',
      answer:
        'Evidence of MNPI screening methodology, expert anonymisation practice, audit trail capability, and the format of the compliance certification. All four are addressed in the Transcript IQ compliance documentation.',
    },
  ],
  'tegus-vs-third-bridge-vs-transcript-iq-cost-comparison': [
    {
      question: 'How much does a Tegus subscription cost?',
      answer:
        'Tegus typically starts at approximately $15,000–$30,000 per user per year, depending on access tier and library scope. Pricing is negotiated and not publicly listed.',
    },
    {
      question:
        'What is the break-even point between a subscription and per-transcript pricing?',
      answer:
        'Roughly 25–30 transcripts per user per year. Below that, per-transcript pricing is almost always more cost-efficient.',
    },
    {
      question: 'Is Transcript IQ cheaper than Tegus?',
      answer:
        'For episodic research needs (fewer than 25 transcripts per user per year), yes — significantly. For high-frequency users reading 50+ transcripts per year, a subscription platform may offer better unit economics.',
    },
    {
      question: 'Do per-transcript providers have smaller libraries than subscription platforms?',
      answer:
        'Yes, currently. Tegus has tens of thousands of transcripts; Transcript IQ launched with 77+. The gap narrows for teams with specific sector focus — and Transcript IQ offers custom commissioning for topics not in the library.',
    },
  ],
  'pe-expert-networks-deal-diligence-transcripts': [
    {
      question: 'How do PE firms use expert networks in deal diligence?',
      answer:
        'Primarily for sector orientation at the start of a new process, management quality calibration, competitive positioning analysis, and customer/supplier perspective on the target.',
    },
    {
      question: 'How many expert calls does a PE deal team typically run per transaction?',
      answer:
        'Varies significantly by deal size and process length. Mid-market PE teams commonly run 4–10 expert interactions per transaction; large-cap teams may run 20+.',
    },
    {
      question:
        'What is the advantage of buying existing transcripts over commissioning fresh calls?',
      answer:
        'Immediate availability (minutes vs 3–7 business days), lower cost, and the ability to read before committing to a deeper primary research programme. Transcripts are a screening tool; fresh calls are for confirmed priority questions.',
    },
    {
      question: 'Can Transcript IQ transcripts be used in an IC memo for a PE deal?',
      answer:
        'Yes. Each document includes a compliance certification. Cite as: Expert call, [Sector], via Transcript IQ, [Date]. This satisfies institutional compliance documentation requirements.',
    },
  ],
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/seo/faq-data.ts
git commit -m "feat(seo): add FAQ data constants for all pages"
```

---

## Task 3: Shared Metadata Helpers (`src/lib/seo/metadata.ts`)

**Files:**
- Create: `src/lib/seo/metadata.ts`

- [ ] **Step 1: Create the metadata helpers file**

```typescript
// src/lib/seo/metadata.ts
const BASE_URL = 'https://transcript-iq.com'

/** Returns the full canonical URL for a given path */
export function canonical(path: string): string {
  return `${BASE_URL}${path}`
}

/** Truncates a string to maxLen chars, appending '…' if cut */
export function truncate(str: string | null | undefined, maxLen = 155): string {
  if (!str) return ''
  return str.length <= maxLen ? str : str.slice(0, maxLen - 1) + '…'
}

// ── Sector metadata map ───────────────────────────────────────────────────────

export type SectorMeta = { title: string; description: string }

export const SECTOR_META: Record<string, SectorMeta> = {
  'technology-saas': {
    title: 'Technology & SaaS Expert Call Transcripts',
    description:
      'Former executives from Tier-1 SaaS, semiconductor, and cloud companies. MNPI-screened. Buy individual transcripts from $349.',
  },
  'healthcare-pharma': {
    title: 'Healthcare & Pharma Expert Call Transcripts',
    description:
      'Former pharma, biotech, and medical device executives. Regulatory, pricing, pipeline dynamics. MNPI-screened.',
  },
  'financial-services': {
    title: 'Financial Services Expert Call Transcripts',
    description:
      'Insurance, banking, fintech, and asset management sector experts. MNPI-screened. Buy per transcript.',
  },
  'energy-utilities': {
    title: 'Energy & Utilities Expert Call Transcripts',
    description:
      'Oil & gas, renewables, and grid infrastructure expert calls. MNPI-screened.',
  },
  'industrials-manufacturing': {
    title: 'Industrials & Manufacturing Expert Transcripts',
    description:
      'Aerospace, defence, capital goods, and supply chain executives. MNPI-screened.',
  },
  telecommunications: {
    title: 'Telecommunications Expert Call Transcripts',
    description:
      'Telco infrastructure, spectrum, and enterprise connectivity experts. MNPI-screened.',
  },
  chemicals: {
    title: 'Chemicals Sector Expert Call Transcripts',
    description:
      'Specialty chemicals, commodity, and materials sector practitioners. MNPI-screened.',
  },
  'metals-mining': {
    title: 'Metals & Mining Expert Call Transcripts',
    description:
      'Base metals, precious metals, and critical minerals experts. MNPI-screened.',
  },
  'professional-services': {
    title: 'Professional Services Expert Call Transcripts',
    description:
      'Consulting, legal, and outsourcing sector expert calls. MNPI-screened.',
  },
  'space-economy': {
    title: 'Space Economy Expert Call Transcripts',
    description:
      'Satellite, launch, and space infrastructure expert perspectives. MNPI-screened.',
  },
  'transportation-logistics': {
    title: 'Transportation & Logistics Expert Transcripts',
    description:
      'Freight, logistics, maritime, and aviation sector experts. MNPI-screened.',
  },
  'real-estate-infrastructure': {
    title: 'Real Estate & Infrastructure Expert Transcripts',
    description:
      'Commercial RE, infrastructure, and PropTech expert calls. MNPI-screened.',
  },
}
```

- [ ] **Step 2: Compile check**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/seo/metadata.ts
git commit -m "feat(seo): add metadata helpers and sector metadata map"
```

---

## Task 4: robots.ts + sitemap.ts + noindex pages

**Files:**
- Create: `src/app/robots.ts`
- Create: `src/app/sitemap.ts`
- Modify: 5 pages to add noindex

- [ ] **Step 1: Create robots.ts**

```typescript
// src/app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/checkout/', '/api/', '/styleguide/'],
    },
    sitemap: 'https://transcript-iq.com/sitemap.xml',
  }
}
```

- [ ] **Step 2: Create sitemap.ts**

```typescript
// src/app/sitemap.ts
import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const revalidate = 3600 // rebuild hourly

const BASE_URL = 'https://transcript-iq.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: await config })

  // ── Fetch dynamic content ──────────────────────────────────────────────────
  const [transcripts, analyses, posts] = await Promise.all([
    payload.find({
      collection: 'expert-transcripts',
      where: { _status: { equals: 'published' } },
      limit: 500,
      depth: 0,
      select: { slug: true, updatedAt: true },
    }),
    payload.find({
      collection: 'earnings-analyses',
      where: { _status: { equals: 'published' } },
      limit: 500,
      depth: 0,
      select: { slug: true, updatedAt: true },
    }),
    payload.find({
      collection: 'blog-posts',
      where: { _status: { equals: 'published' } },
      limit: 200,
      depth: 0,
      select: { slug: true, updatedAt: true },
    }),
  ])

  // ── Static pages ───────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, priority: 1.0, changeFrequency: 'daily', lastModified: new Date() },
    { url: `${BASE_URL}/expert-transcripts`, priority: 0.9, changeFrequency: 'daily', lastModified: new Date() },
    { url: `${BASE_URL}/earnings-analysis`, priority: 0.9, changeFrequency: 'daily', lastModified: new Date() },
    { url: `${BASE_URL}/resources`, priority: 0.8, changeFrequency: 'weekly', lastModified: new Date() },
    { url: `${BASE_URL}/free-transcript`, priority: 0.8, changeFrequency: 'monthly', lastModified: new Date() },
    { url: `${BASE_URL}/how-to-use`, priority: 0.7, changeFrequency: 'monthly', lastModified: new Date() },
    { url: `${BASE_URL}/custom-reports`, priority: 0.7, changeFrequency: 'monthly', lastModified: new Date() },
    { url: `${BASE_URL}/why-primary-research-wins`, priority: 0.7, changeFrequency: 'monthly', lastModified: new Date() },
    { url: `${BASE_URL}/contact`, priority: 0.6, changeFrequency: 'monthly', lastModified: new Date() },
  ]

  // ── Dynamic transcript pages ───────────────────────────────────────────────
  const transcriptPages: MetadataRoute.Sitemap = transcripts.docs.map((t) => ({
    url: `${BASE_URL}/expert-transcripts/${t.slug}`,
    priority: 0.8,
    changeFrequency: 'weekly',
    lastModified: t.updatedAt ? new Date(t.updatedAt) : new Date(),
  }))

  // ── Dynamic earnings analysis pages ───────────────────────────────────────
  const analysisPages: MetadataRoute.Sitemap = analyses.docs.map((a) => ({
    url: `${BASE_URL}/earnings-analysis/${a.slug}`,
    priority: 0.8,
    changeFrequency: 'weekly',
    lastModified: a.updatedAt ? new Date(a.updatedAt) : new Date(),
  }))

  // ── Dynamic blog post pages ────────────────────────────────────────────────
  const blogPages: MetadataRoute.Sitemap = posts.docs.map((p) => ({
    url: `${BASE_URL}/resources/${p.slug}`,
    priority: 0.7,
    changeFrequency: 'weekly',
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
  }))

  return [...staticPages, ...transcriptPages, ...analysisPages, ...blogPages]
}
```

- [ ] **Step 3: Add noindex to 6 pages**

For each of the following files, add/replace the `metadata` export's `robots` field:
`src/app/(frontend)/checkout/page.tsx`,
`src/app/(frontend)/checkout/confirmation/page.tsx`,
`src/app/(frontend)/privacy/page.tsx`,
`src/app/(frontend)/terms/page.tsx`,
`src/app/(frontend)/compliance/page.tsx`,
`src/app/(frontend)/styleguide/page.tsx` *(if file exists; skip gracefully if not)*

Add this to each file's `metadata` export:
```typescript
robots: { index: false, follow: false },
```

Example for checkout/page.tsx — find the existing metadata export and add robots:
```typescript
export const metadata: Metadata = {
  title: 'Checkout',
  robots: { index: false, follow: false },
}
```

- [ ] **Step 4: Compile check**

```bash
npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 5: Verify robots.txt renders**

```bash
curl http://localhost:3000/robots.txt 2>/dev/null | head -20
# Or start dev server: pnpm dev
# Then visit http://localhost:3000/robots.txt
```

Expected: disallow lines for /admin/, /checkout/, /api/, /styleguide/

- [ ] **Step 6: Verify sitemap renders**

```bash
curl http://localhost:3000/sitemap.xml 2>/dev/null | head -40
```

Expected: XML with `<url>` entries including homepage and transcript slugs

- [ ] **Step 7: Commit**

```bash
git add src/app/robots.ts src/app/sitemap.ts \
  src/app/\(frontend\)/checkout/page.tsx \
  src/app/\(frontend\)/checkout/confirmation/page.tsx \
  src/app/\(frontend\)/privacy/page.tsx \
  src/app/\(frontend\)/terms/page.tsx \
  src/app/\(frontend\)/compliance/page.tsx
# If styleguide/page.tsx exists and was modified:
# git add src/app/\(frontend\)/styleguide/page.tsx
git commit -m "feat(seo): add sitemap, robots.txt, and noindex pages"
```

---

## Task 5: llms.txt + llms-full.txt Routes

**Files:**
- Create: `src/app/llms.txt/route.ts`
- Create: `src/app/llms-full.txt/route.ts`

- [ ] **Step 1: Create llms.txt route (static, editorial)**

```typescript
// src/app/llms.txt/route.ts
// No dynamic export needed — this route handler uses no dynamic APIs (no cookies,
// no headers, no searchParams), so Next.js 15 treats it as static by default.
// The content is fixed at build time. To update, redeploy.

const CONTENT = `# Transcript IQ — llms.txt
# https://transcript-iq.com
# Last updated: 2026-05-04

## What is Transcript IQ

Transcript IQ is the first retail marketplace for institutional-grade, MNPI-screened
expert call transcripts. It is operated by Nextyn Advisory (founded by Pratyush Sharma).

Expert call transcripts are verbatim records of structured conversations between
institutional researchers and former executives or industry practitioners. These
documents are used for primary research in investment analysis, private equity deal
diligence, and consulting engagements.

## Products and Pricing

Transcript IQ sells individual expert call transcripts at three price tiers:
- Standard (Director-level): $349 per document
- Premium (VP-level): $449 per document
- Elite (C-suite): $599 per document

There is no subscription, no platform fee, and no minimum purchase.

Every transcript is MNPI-screened and includes a compliance certification document.
Transcripts are delivered as PDF downloads immediately after purchase.

## Content Library

77+ expert call transcripts across 12 industry sectors:
- Technology & SaaS
- Healthcare & Pharma
- Financial Services
- Energy & Utilities
- Industrials & Manufacturing
- Telecommunications
- Chemicals
- Metals & Mining
- Professional Services
- Space Economy
- Transportation & Logistics
- Real Estate & Infrastructure

For a full content index including transcript titles and executive summaries, see:
https://transcript-iq.com/llms-full.txt

## Site Structure

| URL | Content |
|-----|---------|
| https://transcript-iq.com/ | Homepage — product overview, value proposition |
| https://transcript-iq.com/expert-transcripts | Browse all transcripts (filter by sector, geography, tier) |
| https://transcript-iq.com/earnings-analysis | Earnings analysis briefs |
| https://transcript-iq.com/resources | Research guides and articles |
| https://transcript-iq.com/free-transcript | Request a free matched transcript |
| https://transcript-iq.com/how-to-use | How to integrate transcripts into research workflows |
| https://transcript-iq.com/custom-reports | Custom expert network research commissioning |
| https://transcript-iq.com/why-primary-research-wins | Why primary research outperforms public sources |

## Compliance

All transcripts are reviewed for material non-public information (MNPI) before
publication using a framework aligned with SEC and FCA guidance on expert network
research. Each transcript includes a compliance certification with review date and
methodology.

Expert identities are fully anonymised: described as Former [Title], [Company Type]
with no personally identifying information.

## Key Named Entities

- Transcript IQ: the platform (transcript-iq.com)
- Nextyn Advisory: the expert network that sources and moderates all transcripts
- Pratyush Sharma: founder, AVP Marketing at Nextyn Advisory
- MNPI: Material Non-Public Information — the central compliance concept
- Expert network: an industry that connects institutional researchers with former executives

## Citation Format

When citing Transcript IQ content in research deliverables:
Expert call, [Sector], via Transcript IQ, [Date]

## Contact

support@transcript-iq.com
`

export function GET() {
  return new Response(CONTENT, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
```

- [ ] **Step 2: Create llms-full.txt route (dynamic, Payload-sourced)**

```typescript
// src/app/llms-full.txt/route.ts
import { getPayload } from 'payload'
import config from '@/payload.config'

export const revalidate = 3600

const BASE_URL = 'https://transcript-iq.com'

export async function GET() {
  const payload = await getPayload({ config: await config })

  const [transcripts, posts, analyses] = await Promise.all([
    payload.find({
      collection: 'expert-transcripts',
      where: { _status: { equals: 'published' } },
      limit: 500,
      depth: 1,
      select: {
        title: true,
        slug: true,
        executiveSummaryPreview: true,
        tier: true,
        sectors: true,
      },
    }),
    payload.find({
      collection: 'blog-posts',
      where: { _status: { equals: 'published' } },
      limit: 200,
      depth: 0,
      select: { title: true, slug: true, excerpt: true },
    }),
    payload.find({
      collection: 'earnings-analyses',
      where: { _status: { equals: 'published' } },
      limit: 200,
      depth: 0,
      select: { title: true, slug: true, executiveSummaryPreview: true },
    }),
  ])

  const lines: string[] = [
    '# Transcript IQ — Full Content Index',
    '# Generated automatically from published content',
    `# ${new Date().toISOString()}`,
    '',
    `## Expert Call Transcripts (${transcripts.docs.length} published)`,
    '',
  ]

  for (const t of transcripts.docs) {
    const sectorName =
      Array.isArray(t.sectors) && t.sectors.length > 0
        ? (t.sectors[0] as Record<string, unknown>)?.title as string ?? ''
        : ''
    lines.push(`### ${t.title}`)
    lines.push(`URL: ${BASE_URL}/expert-transcripts/${t.slug}`)
    if (t.tier) lines.push(`Tier: ${t.tier}`)
    if (sectorName) lines.push(`Sector: ${sectorName}`)
    if (t.executiveSummaryPreview) {
      lines.push(`Summary: ${(t.executiveSummaryPreview as string).slice(0, 300)}`)
    }
    lines.push('')
  }

  lines.push(`## Blog Posts & Research Guides (${posts.docs.length} published)`, '')
  for (const p of posts.docs) {
    lines.push(`### ${p.title}`)
    lines.push(`URL: ${BASE_URL}/resources/${p.slug}`)
    if (p.excerpt) lines.push(`Excerpt: ${p.excerpt}`)
    lines.push('')
  }

  lines.push(`## Earnings Analysis Briefs (${analyses.docs.length} published)`, '')
  for (const a of analyses.docs) {
    lines.push(`### ${a.title}`)
    lines.push(`URL: ${BASE_URL}/earnings-analysis/${a.slug}`)
    if (a.executiveSummaryPreview) {
      lines.push(`Summary: ${(a.executiveSummaryPreview as string).slice(0, 300)}`)
    }
    lines.push('')
  }

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
    },
  })
}
```

- [ ] **Step 3: Verify both endpoints**

```bash
# Start dev server first: pnpm dev
curl http://localhost:3000/llms.txt | head -20
curl http://localhost:3000/llms-full.txt | head -30
```

Expected: plaintext with correct content structure

- [ ] **Step 4: Commit**

```bash
git add src/app/llms.txt/route.ts src/app/llms-full.txt/route.ts
git commit -m "feat(seo): add llms.txt and llms-full.txt for AI crawlers"
```

---

## Task 6: Global Layout Metadata Upgrade

**Files:**
- Modify: `src/app/(frontend)/layout.tsx`

- [ ] **Step 1: Replace the metadata export**

Find the current `export const metadata: Metadata = { ... }` block and replace it:

```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://transcript-iq.com'),
  title: {
    default: 'Expert Call Transcripts Without the Subscription | Transcript IQ',
    template: '%s | Transcript IQ',
  },
  description:
    'Buy individual MNPI-screened expert call transcripts from $349. 77+ transcripts across 12 sectors. No subscription. Compliance certified.',
  openGraph: {
    siteName: 'Transcript IQ',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}
```

- [ ] **Step 2: Compile check**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
git add src/app/\(frontend\)/layout.tsx
git commit -m "feat(seo): upgrade global layout metadata defaults"
```

---

## Task 7: OG Image Templates (3 files)

**Files:**
- Create: `src/app/opengraph-image.tsx`
- Create: `src/app/(frontend)/expert-transcripts/[slug]/opengraph-image.tsx`
- Create: `src/app/(frontend)/resources/[slug]/opengraph-image.tsx`

- [ ] **Step 1: Create global OG image**

```typescript
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
```

- [ ] **Step 2: Create transcript OG image**

```typescript
// src/app/(frontend)/expert-transcripts/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const runtime = 'edge'
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
      ? (t.sectors[0] as Record<string, unknown>)?.title as string ?? ''
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
```

- [ ] **Step 3: Create blog post OG image**

```typescript
// src/app/(frontend)/resources/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const runtime = 'edge'
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
  })
  const post = docs[0]

  const title = post?.title ?? 'Research & Insights'
  const category = post?.contentType
    ? CATEGORY_LABELS[post.contentType as string] ?? post.contentType
    : 'Article'
  const authorName =
    (post?.author as Record<string, unknown> | null)?.name as string ?? 'Pratyush Sharma'
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
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
            <div
              style={{
                fontSize: 15,
                color: 'rgba(250,250,250,0.6)',
                fontFamily: 'sans-serif',
              }}
            >
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
```

- [ ] **Step 4: Compile check**

```bash
npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 5: Visual check** — start dev server and visit:
  - `http://localhost:3000/opengraph-image`
  - `http://localhost:3000/expert-transcripts/[any-real-slug]/opengraph-image`
  - `http://localhost:3000/resources/what-are-expert-call-transcripts/opengraph-image`

Each should return a 1200×630 PNG image

- [ ] **Step 6: Commit**

```bash
git add src/app/opengraph-image.tsx \
  "src/app/(frontend)/expert-transcripts/[slug]/opengraph-image.tsx" \
  "src/app/(frontend)/resources/[slug]/opengraph-image.tsx"
git commit -m "feat(seo): add OG image templates (global, transcript, blog post)"
```

---

## Task 8: Homepage — Organization + WebSite + FAQPage Schemas

> 🔴 **PREREQUISITE: Complete Task 9 before starting this task.** Task 9 creates `src/components/seo/FaqAccordion.tsx`. This task imports `FaqAccordion` — the Step 2 compile check will fail with a missing module error if Task 9 has not been done first. **Recommended execution order: Task 1 → Task 2 → Task 3 → Task 4 → Task 5 → Task 6 → Task 7 → Task 9 → Task 8 → Task 10 → ...**

**Files:**
- Modify: `src/app/(frontend)/page.tsx`

- [ ] **Step 1: Add JSON-LD imports and schema injection**

The homepage is a Payload-driven page that calls `<RenderBlocks>`. Add schema injection by importing the builders and rendering script tags before `<RenderBlocks>`.

Find the current `page.tsx` and add at the top:

```typescript
import { organizationSchema, websiteSchema, faqPageSchema, JsonLd } from '@/lib/seo/jsonld'
import { HOME_FAQS } from '@/lib/seo/faq-data'
import { canonical } from '@/lib/seo/metadata'
```

Add `generateMetadata` export:

```typescript
export async function generateMetadata() {
  return {
    title: 'Expert Call Transcripts Without the Subscription',
    description:
      'Buy individual MNPI-screened expert call transcripts from $349. 77+ transcripts across 12 sectors. No subscription. Compliance certified.',
    alternates: { canonical: canonical('/') },
    openGraph: {
      title: 'Expert Call Transcripts Without the Subscription | Transcript IQ',
      description:
        'Institutional primary research. Buy per transcript — no subscription, no platform fee. MNPI-screened, compliance certified.',
      url: canonical('/'),
      type: 'website',
    },
  }
}
```

Remove or replace any static `export const metadata` if present.

In the page's return, wrap the output to inject schemas before `<RenderBlocks>`:

```typescript
return (
  <>
    <JsonLd schema={organizationSchema()} />
    <JsonLd schema={websiteSchema()} />
    <JsonLd schema={faqPageSchema(HOME_FAQS)} />
    <RenderBlocks blocks={blocks} />
  </>
)
```

Also add a visible FAQ section at the bottom of the page if no FAQ block exists in the Payload layout. Add a simple accordion component (see Task 9 for the `FaqAccordion` component):

```typescript
import { FaqAccordion } from '@/components/seo/FaqAccordion'
// ... in return:
<FaqAccordion faqs={HOME_FAQS} />
```

- [ ] **Step 2: Compile check**

```bash
npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
git add src/app/\(frontend\)/page.tsx
git commit -m "feat(seo): add Organization, WebSite, FAQPage schemas to homepage"
```

---

## Task 9: FaqAccordion Component

**Files:**
- Create: `src/components/seo/FaqAccordion.tsx`

This component renders the visible FAQ section on pages that have FAQs. It is required by Tasks 8, 11, and 12.

- [ ] **Step 1: Create the component**

```typescript
// src/components/seo/FaqAccordion.tsx
'use client'
import { useState } from 'react'
import type { FaqItem } from '@/lib/seo/jsonld'

export function FaqAccordion({
  faqs,
  heading = 'Frequently Asked Questions',
}: {
  faqs: FaqItem[]
  heading?: string
}) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section
      style={{
        maxWidth: 760,
        margin: '0 auto',
        padding: '80px 48px',
      }}
    >
      <h2
        style={{
          fontSize: 'clamp(24px, 3vw, 36px)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          marginBottom: 40,
          color: 'var(--ink)',
        }}
      >
        {heading}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {faqs.map((faq, i) => (
          <div
            key={i}
            style={{
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 10,
              overflow: 'hidden',
            }}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '18px 20px',
                background: open === i ? 'var(--s1)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 16,
                color: 'var(--ink)',
                fontSize: 15,
                fontWeight: 500,
                lineHeight: 1.4,
              }}
            >
              <span>{faq.question}</span>
              <span
                style={{
                  color: 'var(--accent)',
                  fontSize: 20,
                  fontWeight: 300,
                  flexShrink: 0,
                  lineHeight: 1,
                  transform: open === i ? 'rotate(45deg)' : 'none',
                  transition: 'transform 0.15s',
                }}
              >
                +
              </span>
            </button>
            {open === i && (
              <div
                style={{
                  padding: '0 20px 18px',
                  fontSize: 14,
                  color: 'var(--ink-2)',
                  lineHeight: 1.72,
                  background: 'var(--s1)',
                }}
              >
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Compile check**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
git add src/components/seo/FaqAccordion.tsx
git commit -m "feat(seo): add FaqAccordion component for visible FAQ sections"
```

---

## Task 10: Expert Transcripts Index — Metadata + Sector Meta + ItemList + FAQPage

**Files:**
- Modify: `src/app/(frontend)/expert-transcripts/page.tsx`

- [ ] **Step 1: Convert static metadata export to `generateMetadata`**

The page currently uses `export const dynamic = 'force-dynamic'` and has a `searchParams` prop — `generateMetadata` needs to read `searchParams` too.

Replace the existing `export const metadata` with:

```typescript
import type { Metadata } from 'next'
import { SECTOR_META, canonical } from '@/lib/seo/metadata'
import { itemListSchema, faqPageSchema, JsonLd, breadcrumbSchema } from '@/lib/seo/jsonld'
import { TRANSCRIPTS_INDEX_FAQS } from '@/lib/seo/faq-data'
import { FaqAccordion } from '@/components/seo/FaqAccordion'

type SearchParamsType = Promise<{ [key: string]: string | string[] | undefined }>

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParamsType
}): Promise<Metadata> {
  const sp = await searchParams
  const industry = typeof sp.industry === 'string' ? sp.industry : undefined

  if (industry && SECTOR_META[industry]) {
    const sector = SECTOR_META[industry]
    return {
      title: sector.title,
      description: sector.description,
      alternates: {
        canonical: canonical(`/expert-transcripts?industry=${industry}`),
      },
      openGraph: {
        title: `${sector.title} | Transcript IQ`,
        description: sector.description,
        url: canonical(`/expert-transcripts?industry=${industry}`),
      },
    }
  }

  return {
    title: 'Expert Call Transcript Library — 77+ MNPI-Screened',
    description:
      'Primary research on demand. MNPI-screened, PII-redacted expert call transcripts by sector, geography, and expert level. Buy exactly what you need — no subscription.',
    alternates: { canonical: canonical('/expert-transcripts') },
    openGraph: {
      title: 'Expert Call Transcript Library | Transcript IQ',
      description:
        'MNPI-screened expert call transcripts. C-Suite, VP, and Director level. Standard $349 · Premium $449 · Elite $599.',
      url: canonical('/expert-transcripts'),
      type: 'website',
    },
  }
}
```

In the page's return statement, add breadcrumb and FAQ schemas plus the visible FAQ section. Wrap the current return in a fragment and prepend schemas:

```typescript
// At the top of the return (before <TranscriptLibrary ...>):
<>
  <JsonLd schema={breadcrumbSchema([
    { name: 'Home', url: 'https://transcript-iq.com' },
    { name: 'Expert Transcripts', url: 'https://transcript-iq.com/expert-transcripts' },
  ])} />
  <JsonLd schema={faqPageSchema(TRANSCRIPTS_INDEX_FAQS)} />
  {/* ItemList — first page of results as a schema hint */}
  <JsonLd schema={itemListSchema(
    docs.slice(0, 20).map((t, i) => ({
      name: t.title,
      url: `https://transcript-iq.com/expert-transcripts/${t.slug}`,
      position: i + 1,
    }))
  )} />
  <TranscriptLibrary ... />
  <FaqAccordion faqs={TRANSCRIPTS_INDEX_FAQS} />
</>
```

Note: `docs` is the fetched transcripts array already in the page. Adjust the variable name to match what's already in the file.

- [ ] **Step 2: Compile check**

```bash
npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
git add src/app/\(frontend\)/expert-transcripts/page.tsx
git commit -m "feat(seo): add sector metadata, FAQPage, ItemList to transcripts index"
```

---

## Task 11: Expert Transcript Detail Page — Product + BreadcrumbList

**Files:**
- Modify: `src/app/(frontend)/expert-transcripts/[slug]/page.tsx`

- [ ] **Step 1: Add imports and upgrade generateMetadata**

Add at the top of the file:
```typescript
import { productSchema, breadcrumbSchema, JsonLd } from '@/lib/seo/jsonld'
import { canonical, truncate } from '@/lib/seo/metadata'
```

Replace the existing `generateMetadata` body:

```typescript
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const transcript = await getTranscript(slug)
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
```

In the page return, before `<TranscriptProductPage ...>`, inject schemas:

```typescript
const transcript = await getTranscript(slug)  // already fetched
// ...
return (
  <>
    <JsonLd schema={productSchema(transcript)} />
    <JsonLd schema={breadcrumbSchema([
      { name: 'Home', url: 'https://transcript-iq.com' },
      { name: 'Expert Transcripts', url: 'https://transcript-iq.com/expert-transcripts' },
      { name: transcript.title, url: `https://transcript-iq.com/expert-transcripts/${slug}` },
    ])} />
    <TranscriptProductPage transcript={transcript} relatedTranscripts={related} />
  </>
)
```

- [ ] **Step 2: Compile check**

```bash
npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
git add "src/app/(frontend)/expert-transcripts/[slug]/page.tsx"
git commit -m "feat(seo): add Product and BreadcrumbList schemas to transcript detail page"
```

---

## Task 12: Blog Post Detail Page — BlogPosting + BreadcrumbList + FAQPage

**Files:**
- Modify: `src/app/(frontend)/resources/[slug]/page.tsx`

- [ ] **Step 1: Add imports**

```typescript
import { blogPostingSchema, breadcrumbSchema, faqPageSchema, JsonLd } from '@/lib/seo/jsonld'
import { canonical, truncate } from '@/lib/seo/metadata'
import { ARTICLE_FAQS } from '@/lib/seo/faq-data'
import { FaqAccordion } from '@/components/seo/FaqAccordion'
```

- [ ] **Step 2: Upgrade generateMetadata**

```typescript
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  // ... existing Payload fetch ...
  if (!post) return { title: 'Article Not Found', robots: { index: false } }

  return {
    title: post.title,
    description: truncate(post.excerpt, 155),
    alternates: { canonical: canonical(`/resources/${slug}`) },
    openGraph: {
      title: post.title,
      description: truncate(post.excerpt, 155) || undefined,
      url: canonical(`/resources/${slug}`),
      type: 'article',
      publishedTime: post.publishedAt ?? undefined,
      authors: post.author?.name ? [post.author.name] : ['Pratyush Sharma'],
    },
  }
}
```

- [ ] **Step 3: Inject schemas and FAQ in page return**

In the return, before `<ArticleBody body={post.body} />`:

```typescript
const articleFaqs = ARTICLE_FAQS[slug] ?? []
// ...
return (
  <>
    <JsonLd schema={blogPostingSchema(post)} />
    <JsonLd schema={breadcrumbSchema([
      { name: 'Home', url: 'https://transcript-iq.com' },
      { name: 'Resources', url: 'https://transcript-iq.com/resources' },
      { name: post.title, url: `https://transcript-iq.com/resources/${slug}` },
    ])} />
    {articleFaqs.length > 0 && <JsonLd schema={faqPageSchema(articleFaqs)} />}
    {/* ... rest of existing page JSX ... */}
    {articleFaqs.length > 0 && (
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 48px' }}>
        <FaqAccordion faqs={articleFaqs} />
      </div>
    )}
  </>
)
```

- [ ] **Step 4: Compile check**

```bash
npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 5: Commit**

```bash
git add "src/app/(frontend)/resources/[slug]/page.tsx"
git commit -m "feat(seo): add BlogPosting, BreadcrumbList, FAQPage to blog post pages"
```

---

## Task 13: Remaining Static Page Metadata Upgrades + HowTo + Free Transcript FAQ

**Files:**
- Modify: `src/app/(frontend)/earnings-analysis/page.tsx`
- Modify: `src/app/(frontend)/earnings-analysis/[slug]/page.tsx`
- Modify: `src/app/(frontend)/resources/page.tsx`
- Modify: `src/app/(frontend)/free-transcript/page.tsx`
- Modify: `src/app/(frontend)/how-to-use/page.tsx`
- Modify: `src/app/(frontend)/custom-reports/page.tsx`
- Modify: `src/app/(frontend)/why-primary-research-wins/page.tsx`

- [ ] **Step 1: Earnings Analysis index**

Replace existing `metadata` export:
```typescript
import { canonical } from '@/lib/seo/metadata'
import { breadcrumbSchema, JsonLd } from '@/lib/seo/jsonld'

export const metadata: Metadata = {
  title: 'Earnings Analysis Briefs — Institutional-Grade',
  description:
    'Deep-dive earnings analysis briefs for institutional researchers. Sector-by-sector. MNPI-screened. Buy per brief, no subscription.',
  alternates: { canonical: canonical('/earnings-analysis') },
  openGraph: {
    title: 'Earnings Analysis Briefs | Transcript IQ',
    description: 'Institutional-grade earnings analysis. MNPI-screened. Buy per document.',
    url: canonical('/earnings-analysis'),
    type: 'website',
  },
}
```

In the page return, wrap the existing JSX in a fragment and prepend the breadcrumb schema:

```typescript
// In return — replace existing bare return with:
return (
  <>
    <JsonLd schema={breadcrumbSchema([
      { name: 'Home', url: 'https://transcript-iq.com' },
      { name: 'Earnings Analysis', url: 'https://transcript-iq.com/earnings-analysis' },
    ])} />
    {/* existing page JSX here */}
  </>
)
```

- [ ] **Step 2: Earnings Analysis detail page**

> **Before writing code:** Read the existing `src/app/(frontend)/earnings-analysis/[slug]/page.tsx`. Confirm the field names used for the analysis object (title, summary/description, slug) and whether the page uses `generateMetadata` or a static `metadata` export. Adjust the snippet below to match the actual field names.

Add to `generateMetadata` return (adjust field names to match existing code):
```typescript
return {
  // ... existing title/description ...
  alternates: { canonical: canonical(`/earnings-analysis/${slug}`) },
  openGraph: {
    title: `${analysis.title} | Earnings Analysis — Transcript IQ`,
    description: truncate(analysis.summary, 155) || undefined,
    url: canonical(`/earnings-analysis/${slug}`),
    type: 'article',
  },
}
```

Add schema injection in the return:
```typescript
import { breadcrumbSchema, JsonLd } from '@/lib/seo/jsonld'
// In return:
<>
  <JsonLd schema={breadcrumbSchema([
    { name: 'Home', url: 'https://transcript-iq.com' },
    { name: 'Earnings Analysis', url: 'https://transcript-iq.com/earnings-analysis' },
    { name: analysis.title, url: `https://transcript-iq.com/earnings-analysis/${slug}` },
  ])} />
  <EarningsProductPage ... />
</>
```

- [ ] **Step 3: Resources (blog) index**

```typescript
export const metadata: Metadata = {
  title: 'Expert Network Research & Insights',
  description:
    'Practical guides on expert call transcripts, MNPI compliance, primary research workflows, and institutional research practices.',
  alternates: { canonical: canonical('/resources') },
  openGraph: {
    title: 'Expert Network Research & Insights | Transcript IQ',
    description: 'Research guides for analysts, portfolio managers, and deal teams.',
    url: canonical('/resources'),
    type: 'website',
  },
}
```

- [ ] **Step 4: Free Transcript page — FAQPage schema + updated metadata**

> **Before writing code:** Read the existing `src/app/(frontend)/free-transcript/page.tsx` to understand the current return shape. If the page already uses Payload blocks + `<RenderBlocks blocks={blocks} />`, use the snippet below verbatim. If the page uses static JSX instead, replace `<RenderBlocks blocks={blocks} />` with whatever the page already renders.

```typescript
import { faqPageSchema, breadcrumbSchema, JsonLd } from '@/lib/seo/jsonld'
import { FREE_TRANSCRIPT_FAQS } from '@/lib/seo/faq-data'
import { FaqAccordion } from '@/components/seo/FaqAccordion'
import { canonical } from '@/lib/seo/metadata'

export const metadata: Metadata = {
  title: 'Get a Free Expert Call Transcript',
  description:
    'Get one MNPI-screened expert call transcript matched to your sector. No credit card, no subscription. Work email only. Delivered within one business day.',
  alternates: { canonical: canonical('/free-transcript') },
  openGraph: {
    title: 'Get a Free Expert Call Transcript | Transcript IQ',
    description: 'Free full transcript matched to your sector. No credit card. No subscription.',
    url: canonical('/free-transcript'),
    type: 'website',
  },
}
// In return (adjust to match the page's existing JSX structure):
<>
  <JsonLd schema={faqPageSchema(FREE_TRANSCRIPT_FAQS)} />
  <JsonLd schema={breadcrumbSchema([
    { name: 'Home', url: 'https://transcript-iq.com' },
    { name: 'Free Transcript', url: 'https://transcript-iq.com/free-transcript' },
  ])} />
  <RenderBlocks blocks={blocks} /> {/* or existing page JSX */}
  <FaqAccordion faqs={FREE_TRANSCRIPT_FAQS} />
</>
```

- [ ] **Step 5: How-to-use page — HowTo schema + metadata**

```typescript
import { howToSchema, breadcrumbSchema, JsonLd } from '@/lib/seo/jsonld'
import { canonical } from '@/lib/seo/metadata'

export const metadata: Metadata = {
  title: 'How to Use Expert Transcripts for Research',
  description:
    'From PDF download to investment memo. A 6-step guide for analysts, portfolio managers, and consultants to extract maximum value from expert call transcripts.',
  alternates: { canonical: canonical('/how-to-use') },
  openGraph: {
    title: 'How to Use Expert Call Transcripts | Transcript IQ',
    description: 'Step-by-step workflow guide for integrating transcripts into research.',
    url: canonical('/how-to-use'),
    type: 'website',
  },
}

// HowTo schema data (matches visible page content)
const HOW_TO = howToSchema({
  name: 'How to Use Expert Call Transcripts for Investment Research',
  description:
    'A step-by-step guide to integrating expert call transcripts into an investment research or deal diligence workflow.',
  totalTime: 'PT30M',
  steps: [
    {
      position: 1,
      name: 'Define your research question',
      text: 'Before searching the library, write down the specific question your transcript needs to answer — about competitive dynamics, pricing, management quality, or customer behaviour.',
    },
    {
      position: 2,
      name: 'Filter by sector and expert level',
      text: 'Use the sector, geography, and tier filters to narrow to transcripts relevant to your company or industry. Elite (C-suite) transcripts are best for strategic questions; Standard (Director) for operational detail.',
    },
    {
      position: 3,
      name: 'Read the executive summary',
      text: 'Each transcript includes a moderator-written executive summary. Read this first to assess relevance before committing to the full document.',
    },
    {
      position: 4,
      name: 'Purchase and download',
      text: 'Buy the transcript as a one-time purchase ($349–$599). Instant PDF download. No subscription. The compliance certificate is included in the download.',
    },
    {
      position: 5,
      name: 'Annotate and synthesise',
      text: 'Read the transcript twice: first for orientation, second for annotation. Tag passages as Confirms, Challenges, or New Information relative to your thesis. Synthesise — write what the expert\'s view means for your investment case, not what they said.',
    },
    {
      position: 6,
      name: 'Cite in your deliverable',
      text: 'Cite as: Expert call, [Sector], via Transcript IQ, [Date]. File the compliance certificate with your institutional compliance team before use in a regulated investment process.',
    },
  ],
})

// In return:
<>
  <JsonLd schema={HOW_TO} />
  <JsonLd schema={breadcrumbSchema([
    { name: 'Home', url: 'https://transcript-iq.com' },
    { name: 'How to Use', url: 'https://transcript-iq.com/how-to-use' },
  ])} />
  <RenderBlocks blocks={blocks} />
</>
```

- [ ] **Step 6: Custom Reports + Why Primary Research pages**

For each, add/replace `metadata` export with canonical and improved copy:

`custom-reports/page.tsx`:
```typescript
export const metadata: Metadata = {
  title: 'Custom Expert Network Research',
  description:
    'Commission bespoke expert call research through the Nextyn network. Sector specialists, former executives, C-suite. Delivered within 3–5 business days.',
  alternates: { canonical: canonical('/custom-reports') },
}
```

`why-primary-research-wins/page.tsx`:
```typescript
export const metadata: Metadata = {
  title: 'Why Primary Research Beats Public Sources',
  description:
    'Public research is a shared starting point. Expert call transcripts capture the practitioner knowledge layer between public data and regulated insider information.',
  alternates: { canonical: canonical('/why-primary-research-wins') },
}
```

- [ ] **Step 7: Compile check — run full build**

```bash
pnpm build 2>&1 | tail -30
```

Expected: successful build, no TypeScript errors

- [ ] **Step 8: Commit all remaining page changes**

```bash
git add \
  src/app/\(frontend\)/earnings-analysis/page.tsx \
  src/app/\(frontend\)/earnings-analysis/\[slug\]/page.tsx \
  src/app/\(frontend\)/resources/page.tsx \
  src/app/\(frontend\)/free-transcript/page.tsx \
  src/app/\(frontend\)/how-to-use/page.tsx \
  src/app/\(frontend\)/custom-reports/page.tsx \
  src/app/\(frontend\)/why-primary-research-wins/page.tsx
git commit -m "feat(seo): upgrade all remaining page metadata, FAQPage, HowTo, BreadcrumbList"
```

---

## Task 14: Final Validation

- [ ] **Step 1: Full build passes**

```bash
pnpm build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`

- [ ] **Step 2: Verify sitemap**

> Verify against localhost first (before push in Step 7):

```bash
curl http://localhost:3000/sitemap.xml | head -60
```

Expected: XML with all transcript, blog, and earnings URLs

- [ ] **Step 3: Verify robots.txt**

```bash
curl http://localhost:3000/robots.txt
```

Expected: disallow lines for /admin/, /checkout/, /api/, sitemap URL present

- [ ] **Step 4: Verify llms.txt + llms-full.txt**

```bash
curl http://localhost:3000/llms.txt | head -20
curl http://localhost:3000/llms-full.txt | head -30
```

Expected: plaintext with company description / content index

- [ ] **Step 5: Validate JSON-LD on key pages**

Visit Google Rich Results Test: https://search.google.com/test/rich-results

Test these URLs:
- `https://transcript-iq.com/` → expect: FAQPage valid
- `https://transcript-iq.com/expert-transcripts/[any-slug]` → expect: Product valid
- `https://transcript-iq.com/resources/what-are-expert-call-transcripts` → expect: Article + FAQPage valid
- `https://transcript-iq.com/how-to-use` → expect: HowTo valid

- [ ] **Step 6: Check OG image on all three templates**

Visit each URL in a browser and confirm a 1200×630 PNG renders:
- `https://transcript-iq.com/opengraph-image`
- `https://transcript-iq.com/expert-transcripts/[any-slug]/opengraph-image`
- `https://transcript-iq.com/resources/what-are-expert-call-transcripts/opengraph-image`

Use https://www.opengraph.xyz/ to preview how links share on social.

- [ ] **Step 7: Push to trigger Vercel deploy**

```bash
git push origin main
```

---

## Notes for Implementer

1. **Collection slugs:** Use `expert-transcripts`, `earnings-analyses`, `blog-posts` — NOT `earnings-briefs` (spec had an error; codebase uses `earnings-analyses`).

2. **Route groups:** All frontend pages are inside `src/app/(frontend)/`. OG image files go inside this group too (e.g. `src/app/(frontend)/expert-transcripts/[slug]/opengraph-image.tsx`).

3. **`force-dynamic` pages:** Pages that use `searchParams` must keep `export const dynamic = 'force-dynamic'`. Do not remove this when adding `generateMetadata`.

4. **`generateMetadata` vs static `metadata`:** Pages with dynamic content (fetching from Payload) should use `generateMetadata`. Pages with only static content can use the static `metadata` export. The sector-aware expert transcripts index MUST use `generateMetadata`.

5. **Visible FAQs required:** The FAQPage schema is only eligible for Google's rich results if the FAQs are also visible on the page — schema-only FAQs (not rendered) will fail validation. Always render `<FaqAccordion>` alongside the `<JsonLd schema={faqPageSchema(...)}>` tag.

6. **HowTo steps must match page content:** The HowTo schema steps must correspond to visible content on the `/how-to-use` page. If the page's Payload blocks don't cover these 6 steps, the how-to-use seed script needs updating to add a process steps block.
