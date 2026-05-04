'use client'

import { motion } from 'motion/react'
import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { SectionShell, SectionHeader, MintGradientHeading } from './SectionShell'
import { CTAButtons } from './CTAButtons'
import { BackgroundBeams } from '@/components/ui/background-beams'

// ── CTABlock ──────────────────────────────────────────────────────────────

type CTABlockData = {
  blockType: 'cta'
  eyebrow?: string
  heading: string
  subheading?: string
  ctas?: Array<{ label: string; url: string; variant?: string; magnetic?: boolean }>
  alignment?: 'left' | 'center'
  visualBg?: 'glow-grid' | 'mesh' | 'image' | 'clean' | 'beams'
  image?: { url?: string }
  complianceNote?: string
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function CTABlockRenderer({ block }: { block: CTABlockData }) {
  const align = block.alignment ?? 'center'
  // Default to beams treatment for the design upgrade — explicit override possible
  const bgTreatment = block.visualBg ?? 'beams'
  return (
    <SectionShell background="clean" spacing={block.spacing} anchorId={block.anchorId} contained={false}>
      <div className="relative isolate overflow-hidden py-20 px-6 sm:py-24">
        {bgTreatment === 'beams' && (
          <>
            <BackgroundBeams />
            {/* Soft radial glow behind the centered content */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  'radial-gradient(circle, var(--accent-tint-2) 0%, transparent 70%)',
              }}
            />
          </>
        )}
        {bgTreatment === 'glow-grid' && (
          <>
            <div aria-hidden className="absolute inset-0 -z-10 bg-hero-glow" />
            <div aria-hidden className="absolute inset-0 -z-10 bg-hero-grid mask-fade-y" />
          </>
        )}
        {bgTreatment === 'mesh' && <div aria-hidden className="absolute inset-0 -z-10 bg-variant-mesh" />}
        {bgTreatment === 'image' && block.image?.url && (
          <>
            <img src={block.image.url} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/60 to-transparent" />
          </>
        )}
        <div className={`relative z-10 mx-auto max-w-3xl ${align === 'center' ? 'text-center' : ''}`}>
          {block.eyebrow && (
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]">
              {block.eyebrow}
            </span>
          )}
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 text-[44px] sm:text-[64px] lg:text-[72px] leading-[1.02] tracking-[-0.04em] font-semibold text-[var(--ink)] text-balance"
          >
            <MintGradientHeading text={block.heading} />
          </motion.h2>
          {block.subheading && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mt-5 max-w-xl text-[16px] sm:text-[18px] leading-relaxed text-[var(--ink-2)]"
            >
              {block.subheading}
            </motion.p>
          )}
          {block.ctas && block.ctas.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className={`mt-10 flex flex-wrap items-center gap-3 ${align === 'center' ? 'justify-center' : ''}`}
            >
              <CTAButtons ctas={block.ctas as never} />
            </motion.div>
          )}
          {block.complianceNote && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="mt-8 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--mist)]"
            >
              {block.complianceNote}
            </motion.div>
          )}
        </div>
      </div>
    </SectionShell>
  )
}

// ── CTAInline ─────────────────────────────────────────────────────────────

type CTAInlineBlock = {
  blockType: 'ctaInline'
  eyebrow?: string
  heading: string
  body?: string
  ctas?: Array<{ label: string; url: string; variant?: string; magnetic?: boolean }>
  tone?: 'mint' | 'neutral' | 'ink'
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function CTAInlineRenderer({ block }: { block: CTAInlineBlock }) {
  const tone = block.tone ?? 'mint'
  const cls =
    tone === 'mint'
      ? 'bg-[var(--accent-tint)] border-[var(--accent-border)] text-[var(--ink)]'
      : tone === 'ink'
      ? 'bg-[var(--ink)] text-[var(--bg)] border-[var(--ink-2)]'
      : 'bg-[var(--surface)] border-[var(--border)] text-[var(--ink)]'
  return (
    <SectionShell background={block.background} spacing={block.spacing ?? 'compact'} anchorId={block.anchorId}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`mx-auto flex max-w-3xl flex-col gap-3 rounded-xl border p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6 ${cls}`}
      >
        <div>
          {block.eyebrow && (
            <span className={`font-mono text-[10px] uppercase tracking-[0.12em] ${tone === 'ink' ? 'text-[var(--accent-bright)]' : 'text-[var(--accent)]'}`}>
              {block.eyebrow}
            </span>
          )}
          <h3 className="mt-1 text-[18px] font-medium leading-[1.3]">{block.heading}</h3>
          {block.body && <p className={`mt-1 text-[14px] leading-relaxed ${tone === 'ink' ? 'text-[var(--bg)]/80' : 'text-[var(--ink-2)]'}`}>{block.body}</p>}
        </div>
        {block.ctas && block.ctas.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <CTAButtons ctas={block.ctas as never} />
          </div>
        )}
      </motion.div>
    </SectionShell>
  )
}

// ── CTASplit ──────────────────────────────────────────────────────────────

type CTASplitBlock = {
  blockType: 'ctaSplit'
  eyebrow?: string
  heading: string
  body?: string
  ctas?: Array<{ label: string; url: string; variant?: string; magnetic?: boolean }>
  rightSide?: 'newsletter' | 'freeTranscript' | 'commission' | 'image'
  image?: { url?: string }
  formProof?: string
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function CTASplitRenderer({ block }: { block: CTASplitBlock }) {
  const right = block.rightSide ?? 'newsletter'
  return (
    <SectionShell background={block.background ?? 'mesh'} spacing={block.spacing} anchorId={block.anchorId}>
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          {block.eyebrow && (
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--accent)]">{block.eyebrow}</span>
          )}
          <h2 className="mt-3 text-[32px] sm:text-[44px] leading-[1.1] tracking-[-0.03em] font-medium text-[var(--ink)] text-balance">
            <MintGradientHeading text={block.heading} />
          </h2>
          {block.body && <p className="mt-4 text-[16px] leading-relaxed text-[var(--ink-2)]">{block.body}</p>}
          {block.ctas && block.ctas.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <CTAButtons ctas={block.ctas as never} />
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          {right === 'image' && block.image?.url ? (
            <img src={block.image.url} alt="" className="aspect-[4/3] w-full rounded-xl object-cover" />
          ) : right !== 'image' ? (
            <SimpleSignupForm proof={block.formProof} type={right} />
          ) : null}
        </div>
      </div>
    </SectionShell>
  )
}

// ── NewsletterSignup ──────────────────────────────────────────────────────

type NewsletterBlock = {
  blockType: 'newsletterSignup'
  eyebrow?: string
  heading: string
  body?: string
  placeholder?: string
  submitLabel?: string
  consent?: string
  socialProof?: string
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function NewsletterSignupRenderer({ block }: { block: NewsletterBlock }) {
  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
      <div className="mx-auto max-w-xl text-center">
        {block.eyebrow && (
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--accent)]">{block.eyebrow}</span>
        )}
        <h2 className="mt-3 text-[28px] sm:text-[36px] leading-[1.15] tracking-[-0.025em] font-medium text-[var(--ink)] text-balance">
          {block.heading}
        </h2>
        {block.body && <p className="mt-4 text-[15px] leading-relaxed text-[var(--ink-2)]">{block.body}</p>}
        <NewsletterForm placeholder={block.placeholder} submitLabel={block.submitLabel} />
        {block.consent && <p className="mt-3 text-[11px] text-[var(--mist)]">{block.consent}</p>}
        {block.socialProof && <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--accent)]">{block.socialProof}</p>}
      </div>
    </SectionShell>
  )
}

// ── Form support: SimpleSignupForm (used in CTASplit) ─────────────────────

function SimpleSignupForm({ proof, type }: { proof?: string; type: 'newsletter' | 'freeTranscript' | 'commission' }) {
  const [submitted, setSubmitted] = useState(false)
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setSubmitted(true)
      }}
      className="space-y-3"
    >
      {submitted ? (
        <div className="rounded-md bg-[var(--accent-tint)] p-4 text-[14px] text-[var(--ink)]">
          Thank you. Confirmation incoming within 24 hours.
        </div>
      ) : (
        <>
          {type !== 'newsletter' && (
            <input
              type="text"
              required
              placeholder="Full name"
              className="w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-[14px] text-[var(--ink)] placeholder:text-[var(--mist)] focus:outline-none focus:border-[var(--accent)] focus:shadow-focus"
            />
          )}
          <input
            type="email"
            required
            placeholder="Work email"
            className="w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-[14px] text-[var(--ink)] placeholder:text-[var(--mist)] focus:outline-none focus:border-[var(--accent)] focus:shadow-focus"
          />
          {type !== 'newsletter' && (
            <input
              type="text"
              placeholder="Organization"
              className="w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-[14px] text-[var(--ink)] placeholder:text-[var(--mist)] focus:outline-none focus:border-[var(--accent)] focus:shadow-focus"
            />
          )}
          {type === 'commission' && (
            <textarea
              placeholder="Brief description of what you need"
              rows={3}
              className="w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-[14px] text-[var(--ink)] placeholder:text-[var(--mist)] focus:outline-none focus:border-[var(--accent)] focus:shadow-focus"
            />
          )}
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-btn-primary px-4 py-2.5 text-[14px] font-medium text-white shadow-cta transition-all duration-base ease-out hover:-translate-y-px hover:bg-btn-primary-hover"
          >
            {type === 'commission' ? 'Submit brief' : type === 'freeTranscript' ? 'Claim free transcript' : 'Subscribe'}
            <ArrowRight className="h-4 w-4" />
          </button>
          {proof && <p className="text-center font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--accent)]">{proof}</p>}
        </>
      )}
    </form>
  )
}

function NewsletterForm({ placeholder, submitLabel }: { placeholder?: string; submitLabel?: string }) {
  const [submitted, setSubmitted] = useState(false)
  if (submitted) {
    return (
      <div className="mt-6 rounded-md bg-[var(--accent-tint)] p-4 text-center text-[14px] text-[var(--ink)]">
        Thanks — first briefing on the way.
      </div>
    )
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setSubmitted(true)
      }}
      className="mt-6 flex flex-col gap-2 sm:flex-row sm:gap-1"
    >
      <input
        type="email"
        required
        placeholder={placeholder ?? 'work@email.com'}
        className="flex-1 rounded-md border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-[14px] text-[var(--ink)] placeholder:text-[var(--mist)] focus:outline-none focus:border-[var(--accent)] focus:shadow-focus sm:rounded-r-none"
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 rounded-md bg-btn-primary px-5 py-3 text-[14px] font-medium text-white shadow-cta transition-all duration-base ease-out hover:bg-btn-primary-hover sm:rounded-l-none"
      >
        {submitLabel ?? 'Subscribe'}
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  )
}

// ── FormBlock ─────────────────────────────────────────────────────────────

type FormBlockData = {
  blockType: 'formBlock'
  formType: 'contact' | 'commission' | 'freeTranscript' | 'waitlist' | 'enterprise'
  eyebrow?: string
  heading?: string
  description?: string
  submitLabel?: string
  successMessage?: string
  errorMessage?: string
  recipient?: string
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function FormBlockRenderer({ block }: { block: FormBlockData }) {
  const [submitted, setSubmitted] = useState(false)

  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
      <div className="mx-auto max-w-2xl">
        <SectionHeader
          eyebrow={block.eyebrow}
          heading={block.heading ? <MintGradientHeading text={block.heading} /> : undefined}
          description={block.description}
          alignment="center"
        />
        {submitted ? (
          <div className="rounded-xl border border-[var(--accent-border)] bg-[var(--accent-tint)] p-8 text-center text-[var(--ink)]">
            <p className="text-[16px] font-medium">{block.successMessage ?? 'Thank you. We will be in touch within 24 hours.'}</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setSubmitted(true)
            }}
            className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Full name" name="name" required />
              <FormField label="Organization" name="org" required />
            </div>
            <FormField label="Work email" name="email" type="email" required />
            {(block.formType === 'commission' || block.formType === 'enterprise') && (
              <FormField label="Phone" name="phone" type="tel" />
            )}
            {block.formType === 'commission' && (
              <FormTextarea label="Topic / research question" name="topic" required rows={2} />
            )}
            {block.formType === 'commission' && (
              <FormTextarea label="Additional details" name="details" rows={3} />
            )}
            {block.formType === 'contact' && <FormTextarea label="Message" name="message" required rows={4} />}
            {block.formType === 'enterprise' && <FormTextarea label="Use case" name="useCase" required rows={3} />}
            {block.formType === 'waitlist' && (
              <FormTextarea label="What would you like access to?" name="interest" rows={3} />
            )}
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-btn-primary px-5 py-3 text-[14px] font-medium text-white shadow-cta transition-all duration-base ease-out hover:-translate-y-px hover:bg-btn-primary-hover"
            >
              {block.submitLabel ?? 'Submit'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}
      </div>
    </SectionShell>
  )
}

function FormField({ label, name, type = 'text', required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--mist)]">
        {label}{required ? ' *' : ''}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-[14px] text-[var(--ink)] placeholder:text-[var(--mist)] focus:outline-none focus:border-[var(--accent)] focus:shadow-focus"
      />
    </label>
  )
}

function FormTextarea({ label, name, required, rows = 3 }: { label: string; name: string; required?: boolean; rows?: number }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--mist)]">
        {label}{required ? ' *' : ''}
      </span>
      <textarea
        name={name}
        required={required}
        rows={rows}
        className="w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-[14px] text-[var(--ink)] placeholder:text-[var(--mist)] focus:outline-none focus:border-[var(--accent)] focus:shadow-focus"
      />
    </label>
  )
}

// ── TestimonialBlock ──────────────────────────────────────────────────────

type TestimonialBlockData = {
  blockType: 'testimonial'
  variant?: 'single' | 'grid' | 'carousel'
  eyebrow?: string
  heading?: string
  testimonials?: Array<{
    quote: string
    authorName: string
    authorTitle?: string
    authorCompany?: string
    authorImage?: { url?: string }
    logoImage?: { url?: string }
  }>
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function TestimonialRenderer({ block }: { block: TestimonialBlockData }) {
  const variant = block.variant ?? 'single'
  const items = block.testimonials ?? []
  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
      <SectionHeader
        eyebrow={block.eyebrow}
        heading={block.heading ? <MintGradientHeading text={block.heading} /> : undefined}
        alignment="center"
      />
      {variant === 'single' && items[0] && (
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[24px] sm:text-[32px] leading-[1.2] font-medium text-[var(--ink)] text-balance">
            “{items[0].quote}”
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            {items[0].authorImage?.url && (
              <img src={items[0].authorImage.url} alt="" className="h-10 w-10 rounded-full border border-[var(--border)] object-cover" />
            )}
            <div className="text-left">
              <div className="text-[14px] font-medium text-[var(--ink)]">{items[0].authorName}</div>
              <div className="text-[12px] text-[var(--mist)]">
                {items[0].authorTitle}{items[0].authorTitle && items[0].authorCompany ? ' · ' : ''}{items[0].authorCompany}
              </div>
            </div>
          </div>
        </div>
      )}
      {variant === 'grid' && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6"
            >
              <p className="text-[15px] leading-relaxed text-[var(--ink)]">“{t.quote}”</p>
              <div className="mt-4 flex items-center gap-3">
                {t.authorImage?.url && (
                  <img src={t.authorImage.url} alt="" className="h-9 w-9 rounded-full border border-[var(--border)] object-cover" />
                )}
                <div>
                  <div className="text-[13px] font-medium text-[var(--ink)]">{t.authorName}</div>
                  <div className="text-[11px] text-[var(--mist)]">{t.authorTitle}{t.authorCompany ? ' · ' + t.authorCompany : ''}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      {variant === 'carousel' && <TestimonialCarousel items={items} />}
    </SectionShell>
  )
}

function TestimonialCarousel({ items }: { items: NonNullable<TestimonialBlockData['testimonials']> }) {
  const [idx, setIdx] = useState(0)
  if (!items.length) return null
  return (
    <div className="mx-auto max-w-3xl">
      <motion.div
        key={idx}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <p className="text-[22px] sm:text-[28px] leading-[1.2] font-medium text-[var(--ink)] text-balance">“{items[idx].quote}”</p>
        <div className="mt-4 text-[13px] text-[var(--mist)]">
          {items[idx].authorName}
          {items[idx].authorTitle ? ' · ' + items[idx].authorTitle : ''}
        </div>
      </motion.div>
      <div className="mt-6 flex justify-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-6 bg-[var(--accent)]' : 'w-1.5 bg-[var(--border-2)]'}`}
            aria-label={`Show testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

// ── CaseStudyHighlight ────────────────────────────────────────────────────

type CaseStudyBlock = {
  blockType: 'caseStudyHighlight'
  eyebrow?: string
  heading: string
  body?: string
  image?: { url?: string }
  stats?: Array<{ value: string; label: string }>
  quote?: { text?: string; attributionName?: string; attributionRole?: string }
  ctas?: Array<{ label: string; url: string; variant?: string; magnetic?: boolean }>
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function CaseStudyHighlightRenderer({ block }: { block: CaseStudyBlock }) {
  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--accent)]">{block.eyebrow ?? 'Case study'}</span>
          <h2 className="mt-3 text-[32px] sm:text-[40px] leading-[1.1] tracking-[-0.025em] font-medium text-[var(--ink)] text-balance">
            <MintGradientHeading text={block.heading} />
          </h2>
          {block.body && <p className="mt-4 text-[16px] leading-relaxed text-[var(--ink-2)]">{block.body}</p>}
          {block.stats && block.stats.length > 0 && (
            <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4 border-t border-[var(--border)] pt-6 sm:grid-cols-4">
              {block.stats.map((s, i) => (
                <div key={i}>
                  <div className="font-mono text-[28px] font-semibold tabular-nums text-[var(--accent)]">{s.value}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--mist)]">{s.label}</div>
                </div>
              ))}
            </div>
          )}
          {block.quote?.text && (
            <blockquote className="mt-8 border-l-2 border-[var(--accent)] pl-4">
              <p className="text-[16px] leading-relaxed text-[var(--ink)]">“{block.quote.text}”</p>
              {block.quote.attributionName && (
                <cite className="mt-2 block text-[12px] not-italic text-[var(--mist)]">
                  — {block.quote.attributionName}{block.quote.attributionRole ? ', ' + block.quote.attributionRole : ''}
                </cite>
              )}
            </blockquote>
          )}
          {block.ctas && block.ctas.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <CTAButtons ctas={block.ctas as never} />
            </div>
          )}
        </div>
        <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--border)] bg-variant-mesh">
          {block.image?.url && <img src={block.image.url} alt="" className="h-full w-full object-cover" />}
        </div>
      </div>
    </SectionShell>
  )
}
