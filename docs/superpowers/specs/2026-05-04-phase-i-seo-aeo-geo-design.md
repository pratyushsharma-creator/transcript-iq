# Phase I — SEO / AEO / GEO Infrastructure Design
**Date:** 2026-05-04
**Project:** Transcript IQ (Next.js 15 + Payload CMS 3 + Neon + Vercel)
**Owner:** Pratyush Sharma
**Status:** Approved for implementation

---

## 1. Goals

Build the full technical SEO, Answer Engine Optimization (AEO), and Generative Engine
Optimization (GEO) foundation for transcript-iq.com so the site can rank, surface in AI
answers, and be cited by generative search tools from the moment of launch.

**Success criteria:**
- Every page has a unique, keyword-targeted title, description, canonical URL, OG tags,
  and Twitter card — generated automatically from CMS data.
- The sitemap is always current: publishing a new transcript or blog post in Payload admin
  automatically includes it in the sitemap, metadata, JSON-LD, and OG image — zero manual
  action required.
- Structured data passes Google Rich Results Test for Product, Article, FAQPage,
  BreadcrumbList, and HowTo schemas.
- `llms.txt` and `llms-full.txt` are live and readable by AI crawlers (Perplexity,
  ChatGPT, Gemini, Claude).
- Sector-filtered URLs (`/expert-transcripts?industry=technology`) get unique metadata
  rather than the generic index title.

---

## 2. Architecture Overview

The SEO infrastructure operates on two layers:

**Passive layer (Next.js — always-on, automatic):**
All metadata, JSON-LD, OG images, and sitemap entries are generated at request time from
live Payload data. No manual action needed when new content is published. This layer
handles every page automatically.

**Active layer (MCP — future Phase, not in scope here):**
Proactive acceleration: IndexNow / Google Indexing API pings on publish, `llms-full.txt`
regeneration triggers, AI-drafted meta description fallbacks via Claude API. Designed but
not built in Phase I.

---

## 3. File Inventory

All new files introduced in this phase:

```
src/
  app/
    sitemap.ts                          Dynamic XML sitemap (Payload-sourced)
    robots.ts                           robots.txt
    opengraph-image.tsx                 Global OG image (brand default)
    llms.txt/
      route.ts                          llms.txt endpoint
    llms-full.txt/
      route.ts                          llms-full.txt endpoint (Payload-sourced)
    expert-transcripts/
      [slug]/
        opengraph-image.tsx             Per-transcript OG image
    resources/
      [slug]/
        opengraph-image.tsx             Per-blog-post OG image
  lib/
    seo/
      jsonld.ts                         Typed JSON-LD schema builders
      metadata.ts                       Shared generateMetadata helpers
      faq-data.ts                       Static FAQ datasets per page

Existing files modified:
  src/app/(frontend)/layout.tsx               Global metadata + OG defaults upgraded
  src/app/(frontend)/page.tsx                 Organization + WebSite + FAQPage schemas
  src/app/(frontend)/expert-transcripts/page.tsx    Metadata + ItemList + FAQPage
  src/app/(frontend)/expert-transcripts/[slug]/page.tsx   Product + BreadcrumbList schemas
  src/app/(frontend)/earnings-analysis/page.tsx    Metadata upgrade
  src/app/(frontend)/earnings-analysis/[slug]/page.tsx   Article + BreadcrumbList schemas
  src/app/(frontend)/resources/page.tsx        Metadata upgrade
  src/app/(frontend)/resources/[slug]/page.tsx  BlogPosting + BreadcrumbList + FAQPage
  src/app/(frontend)/free-transcript/page.tsx   FAQPage schema + metadata upgrade
  src/app/(frontend)/how-to-use/page.tsx        HowTo schema + metadata upgrade
  src/app/(frontend)/custom-reports/page.tsx    Metadata upgrade
  src/app/(frontend)/why-primary-research-wins/page.tsx  Metadata upgrade
  src/app/(frontend)/checkout/page.tsx          noindex meta tag
  src/app/(frontend)/checkout/confirmation/page.tsx  noindex meta tag
  src/app/(frontend)/privacy/page.tsx           noindex meta tag
  src/app/(frontend)/terms/page.tsx             noindex meta tag
  src/app/(frontend)/compliance/page.tsx        noindex meta tag
```

---

## 4. Technical Foundation

### 4.1 Sitemap (`src/app/sitemap.ts`)

Dynamic Next.js sitemap that queries Payload at crawl time. Always reflects published
content.

**Entries and priorities:**

| URL pattern | Priority | changeFreq | Source |
|-------------|----------|------------|--------|
| `/` | 1.0 | daily | static |
| `/expert-transcripts` | 0.9 | daily | static |
| `/earnings-analysis` | 0.9 | daily | static |
| `/resources` | 0.8 | weekly | static |
| `/free-transcript` | 0.8 | monthly | static |
| `/how-to-use` | 0.7 | monthly | static |
| `/custom-reports` | 0.7 | monthly | static |
| `/why-primary-research-wins` | 0.7 | monthly | static |
| `/expert-transcripts/[slug]` | 0.8 | weekly | Payload `expert-transcripts` |
| `/earnings-analysis/[slug]` | 0.8 | weekly | Payload `earnings-briefs` |
| `/resources/[slug]` | 0.7 | weekly | Payload `blog-posts` |

**Excluded:** `/admin/**`, `/checkout/**`, `/api/**`, `/styleguide`, `/privacy`,
`/terms`, `/compliance`, `/contact`

**Implementation note:** `export const revalidate = 3600` — sitemap rebuilds hourly so
newly published content propagates within one hour without a deploy.

### 4.2 Robots (`src/app/robots.ts`)

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /checkout/
Disallow: /api/
Disallow: /styleguide/

Sitemap: https://transcript-iq.com/sitemap.xml

# AI crawlers — content index files
# https://transcript-iq.com/llms.txt
# https://transcript-iq.com/llms-full.txt
```

### 4.3 Noindex pages

The following pages must not be indexed. They receive
`<meta name="robots" content="noindex, nofollow">` via their `metadata` export:

- `/checkout`
- `/checkout/confirmation`
- `/privacy`
- `/terms`
- `/compliance`
- `/styleguide`

### 4.4 Canonical URLs

Every `generateMetadata` call includes `alternates: { canonical: 'https://transcript-iq.com/[path]' }`.

For filtered index pages (`/expert-transcripts?industry=technology`), canonical points to
the filtered URL (not the base) so each sector URL is indexable as a distinct page (see
Section 7 — Sector Metadata).

---

## 5. Per-Page Metadata

### 5.1 Global defaults (layout.tsx)

```
title.default:   "Expert Call Transcripts Without the Subscription | Transcript IQ"
title.template:  "%s | Transcript IQ"
description:     "Buy individual MNPI-screened expert call transcripts from $349. 77+
                  transcripts across 12 sectors. No subscription. Compliance certified."
metadataBase:    https://transcript-iq.com
openGraph.siteName: Transcript IQ
openGraph.type:  website
twitter.card:    summary_large_image
twitter.site:    @TranscriptIQ (to be confirmed)
```

### 5.2 Static page metadata

| Page | Title | Description focus |
|------|-------|-------------------|
| `/expert-transcripts` | Expert Call Transcript Library — 77+ MNPI-Screened | Library breadth, pricing, no subscription |
| `/earnings-analysis` | Earnings Analysis Briefs — Institutional-Grade | Earnings research, brief format, sectors |
| `/resources` | Expert Network Research & Insights | Guides, MNPI, primary research workflows |
| `/free-transcript` | Get a Free Expert Call Transcript | No credit card, sector match, instant access |
| `/how-to-use` | How to Use Expert Transcripts for Research | Workflow, research process, analyst guidance |
| `/custom-reports` | Custom Expert Network Research | Bespoke commissioning, Nextyn network, turnaround |
| `/why-primary-research-wins` | Why Primary Research Beats Public Sources | Information edge, non-public data |

### 5.3 Dynamic page metadata

**`/expert-transcripts/[slug]`:**
```
title:       "[transcript.title] — Expert Call Transcript"
description: "[transcript.summary first 155 chars, or fallback:]
              [Tier] expert call transcript. [Sector]. MNPI-screened,
              compliance certified. Available from $[price]."
og:type:     "website"   (Product OG type not supported natively — use Product JSON-LD)
canonical:   https://transcript-iq.com/expert-transcripts/[slug]
```

**`/earnings-analysis/[slug]`:**
```
title:       "[brief.title] — Earnings Analysis Brief"
description: "[brief.summary or excerpt first 155 chars]"
canonical:   https://transcript-iq.com/earnings-analysis/[slug]
```

**`/resources/[slug]`:**
```
title:       "[post.title]"
description: "[post.excerpt first 155 chars]"
og:type:     "article"
og:publishedTime: post.publishedAt
og:author:   post.author?.name
canonical:   https://transcript-iq.com/resources/[slug]
```

---

## 6. Open Graph Image Generation

Three edge-rendered OG image templates using Next.js `ImageResponse`.
All images: 1200 × 630px, dark background, brand font (Geist).

### 6.1 Global default (`/opengraph-image.tsx`)
- Layout: centered brand wordmark + tagline on dark navy background
- Tagline: "Expert Call Transcripts Without the Subscription"
- Accent bar in brand green (`#34D399`)

### 6.2 Transcript OG (`/expert-transcripts/[slug]/opengraph-image.tsx`)
- Layout: left-aligned title (max 2 lines, 60px), right column shows:
  - Tier badge (Standard / Premium / Elite) in green
  - Sector label
  - Price ("From $349")
- Bottom bar: "transcript-iq.com" wordmark + compliance badge text

### 6.3 Blog post OG (`/resources/[slug]/opengraph-image.tsx`)
- Layout: article title (max 3 lines, 48px), category badge top-left
- Bottom: author name + published date + "transcript-iq.com"

All OG images use `edge` runtime and `revalidate = 86400` (regenerate daily).

---

## 7. JSON-LD Structured Data

All schemas built in `src/lib/seo/jsonld.ts` as typed functions returning plain objects.
Injected as `<script type="application/ld+json">` in server component `<head>` via
`generateMetadata` or direct JSX in the page.

### 7.1 Organization (homepage only)

```json
{
  "@type": "Organization",
  "name": "Transcript IQ",
  "url": "https://transcript-iq.com",
  "logo": "https://transcript-iq.com/logo.png",
  "description": "The first retail marketplace for institutional-grade, MNPI-screened expert call transcripts.",
  "foundingDate": "2024",
  "areaServed": "Worldwide",
  "sameAs": ["[LinkedIn URL]", "[Twitter URL]"],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "support@transcript-iq.com"
  }
}
```

### 7.2 WebSite + SearchAction (homepage only)

```json
{
  "@type": "WebSite",
  "name": "Transcript IQ",
  "url": "https://transcript-iq.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://transcript-iq.com/expert-transcripts?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```
Enables sitelinks search box in Google results.

### 7.3 Product (each `/expert-transcripts/[slug]`)

```json
{
  "@type": "Product",
  "name": "[transcript.title]",
  "description": "[transcript.summary]",
  "brand": { "@type": "Brand", "name": "Transcript IQ" },
  "category": "[transcript.sector]",
  "offers": {
    "@type": "Offer",
    "price": "[transcript.priceUsd]",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://transcript-iq.com/expert-transcripts/[slug]",
    "seller": { "@type": "Organization", "name": "Transcript IQ" }
  }
}
```

### 7.4 Article / BlogPosting (each `/resources/[slug]`)

```json
{
  "@type": "BlogPosting",
  "headline": "[post.title]",
  "description": "[post.excerpt]",
  "datePublished": "[post.publishedAt]",
  "dateModified": "[post.updatedAt]",
  "author": {
    "@type": "Person",
    "name": "[post.author.name or 'Pratyush Sharma']",
    "jobTitle": "AVP Marketing, Nextyn Advisory",
    "url": "https://transcript-iq.com/resources"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Transcript IQ",
    "logo": { "@type": "ImageObject", "url": "https://transcript-iq.com/logo.png" }
  },
  "mainEntityOfPage": "https://transcript-iq.com/resources/[slug]",
  "image": "https://transcript-iq.com/resources/[slug]/opengraph-image"
}
```

### 7.5 BreadcrumbList (all inner pages)

Generated from page depth. Examples:
- `/expert-transcripts` → Home › Expert Transcripts
- `/expert-transcripts/[slug]` → Home › Expert Transcripts › [Title]
- `/resources/[slug]` → Home › Resources › [Title]

Builder function takes an array of `{ name, url }` and returns the schema.

### 7.6 ItemList (index pages)

On `/expert-transcripts` and `/earnings-analysis`, inject an `ItemList` of the first
20 visible items (matching current filters) so search engines can display a grid/carousel
rich result.

### 7.7 FAQPage (multiple pages — see Section 8)

### 7.8 HowTo (`/how-to-use` page — see Section 9)

---

## 8. FAQ Infrastructure (AEO Core)

FAQs serve triple duty: (1) visible accordion on page, (2) FAQPage JSON-LD for SERP
rich results, (3) clean Q&A pairs for AI citation.

**Implementation:** FAQ data lives in `src/lib/seo/faq-data.ts` as typed constants. The
page server component imports the relevant FAQ set, renders the visible accordion, and
injects the FAQPage schema. The Payload `FaqBlock` (existing or new) can override these
defaults for editorial control.

### 8.1 Homepage FAQs (9 questions)

1. **What is Transcript IQ?**
   The first retail marketplace for institutional-grade expert call transcripts. You can
   buy individual transcripts from $349 without a subscription — the same documents hedge
   funds and PE firms use for primary research, now available per document.

2. **What is an expert call transcript?**
   A verbatim record of a structured conversation between an institutional researcher and
   an industry practitioner — typically a former executive or sector specialist. The
   document captures the full dialogue, question by question, and is used as primary
   research in investment analysis, deal diligence, and consulting engagements.

3. **How much does a transcript cost?**
   Standard (Director-level): $349. Premium (VP-level): $449. Elite (C-suite): $599.
   One-time purchase, PDF download, no subscription.

4. **Is there a subscription required?**
   No. You pay per transcript. There is no platform fee, no seat license, and no minimum
   commitment. Buy exactly what you need.

5. **Are transcripts MNPI compliant?**
   Yes. Every transcript in the library is screened for material non-public information
   before publication and includes a compliance certification document suitable for filing
   with an institutional compliance team.

6. **What sectors are covered?**
   12 sectors: Technology & SaaS, Healthcare & Pharma, Financial Services, Energy &
   Utilities, Industrials & Manufacturing, Telecommunications, Chemicals, Metals &
   Mining, Professional Services, Space Economy, Transportation & Logistics, and Real
   Estate & Infrastructure.

7. **How is Transcript IQ different from Tegus or Third Bridge?**
   Tegus and Third Bridge require annual subscriptions starting at $15,000+ per seat.
   Transcript IQ charges per transcript with no subscription, no platform fee, and no
   lock-in. Every transcript is MNPI-screened and delivered as a portable PDF you own
   outright.

8. **How quickly can I access a transcript after purchase?**
   Immediately. PDF download is available the moment payment clears — no waiting period,
   no approval queue.

9. **Can I use transcripts in an investment memo or IC presentation?**
   Yes. Each transcript includes a compliance certification. The recommended citation
   format is: Expert call, [Sector], via Transcript IQ, [Date]. This is sufficient for
   institutional compliance documentation.

### 8.2 Expert Transcripts Index FAQs (7 questions)

1. What expert levels are available?
2. How are transcripts screened for MNPI?
3. Can I preview a transcript before buying?
4. What file format do I receive?
5. How many transcripts are in the library?
6. Are new transcripts added regularly?
7. Do you offer bulk or team pricing?

### 8.3 Free Transcript FAQs (5 questions)

1. What do I get in the free transcript?
2. Do I need a credit card?
3. Can I get more than one free transcript?
4. Is the free transcript a full document or a summary?
5. How do I qualify for a free transcript?

### 8.4 Per-article FAQs (`/resources/[slug]`)

Each of the 6 blog posts gets 3–5 article-specific FAQs targeting the "People Also Ask"
cluster for that article's primary keyword. Stored in `faq-data.ts` keyed by slug.

Example for `what-are-expert-call-transcripts`:
1. What is an expert call transcript?
2. How long is a typical expert call transcript?
3. What is the difference between an expert call transcript and an earnings call transcript?
4. Are expert call transcripts legal to use?
5. Where can I buy expert call transcripts?

---

## 9. HowTo Schema (`/how-to-use`)

**AEO priority: HIGH.** The `/how-to-use` page maps exactly to queries like "how to use
expert call transcripts for investment research." `HowTo` schema renders step-by-step
instructions directly in Google and is a primary citation source for AI assistants.

```json
{
  "@type": "HowTo",
  "name": "How to Use Expert Call Transcripts for Investment Research",
  "description": "A step-by-step guide to integrating expert call transcripts into an investment research or deal diligence workflow.",
  "totalTime": "PT30M",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Define your research question",
      "text": "Before searching the library, write down the specific question your transcript needs to answer — about competitive dynamics, pricing, management quality, or customer behaviour.",
      "position": 1
    },
    {
      "@type": "HowToStep",
      "name": "Filter by sector and expert level",
      "text": "Use the sector, geography, and tier filters to narrow to transcripts relevant to your company or industry. Elite (C-suite) transcripts are best for strategic questions; Standard (Director) for operational detail.",
      "position": 2
    },
    {
      "@type": "HowToStep",
      "name": "Read the executive summary",
      "text": "Each transcript includes a moderator-written executive summary. Read this first to assess relevance before committing to the full document.",
      "position": 3
    },
    {
      "@type": "HowToStep",
      "name": "Purchase and download",
      "text": "Buy the transcript as a one-time purchase ($349–$599). Instant PDF download. No subscription. The compliance certificate is included in the download.",
      "position": 4
    },
    {
      "@type": "HowToStep",
      "name": "Annotate and synthesise",
      "text": "Read the transcript twice: first for orientation, second for annotation. Tag passages as Confirms, Challenges, or New Information relative to your thesis. Then synthesise — write what the expert's view means for your investment case, not what they said.",
      "position": 5
    },
    {
      "@type": "HowToStep",
      "name": "Cite in your deliverable",
      "text": "Cite as: Expert call, [Sector], via Transcript IQ, [Date]. File the compliance certificate with your institutional compliance team before use in a regulated investment process.",
      "position": 6
    }
  ]
}
```

The HowTo steps must match the visible content on the page — they cannot be schema-only.
Update the `/how-to-use` page content to align with these 6 steps if it doesn't already.

---

## 10. Sector-Level Metadata

When the expert transcripts index is filtered by sector, the page should return a unique
title and description for that sector — not the generic index title.

**Implementation:** `generateMetadata` on `/expert-transcripts/page.tsx` reads the
`industry` search param and maps it to a sector-specific string.

**Sector metadata map (12 entries):**

| Sector slug | Title | Description |
|-------------|-------|-------------|
| `technology-saas` | Technology & SaaS Expert Call Transcripts | Former executives from Tier-1 SaaS, semiconductor, and cloud companies. MNPI-screened. |
| `healthcare-pharma` | Healthcare & Pharma Expert Call Transcripts | Former pharma, biotech, and medical device executives. Regulatory, pricing, pipeline dynamics. |
| `financial-services` | Financial Services Expert Call Transcripts | Insurance, banking, fintech, and asset management sector experts. |
| `energy-utilities` | Energy & Utilities Expert Call Transcripts | Oil & gas, renewables, and grid infrastructure expert calls. |
| `industrials-manufacturing` | Industrials & Manufacturing Expert Transcripts | Aerospace, defence, capital goods, and supply chain executives. |
| `telecommunications` | Telecommunications Expert Call Transcripts | Telco infrastructure, spectrum, and enterprise connectivity experts. |
| `chemicals` | Chemicals Sector Expert Call Transcripts | Specialty chemicals, commodity, and materials sector practitioners. |
| `metals-mining` | Metals & Mining Expert Call Transcripts | Base metals, precious metals, and critical minerals experts. |
| `professional-services` | Professional Services Expert Call Transcripts | Consulting, legal, and outsourcing sector expert calls. |
| `space-economy` | Space Economy Expert Call Transcripts | Satellite, launch, and space infrastructure expert perspectives. |
| `transportation-logistics` | Transportation & Logistics Expert Transcripts | Freight, logistics, maritime, and aviation sector experts. |
| `real-estate-infrastructure` | Real Estate & Infrastructure Expert Transcripts | Commercial RE, infrastructure, and PropTech expert calls. |

Each sector URL (`/expert-transcripts?industry=technology-saas`) gets a canonical pointing
to itself (not the base `/expert-transcripts`) so it is treated as a unique indexable page.

---

## 11. GEO — AI Crawler Files

### 11.1 `llms.txt` (entity and navigation)

Machine-readable plaintext describing the site for AI crawlers. Covers:
- What Transcript IQ is (1 paragraph definition)
- What content exists (product types, counts, sectors)
- Pricing (specific, citable numbers)
- Key named entities: Transcript IQ, Nextyn Advisory, Pratyush Sharma
- Site structure: key URLs and what each page contains
- Compliance posture: MNPI screening explained

Format: Markdown, structured with `##` sections. Served at `/llms.txt`.
Static route handler. Editorial control. Updated manually per major content change.

### 11.2 `llms-full.txt` (content index)

Dynamic route handler that queries Payload at request time and emits:
- Every published transcript: title, slug, sector, expert level, executive summary preview
- Every published blog post: title, slug, excerpt
- Every published earnings brief: title, slug

Format: plaintext with clear delimiters. `revalidate = 3600`.

This is the file Perplexity, ChatGPT, and Gemini read when they want to answer queries
like "where can I find expert call transcripts on satellite broadband?"

---

## 12. Auto-Generation Architecture

### What is automatic (passive layer)

The following work without any manual action when new content is published in Payload:

| Feature | Mechanism |
|---------|-----------|
| Title, description, OG tags | `generateMetadata()` reads Payload at request time |
| JSON-LD schemas | Server component renders from Payload data |
| OG images | Edge `ImageResponse` reads Payload at request time |
| Sitemap inclusion | `sitemap.ts` queries all published items with `revalidate = 3600` |
| `llms-full.txt` listing | Dynamic route queries Payload with `revalidate = 3600` |
| BreadcrumbList | Generated from URL structure — always correct |
| Sector metadata | `generateMetadata` reads `industry` search param |

**Net result:** Publishing a new transcript in Payload admin → within 1 hour, sitemap
includes it, metadata is correct, OG image generates on first request, JSON-LD schema
is live, `llms-full.txt` lists it. Zero manual work.

### What the MCP handles (active layer — Phase II)

The following require the transcript-iq-mcp to build:

| Feature | Trigger |
|---------|---------|
| Google IndexNow ping | Payload `afterChange` hook → MCP → IndexNow API |
| Google Search Console Indexing API | MCP submits URL on publish (~24hr vs 7-day passive crawl) |
| `llms.txt` editorial update prompt | MCP notifies admin when new sector/content type added |
| AI-drafted meta description fallback | MCP calls Claude API if no custom description in Payload |
| Internal link suggestion | MCP scans new transcript, suggests related links |

---

## 13. Implementation Sequence

Phases should be built in this order to ensure each layer depends on complete prior work:

1. **`src/lib/seo/jsonld.ts`** — schema builders (no dependencies)
2. **`src/lib/seo/faq-data.ts`** — FAQ data constants (no dependencies)
3. **`src/lib/seo/metadata.ts`** — shared metadata helpers
4. **`src/app/robots.ts`** — trivial
5. **`src/app/sitemap.ts`** — depends on Payload collections
6. **`llms.txt` route** — static, editorial
7. **`llms-full.txt` route** — depends on Payload collections
8. **Global layout.tsx metadata upgrade** — depends on metadata helpers
9. **OG image templates** (3 files) — independent
10. **Homepage schemas** (Organization, WebSite, FAQPage)
11. **Per-page metadata upgrades** (all 12 pages) — depends on schema builders + FAQ data
12. **Noindex pages** — trivial additions
13. **Sector metadata on `/expert-transcripts`** — depends on metadata helpers
14. **HowTo schema on `/how-to-use`** — depends on schema builders + page content alignment

---

## 14. Out of Scope (Phase I)

- Google IndexNow / Search Console Indexing API integration (→ MCP Phase II)
- AI-drafted meta descriptions via Claude API (→ MCP Phase II)
- Review/AggregateRating schema (→ needs testimonial data)
- Programmatic sector landing pages as distinct routes (→ Phase II SEO expansion)
- `rel="me"` social profile verification (→ manual action, not code)
- Google Search Console verification tag (→ Pratyush action, env var)
- Core Web Vitals optimisation (→ separate performance phase)
- Multi-language / hreflang (→ English only in v1)
