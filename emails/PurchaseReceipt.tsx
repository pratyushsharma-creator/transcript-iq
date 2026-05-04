import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
  Link,
} from '@react-email/components'
import type { SendReceiptOptions } from '../src/lib/resend'

export function PurchaseReceipt({
  customerName,
  orderRef,
  items,
  subtotalUsd,
  taxUsd,
  totalUsd,
}: SendReceiptOptions) {
  return (
    <Html>
      <Head />
      <Preview>Your Transcript IQ research is ready — {orderRef}</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>
              Transcript<span style={{ color: '#34D399' }}>IQ</span>
            </Text>
            <Text style={logoSub}>By Nextyn</Text>
          </Section>

          {/* Success callout */}
          <Section style={successBox}>
            <Text style={successTitle}>✓ Order Confirmed</Text>
            <Text style={successBody}>
              Hi {customerName}, your research is ready. PDFs will be delivered to this address within minutes.
            </Text>
          </Section>

          {/* Order ref */}
          <Section style={section}>
            <Text style={label}>ORDER REFERENCE</Text>
            <Text style={orderRefText}>{orderRef}</Text>
          </Section>

          <Hr style={divider} />

          {/* Items */}
          <Section style={section}>
            <Text style={sectionTitle}>Items Purchased</Text>
            {items.map((item, i) => (
              <Row key={i} style={itemRow}>
                <Column style={itemBadgeCol}>
                  <Text style={item.type === 'earnings' ? earningsBadge : transcriptBadge}>
                    {item.type === 'earnings' && item.ticker ? `$${item.ticker}` : 'EXP'}
                  </Text>
                </Column>
                <Column style={itemTitleCol}>
                  <Text style={itemType}>
                    {item.type === 'earnings' ? 'Earnings Analysis' : 'Expert Transcript'}
                  </Text>
                  <Text style={itemTitle}>{item.title}</Text>
                  {item.downloadUrl && (
                    <Link href={item.downloadUrl} style={downloadBtn}>
                      ↓ Download PDF
                    </Link>
                  )}
                </Column>
                <Column style={itemPriceCol}>
                  <Text style={itemPrice}>${item.priceUsd}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={divider} />

          {/* Totals */}
          <Section style={section}>
            <Row style={totalRow}>
              <Column><Text style={totalLabel}>Subtotal</Text></Column>
              <Column><Text style={totalValue}>${subtotalUsd.toFixed(2)}</Text></Column>
            </Row>
            <Row style={totalRow}>
              <Column><Text style={totalLabel}>GST / Tax (9%)</Text></Column>
              <Column><Text style={totalValue}>${taxUsd.toFixed(2)}</Text></Column>
            </Row>
            <Hr style={thinDivider} />
            <Row style={totalRow}>
              <Column><Text style={grandLabel}>Total Charged</Text></Column>
              <Column><Text style={grandValue}>${totalUsd.toFixed(2)}</Text></Column>
            </Row>
          </Section>

          <Hr style={divider} />

          {/* Compliance note */}
          <Section style={complianceBox}>
            <Text style={complianceTitle}>COMPLIANCE NOTE</Text>
            <Text style={complianceText}>
              All transcripts include an MNPI screening certificate. Cite as: "Expert call, [Sector], via
              Transcript-IQ, [Date]" in IC memos and research notes. Aligned with SEC §10b-5 and FCA expert
              network guidelines.
            </Text>
          </Section>

          {/* CTA */}
          <Section style={ctaSection}>
            <Link href="https://transcript-iq.com/expert-transcripts" style={ctaButton}>
              Browse More Transcripts →
            </Link>
          </Section>

          {/* Footer */}
          <Hr style={divider} />
          <Section>
            <Text style={footer}>
              © {new Date().getFullYear()} Nextyn Advisory Pte. Ltd. · Singapore
            </Text>
            <Text style={footer}>
              <Link href="https://transcript-iq.com" style={footerLink}>transcript-iq.com</Link>
              {' · '}
              <Link href="mailto:hello@transcript-iq.com" style={footerLink}>hello@transcript-iq.com</Link>
            </Text>
            <Text style={footer}>
              You received this email because you made a purchase on Transcript IQ.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default PurchaseReceipt

// ── Styles ───────────────────────────────────────────────────────────────────────

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
  padding: '20px 24px',
  marginBottom: '24px',
}

const successTitle: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '11px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#34D399',
  margin: '0 0 8px',
}

const successBody: React.CSSProperties = {
  fontSize: '14px',
  color: '#C8C8C2',
  margin: 0,
  lineHeight: 1.6,
}

const section: React.CSSProperties = {
  marginBottom: '4px',
}

const label: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '9px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#888880',
  margin: '0 0 4px',
}

const orderRefText: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '15px',
  fontWeight: 600,
  color: '#34D399',
  letterSpacing: '0.04em',
  margin: 0,
}

const sectionTitle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 600,
  color: '#F4F4F2',
  margin: '0 0 12px',
}

const divider: React.CSSProperties = {
  borderColor: 'rgba(255,255,255,0.07)',
  margin: '20px 0',
}

const thinDivider: React.CSSProperties = {
  borderColor: 'rgba(255,255,255,0.07)',
  margin: '10px 0',
}

const itemRow: React.CSSProperties = {
  marginBottom: '12px',
}

const itemBadgeCol: React.CSSProperties = {
  width: '40px',
  verticalAlign: 'top',
}

const itemTitleCol: React.CSSProperties = {
  verticalAlign: 'top',
  paddingRight: '12px',
}

const itemPriceCol: React.CSSProperties = {
  width: '60px',
  verticalAlign: 'top',
  textAlign: 'right',
}

const transcriptBadge: React.CSSProperties = {
  display: 'inline-block',
  background: 'rgba(52,211,153,0.08)',
  border: '1px solid rgba(52,211,153,0.26)',
  borderRadius: '6px',
  fontFamily: 'monospace',
  fontSize: '8px',
  fontWeight: 700,
  color: '#34D399',
  padding: '4px 6px',
  margin: 0,
}

const earningsBadge: React.CSSProperties = {
  display: 'inline-block',
  background: 'rgba(251,191,36,0.08)',
  border: '1px solid rgba(251,191,36,0.28)',
  borderRadius: '6px',
  fontFamily: 'monospace',
  fontSize: '8px',
  fontWeight: 700,
  color: '#FBBF24',
  padding: '4px 6px',
  margin: 0,
}

const itemType: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '9px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#888880',
  margin: '0 0 2px',
}

const itemTitle: React.CSSProperties = {
  fontSize: '12px',
  color: '#C8C8C2',
  lineHeight: 1.4,
  margin: 0,
}

const itemPrice: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '13px',
  fontWeight: 600,
  color: '#34D399',
  margin: 0,
}

const downloadBtn: React.CSSProperties = {
  display: 'inline-block',
  marginTop: '6px',
  backgroundColor: 'rgba(52,211,153,0.1)',
  border: '1px solid rgba(52,211,153,0.3)',
  borderRadius: '6px',
  color: '#34D399',
  fontFamily: 'monospace',
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.06em',
  padding: '5px 12px',
  textDecoration: 'none',
}

const totalRow: React.CSSProperties = {
  marginBottom: '6px',
}

const totalLabel: React.CSSProperties = {
  fontSize: '13px',
  color: '#C8C8C2',
  margin: 0,
}

const totalValue: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '13px',
  color: '#C8C8C2',
  textAlign: 'right',
  margin: 0,
}

const grandLabel: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 600,
  color: '#F4F4F2',
  margin: 0,
}

const grandValue: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '15px',
  fontWeight: 600,
  color: '#34D399',
  textAlign: 'right',
  margin: 0,
}

const complianceBox: React.CSSProperties = {
  backgroundColor: 'rgba(52,211,153,0.05)',
  border: '1px solid rgba(52,211,153,0.16)',
  borderRadius: '8px',
  padding: '14px 18px',
  marginBottom: '24px',
}

const complianceTitle: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '8px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#34D399',
  fontWeight: 700,
  margin: '0 0 6px',
}

const complianceText: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '9px',
  color: '#34D399',
  lineHeight: 1.7,
  margin: 0,
  opacity: 0.8,
}

const ctaSection: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '8px',
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
