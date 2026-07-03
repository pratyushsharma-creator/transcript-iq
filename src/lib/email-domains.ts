/**
 * Canonical list of personal / free / disposable email providers.
 *
 * Every lead & contact form on the site must reject these so that sales only
 * ever receives a business email address (faster lead qualification). This is
 * the single source of truth, used BOTH:
 *   - client-side  → instant inline "please use a business email" hint
 *   - server-side  → authoritative 400 rejection in the API routes
 *
 * To block another domain, add it here once and every form picks it up.
 */

export const PERSONAL_EMAIL_DOMAINS = new Set<string>([
  // Google
  'gmail.com', 'googlemail.com',
  // Yahoo
  'yahoo.com', 'yahoo.co.uk', 'yahoo.co.in', 'yahoo.fr', 'yahoo.de', 'yahoo.es',
  'yahoo.it', 'yahoo.com.au', 'yahoo.ca', 'yahoo.com.br', 'ymail.com', 'rocketmail.com',
  // Microsoft
  'hotmail.com', 'hotmail.co.uk', 'hotmail.fr', 'hotmail.de', 'hotmail.it', 'hotmail.es',
  'outlook.com', 'outlook.co.uk', 'outlook.fr', 'outlook.de', 'live.com', 'live.co.uk',
  'live.fr', 'msn.com',
  // Apple
  'icloud.com', 'me.com', 'mac.com',
  // AOL
  'aol.com', 'aim.com',
  // Privacy / secure mail
  'protonmail.com', 'proton.me', 'pm.me', 'tutanota.com', 'tuta.io', 'hushmail.com',
  // Generic free providers
  'mail.com', 'email.com', 'inbox.com', 'gmx.com', 'gmx.de', 'gmx.net',
  'zoho.com', 'zohomail.com', 'fastmail.com', 'fastmail.fm',
  'yandex.com', 'yandex.ru',
  // India
  'rediffmail.com', 'rediff.com',
  // China / Korea / Asia
  'qq.com', '163.com', '126.com', 'sina.com', 'sina.cn', 'sohu.com', 'foxmail.com',
  'naver.com', 'daum.net', 'hanmail.net',
  // Europe
  'web.de', 't-online.de', 'freenet.de', 'orange.fr', 'laposte.net', 'free.fr',
  'wanadoo.fr', 'sfr.fr', 'libero.it', 'virgilio.it', 'tin.it', 'tiscali.it', 'alice.it',
  // Disposable / throwaway
  'guerrillamail.com', 'mailinator.com', 'tempmail.com', '10minutemail.com',
  'throwaway.email', 'dispostable.com', 'yopmail.com', 'trashmail.com',
  'getnada.com', 'maildrop.cc', 'sharklasers.com',
])

/** Lowercased domain part of an email, or null if it is not a single a@b form. */
export function emailDomain(email: string): string | null {
  const parts = email.trim().toLowerCase().split('@')
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null
  return parts[1]
}

/** True when the address is on a personal / free / disposable provider. */
export function isPersonalEmail(email: string): boolean {
  const domain = emailDomain(email)
  if (!domain) return false // malformed — let the normal email-format check handle it
  return PERSONAL_EMAIL_DOMAINS.has(domain)
}

/** True when the address looks like a usable business address. */
export function isBusinessEmail(email: string): boolean {
  const domain = emailDomain(email)
  if (!domain) return false
  return !PERSONAL_EMAIL_DOMAINS.has(domain)
}

/** Shared inline error copy shown when a personal email is submitted. */
export const BUSINESS_EMAIL_ERROR =
  'Please use your business email address — we can’t accept personal inboxes (Gmail, Yahoo, Outlook, etc.).'
