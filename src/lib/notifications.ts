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
 *                               Default: (empty — no CC)
 *                               Example: "ops@nextyn.com,research@nextyn.com"
 *
 *  After saving, redeploy (Vercel → Deployments → Redeploy latest) for
 *  changes to take effect. No code change required.
 * ──────────────────────────────────────────────────────────────────────────
 */

/** Primary recipient for all internal notifications. */
export function getNotificationTo(): string {
  return process.env.LEAD_NOTIFICATION_EMAIL ?? 'pratyush.sharma@nextyn.com'
}

/**
 * CC list for all internal notifications.
 * Parses NOTIFICATION_CC_EMAILS as a comma-separated string.
 * Returns [] when env var is unset.
 */
export function getNotificationCC(): string[] {
  const raw = process.env.NOTIFICATION_CC_EMAILS ?? ''
  return raw.split(',').map((e) => e.trim()).filter(Boolean)
}

/**
 * Primary recipient for EV Ecosystem report notifications (leads + purchases).
 * The EV report is owned by the research/sales team, so it routes separately
 * from the general LEAD_NOTIFICATION_EMAIL. Override with EV_REPORT_NOTIFICATION_EMAIL.
 */
export function getEvReportNotificationTo(): string {
  return process.env.EV_REPORT_NOTIFICATION_EMAIL ?? 'hatim.janjali@nextyn.com'
}
