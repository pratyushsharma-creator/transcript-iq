# Transcript IQ — Design Overhaul Specification

**Purpose:** Fix all design and UX issues identified in the site-wide design critique. Every change is safe, non-breaking, and additive. No database schema changes, no auth changes, no API contract changes.

**Execution order:** Work top to bottom. Each fix is self-contained. Test locally after each group before moving to the next.

---

## FIX 1 — Hero: pull CTAs above the fold

**Priority:** 🔴 Critical  
**File:** `src/components/blocks/Hero.tsx`  
**Why:** The `StencilHero` sets `minHeight: 'calc(100vh - 56px)'` and stacks tall eyebrow + 3-line heading + subheading before CTAs, pushing them off-screen on a typical 768–900px display.

### Changes (all inside the `StencilHero` function):

**1a. Remove the forced full-viewport height on the section:**
```tsx
// BEFORE (line ~71):
style={{ background: 'var(--bg)', minHeight: 'calc(100vh - 56px)' }}

// AFTER:
style={{ background: 'var(--bg)' }}
```

**1b. Reduce top padding on large screens:**
```tsx
// BEFORE (line ~118):
className="relative mx-auto max-w-[1280px] px-5 pt-10 pb-10 sm:px-8 sm:pt-14 sm:pb-12 lg:px-12 lg:pt-20 lg:pb-18"

// AFTER:
className="relative mx-auto max-w-[1280px] px-5 pt-10 pb-10 sm:px-8 sm:pt-12 sm:pb-10 lg:px-12 lg:pt-12 lg:pb-12"
```

**1c. Tighten eyebrow bottom margin:**
```tsx
// BEFORE (line ~133):
marginBottom: 40,

// AFTER:
marginBottom: 24,
```

**1d. Tighten heading block bottom margin:**
```tsx
// BEFORE (line ~144):
<div style={{ marginBottom: 36 }}>

// AFTER:
<div style={{ marginBottom: 20 }}>
```

**1e. Tighten subheading bottom margin:**
```tsx
// BEFORE (line ~213):
marginBottom: 44,

// AFTER:
marginBottom: 28,
```

---

## FIX 2 — Hero: swap CTA visual hierarchy

**Priority:** 🔴 Critical  
**Method:** Payload CMS content update (no code change needed)  
**Why:** "Browse Transcripts" is currently the solid-green primary CTA, but "Get a Free Transcript" is the higher-intent lead-capture offer and should be visually dominant.

### Action:
In the Payload admin UI (or via the MCP `mcp__transcript-iq` tools), edit the **home page** hero block:
- Find the CTA labelled **"Browse Transcripts"** → change its `variant` field to `"secondary"`
- Find the CTA labelled **"Get a Free Transcript"** → change its `variant` field to `"primary"`

This makes "Get a Free Transcript" render as the solid green button and "Browse Transcripts" as the ghost/outline button. No code changes needed; the `StencilHero` already renders `variant === 'primary'` as solid green.

---

## FIX 3 — Transcript Library: fix badge overflow clipping

**Priority:** 🔴 Critical  
**File:** `src/components/library/TranscriptLibrary.tsx`  
**Why:** The outer section has `overflow-hidden` which clips the "100% MNPI Screened" badge at the right edge on many viewport widths. The decorative dot-pattern background is self-contained (`absolute inset-0`) and does not need the parent to have `overflow-hidden`.

### Change:

Find the page-header section (around line 594–600):
```tsx
// BEFORE:
<div
  className="relative overflow-hidden"
  style={{
    background: 'radial-gradient(ellipse 900px 400px at 70% -20%, ...'
  }}
>

// AFTER:
<div
  className="relative"
  style={{
    background: 'radial-gradient(ellipse 900px 400px at 70% -20%, ...'
  }}
>
```

Also ensure the h1+badge flex row handles narrow viewports gracefully. Find the flex row (around line 617):
```tsx
// BEFORE:
<div className="flex flex-wrap items-end justify-between gap-4 mb-4">

// AFTER:
<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
```

And on the badge container (around line 621), remove `shrink-0` so it wraps naturally on small screens:
```tsx
// BEFORE:
<div className="flex items-center gap-4 shrink-0 pb-1">

// AFTER:
<div className="flex items-center gap-4 pb-1">
```

---

## FIX 4 — Transcript Library: add text search

**Priority:** 🟡 Moderate  
**File:** `src/components/library/TranscriptLibrary.tsx`  
**Why:** 24+ transcripts with only sidebar category filters forces users to scroll to find a specific company or expert. A text search box enables direct lookup.

### Changes:

**4a. Add search state** to the `TranscriptLibrary` component (inside the function, after existing `useState` calls):
```tsx
const [searchQuery, setSearchQuery] = useState('')
```

**4b. Add a client-side search filter** before the grid renders. Find where `docs` is used to render cards and derive a filtered list:
```tsx
// Add this derived variable right before the return statement:
const displayDocs = searchQuery.trim()
  ? docs.filter((d) => {
      const q = searchQuery.toLowerCase()
      return (
        d.title.toLowerCase().includes(q) ||
        (d.expertFormerTitle ?? '').toLowerCase().includes(q) ||
        (d.companies ?? '').toLowerCase().includes(q)
      )
    })
  : docs
```

Replace all uses of `docs` in the card grid render with `displayDocs`.

**4c. Add the search input UI** inside the content column (`.flex-1.min-w-0`), directly above the toolbar div (the `div` with className containing `flex flex-wrap items-center justify-between gap-3 mb-6 pb-5`):

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

**4d. Update the results count** to reflect search state. Find the count span (around line 671):
```tsx
// BEFORE:
<span className="font-mono text-[11px] text-[var(--mist)] tracking-[0.06em] whitespace-nowrap">
  <strong className="text-[var(--ink)]">{docs.length}</strong>
  {hasFilters ? ' matching' : ''} transcript{docs.length !== 1 ? 's' : ''}
</span>

// AFTER:
<span className="font-mono text-[11px] text-[var(--mist)] tracking-[0.06em] whitespace-nowrap">
  <strong className="text-[var(--ink)]">{displayDocs.length}</strong>
  {(hasFilters || searchQuery) ? ' matching' : ''} transcript{displayDocs.length !== 1 ? 's' : ''}
</span>
```

---

## FIX 5 — Transcript Library: show per-filter result counts

**Priority:** 🟡 Moderate  
**File:** `src/components/library/TranscriptLibrary.tsx`  
**Why:** Users can't tell how many results each filter will produce before clicking. Adding counts in parentheses is a standard e-commerce pattern that reduces blind filter clicks.

### Changes:

**5a. Compute counts from `initialDocs`** (in the `TranscriptLibrary` component body, after the existing state declarations):
```tsx
// Compute filter value counts from the full initial dataset
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

**5b. Pass counts to `FilterPanel`:**
```tsx
// BEFORE:
<FilterPanel
  industries={industries}
  filters={filters}
  onToggle={toggleFilter}
  onClearAll={clearAll}
/>

// AFTER (desktop sidebar and mobile drawer — update both):
<FilterPanel
  industries={industries}
  filters={filters}
  onToggle={toggleFilter}
  onClearAll={clearAll}
  counts={filterCounts}
/>
```

**5c. Update `FilterPanel` props:**
```tsx
// BEFORE:
function FilterPanel({
  industries, filters, onToggle, onClearAll,
}: {
  industries: Industry[]
  filters: ActiveFilters
  onToggle: (group: keyof ActiveFilters, value: string) => void
  onClearAll: () => void
})

// AFTER:
function FilterPanel({
  industries, filters, onToggle, onClearAll, counts,
}: {
  industries: Industry[]
  filters: ActiveFilters
  onToggle: (group: keyof ActiveFilters, value: string) => void
  onClearAll: () => void
  counts?: { industry: Record<string, number>; geography: Record<string, number>; level: Record<string, number>; tier: Record<string, number> }
})
```

And pass counts down to each `FilterGroup`:
```tsx
// In FilterPanel's return, pass the relevant count map to each FilterGroup:
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

**5d. Update `FilterGroup` to accept and display counts:**
```tsx
// Add `counts?: Record<string, number>` to FilterGroup props
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

In the item render (the `<span>` showing the label, around line 194–199), update to show count:
```tsx
// BEFORE:
<span className={`text-[13px] leading-[1.3] transition-colors ${
  checked ? 'text-[var(--ink)] font-medium' : 'text-[var(--ink-2)] group-hover:text-[var(--ink)]'
}`}>
  {item.label}
</span>

// AFTER:
<span className={`flex-1 text-[13px] leading-[1.3] transition-colors ${
  checked ? 'text-[var(--ink)] font-medium' : 'text-[var(--ink-2)] group-hover:text-[var(--ink)]'
}`}>
  {item.label}
  {counts?.[item.value] != null && (
    <span className="ml-1 text-[var(--mist)] font-normal">({counts[item.value]})</span>
  )}
</span>
```

---

## FIX 6 — Earnings cards: fix tiny "Add" button

**Priority:** 🟡 Moderate  
**File:** `src/components/blocks/catalog/EarningsAnalysisCard.tsx`  
**Why:** The "Add" + cart icon button is `text-[10px] px-2.5 py-1.5` — far too small as a tap/click target (below 44px minimum) and visually mismatched against the solid "Buy Now →" button. Match the layout pattern used in `TranscriptCard`.

### Change (the action buttons footer section):
```tsx
// BEFORE:
<div className="flex items-center gap-2">
  <button
    type="button"
    onClick={handleAddToCart}
    className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 font-mono text-[10px] font-medium transition-all duration-fast ${
      inCart
        ? 'border-[var(--accent-border)] bg-[var(--accent-tint)] text-[var(--accent)]'
        : 'border-[var(--border)] text-[var(--mist)] hover:border-[var(--accent-border)] hover:text-[var(--accent)]'
    }`}
  >
    <ShoppingCart className="h-2.5 w-2.5" />
    {inCart ? 'In Cart' : 'Add'}
  </button>
  <button
    type="button"
    onClick={handleBuyNow}
    className="inline-flex items-center gap-1 rounded-md bg-btn-primary px-2.5 py-1.5 font-mono text-[10px] font-semibold text-btn-primary-fg shadow-cta transition-all duration-fast hover:-translate-y-px hover:bg-btn-primary-hover"
  >
    Buy Now →
  </button>
</div>

// AFTER:
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

Also replace the `flat · instant PDF` text line just above the buttons. Find:
```tsx
<span className="font-mono text-[18px] font-semibold text-[var(--accent)]">${data.priceUsd}</span>
```
The `$99 flat · instant PDF` text below the price (after the price row div):

Find the small meta text near the price:
```tsx
// The line showing "flat · instant PDF" — update its layout to match transcript card pattern
// Wrap the price section in a full-width div with the layout:
<div className="mt-1 flex items-end justify-between border-t border-[var(--border)] pt-3">
  <div className="flex items-baseline gap-2">
    {/* existing price and discount badge */}
  </div>
  <span className="font-mono text-[10px] text-[var(--mist)] tracking-[0.06em]">flat · instant PDF</span>
</div>
```
Move the `flat · instant PDF` text to sit beside the price inside the footer row (right-aligned), and place the full-width button row beneath it.

---

## FIX 7 — Remove green overload on compliance labels

**Priority:** 🟡 Moderate  
**Why:** The accent green `var(--accent)` is used for interactive CTAs (buttons, links) AND for compliance labels (MNPI Screened), making informational text look clickable.

### Change A — `ComplianceBadgePill` component:
**File:** `src/components/blocks/shared/ComplianceBadgePill.tsx`

```tsx
// BEFORE:
className={`inline-flex items-center gap-1 rounded-md border border-[var(--accent-border)] bg-[var(--accent-tint)] font-mono font-medium uppercase tracking-[0.08em] text-[var(--accent)] ${sizing}`}

// AFTER:
className={`inline-flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--surface-2)] font-mono font-medium uppercase tracking-[0.08em] text-[var(--ink-2)] ${sizing}`}
```

### Change B — Compliance text in `TranscriptLibrary.tsx` card meta band:
**File:** `src/components/library/TranscriptLibrary.tsx`, around line 391–395

```tsx
// BEFORE:
<div className="text-[12px] font-medium text-[var(--accent)]">
  {doc.complianceBadges?.includes('mnpi-screened') ? 'MNPI Screened' : 'Verified'}
</div>

// AFTER:
<div className="text-[12px] font-medium text-[var(--ink-2)]">
  {doc.complianceBadges?.includes('mnpi-screened') ? 'MNPI Screened' : 'Verified'}
</div>
```

### Change C — Same compliance text in standalone `TranscriptCard` component:
**File:** `src/components/blocks/catalog/TranscriptCard.tsx`, same pattern around line 393

```tsx
// BEFORE:
<div className="text-[12px] font-medium text-[var(--accent)]">
  {data.complianceBadges?.includes('mnpi-screened') ? 'MNPI Screened' : 'Verified'}
</div>

// AFTER:
<div className="text-[12px] font-medium text-[var(--ink-2)]">
  {data.complianceBadges?.includes('mnpi-screened') ? 'MNPI Screened' : 'Verified'}
</div>
```

---

## FIX 8 — Custom Reports: simplify heading hierarchy

**Priority:** 🟡 Moderate  
**Method:** Payload CMS content update  
**Why:** The current 3-line StencilHero heading ("Can't find what / you need? / We'll build it.") uses dark / light-grey / green, making the middle line recede visually and fragmenting the meaning.

### Action:
In Payload admin, edit the **Custom Reports** page hero block heading. Change from 3 lines to 2 lines by merging the question into one line:

```
// BEFORE (3 lines via \n):
Can't find what
you need?
We'll build it.

// AFTER (2 lines via \n):
Can't find what you need?
We'll build it.
```

This renders as:
- Line 1 (dark ink): "Can't find what you need?"
- Line 2 (italic accent green): "We'll build it."

Clean, unambiguous, strong.

---

## FIX 9 — Add social proof strip to homepage

**Priority:** 🟡 Moderate  
**Why:** No testimonials, client quotes, or named social proof appear anywhere on the site. For $349–$799 single-purchase decisions by institutional buyers, this is a significant trust gap.

### Approach: Hardcode a lightweight testimonial strip in the homepage file. No schema changes required.

**File:** `src/app/(frontend)/page.tsx`

**9a. Create a new component file:**
**New file:** `src/components/site/TestimonialStrip.tsx`

```tsx
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
                <path d="M0 18V10.8C0 4.8 3.6.6 10.8 0v3.6C7.2 4.2 5.4 6.6 5.4 9.6H9V18H0zm13.2 0V10.8C13.2 4.8 16.8.6 24 0v3.6c-3.6.6-5.4 3-5.4 6H22.2V18H13.2z" fill="currentColor" />
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

**9b. Import and place the strip in the homepage:**

In `src/app/(frontend)/page.tsx`, after the `<RenderBlocks>` call:
```tsx
import { TestimonialStrip } from '@/components/site/TestimonialStrip'

// Inside the return, after <RenderBlocks blocks={page.layout} />:
<TestimonialStrip />
```

**Note for Pratyush:** Update the testimonial text to real quotes when you have them. The roles are purposely anonymized — keep the firm name out per client confidentiality norms.

---

## FIX 10 — Earnings Library: add the same search capability

**Priority:** 🟢 Minor  
**Why:** Consistency with the Transcript Library (Fix 4). The Earnings Analysis page should have the same search-by-ticker/company/title behaviour.

**File:** `src/components/library/EarningsLibrary.tsx` (or wherever `EarningsAnalysisCard` cards are rendered in a list)

Apply the same pattern as Fix 4:
1. Add `searchQuery` state
2. Derive `displayDocs` filtered by `title`, `ticker`, `companyName`
3. Add the same search input UI above the toolbar
4. Replace `docs` with `displayDocs` in the grid render

---

## Verification checklist

After all fixes are applied, verify:

- [ ] Homepage hero: Both CTAs are visible without scrolling at 1280×800 viewport
- [ ] Homepage hero: "Get a Free Transcript" renders as the solid green primary button
- [ ] Transcript Library header: "Expert Research" and "100% MNPI Screened" badges both render fully at all viewport widths ≥ 640px
- [ ] Transcript Library: Search input is visible above the toolbar; typing filters cards in real time
- [ ] Transcript Library sidebar: Each filter option shows a count in parentheses, e.g. "Technology (8)"
- [ ] Earnings cards: "Add to Cart" button is the same height as "Buy Now" (both `py-[9px]`)
- [ ] Compliance text in transcript cards reads in `ink-2` (grey), not accent green
- [ ] ComplianceBadgePill renders in grey border/background, not green
- [ ] Custom Reports heading reads as 2 lines: dark question + green answer
- [ ] Testimonial strip appears on homepage below the main content blocks
- [ ] Dark mode: visually check all changed components still look correct in dark mode
- [ ] No TypeScript errors (`pnpm tsc --noEmit`)
- [ ] No console errors in the browser on any of the modified pages

---

## What was intentionally NOT changed

- **Navigation:** The 5-item nav + cart + CTA + dark-mode toggle is wide but not technically broken; any restructuring risks mobile regressions on a live site. Leave for a dedicated nav overhaul.
- **Large whitespace gaps between homepage sections:** These gaps are driven by individual block components and CMS spacing settings. Adjusting them without a full block-by-block audit risks layout shifts across pages. Flag for a future spacing pass.
- **Pricing page / About page:** Out of scope per project build priorities.
- **Any Payload schema changes:** All fixes above are code + CMS content only — no `collections/`, `blocks/*.ts` schema modifications.
