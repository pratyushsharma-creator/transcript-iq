import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const ImageMasonry: Block = {
  slug: 'imageMasonry',
  labels: { singular: 'Image masonry (varied heights)', plural: 'Image masonries' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: ['2', '3', '4'].map((v) => ({ label: `${v} columns`, value: v })),
    },
    {
      name: 'images',
      type: 'array',
      minRows: 4,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
    ...sectionBaseFields,
  ],
}
