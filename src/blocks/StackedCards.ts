import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const StackedCards: Block = {
  slug: 'stackedCards',
  labels: { singular: 'Stacked cards', plural: 'Stacked cards blocks' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'cards',
      type: 'array',
      minRows: 2,
      maxRows: 6,
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          name: 'tone',
          type: 'select',
          defaultValue: 'neutral',
          options: [
            { label: 'Neutral', value: 'neutral' },
            { label: 'Mint tinted', value: 'mint' },
            { label: 'Ink (dark)', value: 'ink' },
          ],
        },
      ],
    },
    ...sectionBaseFields,
  ],
}
