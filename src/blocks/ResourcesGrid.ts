import type { Block } from 'payload'
import { sectionBaseFields, cardHoverField } from './_shared'

export const ResourcesGrid: Block = {
  slug: 'resourcesGrid',
  labels: { singular: 'Resources grid (full filter)', plural: 'Resources grids' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'showFilters',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Show content-type tab filters above the grid.' },
    },
    {
      name: 'pageSize',
      type: 'number',
      defaultValue: 12,
      min: 6,
      max: 36,
    },
    cardHoverField,
    ...sectionBaseFields,
  ],
}
