'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Check } from 'lucide-react'
import { SectionShell, SectionHeader, MintGradientHeading } from './SectionShell'

// ─── Shared ───────────────────────────────────────────────────────────────────

const VIEW = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' } as const,
  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
}

function EyebrowBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-border)] bg-[var(--accent-tint)] px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--accent)]">
      <span className="relative inline-flex h-1.5 w-1.5">
        <span className="absolute inset-0 animate-pulse-soft rounded-full bg-[var(--accent)]" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
      </span>
      {children}
    </div>
  )
}

// ─── HowToUseHero ─────────────────────────────────────────────────────────────

type HowToUseHeroBlock = {
  blockType: 'howToUseHero'
  eyebrow?: string
  heading?: string
  subheading?: string
  ctas?: Array<{ label: string; url: string; variant?: string }>
  stats?: Array<{ value: string; suffix?: string; label: string }>
  background?: string
  spacing?: string
  anchorId?: string
}

export function HowToUseHeroRenderer({ block }: { block: HowToUseHeroBlock }) {
  return (
    <SectionShell
      background={block.background as never}
      spacing={block.spacing as never}
      anchorId={block.anchorId}
      contained={false}
    >
      <div aria-hidden className="absolute inset-0 -z-10 bg-hero-grid mask-fade-y opacity-50" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 1000px 500px at 90% -10%, var(--accent-tint-2), transparent 60%), radial-gradient(ellipse 600px 400px at -10% 100%, var(--accent-tint), transparent 60%)',
        }}
      />
      <div className="mx-auto w-full max-w-[1240px] px-6">
        {block.eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <EyebrowBadge>{block.eyebrow}</EyebrowBadge>
          </motion.div>
        )}

        {block.heading && (
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 max-w-[900px] text-[48px] font-semibold leading-[0.96] tracking-[-0.04em] text-[var(--ink)] text-balance sm:text-[64px] lg:text-[80px]"
          >
            <MintGradientHeading text={block.heading} />
          </motion.h1>
        )}

        {block.subheading && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 max-w-[600px] text-[18px] leading-relaxed text-[var(--ink-2)]"
          >
            {block.subheading}
          </motion.p>
        )}

        {block.stats && block.stats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="mt-14 grid max-w-[720px] overflow-hidden rounded-xl border border-[var(--border)]"
            style={{
              gridTemplateColumns: `repeat(${Math.min(block.stats.length, 4)}, 1fr)`,
              gap: '1px',
              background: 'var(--border)',
            }}
          >
            {block.stats.map((s) => (
              <div key={s.label} className="bg-[var(--surface)] px-6 py-5">
                <div className="font-mono text-[22px] font-medium leading-none tracking-[-0.02em] text-[var(--accent)]">
                  {s.value}
                  {s.suffix && (
                    <span className="ml-0.5 text-[14px] text-[var(--mist)]">{s.suffix}</span>
                  )}
                </div>
                <div className="mt-1.5 whitespace-pre-line text-[11px] leading-[1.4] text-[var(--mist)]">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </SectionShell>
  )
}

// ─── TranscriptAnatomy ────────────────────────────────────────────────────────

type TranscriptAnatomyBlock = {
  blockType: 'transcriptAnatomy'
  eyebrow?: string
  heading?: string
  description?: string
  sections?: Array<{ sectionNumber: string; sectionKey: string; title: string; description?: string }>
  background?: string
  spacing?: string
  anchorId?: string
}

function DocMockup({ activeKey }: { activeKey: string }) {
  const base = 'mb-3 rounded-lg border p-3.5 transition-all duration-200'
  const normal = 'border-[var(--border)] bg-[var(--bg)]'
  const highlight = 'border-[var(--accent-border)] bg-[var(--accent-tint)] ring-1 ring-[var(--accent-border)]'

  return (
    <div className="sticky top-20 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      {/* Titlebar */}
      <div className="flex items-center gap-2.5 border-b border-[var(--border)] bg-[var(--surface-2)] px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full" style={{ background: '#FF5F57' }} />
          <div className="h-2.5 w-2.5 rounded-full" style={{ background: '#FFBD2E' }} />
          <div className="h-2.5 w-2.5 rounded-full" style={{ background: '#28C840' }} />
        </div>
        <span className="ml-2 font-mono text-[10px] text-[var(--mist)]">AI-Compute-ASEAN-APAC.pdf</span>
      </div>

      <div className="p-6">
        <div className="mb-4 inline-flex items-center gap-1 rounded-full border border-[var(--accent-border)] bg-[var(--accent-tint)] px-2.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-[0.12em] text-[var(--accent)]">
          Premium · 41min · EXP-198
        </div>
        <div className="mb-4 text-[14px] font-medium leading-snug tracking-[-0.01em] text-[var(--ink)]">
          AI Compute Migration in ASEAN: Shift to AI Infrastructure and the Rise of Sovereign Data Strategies
        </div>
        <div className="mb-5 flex flex-wrap gap-3 border-b border-[var(--border)] pb-4 font-mono text-[10px] text-[var(--mist)]">
          <span>Technology / SaaS</span>
          <span>APAC</span>
          <span>$GOOGL · $AMZN · $AMD</span>
        </div>

        {/* Section 01 — Executive Summary */}
        <div className={`${base} ${activeKey === 'exec' ? highlight : normal}`}>
          <div className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--accent)]">
            01 — Executive Summary
          </div>
          <p className="text-[12px] leading-relaxed text-[var(--ink-2)]">
            ASEAN AI data center expansion is accelerating beyond global consensus estimates. China-driven demand
            shift, power constraint bottlenecks in Singapore, and rising sovereign data requirements are
            structurally repricing the hyperscaler TAM…
          </p>
        </div>

        {/* Section 02 — Verbatim Q&A */}
        <div className={`${base} ${activeKey === 'verbatim' ? highlight : normal}`}>
          <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--accent)]">
            02 — Verbatim Q&A
          </div>
          <div className="space-y-2">
            <div className="flex gap-2.5">
              <span className="mt-0.5 min-w-[48px] font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--mist)]">Analyst</span>
              <p className="text-[11px] leading-relaxed text-[var(--ink-2)]">
                What's the realistic capacity build timeline for Malaysia's new data center corridor?
              </p>
            </div>
            <div className="flex gap-2.5">
              <span className="mt-0.5 min-w-[48px] font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--accent)]">Expert</span>
              <p className="text-[11px] leading-relaxed text-[var(--ink-2)]">
                The{' '}
                <span className="rounded bg-[rgba(251,191,36,0.12)] px-0.5 text-[#FDE68A]">42-month constraint</span>{' '}
                everyone's citing is optimistic. Grid connection alone in JB takes 28–36 months from permit.
              </p>
            </div>
          </div>
        </div>

        {/* Section 03 — Expert Profile */}
        <div className={`${base} ${activeKey === 'profile' ? highlight : normal}`}>
          <div className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--accent)]">
            03 — Expert Profile
          </div>
          <div className="flex items-start gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent-deep)] to-[var(--accent)] font-mono text-[9px] font-semibold text-[#064E3B]">
              EXP
            </div>
            <p className="text-[11px] leading-relaxed text-[var(--ink-2)]">
              Former VP Infrastructure, Tier-1 APAC hyperscaler. 14 years in regional data center strategy.
              Currently an independent advisor.
            </p>
          </div>
        </div>

        {/* Compliance strip */}
        <div
          className={`flex items-center gap-2 rounded-lg border p-3 transition-all duration-200 ${
            activeKey === 'compliance'
              ? 'border-[var(--accent-border)] bg-[var(--accent-tint)] ring-1 ring-[var(--accent-border)]'
              : 'border-[var(--accent-border)] bg-[var(--accent-tint)]'
          }`}
        >
          <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-[var(--accent)]" />
          <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--accent)]">
            MNPI Screened · PII Redacted · Anonymised · Compliant
          </span>
        </div>
      </div>
    </div>
  )
}

export function TranscriptAnatomyRenderer({ block }: { block: TranscriptAnatomyBlock }) {
  const sections = block.sections ?? []
  const [activeKey, setActiveKey] = useState(sections[0]?.sectionKey ?? 'exec')

  return (
    <SectionShell background={block.background as never} spacing={block.spacing as never} anchorId={block.anchorId}>
      <motion.div {...VIEW} className="mb-14">
        {block.eyebrow && <EyebrowBadge>{block.eyebrow}</EyebrowBadge>}
        {block.heading && (
          <h2 className="mt-5 text-[32px] font-medium leading-[1.08] tracking-[-0.03em] text-[var(--ink)] sm:text-[40px]">
            <MintGradientHeading text={block.heading} />
          </h2>
        )}
        {block.description && (
          <p className="mt-4 max-w-[560px] text-[17px] leading-relaxed text-[var(--ink-2)]">
            {block.description}
          </p>
        )}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        {/* Section cards */}
        <div className="flex flex-col gap-1.5">
          {sections.map((item, i) => (
            <motion.button
              key={item.sectionKey}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              type="button"
              onClick={() => setActiveKey(item.sectionKey)}
              className={[
                'relative w-full cursor-pointer overflow-hidden rounded-xl border p-7 text-left transition-all duration-200',
                activeKey === item.sectionKey
                  ? 'border-[var(--accent-border)] bg-gradient-to-br from-[var(--accent-tint)] to-[var(--surface)]'
                  : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent-border)]',
              ].join(' ')}
            >
              <div
                className={[
                  'absolute left-0 top-0 h-full w-0.5 bg-[var(--accent)] transition-opacity duration-200',
                  activeKey === item.sectionKey ? 'opacity-100' : 'opacity-0',
                ].join(' ')}
              />
              <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--mist)]">
                {item.sectionNumber}
              </div>
              <div className="mt-2 text-[17px] font-medium leading-snug tracking-[-0.01em] text-[var(--ink)]">
                {item.title}
              </div>
              {item.description && (
                <div className="mt-2 text-[14px] leading-relaxed text-[var(--ink-2)]">
                  {item.description}
                </div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Doc mockup — desktop only */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:block"
        >
          <DocMockup activeKey={activeKey} />
        </motion.div>
      </div>
    </SectionShell>
  )
}

// ─── ResearchApplications ─────────────────────────────────────────────────────

type ResearchApplicationsBlock = {
  blockType: 'researchApplications'
  eyebrow?: string
  heading?: string
  description?: string
  applications?: Array<{
    number: string
    title: string
    description?: string
    tag?: string
    featured?: boolean
    insights?: Array<{ label: string; percentage?: number }>
  }>
  background?: string
  spacing?: string
  anchorId?: string
}

export function ResearchApplicationsRenderer({ block }: { block: ResearchApplicationsBlock }) {
  const apps = block.applications ?? []

  return (
    <SectionShell background={block.background as never} spacing={block.spacing as never} anchorId={block.anchorId}>
      <motion.div {...VIEW} className="mb-14">
        {block.eyebrow && <EyebrowBadge>{block.eyebrow}</EyebrowBadge>}
        {block.heading && (
          <h2 className="mt-5 text-[32px] font-medium leading-[1.08] tracking-[-0.03em] text-[var(--ink)] sm:text-[40px]">
            <MintGradientHeading text={block.heading} />
          </h2>
        )}
        {block.description && (
          <p className="mt-4 max-w-[560px] text-[17px] leading-relaxed text-[var(--ink-2)]">
            {block.description}
          </p>
        )}
      </motion.div>

      <div className="grid grid-cols-12 gap-3">
        {apps.map((app, i) => {
          const colSpan = app.featured ? 'col-span-12 lg:col-span-7' : getColSpan(apps, i)
          return (
            <motion.div
              key={app.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className={[
                colSpan,
                'relative overflow-hidden rounded-xl border p-8 transition-all duration-200 hover:-translate-y-0.5',
                app.featured
                  ? 'border-[var(--accent-border)] bg-gradient-to-br from-[var(--accent-tint-2)] to-[var(--surface)]'
                  : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-2)]',
              ].join(' ')}
            >
              {app.featured && (
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px opacity-60"
                  style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }}
                />
              )}
              <div className="font-mono text-[11px] tracking-[0.1em] text-[var(--mist)]">{app.number}</div>
              <h3 className="mt-4 text-[20px] font-medium leading-snug tracking-[-0.02em] text-[var(--ink)]">
                {app.title}
              </h3>
              {app.description && (
                <p className="mt-3 text-[14px] leading-relaxed text-[var(--ink-2)]">{app.description}</p>
              )}

              {app.insights && app.insights.length > 0 ? (
                <div className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4">
                  <div className="mb-3 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--mist)]">
                    Insight signal strength
                  </div>
                  <div className="space-y-2.5">
                    {app.insights.map((ins) => (
                      <div key={ins.label} className="flex items-center gap-2.5">
                        <span className="min-w-[120px] text-[11px] text-[var(--ink-2)]">{ins.label}</span>
                        <div className="h-0.5 flex-1 overflow-hidden rounded-full bg-[var(--surface-2)]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[var(--accent-deep)] to-[var(--accent)]"
                            style={{ width: `${ins.percentage ?? 0}%` }}
                          />
                        </div>
                        <span className="min-w-[28px] text-right font-mono text-[10px] text-[var(--accent)]">
                          {ins.percentage ?? 0}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : app.tag ? (
                <div className="mt-4 inline-flex items-center gap-1 rounded bg-[var(--accent-tint)] px-2 py-1 font-mono text-[10px] tracking-[0.06em] text-[var(--accent)]">
                  {app.tag}
                </div>
              ) : null}
            </motion.div>
          )
        })}
      </div>
    </SectionShell>
  )
}

function getColSpan(apps: ResearchApplicationsBlock['applications'], idx: number): string {
  if (!apps) return 'col-span-12'
  const featuredIdx = apps.findIndex((a) => a.featured)
  // The tile immediately after the featured one shares its row (7 + 5 = 12)
  if (featuredIdx !== -1 && idx === featuredIdx + 1) return 'col-span-12 lg:col-span-5'
  return 'col-span-12 lg:col-span-4'
}

// ─── WorkflowSteps ────────────────────────────────────────────────────────────

type WorkflowStepsBlock = {
  blockType: 'workflowSteps'
  eyebrow?: string
  heading?: string
  description?: string
  steps?: Array<{
    stepNumber: string
    title: string
    subtitle?: string
    panelHeading?: string
    panelBody?: string
    tipsLabel?: string
    tips?: Array<{ tip: string }>
  }>
  background?: string
  spacing?: string
  anchorId?: string
}

export function WorkflowStepsRenderer({ block }: { block: WorkflowStepsBlock }) {
  const steps = block.steps ?? []
  const [activeStep, setActiveStep] = useState(0)
  const step = steps[activeStep]

  return (
    <SectionShell background={block.background as never} spacing={block.spacing as never} anchorId={block.anchorId}>
      <motion.div {...VIEW} className="mb-12">
        {block.eyebrow && <EyebrowBadge>{block.eyebrow}</EyebrowBadge>}
        {block.heading && (
          <h2 className="mt-5 text-[32px] font-medium leading-[1.08] tracking-[-0.03em] text-[var(--ink)] sm:text-[40px]">
            <MintGradientHeading text={block.heading} />
          </h2>
        )}
        {block.description && (
          <p className="mt-4 max-w-[560px] text-[17px] leading-relaxed text-[var(--ink-2)]">
            {block.description}
          </p>
        )}
      </motion.div>

      {/* Tab bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="mb-4 overflow-x-auto"
      >
        <div className="flex min-w-max overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          {steps.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveStep(i)}
              className={[
                'relative flex-1 border-r border-[var(--border)] px-5 py-4 text-left transition-colors duration-150 last:border-r-0',
                activeStep === i
                  ? 'bg-gradient-to-b from-[var(--accent-tint)] to-transparent'
                  : 'hover:bg-[var(--surface-2)]',
              ].join(' ')}
            >
              {activeStep === i && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--accent)]" />
              )}
              <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--mist)]">
                {s.stepNumber}
              </div>
              <div className="mt-1.5 text-[13px] font-medium leading-snug tracking-[-0.01em] text-[var(--ink)]">
                {s.title}
              </div>
              {s.subtitle && (
                <div className="mt-0.5 hidden text-[11px] text-[var(--mist)] sm:block">{s.subtitle}</div>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Panel */}
      {step && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="grid gap-10 p-9 lg:grid-cols-2 lg:gap-14"
            >
              <div>
                {step.panelHeading && (
                  <h3 className="text-[24px] font-medium leading-snug tracking-[-0.025em] text-[var(--ink)]">
                    {step.panelHeading}
                  </h3>
                )}
                {step.panelBody && (
                  <p className="mt-4 text-[15px] leading-relaxed text-[var(--ink-2)]">{step.panelBody}</p>
                )}
              </div>
              {step.tips && step.tips.length > 0 && (
                <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-5">
                  {step.tipsLabel && (
                    <div className="mb-3 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--accent)]">
                      {step.tipsLabel}
                    </div>
                  )}
                  <ul className="space-y-3">
                    {step.tips.map((t, j) => (
                      <li key={j} className="flex gap-2.5 text-[13px] leading-relaxed text-[var(--ink-2)]">
                        <span className="mt-0.5 shrink-0 text-[11px] text-[var(--accent)]">→</span>
                        {t.tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </SectionShell>
  )
}

// ─── RoleCards ────────────────────────────────────────────────────────────────

type RoleCardsBlock = {
  blockType: 'roleCards'
  eyebrow?: string
  heading?: string
  description?: string
  cards?: Array<{
    persona: string
    title: string
    workflow?: Array<{ step: string }>
    description?: string
  }>
  background?: string
  spacing?: string
  anchorId?: string
}

export function RoleCardsRenderer({ block }: { block: RoleCardsBlock }) {
  const cards = block.cards ?? []

  return (
    <SectionShell background={block.background as never} spacing={block.spacing as never} anchorId={block.anchorId}>
      <motion.div {...VIEW} className="mb-14">
        {block.eyebrow && <EyebrowBadge>{block.eyebrow}</EyebrowBadge>}
        {block.heading && (
          <h2 className="mt-5 text-[32px] font-medium leading-[1.08] tracking-[-0.03em] text-[var(--ink)] sm:text-[40px]">
            <MintGradientHeading text={block.heading} />
          </h2>
        )}
        {block.description && (
          <p className="mt-4 max-w-[560px] text-[17px] leading-relaxed text-[var(--ink-2)]">
            {block.description}
          </p>
        )}
      </motion.div>

      <div className="grid gap-3 sm:grid-cols-2">
        {cards.map((card, i) => (
          <motion.div
            key={card.persona}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] p-9 transition-all duration-200 hover:border-[var(--border-2)]"
          >
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-200 group-hover:opacity-40"
              style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }}
            />
            <div className="inline-flex items-center rounded-full border border-[var(--accent-border)] bg-[var(--accent-tint)] px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--accent)]">
              {card.persona}
            </div>
            <h3 className="mt-5 text-[20px] font-medium leading-snug tracking-[-0.02em] text-[var(--ink)]">
              {card.title}
            </h3>
            {card.workflow && card.workflow.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-1.5 font-mono text-[10px] tracking-[0.06em] text-[var(--mist)]">
                {card.workflow.map((w, j) => (
                  <span key={w.step} className="flex items-center gap-1.5">
                    {w.step}
                    {j < (card.workflow?.length ?? 0) - 1 && (
                      <span className="text-[var(--border-2)]">→</span>
                    )}
                  </span>
                ))}
              </div>
            )}
            {card.description && (
              <p className="mt-5 text-[14px] leading-relaxed text-[var(--ink-2)]">{card.description}</p>
            )}
          </motion.div>
        ))}
      </div>
    </SectionShell>
  )
}

// ─── ComplianceStrip ──────────────────────────────────────────────────────────

type ComplianceStripBlock = {
  blockType: 'complianceStrip'
  eyebrow?: string
  heading?: string
  description?: string
  pillars?: Array<{ title: string; description?: string }>
  citationLabel?: string
  citationFormat?: string
  citationNote?: string
  background?: string
  spacing?: string
  anchorId?: string
}

export function ComplianceStripRenderer({ block }: { block: ComplianceStripBlock }) {
  const pillars = block.pillars ?? []

  return (
    <SectionShell background={block.background as never} spacing={block.spacing as never} anchorId={block.anchorId}>
      <motion.div {...VIEW} className="mb-10">
        {block.eyebrow && <EyebrowBadge>{block.eyebrow}</EyebrowBadge>}
        {block.heading && (
          <h2 className="mt-5 text-[32px] font-medium leading-[1.08] tracking-[-0.03em] text-[var(--ink)] sm:text-[40px]">
            <MintGradientHeading text={block.heading} />
          </h2>
        )}
        {block.description && (
          <p className="mt-4 max-w-[560px] text-[17px] leading-relaxed text-[var(--ink-2)]">
            {block.description}
          </p>
        )}
      </motion.div>

      {pillars.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 grid overflow-hidden rounded-xl border border-[var(--border)] sm:grid-cols-2 lg:grid-cols-4"
          style={{ gap: '1px', background: 'var(--border)' }}
        >
          {pillars.map((item) => (
            <div
              key={item.title}
              className="bg-[var(--surface)] p-7 transition-colors duration-200 hover:bg-[var(--surface-2)]"
            >
              <div className="mb-3.5 flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--accent-border)] bg-[var(--accent-tint)]">
                <Check className="h-3.5 w-3.5 text-[var(--accent)]" />
              </div>
              <div className="mb-2 text-[15px] font-medium leading-snug tracking-[-0.01em] text-[var(--ink)]">
                {item.title}
              </div>
              {item.description && (
                <p className="text-[13px] leading-relaxed text-[var(--ink-2)]">{item.description}</p>
              )}
            </div>
          ))}
        </motion.div>
      )}

      {block.citationFormat && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center gap-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-7 py-6"
        >
          {block.citationLabel && (
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--mist)]">
              {block.citationLabel}
            </span>
          )}
          <code className="flex-1 rounded-md border border-[var(--accent-border)] bg-[var(--accent-tint)] px-4 py-2.5 font-mono text-[13px] text-[var(--accent)]">
            {block.citationFormat}
          </code>
          {block.citationNote && (
            <span className="shrink-0 text-[12px] text-[var(--mist)]">{block.citationNote}</span>
          )}
        </motion.div>
      )}
    </SectionShell>
  )
}
