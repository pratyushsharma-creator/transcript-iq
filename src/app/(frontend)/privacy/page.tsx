import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy & Cookie Policy',
  description:
    'How Transcript IQ (Nextyn Advisory Private Limited) collects, uses, and protects your personal data. GDPR and PDPA compliant.',
  robots: { index: false, follow: true },
}

const LAST_UPDATED = '1 May 2026'

const SECTIONS = [
  { id: 'overview', title: '1. Overview' },
  { id: 'who-we-are', title: '2. Who We Are' },
  { id: 'data-we-collect', title: '3. Data We Collect' },
  { id: 'how-we-use', title: '4. How We Use Your Data' },
  { id: 'legal-basis', title: '5. Legal Basis for Processing' },
  { id: 'data-sharing', title: '6. Data Sharing & Transfers' },
  { id: 'data-retention', title: '7. Data Retention' },
  { id: 'cookies', title: '8. Cookie Policy' },
  { id: 'your-rights', title: '9. Your Rights' },
  { id: 'security', title: '10. Security' },
  { id: 'children', title: '11. Children\'s Privacy' },
  { id: 'changes', title: '12. Changes to This Policy' },
  { id: 'contact', title: '13. Contact Us' },
]

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-6 py-16">
      {/* Header */}
      <div className="mb-12 border-b border-[var(--border)] pb-10">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]">
          Legal
        </p>
        <h1 className="mb-3 text-[40px] font-bold leading-[1.1] tracking-[-0.04em] text-[var(--ink)]">
          Privacy &amp; Cookie Policy
        </h1>
        <p className="text-[14px] text-[var(--ink-2)]">
          Last updated: <span className="font-medium text-[var(--ink)]">{LAST_UPDATED}</span>
        </p>
      </div>

      <div className="flex gap-16">
        {/* TOC sidebar */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-24">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--mist)]">
              Contents
            </p>
            <nav className="space-y-1">
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block rounded py-1 text-[12px] text-[var(--ink-2)] transition-colors hover:text-[var(--accent)]"
                >
                  {s.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <article className="max-w-[680px] flex-1 space-y-10 text-[15px] leading-[1.75] text-[var(--ink-2)]">

          <section id="overview">
            <h2 className="mb-4 text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)]">1. Overview</h2>
            <p>
              Nextyn Advisory Private Limited (&ldquo;Nextyn&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) operates the Transcript IQ platform at{' '}
              <a href="https://transcript-iq.com" className="text-[var(--accent)] underline underline-offset-4">
                transcript-iq.com
              </a>. We are committed to protecting your personal data and handling it in a transparent, lawful, and secure manner.
            </p>
            <p className="mt-4">
              This Privacy &amp; Cookie Policy explains what information we collect when you visit or use our platform, how we use it, who we share it with, and the choices you have over your data. It applies to all visitors, registered users, and clients of Transcript IQ.
            </p>
            <p className="mt-4">
              By accessing or using Transcript IQ, you acknowledge you have read and understood this policy. If you do not agree with our practices, please do not use the platform.
            </p>
          </section>

          <section id="who-we-are">
            <h2 className="mb-4 text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)]">2. Who We Are</h2>
            <p>
              Nextyn Advisory Private Limited is incorporated in Singapore (UEN: pending) and operates Transcript IQ as a B2B expert intelligence platform serving institutional investors, hedge funds, private equity firms, and management consultants.
            </p>
            <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--ink)]">Data Controller</p>
              <div className="mt-2 space-y-1 text-[13px]">
                <p>Nextyn Advisory Private Limited</p>
                <p>Singapore · Mumbai · Bangalore · Jakarta</p>
                <p>
                  Email:{' '}
                  <a href="mailto:privacy@transcript-iq.com" className="text-[var(--accent)]">
                    privacy@transcript-iq.com
                  </a>
                </p>
              </div>
            </div>
          </section>

          <section id="data-we-collect">
            <h2 className="mb-4 text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)]">3. Data We Collect</h2>
            <p>We collect data in three ways:</p>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="mb-2 text-[15px] font-semibold text-[var(--ink)]">3.1 Information You Provide</h3>
                <ul className="list-disc space-y-1.5 pl-5">
                  <li>Name, professional title, and company</li>
                  <li>Corporate email address</li>
                  <li>Phone number (optional)</li>
                  <li>Billing address for invoice generation</li>
                  <li>Sector and investment focus (to match free transcripts)</li>
                  <li>Messages sent through our contact form or custom report requests</li>
                  <li>Payment information — processed by Stripe; Transcript IQ does not store raw card data</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-2 text-[15px] font-semibold text-[var(--ink)]">3.2 Information We Collect Automatically</h3>
                <ul className="list-disc space-y-1.5 pl-5">
                  <li>IP address and approximate geolocation</li>
                  <li>Browser type, operating system, and device type</li>
                  <li>Pages viewed and navigation paths</li>
                  <li>Transcripts downloaded and time spent on product pages</li>
                  <li>Referral sources (how you arrived at our platform)</li>
                  <li>Session timestamps and duration</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-2 text-[15px] font-semibold text-[var(--ink)]">3.3 Information from Third Parties</h3>
                <ul className="list-disc space-y-1.5 pl-5">
                  <li>Payment confirmation and fraud signals from Stripe</li>
                  <li>Analytics data from privacy-respecting analytics tools</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="how-we-use">
            <h2 className="mb-4 text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)]">4. How We Use Your Data</h2>
            <p>We use your data only for legitimate business purposes:</p>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>To deliver purchased transcripts and earnings analyses by email and in-platform download</li>
              <li>To process payments and generate invoices</li>
              <li>To verify institutional eligibility for certain research products</li>
              <li>To match free transcript requests to the correct sector coverage</li>
              <li>To respond to support, compliance, and custom report enquiries</li>
              <li>To send order confirmations, product updates, and compliance notices (transactional)</li>
              <li>To send research digests and new product alerts, where you have opted in (marketing)</li>
              <li>To improve platform performance, fix bugs, and develop new features</li>
              <li>To comply with our legal and regulatory obligations</li>
              <li>To detect and prevent fraud or misuse of the platform</li>
            </ul>
            <p className="mt-4">
              We do not sell your personal data to third parties, and we do not use it for automated profiling or decision-making that produces legal or similarly significant effects.
            </p>
          </section>

          <section id="legal-basis">
            <h2 className="mb-4 text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)]">5. Legal Basis for Processing</h2>
            <p>Where GDPR or comparable laws apply, we process your data under the following legal bases:</p>
            <div className="mt-4 space-y-3">
              {[
                ['Contract performance', 'Processing your order, delivering transcripts, and managing your account.'],
                ['Legitimate interests', 'Platform analytics, fraud prevention, and improving our service — where these do not override your rights.'],
                ['Consent', 'Marketing emails and optional analytics cookies — you may withdraw consent at any time.'],
                ['Legal obligation', 'Record-keeping, tax compliance, and responding to regulatory requests.'],
              ].map(([basis, desc]) => (
                <div key={basis} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
                  <p className="mb-1 font-semibold text-[var(--ink)]">{basis}</p>
                  <p className="text-[13px]">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="data-sharing">
            <h2 className="mb-4 text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)]">6. Data Sharing &amp; Transfers</h2>
            <p>We share data with a limited set of trusted service providers who are contractually bound to protect it:</p>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li><strong className="font-semibold text-[var(--ink)]">Stripe</strong> — payment processing. Stripe is PCI-DSS Level 1 certified.</li>
              <li><strong className="font-semibold text-[var(--ink)]">Transactional email provider</strong> — for sending order confirmations and PDF delivery.</li>
              <li><strong className="font-semibold text-[var(--ink)]">Cloud infrastructure</strong> — servers are located in AWS Singapore region (ap-southeast-1).</li>
              <li><strong className="font-semibold text-[var(--ink)]">Analytics</strong> — privacy-respecting, anonymised, no cross-site tracking.</li>
            </ul>
            <p className="mt-4">
              We do not transfer personal data to countries without adequate protections without implementing appropriate safeguards (Standard Contractual Clauses or equivalent). As our primary infrastructure is in Singapore and the EU/EEA, most data remains within jurisdictions with strong data protection laws.
            </p>
            <p className="mt-4">
              We may disclose data to legal authorities if required by law, court order, or to protect our rights and the safety of our users.
            </p>
          </section>

          <section id="data-retention">
            <h2 className="mb-4 text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)]">7. Data Retention</h2>
            <p>We retain your data only as long as necessary:</p>
            <div className="mt-4 overflow-hidden rounded-xl border border-[var(--border)]">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--surface)]">
                    <th className="px-4 py-3 text-left font-semibold text-[var(--ink)]">Data Type</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--ink)]">Retention Period</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {[
                    ['Transaction & invoice records', '7 years (tax obligation)'],
                    ['Account and order data', 'Duration of relationship + 3 years'],
                    ['Downloaded transcript access logs', '5 years (MNPI compliance)'],
                    ['Marketing preferences', 'Until you unsubscribe or request deletion'],
                    ['Support correspondence', '3 years from resolution'],
                    ['Analytics data', '13 months (rolling)'],
                  ].map(([type, period]) => (
                    <tr key={type}>
                      <td className="px-4 py-3 text-[var(--ink-2)]">{type}</td>
                      <td className="px-4 py-3 font-mono text-[var(--ink)]">{period}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="cookies">
            <h2 className="mb-4 text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)]">8. Cookie Policy</h2>
            <p>
              Cookies are small text files placed on your device. We use them to make the platform work and to understand how it is used.
            </p>
            <div className="mt-5 space-y-4">
              {[
                {
                  name: 'Essential Cookies',
                  required: true,
                  desc: 'Required for core functionality — shopping cart session, authentication tokens, CSRF protection. Cannot be disabled without breaking the platform.',
                  examples: 'tiq-cart, tiq-session, __Host-next-auth',
                },
                {
                  name: 'Preference Cookies',
                  required: false,
                  desc: 'Remember your choices such as dark/light theme and cookie consent status.',
                  examples: 'tiq-theme, tiq-cookie-consent',
                },
                {
                  name: 'Analytics Cookies',
                  required: false,
                  desc: 'Help us understand how visitors use the platform so we can improve it. Data is aggregated and anonymised.',
                  examples: 'Analytics session ID',
                },
              ].map((c) => (
                <div key={c.name} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <p className="font-semibold text-[var(--ink)]">{c.name}</p>
                    {c.required ? (
                      <span className="rounded-full border border-[var(--accent-border)] bg-[var(--accent-tint)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--accent)]">
                        Always Active
                      </span>
                    ) : (
                      <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--ink-2)]">
                        Optional
                      </span>
                    )}
                  </div>
                  <p className="text-[13px]">{c.desc}</p>
                  <p className="mt-2 font-mono text-[11px] text-[var(--mist)]">Examples: {c.examples}</p>
                </div>
              ))}
            </div>
            <p className="mt-4">
              You can manage your cookie preferences at any time via the cookie banner at the bottom of any page, or through your browser settings. Note that disabling non-essential cookies does not affect your ability to purchase or download research.
            </p>
          </section>

          <section id="your-rights">
            <h2 className="mb-4 text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)]">9. Your Rights</h2>
            <p>Depending on your jurisdiction, you may have the following rights over your personal data:</p>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li><strong className="font-semibold text-[var(--ink)]">Access</strong> — request a copy of the personal data we hold about you</li>
              <li><strong className="font-semibold text-[var(--ink)]">Rectification</strong> — ask us to correct inaccurate or incomplete data</li>
              <li><strong className="font-semibold text-[var(--ink)]">Erasure</strong> — ask us to delete your data, subject to legal retention obligations</li>
              <li><strong className="font-semibold text-[var(--ink)]">Restriction</strong> — ask us to limit how we process your data in certain circumstances</li>
              <li><strong className="font-semibold text-[var(--ink)]">Portability</strong> — receive your data in a machine-readable format</li>
              <li><strong className="font-semibold text-[var(--ink)]">Objection</strong> — object to processing based on our legitimate interests</li>
              <li><strong className="font-semibold text-[var(--ink)]">Withdrawal of consent</strong> — withdraw consent for marketing or optional cookies at any time</li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, email{' '}
              <a href="mailto:privacy@transcript-iq.com" className="text-[var(--accent)] underline underline-offset-4">
                privacy@transcript-iq.com
              </a>. We will respond within 30 days. If you are unsatisfied with our response, you have the right to lodge a complaint with your local data protection authority.
            </p>
          </section>

          <section id="security">
            <h2 className="mb-4 text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)]">10. Security</h2>
            <p>
              We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, disclosure, alteration, or destruction. These include:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>TLS 1.3 encryption for all data in transit</li>
              <li>Encryption at rest for databases containing personal data</li>
              <li>Access controls and role-based permissions for our team</li>
              <li>Secure payment processing via Stripe (no raw card data stored by us)</li>
              <li>Regular security reviews and dependency audits</li>
              <li>PDF watermarking and access logging for all downloaded research</li>
            </ul>
            <p className="mt-4">
              No method of transmission over the internet is 100% secure. While we strive to use commercially acceptable means to protect your data, we cannot guarantee absolute security.
            </p>
          </section>

          <section id="children">
            <h2 className="mb-4 text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)]">11. Children&apos;s Privacy</h2>
            <p>
              Transcript IQ is a professional B2B platform intended for use by institutional investors, financial professionals, and corporate researchers. It is not directed at individuals under the age of 18. We do not knowingly collect personal data from minors. If you believe we have inadvertently collected such data, please contact us immediately.
            </p>
          </section>

          <section id="changes">
            <h2 className="mb-4 text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)]">12. Changes to This Policy</h2>
            <p>
              We may update this Privacy &amp; Cookie Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will indicate the date of the most recent update at the top of this page.
            </p>
            <p className="mt-4">
              For material changes, we will notify registered clients by email at least 14 days before the change takes effect. Continued use of the platform after any such update constitutes acceptance of the revised policy.
            </p>
          </section>

          <section id="contact">
            <h2 className="mb-4 text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)]">13. Contact Us</h2>
            <p>For any privacy-related questions, data requests, or concerns:</p>
            <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 text-[13px]">
              <p className="font-semibold text-[var(--ink)]">Nextyn Advisory Private Limited</p>
              <p className="mt-1">Privacy Officer · Transcript IQ</p>
              <p className="mt-3">
                <a href="mailto:privacy@transcript-iq.com" className="text-[var(--accent)] underline underline-offset-4">
                  privacy@transcript-iq.com
                </a>
              </p>
              <p className="mt-1 text-[var(--mist)]">We aim to respond to all privacy requests within 5 business days.</p>
            </div>
            <div className="mt-6 flex gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-[10px] bg-btn-primary px-5 py-2.5 text-[13px] font-semibold text-btn-primary-fg shadow-cta transition-all duration-base ease-out hover:-translate-y-px hover:bg-btn-primary-hover"
              >
                Contact Us
              </Link>
              <Link
                href="/compliance"
                className="inline-flex items-center gap-2 rounded-[10px] border border-[var(--border-2)] px-5 py-2.5 text-[13px] font-medium text-[var(--ink-2)] transition-all duration-base ease-out hover:border-[var(--accent-border)] hover:text-[var(--ink)]"
              >
                Compliance Framework
              </Link>
            </div>
          </section>

        </article>
      </div>
    </div>
  )
}
