import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: { singular: 'Rich text', plural: 'Rich text blocks' },
  fields: [
    { name: 'content', type: 'richText', required: true },
    {
      name: 'maxWidth',
      type: 'select',
      defaultValue: 'prose',
      options: [
        { label: 'Narrow (prose)', value: 'prose' },
        { label: 'Wide', value: 'wide' },
        { label: 'Full width', value: 'full' },
      ],
    },
    ...sectionBaseFields,
  ],
}
