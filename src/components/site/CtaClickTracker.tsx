'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackEvent } from '@/lib/analytics/events'

const TARGET_PATH = '/reports/ev-ecosystem'

/**
 * Fires a GA4 `cta_click` event whenever a link to the EV report is clicked,
 * anywhere inside the page this is mounted on. Uses capture-phase click
 * delegation so it catches every CTA to the report — the closing block, in-body
 * `blogCta` banners, and inline rich-text links — including CMS-authored ones
 * added later, with no per-link wiring.
 *
 * Event params (registered as event-scoped custom dimensions in GA4):
 *   link_url, link_text, cta_location
 *
 * Safe by design: `trackEvent` no-ops unless `gtag` is present (i.e. after the
 * cookie-consent gate loads GA4), so this honours the existing consent model.
 * GA4 transmits events via `navigator.sendBeacon`, so the event survives the
 * navigation the click triggers.
 */
export function CtaClickTracker({ location }: { location?: string }) {
  const pathname = usePathname()

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null
      const anchor = target?.closest('a')
      if (!anchor) return

      const href = anchor.getAttribute('href') || ''
      let matches = false
      try {
        matches = new URL(href, window.location.origin).pathname.replace(/\/+$/, '') === TARGET_PATH
      } catch {
        matches = href.includes(TARGET_PATH)
      }
      if (!matches) return

      trackEvent('cta_click', {
        link_url: TARGET_PATH,
        link_text: (anchor.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 100) || undefined,
        cta_location: location || pathname || undefined,
      })
    }

    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [location, pathname])

  return null
}
