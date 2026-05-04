import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const ImageBlock: Block = {
  slug: 'imageBlock',
  labels: { singular: 'Image', plural: 'Image blocks' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'caption', type: 'text' },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'standard',
      options: [
        { label: 'Standard (max-width)', value: 'standard' },
        { label: 'Framed (rounded card)', value: 'framed' },
        { label: 'Full bleed', value: 'fullBleed' },
        { label: 'Overlay text on image', value: 'overlay' },
      ],
    },
    {
      name: 'overlayText',
      type: 'group',
      admin: { condition: (_, sib) => sib?.variant === 'overlay' },
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'subheading', type: 'textarea' },
      ],
    },
    {
      name: 'aspectRatio',
      type: 'select',
      defaultValue: 'auto',
      options: [
        { label: 'Auto (intrinsic)', value: 'auto' },
        { label: '16:9', value: '16-9' },
        { label: '4:3', value: '4-3' },
        { label: '1:1 square', value: '1-1' },
        { label: '3:4 portrait', value: '3-4' },
      ],
    },
    ...sectionBaseFields,
  ],
}
