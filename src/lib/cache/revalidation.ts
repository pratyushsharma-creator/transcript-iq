// src/lib/cache/revalidation.ts
import { revalidateTag } from 'next/cache'
import { after } from 'next/server'

export const CACHE_TAGS = {
  expertTranscripts: 'expert-transcripts',
  earningsAnalyses: 'earnings-analyses',
  blogPosts: 'blog-posts',
  pages: 'pages',
  industries: 'industries',
  siteSettings: 'site-settings',
  /** Invalidates the /llms-full.txt route on content publish */
  llmsFull: 'llms-full',
} as const

/**
 * Schedules cache revalidation AFTER the HTTP response has been sent.
 *
 * Using next/server `after()` is critical in Next.js 16:
 *   - `revalidateTag` runs inside Payload's afterChange hook (a Route Handler).
 *     If it throws (context mismatch, Vercel infra hiccup, etc.) and is NOT
 *     deferred, Payload surfaces a 500 → admin shows "something has gone wrong."
 *   - `after()` decouples revalidation from the save response, so failures in
 *     cache busting NEVER block or fail a content save.
 *
 * Collections with versions: { drafts: true } fire afterChange on every
 * draft autosave. The `_status` guard ensures we only bust cache on publish.
 */
export function revalidateOnPublish(
  tag: string,
  doc: { _status?: string },
): void {
  if (doc._status !== 'published') return

  // Defer revalidation to after the response — safe even if revalidateTag throws.
  // Guard the after() call itself: if we're in a context where after() isn't
  // available (e.g. background job runner), fall back to a direct try/catch call.
  try {
    after(async () => {
      try {
        revalidateTag(tag, 'max')
        if (tag !== CACHE_TAGS.llmsFull) {
          revalidateTag(CACHE_TAGS.llmsFull, 'max')
        }
      } catch (err) {
        console.error('[revalidation] revalidateTag failed (deferred), save was unaffected:', err)
      }
    })
  } catch {
    // after() not available in this context — try synchronously but swallow errors
    try {
      revalidateTag(tag, 'max')
      if (tag !== CACHE_TAGS.llmsFull) revalidateTag(CACHE_TAGS.llmsFull, 'max')
    } catch (err) {
      console.error('[revalidation] revalidateTag failed (sync fallback), save was unaffected:', err)
    }
  }
}
