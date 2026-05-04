import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const ImageReveal: Block = {
  slug: 'imageReveal',
  labels: { singular: 'Image reveal (scroll mask)', plural: 'Image reveals' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'body', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'revealStyle',
      type: 'select',
      defaultValue: 'mask-up',
      options: [
        { label: 'Mask up (slides up)', value: 'mask-up' },
        { label: 'Iris (center expand)', value: 'iris' },
        { label: 'Sweep right', value: 'sweep-right' },
        { label: 'Pixelate in', value: 'pixelate' },
      ],
    },
    ...sectionBaseFields,
  ],
}
