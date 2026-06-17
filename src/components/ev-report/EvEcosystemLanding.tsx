'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import {
  ArrowRight,
  FileText,
  Users,
  CheckCircle2,
  ShieldCheck,
  Plus,
  Factory,
  Sun,
  PlugZap,
} from 'lucide-react'
import { EV_REPORT, STATS, EXPERTS, FAQS } from '@/lib/ev-report/content'
import { useCart } from '@/context/CartContext'
import { trackEvent } from '@/lib/analytics/events'
import { AnalystLeadForm } from './AnalystLeadForm'

const INVOICE_EMAIL = 'hatim.janjali@nextyn.com'
const FAQ_CONTACT_EMAIL = 'info@nextyn.com'

// Role-specific icons, one per expert (Audi → gigafactory, Sunlight → energy, E-GAP → charging)
const EXPERT_ICONS = [Factory, Sun, PlugZap]

const REPORT_CART_ITEM = {
  id: 'ev-ecosystem-report',
  slug: 'ev-ecosystem-report',
  type: 'report' as const,
  title: 'Can Europe Win the EV Ecosystem? — Research Report',
  priceUsd: EV_REPORT.priceUsd,
  originalPriceUsd: EV_REPORT.originalPriceUsd,
}

function fmt(n: number) {
  return n.toLocaleString('en-US')
}

// Illustrative strike-through: a diagonal line drawn over the old price (no font-size change)
function OldPrice({ className = '' }: { className?: string }) {
  return (
    <span className={`relative inline-block text-[var(--mist)] ${className}`}>
      ${fmt(EV_REPORT.originalPriceUsd)}
      <span
        aria-hidden
        className="pointer-events-none absolute left-[-3px] right-[-3px] top-1/2 h-[2px] -translate-y-1/2 -rotate-[12deg] rounded-full bg-[#E24B4A]"
      />
    </span>
  )
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
}

const PRIMARY_CTA =
  'group inline-flex items-center justify-center gap-2 rounded-[11px] bg-btn-primary px-7 py-3.5 text-[15px] font-semibold text-btn-primary-fg shadow-cta transition-all duration-200 hover:-translate-y-px hover:bg-btn-primary-hover'
const SECONDARY_CTA =
  'inline-flex items-center justify-center gap-2 rounded-[11px] border border-[var(--border-2)] px-6 py-3.5 text-[15px] font-medium text-[var(--ink-2)] transition-all duration-200 hover:-translate-y-px hover:border-[var(--border)] hover:bg-[var(--surface-2)]'

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-border)] bg-[var(--accent-tint)] px-3.5 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
      <span className="relative inline-flex h-1.5 w-1.5">
        <span className="absolute inset-0 rounded-full bg-[var(--accent)] animate-pulse-soft" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
      </span>
      {children}
    </div>
  )
}

export function EvEcosystemLanding() {
  const { addItem, openCart } = useCart()
  const [openFaq, setOpenFaq] = useState<Set<number>>(new Set([0]))
  const firedDepth = useRef<{ d50: boolean; d90: boolean }>({ d50: false, d90: false })

  useEffect(() => {
    trackEvent('view_item', { item_name: 'ev-ecosystem-report', price: EV_REPORT.priceUsd })
  }, [])

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - doc.clientHeight
      if (scrollable <= 0) return
      const pct = (doc.scrollTop / scrollable) * 100
      if (!firedDepth.current.d50 && pct >= 50) {
        firedDepth.current.d50 = true
        trackEvent('scroll_depth_50', { page: 'ev-report' })
      }
      if (!firedDepth.current.d90 && pct >= 90) {
        firedDepth.current.d90 = true
        trackEvent('scroll_depth_90', { page: 'ev-report' })
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function toggleFaq(i: number) {
    setOpenFaq((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  function scrollToAnalyst(location: string) {
    trackEvent('click_talk_analyst', { location })
    document.getElementById('analyst')?.scrollIntoView({ behavior: 'smooth' })
  }

  function handleBuy(location: string) {
    trackEvent('click_buy_report', { location })
    addItem(REPORT_CART_ITEM)
    openCart()
  }

  const topFaqs = FAQS.slice(0, 5)

  return (
    <div className="bg-[var(--bg)] text-[var(--ink)]">
      {/* ── Section 1 — Hero (checkered grid background) ──────────────────── */}
      <section className="bg-variant-mesh border-b border-[var(--border)]">
        <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Eyebrow>{EV_REPORT.publisher}</Eyebrow>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06 }}
            className="mt-6 max-w-4xl text-[40px] font-semibold leading-[1.04] tracking-[-0.04em] text-[var(--ink)] sm:text-[64px]"
          >
            {EV_REPORT.headline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--ink-2)]"
          >
            {EV_REPORT.subhead}
          </motion.p>

          <motion.ul
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="mt-7 grid max-w-2xl gap-x-8 gap-y-3 sm:grid-cols-2"
          >
            {EV_REPORT.benefits.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-sm text-[var(--ink-2)]">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" aria-hidden />
                <span className="text-pretty">{b}</span>
              </li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.28 }}
            className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4"
          >
            <div className="flex items-baseline gap-3">
              <OldPrice className="text-lg" />
              <span className="text-3xl font-semibold text-[var(--ink)]">${fmt(EV_REPORT.priceUsd)}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => handleBuy('hero')} className={PRIMARY_CTA}>
                Buy the Report — ${fmt(EV_REPORT.priceUsd)}
              </button>
              <button onClick={() => scrollToAnalyst('hero')} className={SECONDARY_CTA}>
                Talk to Our Research Analyst <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.38 }}
            className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--mist)]"
          >
            {EV_REPORT.trustBar.map((item, i) => (
              <span key={item} className="flex items-center gap-3">
                {i > 0 && <span className="text-[var(--border-2)]">·</span>}
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Section 2 — Who you're hearing from (credibility first) ───────── */}
      <section className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <motion.h2 {...fadeUp} className="text-3xl font-semibold tracking-[-0.03em] text-[var(--ink)] sm:text-4xl">
            Who you&rsquo;re hearing from
          </motion.h2>
          <motion.p {...fadeUp} className="mt-4 max-w-2xl text-[var(--ink-2)]">
            Three practitioners who ran gigafactory ramps, built charging networks, and commercialised
            energy-platform software — not analysts modelling from the outside.
          </motion.p>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {EXPERTS.map((e, i) => {
              const Icon = EXPERT_ICONS[i] ?? Factory
              return (
                <motion.div
                  key={e.title}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: i * 0.05 }}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-6"
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--accent-border)] bg-[var(--accent-tint)] text-[var(--accent)]">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="mt-4 font-semibold text-[var(--ink)]">{e.title}</h3>
                  <p className="mt-2 text-sm text-[var(--ink-2)]">{e.domain}</p>
                </motion.div>
              )
            })}
          </div>

          <motion.p {...fadeUp} className="mt-8 flex items-center gap-2 text-sm text-[var(--mist)]">
            <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden />
            Expert identities are not disclosed publicly to protect professional relationships. Verified credentials
            are available to qualified buyers on request.
          </motion.p>
        </div>
      </section>

      {/* ── Section 3 — What you're actually buying (+ Buy CTA) ───────────── */}
      <section className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[var(--ink)] sm:text-4xl">
              What you&rsquo;re actually buying
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-[var(--ink-2)]">
              Not a macro overview. A {EV_REPORT.pages}-page read on the questions practitioners actually argue about —
              each answered with first-hand citation, so you can act on it.
            </p>
          </motion.div>

          <motion.div {...fadeUp} className="mt-12">
            <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
              The questions it answers
            </h3>
            <ul className="mt-5 grid gap-x-10 gap-y-4 sm:grid-cols-2">
              {FAQS.slice(0, 6).map((f, i) => (
                <li key={f.question} className="flex gap-3 text-[var(--ink-2)]">
                  <span className="font-mono text-sm text-[var(--accent)]">{String(i + 1).padStart(2, '0')}</span>
                  <span>{f.question}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...fadeUp} className="mt-10">
            <button onClick={() => handleBuy('about')} className={PRIMARY_CTA}>
              Buy the Report — ${fmt(EV_REPORT.priceUsd)}
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Section 4 — Hard Facts Teaser (6 stats) ──────────────────────── */}
      <section className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <motion.h2 {...fadeUp} className="text-3xl font-semibold tracking-[-0.03em] text-[var(--ink)] sm:text-4xl">
            The numbers the consensus is getting wrong
          </motion.h2>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {STATS.map((s, i) => (
              <motion.div
                key={s.value}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: (i % 3) * 0.05 }}
                className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-6"
              >
                <div className="font-mono text-4xl font-semibold tracking-tight text-[var(--accent)]">{s.value}</div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--ink-2)]">{s.interpretation}</p>
              </motion.div>
            ))}
          </div>

          <motion.p {...fadeUp} className="mt-8 max-w-2xl text-[var(--ink-2)]">
            These are direct expert citations, not market estimates. The full picture — and what it means for where
            capital goes next — is in the report.
          </motion.p>
        </div>
      </section>

      {/* ── Section 5 — FAQ (mirrors the homepage accordion design) ───────── */}
      <section className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="grid items-start gap-12 lg:grid-cols-[320px_1fr] lg:gap-20">
            {/* LEFT — heading + contact prompt (sticky) */}
            <motion.div {...fadeUp} className="lg:sticky lg:top-24">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]">FAQ</span>
              <h2 className="mt-3 text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--ink)] sm:text-[32px]">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-[14px] leading-relaxed text-[var(--ink-2)]">
                The report&rsquo;s position on each contested question. The evidence and implications for capital are in
                the full {EV_REPORT.pages} pages.
              </p>
              <div className="mt-8 flex flex-col gap-1">
                <span className="text-[13px] text-[var(--mist)]">Still have questions?</span>
                <a
                  href={`mailto:${FAQ_CONTACT_EMAIL}`}
                  className="font-mono text-[13px] tracking-[0.05em] text-[var(--accent)] transition-opacity hover:opacity-80"
                >
                  {FAQ_CONTACT_EMAIL} →
                </a>
              </div>
            </motion.div>

            {/* RIGHT — accordion list */}
            <motion.div
              {...fadeUp}
              className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]"
            >
              {topFaqs.map((f, i) => {
                const isOpen = openFaq.has(i)
                return (
                  <div
                    key={f.question}
                    className={`transition-colors duration-base ${isOpen ? 'bg-[var(--surface-2)]' : 'bg-[var(--surface)]'} ${
                      i < topFaqs.length - 1 ? 'border-b border-[var(--border)]' : ''
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 px-7 py-6 text-left"
                    >
                      <h3 className="text-[16px] font-medium leading-snug tracking-[-0.005em] text-[var(--ink)]">
                        {f.question}
                      </h3>
                      <span
                        className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--accent-border)] bg-[var(--accent-tint)] text-[var(--accent)] transition-transform duration-base ${
                          isOpen ? 'rotate-45' : ''
                        }`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </span>
                    </button>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="-mt-1 px-7 pb-6"
                      >
                        <p className="text-[14px] leading-relaxed text-[var(--ink-2)]">{f.answer}</p>
                      </motion.div>
                    )}
                  </div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Section 6 — Pricing & Purchase ───────────────────────────────── */}
      <section className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <motion.div {...fadeUp} className="text-center">
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[var(--ink)] sm:text-4xl">
              One report. The whole argument.
            </h2>
          </motion.div>

          <motion.div
            {...fadeUp}
            className="mx-auto mt-10 max-w-xl rounded-2xl border border-[var(--accent-border)] bg-[var(--accent-tint)] p-8"
          >
            <div className="flex items-end justify-center gap-3">
              <OldPrice className="text-2xl" />
              <span className="text-5xl font-semibold text-[var(--ink)]">${fmt(EV_REPORT.priceUsd)}</span>
            </div>
            <p className="mt-2 text-center font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--mist)]">
              One-time · Single-user licence
            </p>

            <ul className="mx-auto mt-8 max-w-sm space-y-3">
              {[
                `The full ${EV_REPORT.pages}-page research report (PDF)`,
                'Data appendix',
                'Every question answered with direct practitioner citation',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[var(--ink-2)]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3">
              <button onClick={() => handleBuy('pricing')} className={`${PRIMARY_CTA} w-full py-4`}>
                Buy the Report
              </button>
              <button onClick={() => scrollToAnalyst('pricing')} className={`${SECONDARY_CTA} w-full py-4`}>
                Talk to Our Research Analyst
              </button>
            </div>
            <p className="mt-4 text-center text-xs text-[var(--mist)]">
              Secure checkout via Stripe. Prefer to be invoiced? Email{' '}
              <a href={`mailto:${INVOICE_EMAIL}`} className="text-[var(--accent)] hover:underline">
                {INVOICE_EMAIL}
              </a>
              .
            </p>
          </motion.div>

          <motion.div
            {...fadeUp}
            className="mx-auto mt-6 max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-6"
          >
            <h3 className="font-semibold text-[var(--ink)]">
              Speak with the practitioner behind it — ${EV_REPORT.consultRateUsd}/hr
            </h3>
            <p className="mt-1.5 text-sm text-[var(--ink-2)]">
              Buy the report, then book time directly with the expert who ran the ramp. Context no PDF can carry.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Section 7 — Research Analyst Lead Form ────────────────────────── */}
      <section id="analyst" className="scroll-mt-20 border-b border-[var(--border)]">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <motion.div {...fadeUp}>
            <div className="mb-3 inline-flex items-center gap-2 text-[var(--accent)]">
              <Users className="h-5 w-5" aria-hidden />
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em]">Talk to the team</span>
            </div>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[var(--ink)] sm:text-4xl">
              Not ready to buy? Talk to the team.
            </h2>
            <p className="mt-4 text-[var(--ink-2)]">
              Our research analyst can walk you through the key findings and answer how this applies to your specific
              context — your portfolio, your platform, your policy question.
            </p>
          </motion.div>

          <motion.div {...fadeUp} className="mt-10">
            <AnalystLeadForm />
          </motion.div>
        </div>
      </section>

      {/* ── Section 8 — Footer close ─────────────────────────────────────── */}
      <section className="bg-[var(--surface)]">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <div className="flex items-center gap-2 text-[var(--ink)]">
            <FileText className="h-5 w-5 text-[var(--accent)]" aria-hidden />
            <span className="font-semibold">{EV_REPORT.publisher}</span>
          </div>
          <p className="mt-3 max-w-xl text-sm text-[var(--mist)]">
            Primary research for people who can&rsquo;t afford to be wrong. Single-user licence. No refunds after
            download. Contact us for team licences.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--mist)]">
            <a href={`mailto:${INVOICE_EMAIL}`} className="hover:text-[var(--accent)]">
              {INVOICE_EMAIL}
            </a>
            <span className="text-[var(--border-2)]">·</span>
            <a href="/privacy" className="hover:text-[var(--accent)]">
              Privacy Policy
            </a>
            <span className="text-[var(--border-2)]">·</span>
            <span>© 2026 {EV_REPORT.publisher}</span>
          </div>
        </div>
      </section>
    </div>
  )
}
