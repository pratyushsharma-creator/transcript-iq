import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const ImageCarousel: Block = {
  slug: 'imageCarousel',
  labels: { singular: 'Image carousel', plural: 'Image carousels' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'slides',
      type: 'array',
      minRows: 2,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'title', type: 'text' },
        { name: 'caption', type: 'text' },
        { name: 'href', type: 'text' },
      ],
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'autoplaySeconds',
      type: 'number',
      defaultValue: 5,
      min: 2,
      max: 15,
      admin: { condition: (_, sib) => sib?.autoplay === true },
    },
    {
      name: 'showDots',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showArrows',
      type: 'checkbox',
      defaultValue: true,
    },
    ...sectionBaseFields,
  ],
}
