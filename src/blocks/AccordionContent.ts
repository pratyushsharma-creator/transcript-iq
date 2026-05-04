import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const AccordionContent: Block = {
  slug: 'accordionContent',
  labels: { singular: 'Accordion content', plural: 'Accordion content blocks' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    {
      name: 'sections',
      type: 'array',
      minRows: 2,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'richText', required: true },
        { name: 'icon', type: 'text', admin: { description: 'Lucide icon name (optional).' } },
      ],
    },
    ...sectionBaseFields,
  ],
}
