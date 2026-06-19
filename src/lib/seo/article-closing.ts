// Optional per-article "closing" block, rendered AFTER the FAQ accordion on
// /resources/[slug] (mirrors the ARTICLE_FAQS code-map pattern — no DB field).
// Keyed by post slug. Title + supporting line + a single text link.

export type ArticleClosing = {
  title?: string
  body?: string
  linkLabel?: string
  linkUrl?: string
}

export const ARTICLE_CLOSING: Record<string, ArticleClosing> = {
  'why-europe-lost-the-gigafactory-race': {
    title: 'Can Europe Win the EV Ecosystem?',
    body: 'Available now for $3,499. A one-hour consultation with the research expert is available post-purchase at $350/hour.',
    linkLabel: 'Get the full report',
    linkUrl: 'https://www.transcript-iq.com/reports/ev-ecosystem',
  },
}
