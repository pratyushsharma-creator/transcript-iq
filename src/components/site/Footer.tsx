import Link from 'next/link'
import { ComplianceBadgePill } from '../blocks/shared/ComplianceBadgePill'

const FOOTER_COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Transcript Library', href: '/expert-transcripts' },
      { label: 'Earnings Analysis', href: '/earnings-analysis' },
      { label: 'Custom Reports', href: '/custom-reports' },
      { label: 'Free Transcript', href: '/free-transcript' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/resources' },
      { label: 'How to Use Transcripts', href: '/how-to-use' },
      { label: 'Why Primary Research Wins', href: '/why-primary-research-wins' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Compliance', href: '/compliance' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Contact', href: '/contact' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="hairline-mint absolute inset-x-0 top-0 opacity-40" />
      <div className="mx-auto w-full max-w-[1240px] px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,_1fr)]">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-mint-500 to-mint-300 text-mint-900 shadow-cta"
              >
                <span className="font-mono text-[11px] font-semibold tracking-tight">T</span>
              </span>
              <span className="font-sans text-[15px] font-medium tracking-tight text-[var(--ink)]">
                Transcript IQ
              </span>
            </div>
            <p className="max-w-sm text-[13px] leading-relaxed text-[var(--ink-2)]">
              Expert call transcripts on demand. MNPI-screened, PII-redacted, and ready for your next investment decision. No subscription required.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <ComplianceBadgePill value="mnpi-screened" size="xs" />
              <ComplianceBadgePill value="pii-redacted" size="xs" />
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--mist)]">
              By Nextyn Advisory · Singapore · Mumbai · Bangalore · Jakarta
            </p>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title} className="space-y-4">
              <h4 className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--mist)]">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-[var(--ink-2)] transition-colors duration-fast hover:text-[var(--accent)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-[var(--border)] pt-8 text-[12px] text-[var(--mist)] sm:flex-row sm:items-center">
          <span className="font-mono">© 2026 Transcript IQ · All rights reserved</span>
          <span className="font-mono">Every transcript is MNPI-screened and PII-redacted.</span>
        </div>
      </div>
    </footer>
  )
}
