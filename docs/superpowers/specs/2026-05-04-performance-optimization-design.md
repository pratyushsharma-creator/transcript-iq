# Phase II Performance Optimization Design

## Goal

Eliminate the three root causes of slow page loads on Transcript IQ: every request hitting the database due to `force-dynamic`, the root layout making an uncached Payload global query on every request, and raw `<img>` tags serving unoptimized JPEG/PNG instead of WebP/AVIF.

## Problem Statement

The current site has `export const dynamic = 'force-dynamic'` on all 13 frontend pages. This bypasses Next.js's page cache entirely — every visitor triggers a fresh Payload database query. Combined with an uncached `findGlobal` call in the root layout (which runs on every request, even for cached pages), and raw `<img>` tags that serve whatever format was uploaded, the result is measurably slow Time to First Byte and poor Core Web Vitals (LCP, CLS).

## Architecture

Three-layer caching stack:

1. **Page-level ISR** — remove `force-dynamic`, add `revalidate` constants and `unstable_cache`-wrapped Payload queries with collection-named cache tags
2. **On-demand revalidation** — Payload `afterChange` hooks call `revalidateTag()` within seconds of a publish, clearing only the relevant cached pages
3. **Image optimization** — migrate `<img>` tags to `next/image` with Vercel Blob remote patterns configured; WebP/AVIF served automatically

## Tech Stack

- Next.js 15 App Router (`unstable_cache`, `revalidateTag` from `next/cache`)
- Payload 3 collection/global hooks (`afterChange`)
- `next/image` with `remotePatterns` for Vercel Blob
- Vercel Edge Network (cache storage)

---

## Section 1: ISR + Cache Tag Architecture

### Revalidation strategy per route

| Route | `revalidate` (fallback TTL) | Cache tags |
|---|---|---|
| `/` (home) | 3600s (1h) | `pages` |
| `/expert-transcripts` (index) | 3600s | `expert-transcripts`, `industries` |
| `/expert-transcripts/[slug]` | 86400s (24h) | `expert-transcripts` |
| `/earnings-analysis` (index) | 3600s | `earnings-analyses` |
| `/earnings-analysis/[slug]` | 86400s | `earnings-analyses` |
| `/resources` (index) | 3600s | `blog-posts` |
| `/resources/[slug]` | 86400s | `blog-posts` |
| `/free-transcript` | 86400s | `pages` |
| `/how-to-use` | 86400s | `pages` |
| `/custom-reports` | 86400s | `pages` |
| `/why-primary-research-wins` | fully static (no export) | — |

`why-primary-research-wins` has no Payload queries — it is hardcoded JSX. Remove `force-dynamic` with no replacement; Next.js will statically generate it at build time.

### `unstable_cache` pattern

Every Payload query that is currently called directly inside a Server Component must be wrapped. **This includes `generateMetadata` functions** — both the page default export and `generateMetadata` must import from the same cached helper in `src/lib/cache/queries.ts`. A `generateMetadata` that calls Payload directly (not via the cached helper) bypasses ISR and hits the database on every metadata generation request.

```typescript
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const getTranscriptBySlug = unstable_cache(
  async (slug: string) => {
    const payload = await getPayload({ config: await config })
    const res = await payload.find({
      collection: 'expert-transcripts',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    })
    return res.docs[0] ?? null
  },
  ['expert-transcripts-by-slug'],
  { tags: ['expert-transcripts'], revalidate: 86400 }
)
```

The second argument (`['expert-transcripts-by-slug']`) is the cache key prefix. The actual cache key is this prefix + the runtime arguments (slug), so each document gets its own cache entry but all share the `expert-transcripts` tag — a single `revalidateTag('expert-transcripts')` clears all of them.

### Cache helper file

`src/lib/cache/queries.ts` — exports all `unstable_cache`-wrapped Payload query functions. Page files import from here instead of calling Payload directly. This keeps the cache configuration in one place.

---

## Section 2: Payload Hook Strategy

### Tag constants

`src/lib/cache/revalidation.ts` — single source of truth for tag name strings and the revalidation helper.

```typescript
import { revalidateTag } from 'next/cache'

export const CACHE_TAGS = {
  expertTranscripts: 'expert-transcripts',
  earningsAnalyses: 'earnings-analyses',
  blogPosts: 'blog-posts',
  pages: 'pages',
  industries: 'industries',
  siteSettings: 'site-settings',
} as const

export function revalidateOnPublish(
  tag: string,
  doc: { _status?: string }
): void {
  if (doc._status !== 'published') return
  revalidateTag(tag)
}
```

The `revalidateOnPublish` helper handles the draft/publish distinction. Collections with `versions: { drafts: true }` fire `afterChange` on every draft autosave — this guard ensures we only bust the public cache on actual publishes.

### Hooks per collection/global

Each collection gets a new `hooks.afterChange` entry inside its existing `CollectionConfig`. No new files for the collections themselves.

| Source file | Hook calls |
|---|---|
| `src/collections/ExpertTranscripts.ts` | `revalidateOnPublish(CACHE_TAGS.expertTranscripts, doc)` |
| `src/collections/EarningsAnalyses.ts` | `revalidateOnPublish(CACHE_TAGS.earningsAnalyses, doc)` |
| `src/collections/BlogPosts.ts` | `revalidateOnPublish(CACHE_TAGS.blogPosts, doc)` |
| `src/collections/Pages.ts` | `revalidateOnPublish(CACHE_TAGS.pages, doc)` |
| `src/collections/Industries.ts` | `revalidateOnPublish(CACHE_TAGS.industries, doc)` |
| `src/globals/SiteSettings.ts` | `revalidateTag(CACHE_TAGS.siteSettings)` (globals have no draft status) |

SiteSettings is a global, not a collection — globals don't have draft/publish versioning, so the hook calls `revalidateTag` directly without the publish guard.

### Hook shape (collection example)

```typescript
hooks: {
  afterChange: [
    ({ doc, req }) => {
      revalidateOnPublish(CACHE_TAGS.expertTranscripts, doc)
    },
  ],
},
```

Payload `afterChange` hooks receive `{ doc, req, operation, previousDoc }`. The `doc` object includes `_status` when the collection has `versions: { drafts: true }`.

---

## Section 3: Layout Caching

### Problem

`src/app/(frontend)/layout.tsx` calls `payload.findGlobal({ slug: 'site-settings', depth: 1 })` on every request. This query runs even when the requested page itself is served from the ISR cache — the layout is not cached independently.

### Fix

Wrap the `findGlobal` call with `unstable_cache` at module scope (outside the component function) tagged `'site-settings'` with a 24h fallback TTL.

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
  { tags: ['site-settings'], revalidate: 86400 }
)
```

The try/catch mirrors the existing layout pattern — if SiteSettings has never been saved (fresh install) or the DB is unavailable on cold start, the function returns `null` rather than throwing. Without this guard, `unstable_cache` would cache the thrown error and every subsequent request would also fail until the 24h TTL expires.

The 24h TTL is a safety net. The `SiteSettings` global hook (Section 2) will clear this cache within seconds of any admin save, so in practice the TTL never expires in normal operation.

**Constraint:** The wrapped function must be defined at module scope, not inside the component, so Next.js can stable-reference it for cache keying.

---

## Section 4: next/image Migration

### Config change — `next.config.ts`

**Add** `remotePatterns` to the existing `images` block. The existing `localPatterns` entry (`/api/media/file/**`) stays as-is — do not modify or replace it. Only add the new `remotePatterns` array:

```typescript
images: {
  // ADD this — new, does not exist today
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '*.public.blob.vercel-storage.com',
    },
  ],
  // KEEP this exactly as-is — already exists
  localPatterns: [
    {
      pathname: '/api/media/file/**',
    },
  ],
},
```

Without the `remotePatterns` entry, any `next/image` pointing at a Vercel Blob URL (`*.public.blob.vercel-storage.com`) will throw a runtime error at the time the image is requested.

### Scope of `<img>` → `<Image>` migration

Raw `<img>` tags exist in 10 files — one site component and nine block components. All block components are `'use client'`; `next/image` is compatible with client components.

| File | `<img>` count | Notes |
|---|---|---|
| `src/components/site/Header.tsx` | 2 | Light logo + dark logo variant; both need migration with `priority` |
| `src/components/blocks/Hero.tsx` | 1 | Above-fold hero visual; use `priority` |
| `src/components/blocks/Media.tsx` | 4 | ImageBlock, ImageGallery, ImageMasonry, ImageCarousel |
| `src/components/blocks/Features.tsx` | 3 | Feature card image, tab panel image, richtext image |
| `src/components/blocks/Conversion.tsx` | 5 | CTA background, split image, two author avatars, form image |
| `src/components/blocks/Interactive.tsx` | 3 | ScrollPinned, BeforeAfterSlider (before + after) |
| `src/components/blocks/Trust.tsx` | 1 | Trust logo |
| `src/components/blocks/Misc.tsx` | 1 | LogosCloud logo |
| `src/components/blocks/Creative.tsx` | 1 | Attribution avatar |
| `src/components/blocks/Persona.tsx` | 1 | Active persona image |

**22 `<img>` tags total.**

**Dimensions strategy — two patterns:**

**Pattern A — `fill` (for `object-cover` containers):** Most block images use `className="h-full w-full object-cover"` inside a sized parent div. Replace `<img>` with `<Image fill …>` and ensure the parent has `position: relative` (add `style={{ position: 'relative' }}` if not already present). The parent's existing height/width CSS controls the rendered size. Most block wrappers already define their dimensions via Tailwind `h-*` / `aspect-*` classes.

**Pattern B — explicit `width`/`height` (for fixed-size elements):** For logos, avatars, and icons with a known display size (e.g., `className="h-8 w-auto"`, `h-10 w-10 rounded-full"`), use explicit `width` and `height` props. Source these from the Payload media object's `width` and `height` fields (available at `depth: 2`), or from the displayed pixel size when the Payload object doesn't expose them (e.g., logos displayed at `h-8` = 32px tall).

**`priority` prop:** Apply to the Header logo (both variants) and `Hero.tsx` image only. All other images are below the fold and should lazy-load (default behavior, no prop needed).

**Header logo special case:** `Header.tsx` renders two `<img>` tags — one light (`.block.dark:hidden`) and one dark (`.hidden.dark:block`). Both need migration. Use `fill` with a sized wrapper `div` styled to match the existing `h-11` height. Both images should have `priority` since they are always above the fold. The `block dark:hidden` / `hidden dark:block` className pattern stays on the wrapper `div`, not the `<Image>` component.

**Import:** Add `import Image from 'next/image'` to each file. The component name is `Image` (capital I).

### What this does NOT change

- CSS background images — not handled by `next/image`, already served as-is
- SVG icons — inline or `<img>` with SVG source; format conversion doesn't apply to SVG
- OG images (`opengraph-image.tsx`) — served by Next.js separately, not a candidate for `next/image`

---

## Error Handling

- **`unstable_cache` miss on cold start:** Payload query runs normally, result gets cached. No special handling needed — this is the designed fallback path.
- **Revalidation hook failure (network error on Vercel):** The 24h TTL ensures stale content expires eventually. No retry logic needed for v1 — the TTL is the safety net.
- **`next/image` missing remote pattern:** Next.js throws a clear error at runtime. Caught in development before deploy.
- **Payload `afterChange` hook throwing:** Wrap in try/catch; log the error but don't let it block the document save. Cache invalidation failure should never prevent content from saving.

---

## Testing

- **ISR behavior:** After removing `force-dynamic`, verify pages return `x-nextjs-cache: HIT` on second request in production. Check via `curl -I https://transcript-iq.com/expert-transcripts`.
- **On-demand revalidation:** Save + publish a transcript in Payload admin; within ~5 seconds the index and detail page should serve fresh content.
- **Layout cache:** Verify `site-settings` query does not appear in Vercel function logs on cached page requests.
- **Image format:** Open DevTools Network tab; images served from Vercel should show `Content-Type: image/webp` or `image/avif`.
- **No layout shift:** Run Lighthouse CLS check — should be 0 or near-0 after `width`/`height` props added.
- **`priority` prop LCP:** Lighthouse LCP should improve; hero image should no longer be flagged as render-blocking.

---

## Out of Scope (Phase II)

- Service Worker / offline caching
- CDN prefetch hints
- Font subsetting (already handled by `next/font`)
- Bundle size analysis / code splitting (separate concern)
- Payload API response caching (Redis layer) — overkill at current traffic
