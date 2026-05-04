# TRANSCRIPT IQ PLATFORM — BUILD SPEC v1.0

**Target ship date:** Sunday, May 3, 2026 (DNS cut-over by 23:59 IST)
**Owner:** Pratyush Sharma (solo build, with Claude Code)
**Replaces:** transcript-iq-new.webflow.io
**Stack:** Next.js 15 + Payload CMS 3 + Postgres (Neon) + Stripe + Vercel

This spec is designed to be handed to Claude Code in sequential phases. Each phase has a goal, a list of files to create or change, exact commands, and an acceptance check. Items marked `[YOU]` are things Pratyush must do manually (account creation, DNS, payments setup) and cannot be automated.

---

## 1. SCOPE

### v1 (ships Sunday, May 3, 2026)

**Marketing site**
- Home, About, How it works, Products (transcripts), Products (earnings), Pricing, Contact, Blog, Legal (Privacy + Terms)
- Fully CMS-driven — all marketing pages editable in Payload admin
- Mobile responsive, dark + light mode, Sapphire Blue + Inter + JetBrains Mono design system

**Content & products**
- Two product collections: `ExpertTranscripts`, `EarningsBriefs`
- Blog with categories, industries, authors
- Search (Postgres full-text, MVP)
- Industry, geography, date filters on browse pages

**Webapp (paywalled)**
- Email + password auth (no SSO in v1)
- User dashboard: my purchases, subscription status, account settings
- Transcript / brief reader (gated content view)
- Download links (PDF) for purchased items

**Commerce**
- Stripe Checkout (one-time purchase + monthly subscription tiers)
- Webhook-based fulfillment (grant access on `checkout.session.completed`)
- Email receipts via Resend
- Basic invoice download from dashboard

**SEO / AEO / GEO foundation**
- Auto-generated `sitemap.xml`, `robots.txt`, `llms.txt`
- Per-page meta title, description, OG tags, Twitter cards
- JSON-LD schema (`Article`, `Product`, `Organization`, `BreadcrumbList`, `FAQPage`)
- Canonical URLs
- Open Graph image generation per article

**Analytics & ads**
- Google Analytics 4
- Google Search Console verification
- Meta Pixel (Facebook/Instagram ads)
- LinkedIn Insight Tag
- Single `<Analytics />` component, fires consent-aware
- Cookie consent banner (cookieyes-light)

**AI (basic)**
- Claude API helper in admin: draft post from brief, generate meta title + description from body, suggest tags

### Phase 2 (week of May 4–10)

- Razorpay integration (UPI, netbanking, Indian cards)
- Full Webflow content migration (remaining ~50–100 pieces)
- AI content workflows: programmatic SEO matrix pages, internal linking automation, llms.txt deep-fill
- Meilisearch (replace Postgres FTS for sub-50ms filtered search)

### Phase 3 (later)

- Customer-facing "ask transcripts" semantic search + Claude-grounded Q&A
- Public API for clients
- Bring Your Own Transcript (BYOT) upload (relates to Nextyn IQ work)
- Topical cluster auto-mapping

### NOT shipping (intentionally)

- Multi-language. English only for v1.
- Native mobile app. Mobile web only.
- Editorial workflow (review/approve/publish). Single-tier publishing in v1.
- Comments / discussion features.

---

## 2. PRATYUSH ACTION ITEMS — DO THESE TONIGHT

**These block everything else. Start them before opening Claude Code.**

### 2.1 Domain & DNS

1. Confirm which domain you're launching on. Recommend `transcript-iq.com` (or whatever you own). If you don't own it, buy it now from Cloudflare Registrar (~$10/yr, no markup, free WHOIS privacy).
2. If domain is currently pointed at Webflow, change name servers to Cloudflare. Add as a site in Cloudflare dashboard. **Wait ~2 hours for propagation before next step.**
3. Once Cloudflare is the authoritative DNS, leave Webflow's DNS records in place for now. We'll cut them on Sunday.

### 2.2 Account creation (free or low-cost; ~30 minutes)

Create accounts in this order. Use a single shared email like `tech@nextyn.com` so the team can recover access later.

| Service | Plan | Why | URL |
|---|---|---|---|
| **Vercel** | Pro ($20/mo) | Hosting | https://vercel.com/signup |
| **Neon** | Free tier ($0, upgrade later) | Postgres database | https://neon.tech |
| **Stripe** | Standard (free, % per txn) | Payments | https://dashboard.stripe.com/register |
| **Resend** | Free tier (3k emails/mo) | Transactional email | https://resend.com |
| **Anthropic Console** | Pay-as-you-go | Claude API | https://console.anthropic.com |
| **Cloudflare** | Free | DNS + CDN | https://dash.cloudflare.com/sign-up |
| **GitHub** | Free | Code repo | https://github.com |
| **Sentry** | Free dev plan | Error monitoring | https://sentry.io |

### 2.3 Stripe setup

1. Activate your Stripe account immediately — this triggers business verification, which can take 12–48 hours. Do this Wednesday night.
2. Add bank account for payouts.
3. Enable Stripe Tax if billing GST in India.
4. Add domain to Stripe (Settings → Branding → add `transcript-iq.com`).
5. Get test mode keys (`sk_test_...`, `pk_test_...`) — needed Friday.
6. Get live mode keys — needed Saturday.

### 2.4 Marketing accounts

Create or confirm access to:
- Google Search Console (https://search.google.com/search-console)
- Google Analytics 4 (https://analytics.google.com) — create new property for `transcript-iq.com`
- Google Tag Manager (optional but recommended) — single container for all pixels
- Meta Business Suite → create Pixel → note Pixel ID
- LinkedIn Campaign Manager → Insight Tag → note Partner ID

You'll plug all these IDs into env vars on Sunday.

### 2.5 Webflow export

Friday morning (May 1):
1. In Webflow CMS, go to each collection → Export to CSV.
2. Save CSVs to a folder: `/migrations/webflow-exports/`. Name them `blog-posts.csv`, `transcripts.csv`, etc.
3. Download all images from Webflow Assets panel (zip download).
4. Don't break the live Webflow site yet — we keep it up until Sunday DNS cutover.

---

## 3. TECH STACK

```
Runtime:        Node 20 LTS
Framework:      Next.js 15.x (App Router)
Language:       TypeScript 5.x (strict mode)
CMS:            Payload 3.x (runs in same Next.js app)
Database:       Postgres 16 (Neon hosted)
ORM:            Drizzle (Payload's default in v3)
Styling:        Tailwind CSS 3.x + shadcn/ui
UI components:  Radix primitives via shadcn
Auth:           Payload built-in (cookie sessions)
Payments:       Stripe (v1), Razorpay (Phase 2)
Email:          Resend + React Email
File storage:   Vercel Blob (v1), Cloudflare R2 (Phase 2)
Search:         Postgres FTS via tsvector (v1), Meilisearch (Phase 2)
AI:             Anthropic Claude API (Sonnet 4.6)
Hosting:        Vercel
Analytics:      GA4, GSC, Meta Pixel, LinkedIn Insight
Monitoring:     Sentry (free tier)
DNS / CDN:      Cloudflare
```

**Why these specifically:**

- **Payload 3** runs as a Next.js plugin, not a separate server. One deploy, one repo, one Postgres. The admin UI lives at `/admin`, the site lives at `/`, both share types and queries.
- **Drizzle** (vs Prisma) because Payload 3 ships with it and it has better Vercel cold-start performance.
- **Vercel Blob** (vs R2 in v1) because it's one fewer service to wire up; we move to R2 in Phase 2 when we have time to handle S3-compatible signing properly.
- **Postgres FTS** (vs Meilisearch in v1) because it's free, in the same DB, and good enough for the catalog size you'll have on day one.

---

## 4. DAY-BY-DAY EXECUTION PLAN

### WEDNESDAY EVENING (today) — Foundation

**Goal:** Repo created, both servers running locally, admin login works.

1. `[YOU]` Complete Section 2 action items (accounts, DNS).
2. Open Claude Code in a fresh directory.
3. Run Phase A (Section 5.1).
4. Run Phase B (Section 5.2 — collections).
5. Verify: `localhost:3000/admin` loads, you can log in, you can create a test blog post.

**Stop time:** Around midnight. Get sleep.

### THURSDAY (May 1, ~12 hrs)

**Goal:** All collections live, design system in code, marketing pages building.

- Morning: Phase B (continue), Phase C (design tokens + global layout).
- Afternoon: Phase D (marketing pages — home, about, products, pricing, contact).
- Evening: Phase E (blog index + post template, browse pages for products).

**Stop check:** All public pages render with seeded content. Admin can publish a blog post and see it on the site.

### FRIDAY (May 2, ~12 hrs)

**Goal:** Auth, payments, email, paywall.

- Morning: `[YOU]` start Webflow CSV export (Section 2.5).
- Morning: Phase F (auth — register, login, password reset, account dashboard).
- Afternoon: Phase G (Stripe checkout, webhook handlers, fulfillment).
- Evening: Phase H (paywall logic on transcript / earnings reader pages, email receipts).

**Stop check:** Buy a transcript with a Stripe test card, receive email receipt, log in, see it in dashboard, read full content.

### SATURDAY (May 3, ~12 hrs)

**Goal:** SEO, analytics, AI, content seeding.

- Morning: Phase I (SEO infrastructure — sitemap, llms.txt, schema markup, OG images).
- Afternoon: Phase J (analytics + cookie consent, AI helpers in admin).
- Evening: Phase K (content migration — port 5–10 best blog posts, 10–20 transcripts, 5 earnings briefs from Webflow CSVs).

**Stop check:** Lighthouse score > 90 on all pages, GA4 firing in test mode, sitemap valid.

### SUNDAY (May 4 morning, ~6 hrs)

**Goal:** Production deploy, DNS cutover, smoke test.

- 09:00–11:00: Phase L (production env vars, Stripe live keys, deploy to Vercel production).
- 11:00–13:00: DNS cutover. Update Cloudflare DNS A/CNAME to Vercel.
- 13:00–15:00: Smoke test (Section 14). Fix critical issues.
- 15:00–18:00: Buffer / polish / 301 redirects from old Webflow URLs.
- 18:00: Site live. Decommission Webflow (just leave it dormant, don't delete yet).
- 19:00 onwards: Marketing announcement.

---

## 5. PROJECT INITIALIZATION

### 5.1 Phase A — Repo bootstrap

```bash
# Create repo locally
mkdir transcript-iq && cd transcript-iq

# Use the official Payload + Next.js starter
npx create-payload-app@latest \
  --name transcript-iq \
  --template blank \
  --db postgres \
  --no-deps

cd transcript-iq

# Install dependencies
pnpm install

# Add the rest of the stack
pnpm add @payloadcms/plugin-seo @payloadcms/plugin-redirects @payloadcms/plugin-stripe \
  @payloadcms/storage-vercel-blob @payloadcms/richtext-lexical \
  stripe @stripe/stripe-js \
  resend react-email @react-email/components \
  @anthropic-ai/sdk \
  @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-dropdown-menu \
  class-variance-authority clsx tailwind-merge lucide-react \
  zod react-hook-form @hookform/resolvers

pnpm add -D @types/node @types/react

# Tailwind + shadcn
pnpm dlx shadcn@latest init -d
pnpm dlx shadcn@latest add button card input label form dialog dropdown-menu badge separator

# Initial commit
git init
git add .
git commit -m "Initial Payload + Next.js scaffold"
```

### 5.2 Environment variables

Create `.env.local`:

```bash
# Payload
PAYLOAD_SECRET=<generate with: openssl rand -base64 32>
DATABASE_URI=postgres://USER:PASS@HOST.neon.tech/transcriptiq?sslmode=require

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Transcript IQ

# Stripe (TEST keys for now)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (you'll get this Friday from `stripe listen`)

# Resend
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL="Transcript IQ <hello@transcript-iq.com>"

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Vercel Blob (auto-injected on deploy; for local dev:)
BLOB_READ_WRITE_TOKEN=vercel_blob_...

# Analytics (Sunday)
NEXT_PUBLIC_GA4_ID=G-...
NEXT_PUBLIC_META_PIXEL_ID=...
NEXT_PUBLIC_LINKEDIN_PARTNER_ID=...
```

### 5.3 Folder structure

Target structure after Phase B:

```
transcript-iq/
├── src/
│   ├── app/
│   │   ├── (frontend)/                    # Public site
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                   # Home
│   │   │   ├── about/page.tsx
│   │   │   ├── pricing/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx              # Blog index
│   │   │   │   └── [slug]/page.tsx       # Blog post
│   │   │   ├── transcripts/
│   │   │   │   ├── page.tsx              # Browse transcripts
│   │   │   │   └── [slug]/page.tsx       # Transcript detail
│   │   │   ├── earnings/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── account/                  # Webapp (paywalled)
│   │   │   │   ├── layout.tsx            # Auth required
│   │   │   │   ├── page.tsx              # Dashboard
│   │   │   │   ├── purchases/page.tsx
│   │   │   │   ├── settings/page.tsx
│   │   │   │   └── read/[slug]/page.tsx  # Gated reader
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── (legal)/
│   │   │       ├── privacy/page.tsx
│   │   │       └── terms/page.tsx
│   │   ├── (payload)/                    # Payload admin (auto-scaffolded)
│   │   ├── api/
│   │   │   ├── stripe/
│   │   │   │   ├── checkout/route.ts
│   │   │   │   └── webhook/route.ts
│   │   │   ├── ai/
│   │   │   │   └── draft/route.ts        # Claude content helper
│   │   │   └── og/
│   │   │       └── route.tsx             # OG image generation
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   └── llms.txt/route.ts
│   ├── collections/
│   │   ├── Users.ts
│   │   ├── Media.ts
│   │   ├── Pages.ts
│   │   ├── BlogPosts.ts
│   │   ├── ExpertTranscripts.ts
│   │   ├── EarningsBriefs.ts
│   │   ├── Categories.ts
│   │   ├── Industries.ts
│   │   ├── Authors.ts
│   │   ├── Orders.ts
│   │   └── Subscriptions.ts
│   ├── globals/
│   │   ├── SiteSettings.ts
│   │   └── Header.ts
│   ├── blocks/                           # Reusable Page blocks
│   │   ├── Hero.ts
│   │   ├── FeatureGrid.ts
│   │   ├── TestimonialBlock.ts
│   │   ├── CTABlock.ts
│   │   ├── FAQBlock.ts
│   │   └── RichTextBlock.ts
│   ├── components/
│   │   ├── ui/                           # shadcn primitives
│   │   ├── site/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Analytics.tsx
│   │   │   └── CookieBanner.tsx
│   │   ├── content/
│   │   │   ├── PostCard.tsx
│   │   │   ├── TranscriptCard.tsx
│   │   │   └── BriefCard.tsx
│   │   └── account/
│   │       ├── DashboardNav.tsx
│   │       └── PurchaseList.tsx
│   ├── lib/
│   │   ├── payload.ts                    # Payload client helpers
│   │   ├── stripe.ts
│   │   ├── resend.ts
│   │   ├── anthropic.ts
│   │   ├── auth.ts
│   │   └── seo.ts
│   ├── styles/
│   │   └── globals.css
│   ├── payload.config.ts
│   └── payload-types.ts                  # Auto-generated
├── public/
├── migrations/
│   └── webflow-exports/                  # CSVs land here Friday
├── emails/
│   ├── PurchaseReceipt.tsx
│   └── PasswordReset.tsx
├── .env.local
├── next.config.mjs
├── tailwind.config.ts
└── package.json
```

---

## 6. PAYLOAD COLLECTIONS

Detailed schemas. Each is one file in `src/collections/`. Claude Code can generate these directly from the spec below.

### 6.1 Users

```ts
// src/collections/Users.ts
import { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    cookies: { secure: true, sameSite: 'lax' },
    tokenExpiration: 60 * 60 * 24 * 30, // 30 days
  },
  admin: { useAsTitle: 'email' },
  access: {
    read: ({ req }) => req.user?.role === 'admin' ? true : { id: { equals: req.user?.id } },
    create: () => true, // self-registration
    update: ({ req }) => req.user?.role === 'admin' ? true : { id: { equals: req.user?.id } },
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'select',
      options: ['customer', 'editor', 'admin'],
      defaultValue: 'customer', required: true,
      access: { update: ({ req }) => req.user?.role === 'admin' } },
    { name: 'company', type: 'text' },
    { name: 'stripeCustomerId', type: 'text', admin: { readOnly: true } },
    { name: 'purchases', type: 'relationship',
      relationTo: ['expert-transcripts', 'earnings-briefs'],
      hasMany: true,
      admin: { readOnly: true } },
    { name: 'activeSubscription', type: 'relationship', relationTo: 'subscriptions' },
  ],
}
```

### 6.2 Media

```ts
// src/collections/Media.ts
import { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'media',
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 432, position: 'centre' },
      { name: 'hero', width: 1920, height: 1080, position: 'centre' },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
    mimeTypes: ['image/*', 'application/pdf'],
  },
  fields: [
    { name: 'alt', type: 'text', required: true },
    { name: 'caption', type: 'text' },
  ],
}
```

### 6.3 Pages (flexible blocks)

```ts
// src/collections/Pages.ts
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug', '_status'] },
  versions: { drafts: true },
  access: {
    read: ({ req }) => req.user ? true : { _status: { equals: 'published' } },
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true,
      hooks: { beforeValidate: [({ value, data }) => value || slugify(data?.title)] } },
    { name: 'layout', type: 'blocks',
      blocks: [Hero, FeatureGrid, TestimonialBlock, CTABlock, FAQBlock, RichTextBlock] },
    { name: 'meta', type: 'group', fields: [
      { name: 'title', type: 'text' },
      { name: 'description', type: 'textarea' },
      { name: 'image', type: 'upload', relationTo: 'media' },
      { name: 'noIndex', type: 'checkbox' },
    ]},
  ],
}
```

### 6.4 BlogPosts

```ts
export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'author', 'publishedAt', '_status'] },
  versions: { drafts: true },
  access: { read: publishedOnly },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'author', type: 'relationship', relationTo: 'authors', required: true },
    { name: 'categories', type: 'relationship', relationTo: 'categories', hasMany: true },
    { name: 'industries', type: 'relationship', relationTo: 'industries', hasMany: true },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'excerpt', type: 'textarea', maxLength: 280 },
    { name: 'body', type: 'richText' }, // Lexical editor
    { name: 'readTime', type: 'number', admin: { description: 'Auto-calculated on save', readOnly: true } },
    { name: 'publishedAt', type: 'date', defaultValue: () => new Date() },
    { name: 'featured', type: 'checkbox' },
    { name: 'meta', type: 'group', fields: [/* same as Pages */] },
  ],
  hooks: {
    beforeChange: [({ data }) => {
      // auto-calculate read time from body word count
      const text = JSON.stringify(data.body || '')
      const words = text.split(/\s+/).length
      data.readTime = Math.max(1, Math.round(words / 200))
      return data
    }],
  },
}
```

### 6.5 ExpertTranscripts

```ts
export const ExpertTranscripts: CollectionConfig = {
  slug: 'expert-transcripts',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'industry', 'priceUsd', '_status'] },
  versions: { drafts: true },
  access: { read: publishedOnly },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'expertId', type: 'text', required: true,
      admin: { description: 'Format: EXP-001 (always anonymized)' } },
    { name: 'expertFormerTitle', type: 'text', required: true,
      admin: { description: 'e.g. "Former VP Engineering, Major SaaS Co" — never name companies' } },
    { name: 'industries', type: 'relationship', relationTo: 'industries', hasMany: true },
    { name: 'geography', type: 'select', hasMany: true,
      options: ['North America', 'Europe', 'APAC', 'India', 'China', 'SEA', 'MENA', 'LATAM'] },
    { name: 'dateConducted', type: 'date', required: true },
    { name: 'duration', type: 'number', label: 'Duration (minutes)' },
    { name: 'pageCount', type: 'number' },
    { name: 'summary', type: 'textarea', maxLength: 500 },
    { name: 'keyTakeaways', type: 'array', fields: [{ name: 'point', type: 'text' }] },
    { name: 'fullTranscript', type: 'richText' },
    { name: 'pdfFile', type: 'upload', relationTo: 'media' },
    { name: 'priceUsd', type: 'number', required: true, defaultValue: 199 },
    { name: 'priceInr', type: 'number', defaultValue: 16500 },
    { name: 'stripePriceId', type: 'text', admin: { description: 'Auto-synced via Stripe plugin' } },
    { name: 'featured', type: 'checkbox' },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'meta', type: 'group', fields: [/* SEO fields */] },
  ],
}
```

### 6.6 EarningsBriefs

```ts
export const EarningsBriefs: CollectionConfig = {
  slug: 'earnings-briefs',
  admin: { useAsTitle: 'title' },
  versions: { drafts: true },
  access: { read: publishedOnly },
  fields: [
    { name: 'title', type: 'text', required: true,
      admin: { description: 'e.g. "Apple Q2 2026 Earnings Brief"' } },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'companyName', type: 'text', required: true },
    { name: 'ticker', type: 'text', required: true },
    { name: 'exchange', type: 'select', options: ['NASDAQ', 'NYSE', 'NSE', 'BSE', 'LSE', 'HKEX', 'SGX', 'TSE', 'ASX'] },
    { name: 'quarter', type: 'select', options: ['Q1', 'Q2', 'Q3', 'Q4', 'FY'] },
    { name: 'fiscalYear', type: 'number', required: true },
    { name: 'industries', type: 'relationship', relationTo: 'industries', hasMany: true },
    { name: 'reportDate', type: 'date', required: true },
    { name: 'pageCount', type: 'number' },
    { name: 'executiveSummary', type: 'textarea', maxLength: 800 },
    { name: 'keyMetrics', type: 'array', fields: [
      { name: 'metric', type: 'text' },
      { name: 'value', type: 'text' },
      { name: 'yoyChange', type: 'text' },
    ]},
    { name: 'fullBrief', type: 'richText' },
    { name: 'pdfFile', type: 'upload', relationTo: 'media' },
    { name: 'priceUsd', type: 'number', required: true, defaultValue: 99 },
    { name: 'priceInr', type: 'number', defaultValue: 8200 },
    { name: 'stripePriceId', type: 'text', admin: { readOnly: true } },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'meta', type: 'group', fields: [/* SEO fields */] },
  ],
}
```

### 6.7 Categories, Industries, Authors

Standard taxonomy collections. Each has `name`, `slug`, `description`. `Authors` additionally has `bio`, `avatar`, `linkedIn`, `twitter`, `email`.

### 6.8 Orders

```ts
export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: { useAsTitle: 'id', defaultColumns: ['user', 'totalUsd', 'status', 'createdAt'] },
  access: {
    read: ({ req }) => req.user?.role === 'admin' ? true : { user: { equals: req.user?.id } },
    create: () => false, // only created via Stripe webhook
    update: ({ req }) => req.user?.role === 'admin',
    delete: () => false,
  },
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users', required: true },
    { name: 'items', type: 'relationship',
      relationTo: ['expert-transcripts', 'earnings-briefs'],
      hasMany: true, required: true },
    { name: 'totalUsd', type: 'number', required: true },
    { name: 'totalInr', type: 'number' },
    { name: 'currency', type: 'select', options: ['usd', 'inr'], required: true },
    { name: 'status', type: 'select',
      options: ['pending', 'paid', 'refunded', 'failed'],
      defaultValue: 'pending' },
    { name: 'paymentProvider', type: 'select', options: ['stripe', 'razorpay'] },
    { name: 'stripeCheckoutId', type: 'text' },
    { name: 'stripePaymentIntentId', type: 'text' },
    { name: 'razorpayOrderId', type: 'text' },
    { name: 'invoiceUrl', type: 'text' },
  ],
}
```

### 6.9 Subscriptions

```ts
export const Subscriptions: CollectionConfig = {
  slug: 'subscriptions',
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users', required: true },
    { name: 'tier', type: 'select', options: ['starter', 'professional', 'enterprise'] },
    { name: 'status', type: 'select',
      options: ['active', 'past_due', 'canceled', 'paused'] },
    { name: 'stripeSubscriptionId', type: 'text', unique: true },
    { name: 'currentPeriodEnd', type: 'date' },
    { name: 'cancelAt', type: 'date' },
  ],
}
```

### 6.10 Globals

```ts
// src/globals/SiteSettings.ts
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  fields: [
    { name: 'companyName', type: 'text', defaultValue: 'Transcript IQ' },
    { name: 'tagline', type: 'text' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'logoDark', type: 'upload', relationTo: 'media' },
    { name: 'favicon', type: 'upload', relationTo: 'media' },
    { name: 'social', type: 'group', fields: [
      { name: 'twitter', type: 'text' },
      { name: 'linkedin', type: 'text' },
      { name: 'youtube', type: 'text' },
    ]},
    { name: 'navigation', type: 'array', fields: [
      { name: 'label', type: 'text' },
      { name: 'url', type: 'text' },
      { name: 'children', type: 'array', fields: [
        { name: 'label', type: 'text' },
        { name: 'url', type: 'text' },
      ]},
    ]},
    { name: 'footerLinks', type: 'array', fields: [/* same shape */] },
    { name: 'defaultMeta', type: 'group', fields: [
      { name: 'title', type: 'text' },
      { name: 'description', type: 'textarea' },
      { name: 'image', type: 'upload', relationTo: 'media' },
    ]},
  ],
}
```

---

## 7. PAYLOAD CONFIG

```ts
// src/payload.config.ts
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { stripePlugin } from '@payloadcms/plugin-stripe'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'

import { Users, Media, Pages, BlogPosts, ExpertTranscripts, EarningsBriefs,
  Categories, Industries, Authors, Orders, Subscriptions } from './collections'
import { SiteSettings, Header } from './globals'

export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: ' — Transcript IQ Admin',
      icons: [{ rel: 'icon', url: '/favicon.svg' }],
    },
  },
  editor: lexicalEditor(),
  collections: [Users, Media, Pages, BlogPosts, ExpertTranscripts, EarningsBriefs,
    Categories, Industries, Authors, Orders, Subscriptions],
  globals: [SiteSettings],
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI },
  }),
  plugins: [
    seoPlugin({
      collections: ['pages', 'blog-posts', 'expert-transcripts', 'earnings-briefs'],
      generateTitle: ({ doc }) => `${doc.title} — Transcript IQ`,
    }),
    redirectsPlugin({ collections: ['pages', 'blog-posts'] }),
    stripePlugin({
      stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
      stripeWebhooksEndpointSecret: process.env.STRIPE_WEBHOOK_SECRET,
      sync: [
        { collection: 'expert-transcripts',
          stripeResourceType: 'products',
          stripeResourceTypeSingular: 'product',
          fields: [
            { fieldPath: 'title', stripeProperty: 'name' },
            { fieldPath: 'priceUsd', stripeProperty: 'default_price.unit_amount',
              transform: (v) => v * 100 },
          ]},
        { collection: 'earnings-briefs', stripeResourceType: 'products',
          stripeResourceTypeSingular: 'product',
          fields: [/* same */] },
      ],
    }),
    vercelBlobStorage({
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN!,
    }),
  ],
  secret: process.env.PAYLOAD_SECRET!,
  typescript: { outputFile: path.resolve(__dirname, 'payload-types.ts') },
})
```

---

## 8. DESIGN SYSTEM

Carry over from existing Nextyn IQ work — same tokens.

```ts
// tailwind.config.ts
export default {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sapphire: {
          50: '#EFF6FF', 100: '#DBEAFE', 200: '#BFDBFE',
          400: '#60A5FA', 500: '#3B82F6', 600: '#2563EB', // primary
          700: '#1D4ED8', 800: '#1E40AF', 900: '#1E3A8A',
        },
        ink: { /* neutrals */ },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['General Sans', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px', lg: '12px', xl: '16px',
      },
    },
  },
}
```

**Type rules (carry over from Nextyn brand):**
- Display headings: General Sans 600
- Body / UI: Inter 400, 500
- Data values: JetBrains Mono 500
- Sentence case throughout. Never Title Case. Never ALL CAPS.

**Layout rules:**
- Max content width 1200px
- Grid: 12-col, 24px gutter desktop, 16px mobile
- Vertical rhythm: 8px base unit

---

## 9. AUTHENTICATION

Payload's built-in auth handles all of it. Just need frontend pages.

### 9.1 Pages to build

- `/login` — email + password, link to register, link to forgot password
- `/register` — email + password + name + company (optional)
- `/forgot-password` — request reset link
- `/reset-password/[token]` — set new password
- `/account` — protected layout, redirect to /login if no session

### 9.2 Auth helper

```ts
// src/lib/auth.ts
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function getCurrentUser() {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  return user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return user
}
```

### 9.3 Protect /account

```ts
// src/app/(frontend)/account/layout.tsx
import { requireAuth } from '@/lib/auth'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  await requireAuth()
  return <>{children}</>
}
```

---

## 10. PAYMENTS — STRIPE

### 10.1 Checkout flow

```ts
// src/app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getCurrentUser } from '@/lib/auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const { productId, productType } = await req.json() // 'expert-transcripts' | 'earnings-briefs'
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Auth required' }, { status: 401 })

  // Look up product, get stripePriceId, etc.
  const product = await fetchProduct(productType, productId)

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{ price: product.stripePriceId, quantity: 1 }],
    customer_email: user.email,
    client_reference_id: user.id,
    metadata: { productId, productType, userId: user.id },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account/purchases?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${productType}/${product.slug}`,
  })

  return NextResponse.json({ url: session.url })
}
```

### 10.2 Webhook (fulfillment)

```ts
// src/app/api/stripe/webhook/route.ts
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { sendReceipt } from '@/lib/resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = (await headers()).get('stripe-signature')!
  const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const { productId, productType, userId } = session.metadata!

    const payload = await getPayload({ config })

    // Create order record
    const order = await payload.create({ collection: 'orders', data: {
      user: userId,
      items: [{ relationTo: productType, value: productId }],
      totalUsd: session.amount_total! / 100,
      currency: session.currency,
      status: 'paid',
      paymentProvider: 'stripe',
      stripeCheckoutId: session.id,
      stripePaymentIntentId: session.payment_intent as string,
    }})

    // Grant access — append to user.purchases
    const user = await payload.findByID({ collection: 'users', id: userId })
    await payload.update({ collection: 'users', id: userId, data: {
      purchases: [...(user.purchases || []), { relationTo: productType, value: productId }],
    }})

    // Email receipt
    await sendReceipt({ to: user.email, orderId: order.id, productType, productId })
  }

  return new Response('ok', { status: 200 })
}
```

### 10.3 Paywall on reader page

```tsx
// src/app/(frontend)/account/read/[slug]/page.tsx
import { getCurrentUser } from '@/lib/auth'
import { hasAccessTo } from '@/lib/access'

export default async function ReaderPage({ params }) {
  const user = await requireAuth()
  const { slug } = await params

  const item = await fetchBySlug(slug)
  if (!hasAccessTo(user, item)) redirect(`/${item.type}/${slug}?paywall=true`)

  return <TranscriptReader item={item} />
}
```

---

## 11. EMAIL (Resend + React Email)

```tsx
// emails/PurchaseReceipt.tsx
import { Body, Container, Head, Html, Preview, Text, Heading, Button } from '@react-email/components'

export default function PurchaseReceipt({ name, productTitle, amount, readUrl }) {
  return (
    <Html>
      <Head />
      <Preview>Your Transcript IQ purchase receipt</Preview>
      <Body style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#f9fafb' }}>
        <Container>
          <Heading>Thanks for your purchase, {name}</Heading>
          <Text>You now have access to <strong>{productTitle}</strong>.</Text>
          <Text>Amount: ${amount}</Text>
          <Button href={readUrl} style={{ background: '#2563EB', color: 'white', padding: '12px 24px' }}>
            Read now
          </Button>
        </Container>
      </Body>
    </Html>
  )
}
```

```ts
// src/lib/resend.ts
import { Resend } from 'resend'
import PurchaseReceipt from '@/emails/PurchaseReceipt'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendReceipt({ to, orderId, productType, productId }) {
  const item = await fetchBySlug(productType, productId)
  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject: `Receipt: ${item.title}`,
    react: <PurchaseReceipt
      name={user.name}
      productTitle={item.title}
      amount={item.priceUsd}
      readUrl={`${process.env.NEXT_PUBLIC_SITE_URL}/account/read/${item.slug}`}
    />,
  })
}
```

---

## 12. SEO / AEO / GEO

### 12.1 sitemap.xml

```ts
// src/app/sitemap.ts
import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@/payload.config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })
  const base = process.env.NEXT_PUBLIC_SITE_URL!

  const [pages, posts, transcripts, briefs] = await Promise.all([
    payload.find({ collection: 'pages', limit: 500, where: { _status: { equals: 'published' } } }),
    payload.find({ collection: 'blog-posts', limit: 1000, where: { _status: { equals: 'published' } } }),
    payload.find({ collection: 'expert-transcripts', limit: 5000, where: { _status: { equals: 'published' } } }),
    payload.find({ collection: 'earnings-briefs', limit: 5000, where: { _status: { equals: 'published' } } }),
  ])

  return [
    { url: base, changeFrequency: 'weekly', priority: 1 },
    ...pages.docs.map(p => ({ url: `${base}/${p.slug}`, lastModified: p.updatedAt, priority: 0.7 })),
    ...posts.docs.map(p => ({ url: `${base}/blog/${p.slug}`, lastModified: p.updatedAt, priority: 0.6 })),
    ...transcripts.docs.map(t => ({ url: `${base}/transcripts/${t.slug}`, lastModified: t.updatedAt, priority: 0.8 })),
    ...briefs.docs.map(b => ({ url: `${base}/earnings/${b.slug}`, lastModified: b.updatedAt, priority: 0.8 })),
  ]
}
```

### 12.2 robots.txt

```ts
// src/app/robots.ts
export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/account', '/admin', '/api'] }],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  }
}
```

### 12.3 llms.txt (AEO/GEO)

```ts
// src/app/llms.txt/route.ts
export async function GET() {
  const payload = await getPayload({ config })
  const featured = await payload.find({ collection: 'blog-posts', limit: 30,
    where: { featured: { equals: true }, _status: { equals: 'published' } }})

  const lines = [
    '# Transcript IQ',
    'B2B intelligence platform offering anonymized expert call transcripts and earnings analysis briefs.',
    '',
    '## Featured insights',
    ...featured.docs.map(p => `- [${p.title}](${process.env.NEXT_PUBLIC_SITE_URL}/blog/${p.slug}): ${p.excerpt}`),
    '',
    '## Products',
    `- [Expert call transcripts](${process.env.NEXT_PUBLIC_SITE_URL}/transcripts)`,
    `- [Earnings analysis briefs](${process.env.NEXT_PUBLIC_SITE_URL}/earnings)`,
  ]

  return new Response(lines.join('\n'), { headers: { 'content-type': 'text/plain' } })
}
```

### 12.4 Schema.org JSON-LD

Component pattern:

```tsx
// src/components/site/Schema.tsx
export function ArticleSchema({ post }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage?.url,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { '@type': 'Person', name: post.author.name },
    publisher: { '@type': 'Organization', name: 'Transcript IQ',
      logo: { '@type': 'ImageObject', url: '/logo.png' } },
  }
  return <script type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
```

Build versions for `Article`, `Product` (transcripts/briefs), `Organization` (footer of every page), `BreadcrumbList`, `FAQPage` (where used).

### 12.5 OG image generation

```tsx
// src/app/api/og/route.tsx
import { ImageResponse } from 'next/og'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') ?? 'Transcript IQ'

  return new ImageResponse(
    <div style={{ /* ... full styled div */ }}>
      <h1>{title}</h1>
      <div>Transcript IQ</div>
    </div>,
    { width: 1200, height: 630 },
  )
}
```

Reference in metadata: `og:image=/api/og?title={encodeURIComponent(post.title)}`.

---

## 13. ANALYTICS COMPONENT

Single component, consent-aware, all tags in one place.

```tsx
// src/components/site/Analytics.tsx
'use client'
import Script from 'next/script'
import { useEffect, useState } from 'react'

export function Analytics() {
  const [consent, setConsent] = useState(false)
  useEffect(() => { setConsent(localStorage.getItem('cookieConsent') === 'true') }, [])
  if (!consent) return null

  return (
    <>
      {/* GA4 */}
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GA4_ID}');
      `}</Script>

      {/* Meta Pixel */}
      <Script id="meta-pixel" strategy="afterInteractive">{`
        !function(f,b,e,v,n,t,s){...}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
        fbq('track', 'PageView');
      `}</Script>

      {/* LinkedIn Insight Tag */}
      <Script id="linkedin-insight" strategy="afterInteractive">{`
        _linkedin_partner_id = '${process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID}';
        ...
      `}</Script>
    </>
  )
}
```

---

## 14. AI INTEGRATION (v1)

Three Claude-powered helpers in admin. Wire each as a Payload custom view or button.

### 14.1 Draft post from brief

```ts
// src/app/api/ai/draft/route.ts
import Anthropic from '@anthropic-ai/sdk'
const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function POST(req: Request) {
  const { brief, type } = await req.json() // type: 'blog' | 'transcript-summary' | 'earnings-summary'
  const systemPrompt = await loadNextynVoiceSkill()

  const msg = await claude.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: `Brief:\n${brief}\n\nDraft a ${type} in Nextyn voice.` }],
  })

  return Response.json({ draft: msg.content[0].text })
}
```

`loadNextynVoiceSkill()` returns the Nextyn brand voice guide as a system prompt — copy it from the existing `nextyn-brand-voice` skill.

### 14.2 SEO meta auto-fill

Same pattern — POST body to a route, Claude returns `{ title, description }` based on the article.

### 14.3 Tag suggestions

Same pattern — Claude reads the body, suggests categories and industries from existing taxonomy.

These are buttons in the admin sidebar of the relevant collection. Phase 2 expands into draft generation, programmatic page generation, and internal linking automation.

---

## 15. CONTENT MIGRATION

### 15.1 Friday: Webflow CSV exports

Save to `migrations/webflow-exports/`:
- `blog-posts.csv`
- `transcripts.csv`
- `earnings-briefs.csv` (if any exist)
- `categories.csv`, `industries.csv`, `authors.csv`

### 15.2 Saturday: Import script

```ts
// migrations/import.ts
import { getPayload } from 'payload'
import config from '@/payload.config'
import fs from 'fs'
import { parse } from 'csv-parse/sync'

async function importBlogPosts() {
  const payload = await getPayload({ config })
  const csv = fs.readFileSync('./migrations/webflow-exports/blog-posts.csv', 'utf8')
  const rows = parse(csv, { columns: true })

  for (const row of rows) {
    await payload.create({ collection: 'blog-posts', data: {
      title: row.Name,
      slug: row.Slug,
      excerpt: row.Summary,
      body: htmlToLexical(row['Post Body']), // need a converter
      publishedAt: new Date(row['Published On']),
      _status: 'published',
    }})
  }
}

importBlogPosts().then(() => process.exit(0))
```

Run: `pnpm tsx migrations/import.ts`.

### 15.3 Sunday: 301 redirects

For every URL on Webflow that's moving:

```ts
// Use the redirects plugin's admin UI, or seed via API:
await payload.create({ collection: 'redirects', data: {
  from: '/blog-old-slug',
  to: { type: 'reference', reference: { relationTo: 'blog-posts', value: newPostId } },
  type: '301',
}})
```

For URL patterns that don't have direct equivalents, redirect to the most relevant new page or a landing page.

---

## 16. DEPLOYMENT (Sunday morning)

### 16.1 GitHub + Vercel

```bash
git remote add origin git@github.com:nextyn/transcript-iq.git
git push -u origin main
```

In Vercel:
1. Import Git Repository → select `transcript-iq`
2. Framework: Next.js (auto-detected)
3. Add environment variables (paste all production keys, **not** test keys)
4. Deploy

### 16.2 Custom domain

In Vercel project → Settings → Domains:
1. Add `transcript-iq.com`
2. Add `www.transcript-iq.com` (redirect to apex)
3. Vercel gives you DNS records — go to Cloudflare → add `A` record for apex pointing to Vercel's IP, `CNAME` for www.

### 16.3 Stripe live mode

1. Switch toggle to Live mode in Stripe dashboard.
2. Replace test keys in Vercel env vars with live keys.
3. Set webhook endpoint: `https://transcript-iq.com/api/stripe/webhook`
4. Copy webhook signing secret → `STRIPE_WEBHOOK_SECRET` in Vercel.

### 16.4 DNS cutover

In Cloudflare DNS:
1. Delete or disable Webflow A/CNAME records.
2. Verify Vercel records are active.
3. Set Cloudflare proxy status to "DNS only" (gray cloud) for the Vercel records — Vercel handles SSL.
4. Wait 5–60 minutes for propagation.

Test from `dnschecker.org` until 100% green globally.

---

## 17. SUNDAY SMOKE TEST CHECKLIST

Don't announce launch until every box is green.

**Public site**
- [ ] Home loads, all blocks render
- [ ] About, Pricing, Contact, How it works pages render
- [ ] Blog index loads, post detail loads
- [ ] /transcripts loads, filter works, detail page loads
- [ ] /earnings loads, detail page loads
- [ ] Mobile responsive on iPhone + Android
- [ ] Dark mode toggle works (if shipping; otherwise OK to defer)

**Auth**
- [ ] Register a new account, get welcome email
- [ ] Log out, log back in
- [ ] Forgot password → reset link in email → reset works
- [ ] Account dashboard loads when logged in, redirects to /login when not

**Payments**
- [ ] Click "Buy" on a transcript → Stripe Checkout opens
- [ ] Use real card with small test purchase ($1 test product) — payment goes through
- [ ] Receipt email arrives
- [ ] /account/purchases shows the item
- [ ] Click "Read" → reader page loads with full content
- [ ] Refund test purchase via Stripe dashboard

**Admin**
- [ ] Log into /admin as Pratyush
- [ ] Create a new blog post, save draft, publish, verify on site
- [ ] Upload an image, use it in a post
- [ ] Create a new transcript, set price, publish — appears on /transcripts
- [ ] Edit nav in SiteSettings → reflects on site

**SEO**
- [ ] /sitemap.xml loads, valid XML
- [ ] /robots.txt loads
- [ ] /llms.txt loads
- [ ] View source on home page → all meta tags present
- [ ] View source on a blog post → JSON-LD `Article` schema present
- [ ] Test with Google Rich Results Test → no errors
- [ ] Submit sitemap in Google Search Console

**Analytics**
- [ ] Open site in incognito, accept cookies
- [ ] GA4 → Realtime → see your visit
- [ ] Meta Pixel → Events Manager → PageView fires
- [ ] LinkedIn Campaign Manager → Insight Tag → fires

**Performance**
- [ ] Lighthouse on home: Performance > 90, SEO 100, Accessibility > 95
- [ ] Lighthouse on blog post: same thresholds
- [ ] PageSpeed Insights → Core Web Vitals all green

---

## 18. PHASE 2 ROADMAP (May 4–10)

In priority order:

1. **Razorpay** (Mon May 4) — add `razorpayPlugin`, parallel checkout button on product pages. UPI + Indian netbanking.
2. **Webflow content migration finish** (Tue–Wed May 5–6) — port remaining blog posts, transcripts, briefs. 301 redirects for all moved URLs.
3. **AI content workflows expanded** (Wed–Thu May 6–7) — programmatic SEO matrix pages (Industry × Geography combinations), internal linking suggestions, llms.txt deep content.
4. **Meilisearch** (Fri May 8) — replace Postgres FTS with proper filtered search across all content types.
5. **Editorial workflow** (Sat–Sun May 9–10) — draft → review → approve → publish states. Multi-author roles.

---

## 19. RISKS & CONTINGENCIES

| Risk | Likelihood | Mitigation |
|---|---|---|
| Stripe verification slow | Medium | Start Wednesday night. Worst case, ship with payments disabled and announce "purchases live Monday." |
| DNS doesn't propagate by Sunday | Low | Use Cloudflare (fast). Cut DNS Saturday night, not Sunday morning. |
| Webflow CSV exports are messy | High | Manually migrate top 10 anchor posts; bulk migration moved to Phase 2. |
| Payload bugs / version mismatches | Low | Pin all versions in package.json. Use `pnpm-lock.yaml` from day 1. |
| Vercel build fails | Low | Test build locally first (`pnpm build`). Don't push untested code Sunday. |
| Schema markup errors | Medium | Run Google Rich Results Test before announcement. |
| Email delivery (Resend domain not verified) | Medium | Set up domain verification Wednesday — DNS propagation needed. |

---

## 20. POST-LAUNCH WEEK 1 PRIORITIES

- Submit sitemap to Google Search Console + Bing Webmaster Tools
- Set up Google Ads conversion tracking (purchase event from GA4)
- Set up LinkedIn Conversion Tracking
- Connect Search Console → GA4 (data linking)
- Start tracking core metrics: visitors, sign-ups, purchases, conversion rate, AOV
- Begin publishing daily content (Nextyn voice) to start building topical authority
- Run first paid traffic test on LinkedIn (target: hedge fund + PE titles)

---

## END OF SPEC

Hand to Claude Code phase by phase. Don't try to execute the whole spec in one prompt — work through Phases A → L sequentially, verifying each acceptance check before moving on.

Questions or scope adjustments along the way: log them as comments in the relevant section and resolve before moving to the next phase. The Sunday deadline holds; scope adjustments mean cutting from v1 to Phase 2, not delaying v1.
