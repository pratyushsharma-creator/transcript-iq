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
  revalidateTag(tag, 'default')
}
