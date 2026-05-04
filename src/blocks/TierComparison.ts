import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const TierComparison: Block = {
  slug: 'tierComparison',
  labels: { singular: 'Tier comparison', plural: 'Tier comparisons' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'tiers',
      type: 'array',
      minRows: 2,
      maxRows: 4,
      fields: [
        { name: 'name', type: 'text', required: true, admin: { description: 'e.g. "Standard", "Premium", "Elite"' } },
        { name: 'price', type: 'text', required: true, admin: { description: 'e.g. "$349", "$449", "$599"' } },
        { name: 'priceCadence', type: 'text', admin: { description: 'e.g. "per transcript", "one-time"' } },
        { name: 'tagline', type: 'text' },
        {
          name: 'features',
          type: 'array',
          minRows: 1,
          fields: [{ name: 'item', type: 'text', required: true }],
        },
        { name: 'highlighted', type: 'checkbox', defaultValue: false },
        { name: 'ctaLabel', type: 'text' },
        { name: 'ctaUrl', type: 'text' },
      ],
    },
    ...sectionBaseFields,
  ],
}
