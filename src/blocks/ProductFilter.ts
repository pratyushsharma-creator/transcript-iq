import type { Block } from 'payload'
import { sectionBaseFields, cardHoverField } from './_shared'

export const ProductFilter: Block = {
  slug: 'productFilter',
  labels: { singular: 'Product filter (full library)', plural: 'Product filter blocks' },
  admin: {
    components: {
      // Future: a custom admin label
    },
  },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'productScope',
      type: 'select',
      required: true,
      defaultValue: 'expert-transcripts',
      options: [
        { label: 'Expert transcripts only', value: 'expert-transcripts' },
        { label: 'Earnings analyses only', value: 'earnings-analyses' },
        { label: 'Both (with type filter)', value: 'both' },
      ],
    },
    {
      name: 'showFilters',
      type: 'select',
      hasMany: true,
      defaultValue: ['sector', 'tier', 'expertLevel', 'geography'],
      options: [
        { label: 'Product type', value: 'productType' },
        { label: 'Sector', value: 'sector' },
        { label: 'Tier', value: 'tier' },
        { label: 'Expert level', value: 'expertLevel' },
        { label: 'Geography', value: 'geography' },
        { label: 'Quarter / fiscal year', value: 'quarter' },
        { label: 'Search', value: 'search' },
      ],
    },
    {
      name: 'pageSize',
      type: 'number',
      defaultValue: 24,
      min: 6,
      max: 60,
    },
    cardHoverField,
    ...sectionBaseFields,
  ],
}
