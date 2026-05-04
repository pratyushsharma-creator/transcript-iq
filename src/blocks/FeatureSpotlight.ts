import type { Block } from 'payload'
import { sectionBaseFields, cardHoverField, ctaArrayField } from './_shared'

export const FeatureSpotlight: Block = {
  slug: 'featureSpotlight',
  labels: { singular: 'Feature spotlight', plural: 'Feature spotlights' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'spotlight',
      type: 'group',
      label: 'Hero feature (large)',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        ctaArrayField,
      ],
    },
    {
      name: 'supporting',
      type: 'array',
      minRows: 2,
      maxRows: 4,
      labels: { singular: 'Supporting feature', plural: 'Supporting features' },
      fields: [
        { name: 'icon', type: 'text', admin: { description: 'Lucide icon name.' } },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    cardHoverField,
    ...sectionBaseFields,
  ],
}
