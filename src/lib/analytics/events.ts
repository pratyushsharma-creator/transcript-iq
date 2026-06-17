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
