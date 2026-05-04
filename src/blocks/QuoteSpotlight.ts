import type { Block } from 'payload'
import { sectionBaseFields, ctaArrayField } from './_shared'

export const QuoteSpotlight: Block = {
  slug: 'quoteSpotlight',
  labels: { singular: 'Quote spotlight (founder voice)', plural: 'Quote spotlights' },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: 'Operating principle' },
    { name: 'quote', type: 'textarea', required: true },
    { name: 'attributionName', type: 'text', defaultValue: 'Pratyush Sharma' },
    { name: 'attributionRole', type: 'text', defaultValue: 'AVP Marketing & Growth, Nextyn' },
    { name: 'attributionImage', type: 'upload', relationTo: 'media' },
    ctaArrayField,
    {
      name: 'visualBg',
      type: 'select',
      defaultValue: 'mintTint',
      options: [
        { label: 'Mint tint full bleed', value: 'mintTint' },
        { label: 'Mesh gradient', value: 'mesh' },
        { label: 'Ink (dark contrast)', value: 'ink' },
        { label: 'Clean', value: 'clean' },
      ],
    },
    ...sectionBaseFields,
  ],
}
