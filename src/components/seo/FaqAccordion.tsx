// src/components/seo/FaqAccordion.tsx
'use client'
import { useCallback, useState } from 'react'
import type { FaqItem } from '@/lib/seo/jsonld'

export function FaqAccordion({
  faqs,
  heading = 'Frequently Asked Questions',
  headingAs = 'h2',
  contained = true,
}: {
  faqs: FaqItem[]
  heading?: string
  /** Heading level for the section title. Defaults to h2; the blog template passes h3. */
  headingAs?: 'h2' | 'h3'
  /** When false, drops the centered 760px frame so a parent can control width/alignment. */
  contained?: boolean
}) {
  const [open, setOpen] = useState<number | null>(null)

  const toggle = useCallback((i: number) => {
    setOpen((prev) => (prev === i ? null : i))
  }, [])

  const Heading = headingAs

  return (
    <section
      style={
        contained
          ? { maxWidth: 760, margin: '0 auto', padding: '80px 48px' }
          : { maxWidth: '100%', margin: 0, padding: 0 }
      }
    >
      <Heading
        style={{
          fontSize: headingAs === 'h3' ? 'clamp(22px, 2.4vw, 30px)' : 'clamp(24px, 3vw, 36px)',
          fontWeight: headingAs === 'h3' ? 600 : 700,
          letterSpacing: '-0.03em',
          marginBottom: headingAs === 'h3' ? 32 : 40,
          color: 'var(--ink)',
        }}
      >
        {heading}
      </Heading>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {faqs.map((faq, i) => (
          <div
            key={i}
            style={{
              border: '1px solid var(--border, rgba(255,255,255,0.07))',
              borderRadius: 10,
              overflow: 'hidden',
            }}
          >
            <button
              type="button"
              aria-expanded={open === i}
              aria-controls={`faq-panel-${i}`}
              onClick={() => toggle(i)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '18px 20px',
                background: open === i ? 'var(--surface-2)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 16,
                color: 'var(--ink)',
                fontSize: 15,
                fontWeight: 500,
                lineHeight: 1.4,
              }}
            >
              <span>{faq.question}</span>
              <span
                aria-hidden="true"
                style={{
                  color: 'var(--accent)',
                  fontSize: 20,
                  fontWeight: 300,
                  flexShrink: 0,
                  lineHeight: 1,
                  transform: open === i ? 'rotate(45deg)' : 'none',
                  transition: 'transform 0.15s',
                }}
              >
                +
              </span>
            </button>
            <div
              id={`faq-panel-${i}`}
              hidden={open !== i}
              style={{
                padding: '0 20px 18px',
                fontSize: 14,
                color: 'var(--ink-2)',
                lineHeight: 1.72,
                background: 'var(--surface-2)',
              }}
            >
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
