import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

// ── Types ─────────────────────────────────────────────────────────────────────

export type PasswordResetProps = {
  resetUrl: string
  name?: string
  /** Team members (admin/editor) reset in the Payload admin; customers on the site. */
  audience: 'team' | 'customer'
}

// ── Component ─────────────────────────────────────────────────────────────────

export function PasswordReset({ resetUrl, name, audience }: PasswordResetProps) {
  const firstName = name?.trim().split(' ')[0]
  const account = audience === 'team' ? 'Transcript IQ admin account' : 'Transcript IQ account'

  return (
    <Html>
      <Head />
      <Preview>Reset your Transcript IQ password</Preview>
      <Body style={body}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <Text style={logo}>
              Transcript<span style={{ color: '#34D399' }}>IQ</span>
            </Text>
            <Text style={logoSub}>By Nextyn</Text>
          </Section>

          {/* Callout */}
          <Section style={callout}>
            <Text style={badge}>Password reset</Text>
            <Text style={heading}>{firstName ? `Hi ${firstName}, set a new password.` : 'Set a new password.'}</Text>
            <Text style={paragraph}>
              We received a request to reset the password for your {account}. Use the button below to
              choose a new one. The link works once and expires in 1 hour.
            </Text>
          </Section>

          {/* CTA */}
          <Section style={ctaSection}>
            <Link href={resetUrl} style={ctaButton}>Set a new password →</Link>
          </Section>

          <Text style={fallback}>
            Button not working? Paste this link into your browser:
            <br />
            <Link href={resetUrl} style={fallbackLink}>{resetUrl}</Link>
          </Text>

          <Text style={fallback}>
            Didn&apos;t ask for this? You can ignore this email. Your password stays the same.
          </Text>

          {/* Footer */}
          <Hr style={divider} />
          <Section>
            <Text style={footer}>© {new Date().getFullYear()} Nextyn Advisory Pte. Ltd. · Singapore</Text>
            <Text style={footer}>
              <Link href="https://transcript-iq.com" style={footerLink}>transcript-iq.com</Link>
              {' · '}
              <Link href="mailto:hello@transcript-iq.com" style={footerLink}>hello@transcript-iq.com</Link>
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

export default PasswordReset

// ── Styles (match LeadConfirmation) ───────────────────────────────────────────

const body: React.CSSProperties = {
  backgroundColor: '#09090B',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  margin: 0,
  padding: 0,
}

const container: React.CSSProperties = {
  maxWidth: '560px',
  margin: '0 auto',
  padding: '32px 24px',
}

const header: React.CSSProperties = {
  marginBottom: '32px',
}

const logo: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '18px',
  fontWeight: 700,
  color: '#F4F4F2',
  margin: 0,
  letterSpacing: '-0.01em',
}

const logoSub: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '9px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#888880',
  margin: '2px 0 0',
}

const callout: React.CSSProperties = {
  backgroundColor: 'rgba(52,211,153,0.08)',
  border: '1px solid rgba(52,211,153,0.26)',
  borderRadius: '10px',
  padding: '22px 24px',
  marginBottom: '24px',
}

const badge: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '10px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#34D399',
  margin: '0 0 10px',
  fontWeight: 700,
}

const heading: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 700,
  color: '#F4F4F2',
  margin: '0 0 10px',
  letterSpacing: '-0.02em',
  lineHeight: 1.25,
}

const paragraph: React.CSSProperties = {
  fontSize: '14px',
  color: '#C8C8C2',
  margin: 0,
  lineHeight: 1.65,
}

const ctaSection: React.CSSProperties = {
  textAlign: 'center',
  margin: '8px 0 20px',
}

const ctaButton: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#34D399',
  color: '#052A18',
  fontWeight: 700,
  fontSize: '14px',
  padding: '13px 28px',
  borderRadius: '10px',
  textDecoration: 'none',
  letterSpacing: '-0.01em',
}

const fallback: React.CSSProperties = {
  fontSize: '12px',
  color: '#888880',
  lineHeight: 1.6,
  margin: '0 0 12px',
}

const fallbackLink: React.CSSProperties = {
  color: '#34D399',
  wordBreak: 'break-all',
}

const divider: React.CSSProperties = {
  borderColor: 'rgba(255,255,255,0.07)',
  margin: '20px 0',
}

const footer: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '10px',
  color: '#3A3A36',
  margin: '4px 0',
  textAlign: 'center',
}

const footerLink: React.CSSProperties = {
  color: '#3A3A36',
  textDecoration: 'underline',
}
