import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const LogosCloud: Block = {
  slug: 'logosCloud',
  labels: { singular: 'Logos cloud', plural: 'Logo clouds' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    {
      name: 'logos',
      type: 'array',
      minRows: 4,
      maxRows: 24,
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'url', type: 'text' },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '6',
      options: ['3', '4', '5', '6'].map((v) => ({ label: `${v} columns`, value: v })),
    },
    {
      name: 'grayscale',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Grayscale by default, fades to color on hover.' },
    },
    ...sectionBaseFields,
  ],
}
