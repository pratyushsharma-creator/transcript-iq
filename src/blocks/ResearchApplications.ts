import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const ResearchApplications: Block = {
  slug: 'researchApplications',
  labels: { singular: 'Research applications', plural: 'Research applications blocks' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'applications',
      type: 'array',
      minRows: 1,
      maxRows: 8,
      fields: [
        {
          name: 'number',
          type: 'text',
          required: true,
          admin: { description: 'e.g. "01 — Investment Research"' },
        },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        {
          name: 'tag',
          type: 'text',
          admin: { description: 'Short tag label on non-featured tiles (e.g. "↗ Pricing · Switching costs")' },
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description:
              'Mark the first (hero) tile featured — spans 7/12 columns on desktop and shows insight bars.',
          },
        },
        {
          name: 'insights',
          type: 'array',
          maxRows: 5,
          admin: { description: 'Signal-strength bars shown on the featured tile only.' },
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'percentage', type: 'number', min: 0, max: 100 },
          ],
        },
      ],
    },
    ...sectionBaseFields,
  ],
}
