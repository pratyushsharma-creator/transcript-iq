import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const ComparisonTable: Block = {
  slug: 'comparisonTable',
  labels: { singular: 'Comparison table', plural: 'Comparison tables' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'leftLabel',
      type: 'text',
      required: true,
      admin: { description: 'e.g. "What secondary research tells you"' },
    },
    {
      name: 'rightLabel',
      type: 'text',
      required: true,
      admin: { description: 'e.g. "What primary research tells you"' },
    },
    {
      name: 'rightHighlighted',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Mint-tint the right column to imply preference (per brand voice rules — no disparagement of left).' },
    },
    {
      name: 'rows',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'left', type: 'textarea', required: true },
        { name: 'right', type: 'textarea', required: true },
      ],
    },
    ...sectionBaseFields,
  ],
}
