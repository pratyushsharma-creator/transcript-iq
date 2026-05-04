import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const FeatureMatrix: Block = {
  slug: 'featureMatrix',
  labels: { singular: 'Feature matrix', plural: 'Feature matrices' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'columns',
      type: 'array',
      minRows: 2,
      maxRows: 5,
      labels: { singular: 'Column', plural: 'Columns (plans)' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'highlighted', type: 'checkbox', defaultValue: false },
      ],
    },
    {
      name: 'rows',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'feature', type: 'text', required: true },
        {
          name: 'values',
          type: 'array',
          fields: [
            {
              name: 'value',
              type: 'text',
              admin: { description: 'Use ✓ or ✗ for tick/cross, or any text.' },
            },
          ],
        },
      ],
    },
    ...sectionBaseFields,
  ],
}
