'use client'

import { SectionShell, MintGradientHeading } from './SectionShell'
import { CTAButtons } from './CTAButtons'
import { motion } from 'motion/react'

type SectionIntroBlock = {
  blockType: 'sectionIntro'
  variant?: 'compact' | 'centered' | 'massive'
  eyebrow?: string
  heading: string
  lede?: string
  ctas?: Array<{ label: string; url: string; variant?: 'primary' | 'secondary' | 'ghost' | 'tertiary'; magnetic?: boolean }>
  background?: 'clean' | 'glow' | 'grid' | 'mesh' | 'flood'
  spacing?: 'compact' | 'default' | 'spacious'
  anchorId?: string
}

export function SectionIntroRenderer({ block }: { block: SectionIntroBlock }) {
  const variant = block.variant ?? 'compact'
  const isCentered = variant === 'centered' || variant === 'massive'
  const headingClass =
    variant === 'massive'
      ? 'text-[44px] sm:text-[64px] lg:text-[96px] leading-[1.0] tracking-[-0.04em] font-semibold'
      : 'text-[32px] sm:text-[44px] leading-[1.1] tracking-[-0.03em] font-medium'
  return (
    <SectionShell background={block.background} spacing={block.spacing} anchorId={block.anchorId}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`max-w-3xl ${isCentered ? 'mx-auto text-center' : ''}`}
      >
        {block.eyebrow && (
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--accent)]">
            {block.eyebrow}
          </span>
        )}
        <h2 className={`mt-3 text-[var(--ink)] text-balance ${headingClass}`}>
          <MintGradientHeading text={block.heading} />
        </h2>
        {block.lede && (
          <p className="mt-5 text-[16px] leading-relaxed text-[var(--ink-2)] sm:text-[18px]">
            {block.lede}
          </p>
        )}
        {block.ctas && block.ctas.length > 0 && (
          <div className={`mt-8 flex flex-wrap items-center gap-3 ${isCentered ? 'justify-center' : ''}`}>
            <CTAButtons ctas={block.ctas} />
          </div>
        )}
      </motion.div>
    </SectionShell>
  )
}
