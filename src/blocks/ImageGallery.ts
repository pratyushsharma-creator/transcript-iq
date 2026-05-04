import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const ImageGallery: Block = {
  slug: 'imageGallery',
  labels: { singular: 'Image gallery (uniform grid)', plural: 'Image galleries' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: ['2', '3', '4', '5'].map((v) => ({ label: `${v} columns`, value: v })),
    },
    {
      name: 'images',
      type: 'array',
      minRows: 2,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
    ...sectionBaseFields,
  ],
}
