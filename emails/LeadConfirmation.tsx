import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Link,
} from '@react-email/components'

// ── Types ─────────────────────────────────────────────────────────────────────

export type LeadConfirmationProps = {
  type: 'free-transcript' | 'custom-transcript' | 'custom-earnings' | 'contact'
  name?: string      // available for custom forms and contact
  sector?: string    // free-transcript
  topic?: string     // custom forms
  subject?: string   // contact form
}

// ── Content map ───────────────────────────────────────────────────────────────

type EmailContent = {
  preview: string
  badge: string
  heading: string
  body: string
  steps: Array<{ num: string; title: string; detail: string }>
  ctaLabel: string
  ctaUrl: string
}

function getContent(props: LeadConfirmationProps): EmailContent {
  const { type, name, sector, topic, subject } = props
  const firstName = name?.split(' ')[0] ?? null

  switch (type) {
    case 'free-transcript':
      return {
        preview: 'Your free expert call transcript is on its way — Transcript IQ',
        badge: '✓ Request Received',
        heading: 'Your transcript is being matched.',
        body: `We've received your request${sector ? ` for a ${sector} transcript` : ''}. Our team will hand-pick the most relevant expert call transcript from our library and deliver it directly to your inbox within 24 hours.`,
        steps: [
          { num: '01', title: 'Matching in progress', detail: 'We review your sector preference and select the best-fit transcript from our verified library.' },
          { num: '02', title: 'PDF delivered within 24 hours', detail: 'Your free transcript arrives by email — MNPI-screened, PII-redacted, and ready to use in IC memos.' },
          { num: '03', title: 'Browse the full library', detail: 'Explore 500+ expert call transcripts across Technology, Healthcare, Financials, Industrials, and more.' },
        ],
        ctaLabel: 'Browse the Transcript Library →',
        ctaUrl: 'https://transcript-iq.com/expert-transcripts',
      }

    case 'custom-transcript':
      return {
        preview: 'Your custom research brief has been received — Transcript IQ',
        badge: '✓ Brief Received',
        heading: `${firstName ? `Hi ${firstName} — your` : 'Your'} research brief is with our team.`,
        body: `We've received your custom transcript request${topic ? ` on "${topic}"` : ''}. Our research coordinators will review your requirements and come back to you within 2 business days with a shortlist of expert candidates matched to your brief.`,
        steps: [
          { num: '01', title: 'Brief reviewed (within 24 hours)', detail: 'Our team assesses your topic, expert profile requirements, and geography to shortlist the best-fit experts.' },
          { num: '02', title: 'Shortlist of candidates sent to you', detail: 'You receive anonymised profiles of 3–5 matched experts with their former titles and relevant experience.' },
          { num: '03', title: 'Call scheduled and transcript delivered', detail: 'Once you select an expert, the call is scheduled and the MNPI-screened transcript is delivered within 5 business days.' },
        ],
        ctaLabel: 'Browse Existing Transcripts →',
        ctaUrl: 'https://transcript-iq.com/expert-transcripts',
      }

    case 'custom-earnings':
      return {
        preview: 'Your custom earnings analysis request has been received — Transcript IQ',
        badge: '✓ Request Received',
        heading: `${firstName ? `Hi ${firstName} — your` : 'Your'} earnings analysis request is with our team.`,
        body: `We've received your custom earnings analysis request${topic ? ` on "${topic}"` : ''}. Our analysts will review your requirements and follow up within 2 business days with next steps and a timeline.`,
        steps: [
          { num: '01', title: 'Requirements reviewed (within 24 hours)', detail: 'Our team reviews your company, ticker, and key focus areas to scope the analysis.' },
          { num: '02', title: 'Scope and timeline confirmed', detail: 'We confirm the deliverable format, depth, and delivery date before work begins.' },
          { num: '03', title: 'Analysis delivered', detail: 'Your MNPI-screened earnings analysis arrives as a structured PDF with key callouts and compliance certification.' },
        ],
        ctaLabel: 'Browse Earnings Analyses →',
        ctaUrl: 'https://transcript-iq.com/earnings-analysis',
      }

    case 'contact':
    default:
      return {
        preview: "We've received your message — Transcript IQ",
        badge: '✓ Message Received',
        heading: `${firstName ? `Thanks, ${firstName} —` : 'Thanks —'} we'll be in touch.`,
        body: `We've received your message${subject ? ` regarding "${subject}"` : ''}. Our team will get back to you at this address within one business day.`,
        steps: [
          { num: '01', title: 'Message received', detail: 'Your enquiry has been logged and routed to the right team member.' },
          { num: '02', title: 'Response within 1 business day', detail: 'For custom research requests, allow up to 2 business days for a detailed response.' },
          { num: '03', title: 'In the meantime', detail: 'Browse our transcript library or download a free sample transcript while you wait.' },
        ],
        ctaLabel: 'Browse the Transcript Library →',
        ctaUrl: 'https://transcript-iq.com/expert-transcripts',
      }
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export function LeadConfirmation(props: LeadConfirmationProps) {
  const c = getContent(props)

  return (
    <Html>
      <Head />
      <Preview>{c.preview}</Preview>
      <Body style={body}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <Text style={logo}>
              Transcript<span style={{ color: '#34D399' }}>IQ</span>
            </Text>
            <Text style={logoSub}>By Nextyn</Text>
          </Section>

          {/* Confirmation callout */}
          <Section style={successBox}>
            <Text style={successBadge}>{c.badge}</Text>
            <Text style={successHeading}>{c.heading}</Text>
            <Text style={successBody}>{c.body}</Text>
          </Section>

          <Hr style={divider} />

          {/* Next steps */}
          <Section style={section}>
            <Text style={sectionLabel}>WHAT HAPPENS NEXT</Text>
            {c.steps.map((step) => (
              <Section key={step.num} style={stepRow}>
                <Text style={stepNum}>{step.num}</Text>
                <Text style={stepTitle}>{step.title}</Text>
                <Text style={stepDetail}>{step.detail}</Text>
              </Section>
            ))}
          </Section>

          <Hr style={divider} />

          {/* CTA */}
          <Section style={ctaSection}>
            <Link href={c.ctaUrl} style={ctaButton}>{c.ctaLabel}</Link>
          </Section>

          {/* Compliance strip */}
          <Section style={complianceBox}>
            <Text style={complianceText}>
              All Transcript IQ research is MNPI-screened and PII-redacted. Aligned with SEC §10b-5 and FCA expert network guidelines.
            </Text>
          </Section>

          {/* Footer */}
          <Hr style={divider} />
          <Section>
            <Text style={footer}>© {new Date().getFullYear()} Nextyn Advisory Pte. Ltd. · Singapore</Text>
            <Text style={footer}>
              <Link href="https://transcript-iq.com" style={footerLink}>transcript-iq.com</Link>
              {' · '}
              <Link href="mailto:hello@transcript-iq.com" style={footerLink}>hello@transcript-iq.com</Link>
            </Text>
            <Text style={footer}>You received this because you submitted a request on Transcript IQ.</Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

export default LeadConfirmation

// ── Styles ────────────────────────────────────────────────────────────────────

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

const successBox: React.CSSProperties = {
  backgroundColor: 'rgba(52,211,153,0.08)',
  border: '1px solid rgba(52,211,153,0.26)',
  borderRadius: '10px',
  padding: '22px 24px',
  marginBottom: '24px',
}

const successBadge: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '10px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#34D399',
  margin: '0 0 10px',
  fontWeight: 700,
}

const successHeading: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 700,
  color: '#F4F4F2',
  margin: '0 0 10px',
  letterSpacing: '-0.02em',
  lineHeight: 1.25,
}

const successBody: React.CSSProperties = {
  fontSize: '14px',
  color: '#C8C8C2',
  margin: 0,
  lineHeight: 1.65,
}

const divider: React.CSSProperties = {
  borderColor: 'rgba(255,255,255,0.07)',
  margin: '20px 0',
}

const section: React.CSSProperties = {
  marginBottom: '8px',
}

const sectionLabel: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '9px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: '#888880',
  margin: '0 0 16px',
}

const stepRow: React.CSSProperties = {
  marginBottom: '16px',
  paddingLeft: '4px',
  borderLeft: '2px solid rgba(52,211,153,0.3)',
  paddingTop: '2px',
  paddingBottom: '2px',
}

const stepNum: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '9px',
  letterSpacing: '0.1em',
  color: '#34D399',
  margin: '0 0 3px',
  fontWeight: 700,
}

const stepTitle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 600,
  color: '#F4F4F2',
  margin: '0 0 3px',
}

const stepDetail: React.CSSProperties = {
  fontSize: '12px',
  color: '#888880',
  margin: 0,
  lineHeight: 1.6,
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

const complianceBox: React.CSSProperties = {
  backgroundColor: 'rgba(52,211,153,0.04)',
  border: '1px solid rgba(52,211,153,0.14)',
  borderRadius: '8px',
  padding: '12px 16px',
  marginBottom: '20px',
}

const complianceText: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '9px',
  color: '#34D399',
  lineHeight: 1.7,
  margin: 0,
  opacity: 0.7,
  letterSpacing: '0.02em',
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
