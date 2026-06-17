'use client'

import { useEffect } from 'react'

const STORAGE_KEY = 'tiq-utm'
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'] as const

export type UtmParams = Partial<Record<(typeof UTM_KEYS)[number], string>> & {
  page_referrer?: string
}

/**
 * Read UTM params previously captured into sessionStorage (plus the original
 * referrer). Safe on the server / in private mode — returns {} when unavailable.
 */
export function getStoredUtm(): UtmParams {
  if (typeof window === 'undefined') return {}
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as UtmParams) : {}
  } catch {
    return {}
  }
}

/**
 * Captures UTM params from the URL on page load and persists them in sessionStorage
 * so they survive navigation/interaction and can be attached to the lead form.
 * Renders nothing. First-touch wins — existing stored values are not overwritten.
 */
export function UTMCapture() {
  useEffect(() => {
    try {
      const existing = getStoredUtm()
      if (Object.keys(existing).length > 0) return // first-touch attribution

      const params = new URLSearchParams(window.location.search)
      const captured: UtmParams = {}
      for (const key of UTM_KEYS) {
        const value = params.get(key)
        if (value) captured[key] = value
      }
      if (document.referrer) captured.page_referrer = document.referrer

      if (Object.keys(captured).length > 0) {
        const json = JSON.stringify(captured)
        sessionStorage.setItem(STORAGE_KEY, json)
        // Also persist as a cookie so the server (Stripe checkout route) can attach
        // campaign attribution to the order. 30-day window, first-touch.
        document.cookie = `${STORAGE_KEY}=${encodeURIComponent(json)}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`
      }
    } catch {
      // sessionStorage/cookie unavailable — non-fatal
    }
  }, [])

  return null
}
