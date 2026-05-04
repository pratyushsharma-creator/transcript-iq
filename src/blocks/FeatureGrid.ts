import type { Block } from 'payload'
import { sectionBaseFields, cardHoverField } from './_shared'

export const FeatureGrid: Block = {
  slug: 'featureGrid',
  labels: { singular: 'Feature grid', plural: 'Feature grids' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2 columns', value: '2' },
        { label: '3 columns', value: '3' },
        { label: '4 columns', value: '4' },
      ],
    },
    {
      name: 'cardStyle',
      type: 'select',
      defaultValue: 'hairline',
      options: [
        { label: 'Hairline (border only)', value: 'hairline' },
        { label: 'Filled (surface bg)', value: 'filled' },
        { label: 'Borderless', value: 'borderless' },
        { label: 'Editorial (long-form per item, alternating layout)', value: 'editorial' },
      ],
    },
    cardHoverField,
    {
      name: 'features',
      type: 'array',
      minRows: 2,
      fields: [
        {
          name: 'icon',
          type: 'text',
          admin: { description: 'Lucide icon name (e.g. "sparkles", "shield-check").' },
        },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'href', type: 'text', admin: { description: 'Optional link — turns the whole card clickable.' } },
      ],
    },
    ...sectionBaseFields,
  ],
}
