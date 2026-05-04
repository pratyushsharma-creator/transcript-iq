import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const ComparisonTicker: Block = {
  slug: 'comparisonTicker',
  labels: { singular: 'Comparison ticker (animated counters)', plural: 'Comparison tickers' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'left',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', required: true, admin: { description: 'e.g. "Traditional sourcing"' } },
        { name: 'value', type: 'text', required: true, admin: { description: 'e.g. "10 days", "$1,500/hr"' } },
        { name: 'note', type: 'text' },
      ],
    },
    {
      name: 'right',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', required: true, admin: { description: 'e.g. "Custom transcript"' } },
        { name: 'value', type: 'text', required: true, admin: { description: 'e.g. "36 hours", "$599 flat"' } },
        { name: 'note', type: 'text' },
      ],
    },
    {
      name: 'animateOnScroll',
      type: 'checkbox',
      defaultValue: true,
    },
    ...sectionBaseFields,
  ],
}
