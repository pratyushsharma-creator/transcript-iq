import type { Block } from 'payload'
import { sectionBaseFields, ctaArrayField } from './_shared'

export const CaseStudyHighlight: Block = {
  slug: 'caseStudyHighlight',
  labels: { singular: 'Case study highlight', plural: 'Case study highlights' },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: 'Case study' },
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'stats',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
    {
      name: 'quote',
      type: 'group',
      fields: [
        { name: 'text', type: 'textarea' },
        { name: 'attributionName', type: 'text' },
        { name: 'attributionRole', type: 'text' },
      ],
    },
    ctaArrayField,
    ...sectionBaseFields,
  ],
}
