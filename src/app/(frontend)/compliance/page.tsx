import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck, Users, Building2, Database } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Compliance Framework',
  description:
    'How Transcript IQ screens experts, protects clients, and ensures every research product meets MNPI, SEC, and FCA standards.',
  robots: { index: false, follow: true },
}

export default function CompliancePage() {
  return (
    <div className="mx-auto max-w-[1100px] px-6 py-16">

      {/* Page Header */}
      <div className="mb-16 border-b border-[var(--border)] pb-12">
        <div className="flex items-start gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[var(--accent-border)] bg-[var(--accent-tint)]">
            <ShieldCheck className="h-7 w-7 text-[var(--accent)]" />
          </div>
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]">
              Compliance &amp; Governance
            </p>
            <h1 className="mb-3 text-[40px] font-bold leading-[1.1] tracking-[-0.04em] text-[var(--ink)]">
              Compliance Framework
            </h1>
            <p className="max-w-[600px] text-[16px] leading-relaxed text-[var(--ink-2)]">
              Transcript IQ operates within a multi-layer compliance framework covering expert vetting, MNPI screening, client obligations, and data governance. Every research product published on our platform has passed all four layers.
            </p>
          </div>
        </div>
      </div>

      {/* Compliance badges strip */}
      <div className="mb-14 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'MNPI Screened', desc: 'Every transcript' },
          { label: 'PII Redacted', desc: 'Expert identities protected' },
          { label: 'SEC §10b-5', desc: 'Aligned' },
          { label: 'FCA Guidelines', desc: 'Expert network compliant' },
        ].map((b) => (
          <div key={b.label} className="rounded-xl border border-[var(--accent-border)] bg-[var(--accent-tint)] p-4 text-center">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">{b.label}</p>
            <p className="mt-1 font-mono text-[10px] text-[var(--accent)] opacity-70">{b.desc}</p>
          </div>
        ))}
      </div>

      {/* Four pillars */}
      <div className="space-y-16">

        {/* ── Pillar 1: Expert Compliance ──────────────────────────────────── */}
        <section>
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)]">
              <Users className="h-5 w-5 text-[var(--accent)]" />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--mist)]">Pillar 1</p>
              <h2 className="text-[26px] font-semibold tracking-[-0.03em] text-[var(--ink)]">Expert Compliance</h2>
            </div>
          </div>

          <p className="mb-6 max-w-[680px] text-[15px] leading-[1.75] text-[var(--ink-2)]">
            Every expert contributing to the Transcript IQ research network passes a rigorous vetting process before any engagement. We treat expert compliance as the foundation of the entire research product — a clean transcript begins with a clean expert relationship.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: 'Identity & Professional Verification',
                items: [
                  'Professional identity verified against LinkedIn and company directories',
                  'Current and previous employer relationships documented',
                  'Relevant professional certifications noted',
                  'Sanctions screening against OFAC, EU, and UN watchlists',
                ],
              },
              {
                title: 'Conflict of Interest Screening',
                items: [
                  'Disclosure of all current board seats, advisory roles, and consulting agreements',
                  'Identification of any equity holdings in companies to be discussed',
                  'Confidentiality agreement review — experts cannot discuss matters covered by active NDAs',
                  'Cooling-off period enforced for recently departed executives',
                ],
              },
              {
                title: 'MNPI Attestation Process',
                items: [
                  'Pre-engagement MNPI declaration signed by expert',
                  'Call screened in real time for inadvertent disclosure triggers',
                  'Post-call MNPI attestation reconfirming no material non-public information was shared',
                  'Transcript withheld if any MNPI risk is identified during review',
                ],
              },
              {
                title: 'Ongoing Expert Obligations',
                items: [
                  'Experts are briefed on permitted and prohibited topics before each call',
                  'Expert Code of Conduct governs all engagements',
                  'Experts may withdraw or request redaction of any statement post-call',
                  'Repeat experts re-screened for conflicts before each new engagement',
                ],
              },
            ].map((card) => (
              <div key={card.title} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <h3 className="mb-3 text-[14px] font-semibold text-[var(--ink)]">{card.title}</h3>
                <ul className="space-y-2">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[13px] leading-[1.6] text-[var(--ink-2)]">
                      <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-[var(--accent-border)] bg-[var(--accent-tint)] p-5">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">
              MNPI Certificate
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--accent)]">
              Every published transcript includes an MNPI Screening Certificate. This document records the expert&apos;s pre- and post-call attestations, the reviewer&apos;s clearance decision, and any redactions made before publication. Clients may cite this certificate in compliance documentation.
            </p>
            <p className="mt-3 font-mono text-[11px] text-[var(--accent)] opacity-80">
              Citation format: &ldquo;Expert call, [Sector], via Transcript IQ, [Date] — MNPI Certificate available on request&rdquo;
            </p>
          </div>
        </section>

        {/* ── Pillar 2: Client Compliance ───────────────────────────────────── */}
        <section>
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)]">
              <Building2 className="h-5 w-5 text-[var(--accent)]" />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--mist)]">Pillar 2</p>
              <h2 className="text-[26px] font-semibold tracking-[-0.03em] text-[var(--ink)]">Client Compliance</h2>
            </div>
          </div>

          <p className="mb-6 max-w-[680px] text-[15px] leading-[1.75] text-[var(--ink-2)]">
            Clients accessing Transcript IQ research are responsible for ensuring appropriate use within their own compliance frameworks. Our platform is designed to make this straightforward.
          </p>

          <div className="space-y-4">
            {[
              {
                heading: 'Institutional Access Controls',
                body: 'Transcript IQ is a business-to-business platform accessible via verified corporate email addresses. This control ensures research reaches professional investors and analysts, not retail consumers, and creates a documented audit trail of who accessed what research and when.',
              },
              {
                heading: 'Regulatory Alignment',
                body: 'Our compliance programme is designed with reference to SEC Rule 10b-5 (insider trading prohibition), FCA expert network guidelines (MAR 2016), MAS Guidelines on Prevention of Money Laundering (AML/KYC for expert contributors), and SEBI regulations on use of primary research by fund managers.',
              },
              {
                heading: 'Compliance Documentation',
                body: 'Clients receive the following compliance artefacts with every purchase: (a) MNPI Screening Certificate, (b) Expert Disclosure Summary showing vetting outcome, (c) Watermarked PDF with client organisation identifier for information barrier purposes.',
              },
              {
                heading: 'Compliance Officer Support',
                body: 'Compliance officers at client organisations are welcome to contact our compliance team directly to discuss our expert vetting process, review MNPI screening methodology, or request supporting documentation for internal review. Contact: compliance@transcript-iq.com',
              },
              {
                heading: 'Client Obligations',
                body: 'Clients are required to: (a) use Research Products in accordance with the Terms of Engagement; (b) not distribute Research Products beyond their organisation without written consent; (c) report any suspected MNPI content to their compliance officer and to Transcript IQ immediately; (d) maintain records of research accessed as required by applicable regulations.',
              },
            ].map((item) => (
              <details key={item.heading} className="group rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5">
                  <h3 className="text-[15px] font-semibold text-[var(--ink)]">{item.heading}</h3>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--mist)] transition-transform group-open:rotate-45">
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-3 w-3">
                      <path d="M6 2v8M2 6h8" />
                    </svg>
                  </span>
                </summary>
                <p className="border-t border-[var(--border)] px-5 py-4 text-[14px] leading-[1.7] text-[var(--ink-2)]">
                  {item.body}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* ── Pillar 3: Data Compliance ────────────────────────────────────── */}
        <section>
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)]">
              <Database className="h-5 w-5 text-[var(--accent)]" />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--mist)]">Pillar 3</p>
              <h2 className="text-[26px] font-semibold tracking-[-0.03em] text-[var(--ink)]">Data Compliance &amp; Privacy</h2>
            </div>
          </div>

          <p className="mb-6 max-w-[680px] text-[15px] leading-[1.75] text-[var(--ink-2)]">
            Transcript IQ handles two categories of personal data: expert participant data (within transcripts) and client/user data (platform accounts and orders). Both are governed by strict data protection controls.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <h3 className="mb-4 text-[16px] font-semibold text-[var(--ink)]">Expert Data — PII Redaction</h3>
              <p className="mb-4 text-[13px] leading-[1.65] text-[var(--ink-2)]">
                All published transcripts are fully anonymised before release. Our PII redaction process removes or replaces:
              </p>
              <ul className="space-y-2">
                {[
                  'Expert name and personal identifiers',
                  'Current employer name and team/division',
                  'Personal email addresses and phone numbers',
                  'Geographic identifiers that could identify the individual',
                  'Any company-specific data that was not intended for disclosure',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[12px] leading-[1.6] text-[var(--ink-2)]">
                    <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[12px] text-[var(--mist)]">
                Former titles and roles are retained as they constitute non-identifiable professional context (e.g., &ldquo;Former VP of Supply Chain, Major US Semiconductor OEM&rdquo;).
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <h3 className="mb-4 text-[16px] font-semibold text-[var(--ink)]">Client Data — Platform Privacy</h3>
              <p className="mb-4 text-[13px] leading-[1.65] text-[var(--ink-2)]">
                How we handle your organisation&apos;s data on the platform:
              </p>
              <ul className="space-y-2">
                {[
                  'Corporate email required — no personal Gmail or consumer email',
                  'No sharing of client identities with experts or other clients',
                  'Download logs retained for 5 years for MNPI compliance tracing',
                  'Payment data processed exclusively by Stripe — never stored by us',
                  'Data hosted on AWS ap-southeast-1 (Singapore)',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[12px] leading-[1.6] text-[var(--ink-2)]">
                    <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/privacy"
                className="mt-4 inline-flex text-[12px] text-[var(--accent)] underline underline-offset-4 hover:opacity-80"
              >
                Full Privacy Policy →
              </Link>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-6">
            <h3 className="mb-4 text-[15px] font-semibold text-[var(--ink)]">Data Retention Schedule</h3>
            <div className="overflow-hidden rounded-lg border border-[var(--border)]">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--surface)]">
                    <th className="px-4 py-3 text-left font-semibold text-[var(--ink)]">Category</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--ink)]">Retention</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--ink)]">Basis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {[
                    ['Expert attestation records', '7 years', 'MNPI/regulatory'],
                    ['Client transaction records', '7 years', 'Tax obligation'],
                    ['Download access logs', '5 years', 'MNPI tracing'],
                    ['Expert call recordings (raw)', '90 days post-publication', 'Quality review'],
                    ['Marketing data', 'Until unsubscribed', 'Consent'],
                  ].map(([cat, ret, basis]) => (
                    <tr key={cat}>
                      <td className="px-4 py-3 text-[var(--ink-2)]">{cat}</td>
                      <td className="px-4 py-3 font-mono text-[var(--ink)]">{ret}</td>
                      <td className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--mist)]">{basis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Contact Compliance Team ────────────────────────────────────── */}
        <section className="rounded-2xl border border-[var(--accent-border)] bg-[var(--accent-tint)] p-8">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--accent)]">
                Compliance Team
              </p>
              <h3 className="mb-2 text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)]">
                Questions about our framework?
              </h3>
              <p className="max-w-[480px] text-[14px] leading-relaxed text-[var(--ink-2)]">
                Our compliance team is available to answer questions from compliance officers, legal counsel, and institutional due diligence teams. We welcome scrutiny.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <a
                href="mailto:compliance@transcript-iq.com"
                className="inline-flex items-center gap-2 rounded-[10px] bg-btn-primary px-5 py-3 text-[13px] font-semibold text-btn-primary-fg shadow-cta transition-all duration-base ease-out hover:-translate-y-px hover:bg-btn-primary-hover"
              >
                compliance@transcript-iq.com
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-[10px] border border-[var(--border-2)] px-5 py-3 text-[13px] font-medium text-[var(--ink-2)] transition-all duration-base ease-out hover:border-[var(--accent-border)] hover:text-[var(--ink)]"
              >
                Contact Form
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
