import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const ScrollPinned: Block = {
  slug: 'scrollPinned',
  labels: { singular: 'Scroll pinned', plural: 'Scroll pinned blocks' },
  admin: {
    components: {},
  },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    {
      name: 'pinSide',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Pin visual on left', value: 'left' },
        { label: 'Pin visual on right', value: 'right' },
      ],
    },
    {
      name: 'panels',
      type: 'array',
      minRows: 2,
      maxRows: 8,
      labels: { singular: 'Panel', plural: 'Scroll panels' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    ...sectionBaseFields,
  ],
}
