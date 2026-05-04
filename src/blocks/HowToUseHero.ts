import type { Block } from 'payload'
import { sectionBaseFields, ctaArrayField } from './_shared'

export const HowToUseHero: Block = {
  slug: 'howToUseHero',
  labels: { singular: 'How-to-use hero', plural: 'How-to-use heroes' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: { description: 'Use **text** to apply mint accent to a phrase.' },
    },
    { name: 'subheading', type: 'textarea' },
    ctaArrayField,
    {
      name: 'stats',
      type: 'array',
      label: 'Stat grid (below heading)',
      maxRows: 6,
      fields: [
        { name: 'value', type: 'text', required: true, admin: { description: 'e.g. "4" or "12–15"' } },
        { name: 'suffix', type: 'text', admin: { description: 'Optional small suffix (e.g. "min")' } },
        { name: 'label', type: 'text', required: true, admin: { description: 'Two-line label — use \\n for line break' } },
      ],
    },
    ...sectionBaseFields,
  ],
}
