import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const TrustNumbers: Block = {
  slug: 'trustNumbers',
  labels: { singular: 'Trust numbers', plural: 'Trust numbers blocks' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'stats',
      type: 'array',
      minRows: 2,
      maxRows: 6,
      fields: [
        { name: 'value', type: 'text', required: true, admin: { description: 'e.g. "200+", "50K", "36h"' } },
        { name: 'label', type: 'text', required: true },
        { name: 'sublabel', type: 'text' },
      ],
    },
    {
      name: 'animateOnScroll',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Numbers count up when in view (only works for purely numeric values).' },
    },
    ...sectionBaseFields,
  ],
}
