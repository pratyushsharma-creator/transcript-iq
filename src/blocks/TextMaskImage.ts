import type { Block } from 'payload'
import { sectionBaseFields, ctaArrayField } from './_shared'

export const TextMaskImage: Block = {
  slug: 'textMaskImage',
  labels: { singular: 'Text mask image', plural: 'Text mask blocks' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'maskedText', type: 'text', required: true, admin: { description: 'The big text whose letterforms reveal the image.' } },
    { name: 'subheading', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'maskFallback',
      type: 'select',
      defaultValue: 'mintGradient',
      options: [
        { label: 'Mint gradient', value: 'mintGradient' },
        { label: 'Solid mint', value: 'mintSolid' },
        { label: 'Solid ink', value: 'inkSolid' },
      ],
    },
    {
      name: 'parallax',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Image translates slightly on scroll behind the text.' },
    },
    ctaArrayField,
    ...sectionBaseFields,
  ],
}
