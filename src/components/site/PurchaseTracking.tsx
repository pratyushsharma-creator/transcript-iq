'use client'

import { useEffect, useRef } from 'react'
import { trackPurchaseConversion } from '@/lib/analytics/events'

/**
 * Fires the purchase conversion suite (GA4 / Google Ads / Bing / Taboola) exactly
 * once, after the confirmation page has server-verified the Stripe session as paid.
 * Rendered only on the success branch, so it mounts a single time per order.
 *
 * Sibling to the EV report's ThankYouTracking — this covers the main marketplace
 * cart checkout (expert transcripts + earnings analyses).
 */
export function PurchaseTracking({
  transactionId,
  value,
  currency = 'USD',
}: {
  transactionId: string
  value: number
  currency?: string
}) {
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    fired.current = true
    trackPurchaseConversion({ value, currency, transactionId })
  }, [transactionId, value, currency])

  return null
}
