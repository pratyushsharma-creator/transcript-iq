# Phase II Performance Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate slow TTFBs by removing `force-dynamic` from all 13 frontend pages, caching Payload queries with `unstable_cache` + tag-based on-demand revalidation, caching the root layout's global query, and migrating all 22 `<img>` tags to `next/image` for automatic WebP/AVIF conversion.

**Architecture:** Three-layer caching stack — page-level ISR (`revalidate` constants + `unstable_cache`-wrapped Payload queries), on-demand cache busting via Payload `afterChange` hooks calling `revalidateTag()` on publish, and `next/image` for automatic format conversion. A shared `src/lib/cache/` module holds tag constants and all query functions; page files import from there rather than calling Payload directly.

**Tech Stack:** Next.js 15 `unstable_cache` + `revalidateTag` from `next/cache`; Payload 3 `CollectionConfig.hooks.afterChange`; `next/image` with Vercel Blob `remotePatterns`.

---

## File Map

**New files:**
- `src/lib/cache/revalidation.ts` — `CACHE_TAGS` constants + `revalidateOnPublish` helper
- `src/lib/cache/queries.ts` — all `unstable_cache`-wrapped Payload query functions

**Modified — pages (remove `force-dynamic`, add `revalidate`, swap inline Payload calls for cached helpers):**
- `src/app/(frontend)/page.tsx`
- `src/app/(frontend)/resources/page.tsx`
- `src/app/(frontend)/custom-reports/page.tsx`
- `src/app/(frontend)/free-transcript/page.tsx`
- `src/app/(frontend)/how-to-use/page.tsx`
- `src/app/(frontend)/expert-transcripts/page.tsx`
- `src/app/(frontend)/expert-transcripts/[slug]/page.tsx`
- `src/app/(frontend)/earnings-analysis/page.tsx`
- `src/app/(frontend)/earnings-analysis/[slug]/page.tsx`
- `src/app/(frontend)/resources/[slug]/page.tsx`

**Modified — layout:**
- `src/app/(frontend)/layout.tsx` — wrap `findGlobal` with `unstable_cache`

**Modified — collections/globals (add `afterChange` hooks):**
- `src/collections/ExpertTranscripts.ts`
- `src/collections/EarningsAnalyses.ts`
- `src/collections/BlogPosts.ts`
- `src/collections/Pages.ts`
- `src/collections/Industries.ts`
- `src/globals/SiteSettings.ts`

**Modified — next/image migration:**
- `next.config.ts` — add `remotePatterns`
- `src/components/site/Header.tsx`
- `src/components/blocks/Hero.tsx`
- `src/components/blocks/Media.tsx`
- `src/components/blocks/Features.tsx`
- `src/components/blocks/Conversion.tsx`
- `src/components/blocks/Interactive.tsx`
- `src/components/blocks/Trust.tsx`
- `src/components/blocks/Misc.tsx`
- `src/components/blocks/Creative.tsx`
- `src/components/blocks/Persona.tsx`

---

### Task 1: Create `src/lib/cache/revalidation.ts`

**Files:**
- Create: `src/lib/cache/revalidation.ts`

This file is the single source of truth for cache tag strings and the draft-guard helper. All other tasks import from here. Write it first.

- [ ] **Step 1: Create the file**

```typescript
// src/lib/cache/revalidation.ts
import { revalidateTag } from 'next/cache'

export const CACHE_TAGS = {
  expertTranscripts: 'expert-transcripts',
  earningsAnalyses: 'earnings-analyses',
  blogPosts: 'blog-posts',
  pages: 'pages',
  industries: 'industries',
  siteSettings: 'site-settings',
} as const

/**
 * Calls revalidateTag only when the document has been published.
 * Collections with versions: { drafts: true } fire afterChange on every
 * draft autosave. This guard prevents cache busting on draft saves.
 */
export function revalidateOnPublish(
  tag: string,
  doc: { _status?: string },
): void {
  if (doc._status !== 'published') return
  revalidateTag(tag)
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `cd "C:/Transcript IQ (Claude Build)" && npx tsc --noEmit 2>&1 | head -20`
Expected: No errors referencing `src/lib/cache/revalidation.ts`

- [ ] **Step 3: Commit**

```bash
git add src/lib/cache/revalidation.ts
git commit -m "feat: add cache tag constants and revalidateOnPublish helper"
```

---

### Task 2: Create `src/lib/cache/queries.ts`

**Files:**
- Create: `src/lib/cache/queries.ts`

This file exports every `unstable_cache`-wrapped Payload query that pages will use. Page files will import these instead of calling Payload directly. Write the complete file as shown.

**Important:** `unstable_cache` must be called at module scope (not inside a component or route handler). The second argument is the cache key prefix; runtime function arguments are appended to it automatically. The third argument sets cache tags and fallback TTL.

- [ ] **Step 1: Create the file**

```typescript
// src/lib/cache/queries.ts
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Where } from 'payload'
import { CACHE_TAGS } from './revalidation'

// ── Pages collection ──────────────────────────────────────────────────────

export const getPageBySlug = unstable_cache(
  async (slug: string) => {
    const payload = await getPayload({ config: await config })
    const res = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    })
    return res.docs[0] ?? null
  },
  ['page-by-slug'],
  { tags: [CACHE_TAGS.pages], revalidate: 3600 },
)

// ── Industries ────────────────────────────────────────────────────────────

export const getIndustries = unstable_cache(
  async () => {
    const payload = await getPayload({ config: await config })
    const res = await payload.find({
      collection: 'industries',
      limit: 50,
      sort: 'name',
    })
    return res.docs
  },
  ['industries-list'],
  { tags: [CACHE_TAGS.industries], revalidate: 3600 },
)

// ── Expert Transcripts ────────────────────────────────────────────────────

export const getTranscriptList = unstable_cache(
  async (filters: {
    industry?: string
    geography?: string
    level?: string
    tier?: string
  }) => {
    const payload = await getPayload({ config: await config })
    const andConditions: Where[] = []
    if (filters.industry) {
      const slugs = filters.industry.split(',').filter(Boolean)
      andConditions.push(
        slugs.length === 1
          ? { 'sectors.slug': { equals: slugs[0] } }
          : { 'sectors.slug': { in: slugs } },
      )
    }
    if (filters.geography) {
      const vals = filters.geography.split(',').filter(Boolean)
      andConditions.push(
        vals.length === 1
          ? { geography: { equals: vals[0] } }
          : { geography: { in: vals } },
      )
    }
    if (filters.level) {
      const vals = filters.level.split(',').filter(Boolean)
      andConditions.push(
        vals.length === 1
          ? { expertLevel: { equals: vals[0] } }
          : { expertLevel: { in: vals } },
      )
    }
    if (filters.tier) {
      const vals = filters.tier.split(',').filter(Boolean)
      andConditions.push(
        vals.length === 1
          ? { tier: { equals: vals[0] } }
          : { tier: { in: vals } },
      )
    }
    const res = await payload.find({
      collection: 'expert-transcripts',
      where: andConditions.length > 0 ? { and: andConditions } : undefined,
      limit: 24,
      page: 1,
      sort: '-dateConducted',
      depth: 2,
    })
    return { docs: res.docs, totalDocs: res.totalDocs }
  },
  ['expert-transcripts-list'],
  { tags: [CACHE_TAGS.expertTranscripts, CACHE_TAGS.industries], revalidate: 3600 },
)

export const getTranscriptBySlug = unstable_cache(
  async (slug: string) => {
    const payload = await getPayload({ config: await config })
    const { docs } = await payload.find({
      collection: 'expert-transcripts',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    })
    return docs[0] ?? null
  },
  ['expert-transcript-by-slug'],
  { tags: [CACHE_TAGS.expertTranscripts], revalidate: 86400 },
)

export const getRelatedTranscripts = unstable_cache(
  async (currentSlug: string, sectorSlugs: string[]) => {
    const payload = await getPayload({ config: await config })
    const where: Where =
      sectorSlugs.length > 0
        ? { and: [{ slug: { not_equals: currentSlug } }, { 'sectors.slug': { in: sectorSlugs } }] }
        : { slug: { not_equals: currentSlug } }
    const { docs } = await payload.find({
      collection: 'expert-transcripts',
      where,
      limit: 3,
      sort: '-dateConducted',
      depth: 1,
    })
    return docs
  },
  ['expert-transcripts-related'],
  { tags: [CACHE_TAGS.expertTranscripts], revalidate: 86400 },
)

// ── Earnings Analyses ─────────────────────────────────────────────────────

export const getEarningsAnalysisList = unstable_cache(
  async (filters: {
    sector?: string
    exchange?: string
    quarter?: string
    performance?: string
  }) => {
    const payload = await getPayload({ config: await config })
    const andConditions: Where[] = []
    if (filters.sector) {
      const slugs = filters.sector.split(',').filter(Boolean)
      andConditions.push(
        slugs.length === 1
          ? { 'sectors.slug': { equals: slugs[0] } }
          : { 'sectors.slug': { in: slugs } },
      )
    }
    if (filters.exchange) {
      const vals = filters.exchange.split(',').filter(Boolean)
      andConditions.push(
        vals.length === 1
          ? { exchange: { equals: vals[0] } }
          : { exchange: { in: vals } },
      )
    }
    if (filters.quarter) {
      const vals = filters.quarter.split(',').filter(Boolean)
      andConditions.push(
        vals.length === 1
          ? { quarter: { equals: vals[0] } }
          : { quarter: { in: vals } },
      )
    }
    if (filters.performance) {
      const vals = filters.performance.split(',').filter(Boolean)
      andConditions.push(
        vals.length === 1
          ? { performanceBadges: { equals: vals[0] } }
          : { performanceBadges: { in: vals } },
      )
    }
    const res = await payload.find({
      collection: 'earnings-analyses',
      where: andConditions.length > 0 ? { and: andConditions } : undefined,
      limit: 24,
      page: 1,
      sort: '-reportDate',
      depth: 2,
    })
    return { docs: res.docs, totalDocs: res.totalDocs }
  },
  ['earnings-analyses-list'],
  { tags: [CACHE_TAGS.earningsAnalyses, CACHE_TAGS.industries], revalidate: 3600 },
)

export const getEarningsAnalysisBySlug = unstable_cache(
  async (slug: string) => {
    const payload = await getPayload({ config: await config })
    const { docs } = await payload.find({
      collection: 'earnings-analyses',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    })
    return docs[0] ?? null
  },
  ['earnings-analysis-by-slug'],
  { tags: [CACHE_TAGS.earningsAnalyses], revalidate: 86400 },
)

export const getRelatedEarningsAnalyses = unstable_cache(
  async (currentSlug: string, sectorSlugs: string[]) => {
    const payload = await getPayload({ config: await config })
    const where: Where =
      sectorSlugs.length > 0
        ? { and: [{ slug: { not_equals: currentSlug } }, { 'sectors.slug': { in: sectorSlugs } }] }
        : { slug: { not_equals: currentSlug } }
    const { docs } = await payload.find({
      collection: 'earnings-analyses',
      where,
      limit: 3,
      sort: '-reportDate',
      depth: 0,
    })
    return docs
  },
  ['earnings-analyses-related'],
  { tags: [CACHE_TAGS.earningsAnalyses], revalidate: 86400 },
)

// ── Blog Posts ────────────────────────────────────────────────────────────

export const getBlogPostBySlug = unstable_cache(
  async (slug: string) => {
    const payload = await getPayload({ config: await config })
    const res = await payload.find({
      collection: 'blog-posts',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    })
    return res.docs[0] ?? null
  },
  ['blog-post-by-slug'],
  { tags: [CACHE_TAGS.blogPosts], revalidate: 86400 },
)

export const getRelatedBlogPosts = unstable_cache(
  async (currentSlug: string, contentType: string) => {
    const payload = await getPayload({ config: await config })
    const res = await payload.find({
      collection: 'blog-posts',
      where: {
        _status: { equals: 'published' },
        slug: { not_equals: currentSlug },
        contentType: { equals: contentType },
      },
      limit: 3,
      depth: 1,
    })
    return res.docs
  },
  ['blog-posts-related'],
  { tags: [CACHE_TAGS.blogPosts], revalidate: 86400 },
)

export const getNextBlogPost = unstable_cache(
  async (currentSlug: string) => {
    const payload = await getPayload({ config: await config })
    const res = await payload.find({
      collection: 'blog-posts',
      where: {
        _status: { equals: 'published' },
        slug: { not_equals: currentSlug },
      },
      sort: '-publishedAt',
      limit: 1,
      depth: 1,
    })
    return res.docs[0] ?? null
  },
  ['blog-post-next'],
  { tags: [CACHE_TAGS.blogPosts], revalidate: 3600 },
)
```

- [ ] **Step 2: Verify TypeScript**

Run: `cd "C:/Transcript IQ (Claude Build)" && npx tsc --noEmit 2>&1 | head -30`
Expected: No errors from `src/lib/cache/queries.ts`

- [ ] **Step 3: Commit**

```bash
git add src/lib/cache/queries.ts
git commit -m "feat: add unstable_cache-wrapped Payload query helpers"
```

---

### Task 3: Cache root layout `findGlobal`

**Files:**
- Modify: `src/app/(frontend)/layout.tsx`

The layout currently calls `payload.findGlobal({ slug: 'site-settings', depth: 1 })` inside the component on every request. Move this to a module-scope `unstable_cache` wrapper. The existing try/catch must be preserved inside the cached function to prevent error caching on cold starts.

- [ ] **Step 1: Read the current file**

Read `src/app/(frontend)/layout.tsx` to confirm the current import list and the try/catch block shape (roughly lines 52–65).

- [ ] **Step 2: Add the import and cached function**

Add to the import block at the top:
```typescript
import { unstable_cache } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cache/revalidation'
```

Add this constant at module scope, directly after all import statements and before the `Geist(…)` font calls:

```typescript
const getCachedSiteSettings = unstable_cache(
  async () => {
    try {
      const payload = await getPayload({ config: await config })
      return await payload.findGlobal({ slug: 'site-settings', depth: 1 })
    } catch {
      // SiteSettings not yet saved, or DB unavailable — return null so layout falls back to wordmark
      return null
    }
  },
  ['site-settings'],
  { tags: [CACHE_TAGS.siteSettings], revalidate: 86400 },
)
```

- [ ] **Step 3: Replace the inline try/catch in the component**

Inside `RootLayout`, replace the existing try/catch block (which calls `getPayload` and `payload.findGlobal`) with a single call to the cached wrapper:

```typescript
// Replace the old try/catch block with:
const settings = await getCachedSiteSettings()
const logo = settings?.logo
const logoDark = settings?.logoDark
if (logo && typeof logo === 'object' && 'url' in logo) logoUrl = (logo as { url: string }).url ?? null
if (logoDark && typeof logoDark === 'object' && 'url' in logoDark) logoDarkUrl = (logoDark as { url: string }).url ?? null
```

The `let logoUrl` / `let logoDarkUrl` declarations stay in place above this block.

- [ ] **Step 4: Verify TypeScript**

Run: `cd "C:/Transcript IQ (Claude Build)" && npx tsc --noEmit 2>&1 | head -20`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add src/app/\(frontend\)/layout.tsx
git commit -m "perf: cache site-settings findGlobal in root layout with unstable_cache"
```

---

### Task 4: Migrate simple Pages-collection routes to ISR

**Files:**
- Modify: `src/app/(frontend)/page.tsx`
- Modify: `src/app/(frontend)/resources/page.tsx`
- Modify: `src/app/(frontend)/custom-reports/page.tsx`
- Modify: `src/app/(frontend)/free-transcript/page.tsx`
- Modify: `src/app/(frontend)/how-to-use/page.tsx`

All five pages query `collection: 'pages'` by slug. The change is the same in each:
1. Remove `export const dynamic = 'force-dynamic'`
2. Add `export const revalidate` — use **3600** for `page.tsx` (home) and `resources/page.tsx` (index pages that show fresh catalog listings); use **86400** for `custom-reports`, `free-transcript`, and `how-to-use` (content that rarely changes)
3. Remove `import { getPayload } from 'payload'` and `import config from '@/payload.config'` (no longer needed)
4. Replace the inline `payload.find(…)` call with `await getPageBySlug('slug-here')`
5. Add `import { getPageBySlug } from '@/lib/cache/queries'`

For `how-to-use/page.tsx`, the Payload call is in the page component body — replace it the same way.

Note: `why-primary-research-wins/page.tsx` already has no `force-dynamic` and no Payload calls — it is already static. No change needed.

- [ ] **Step 1: Update `src/app/(frontend)/page.tsx`**

Changes:
- Remove line: `export const dynamic = 'force-dynamic'`
- Remove imports: `import { getPayload } from 'payload'` and `import config from '@/payload.config'`
- Add imports: `import { getPageBySlug } from '@/lib/cache/queries'`
- Add after remaining imports: `export const revalidate = 3600`
- In `HomePage()`, replace:
  ```typescript
  const payload = await getPayload({ config: await config })
  const res = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
    depth: 2,
  })
  const page = res.docs[0]
  ```
  with:
  ```typescript
  const page = await getPageBySlug('home')
  ```

- [ ] **Step 2: Update `src/app/(frontend)/resources/page.tsx`**

Same pattern, slug `'resources'`, `revalidate = 3600`:
- Remove `force-dynamic`
- Remove `getPayload` + `config` imports
- Add `import { getPageBySlug } from '@/lib/cache/queries'`
- Add `export const revalidate = 3600`
- Replace the `payload.find(…)` in `ResourcesRoute()` with `const page = await getPageBySlug('resources')`

- [ ] **Step 3: Update `src/app/(frontend)/custom-reports/page.tsx`**

Same pattern, slug `'custom-reports'`, `revalidate = 86400`:
- Remove `force-dynamic`
- Remove `getPayload` + `config` imports
- Add `import { getPageBySlug } from '@/lib/cache/queries'`
- Add `export const revalidate = 86400`
- Replace the `payload.find(…)` in `CustomReportsRoute()` with `const page = await getPageBySlug('custom-reports')`

- [ ] **Step 4: Update `src/app/(frontend)/free-transcript/page.tsx`**

Same pattern, slug `'free-transcript'`, `revalidate = 86400`.

- [ ] **Step 5: Update `src/app/(frontend)/how-to-use/page.tsx`**

Same pattern, slug `'how-to-use'`, `revalidate = 86400`.

- [ ] **Step 6: Verify TypeScript**

Run: `cd "C:/Transcript IQ (Claude Build)" && npx tsc --noEmit 2>&1 | head -30`
Expected: No errors

- [ ] **Step 7: Commit**

```bash
git add "src/app/(frontend)/page.tsx" \
  "src/app/(frontend)/resources/page.tsx" \
  "src/app/(frontend)/custom-reports/page.tsx" \
  "src/app/(frontend)/free-transcript/page.tsx" \
  "src/app/(frontend)/how-to-use/page.tsx"
git commit -m "perf: migrate pages-collection routes to ISR with unstable_cache"
```

---

### Task 5: Migrate `expert-transcripts/page.tsx` to ISR

**Files:**
- Modify: `src/app/(frontend)/expert-transcripts/page.tsx`

This page reads dynamic search params (industry, geography, level, tier) and makes two Payload calls in `Promise.all`. The `generateMetadata` function does NOT call Payload — it uses the static `SECTOR_META` map — so no cached query needed there.

- [ ] **Step 1: Read the current file**

Read `src/app/(frontend)/expert-transcripts/page.tsx` in full.

- [ ] **Step 2: Apply changes**

Make the following changes:
- Remove: `export const dynamic = 'force-dynamic'`
- Remove: `import { getPayload } from 'payload'` and `import config from '@/payload.config'`
- Remove: `import type { Where } from 'payload'`
- Add import: `import { getTranscriptList, getIndustries } from '@/lib/cache/queries'`
- Add: `export const revalidate = 3600`

In `ExpertTranscriptsPage()`, replace the entire Payload section (the `andConditions` building and `Promise.all`) with:

```typescript
const [{ docs, totalDocs }, industries] = await Promise.all([
  getTranscriptList({ industry, geography, level, tier }),
  getIndustries(),
])
```

The `industry`, `geography`, `level`, `tier` variables from searchParams stay as-is above this call. The JSX return is unchanged.

- [ ] **Step 3: Verify TypeScript**

Run: `cd "C:/Transcript IQ (Claude Build)" && npx tsc --noEmit 2>&1 | head -30`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add "src/app/(frontend)/expert-transcripts/page.tsx"
git commit -m "perf: migrate expert-transcripts index to ISR"
```

---

### Task 6: Migrate `expert-transcripts/[slug]/page.tsx` to ISR

**Files:**
- Modify: `src/app/(frontend)/expert-transcripts/[slug]/page.tsx`

This page has a local `async function getTranscript(slug)` used by both `generateMetadata` and the page default export. It also has a second Payload call for related transcripts. Both must use cached helpers.

- [ ] **Step 1: Read the current file**

Read `src/app/(frontend)/expert-transcripts/[slug]/page.tsx` in full.

- [ ] **Step 2: Apply changes**

- Remove: `export const dynamic = 'force-dynamic'`
- Remove: `import { getPayload } from 'payload'` and `import config from '@/payload.config'`
- Remove: `import type { Where } from 'payload'`
- Add import: `import { getTranscriptBySlug, getRelatedTranscripts } from '@/lib/cache/queries'`
- Add: `export const revalidate = 86400`
- Delete the local `async function getTranscript(slug: string) { … }` entirely

In `generateMetadata`, replace `await getTranscript(slug)` with `await getTranscriptBySlug(slug)`.

In `ExpertTranscriptDetailPage()`:
- Replace `const transcript = await getTranscript(slug)` with `const transcript = await getTranscriptBySlug(slug)`
- Replace the second Payload block (the `getPayload` call + `payload.find` for related) with:
  ```typescript
  const relatedDocs = await getRelatedTranscripts(slug, sectorSlugs)
  ```
  (Remove the `const payload = await getPayload(…)` and `const { docs: relatedDocs } = await payload.find(…)` lines)

- [ ] **Step 3: Verify TypeScript**

Run: `cd "C:/Transcript IQ (Claude Build)" && npx tsc --noEmit 2>&1 | head -30`
Expected: No errors. `relatedDocs` type changes from the narrowed Payload type to the array returned by `getRelatedTranscripts` — the `related: RelatedTranscript[]` mapping below uses `r.id`, `r.slug`, etc. which are all present; no type changes needed there.

- [ ] **Step 4: Commit**

```bash
git add "src/app/(frontend)/expert-transcripts/[slug]/page.tsx"
git commit -m "perf: migrate expert-transcripts detail page to ISR"
```

---

### Task 7: Migrate `earnings-analysis/page.tsx` to ISR

**Files:**
- Modify: `src/app/(frontend)/earnings-analysis/page.tsx`

This page has a static `export const metadata` (no dynamic `generateMetadata`). The page body makes two Payload calls in `Promise.all`.

- [ ] **Step 1: Read the current file**

Read `src/app/(frontend)/earnings-analysis/page.tsx` in full.

- [ ] **Step 2: Apply changes**

- Remove: `export const dynamic = 'force-dynamic'`
- Remove: `import { getPayload } from 'payload'` and `import config from '@/payload.config'`
- Remove: `import type { Where } from 'payload'`
- Add import: `import { getEarningsAnalysisList, getIndustries } from '@/lib/cache/queries'`
- Add: `export const revalidate = 3600`

In `EarningsAnalysisPage()`, replace the `andConditions` building block and `Promise.all` with:

```typescript
const [{ docs, totalDocs }, industries] = await Promise.all([
  getEarningsAnalysisList({ sector, exchange, quarter, performance }),
  getIndustries(),
])
```

The four searchParam variables (`sector`, `exchange`, `quarter`, `performance`) stay as-is above this call. JSX is unchanged.

- [ ] **Step 3: Verify TypeScript**

Run: `cd "C:/Transcript IQ (Claude Build)" && npx tsc --noEmit 2>&1 | head -20`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add "src/app/(frontend)/earnings-analysis/page.tsx"
git commit -m "perf: migrate earnings-analysis index to ISR"
```

---

### Task 8: Migrate `earnings-analysis/[slug]/page.tsx` to ISR

**Files:**
- Modify: `src/app/(frontend)/earnings-analysis/[slug]/page.tsx`

Same pattern as Task 6 (transcript detail). Local `getAnalysis(slug)` function → cached `getEarningsAnalysisBySlug`. Second Payload call for related → `getRelatedEarningsAnalyses`.

- [ ] **Step 1: Read the current file**

Read `src/app/(frontend)/earnings-analysis/[slug]/page.tsx` in full.

- [ ] **Step 2: Apply changes**

- Remove: `export const dynamic = 'force-dynamic'`
- Remove: `import { getPayload } from 'payload'`, `import config from '@/payload.config'`, `import type { Where } from 'payload'`
- Add import: `import { getEarningsAnalysisBySlug, getRelatedEarningsAnalyses } from '@/lib/cache/queries'`
- Add: `export const revalidate = 86400`
- Delete the local `async function getAnalysis(slug: string) { … }` entirely

In `generateMetadata`: replace `await getAnalysis(slug)` with `await getEarningsAnalysisBySlug(slug)`.

In `EarningsAnalysisDetailPage()`:
- Replace `const analysis = await getAnalysis(slug)` with `const analysis = await getEarningsAnalysisBySlug(slug)`
- Replace the second Payload block (related docs) with:
  ```typescript
  const relatedDocs = await getRelatedEarningsAnalyses(slug, sectorSlugs)
  ```

- [ ] **Step 3: Verify TypeScript**

Run: `cd "C:/Transcript IQ (Claude Build)" && npx tsc --noEmit 2>&1 | head -20`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add "src/app/(frontend)/earnings-analysis/[slug]/page.tsx"
git commit -m "perf: migrate earnings-analysis detail page to ISR"
```

---

### Task 9: Migrate `resources/[slug]/page.tsx` to ISR

**Files:**
- Modify: `src/app/(frontend)/resources/[slug]/page.tsx`

Most complex page: `generateMetadata` has its own inline Payload call, and the page body has three Payload calls (main post, related, next). All four must be replaced with cached helpers.

- [ ] **Step 1: Read the current file**

Read `src/app/(frontend)/resources/[slug]/page.tsx`, lines 1–100.

- [ ] **Step 2: Apply changes**

- Remove: `export const dynamic = 'force-dynamic'`
- Remove: `import { getPayload } from 'payload'` and `import config from '@/payload.config'`
- Add import: `import { getBlogPostBySlug, getRelatedBlogPosts, getNextBlogPost } from '@/lib/cache/queries'`
- Add: `export const revalidate = 86400`

In `generateMetadata({ params })`, replace the inline `getPayload` + `payload.find` block with:
```typescript
const { slug } = await params
const post = await getBlogPostBySlug(slug)
if (!post) return { title: 'Article Not Found', robots: { index: false } }
```
(Remove the `payload` variable, the `find` call, and the `res.docs[0]` extraction — keep the return statement below as-is.)

In `ResourceArticlePage({ params })`, replace the three Payload calls:

1. Replace:
   ```typescript
   const payload = await getPayload({ config: await config })
   const res = await payload.find({ collection: 'blog-posts', where: { slug: { equals: slug } }, limit: 1, depth: 2 })
   const post = res.docs[0] as { … } | undefined
   ```
   with:
   ```typescript
   const rawPost = await getBlogPostBySlug(slug)
   const post = rawPost as { … } | undefined
   ```
   (Keep the existing type annotation on `post` unchanged.)

2. Replace the related posts `payload.find` block with:
   ```typescript
   const relatedDocs = await getRelatedBlogPosts(slug, post.contentType ?? 'educational')
   const related = relatedDocs as Array<{ id: string | number; slug: string; title: string; contentType?: string }>
   ```

3. Replace the next post `payload.find` block with:
   ```typescript
   const nextPostDoc = await getNextBlogPost(slug)
   const nextPost = nextPostDoc as { id: string | number; slug: string; title: string; contentType?: string; excerpt?: string; readTime?: number } | undefined
   ```

- [ ] **Step 3: Verify TypeScript**

Run: `cd "C:/Transcript IQ (Claude Build)" && npx tsc --noEmit 2>&1 | head -30`
Expected: No errors. If there are type narrowing issues on `post`, cast the result the same way the original code did (`as { … } | undefined`).

- [ ] **Step 4: Commit**

```bash
git add "src/app/(frontend)/resources/[slug]/page.tsx"
git commit -m "perf: migrate resources article page to ISR with 4 cached queries"
```

---

### Task 10: Wire Payload `afterChange` hooks

**Files:**
- Modify: `src/collections/ExpertTranscripts.ts`
- Modify: `src/collections/EarningsAnalyses.ts`
- Modify: `src/collections/BlogPosts.ts`
- Modify: `src/collections/Pages.ts`
- Modify: `src/collections/Industries.ts`
- Modify: `src/globals/SiteSettings.ts`

These hooks call `revalidateTag` when a document is published, clearing the Next.js cache. For collections with drafts, the `revalidateOnPublish` helper (from Task 1) checks `doc._status === 'published'` before calling `revalidateTag`. For the SiteSettings global (no draft/publish), call `revalidateTag` directly.

The hooks call their code in a try/catch so a failed revalidation never blocks the document save.

**Pattern for each collection:**

```typescript
// Add to imports at top of file:
import { revalidateOnPublish, CACHE_TAGS } from '../lib/cache/revalidation'

// Add to the CollectionConfig object, as a sibling of 'fields', 'access', etc.:
hooks: {
  afterChange: [
    ({ doc }) => {
      try {
        revalidateOnPublish(CACHE_TAGS.expertTranscripts, doc)
      } catch (err) {
        console.error('[cache] revalidation failed:', err)
      }
    },
  ],
},
```

**IMPORTANT for `BlogPosts.ts`:** This collection already has a `hooks` key at the collection level (`hooks: { beforeChange: […] }`). Add `afterChange` alongside `beforeChange` inside that existing `hooks` object — do not create a second `hooks` key.

- [ ] **Step 1: Read the existing hooks in each file**

Run: `cd "C:/Transcript IQ (Claude Build)" && grep -n "hooks" src/collections/ExpertTranscripts.ts src/collections/EarningsAnalyses.ts src/collections/BlogPosts.ts src/collections/Pages.ts src/collections/Industries.ts src/globals/SiteSettings.ts`

Confirm: ExpertTranscripts, EarningsAnalyses, Pages, Industries have `hooks` only inside `fields` (field-level hooks for slug generation). BlogPosts has a collection-level `hooks: { beforeChange: […] }`.

- [ ] **Step 2: Add hooks to `src/collections/ExpertTranscripts.ts`**

Add import at top:
```typescript
import { revalidateOnPublish, CACHE_TAGS } from '../lib/cache/revalidation'
```

Add `hooks` as a new top-level property in the `CollectionConfig` object (alongside `slug`, `admin`, `versions`, `access`, `fields`):

```typescript
hooks: {
  afterChange: [
    ({ doc }) => {
      try {
        revalidateOnPublish(CACHE_TAGS.expertTranscripts, doc)
      } catch (err) {
        console.error('[cache] revalidation failed:', err)
      }
    },
  ],
},
```

- [ ] **Step 3: Add hooks to `src/collections/EarningsAnalyses.ts`**

Same pattern, tag: `CACHE_TAGS.earningsAnalyses`.

- [ ] **Step 4: Add hooks to `src/collections/BlogPosts.ts`**

Add import. Then find the existing collection-level `hooks: { beforeChange: […] }` and add `afterChange` inside that same object:

```typescript
hooks: {
  beforeChange: [
    // existing beforeChange handler — leave untouched
    ({ data }) => { … },
  ],
  afterChange: [
    ({ doc }) => {
      try {
        revalidateOnPublish(CACHE_TAGS.blogPosts, doc)
      } catch (err) {
        console.error('[cache] revalidation failed:', err)
      }
    },
  ],
},
```

- [ ] **Step 5: Add hooks to `src/collections/Pages.ts`**

Same pattern as Step 2, tag: `CACHE_TAGS.pages`.

- [ ] **Step 6: Add hooks to `src/collections/Industries.ts`**

Same pattern, tag: `CACHE_TAGS.industries`.

- [ ] **Step 7: Add hooks to `src/globals/SiteSettings.ts`**

Globals do not have draft/publish versioning — call `revalidateTag` directly without the publish guard:

Add import:
```typescript
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '../lib/cache/revalidation'
```

Add `hooks` to the global config object:
```typescript
hooks: {
  afterChange: [
    () => {
      try {
        revalidateTag(CACHE_TAGS.siteSettings)
      } catch (err) {
        console.error('[cache] site-settings revalidation failed:', err)
      }
    },
  ],
},
```

- [ ] **Step 8: Verify TypeScript**

Run: `cd "C:/Transcript IQ (Claude Build)" && npx tsc --noEmit 2>&1 | head -30`
Expected: No errors

- [ ] **Step 9: Commit**

```bash
git add src/collections/ExpertTranscripts.ts src/collections/EarningsAnalyses.ts \
  src/collections/BlogPosts.ts src/collections/Pages.ts src/collections/Industries.ts \
  src/globals/SiteSettings.ts
git commit -m "feat: add afterChange revalidation hooks to all collections and SiteSettings global"
```

---

### Task 11: Add `remotePatterns` to `next.config.ts`

**Files:**
- Modify: `next.config.ts`

Add the `remotePatterns` array to the existing `images` block. The existing `localPatterns` entry stays unchanged.

- [ ] **Step 1: Read the current file**

Read `next.config.ts`. Confirm the `images` block currently has only `localPatterns`.

- [ ] **Step 2: Apply the change**

In the `images` object, add `remotePatterns` before `localPatterns`:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '*.public.blob.vercel-storage.com',
    },
  ],
  localPatterns: [
    {
      pathname: '/api/media/file/**',
    },
  ],
},
```

- [ ] **Step 3: Verify build compiles**

Run: `cd "C:/Transcript IQ (Claude Build)" && npx tsc --noEmit 2>&1 | head -20`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add next.config.ts
git commit -m "feat: add Vercel Blob remotePatterns for next/image"
```

---

### Task 12: Migrate `Header.tsx` and `Hero.tsx` to `next/image`

**Files:**
- Modify: `src/components/site/Header.tsx`
- Modify: `src/components/blocks/Hero.tsx`

These are the only above-the-fold images — both get `priority` prop to prevent LCP penalty.

**Header.tsx** renders two `<img>` tags for light and dark logo variants. Both are currently `<img src={logoUrl} … className="h-11 w-auto object-contain …">`. Use `fill` inside a sized relative wrapper.

**Hero.tsx** has one `<img>` in `HeroVisual` at line ~457 with `className="h-full w-full object-cover"`. The parent (the div returned by `HeroVisual`) already has sizing via Tailwind classes. Use `fill`.

- [ ] **Step 1: Read current Header.tsx logo section**

Read `src/components/site/Header.tsx`, lines 1–10 (imports) and lines 48–62 (the logoUrl conditional block).

- [ ] **Step 2: Update `Header.tsx`**

Add import at top: `import Image from 'next/image'`

Replace the two `<img>` tags inside the `{logoUrl ? ( … ) : ( … )}` block. The existing structure is:
```tsx
<img src={logoUrl} alt="Transcript IQ" className={`h-11 w-auto object-contain … ${logoDarkUrl ? ' block dark:hidden' : ''}`} />
{logoDarkUrl && (
  <img src={logoDarkUrl} alt="Transcript IQ" className="hidden dark:block h-11 w-auto object-contain …" />
)}
```

Replace with:
```tsx
<div
  className={`relative h-11 w-auto${logoDarkUrl ? ' block dark:hidden' : ''}`}
  style={{ aspectRatio: '3/1', minWidth: 44 }}
>
  <Image
    src={logoUrl}
    alt="Transcript IQ"
    fill
    priority
    className="object-contain transition-opacity duration-fast group-hover:opacity-90"
  />
</div>
{logoDarkUrl && (
  <div className="relative hidden dark:block h-11 w-auto" style={{ aspectRatio: '3/1', minWidth: 44 }}>
    <Image
      src={logoDarkUrl}
      alt="Transcript IQ"
      fill
      priority
      className="object-contain transition-opacity duration-fast group-hover:opacity-90"
    />
  </div>
)}
```

The `block dark:hidden` / `hidden dark:block` classes move to the wrapper `div`.

- [ ] **Step 3: Update `Hero.tsx`**

Add import at top: `import Image from 'next/image'`

Read `src/components/blocks/Hero.tsx` around line 446–462 (the `HeroVisual` function). Find the parent container of the `<img>` — it's the div returned directly by `HeroVisual` when `variant === 'animated' || variant === 'split'`.

Replace:
```tsx
return <img src={visual.image.url} alt={visual.image.alt ?? ''} className="h-full w-full object-cover" />
```
with:
```tsx
return (
  <div className="relative h-full w-full">
    <Image src={visual.image.url} alt={visual.image.alt ?? ''} fill priority className="object-cover" />
  </div>
)
```

- [ ] **Step 4: Verify TypeScript**

Run: `cd "C:/Transcript IQ (Claude Build)" && npx tsc --noEmit 2>&1 | head -30`
Expected: No errors. If TypeScript complains about `src` being `string | undefined` from `logoUrl`, add a guard: the existing `{logoUrl ? (…) : (…)}` conditional already ensures `logoUrl` is a non-null string inside.

- [ ] **Step 5: Commit**

```bash
git add src/components/site/Header.tsx src/components/blocks/Hero.tsx
git commit -m "perf: migrate Header logo and Hero image to next/image with priority"
```

---

### Task 13: Migrate `Media.tsx` to `next/image`

**Files:**
- Modify: `src/components/blocks/Media.tsx`

This file has 4 `<img>` tags at lines 38, 100, 138, 199. All render Payload media objects with `url`, `alt`, `width`, `height` fields. All use `object-cover` or full-width patterns.

- [ ] **Step 1: Read `Media.tsx`**

Read `src/components/blocks/Media.tsx` in full. Identify the parent wrapper of each `<img>` tag to determine if `position: relative` is already set.

- [ ] **Step 2: Add import**

Add at top: `import Image from 'next/image'`

- [ ] **Step 3: Replace each `<img>` tag**

For each `<img>` with `className="h-full w-full object-cover"`:
- Ensure the direct parent div has `style={{ position: 'relative' }}` or `className` that includes a Tailwind class setting `relative`. If not, add `style={{ position: 'relative' }}` to the parent.
- Replace `<img src={…} alt={…} className="h-full w-full object-cover" />` with `<Image src={…} alt={…} fill className="object-cover" />`

For the img at line 138 with `className="w-full"` (ImageMasonry):
- This is a full-width image without a fixed height. Check parent. If the parent has no fixed height, use explicit dimensions from the Payload object: `<Image src={img.image.url} alt={img.image.alt ?? ''} width={img.image.width ?? 800} height={img.image.height ?? 600} className="w-full h-auto" />`

- [ ] **Step 4: Verify TypeScript**

Run: `cd "C:/Transcript IQ (Claude Build)" && npx tsc --noEmit 2>&1 | head -30`
Expected: No errors. The Payload media type may not expose `width`/`height` on the typed object — cast with `(img.image as { url: string; alt?: string; width?: number; height?: number })` if needed.

- [ ] **Step 5: Commit**

```bash
git add src/components/blocks/Media.tsx
git commit -m "perf: migrate Media block images to next/image"
```

---

### Task 14: Migrate `Features.tsx` and `Conversion.tsx` to `next/image`

**Files:**
- Modify: `src/components/blocks/Features.tsx`
- Modify: `src/components/blocks/Conversion.tsx`

**Features.tsx** has 3 `<img>` tags at lines 249, 324, 581. All are `object-cover` in sized parents — use Pattern A (`fill`).

**Conversion.tsx** has 5 `<img>` tags:
- Line 57: `absolute inset-0 h-full w-full object-cover` — already positioned absolutely; use `<Image fill className="object-cover -z-10" />` without extra wrapper (parent already relative from the section positioning)
- Line 202: `aspect-[4/3] w-full object-cover` — wrap in a relative div: `<div className="relative aspect-[4/3] w-full"><Image fill className="rounded-xl object-cover" /></div>`
- Line 484: author avatar `h-10 w-10 rounded-full` — 40×40px: `<Image src={…} alt="" width={40} height={40} className="rounded-full border border-[var(--border)] object-cover" />`
- Line 509: author avatar `h-9 w-9 rounded-full` — 36×36px: `<Image src={…} alt="" width={36} height={36} className="rounded-full border border-[var(--border)] object-cover" />`
- Line 610: `h-full w-full object-cover` inside conditional — use `fill` with relative parent

- [ ] **Step 1: Read both files**

Read `src/components/blocks/Features.tsx` lines 240–260, 315–335, 575–590.
Read `src/components/blocks/Conversion.tsx` lines 50–65, 195–210, 478–495, 505–515, 603–615.

- [ ] **Step 2: Add imports to both files**

Add `import Image from 'next/image'` at the top of each file.

- [ ] **Step 3: Update `Features.tsx`**

For each of the 3 `<img className="h-full w-full object-cover">` tags:
- Add `style={{ position: 'relative' }}` to the direct parent div if it doesn't already have `relative` class or style
- Replace with `<Image src={…} alt={…} fill className="object-cover" />`

- [ ] **Step 4: Update `Conversion.tsx`**

Apply the 5 replacements as described above. Check parent elements first. For the conditional at line 610 (`{block.image?.url && <img …>}`), wrap in:
```tsx
{block.image?.url && (
  <div className="relative h-full w-full">
    <Image src={block.image.url} alt="" fill className="object-cover" />
  </div>
)}
```

- [ ] **Step 5: Verify TypeScript**

Run: `cd "C:/Transcript IQ (Claude Build)" && npx tsc --noEmit 2>&1 | head -30`
Expected: No errors

- [ ] **Step 6: Commit**

```bash
git add src/components/blocks/Features.tsx src/components/blocks/Conversion.tsx
git commit -m "perf: migrate Features and Conversion block images to next/image"
```

---

### Task 15: Migrate remaining block components to `next/image`

**Files:**
- Modify: `src/components/blocks/Interactive.tsx`
- Modify: `src/components/blocks/Trust.tsx`
- Modify: `src/components/blocks/Misc.tsx`
- Modify: `src/components/blocks/Creative.tsx`
- Modify: `src/components/blocks/Persona.tsx`

**Interactive.tsx** (4 tags at lines 68, 137, 141, 285):
- Line 68: `h-full w-full object-cover` in ScrollPinned panel — `fill` with relative wrapper
- Lines 137, 141: BeforeAfterSlider before/after images — both `h-full w-full object-cover` (line 137 is `absolute inset-0`). Parent is already a relative container. Use `<Image fill className="object-cover" />` (line 137 also has `absolute inset-0` which `fill` already does — remove `absolute inset-0` from className since `fill` sets `position: absolute`)
- Line 285: StackedCards card image — `h-full w-full object-cover` inside a div with `aspect-[16/9] overflow-hidden rounded-xl`. Add `relative` to that parent div and use `fill`:
  ```tsx
  <div className="mt-6 relative aspect-[16/9] overflow-hidden rounded-xl border border-[var(--border)]">
    <Image src={card.image.url} alt="" fill className="object-cover" />
  </div>
  ```

**Trust.tsx** (1 tag at line 194):
- `h-8 w-auto object-contain` logo — fixed height logo. Use Pattern B: `<Image src={logo.image.url} alt={logo.image.alt ?? logo.name} width={logo.image.width ?? 120} height={32} className="h-8 w-auto object-contain" />`

**Misc.tsx** (1 tag at line 60):
- `max-h-8 object-contain` logo — `<Image src={it.image.url} alt={it.label} width={it.image.width ?? 120} height={32} className="max-h-8 w-auto object-contain" />`

**Creative.tsx** (1 tag at line 444):
- `h-10 w-10 rounded-full object-cover` attribution avatar — `<Image src={block.attributionImage.url} alt="" width={40} height={40} className="h-10 w-10 rounded-full border border-[var(--border)] object-cover" />`

**Persona.tsx** (1 tag at line 843):
- `h-full w-full object-cover` active persona image — `fill` with relative parent

- [ ] **Step 1: Read the relevant sections of each file**

Read:
- `src/components/blocks/Interactive.tsx` lines 60–75, 130–145, and 280–290
- `src/components/blocks/Trust.tsx` lines 188–200
- `src/components/blocks/Misc.tsx` lines 55–65
- `src/components/blocks/Creative.tsx` lines 440–450
- `src/components/blocks/Persona.tsx` lines 838–848

- [ ] **Step 2: Add `import Image from 'next/image'` to each file**

- [ ] **Step 3: Apply replacements to each file**

Follow the descriptions above. For `fill` images, confirm the parent div has a defined height (via Tailwind `h-*` or explicit style). If not, add `style={{ position: 'relative' }}` to the parent and let the existing height/aspect-ratio classes control the size.

For BeforeAfterSlider in Interactive.tsx (line 137): the before image was `className="absolute inset-0 h-full w-full object-cover"`. With `<Image fill>`, the `absolute inset-0` is handled by `fill` internally — remove those positioning classes from the className prop, keep only `object-cover`.

- [ ] **Step 4: Verify TypeScript**

Run: `cd "C:/Transcript IQ (Claude Build)" && npx tsc --noEmit 2>&1 | head -30`
Expected: No errors. For Payload media objects where `width`/`height` aren't on the TypeScript type, cast as needed: `(image as { url: string; alt?: string; width?: number; height?: number })`

- [ ] **Step 5: Commit**

```bash
git add src/components/blocks/Interactive.tsx src/components/blocks/Trust.tsx \
  src/components/blocks/Misc.tsx src/components/blocks/Creative.tsx \
  src/components/blocks/Persona.tsx
git commit -m "perf: migrate remaining block component images to next/image"
```

---

### Task 16: Final build verification

**Files:** None

Run a full production build and verify all routes compile without errors.

- [ ] **Step 1: Run the build**

Run: `cd "C:/Transcript IQ (Claude Build)" && pnpm build 2>&1 | tail -60`

Expected:
- Build completes with `✓ Compiled successfully`
- No TypeScript errors
- Route table shows all frontend routes (no `λ` next to routes that should be ISR — they should now show `○` static or ISR marker depending on Next.js output format)
- Routes with `revalidate` set show as ISR in the route table

- [ ] **Step 2: Check for any remaining `force-dynamic` exports**

Run: `cd "C:/Transcript IQ (Claude Build)" && grep -rn "force-dynamic" src/app/\(frontend\)/`
Expected: No output (all `force-dynamic` exports removed)

- [ ] **Step 3: Verify all `<img>` tags migrated**

Run: `cd "C:/Transcript IQ (Claude Build)" && grep -rn "<img " src/components/blocks/ src/components/site/Header.tsx`
Expected: No output (all `<img>` tags in these files replaced with `<Image>`)

- [ ] **Step 4: Commit if any minor fixes were needed during build**

If the build revealed TypeScript errors that needed fixing, commit those fixes:
```bash
git add -p  # stage specific fixes
git commit -m "fix: resolve build errors from ISR and next/image migration"
```

---

## Post-Deploy Verification (manual, after pushing to Vercel)

These steps are performed in a browser or terminal after deploying to production — not part of the automated build.

**ISR cache hit:**
```bash
curl -I https://transcript-iq.com/expert-transcripts | grep -i "x-nextjs-cache"
# First request: MISS
# Second request: HIT
```

**Image format conversion:**
Open DevTools → Network → filter by `Img`. Check that images served from Vercel show `Content-Type: image/webp` or `image/avif`.

**On-demand revalidation:**
1. Log into `/admin`
2. Open any Expert Transcript, make a small edit, publish
3. Within ~5 seconds, reload the `/expert-transcripts` page and confirm the change appears
