// Optional per-article hero cover image served straight from the app's own
// /public folder — no Vercel Blob upload / media record needed. Keyed by slug.
// When present, it takes precedence over the post's `coverImage` media field,
// so a post can have a working hero without depending on Blob storage.

export type ArticleCover = { src: string; alt: string }

export const ARTICLE_COVER: Record<string, ArticleCover> = {
  'why-europe-lost-the-gigafactory-race': {
    src: '/blog/ev-gigafactory-cover.jpg',
    alt: 'Robotic arms assembling a vehicle body on a modern automotive production line',
  },
  'europe-ev-battery-numbers-three-insiders': {
    src: '/blog/ev-five-numbers-cover.jpg',
    alt: 'Close-up of an electric vehicle charging port with a charging cable connected',
  },
  'europe-ev-market-insights': {
    src: '/blog/ev-market-insights-cover.jpg',
    alt: 'A map of Europe marked with pushpins on Germany, Austria and central Europe',
  },
  'can-europe-win-ev-ecosystem': {
    src: '/blog/ev-ecosystem-cover.jpg',
    alt: 'High-voltage electricity transmission pylons and power lines against a dramatic sky',
  },
}
