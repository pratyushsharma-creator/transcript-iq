import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const BeforeAfterSlider: Block = {
  slug: 'beforeAfterSlider',
  labels: { singular: 'Before/after slider', plural: 'Before/after sliders' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'before',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', defaultValue: 'Before' },
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
    {
      name: 'after',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', defaultValue: 'After' },
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
    ...sectionBaseFields,
  ],
}
