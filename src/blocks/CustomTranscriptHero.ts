import type { Block } from 'payload'
import { sectionBaseFields, ctaArrayField } from './_shared'

export const CustomTranscriptHero: Block = {
  slug: 'customTranscriptHero',
  labels: { singular: 'Custom Transcript Hero', plural: 'Custom Transcript Heroes' },
  fields: [
    // ── Left column ─────────────────────────────────────────────────────────
    { name: 'eyebrow', type: 'text', defaultValue: 'Bespoke Expert Research' },
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: { description: 'Use **text** for mint italic accent. Use \\n for line breaks.' },
    },
    { name: 'subtitle', type: 'textarea' },
    {
      name: 'processSteps',
      type: 'array',
      label: 'Process timeline steps',
      minRows: 2,
      maxRows: 5,
      fields: [
        { name: 'stepLabel', type: 'text', required: true, admin: { description: 'e.g. "Step 01"' } },
        { name: 'title', type: 'text', required: true },
        { name: 'timing', type: 'text', admin: { description: 'e.g. "Takes < 5 minutes"' } },
      ],
    },
    // ── Price strip ──────────────────────────────────────────────────────────
    {
      name: 'priceStrip',
      type: 'group',
      label: 'Price strip',
      fields: [
        { name: 'amount', type: 'text', defaultValue: '$899', required: true },
        { name: 'label', type: 'text', defaultValue: 'Starting price · one-time flat fee' },
        { name: 'note', type: 'text', defaultValue: 'No subscription · No platform fee · No minimum volume' },
      ],
    },
    ctaArrayField,
    // ── Right column: form card ──────────────────────────────────────────────
    {
      name: 'formCard',
      type: 'group',
      label: 'Commission brief form card',
      fields: [
        { name: 'cardTitle', type: 'text', defaultValue: 'Research Brief' },
        { name: 'cardBadge', type: 'text', defaultValue: 'Confidential' },
        { name: 'detailsLabel', type: 'text', defaultValue: 'Your details' },
        { name: 'briefLabel', type: 'text', defaultValue: 'Research Brief' },
        { name: 'submitLabel', type: 'text', defaultValue: 'Submit Research Brief' },
        {
          name: 'formNote',
          type: 'text',
          defaultValue: 'Your brief is confidential · A coordinator responds within 24 hours',
        },
        { name: 'successTitle', type: 'text', defaultValue: 'Brief received' },
        {
          name: 'successMessage',
          type: 'textarea',
          defaultValue:
            'A coordinator will review your brief and respond within 24 hours. Check your inbox for a confirmation email.',
        },
        {
          name: 'formEndpoint',
          type: 'text',
          admin: {
            description: 'POST endpoint for form submission (e.g. /api/custom-brief). Leave blank to show success immediately.',
          },
        },
      ],
    },
    {
      name: 'trustStats',
      type: 'array',
      label: 'Trust stats (displayed below form card)',
      maxRows: 4,
      fields: [
        { name: 'value', type: 'text', required: true, admin: { description: 'e.g. "135K+"' } },
        { name: 'label', type: 'text', required: true, admin: { description: 'Two-line label. Use \\n for line break.' } },
      ],
    },
    ...sectionBaseFields,
  ],
}
