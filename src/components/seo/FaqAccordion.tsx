// src/components/seo/FaqAccordion.tsx
'use client'
import { useCallback, useState } from 'react'
import type { FaqItem } from '@/lib/seo/jsonld'

export function FaqAccordion({
  faqs,
  heading = 'Frequently Asked Questions',
}: {
  faqs: FaqItem[]
  heading?: string
}) {
  const [open, setOpen] = useState<number | null>(null)

  const toggle = useCallback((i: number) => {
    setOpen((prev) => (prev === i ? null : i))
  }, [])

  return (
    <section
      style={{
        maxWidth: 760,
        margin: '0 auto',
        padding: '80px 48px',
      }}
    >
      <h2
        style={{
          fontSize: 'clamp(24px, 3vw, 36px)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          marginBottom: 40,
          color: 'var(--ink)',
        }}
      >
        {heading}
      </h2>
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
                background: open === i ? 'var(--s1)' : 'transparent',
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
            {open === i && (
              <div
                id={`faq-panel-${i}`}
                style={{
                  padding: '0 20px 18px',
                  fontSize: 14,
                  color: 'var(--ink-2)',
                  lineHeight: 1.72,
                  background: 'var(--s1)',
                }}
              >
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
