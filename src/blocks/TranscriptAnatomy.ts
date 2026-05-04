import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const TranscriptAnatomy: Block = {
  slug: 'transcriptAnatomy',
  labels: { singular: 'Transcript anatomy', plural: 'Transcript anatomy blocks' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'sections',
      type: 'array',
      minRows: 2,
      maxRows: 6,
      fields: [
        {
          name: 'sectionNumber',
          type: 'text',
          required: true,
          admin: { description: 'e.g. "Section 01"' },
        },
        {
          name: 'sectionKey',
          type: 'text',
          required: true,
          admin: {
            description:
              'Unique key that maps to a doc-mockup panel. Supported: exec | verbatim | profile | compliance',
          },
        },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    ...sectionBaseFields,
  ],
}
