'use client'

import { useEffect, useRef } from 'react'
import { trackEvent, trackAdsConversion, trackBingEvent, trackTaboolaEvent } from '@/lib/analytics/events'

/**
 * Fires the GA4 `purchase` event and the Google Ads purchase conversion exactly
 * once, after the server has already verified the Stripe session as paid.
 */
export function ThankYouTracking({
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

    trackEvent('purchase', { transaction_id: sessionId, value, currency })
    trackAdsConversion({ value, currency, transactionId: sessionId })
    // Microsoft Ads + Taboola purchase conversions (dormant until their IDs are set)
    trackBingEvent('purchase', { revenue_value: value, currency, transaction_id: sessionId })
    trackTaboolaEvent('make_purchase', { revenue: value, currency })
  }, [sessionId, value, currency])

  return null
}
