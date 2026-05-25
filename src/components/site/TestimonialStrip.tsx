// src/components/site/TestimonialStrip.tsx
export function TestimonialStrip() {
  const quotes = [
    {
      text: "We used Transcript IQ to anchor our pre-CIM diligence on a mid-market industrials deal. Having verbatim VP-level perspectives in under 24 hours changed how we prepped for management meetings.",
      role: "Principal, Private Equity — North America",
    },
    {
      text: "The earnings analyses are exactly what you'd produce internally — but same-day and at a fraction of the cost. We've made it our standard for post-earnings read-throughs.",
      role: "Portfolio Manager, Long/Short Equity — London",
    },
    {
      text: "No subscription means we can access primary research on a deal-by-deal basis without committing to an annual platform. For a boutique like ours, that's a real advantage.",
      role: "Associate, Strategy Consulting — Singapore",
    },
  ]

  return (
    <section className="border-t border-[var(--border)] bg-[var(--surface-2)]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-10 py-14">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--mist)] mb-8 text-center">
          Trusted by buy-side professionals
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quotes.map((q, i) => (
            <div
              key={i}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 flex flex-col gap-4"
            >
              <svg viewBox="0 0 24 18" fill="none" className="h-5 w-5 text-[var(--accent)] opacity-50 shrink-0">
                <path
                  d="M0 18V10.8C0 4.8 3.6.6 10.8 0v3.6C7.2 4.2 5.4 6.6 5.4 9.6H9V18H0zm13.2 0V10.8C13.2 4.8 16.8.6 24 0v3.6c-3.6.6-5.4 3-5.4 6H22.2V18H13.2z"
                  fill="currentColor"
                />
              </svg>
              <p className="text-[14px] leading-[1.65] text-[var(--ink-2)] flex-1">
                &ldquo;{q.text}&rdquo;
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--mist)]">
                — {q.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
