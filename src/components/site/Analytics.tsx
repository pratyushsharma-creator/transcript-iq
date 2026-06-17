'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AnalyticsTags } from './AnalyticsTags'

const STORAGE_KEY = 'tiq-cookie-consent'

// Routes that load their own ungated analytics (via <AnalyticsTags/> on the page).
// The global gate skips these so nothing loads twice.
const SELF_MANAGED_PREFIXES = ['/reports/ev-ecosystem']

/**
 * Global, consent-aware analytics loader (rendered once in the layout).
 * Loads nothing until the user has accepted cookies (same localStorage key as
 * CookieBanner). Tag markup lives in <AnalyticsTags/>.
 *
 * Exception: the EV report landing + thank-you pages render <AnalyticsTags/>
 * themselves, ungated, so this component skips those routes to avoid double-loading.
 */
export function Analytics() {
  const [consent, setConsent] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    function checkConsent() {
      try {
        setConsent(localStorage.getItem(STORAGE_KEY) === 'accepted')
      } catch {
        // localStorage unavailable (privacy mode, SSR guard)
      }
    }

    checkConsent()

    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) checkConsent()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // Pages that manage their own (ungated) analytics — don't double-load here.
  if (pathname && SELF_MANAGED_PREFIXES.some((p) => pathname.startsWith(p))) return null

  if (!consent) return null

  return <AnalyticsTags />
}
