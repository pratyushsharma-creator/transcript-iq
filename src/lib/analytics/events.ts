/**
 * Thin GA4 / Google Ads event helper.
 *
 * `gtag` is loaded consent-gated by Analytics.tsx (GA4 + Google Ads). These helpers
 * no-op safely when gtag isn't present (no consent, SSR, or ad-blocked), so callers
 * never need to guard.
 */

type GtagParams = Record<string, string | number | boolean | undefined>

function gtag(...args: unknown[]) {
  if (typeof window === 'undefined') return
  const w = window as unknown as { gtag?: (...a: unknown[]) => void }
  if (typeof w.gtag !== 'function') return
  w.gtag(...args)
}

/** Fire a GA4 custom event. */
export function trackEvent(name: string, params?: GtagParams) {
  gtag('event', name, params ?? {})
}

/**
 * Fire a Google Ads conversion. No-ops unless both the Ads ID and a conversion
 * label are configured, so it stays dormant until the env vars are filled in.
 */
export function trackAdsConversion(opts: {
  conversionLabel?: string
  value?: number
  currency?: string
  transactionId?: string
}) {
  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
  const label = opts.conversionLabel ?? process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION
  if (!adsId || !label) return

  gtag('event', 'conversion', {
    send_to: `${adsId}/${label}`,
    ...(opts.value !== undefined ? { value: opts.value } : {}),
    ...(opts.currency ? { currency: opts.currency } : {}),
    ...(opts.transactionId ? { transaction_id: opts.transactionId } : {}),
  })
}

/**
 * Fire a Microsoft Advertising (Bing) UET event. No-ops unless the UET tag is
 * configured, so it stays dormant until NEXT_PUBLIC_BING_UET_ID is set.
 */
export function trackBingEvent(name: string, params?: GtagParams) {
  if (typeof window === 'undefined') return
  if (!process.env.NEXT_PUBLIC_BING_UET_ID) return
  const w = window as unknown as { uetq?: unknown[] }
  w.uetq = w.uetq || []
  w.uetq.push('event', name, params ?? {})
}

/**
 * Fire a Taboola pixel event. No-ops unless the Taboola account is configured,
 * so it stays dormant until NEXT_PUBLIC_TABOOLA_ID is set.
 */
export function trackTaboolaEvent(name: string, params?: Record<string, string | number>) {
  if (typeof window === 'undefined') return
  const id = process.env.NEXT_PUBLIC_TABOOLA_ID
  if (!id) return
  const w = window as unknown as { _tfa?: unknown[] }
  w._tfa = w._tfa || []
  w._tfa.push({ notify: 'event', name, id, ...(params ?? {}) })
}
