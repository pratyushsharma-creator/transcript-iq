/**
 * IndexNow — notify search engines of new/updated URLs immediately on publish.
 *
 * IndexNow is supported by Bing, Yandex, Naver, and Seznam (Google uses its own
 * indexing API). A single submission to api.indexnow.org distributes to all partners.
 *
 * Setup:
 *  1. Generate a key: any random alphanumeric string (32+ chars recommended)
 *  2. Set env var: INDEXNOW_KEY=<your-key>
 *  3. Create a verification file at: /public/<key>.txt containing just the key
 *     (or add it to next.config.ts rewrites if you prefer not to commit the key)
 *
 * No-op when INDEXNOW_KEY is unset (dev / staging).
 */

const BASE_URL = 'https://transcript-iq.com'
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow'

export async function pingIndexNow(urls: string[]): Promise<void> {
  const key = process.env.INDEXNOW_KEY
  if (!key) return // silently skip in dev/staging

  // Deduplicate and prefix with base URL if needed
  const fullUrls = [...new Set(
    urls.map((u) => (u.startsWith('http') ? u : `${BASE_URL}${u}`))
  )]

  if (fullUrls.length === 0) return

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: 'transcript-iq.com',
        key,
        keyLocation: `${BASE_URL}/${key}.txt`,
        urlList: fullUrls,
      }),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.warn(`[indexnow] Submission failed: ${res.status} ${text}`)
    } else {
      console.log(`[indexnow] Submitted ${fullUrls.length} URL(s)`)
    }
  } catch (err) {
    // Never throw from a background hook — log and continue
    console.error('[indexnow] Network error:', err)
  }
}

/**
 * Convenience: ping the collection index page + the specific document slug.
 */
export function pingCollectionPage(
  collectionPath: '/expert-transcripts' | '/earnings-analysis' | '/resources',
  slug?: string,
): void {
  const urls: string[] = [collectionPath]
  if (slug) urls.push(`${collectionPath}/${slug}`)
  // Fire-and-forget — don't await in an afterChange hook
  pingIndexNow(urls).catch(() => undefined)
}
