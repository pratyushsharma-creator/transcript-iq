import type { Block } from 'payload'
import { sectionBaseFields, ctaArrayField } from './_shared'

export const CTASplit: Block = {
  slug: 'ctaSplit',
  labels: { singular: 'CTA split (text + form)', plural: 'CTA splits' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'textarea' },
    ctaArrayField,
    {
      name: 'rightSide',
      type: 'select',
      defaultValue: 'newsletter',
      options: [
        { label: 'Newsletter signup form', value: 'newsletter' },
        { label: 'Free transcript form', value: 'freeTranscript' },
        { label: 'Custom commission form', value: 'commission' },
        { label: 'Image / mockup', value: 'image' },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { condition: (_, sib) => sib?.rightSide === 'image' },
    },
    {
      name: 'formProof',
      type: 'text',
      admin: { description: 'Optional micro-proof under the form, e.g. "2,400+ analysts have claimed theirs".' },
    },
    ...sectionBaseFields,
  ],
}
