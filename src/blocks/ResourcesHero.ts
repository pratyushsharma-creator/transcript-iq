import type { Block } from 'payload'

export const ResourcesHero: Block = {
  slug: 'resourcesHero',
  labels: { singular: 'Resources Hub Hero', plural: 'Resources Hub Heroes' },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: 'Research Hub' },
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: { description: 'Use \\n for line breaks, **text** for accent, ~~text~~ for ghost.' },
      defaultValue: 'Sharper research.\\n~~Better decisions.~~\\n**Deeper edge.**',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      defaultValue:
        'Guides, frameworks, and analysis for institutional research teams. Expert network workflows, MNPI compliance, and primary research strategy — from the Nextyn research desk.',
    },
    {
      name: 'stats',
      type: 'array',
      admin: { description: 'Two stats shown top-right (e.g. articles count, categories).' },
      maxRows: 2,
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
      defaultValue: [
        { value: '6', label: 'Published articles' },
        { value: '7', label: 'Topic categories' },
      ],
    },
  ],
}
