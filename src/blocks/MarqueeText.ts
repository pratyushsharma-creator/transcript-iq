import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const MarqueeText: Block = {
  slug: 'marqueeText',
  labels: { singular: 'Marquee', plural: 'Marquee blocks' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'chips',
      options: [
        { label: 'Chips (sectors / tickers / tags)', value: 'chips' },
        { label: 'Plain text statement', value: 'text' },
        { label: 'Logo strip', value: 'logos' },
      ],
    },
    { name: 'eyebrow', type: 'text' },
    {
      name: 'items',
      type: 'array',
      minRows: 4,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Used for logo variant.' } },
      ],
    },
    {
      name: 'speedSeconds',
      type: 'number',
      defaultValue: 48,
      min: 20,
      max: 120,
    },
    {
      name: 'reverse',
      type: 'checkbox',
      defaultValue: false,
    },
    ...sectionBaseFields,
  ],
}
