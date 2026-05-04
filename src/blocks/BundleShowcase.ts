import type { Block } from 'payload'
import { sectionBaseFields, cardHoverField } from './_shared'

export const BundleShowcase: Block = {
  slug: 'bundleShowcase',
  labels: { singular: 'Bundle showcase', plural: 'Bundle showcases' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'bundles',
      type: 'relationship',
      relationTo: 'bundles',
      hasMany: true,
      admin: { description: 'Pick which bundles to feature.' },
    },
    {
      name: 'autoFeatured',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'When checked, ignore manual selection above and pull all featured bundles instead.' },
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid-2',
      options: [
        { label: '2-card grid', value: 'grid-2' },
        { label: '3-card grid', value: 'grid-3' },
        { label: 'Carousel', value: 'carousel' },
      ],
    },
    cardHoverField,
    ...sectionBaseFields,
  ],
}
