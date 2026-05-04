import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const TestimonialBlock: Block = {
  slug: 'testimonial',
  labels: { singular: 'Testimonial', plural: 'Testimonial blocks' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'single',
      options: [
        { label: 'Single (centered, large)', value: 'single' },
        { label: 'Grid (multiple side-by-side)', value: 'grid' },
        { label: 'Carousel (cycling)', value: 'carousel' },
      ],
    },
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    {
      name: 'testimonials',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'quote', type: 'textarea', required: true },
        { name: 'authorName', type: 'text', required: true },
        { name: 'authorTitle', type: 'text' },
        { name: 'authorCompany', type: 'text' },
        { name: 'authorImage', type: 'upload', relationTo: 'media' },
        { name: 'logoImage', type: 'upload', relationTo: 'media', admin: { description: 'Optional company logo.' } },
      ],
    },
    ...sectionBaseFields,
  ],
}
