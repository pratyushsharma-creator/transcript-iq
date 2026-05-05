'use client'

/**
 * Cloudflare Turnstile widget — client-side.
 *
 * Renders the Turnstile challenge widget and exposes a token via onSuccess.
 * Widget type should be set to "Managed" in the Cloudflare Dashboard — it is
 * mostly invisible and auto-fires within a second or two of page load.
 *
 * Dev bypass: when NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set, the component
 * renders nothing. The server-side verifyTurnstile() also bypasses when
 * TURNSTILE_SECRET_KEY is unset, so forms work locally without any keys.
 */

import { useEffect, useRef, useCallback } from 'react'

// ── Global Turnstile API types ─────────────────────────────────────────────────

interface TurnstileOptions {
  sitekey: string
  callback(token: string): void
  'error-callback'?(): void
  'expired-callback'?(): void
  theme?: 'light' | 'dark' | 'auto'
  size?: 'normal' | 'compact' | 'flexible'
}

declare global {
  interface Window {
    turnstile?: {
      render(container: HTMLElement, options: TurnstileOptions): string
      reset(widgetId: string): void
      remove(widgetId: string): void
    }
    onloadTurnstileCallback?: () => void
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

interface TurnstileProps {
  /** Called when Turnstile successfully verifies the user. Token is one-time use. */
  onSuccess(token: string): void
  /** Called when verification fails. Widget auto-retries. */
  onError?(): void
  /** Called when token expires (~5 min). Widget re-issues automatically. */
  onExpired?(): void
  className?: string
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
const SCRIPT_ID = 'cf-turnstile-script'
const SCRIPT_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback&render=explicit'

export function TurnstileWidget({
  onSuccess,
  onError,
  onExpired,
  className,
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef  = useRef<string | null>(null)

  const renderWidget = useCallback(() => {
    if (!containerRef.current) return
    if (widgetIdRef.current !== null) return   // already rendered
    if (!window.turnstile) return

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: SITE_KEY!,
      callback: onSuccess,
      'error-callback': onError,
      'expired-callback': onExpired,
      theme: 'dark',
    })
  }, [onSuccess, onError, onExpired])

  useEffect(() => {
    // Dev bypass — no site key, no widget
    if (!SITE_KEY) return

    // Script already ran
    if (window.turnstile) {
      renderWidget()
      return
    }

    // Queue render for when the script finishes loading
    window.onloadTurnstileCallback = renderWidget

    // Inject script once (idempotent)
    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement('script')
      script.id = SCRIPT_ID
      script.src = SCRIPT_SRC
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }

    return () => {
      if (widgetIdRef.current !== null) {
        window.turnstile?.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [renderWidget])

  // Nothing to render in dev
  if (!SITE_KEY) return null

  return <div ref={containerRef} className={className} />
}
