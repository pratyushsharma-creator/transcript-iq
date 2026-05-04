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
`/terms`, `/compliance`

**Included (not excluded):** `/contact` — this is a conversion page and should be indexed.

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

`/contact` is **intentionally indexed** — it is a conversion page.

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
twitter.site:    omitted until a Twitter/X handle is confirmed (omitting is safe — cards
                 still render without it)
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

All OG images use `edge` runtime. **No `revalidate` is set** — images are generated on
first request and cached by Vercel's CDN indefinitely (or until a new deploy). This
avoids the cold-start problem where a newly published transcript has a broken OG image
for up to 24 hours. On first social share, the image generates in ~300ms at the edge.
If content changes (title edit), a Vercel cache purge or new deploy regenerates it.

---

## 7. JSON-LD Structured Data

All schemas built in `src/lib/seo/jsonld.ts` as typed functions returning plain objects.
Each builder function wraps its output with `"@context": "https://schema.org"` so callers
never need to add it manually. Injected as `<script type="application/ld+json">` in
server component `<head>` via `generateMetadata` or direct JSX in the page. Multiple
schemas on one page are injected as separate `<script>` tags (not an array), which is
the pattern that passes the Google Rich Results Test most reliably.

### 7.1 Organization (homepage only)

```json
{
  "@context": "https://schema.org",
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

1. **What expert levels are available?**
   Three levels: Standard (Director and Senior Manager, $349), Premium (VP and SVP, $449),
   and Elite (C-suite: CEO, CFO, CTO, COO, $599). The level reflects the seniority of the
   practitioner who participated in the call, not the complexity of the content.

2. **How are transcripts screened for MNPI?**
   Every transcript undergoes a compliance review by the Nextyn team before publication.
   The review checks for forward-looking guidance, undisclosed financial information,
   customer-specific data, and regulatory non-public information. Each document that passes
   receives a compliance certification with the review date and methodology. Documents that
   do not pass are not published.

3. **Can I preview a transcript before buying?**
   Yes. Every transcript listing includes a moderator-written executive summary (150–300
   words) covering the key themes, expert background, and main findings. You can assess
   relevance from the summary before purchasing the full document.

4. **What file format do I receive?**
   PDF. The document is downloaded immediately after purchase and is yours to keep. It is
   not locked inside a platform — you can store, share, and cite it freely within your
   organisation.

5. **How many transcripts are in the library?**
   77+ published transcripts at launch, across 12 industry sectors. New transcripts are
   added regularly. If you need a transcript on a topic not currently in the library, you
   can commission a custom expert call.

6. **Are new transcripts added regularly?**
   Yes. New transcripts are added to the library as they are produced and cleared through
   the MNPI review process. Subscribe to the research newsletter for notifications when
   transcripts relevant to your sectors are published.

7. **Do you offer bulk or team pricing?**
   Custom pricing is available for teams purchasing five or more transcripts. Contact us
   at the link below to discuss volume pricing and team access arrangements.

### 8.3 Free Transcript FAQs (5 questions)

1. **What do I get in the free transcript?**
   A full expert call transcript — the same format and quality as a paid document.
   Verbatim dialogue, expert profile, compliance certification, and sector tags. The free
   transcript is matched to the industry sector you specify when you sign up.

2. **Do I need a credit card?**
   No. A work email address and a sector selection are all that is required. No payment
   information is collected at any point in the free transcript flow.

3. **Can I get more than one free transcript?**
   One free transcript is available per registered email address. Additional transcripts
   are available for purchase from $349.

4. **Is the free transcript a full document or a summary?**
   It is the full verbatim transcript — not an excerpt or a summary. The only difference
   between the free transcript and a paid document is that the free transcript is selected
   by the Transcript IQ team based on your sector, rather than chosen by you from the
   full library.

5. **How do I qualify for a free transcript?**
   Register with a work email address (institutional email preferred) and select your
   primary research sector. The matched transcript is delivered to your inbox within
   one business day.

### 8.4 Per-article FAQs (`/resources/[slug]`)

Each blog post gets 4–5 FAQs targeting the "People Also Ask" cluster for the article's
primary keyword. Stored in `faq-data.ts` keyed by slug. Full Q&A pairs follow.

**Slug: `what-are-expert-call-transcripts`**
1. **What is an expert call transcript?** A verbatim record of a structured conversation
   between an institutional researcher and an industry practitioner — typically a former
   executive or sector specialist. Used for primary research in investment analysis, deal
   diligence, and strategy engagements.
2. **How long is a typical expert call transcript?** A standard 45–60 minute expert call
   produces 8,000–12,000 words of verbatim dialogue. At a comfortable reading pace, that
   is 30–40 minutes.
3. **What is the difference between an expert call transcript and an earnings call
   transcript?** An earnings call transcript records the formal quarterly investor call
   between company management and the public market. An expert call transcript records a
   private, structured conversation with a practitioner who has direct operating experience
   — typically a former employee, supplier, or customer of the company being researched.
4. **Are expert call transcripts legal to use?** Yes, when sourced from a reputable
   provider that conducts MNPI screening. The legal framework is well established: expert
   networks have operated within SEC and FCA guidance for over two decades.
5. **Where can I buy expert call transcripts?** Transcript IQ offers individual expert
   call transcripts from $349 per document, with no subscription required. Browse 77+
   published transcripts at transcript-iq.com/expert-transcripts.

**Slug: `expert-call-transcript-to-investment-memo-workflow`**
1. **How do you use an expert call transcript in an investment memo?** Identify the 2–3
   insights from the transcript that directly bear on your thesis. Write those as explicit
   sentences connecting the expert's view to your investment case. Cite as: Expert call,
   [Sector], via Transcript IQ, [Date].
2. **What is the difference between summarising and synthesising a transcript?** A summary
   answers "what did the expert say?" A synthesis answers "what does that mean for my
   thesis?" IC memos need synthesis, not summaries.
3. **How many transcripts do you need for a conviction investment thesis?** Three to five
   transcripts from independent sources covering the same question generates a pattern.
   Convergent views build conviction; divergent views reveal the most interesting
   analytical question.
4. **Can I cite an expert call transcript in a regulated investment process?** Yes. Each
   Transcript IQ document includes a compliance certification. Recommended citation:
   Expert call, [Sector], via Transcript IQ, [Date].

**Slug: `hedge-fund-expert-transcripts-earnings-research`**
1. **How do hedge funds use expert call transcripts for earnings research?** Primarily
   for channel checks (demand, pricing, competitive dynamics), management quality
   calibration, thesis stress-testing before the call, and post-earnings variance
   analysis.
2. **How much does a quarterly transcript library cost?** At Transcript IQ pricing,
   maintaining a refresh library for 15 positions costs approximately $3,000–$5,000 per
   quarter — a fraction of the cost of a platform subscription or fresh expert call
   programme.
3. **When should you buy transcripts relative to earnings season?** Ideally 2–3 weeks
   before the earnings date, to allow time for two reads and synthesis before the call.
4. **Can transcripts replace fresh expert calls for earnings prep?** For structural
   questions (competitive dynamics, management quality, cost structure), existing
   transcripts are usually sufficient. For time-sensitive questions (what happened in the
   last 90 days), a fresh call is still the right tool.

**Slug: `mnpi-compliance-expert-networks-analyst-guide`**
1. **What is MNPI in the context of expert networks?** Material Non-Public Information —
   information a reasonable investor would consider significant for an investment decision
   that has not been publicly disclosed. In expert network research, MNPI risk arises when
   an expert inadvertently discloses forward-looking financial guidance, customer data, or
   non-public regulatory developments.
2. **How do expert network platforms screen for MNPI?** Most platforms use a combination
   of pre-call compliance training for experts, interviewer guidelines, and post-call
   review of transcripts or notes. The weakness is reliance on self-disclosure by the
   expert. Transcript IQ reviews each transcript against a compliance framework before
   publication.
3. **What does a transcript compliance certificate include?** The compliance certification
   date, the review methodology used, confirmation that no MNPI was identified, and the
   expert anonymisation confirmation.
4. **What should institutional compliance teams ask when approving a transcript platform?**
   Evidence of MNPI screening methodology, expert anonymisation practice, audit trail
   capability, and the format of the compliance certification. All four are addressed in
   the Transcript IQ compliance documentation.

**Slug: `tegus-vs-third-bridge-vs-transcript-iq-cost-comparison`**
1. **How much does a Tegus subscription cost?** Tegus typically starts at approximately
   $15,000–$30,000 per user per year, depending on access tier and library scope. Pricing
   is negotiated and not publicly listed.
2. **What is the break-even point between a subscription and per-transcript pricing?**
   Roughly 25–30 transcripts per user per year. Below that, per-transcript pricing is
   almost always more cost-efficient.
3. **Is Transcript IQ cheaper than Tegus?** For episodic research needs (fewer than 25
   transcripts per user per year), yes — significantly. For high-frequency users reading
   50+ transcripts per year, a subscription platform may offer better unit economics.
4. **Do per-transcript providers have smaller libraries than subscription platforms?**
   Yes, currently. Tegus has tens of thousands of transcripts; Transcript IQ launched with
   77+. The gap narrows for teams with specific sector focus — and Transcript IQ offers
   custom commissioning for topics not in the library.

**Slug: `pe-expert-networks-deal-diligence-transcripts`**
1. **How do PE firms use expert networks in deal diligence?** Primarily for sector
   orientation at the start of a new process, management quality calibration, competitive
   positioning analysis, and customer/supplier perspective on the target.
2. **How many expert calls does a PE deal team typically run per transaction?** Varies
   significantly by deal size and process length. Mid-market PE teams commonly run 4–10
   expert interactions per transaction; large-cap teams may run 20+.
3. **What is the advantage of buying existing transcripts over commissioning fresh
   calls?** Immediate availability (minutes vs 3–7 business days), lower cost, and the
   ability to read before committing to a deeper primary research programme. Transcripts
   are a screening tool; fresh calls are for confirmed priority questions.
4. **Can Transcript IQ transcripts be used in an IC memo for a PE deal?** Yes. Each
   document includes a compliance certification. Cite as: Expert call, [Sector], via
   Transcript IQ, [Date]. This satisfies institutional compliance documentation
   requirements.

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
