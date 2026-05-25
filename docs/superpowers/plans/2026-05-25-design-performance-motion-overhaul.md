# Transcript IQ — Design, Performance & Motion Overhaul (Phase II)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate perceived page-load latency, ship all 10 approved design/UX fixes, and layer purposeful motion polish that matches the institutional financial research brand.

**Architecture:** Three sequential phases: (1) performance infrastructure — route-level loading skeletons, static generation for product pages, image `sizes` prop, and dynamic imports for heavy client components; (2) ten approved UI/UX fixes from `docs/design-overhaul-spec.md`; (3) motion layer using Framer Motion v12 (already in project via `motion/react`) targeting new components and micro-interactions. Every change is non-breaking, additive, and must pass `pnpm tsc --noEmit`.

**Tech Stack:** Next.js 16 App Router, Payload CMS 3 + PostgreSQL (Neon), Tailwind CSS, Framer Motion / `motion/react` v12, psycopg2 for direct DB content fixes, pnpm

**Spec reference:** `docs/design-overhaul-spec.md` — contains exact before/after code for all 10 design fixes. Always cross-reference it.

---

## File Map

### New files
| File | Purpose |
|------|---------|
| `src/app/(frontend)/expert-transcripts/loading.tsx` | Route-level skeleton for the transcript library page |
| `src/app/(frontend)/expert-transcripts/[slug]/loading.tsx` | Route-level skeleton for transcript product pages |
| `src/app/(frontend)/earnings-analysis/loading.tsx` | Route-level skeleton for earnings analysis library |
| `src/app/(frontend)/earnings-analysis/[slug]/loading.tsx` | Route-level skeleton for earnings product pages |
| `src/components/site/TestimonialStrip.tsx` | Social proof strip — 3 anonymised buy-side quotes (FIX 9) |

### Modified files
| File | What changes |
|------|-------------|
| `src/lib/cache/queries.ts` | Add `getAllTranscriptSlugs` + `getAllEarningsSlugs` |
| `src/app/(frontend)/expert-transcripts/[slug]/page.tsx` | Add `generateStaticParams` |
| `src/app/(frontend)/earnings-analysis/[slug]/page.tsx` | Add `generateStaticParams` |
| `src/components/blocks/Hero.tsx` | FIX 1: 5 spacing tweaks; add `sizes` prop to fill image |
| `src/components/blocks/Conversion.tsx` | `next/dynamic` for `BackgroundBeams` canvas component |
| `src/components/library/TranscriptLibrary.tsx` | FIX 3 (overflow) + FIX 4 (search) + FIX 5 (counts) + FIX 7B (compliance color) + motion |
| `src/components/blocks/catalog/EarningsAnalysisCard.tsx` | FIX 6: button sizing and layout; `prefetch={false}` on card Link (Task 9) |
| `src/components/blocks/shared/ComplianceBadgePill.tsx` | FIX 7A: color token swap |
| `src/components/blocks/catalog/TranscriptCard.tsx` | FIX 7C: compliance color + `prefetch={false}` on card Link |
| `src/components/library/EarningsLibrary.tsx` | FIX 10: search capability + motion |
| `src/app/(frontend)/page.tsx` | Import + render `TestimonialStrip` after `RenderBlocks` |
| `src/app/globals.css` | `prefers-reduced-motion` global safeguard |

---

## Phase 1 — Performance Foundation

---

### Task 1: Route-level loading skeletons

Every RSC page in the transcript and earnings routes blocks the user's viewport until the server finishes. Adding `loading.tsx` next to each `page.tsx` gives Next.js a streaming fallback — the shell renders instantly, data streams in.

**Files:**
- Create: `src/app/(frontend)/expert-transcripts/loading.tsx`
- Create: `src/app/(frontend)/expert-transcripts/[slug]/loading.tsx`
- Create: `src/app/(frontend)/earnings-analysis/loading.tsx`
- Create: `src/app/(frontend)/earnings-analysis/[slug]/loading.tsx`

- [ ] **Step 1: Create transcript library skeleton**

```tsx
// src/app/(frontend)/expert-transcripts/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--bg)] animate-pulse">
      {/* Page header */}
      <div className="relative border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-10 py-10 sm:py-14">
          <div className="h-2.5 w-28 rounded bg-[var(--surface-2)] mb-6" />
          <div className="h-9 w-64 rounded-lg bg-[var(--surface-2)] mb-3" />
          <div className="h-4 w-96 max-w-full rounded bg-[var(--surface-2)]" />
        </div>
      </div>
      {/* Main content */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-10 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="hidden lg:flex lg:flex-col gap-4 w-52 shrink-0 pt-2">
            {[80, 65, 72, 58, 70].map((w, i) => (
              <div key={i} className="h-3.5 rounded bg-[var(--surface-2)]" style={{ width: `${w}%` }} />
            ))}
          </div>
          {/* Card grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
                <div className="flex gap-2">
                  <div className="h-5 w-16 rounded-full bg-[var(--surface-2)]" />
                  <div className="h-5 w-12 rounded-full bg-[var(--surface-2)]" />
                </div>
                <div className="h-5 w-full rounded bg-[var(--surface-2)]" />
                <div className="h-4 w-3/4 rounded bg-[var(--surface-2)]" />
                <div className="h-4 w-1/2 rounded bg-[var(--surface-2)]" />
                <div className="mt-4 h-9 w-full rounded-lg bg-[var(--surface-2)]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create transcript product page skeleton**

```tsx
// src/app/(frontend)/expert-transcripts/[slug]/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--bg)] animate-pulse">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
          {/* Main content */}
          <div className="space-y-6">
            <div className="flex gap-2">
              {[60, 48, 56].map((w, i) => (
                <div key={i} className="h-5 rounded-full bg-[var(--surface-2)]" style={{ width: w }} />
              ))}
            </div>
            <div className="h-10 w-4/5 rounded-lg bg-[var(--surface-2)]" />
            <div className="h-6 w-2/3 rounded bg-[var(--surface-2)]" />
            <div className="space-y-2 pt-4">
              {[100, 95, 88, 92, 85].map((w, i) => (
                <div key={i} className="h-4 rounded bg-[var(--surface-2)]" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
          {/* Purchase panel */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4 h-fit">
            <div className="h-8 w-24 rounded bg-[var(--surface-2)]" />
            <div className="h-12 w-full rounded-xl bg-[var(--surface-2)]" />
            <div className="h-10 w-full rounded-xl bg-[var(--surface-2)]" />
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create earnings library skeleton**

```tsx
// src/app/(frontend)/earnings-analysis/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--bg)] animate-pulse">
      <div className="relative border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-10 py-10 sm:py-14">
          <div className="h-2.5 w-28 rounded bg-[var(--surface-2)] mb-6" />
          <div className="h-9 w-72 rounded-lg bg-[var(--surface-2)] mb-3" />
          <div className="h-4 w-80 max-w-full rounded bg-[var(--surface-2)]" />
        </div>
      </div>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-10 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
              <div className="h-4 w-20 rounded-full bg-[var(--surface-2)]" />
              <div className="h-5 w-full rounded bg-[var(--surface-2)]" />
              <div className="h-4 w-3/4 rounded bg-[var(--surface-2)]" />
              <div className="mt-3 flex gap-2">
                <div className="h-9 flex-1 rounded-lg bg-[var(--surface-2)]" />
                <div className="h-9 flex-1 rounded-lg bg-[var(--surface-2)]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create earnings product page skeleton**

```tsx
// src/app/(frontend)/earnings-analysis/[slug]/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--bg)] animate-pulse">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
          <div className="space-y-6">
            <div className="h-6 w-32 rounded-full bg-[var(--surface-2)]" />
            <div className="h-10 w-3/4 rounded-lg bg-[var(--surface-2)]" />
            <div className="h-5 w-48 rounded bg-[var(--surface-2)]" />
            <div className="space-y-2 pt-4">
              {[100, 93, 87, 95, 80].map((w, i) => (
                <div key={i} className="h-4 rounded bg-[var(--surface-2)]" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4 h-fit">
            <div className="h-8 w-24 rounded bg-[var(--surface-2)]" />
            <div className="h-12 w-full rounded-xl bg-[var(--surface-2)]" />
            <div className="h-10 w-full rounded-xl bg-[var(--surface-2)]" />
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Verify TypeScript**

```bash
cd "C:/Transcript IQ (Claude Build)" && pnpm tsc --noEmit
```
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add src/app/\(frontend\)/expert-transcripts/loading.tsx \
        src/app/\(frontend\)/expert-transcripts/\[slug\]/loading.tsx \
        src/app/\(frontend\)/earnings-analysis/loading.tsx \
        src/app/\(frontend\)/earnings-analysis/\[slug\]/loading.tsx
git commit -m "perf: add route-level loading skeletons for library and product pages"
```

---

### Task 2: Static generation for product pages (`generateStaticParams`)

Currently every `/expert-transcripts/[slug]` and `/earnings-analysis/[slug]` page is rendered on-demand server-side per request (ISR: first request per 24h is slow). `generateStaticParams` pre-builds every product page at deploy time — subsequent requests serve a static HTML file in <50ms.

**Files:**
- Modify: `src/lib/cache/queries.ts` (append two new exported functions)
- Modify: `src/app/(frontend)/expert-transcripts/[slug]/page.tsx` (add `generateStaticParams` export)
- Modify: `src/app/(frontend)/earnings-analysis/[slug]/page.tsx` (add `generateStaticParams` export)

- [ ] **Step 1: Add `getAllTranscriptSlugs` to queries.ts**

Open `src/lib/cache/queries.ts`. Append after the `getRelatedTranscripts` function (after line ~131). Do NOT use `select` or `pagination` — just fetch all docs and map slugs to avoid Payload type issues:

```ts
export const getAllTranscriptSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const payload = await getPayload({ config: await config })
    const { docs } = await payload.find({
      collection: 'expert-transcripts',
      limit: 1000,
      depth: 0,
    })
    return docs.map((d) => d.slug).filter((s): s is string => Boolean(s))
  },
  ['all-transcript-slugs'],
  { tags: [CACHE_TAGS.expertTranscripts], revalidate: 86400 },
)
```

- [ ] **Step 2: Add `getAllEarningsSlugs` to queries.ts**

Append after the `getRelatedEarningsAnalyses` function (after line ~225). Check `src/lib/cache/revalidation.ts` first to confirm the exact key for earnings analyses — look for a constant named something like `earningsAnalyses` and use it for `tags`:

```ts
export const getAllEarningsSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const payload = await getPayload({ config: await config })
    const { docs } = await payload.find({
      collection: 'earnings-analyses',
      limit: 1000,
      depth: 0,
    })
    return docs.map((d) => d.slug).filter((s): s is string => Boolean(s))
  },
  ['all-earnings-slugs'],
  { tags: [CACHE_TAGS.earningsAnalyses], revalidate: 86400 },
)
```

If `CACHE_TAGS.earningsAnalyses` doesn't exist in `revalidation.ts`, use the closest matching key. If none exists for earnings, use `[CACHE_TAGS.expertTranscripts]` as a fallback (safe — just means it revalidates with transcripts).

- [ ] **Step 3: Add `generateStaticParams` to transcript slug page**

Open `src/app/(frontend)/expert-transcripts/[slug]/page.tsx`. Find the EXISTING import line from `@/lib/cache/queries` (it already imports `getTranscriptBySlug` and `getRelatedTranscripts`). **Extend that existing line** — do NOT add a second import:

```ts
// Existing line (find it):
import { getTranscriptBySlug, getRelatedTranscripts } from '@/lib/cache/queries'
// Change to (add getAllTranscriptSlugs):
import { getTranscriptBySlug, getRelatedTranscripts, getAllTranscriptSlugs } from '@/lib/cache/queries'
```

Then add this export after the `revalidate` export, before `generateMetadata`:

```ts
export async function generateStaticParams() {
  const slugs = await getAllTranscriptSlugs()
  return slugs.map((slug) => ({ slug }))
}
```

**Note on `dynamicParams`:** Next.js App Router defaults `dynamicParams = true` — slugs NOT returned by `generateStaticParams` will still be server-rendered on demand (not 404d). This is the correct behavior for a growing catalog. Leave it at the default (do not add `export const dynamicParams = false`).

- [ ] **Step 4: Add `generateStaticParams` to earnings slug page**

Open `src/app/(frontend)/earnings-analysis/[slug]/page.tsx`. Find the EXISTING import line from `@/lib/cache/queries` and extend it — do NOT add a second import:

```ts
// Existing line (find it — imports getEarningsAnalysisBySlug, getRelatedEarningsAnalyses):
import { getEarningsAnalysisBySlug, getRelatedEarningsAnalyses } from '@/lib/cache/queries'
// Change to:
import { getEarningsAnalysisBySlug, getRelatedEarningsAnalyses, getAllEarningsSlugs } from '@/lib/cache/queries'
```

Then add this export after the `revalidate` export, before `generateMetadata`:

```ts
export async function generateStaticParams() {
  const slugs = await getAllEarningsSlugs()
  return slugs.map((slug) => ({ slug }))
}
```

- [ ] **Step 5: Verify TypeScript**

```bash
cd "C:/Transcript IQ (Claude Build)" && pnpm tsc --noEmit
```
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add src/lib/cache/queries.ts \
        src/app/\(frontend\)/expert-transcripts/\[slug\]/page.tsx \
        src/app/\(frontend\)/earnings-analysis/\[slug\]/page.tsx
git commit -m "perf: generateStaticParams for transcript and earnings product pages"
```

---

### Task 3: Dynamic import for BackgroundBeams canvas component

`BackgroundBeams` (`src/components/ui/background-beams.tsx`) is a canvas-based particle animation imported statically in `Conversion.tsx`. It's `'use client'`, runs heavy canvas work, and is below the fold on every page that uses `Conversion`. Wrapping it in `next/dynamic` with `ssr: false` removes it from the initial JS bundle and defers its execution until it scrolls into view.

**Files:**
- Modify: `src/components/blocks/Conversion.tsx`

- [ ] **Step 1: Check the current import in Conversion.tsx**

Open `src/components/blocks/Conversion.tsx`. Locate the existing import of `BackgroundBeams`. It will look like:

```ts
import { BackgroundBeams } from '@/components/ui/background-beams'
```

Note the exact import path and exported name — use them exactly in Step 2.

- [ ] **Step 2: Replace static import with dynamic import**

At the top of `Conversion.tsx`, add:

```ts
import dynamic from 'next/dynamic'
```

Replace the static BackgroundBeams import with:

```ts
const BackgroundBeams = dynamic(
  () => import('@/components/ui/background-beams').then((m) => m.BackgroundBeams),
  { ssr: false, loading: () => null },
)
```

Remove the old static `import { BackgroundBeams } from ...` line.

- [ ] **Step 3: Verify nothing broke — TypeScript check**

```bash
cd "C:/Transcript IQ (Claude Build)" && pnpm tsc --noEmit
```
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/components/blocks/Conversion.tsx
git commit -m "perf: lazy-load BackgroundBeams canvas component via next/dynamic"
```

---

### Task 4: Image `sizes` prop on Hero fill image

The Hero uses `<Image ... fill>` without a `sizes` prop. Without it, Next.js generates a `100vw` srcset — browsers on mobile download a 1280px image when they only need 390px. This directly impacts LCP.

**Files:**
- Modify: `src/components/blocks/Hero.tsx`

**Context:** Only fix the Hero for now — it's the LCP element on every page. Other fill images in Features/Conversion/Editorial/Persona/Misc are below the fold and their srcset overloading is tolerable for this pass.

- [ ] **Step 1: Find the fill Image in Hero.tsx**

Open `src/components/blocks/Hero.tsx`. Search for `<Image` with `fill`. It will be inside the `StencilHero` function, rendering the background or feature image.

- [ ] **Step 2: Add the sizes prop**

Add `sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 640px"` to that Image component. Adjust if the image is full-width (use `100vw` for all breakpoints) — look at how it's styled to determine. Example:

```tsx
// Full-width background image:
sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1024px"

// Half-width feature image (right column):
sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"
```

Pick whichever matches the actual layout.

- [ ] **Step 3: Verify TypeScript**

```bash
cd "C:/Transcript IQ (Claude Build)" && pnpm tsc --noEmit
```
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/components/blocks/Hero.tsx
git commit -m "perf: add sizes prop to Hero fill image to reduce LCP payload"
```

---

## Phase 2 — Design Fixes

Reference: `docs/design-overhaul-spec.md` contains the exact before/after code for every fix below. Always read the spec section before editing.

---

### Task 5: FIX 1 — Hero: pull CTAs above the fold

**Spec section:** `## FIX 1`
**Files:**
- Modify: `src/components/blocks/Hero.tsx`

Five small changes inside the `StencilHero` function. Make them in order top-to-bottom in the file.

- [ ] **Step 1: Remove forced full-viewport height (1a)**

Find (around line 71):
```tsx
style={{ background: 'var(--bg)', minHeight: 'calc(100vh - 56px)' }}
```
Change to:
```tsx
style={{ background: 'var(--bg)' }}
```

- [ ] **Step 2: Reduce top padding on the inner container (1b)**

Find (around line 118):
```
pt-10 pb-10 sm:pt-14 sm:pb-12 lg:pt-20 lg:pb-18
```
Change to:
```
pt-10 pb-10 sm:pt-12 sm:pb-10 lg:pt-12 lg:pb-12
```
(The full className string for the div is long — only change the padding classes, leave everything else.)

- [ ] **Step 3: Tighten eyebrow bottom margin (1c)**

Find `marginBottom: 40` near the eyebrow element. Change to `marginBottom: 24`.

- [ ] **Step 4: Tighten heading block bottom margin (1d)**

Find `<div style={{ marginBottom: 36 }}>` wrapping the heading. Change to `marginBottom: 20`.

- [ ] **Step 5: Tighten subheading bottom margin (1e)**

Find `marginBottom: 44` near the subheading element. Change to `marginBottom: 28`.

- [ ] **Step 6: TypeScript check**

```bash
cd "C:/Transcript IQ (Claude Build)" && pnpm tsc --noEmit
```
Expected: no errors

- [ ] **Step 7: Commit**

```bash
git add src/components/blocks/Hero.tsx
git commit -m "fix: pull hero CTAs above the fold by tightening spacing (FIX 1)"
```

---

### Task 6: FIX 2 + FIX 8 — Payload CMS content fixes (via direct SQL)

**Spec sections:** `## FIX 2` and `## FIX 8`

Two content-only CMS changes:
- **FIX 2:** Home page hero — swap "Get a Free Transcript" → primary, "Browse Transcripts" → secondary
- **FIX 8:** Custom Reports hero — merge 3-line heading into 2 lines

These require direct SQL via psycopg2, using the same approach that worked for the CEO audit fixes. The DATABASE_URI is in `.env.local`.

**Files:**
- No code files modified. Python script executed locally.

- [ ] **Step 1: Run diagnostic to find relevant tables**

Create a temporary Python script (do not commit it) and run it:

```python
# /tmp/cms_fix_diag.py
import os
import psycopg2

# Load DATABASE_URI from .env.local
db_uri = None
with open("C:/Transcript IQ (Claude Build)/.env.local") as f:
    for line in f:
        if line.startswith("DATABASE_URI="):
            db_uri = line.split("=", 1)[1].strip().strip('"').strip("'")
            break

conn = psycopg2.connect(db_uri)
cur = conn.cursor()

# 1. Find all hero/CTA related tables
cur.execute("""
    SELECT tablename FROM pg_tables 
    WHERE schemaname='public' 
      AND (tablename LIKE '%hero%' OR tablename LIKE '%cta%')
    ORDER BY tablename
""")
print("Hero/CTA tables:", cur.fetchall())

# 2. Find pages with relevant slugs
cur.execute("""
    SELECT id, slug FROM pages WHERE slug IN ('home', 'index', '', 'custom-reports')
    LIMIT 10
""")
print("Relevant pages:", cur.fetchall())

# 3. Show all pages (to find home and custom-reports IDs)
cur.execute("SELECT id, slug, title FROM pages ORDER BY created_at LIMIT 20")
print("All pages:", cur.fetchall())

conn.close()
```

Run: `python /tmp/cms_fix_diag.py`

Capture the output. You need:
- The exact table names for hero blocks and CTAs
- The `id` of the home page and the custom-reports page

- [ ] **Step 2: Inspect the CTA data to find the correct records**

Based on the table names and page IDs from Step 1, run a second diagnostic. Replace `HERO_TABLE`, `CTA_TABLE`, and `HOME_PAGE_ID` with the actual values from Step 1's output (do not run with placeholder names):

```python
# /tmp/cms_fix_diag2.py  — fill in HERO_TABLE, CTA_TABLE, HOME_PAGE_ID from Step 1
import psycopg2

HERO_TABLE = 'pages_blocks_stencil_hero'  # replace with actual table from Step 1
CTA_TABLE  = 'pages_blocks_stencil_hero_ctas'  # replace with actual table from Step 1
HOME_PAGE_ID = 'REPLACE_WITH_ID_FROM_STEP_1'

db_uri = None
with open("C:/Transcript IQ (Claude Build)/.env.local") as f:
    for line in f:
        if line.startswith("DATABASE_URI="):
            db_uri = line.split("=", 1)[1].strip().strip('"').strip("'")
            break

conn = psycopg2.connect(db_uri)
cur = conn.cursor()

# Get column names of CTA table (PostgreSQL syntax — not DESCRIBE which is MySQL-only)
cur.execute("""
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = %s
    ORDER BY ordinal_position
""", (CTA_TABLE,))
print("CTA columns:", cur.fetchall())

# Get hero block for home page
cur.execute(f"SELECT * FROM {HERO_TABLE} WHERE _parent_id = %s LIMIT 5", (HOME_PAGE_ID,))
print("Hero blocks:", cur.fetchall())

# Get all CTAs (to see variant and label values)
cur.execute(f"SELECT * FROM {CTA_TABLE} LIMIT 20")
print("All CTAs:", cur.fetchall())

conn.close()
```

- [ ] **Step 3: Apply FIX 2 — swap CTA variants on home page**

Using the actual values found in Steps 1–2, write and run a Python script. Fill in `HERO_TABLE`, `CTA_TABLE`, `HOME_HERO_BLOCK_ID`, and the actual column names for label and variant from the diagnostic output:

```python
# /tmp/cms_fix_cta.py  — fill ALL CAPS vars with real values from Steps 1-2
import psycopg2

HERO_TABLE       = 'pages_blocks_stencil_hero'      # from Step 1 diagnostic
CTA_TABLE        = 'pages_blocks_stencil_hero_ctas'  # from Step 1 diagnostic
HOME_HERO_BLOCK_ID = 'REPLACE_WITH_ACTUAL_HERO_BLOCK_ID'  # from Step 2: id from HERO_TABLE WHERE _parent_id=home_page_id
LABEL_COL        = 'label'    # confirm column name from Step 2 CTA columns output
VARIANT_COL      = 'variant'  # confirm column name from Step 2 CTA columns output
PARENT_COL       = '_parent_id'  # confirm column name from Step 2 CTA columns output

db_uri = None
with open("C:/Transcript IQ (Claude Build)/.env.local") as f:
    for line in f:
        if line.startswith("DATABASE_URI="):
            db_uri = line.split("=", 1)[1].strip().strip('"').strip("'")
            break

conn = psycopg2.connect(db_uri)
cur = conn.cursor()

# FIX 2a: "Browse Transcripts" → secondary
cur.execute(
    f"UPDATE {CTA_TABLE} SET {VARIANT_COL} = 'secondary' WHERE {LABEL_COL} ILIKE %s AND {PARENT_COL} = %s",
    ('%Browse Transcripts%', HOME_HERO_BLOCK_ID)
)
print("Browse Transcripts rows updated:", cur.rowcount)

# FIX 2b: "Get a Free Transcript" → primary
cur.execute(
    f"UPDATE {CTA_TABLE} SET {VARIANT_COL} = 'primary' WHERE {LABEL_COL} ILIKE %s AND {PARENT_COL} = %s",
    ('%Free Transcript%', HOME_HERO_BLOCK_ID)
)
print("Free Transcript rows updated:", cur.rowcount)

conn.commit()
conn.close()
```

Expected: 1 row updated for each query.

- [ ] **Step 4: Apply FIX 8 — merge Custom Reports heading to 2 lines**

First inspect the hero block for the custom-reports page to understand how the heading is stored. Using the actual table name and custom-reports page ID from Step 1:

```python
# /tmp/cms_fix_inspect.py  — fill ALL CAPS vars with real values from Step 1
import psycopg2

HERO_TABLE           = 'pages_blocks_stencil_hero'   # from Step 1
CUSTOM_REPORTS_PAGE_ID = 'REPLACE_WITH_ACTUAL_ID'    # from Step 1 pages query

db_uri = None
with open("C:/Transcript IQ (Claude Build)/.env.local") as f:
    for line in f:
        if line.startswith("DATABASE_URI="):
            db_uri = line.split("=", 1)[1].strip().strip('"').strip("'")
            break

conn = psycopg2.connect(db_uri)
cur = conn.cursor()

cur.execute(f"SELECT * FROM {HERO_TABLE} WHERE _parent_id = %s", (CUSTOM_REPORTS_PAGE_ID,))
rows = cur.fetchall()
for row in rows:
    print(row)

conn.close()
```

Inspect the output to see how the heading is stored (text with `\n`, JSON array, etc.). Then write the update:

```python
# /tmp/cms_fix_heading.py  — fill ALL CAPS vars with real values
import psycopg2

HERO_TABLE           = 'pages_blocks_stencil_hero'
CUSTOM_REPORTS_PAGE_ID = 'REPLACE_WITH_ACTUAL_ID'
HEADING_COL          = 'heading'  # confirm column name from inspection

db_uri = None
with open("C:/Transcript IQ (Claude Build)/.env.local") as f:
    for line in f:
        if line.startswith("DATABASE_URI="):
            db_uri = line.split("=", 1)[1].strip().strip('"').strip("'")
            break

conn = psycopg2.connect(db_uri)
cur = conn.cursor()

# If heading is stored as a plain text string with \n line breaks:
new_heading = "Can't find what you need?\nWe'll build it."
cur.execute(
    f"UPDATE {HERO_TABLE} SET {HEADING_COL} = %s WHERE _parent_id = %s",
    (new_heading, CUSTOM_REPORTS_PAGE_ID)
)
print("Heading rows updated:", cur.rowcount)

conn.commit()
conn.close()
```

If the heading is stored as JSONB (an array of line objects), log the current value, understand its structure, and build the replacement JSON accordingly before running the UPDATE. Adapt based on what you find.

- [ ] **Step 5: Verify via site**

The Payload ISR cache will revalidate within 3600 seconds. To force immediate revalidation, either:
- Trigger a Payload webhook (if configured), OR
- Wait for the next cache cycle, OR
- Check `/api/revalidate` if that route exists

Verify visually at:
- Home page: "Get a Free Transcript" should be solid green button; "Browse Transcripts" should be ghost/outline
- Custom Reports page: heading should read 2 lines: dark "Can't find what you need?" / green italic "We'll build it."

- [ ] **Step 6: Delete the diagnostic scripts**

```bash
rm /tmp/cms_fix_diag.py
```

No git commit needed — no code files were changed.

---

### Task 7: FIX 3 + 4 + 5 + 7B — TranscriptLibrary complete pass

All four fixes touch `TranscriptLibrary.tsx`. Do them in one file edit session to avoid conflicts. Read `docs/design-overhaul-spec.md` sections FIX 3, FIX 4, FIX 5, and FIX 7 (Change B) before starting.

**Files:**
- Modify: `src/components/library/TranscriptLibrary.tsx`

Work through the file top-to-bottom. After each logical change, verify nothing is visually broken before the next.

- [ ] **Step 1: FIX 3 — Remove overflow-hidden from page header**

Find the page-header section div (around line 594–600) with `className="relative overflow-hidden"`. Change to `className="relative"`. Remove `overflow-hidden` only — leave all other classes.

Also in that same section, find the h1+badge flex row (around line 617):
```tsx
<div className="flex flex-wrap items-end justify-between gap-4 mb-4">
```
Change to:
```tsx
<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
```

And on the badge container (around line 621), remove `shrink-0`:
```tsx
// Before:
<div className="flex items-center gap-4 shrink-0 pb-1">
// After:
<div className="flex items-center gap-4 pb-1">
```

- [ ] **Step 2: FIX 4 — Add searchQuery state**

In the `TranscriptLibrary` component body, after the existing `useState` calls, add:
```tsx
const [searchQuery, setSearchQuery] = useState('')
```

- [ ] **Step 3: FIX 4 — Add displayDocs derived variable**

**First, verify the field name** — check the `TranscriptDoc` type near the top of the file to confirm how the companies field is named. Look for a field containing "compan" in the type definition. It's likely `companies: string | null` but confirm before using.

Before the `return` statement in `TranscriptLibrary`, add:
```tsx
const displayDocs = searchQuery.trim()
  ? docs.filter((d) => {
      const q = searchQuery.toLowerCase()
      return (
        d.title.toLowerCase().includes(q) ||
        (d.expertFormerTitle ?? '').toLowerCase().includes(q) ||
        (d.companies ?? '').toLowerCase().includes(q)  // verify field name matches TranscriptDoc type
      )
    })
  : docs
```

If the field is named differently (e.g., `companyName` or `companiesServed`), update `d.companies` to match. TypeScript will tell you on `pnpm tsc --noEmit` if it's wrong.

Then replace ALL uses of `docs` in the card grid render with `displayDocs`. Search for `docs.map(` and `docs.length` in the render section and update each one.

- [ ] **Step 4: FIX 4 — Add search input UI**

Inside the content column (`.flex-1.min-w-0`), directly above the toolbar div (the div with className containing `flex flex-wrap items-center justify-between gap-3 mb-6 pb-5`), insert the search bar from the spec:

```tsx
{/* Search bar */}
<div className="relative mb-4">
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--mist)] pointer-events-none"
  >
    <circle cx="6.5" cy="6.5" r="4.5" />
    <path d="M10 10l3.5 3.5" strokeLinecap="round" />
  </svg>
  <input
    type="search"
    placeholder="Search by title, expert, or company…"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] pl-8 pr-4 py-2.5 font-mono text-[12px] text-[var(--ink)] placeholder-[var(--mist)] outline-none transition-all duration-150 focus:border-[var(--accent-border)] focus:ring-1 focus:ring-[var(--accent-border)]"
  />
  {searchQuery && (
    <button
      onClick={() => setSearchQuery('')}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--mist)] hover:text-[var(--ink)] transition-colors"
      aria-label="Clear search"
    >
      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3 w-3">
        <path d="M2 2l8 8M10 2l-8 8" strokeLinecap="round" />
      </svg>
    </button>
  )}
</div>
```

- [ ] **Step 5: FIX 4 — Update result count span**

Find the count span (around line 671). Update `docs.length` and `hasFilters` references:
```tsx
<span className="font-mono text-[11px] text-[var(--mist)] tracking-[0.06em] whitespace-nowrap">
  <strong className="text-[var(--ink)]">{displayDocs.length}</strong>
  {(hasFilters || searchQuery) ? ' matching' : ''} transcript{displayDocs.length !== 1 ? 's' : ''}
</span>
```

- [ ] **Step 6: FIX 5 — Add filterCounts computation**

In the component body, after the existing state declarations, add:

```tsx
// Compute filter value counts from the full initial dataset (before any active filters)
const filterCounts = {
  industry: {} as Record<string, number>,
  geography: {} as Record<string, number>,
  level: {} as Record<string, number>,
  tier: {} as Record<string, number>,
}
for (const doc of initialDocs) {
  const sector = doc.sectors?.find(isPopulated) as Industry | undefined
  if (sector?.slug) filterCounts.industry[sector.slug] = (filterCounts.industry[sector.slug] ?? 0) + 1
  for (const g of doc.geography ?? []) filterCounts.geography[g] = (filterCounts.geography[g] ?? 0) + 1
  if (doc.expertLevel) filterCounts.level[doc.expertLevel] = (filterCounts.level[doc.expertLevel] ?? 0) + 1
  filterCounts.tier[doc.tier] = (filterCounts.tier[doc.tier] ?? 0) + 1
}
```

**IMPORTANT:** Before adding any `isPopulated` definition, search the file for `isPopulated` first:
```bash
grep -n "isPopulated" "C:/Transcript IQ (Claude Build)/src/components/library/TranscriptLibrary.tsx"
```
If it already exists in the file, use it as-is — do NOT redefine it or you will get a TypeScript "Cannot redeclare block-scoped variable" error. Only if the grep returns nothing should you add: `const isPopulated = (v: unknown): v is object => typeof v === 'object' && v !== null`

- [ ] **Step 7: FIX 5 — Pass counts to FilterPanel (both desktop and mobile)**

Find all `<FilterPanel` usages in the component (desktop sidebar AND mobile drawer). Add `counts={filterCounts}` to each:

```tsx
<FilterPanel
  industries={industries}
  filters={filters}
  onToggle={toggleFilter}
  onClearAll={clearAll}
  counts={filterCounts}
/>
```

- [ ] **Step 8: FIX 5 — Update FilterPanel props type**

Find the `FilterPanel` function declaration in the same file. Update the props type:

```tsx
function FilterPanel({
  industries, filters, onToggle, onClearAll, counts,
}: {
  industries: Industry[]
  filters: ActiveFilters
  onToggle: (group: keyof ActiveFilters, value: string) => void
  onClearAll: () => void
  counts?: {
    industry: Record<string, number>
    geography: Record<string, number>
    level: Record<string, number>
    tier: Record<string, number>
  }
})
```

Pass counts down to each `FilterGroup`:

```tsx
<FilterGroup
  label="Industry"
  items={industries.map((i) => ({ label: i.name, value: i.slug }))}
  active={filters.industry}
  onToggle={(v) => onToggle('industry', v)}
  counts={counts?.industry}
/>
<FilterGroup label="Geography" items={GEO_OPTIONS} active={filters.geography} onToggle={(v) => onToggle('geography', v)} counts={counts?.geography} />
<FilterGroup label="Expert Level" items={LEVEL_OPTIONS} active={filters.level} onToggle={(v) => onToggle('level', v)} counts={counts?.level} />
<FilterGroup label="Tier" items={TIER_OPTIONS} active={filters.tier} onToggle={(v) => onToggle('tier', v)} counts={counts?.tier} />
```

- [ ] **Step 9: FIX 5 — Update FilterGroup to accept and display counts**

Find the `FilterGroup` function declaration. Add `counts?: Record<string, number>` to props and update the label span:

```tsx
function FilterGroup({
  label, items, active, onToggle, counts,
}: {
  label: string
  items: { label: string; value: string }[]
  active: Set<string>
  onToggle: (value: string) => void
  counts?: Record<string, number>
})
```

In the item render, update the label span:

```tsx
<span className={`flex-1 text-[13px] leading-[1.3] transition-colors ${
  checked ? 'text-[var(--ink)] font-medium' : 'text-[var(--ink-2)] group-hover:text-[var(--ink)]'
}`}>
  {item.label}
  {counts?.[item.value] != null && (
    <span className="ml-1 text-[var(--mist)] font-normal">({counts[item.value]})</span>
  )}
</span>
```

- [ ] **Step 10: FIX 7B — Fix compliance text color in card meta band**

Search for `text-[var(--accent)]` near `complianceBadges` or `MNPI Screened` in this file (around line 391–395). Change `text-[var(--accent)]` to `text-[var(--ink-2)]`:

```tsx
// Before:
<div className="text-[12px] font-medium text-[var(--accent)]">
// After:
<div className="text-[12px] font-medium text-[var(--ink-2)]">
```

- [ ] **Step 11: TypeScript check**

```bash
cd "C:/Transcript IQ (Claude Build)" && pnpm tsc --noEmit
```
Expected: no errors. If you get a type error on `filterCounts` or `counts`, check that the generic types on `Record<string, number>` match what's expected.

- [ ] **Step 12: Commit**

```bash
git add src/components/library/TranscriptLibrary.tsx
git commit -m "fix: TranscriptLibrary overflow, search, filter counts, compliance color (FIX 3/4/5/7B)"
```

---

### Task 8: FIX 6 — EarningsAnalysisCard button sizing

**Spec section:** `## FIX 6`
**Files:**
- Modify: `src/components/blocks/catalog/EarningsAnalysisCard.tsx`

The "Add" + "Buy Now" buttons are too small and mismatched. Replace the button row with the properly sized version from the spec.

- [ ] **Step 1: Locate the action buttons section**

Open `src/components/blocks/catalog/EarningsAnalysisCard.tsx`. Search for `handleAddToCart` or `handleBuyNow` — the buttons div is directly below or around those handlers.

- [ ] **Step 2: Replace the button row**

Replace the existing `<div className="flex items-center gap-2">` button wrapper and its contents with:

```tsx
<div className="flex gap-[8px]">
  <button
    type="button"
    onClick={handleAddToCart}
    className={`flex-1 inline-flex items-center justify-center gap-1 rounded-[8px] border py-[9px] font-sans text-[12px] font-medium tracking-[-0.01em] transition-all duration-150 ${
      inCart
        ? 'border-[var(--accent-border)] bg-[var(--accent-tint)] text-[var(--accent)]'
        : 'border-[var(--border)] bg-transparent text-[var(--ink-2)] hover:border-[var(--border-2)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]'
    }`}
  >
    <ShoppingCart className="h-[11px] w-[11px] shrink-0" />
    {inCart ? 'In Cart' : 'Add to Cart'}
  </button>
  <button
    type="button"
    onClick={handleBuyNow}
    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-[8px] bg-btn-primary py-[9px] font-sans text-[12px] font-semibold tracking-[-0.01em] text-btn-primary-fg shadow-cta transition-all duration-base ease-out hover:-translate-y-px hover:bg-btn-primary-hover"
  >
    <ShoppingCart className="h-[11px] w-[11px] shrink-0" />
    Buy Now
  </button>
</div>
```

Also check the spec's FIX 6 section for the `flat · instant PDF` text repositioning — update that section too if the text is currently floating above the buttons incorrectly. The spec describes wrapping the price section in a `flex items-end justify-between` div with `flat · instant PDF` right-aligned.

- [ ] **Step 3: TypeScript check**

```bash
cd "C:/Transcript IQ (Claude Build)" && pnpm tsc --noEmit
```
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/components/blocks/catalog/EarningsAnalysisCard.tsx
git commit -m "fix: resize EarningsAnalysisCard Add/Buy buttons to proper tap targets (FIX 6)"
```

---

### Task 9: FIX 7A + 7C — Compliance badge and TranscriptCard color

**Spec sections:** `## FIX 7` — Change A and Change C
**Files:**
- Modify: `src/components/blocks/shared/ComplianceBadgePill.tsx`
- Modify: `src/components/blocks/catalog/TranscriptCard.tsx`

One CSS token swap in each file. Green (`var(--accent)`) badges look clickable — they should read as neutral informational labels.

- [ ] **Step 1: ComplianceBadgePill — swap accent to neutral**

Open `src/components/blocks/shared/ComplianceBadgePill.tsx`. Find:

```tsx
className={`inline-flex items-center gap-1 rounded-md border border-[var(--accent-border)] bg-[var(--accent-tint)] font-mono font-medium uppercase tracking-[0.08em] text-[var(--accent)] ${sizing}`}
```

Change to:

```tsx
className={`inline-flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--surface-2)] font-mono font-medium uppercase tracking-[0.08em] text-[var(--ink-2)] ${sizing}`}
```

- [ ] **Step 2: TranscriptCard — fix compliance text color**

Open `src/components/blocks/catalog/TranscriptCard.tsx`. Search for `text-[var(--accent)]` near `complianceBadges` or `MNPI Screened` (around line 393). Change:

```tsx
// Before:
<div className="text-[12px] font-medium text-[var(--accent)]">
// After:
<div className="text-[12px] font-medium text-[var(--ink-2)]">
```

- [ ] **Step 3: Also add `prefetch={false}` to TranscriptCard's Link**

While in `TranscriptCard.tsx`, find the main `<Link>` wrapping the card (it navigates to the product slug page). Add `prefetch={false}`:

```tsx
// Before:
<Link href={`/expert-transcripts/${data.slug}`} ...>
// After:
<Link href={`/expert-transcripts/${data.slug}`} prefetch={false} ...>
```

This stops Next.js from prefetching all 24+ product pages simultaneously when the library grid is in view — reduces background request burst.

Also apply the same to `EarningsAnalysisCard.tsx` if it has a card-level Link wrapping to `/earnings-analysis/${data.slug}`. Add `prefetch={false}` there too.

- [ ] **Step 4: TypeScript check**

```bash
cd "C:/Transcript IQ (Claude Build)" && pnpm tsc --noEmit
```
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add src/components/blocks/shared/ComplianceBadgePill.tsx \
        src/components/blocks/catalog/TranscriptCard.tsx \
        src/components/blocks/catalog/EarningsAnalysisCard.tsx
git commit -m "fix: compliance labels to neutral grey, add prefetch={false} to catalog cards (FIX 7)"
```

---

### Task 10: FIX 9 — TestimonialStrip social proof component

**Spec section:** `## FIX 9`
**Files:**
- Create: `src/components/site/TestimonialStrip.tsx`
- Modify: `src/app/(frontend)/page.tsx`

No schema changes. Hardcoded placeholder quotes — Pratyush will replace with real quotes when available.

- [ ] **Step 1: Check if `src/components/site/` directory exists**

```bash
ls "C:/Transcript IQ (Claude Build)/src/components/site/" 2>/dev/null || echo "dir does not exist"
```

If it doesn't exist, create it:

```bash
mkdir -p "C:/Transcript IQ (Claude Build)/src/components/site"
```

- [ ] **Step 2: Create TestimonialStrip.tsx**

```tsx
// src/components/site/TestimonialStrip.tsx
export function TestimonialStrip() {
  const quotes = [
    {
      text: "We used Transcript IQ to anchor our pre-CIM diligence on a mid-market industrials deal. Having verbatim VP-level perspectives in under 24 hours changed how we prepped for management meetings.",
      role: "Principal, Private Equity — North America",
    },
    {
      text: "The earnings analyses are exactly what you'd produce internally — but same-day and at a fraction of the cost. We've made it our standard for post-earnings read-throughs.",
      role: "Portfolio Manager, Long/Short Equity — London",
    },
    {
      text: "No subscription means we can access primary research on a deal-by-deal basis without committing to an annual platform. For a boutique like ours, that's a real advantage.",
      role: "Associate, Strategy Consulting — Singapore",
    },
  ]

  return (
    <section className="border-t border-[var(--border)] bg-[var(--surface-2)]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-10 py-14">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--mist)] mb-8 text-center">
          Trusted by buy-side professionals
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quotes.map((q, i) => (
            <div
              key={i}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col gap-4"
            >
              <svg viewBox="0 0 24 18" fill="none" className="h-5 w-5 text-[var(--accent)] opacity-50 shrink-0">
                <path
                  d="M0 18V10.8C0 4.8 3.6.6 10.8 0v3.6C7.2 4.2 5.4 6.6 5.4 9.6H9V18H0zm13.2 0V10.8C13.2 4.8 16.8.6 24 0v3.6c-3.6.6-5.4 3-5.4 6H22.2V18H13.2z"
                  fill="currentColor"
                />
              </svg>
              <p className="text-[14px] leading-[1.65] text-[var(--ink-2)] flex-1">
                &ldquo;{q.text}&rdquo;
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--mist)]">
                — {q.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Import and place in homepage**

Open `src/app/(frontend)/page.tsx`. Add import at top:

```tsx
import { TestimonialStrip } from '@/components/site/TestimonialStrip'
```

Inside the return JSX, after `<RenderBlocks blocks={page.layout} />` (and before any closing tags), add:

```tsx
<TestimonialStrip />
```

- [ ] **Step 4: TypeScript check**

```bash
cd "C:/Transcript IQ (Claude Build)" && pnpm tsc --noEmit
```
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add src/components/site/TestimonialStrip.tsx src/app/\(frontend\)/page.tsx
git commit -m "feat: add TestimonialStrip social proof section to homepage (FIX 9)"
```

---

### Task 11: FIX 10 — EarningsLibrary search

**Spec section:** `## FIX 10`
**Files:**
- Modify: `src/components/library/EarningsLibrary.tsx`

Mirrors the pattern from Task 7 (FIX 4) — same search input UI, same derived-state pattern. Fields: `title`, `ticker`, `companyName`.

- [ ] **Step 1: Read the current component structure**

Open `src/components/library/EarningsLibrary.tsx`. Understand:
- Where state declarations are
- What the `docs` variable is (initial data from props or API-fetched)
- Where the card grid is rendered
- What fields each doc has (look for `ticker`, `companyName`, `title`)
- Where the result count or toolbar is

- [ ] **Step 2: Add searchQuery state**

After existing `useState` calls, add:

```tsx
const [searchQuery, setSearchQuery] = useState('')
```

- [ ] **Step 3: Add displayDocs derived variable**

Before the return statement, add:

```tsx
const displayDocs = searchQuery.trim()
  ? docs.filter((d) => {
      const q = searchQuery.toLowerCase()
      return (
        (d.title ?? '').toLowerCase().includes(q) ||
        (d.ticker ?? '').toLowerCase().includes(q) ||
        (d.companyName ?? '').toLowerCase().includes(q)
      )
    })
  : docs
```

Replace all uses of `docs` in the card render section with `displayDocs`.

- [ ] **Step 4: Add search input UI**

Above the toolbar/sort row (find the flex row with sort controls), insert the same search bar as Task 7 Step 4. Change the placeholder to:

```
placeholder="Search by company, ticker, or title…"
```

Everything else in the search bar is identical to the TranscriptLibrary version.

- [ ] **Step 5: Update result count**

Find the span or text showing the count of results. Update it to use `displayDocs.length` and reflect `searchQuery` in the "matching" label.

- [ ] **Step 6: TypeScript check**

```bash
cd "C:/Transcript IQ (Claude Build)" && pnpm tsc --noEmit
```
Expected: no errors

- [ ] **Step 7: Commit**

```bash
git add src/components/library/EarningsLibrary.tsx
git commit -m "feat: add search to EarningsLibrary (FIX 10)"
```

---

## Phase 3 — Motion & Visual Polish

Philosophy for this project: **product register** animation budget — 150–250ms on most transitions, motion conveys state (feedback, reveal, loading). No page-load choreography. Respect `prefers-reduced-motion`. The Framer Motion package (`motion/react`) is already in the project.

---

### Task 12: Search input + filter count micro-animations

Add precise feedback to the two new search inputs and the filter count display. No new dependencies — use CSS `transition` for the input and Framer Motion's `AnimatePresence` for the clear button.

**Files:**
- Modify: `src/components/library/TranscriptLibrary.tsx`
- Modify: `src/components/library/EarningsLibrary.tsx`

- [ ] **Step 1: Add AnimatePresence import to TranscriptLibrary.tsx**

At the top of `TranscriptLibrary.tsx`, check the existing imports. If `AnimatePresence` and `motion` are not already imported from `motion/react`, add:

```tsx
import { motion, AnimatePresence } from 'motion/react'
```

- [ ] **Step 2: Animate the clear button in TranscriptLibrary search**

Find the clear button in the search bar (the `×` SVG button). Wrap it in `AnimatePresence` + `motion.button`:

```tsx
<AnimatePresence>
  {searchQuery && (
    <motion.button
      key="clear"
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.7 }}
      transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => setSearchQuery('')}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--mist)] hover:text-[var(--ink)] transition-colors"
      aria-label="Clear search"
    >
      <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3 w-3">
        <path d="M2 2l8 8M10 2l-8 8" strokeLinecap="round" />
      </svg>
    </motion.button>
  )}
</AnimatePresence>
```

Remove the existing conditional `{searchQuery && (<button ...>)}` — replace it entirely with the above.

- [ ] **Step 3: Animate filter counts in FilterGroup**

The counts `(8)` text after each filter label should fade in smoothly on first render. Wrap the count span in a `motion.span`:

```tsx
{counts?.[item.value] != null && (
  <motion.span
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.2, delay: 0.05 }}
    className="ml-1 text-[var(--mist)] font-normal"
  >
    ({counts[item.value]})
  </motion.span>
)}
```

Note: `FilterGroup` is inside `TranscriptLibrary.tsx`. If `motion` isn't imported at the top of that file, add the import.

- [ ] **Step 4: Apply same animated clear button to EarningsLibrary.tsx**

Repeat Steps 1–2 for `EarningsLibrary.tsx`. Same pattern, same durations.

- [ ] **Step 5: TypeScript check**

```bash
cd "C:/Transcript IQ (Claude Build)" && pnpm tsc --noEmit
```
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add src/components/library/TranscriptLibrary.tsx src/components/library/EarningsLibrary.tsx
git commit -m "motion: animated search clear button and filter count fade-in"
```

---

### Task 13: TestimonialStrip entrance animation

The strip is below the fold. Stagger the three cards on scroll entry for a polished institutional feel — slow enough to feel considered, fast enough not to interrupt.

**Files:**
- Modify: `src/components/site/TestimonialStrip.tsx`

- [ ] **Step 1: Convert TestimonialStrip to use motion**

Add `'use client'` directive and motion imports at the top of the file:

```tsx
'use client'

import { motion } from 'motion/react'
import { useInView } from 'motion/react'
import { useRef } from 'react'
```

- [ ] **Step 2: Replace entire file content with the animated version**

This task completely rewrites `TestimonialStrip.tsx` — the card interiors are identical to Task 10 but the shell becomes animated. Replace the entire file:

```tsx
'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'

export function TestimonialStrip() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  const quotes = [
    {
      text: "We used Transcript IQ to anchor our pre-CIM diligence on a mid-market industrials deal. Having verbatim VP-level perspectives in under 24 hours changed how we prepped for management meetings.",
      role: "Principal, Private Equity — North America",
    },
    {
      text: "The earnings analyses are exactly what you'd produce internally — but same-day and at a fraction of the cost. We've made it our standard for post-earnings read-throughs.",
      role: "Portfolio Manager, Long/Short Equity — London",
    },
    {
      text: "No subscription means we can access primary research on a deal-by-deal basis without committing to an annual platform. For a boutique like ours, that's a real advantage.",
      role: "Associate, Strategy Consulting — Singapore",
    },
  ]

  return (
    <section className="border-t border-[var(--border)] bg-[var(--surface-2)]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-10 py-14">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--mist)] mb-8 text-center"
        >
          Trusted by buy-side professionals
        </motion.p>
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quotes.map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.45,
                delay: 0.1 + i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col gap-4"
            >
              <svg viewBox="0 0 24 18" fill="none" className="h-5 w-5 text-[var(--accent)] opacity-50 shrink-0">
                <path
                  d="M0 18V10.8C0 4.8 3.6.6 10.8 0v3.6C7.2 4.2 5.4 6.6 5.4 9.6H9V18H0zm13.2 0V10.8C13.2 4.8 16.8.6 24 0v3.6c-3.6.6-5.4 3-5.4 6H22.2V18H13.2z"
                  fill="currentColor"
                />
              </svg>
              <p className="text-[14px] leading-[1.65] text-[var(--ink-2)] flex-1">
                &ldquo;{q.text}&rdquo;
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--mist)]">
                — {q.role}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

Note: This Task (13) replaces Task 10's static version. If Task 10 was already committed, this file write overwrites it — that is correct and expected. The homepage import in `page.tsx` does NOT need to change (same named export).

- [ ] **Step 3: TypeScript check**

```bash
cd "C:/Transcript IQ (Claude Build)" && pnpm tsc --noEmit
```
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/components/site/TestimonialStrip.tsx
git commit -m "motion: staggered scroll-entry animation for TestimonialStrip"
```

---

### Task 14: Global `prefers-reduced-motion` safeguard

The project has no global reduced-motion protection. Users who set `prefers-reduced-motion: reduce` in their OS will still see all Framer Motion animations. Add a global CSS rule that disables transitions and animations for those users — Framer Motion respects this automatically when `transform` and `opacity` are used.

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Check if the UNIVERSAL reduced-motion rule already exists**

The project may already have a partial `prefers-reduced-motion` rule scoped to specific classes. We need the universal `*` selector version. Run:

```bash
grep -n "animation-duration: 0.01ms" "C:/Transcript IQ (Claude Build)/src/app/globals.css"
```

If this returns a match, the universal rule already exists — this task is complete, no commit needed.

If it returns nothing (even if there are other `prefers-reduced-motion` lines for specific selectors), proceed to Step 2.

- [ ] **Step 2: Add reduced-motion media query to globals.css**

At the end of `src/app/globals.css`, append (do not replace existing partial rules — add this after them):

```css
/* Accessibility: disable animations for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "a11y: prefers-reduced-motion global safeguard"
```

---

## Final Verification Checklist

Run all of these before declaring the implementation complete:

```bash
# TypeScript — must be zero errors
cd "C:/Transcript IQ (Claude Build)" && pnpm tsc --noEmit

# Build check — ensure Vercel will accept this
pnpm build
```

Then visually verify in a local browser (`pnpm dev`):

- [ ] Homepage hero: both CTAs visible without scrolling at 1280×800 viewport
- [ ] Homepage hero: "Get a Free Transcript" = solid green button; "Browse Transcripts" = ghost button
- [ ] Homepage: TestimonialStrip appears below main content; cards animate in on scroll
- [ ] Transcript Library: badge header visible at all widths ≥ 640px (not clipped)
- [ ] Transcript Library: search bar visible above toolbar; typing filters cards in real time
- [ ] Transcript Library sidebar: each filter shows count, e.g. "Technology (8)"
- [ ] Earnings cards: "Add to Cart" button is the same height as "Buy Now"
- [ ] Compliance text in all transcript cards reads grey (`ink-2`), not green
- [ ] `ComplianceBadgePill` renders in grey border/background, not green
- [ ] Custom Reports heading reads 2 lines: dark question + green italic answer
- [ ] Earnings library: search bar visible; typing filters cards by ticker/company/title
- [ ] Navigating to `/expert-transcripts` shows loading skeleton instantly
- [ ] Navigating to an earnings product page shows loading skeleton instantly
- [ ] Dark mode: all changed components look correct
- [ ] No TypeScript errors in console
- [ ] No React hydration warnings in console
- [ ] Reduced motion OS setting: animations not visible

---

## Notes for Implementer

1. **Branch:** Work on a dedicated branch, not main. Suggested: `feat/design-performance-motion-overhaul`
2. **Commit order matters:** Phase 1 (performance) first, then Phase 2 (design), then Phase 3 (motion). Each phase can be deployed independently.
3. **Task 6 (SQL):** If you cannot run psycopg2 locally, skip this task and flag it for manual completion in the Payload admin UI. It's content-only and the site will not break without it.
4. **Task 7 (TranscriptLibrary):** This is the most complex task — 10 steps in one file. Take it slowly. Run `pnpm tsc --noEmit` after every 2–3 steps.
5. **Task 14 (SQL/Payload for FIX 2+8):** The exact SQL depends on diagnostic output. If the UPDATE syntax is unclear from diagnostics, fall back to manual Payload Admin UI edits.
6. **Framer Motion version:** The project uses `motion/react` (Framer Motion v12 API). Import from `'motion/react'`, NOT from `'framer-motion'`.
