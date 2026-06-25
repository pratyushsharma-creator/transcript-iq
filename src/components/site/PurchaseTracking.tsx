'use client'

import { useEffect, useRef } from 'react'
import { firePurchaseOnce } from '@/lib/analytics/events'

/**
 * Marketplace (transcript / earnings) equivalent of the EV report's ThankYouTracking.
 * Fires the full purchase-conversion suite (GA4 + Google Ads + Microsoft UET + Taboola)
 * exactly once, after the confirmation page has fetched and shown the paid order.
 * Deduped per Stripe session id (see firePurchaseOnce) so a refresh can't double-count.
 */
export function PurchaseTracking({
  sessionId,
  value,
  currency = 'USD',
}: {
  sessionId: string
  value: number
  currency?: string
}) {
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    fired.current = true
    firePurchaseOnce({ sessionId, value, currency })
  }, [sessionId, value, currency])

  return null
}
