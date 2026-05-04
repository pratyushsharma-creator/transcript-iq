import type { Block } from 'payload'
import { sectionBaseFields, ctaArrayField } from './_shared'

export const CTABlock: Block = {
  slug: 'cta',
  labels: { singular: 'CTA band', plural: 'CTA bands' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'subheading', type: 'textarea' },
    ctaArrayField,
    {
      name: 'alignment',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: 'Center', value: 'center' },
        { label: 'Left', value: 'left' },
      ],
    },
    {
      name: 'visualBg',
      type: 'select',
      defaultValue: 'beams',
      options: [
        { label: 'Animated beams (signature)', value: 'beams' },
        { label: 'Glow + grid', value: 'glow-grid' },
        { label: 'Mesh gradient', value: 'mesh' },
        { label: 'Image background', value: 'image' },
        { label: 'Clean (no decoration)', value: 'clean' },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { condition: (_, sib) => sib?.visualBg === 'image' },
    },
    {
      name: 'complianceNote',
      type: 'text',
      admin: {
        description:
          'Optional small mono note below the CTA buttons (e.g. "MNPI SCREENED · PII REDACTED · 36HR DELIVERY").',
      },
    },
    ...sectionBaseFields,
  ],
}
