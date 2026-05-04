import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Engagement',
  description:
    'Terms governing access to and use of expert call transcripts and earnings analysis briefs on the Transcript IQ platform.',
}

const LAST_UPDATED = '1 May 2026'

const SECTIONS = [
  { id: 'definitions', title: '1. Definitions' },
  { id: 'eligibility', title: '2. Eligibility & Access' },
  { id: 'licence', title: '3. Licence to Use Research' },
  { id: 'orders-payment', title: '4. Orders & Payment' },
  { id: 'delivery', title: '5. Delivery of Research' },
  { id: 'refunds', title: '6. Refunds & Cancellations' },
  { id: 'compliance', title: '7. Compliance Obligations' },
  { id: 'mnpi', title: '8. MNPI Policy' },
  { id: 'ip', title: '9. Intellectual Property' },
  { id: 'confidentiality', title: '10. Confidentiality' },
  { id: 'prohibited-use', title: '11. Prohibited Uses' },
  { id: 'limitation', title: '12. Limitation of Liability' },
  { id: 'disclaimer', title: '13. Disclaimer' },
  { id: 'governing-law', title: '14. Governing Law' },
  { id: 'amendments', title: '15. Amendments' },
  { id: 'contact', title: '16. Contact' },
]

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-6 py-16">
      {/* Header */}
      <div className="mb-12 border-b border-[var(--border)] pb-10">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]">
          Legal
        </p>
        <h1 className="mb-3 text-[40px] font-bold leading-[1.1] tracking-[-0.04em] text-[var(--ink)]">
          Terms of Engagement
        </h1>
        <p className="text-[14px] text-[var(--ink-2)]">
          Last updated: <span className="font-medium text-[var(--ink)]">{LAST_UPDATED}</span>
        </p>
        <p className="mt-4 max-w-[600px] text-[15px] leading-relaxed text-[var(--ink-2)]">
          These Terms govern your access to and use of research products published on the Transcript IQ platform operated by Nextyn Advisory Private Limited. By placing an order, you agree to be bound by these Terms.
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

          <section id="definitions">
            <h2 className="mb-4 text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)]">1. Definitions</h2>
            <div className="space-y-3">
              {[
                ['Platform', 'The Transcript IQ website and services at transcript-iq.com.'],
                ['Nextyn / We / Us', 'Nextyn Advisory Private Limited, the operator of Transcript IQ.'],
                ['Client / You', 'The individual professional or legal entity purchasing or accessing research on the Platform.'],
                ['Research Product', 'Any expert call transcript, earnings analysis brief, or custom research report available for purchase or download on the Platform.'],
                ['Expert', 'A third-party subject-matter specialist whose knowledge or experience was captured in a transcript, subject to Nextyn\'s expert vetting and MNPI screening process.'],
                ['MNPI', 'Material Non-Public Information as defined under applicable securities law.'],
                ['Licence', 'The limited right to use a Research Product granted to you upon purchase.'],
              ].map(([term, def]) => (
                <div key={term} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 text-[13px]">
                  <span className="font-semibold text-[var(--ink)]">&ldquo;{term}&rdquo;</span>
                  {' — '}{def}
                </div>
              ))}
            </div>
          </section>

          <section id="eligibility">
            <h2 className="mb-4 text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)]">2. Eligibility &amp; Access</h2>
            <p>
              Transcript IQ is a business-to-business platform. To place an order you must be:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>At least 18 years of age</li>
              <li>Acting in a professional capacity for a legal entity (not as a retail consumer)</li>
              <li>Using a verified corporate email address (free consumer email domains are not accepted)</li>
              <li>Authorised by your employer or client organisation to purchase research</li>
            </ul>
            <p className="mt-4">
              We reserve the right to reject orders or terminate access for any account that misrepresents its professional status or violates these Terms.
            </p>
          </section>

          <section id="licence">
            <h2 className="mb-4 text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)]">3. Licence to Use Research</h2>
            <p>
              Upon successful payment, Nextyn grants you a non-exclusive, non-transferable, revocable licence to:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>Download and retain one (1) copy of the purchased Research Product in PDF format</li>
              <li>Use the Research Product internally for investment analysis, portfolio management, and research purposes</li>
              <li>Cite the Research Product in internal investment committee memos, research notes, and client-facing materials using the prescribed citation format:
                <blockquote className="mt-2 rounded-lg border-l-4 border-[var(--accent-border)] bg-[var(--accent-tint)] p-4 font-mono text-[12px] text-[var(--accent)]">
                  &ldquo;Expert call, [Sector], via Transcript IQ, [Date]&rdquo;
                </blockquote>
              </li>
            </ul>
            <p className="mt-4">
              This licence does not permit redistribution, resale, sublicensing, or publication of the Research Product or any substantial portion of it to third parties outside your organisation.
            </p>
          </section>

          <section id="orders-payment">
            <h2 className="mb-4 text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)]">4. Orders &amp; Payment</h2>
            <p>
              All prices are displayed in USD exclusive of applicable taxes. Goods and Services Tax (GST), VAT, or equivalent may apply depending on your jurisdiction and will be calculated at checkout.
            </p>
            <p className="mt-4">
              We accept payment by credit card and debit card (via Stripe). For qualifying enterprise clients, invoice-based payment (net-30) is available upon request. By submitting an order, you represent that you are authorised to use the payment method provided.
            </p>
            <p className="mt-4">
              Orders are confirmed by email. An order confirmation does not guarantee perpetual access; the licence is to the downloaded PDF which you may retain indefinitely.
            </p>
          </section>

          <section id="delivery">
            <h2 className="mb-4 text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)]">5. Delivery of Research</h2>
            <p>
              Upon payment confirmation, Research Products are made available for download immediately via your order confirmation page and by email to the address provided at checkout. PDFs are individually watermarked with your organisation name for compliance tracing.
            </p>
            <p className="mt-4">
              In the event of a technical issue preventing delivery, please contact{' '}
              <a href="mailto:support@transcript-iq.com" className="text-[var(--accent)] underline underline-offset-4">
                support@transcript-iq.com
              </a>{' '}
              within 48 hours of purchase and we will re-deliver within one business day.
            </p>
            <p className="mt-4">
              Custom research reports are delivered within the timeframe quoted at the time of order acceptance, typically 5–15 business days.
            </p>
          </section>

          <section id="refunds">
            <h2 className="mb-4 text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)]">6. Refunds &amp; Cancellations</h2>
            <p>
              Because Research Products are digital goods delivered immediately upon purchase, all sales are final and non-refundable once the download link has been accessed or the PDF has been delivered to your email address.
            </p>
            <p className="mt-4">
              Exceptions are made at our sole discretion where:
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li>The Research Product was materially different from its description at the time of purchase</li>
              <li>A confirmed technical failure prevented delivery and re-delivery is not possible</li>
              <li>A duplicate charge occurred due to a payment processing error</li>
            </ul>
            <p className="mt-4">
              To request a refund under an exception, email{' '}
              <a href="mailto:support@transcript-iq.com" className="text-[var(--accent)] underline underline-offset-4">
                support@transcript-iq.com
              </a>{' '}
              within 7 days of purchase with your order reference number.
            </p>
          </section>

          <section id="compliance">
            <h2 className="mb-4 text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)]">7. Compliance Obligations</h2>
            <p>
              You are responsible for ensuring your use of Research Products complies with all laws, regulations, and internal policies applicable to your organisation, including but not limited to:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>Securities laws and regulations in your jurisdiction (including SEC, FCA, MAS, SEBI, and equivalent bodies)</li>
              <li>Your firm&apos;s compliance policies regarding the use of expert networks and primary research</li>
              <li>Insider trading laws and MNPI handling procedures</li>
              <li>Confidentiality and information barrier requirements</li>
            </ul>
            <p className="mt-4">
              Each Research Product includes an MNPI Screening Certificate confirming that the content was reviewed and cleared prior to publication. This certificate does not constitute legal advice and does not relieve you of your independent obligation to assess MNPI risk within your own compliance framework.
            </p>
          </section>

          <section id="mnpi">
            <h2 className="mb-4 text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)]">8. MNPI Policy</h2>
            <p>
              All expert contributors to the Transcript IQ platform are required to:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>Confirm they are not bound by any confidentiality obligations that would be breached by participating</li>
              <li>Disclose any current employment or advisory relationships with publicly listed companies</li>
              <li>Refrain from sharing non-public information about any current employer or client</li>
              <li>Complete Nextyn&apos;s MNPI attestation before and after each engagement</li>
            </ul>
            <p className="mt-4">
              Nextyn conducts an independent MNPI review of each transcript prior to publication. Any content identified as potentially MNPI is redacted or the transcript is withheld from publication entirely.
            </p>
            <p className="mt-4">
              If you discover content in a purchased transcript that you believe may constitute MNPI, you are obligated to notify your compliance officer immediately and to contact{' '}
              <a href="mailto:compliance@transcript-iq.com" className="text-[var(--accent)] underline underline-offset-4">
                compliance@transcript-iq.com
              </a>.
            </p>
          </section>

          <section id="ip">
            <h2 className="mb-4 text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)]">9. Intellectual Property</h2>
            <p>
              All Research Products published on the Platform are the intellectual property of Nextyn Advisory Private Limited or its licensors. The limited licence granted upon purchase does not transfer ownership of any copyright or other intellectual property rights.
            </p>
            <p className="mt-4">
              The Transcript IQ name, logo, and platform design are trademarks of Nextyn Advisory Private Limited and may not be used without our express written permission.
            </p>
          </section>

          <section id="confidentiality">
            <h2 className="mb-4 text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)]">10. Confidentiality</h2>
            <p>
              Research Products may contain commercially sensitive analysis. You agree to:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>Not share Research Products with individuals outside your organisation without written consent from Nextyn</li>
              <li>Not publish, post, or distribute Research Products (in whole or in part) on the internet, social media, or any public forum</li>
              <li>Maintain reasonable internal controls to prevent unauthorised access to downloaded Research Products</li>
            </ul>
            <p className="mt-4">
              Breach of this clause entitles Nextyn to immediately terminate your licence, pursue damages, and seek injunctive relief.
            </p>
          </section>

          <section id="prohibited-use">
            <h2 className="mb-4 text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)]">11. Prohibited Uses</h2>
            <p>You may not use the Platform or Research Products to:</p>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>Train, fine-tune, or develop artificial intelligence or machine learning models</li>
              <li>Create derivative competitive research products for commercial distribution</li>
              <li>Circumvent, reverse-engineer, or scrape the Platform</li>
              <li>Misrepresent the source or authorship of research in any external communications</li>
              <li>Engage in market manipulation, front-running, or any activity that violates securities law</li>
              <li>Access the Platform using automated bots, scrapers, or bulk download tools</li>
            </ul>
          </section>

          <section id="limitation">
            <h2 className="mb-4 text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)]">12. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, Nextyn&apos;s total liability to you for any claim arising from your use of the Platform or Research Products shall not exceed the amount paid by you for the specific Research Product giving rise to the claim in the twelve (12) months preceding the claim.
            </p>
            <p className="mt-4">
              In no event shall Nextyn be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, loss of investment returns, or loss of data, arising from your use of the Platform or Research Products.
            </p>
          </section>

          <section id="disclaimer">
            <h2 className="mb-4 text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)]">13. Disclaimer</h2>
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 text-[13px] text-amber-700 dark:text-amber-400">
              <p className="font-semibold uppercase tracking-[0.06em]">Important notice</p>
              <p className="mt-2">
                Research Products are provided for informational purposes only and do not constitute investment advice, legal advice, or a recommendation to buy or sell any security. Experts participating in transcripts share their personal views and experience — they are not speaking on behalf of any current employer. Past views expressed in transcripts do not predict future events.
              </p>
              <p className="mt-3">
                Nextyn does not guarantee the accuracy, completeness, or timeliness of any information in Research Products. All investment decisions should be made in consultation with qualified professional advisers. Nextyn accepts no responsibility for investment losses arising from reliance on Research Products.
              </p>
            </div>
          </section>

          <section id="governing-law">
            <h2 className="mb-4 text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)]">14. Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of Singapore. Any dispute arising out of or in connection with these Terms shall be submitted to the exclusive jurisdiction of the courts of Singapore, unless you are a consumer in a jurisdiction with mandatory local consumer protection laws, in which case your statutory rights are unaffected.
            </p>
          </section>

          <section id="amendments">
            <h2 className="mb-4 text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)]">15. Amendments</h2>
            <p>
              We may update these Terms from time to time. Material changes will be communicated to registered clients by email with at least 14 days&apos; notice before taking effect. Continued use of the Platform after the effective date constitutes acceptance. If you do not agree to the revised Terms, you must cease using the Platform.
            </p>
          </section>

          <section id="contact">
            <h2 className="mb-4 text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)]">16. Contact</h2>
            <p>For questions about these Terms:</p>
            <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 text-[13px]">
              <p className="font-semibold text-[var(--ink)]">Nextyn Advisory Private Limited</p>
              <p className="mt-1">Legal &amp; Compliance · Transcript IQ</p>
              <p className="mt-3">
                <a href="mailto:legal@transcript-iq.com" className="text-[var(--accent)] underline underline-offset-4">
                  legal@transcript-iq.com
                </a>
              </p>
            </div>
            <div className="mt-6 flex gap-3">
              <Link
                href="/compliance"
                className="inline-flex items-center gap-2 rounded-[10px] bg-btn-primary px-5 py-2.5 text-[13px] font-semibold text-btn-primary-fg shadow-cta transition-all duration-base ease-out hover:-translate-y-px hover:bg-btn-primary-hover"
              >
                Compliance Framework
              </Link>
              <Link
                href="/privacy"
                className="inline-flex items-center gap-2 rounded-[10px] border border-[var(--border-2)] px-5 py-2.5 text-[13px] font-medium text-[var(--ink-2)] transition-all duration-base ease-out hover:border-[var(--accent-border)] hover:text-[var(--ink)]"
              >
                Privacy Policy
              </Link>
            </div>
          </section>

        </article>
      </div>
    </div>
  )
}
