import { render } from '@react-email/components'
import { PasswordReset } from '../../emails/PasswordReset'

const TEAM_ROLES = new Set(['admin', 'editor'])

type ResetUser = { name?: string | null; role?: string | null }

const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.transcript-iq.com').replace(/\/+$/, '')

/**
 * Where a password reset link should land. Team members reset in the Payload admin; customers
 * use the site's own /reset-password page (Payload's default email sends everyone to /admin).
 */
export function passwordResetUrl(token: string, role?: string | null): string {
  return TEAM_ROLES.has(role ?? '') ? `${siteUrl()}/admin/reset/${token}` : `${siteUrl()}/reset-password/${token}`
}

/** HTML for Payload's forgot-password email (Users `auth.forgotPassword.generateEmailHTML`). */
export function renderPasswordResetEmail({ token, user }: { token: string; user?: ResetUser }): Promise<string> {
  return render(
    PasswordReset({
      resetUrl: passwordResetUrl(token, user?.role),
      name: user?.name ?? undefined,
      audience: TEAM_ROLES.has(user?.role ?? '') ? 'team' : 'customer',
    }),
  )
}
