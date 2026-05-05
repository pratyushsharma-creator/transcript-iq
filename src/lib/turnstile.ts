/**
 * Cloudflare Turnstile — server-side token verification.
 *
 * Turnstile is Cloudflare's privacy-preserving CAPTCHA replacement.
 * The client widget generates a one-time `cf-turnstile-response` token.
 * We verify it here before processing any sensitive action.
 *
 * Setup:
 *  1. Cloudflare Dashboard → Turnstile → Add site → Managed widget
 *  2. NEXT_PUBLIC_TURNSTILE_SITE_KEY  → client widget rendering
 *  3. TURNSTILE_SECRET_KEY            → server-side verification (this file)
 *
 * Docs: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export interface TurnstileVerifyResult {
  success: boolean
  errorCode?: string
}

/**
 * Verify a Turnstile token submitted by the client.
 * Returns { success: true } on valid challenge.
 * Returns { success: false, errorCode } on failure.
 *
 * In development (TURNSTILE_SECRET_KEY unset or set to the Cloudflare
 * test secret key '1x0000000000000000000000000000000AA'), always passes
 * so local forms work without real Cloudflare challenges.
 */
export async function verifyTurnstile(token: string | undefined | null): Promise<TurnstileVerifyResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY

  // Dev bypass — Cloudflare provides test keys that always pass
  // https://developers.cloudflare.com/turnstile/reference/testing/
  if (!secret || secret === '1x0000000000000000000000000000000AA') {
    return { success: true }
  }

  if (!token) {
    return { success: false, errorCode: 'missing-input-response' }
  }

  try {
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
    })

    const data = (await res.json()) as {
      success: boolean
      'error-codes'?: string[]
    }

    if (data.success) return { success: true }

    const errorCode = data['error-codes']?.[0] ?? 'unknown-error'
    console.warn('[turnstile] Verification failed:', errorCode)
    return { success: false, errorCode }
  } catch (err) {
    console.error('[turnstile] Network error during verification:', err)
    return { success: false, errorCode: 'network-error' }
  }
}
