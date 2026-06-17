'use client'

import Script from 'next/script'

/**
 * Page-specific Warmly loader (visitor de-anonymisation).
 *
 * Warmly is intentionally NOT in the global Analytics.tsx — it loads only on pages
 * that render this component (currently the EV Ecosystem report landing page).
 *
 * No-ops until NEXT_PUBLIC_WARMLY_ID is set. The script also loads silently until
 * transcript-iq.com is whitelisted on Warmly's side — no code change needed then.
 */
export function WarmlyPageScript() {
  const warmlyId = process.env.NEXT_PUBLIC_WARMLY_ID
  if (!warmlyId) return null

  return (
    <Script
      id="warmly-page"
      src={`https://opps-widget.getwarmly.com/warmly.js?clientId=${warmlyId}`}
      strategy="afterInteractive"
      defer
    />
  )
}
