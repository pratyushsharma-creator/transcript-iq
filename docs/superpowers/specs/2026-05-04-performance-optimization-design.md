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

Every Payload query that is currently called directly inside a Server Component must be wrapped:

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
    const payload = await getPayload({ config: await config })
    return payload.findGlobal({ slug: 'site-settings', depth: 1 })
  },
  ['site-settings'],
  { tags: ['site-settings'], revalidate: 86400 }
)
```

The 24h TTL is a safety net. The `SiteSettings` global hook (Section 2) will clear this cache within seconds of any admin save, so in practice the TTL never expires in normal operation.

**Constraint:** The wrapped function must be defined at module scope, not inside the component, so Next.js can stable-reference it for cache keying.

---

## Section 4: next/image Migration

### Config change — `next.config.ts`

Add `remotePatterns` for Vercel Blob so `next/image` can serve and optimize externally-hosted images:

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
      search: '',
    },
  ],
},
```

Without this, any `next/image` pointing at a Blob URL will throw a runtime error.

### Scope of `<img>` → `<Image>` migration

Three locations contain raw `<img>` tags rendering actual content (not decorative CSS/SVG):

| File | What it renders | Dimensions source |
|---|---|---|
| `src/components/site/Header.tsx` | Site logo (from SiteSettings) | Use `fill` with a sized wrapper |
| `src/app/(frontend)/expert-transcripts/[slug]/page.tsx` | Transcript cover image | `doc.coverImage.width` / `doc.coverImage.height` |
| `src/app/(frontend)/earnings-analysis/[slug]/page.tsx` | Report cover image | Same pattern |

**Dimensions strategy:**
- Payload media documents store `width` and `height` on the uploaded file object (available at `depth: 2`)
- Use explicit `width`/`height` props when available — prevents layout shift (CLS)
- Use `fill` + `position: relative` wrapper only for the logo where dimensions aren't reliably stored
- Apply `priority` prop on above-the-fold images (logo, transcript hero) to avoid LCP penalty
- All other images (below fold) rely on default lazy loading

**Import:** Replace `<img>` with `import Image from 'next/image'` in each file. The component name is `Image` (capital I) to distinguish from the HTML element.

### What this does NOT change

- CSS background images — not handled by `next/image`, already served as-is
- SVG icons — inline or `<img>` with SVG source, format conversion doesn't apply
- OG images (`opengraph-image.tsx`) — served by Next.js separately, not candidate for `next/image`

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
