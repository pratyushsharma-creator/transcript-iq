import type { Block } from 'payload'
import { sectionBaseFields, ctaArrayField } from './_shared'

export const ArgumentBlock: Block = {
  slug: 'argument',
  labels: { singular: 'Argument block', plural: 'Argument blocks' },
  fields: [
    { name: 'eyebrow', type: 'text', admin: { description: 'e.g. "Argument 01"' } },
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'richText' },
    {
      name: 'pullquote',
      type: 'group',
      label: 'Optional pullquote inside body',
      fields: [
        { name: 'quote', type: 'textarea' },
        { name: 'attribution', type: 'text' },
      ],
    },
    ctaArrayField,
    ...sectionBaseFields,
  ],
}
