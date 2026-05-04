import type { Block } from 'payload'
import { sectionBaseFields, ctaArrayField } from './_shared'

export const SectionIntro: Block = {
  slug: 'sectionIntro',
  labels: { singular: 'Section intro', plural: 'Section intros' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'compact',
      options: [
        { label: 'Compact (left-aligned)', value: 'compact' },
        { label: 'Centered', value: 'centered' },
        { label: 'Massive (Apple scale)', value: 'massive' },
      ],
    },
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'lede', type: 'textarea' },
    ctaArrayField,
    ...sectionBaseFields,
  ],
}
