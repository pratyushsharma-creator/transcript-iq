/**
 * Central notification routing config.
 *
 * Every outbound notification email (lead captures, purchase alerts,
 * contact form submissions) reads its recipients from here.
 *
 * ─── HOW TO ADD MORE NOTIFICATION EMAILS ──────────────────────────────────
 *
 *  Vercel Dashboard → Your Project → Settings → Environment Variables
 *
 *  LEAD_NOTIFICATION_EMAIL   – Primary recipient for all alerts
 *                               Default: pratyush.sharma@nextyn.com
 *                               Change to any single address.
 *
 *  NOTIFICATION_CC_EMAILS    – Comma-separated list of CC addresses
 *                               Default: hatim.janjali@nextyn.com,prem.bhatia@nextyn.com
 *                               Setting this env var REPLACES the default list.
 *                               Example: "ops@nextyn.com,research@nextyn.com"
 *
 *  After saving, redeploy (Vercel → Deployments → Redeploy latest) for
 *  changes to take effect. No code change required.
 * ──────────────────────────────────────────────────────────────────────────
 */

/** Default CC recipients when NOTIFICATION_CC_EMAILS is not set. */
const DEFAULT_CC = 'hatim.janjali@nextyn.com,prem.bhatia@nextyn.com'

/** Primary recipient for all internal notifications. */
export function getNotificationTo(): string {
  return process.env.LEAD_NOTIFICATION_EMAIL ?? 'pratyush.sharma@nextyn.com'
}

/**
 * CC list for all internal notifications.
 * Parses NOTIFICATION_CC_EMAILS as a comma-separated string; falls back to
 * DEFAULT_CC (Hatim + Prem) when the env var is unset.
 */
export function getNotificationCC(): string[] {
  const raw = process.env.NOTIFICATION_CC_EMAILS ?? DEFAULT_CC
  return raw.split(',').map((e) => e.trim()).filter(Boolean)
}
