import type { Block } from 'payload'
import { sectionBaseFields, ctaArrayField } from './_shared'

export const PersonaCarousel: Block = {
  slug: 'personaCarousel',
  labels: { singular: 'Persona carousel', plural: 'Persona carousels' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'personas',
      type: 'array',
      minRows: 2,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'tagline', type: 'text' },
        { name: 'body', type: 'richText' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        ctaArrayField,
      ],
    },
    ...sectionBaseFields,
  ],
}
