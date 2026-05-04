import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Clock, Calendar } from 'lucide-react'
import { canonical } from '@/lib/seo/metadata'

export const metadata: Metadata = {
  title: 'Why Primary Research Beats Public Sources',
  description:
    'Public research is a shared starting point. Expert call transcripts capture the practitioner knowledge layer between public data and regulated insider information.',
  alternates: { canonical: canonical('/why-primary-research-wins') },
}

const PUBLISHED = 'April 2026'
const READ_TIME = '8 min read'

export default function WhyPrimaryResearchWinsPage() {
  return (
    <div className="mx-auto max-w-[740px] px-6 py-16">

      {/* Back nav */}
      <Link
        href="/resources"
        className="mb-10 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--mist)] transition-colors hover:text-[var(--accent)]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Resources
      </Link>

      {/* Article header */}
      <header className="mb-12">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-md border border-[var(--accent-border)] bg-[var(--accent-tint)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--accent)]">
            Research Intelligence
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--mist)]">
            <Calendar className="h-3 w-3" />
            {PUBLISHED}
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--mist)]">
            <Clock className="h-3 w-3" />
            {READ_TIME}
          </span>
        </div>
        <h1 className="mb-5 text-[42px] font-bold leading-[1.1] tracking-[-0.04em] text-[var(--ink)] text-balance">
          Why Primary Research Wins
        </h1>
        <p className="text-[18px] leading-[1.65] text-[var(--ink-2)]">
          Secondary research tells you what happened. Primary research tells you <em>why</em> — and what happens next. Here is why the best analysts we know have made direct access to experts a non-negotiable part of their process.
        </p>
      </header>

      {/* Pull quote */}
      <blockquote className="mb-12 rounded-xl border-l-4 border-[var(--accent)] bg-[var(--accent-tint)] p-6">
        <p className="text-[17px] font-medium leading-relaxed text-[var(--ink)] italic">
          &ldquo;Every earnings call is scripted. Every broker note is consensus. The only place left where you can find real signal is a conversation with someone who was actually in the room.&rdquo;
        </p>
        <footer className="mt-3 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--mist)]">
          — Portfolio manager, Asia-focused long/short equity fund
        </footer>
      </blockquote>

      {/* Article body */}
      <div className="prose-article space-y-8 text-[16px] leading-[1.8] text-[var(--ink-2)]">

        <section>
          <h2 className="mb-4 text-[26px] font-semibold tracking-[-0.03em] text-[var(--ink)]">
            The problem with secondary research
          </h2>
          <p>
            The average buy-side analyst at a mid-sized fund today has access to roughly the same Bloomberg terminal, the same broker research, and the same public filings as their closest competitor. The information that drives consensus estimates is genuinely consensual — it has been processed, summarised, and repackaged by dozens of intermediaries before it reaches you.
          </p>
          <p className="mt-4">
            This is not without value. Secondary research provides structure, context, and a baseline. But it cannot generate alpha on its own. When everyone has the same input, the model outputs converge. The edge comes from what consensus does not know — and consensus almost never knows what is happening on the ground.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-[26px] font-semibold tracking-[-0.03em] text-[var(--ink)]">
            What &ldquo;primary&rdquo; actually means
          </h2>
          <p>
            Primary research is direct conversation with people who have operational knowledge that is not yet reflected in public information. Not sell-side analysts recapping management presentations. Not aggregated survey data. Not an AI summary of 10-K filings.
          </p>
          <p className="mt-4">
            The most valuable form is the expert interview: a structured conversation with a former VP of Supply Chain, an ex-country manager, a recently retired chief procurement officer. These people know where the bodies are buried. They know which metrics management publishes versus which metrics they actually run the business on. They know what a competitor&apos;s new factory really means for lead times, because they&apos;ve lived through one.
          </p>
          <p className="mt-4">
            Their knowledge has a half-life, but it is long enough to matter for an investment thesis that plays out over 18 months.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-[26px] font-semibold tracking-[-0.03em] text-[var(--ink)]">
            The three types of insight only experts provide
          </h2>

          <div className="mt-5 space-y-4">
            {[
              {
                n: '01',
                title: 'Verification of narrative',
                body: 'Management teams are incentivised to tell a compelling story. Experts verify whether the operational reality supports it. A company claiming to be the low-cost producer in a market segment — an ex-operations head from a competitor can tell you in fifteen minutes whether that is structurally credible or not.',
              },
              {
                n: '02',
                title: 'Early cycle signals',
                body: 'Supply chain disruptions, pricing inflections, customer concentration shifts — these are felt at the operational level months before they appear in reported numbers. An ex-procurement head at a key supplier can tell you that contract renegotiations are underway before any of it shows in a quarterly filing.',
              },
              {
                n: '03',
                title: 'Calibrated uncertainty',
                body: 'Expert interviews do not just tell you what is true — they help you understand the bounds of your uncertainty. After a good expert call, you may still not know the answer to a critical question. But you know which questions matter, which assumptions are load-bearing, and which pieces of conventional wisdom are folklore.',
              },
            ].map((item) => (
              <div key={item.n} className="flex gap-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <span className="mt-0.5 shrink-0 font-mono text-[24px] font-bold leading-none text-[var(--accent)] opacity-40">
                  {item.n}
                </span>
                <div>
                  <h3 className="mb-2 text-[16px] font-semibold text-[var(--ink)]">{item.title}</h3>
                  <p className="text-[14px] leading-[1.7]">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-[26px] font-semibold tracking-[-0.03em] text-[var(--ink)]">
            The compliance objection
          </h2>
          <p>
            The most common reason analysts give for not using expert networks is compliance friction. The MNPI risk, the time to vet experts, the documentation burden — it has historically made primary research expensive and slow.
          </p>
          <p className="mt-4">
            This is a legitimate concern. The SEC and FCA have made clear that expert networks which allow the flow of material non-public information create significant liability for both the network and the client. The cases brought against several prominent expert networks over the past decade are a serious reminder.
          </p>
          <p className="mt-4">
            But the compliance risk is manageable with the right process, not by avoiding primary research altogether. MNPI risk comes from asking the wrong questions of the wrong people. A well-structured expert interview with a properly vetted former employee, asking industry-level questions rather than company-specific current information, is a compliant and valuable activity.
          </p>
          <p className="mt-4">
            The transcript-based model reduces this friction substantially. When an interview is conducted, MNPI-screened by a compliance team, PII-redacted, and delivered as a certified document — the client firm receives all the insight with a fraction of the compliance overhead. The vetting has already happened. The documentation already exists.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-[26px] font-semibold tracking-[-0.03em] text-[var(--ink)]">
            The cost argument is backwards
          </h2>
          <p>
            The traditional objection to primary research platforms is cost: premium subscription pricing that is hard to justify for a small team or when research budgets are under pressure.
          </p>
          <p className="mt-4">
            But consider what consensus costs. Every analyst hour spent reading the same broker notes, synthesising the same public data, and arriving at the same model as everyone else is an hour that generates no differentiation. If primary research adds one basis point of alpha per quarter on a $500M fund, the economics are obvious. The question is not whether primary research is worth the cost — it is whether the cost structure is accessible enough to make it part of a repeatable process.
          </p>
          <p className="mt-4">
            Pay-per-download changes this equation. Instead of committing to an annual platform fee before knowing whether the research universe covers your sectors, you pay for what you use. A $349 transcript that informs a position sizing decision on a $10M holding has a very calculable break-even.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-[26px] font-semibold tracking-[-0.03em] text-[var(--ink)]">
            How to make it a process, not an event
          </h2>
          <p>
            The analysts who generate the most value from primary research treat it as an ongoing input to their process, not a tool they reach for when a thesis is stuck. Practically, this means:
          </p>
          <ul className="mt-4 space-y-2 pl-5">
            {[
              'Building a topic calendar aligned to your coverage sectors, not just reacting to news flow',
              'Using earnings season to generate questions for expert calls, not just to update models',
              'Systematically reading transcripts from adjacent sectors to spot cross-industry dynamics early',
              'Using expert calls to stress-test, not just confirm — find the bear case from someone who knows the industry',
              'Documenting expert call insights in a knowledge base so institutional knowledge compounds over time',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[15px] leading-[1.7]">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-[26px] font-semibold tracking-[-0.03em] text-[var(--ink)]">
            The bottom line
          </h2>
          <p>
            Markets are more efficient than they were a decade ago. The low-hanging fruit of public data arbitrage is largely gone. What remains is the interpretive gap between what is knowable and what consensus knows — and the most reliable way to close that gap is through direct access to people with operational expertise.
          </p>
          <p className="mt-4">
            Primary research is not a silver bullet. It requires rigorous framing of questions, proper expert selection, and careful integration with quantitative work. But it is the one input in the research stack that has not been commoditised by the same technology that commoditised everything else.
          </p>
          <p className="mt-4">
            The analyst who combines the same public data as their peers with a single well-chosen expert call is not working harder. They are working differently. And in a world where the edge is scarce, different is all that matters.
          </p>
        </section>

      </div>

      {/* CTA block */}
      <div className="mt-16 rounded-2xl border border-[var(--accent-border)] bg-[var(--accent-tint)] p-8 text-center">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--accent)]">
          Ready to add primary research to your process?
        </p>
        <h3 className="mb-3 text-[24px] font-bold tracking-[-0.03em] text-[var(--ink)]">
          Get your first transcript free.
        </h3>
        <p className="mb-6 text-[14px] leading-relaxed text-[var(--ink-2)]">
          Tell us your sector and we&apos;ll match you with a relevant MNPI-screened expert call transcript at no cost.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/free-transcript"
            className="group inline-flex items-center gap-2 rounded-[10px] bg-btn-primary px-6 py-3 text-[14px] font-semibold text-btn-primary-fg shadow-cta transition-all duration-base ease-out hover:-translate-y-px hover:bg-btn-primary-hover"
          >
            Get Free Transcript
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/expert-transcripts"
            className="inline-flex items-center gap-2 rounded-[10px] border border-[var(--border-2)] px-6 py-3 text-[14px] font-medium text-[var(--ink-2)] transition-all duration-base ease-out hover:border-[var(--accent-border)] hover:text-[var(--ink)]"
          >
            Browse Transcripts
          </Link>
        </div>
      </div>

    </div>
  )
}
