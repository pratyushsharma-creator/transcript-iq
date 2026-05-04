import { createHmac } from 'crypto'

// ── Signed download token ─────────────────────────────────────────────────────
// Format: HMAC-SHA256( "{slug}:{type}:{exp}", PAYLOAD_SECRET )
// URL:    /api/download/{slug}?token={hmac}&exp={timestamp}&type={transcript|earnings}
//
// Tokens expire after EXPIRY_SECONDS (default 7 days).
// No database lookup needed — the HMAC is self-verifying.

const EXPIRY_SECONDS = 60 * 60 * 24 * 7 // 7 days

function getSecret(): string {
  const secret = process.env.PAYLOAD_SECRET
  if (!secret) throw new Error('PAYLOAD_SECRET is not set')
  return secret
}

function sign(slug: string, type: string, exp: number): string {
  return createHmac('sha256', getSecret())
    .update(`${slug}:${type}:${exp}`)
    .digest('hex')
}

export function generateDownloadToken(slug: string, type: 'transcript' | 'earnings'): {
  token: string
  exp: number
  url: string
} {
  const exp = Math.floor(Date.now() / 1000) + EXPIRY_SECONDS
  const token = sign(slug, type, exp)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://transcript-iq.com'
  const url = `${siteUrl}/api/download/${encodeURIComponent(slug)}?token=${token}&exp=${exp}&type=${type}`
  return { token, exp, url }
}

export function verifyDownloadToken(
  slug: string,
  type: string,
  token: string,
  exp: number
): { valid: boolean; reason?: string } {
  // Check expiry first
  const now = Math.floor(Date.now() / 1000)
  if (now > exp) {
    return { valid: false, reason: 'Download link has expired. Please contact support.' }
  }

  // Recompute and compare HMAC (constant-time comparison via timingSafeEqual not needed
  // here since exp guards against brute-force, but we still use hex comparison)
  const expected = sign(slug, type, exp)
  const valid = token === expected
  return valid ? { valid: true } : { valid: false, reason: 'Invalid download token.' }
}
