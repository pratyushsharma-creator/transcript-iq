import type { Block } from 'payload'
import { sectionBaseFields, ctaArrayField } from './_shared'

export const CTAInline: Block = {
  slug: 'ctaInline',
  labels: { singular: 'Inline CTA card', plural: 'Inline CTAs' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'textarea' },
    ctaArrayField,
    {
      name: 'tone',
      type: 'select',
      defaultValue: 'mint',
      options: [
        { label: 'Mint tinted', value: 'mint' },
        { label: 'Neutral surface', value: 'neutral' },
        { label: 'Ink (dark contrast)', value: 'ink' },
      ],
    },
    ...sectionBaseFields,
  ],
}
