import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const ComplianceStrip: Block = {
  slug: 'complianceStrip',
  labels: { singular: 'Compliance strip', plural: 'Compliance strips' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'pillars',
      type: 'array',
      minRows: 2,
      maxRows: 6,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'citationLabel',
      type: 'text',
      admin: { description: 'Left label in the citation bar (e.g. "Standard citation format")' },
    },
    {
      name: 'citationFormat',
      type: 'text',
      admin: { description: 'Citation format string shown in monospace (e.g. "Expert call, [Sector], via Transcript-IQ, [Date]")' },
    },
    {
      name: 'citationNote',
      type: 'text',
      admin: { description: 'Right-side note (e.g. "For IC memos & investment presentations")' },
    },
    ...sectionBaseFields,
  ],
}
