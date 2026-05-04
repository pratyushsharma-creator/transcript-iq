// src/lib/cache/revalidation.ts
import { revalidateTag } from 'next/cache'

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
 * Calls revalidateTag only when the document has been published.
 * Collections with versions: { drafts: true } fire afterChange on every
 * draft autosave. This guard prevents cache busting on draft saves.
 *
 * Also invalidates llmsFull so /llms-full.txt regenerates immediately
 * when any content collection publishes new material.
 */
export function revalidateOnPublish(
  tag: string,
  doc: { _status?: string },
): void {
  if (doc._status !== 'published') return
  revalidateTag(tag, 'default')
  // llms-full.txt aggregates all content — always bust it on any publish
  if (tag !== CACHE_TAGS.llmsFull) {
    revalidateTag(CACHE_TAGS.llmsFull, 'default')
  }
}
