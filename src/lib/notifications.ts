/**
 * Central notification routing config.
 *
 * Every outbound notification email (lead captures, purchase alerts,
 * contact form submissions) reads its recipients from here.
 *
 * ─── WHO GETS EVERY LEAD / CONTACT / PURCHASE ALERT ───────────────────────
 *
 *  These three ALWAYS receive every internal notification, guaranteed in code
 *  (they cannot be dropped by an env-var change):
 *      pratyush.sharma@nextyn.com   (primary "To")
 *      hatim.janjali@nextyn.com     (CC — always)
 *      prem.bhatia@nextyn.com       (CC — always)
 *
 * ─── OPTIONAL ENV OVERRIDES ───────────────────────────────────────────────
 *
 *  Vercel Dashboard → Your Project → Settings → Environment Variables
 *
 *  LEAD_NOTIFICATION_EMAIL   – Overrides the primary "To" address only.
 *                               Default: pratyush.sharma@nextyn.com
 *
 *  NOTIFICATION_CC_EMAILS    – Comma-separated EXTRA CC addresses. These are
 *                               ADDED to the three guaranteed recipients above
 *                               (they do NOT replace them). Leave unset unless
 *                               you want additional people copied.
 *                               Example: "ops@nextyn.com,research@nextyn.com"
 *
 *  After saving, redeploy (Vercel → Deployments → Redeploy latest) for
 *  changes to take effect. No code change required.
 * ──────────────────────────────────────────────────────────────────────────
 */

/** Recipients that must be on EVERY internal notification, no matter what. */
const ALWAYS_TO = 'pratyush.sharma@nextyn.com'
const ALWAYS_CC = ['hatim.janjali@nextyn.com', 'prem.bhatia@nextyn.com']

/** Primary recipient for all internal notifications. */
export function getNotificationTo(): string {
  return process.env.LEAD_NOTIFICATION_EMAIL ?? ALWAYS_TO
}

/**
 * CC list for all internal notifications.
 *
 * Hatim + Prem are ALWAYS included (guaranteed in code). NOTIFICATION_CC_EMAILS
 * is treated as ADDITIVE extra recipients — it can never remove the guaranteed
 * two. The result is de-duplicated and never includes the primary "To" address.
 */
export function getNotificationCC(): string[] {
  const extra = (process.env.NOTIFICATION_CC_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  const to = getNotificationTo().trim().toLowerCase()

  return Array.from(new Set([...ALWAYS_CC, ...extra]))
    .filter((e) => e && e !== to)
}
