import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const PullQuote: Block = {
  slug: 'pullQuote',
  labels: { singular: 'Pull quote', plural: 'Pull quotes' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'standard',
      options: [
        { label: 'Standard (large quote, centered)', value: 'standard' },
        { label: 'With supporting stats', value: 'withStats' },
        { label: 'Founder voice (full-bleed mint tint)', value: 'founderVoice' },
      ],
    },
    { name: 'quote', type: 'textarea', required: true },
    { name: 'attributionName', type: 'text' },
    { name: 'attributionRole', type: 'text', admin: { description: 'e.g. "Founder, Nextyn Advisory"' } },
    { name: 'attributionImage', type: 'upload', relationTo: 'media' },
    {
      name: 'stats',
      type: 'array',
      maxRows: 4,
      admin: { condition: (_, sib) => sib?.variant === 'withStats' },
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
    ...sectionBaseFields,
  ],
}
