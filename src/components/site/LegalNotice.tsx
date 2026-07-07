interface LegalNoticeProps {
  /**
   * When true, renders as a self-contained full-width strip with its own top
   * border, background, and container padding — for pages that suppress the
   * global site Footer and render their own (e.g. the EV report landing).
   * When false (default), renders just the text block, meant to sit inside an
   * existing footer container that already provides the divider/padding.
   */
  standalone?: boolean
}

/**
 * EU ad platforms (Taboola, Google, Meta) require a crawlable legal imprint —
 * operating entity, registered address, company registration number, and
 * direct contact — published on the advertised page. This is that block, kept
 * in one place so every surface stays in sync.
 */
export function LegalNotice({ standalone = false }: LegalNoticeProps) {
  const body = (
    <div className="space-y-1.5 text-[11px] leading-relaxed text-[var(--mist)]">
      <p className="font-mono text-[10px] uppercase tracking-[0.12em]">Legal Notice / Impressum</p>
      <p>
        Transcript IQ is operated by{' '}
        <span className="text-[var(--ink-2)]">Nextyn Advisory Private Limited</span>, 32 Madhuban
        Industrial Estate, Mahakali Caves Road, Andheri (East), Mumbai, Maharashtra 400093, India.
      </p>
      <p>
        Corporate Identity Number (CIN): U74999MH2018PTC304669 · Represented by Rasesh Seth,
        Director.
      </p>
      <p>
        Contact:{' '}
        <a
          href="mailto:info@nextyn.com"
          className="transition-colors duration-fast hover:text-[var(--accent)]"
        >
          info@nextyn.com
        </a>
        {' · '}
        <a
          href="tel:+919819736520"
          className="transition-colors duration-fast hover:text-[var(--accent)]"
        >
          +91 98197 36520
        </a>
      </p>
    </div>
  )

  if (standalone) {
    return (
      <section className="border-t border-[var(--border)] bg-[var(--bg)]">
        <div className="mx-auto w-full max-w-[1240px] px-6 py-8">{body}</div>
      </section>
    )
  }

  return body
}
