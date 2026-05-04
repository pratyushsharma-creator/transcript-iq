import type { Block } from 'payload'
import { sectionBaseFields, ctaArrayField } from './_shared'

export const Callout: Block = {
  slug: 'callout',
  labels: { singular: 'Callout', plural: 'Callouts' },
  fields: [
    {
      name: 'tone',
      type: 'select',
      defaultValue: 'info',
      options: [
        { label: 'Info (mint)', value: 'info' },
        { label: 'Note (neutral)', value: 'note' },
        { label: 'Warning (amber-equiv via mint contrast)', value: 'warning' },
        { label: 'Success (mint solid)', value: 'success' },
      ],
    },
    {
      name: 'icon',
      type: 'text',
      admin: { description: 'Lucide icon name (e.g. "info", "alert-triangle").' },
    },
    { name: 'heading', type: 'text' },
    { name: 'body', type: 'textarea', required: true },
    ctaArrayField,
    ...sectionBaseFields,
  ],
}
