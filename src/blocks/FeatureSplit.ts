import type { Block } from 'payload'
import { sectionBaseFields, ctaArrayField } from './_shared'

export const FeatureSplit: Block = {
  slug: 'featureSplit',
  labels: { singular: 'Feature split', plural: 'Feature splits' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'rows',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Row', plural: 'Rows (alternating)' },
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          name: 'imageSide',
          type: 'select',
          defaultValue: 'auto',
          options: [
            { label: 'Auto-alternate (zigzag)', value: 'auto' },
            { label: 'Force right', value: 'right' },
            { label: 'Force left', value: 'left' },
          ],
        },
        {
          name: 'tintBackground',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Subtle mint tint behind this row.' },
        },
        ctaArrayField,
      ],
    },
    ...sectionBaseFields,
  ],
}
