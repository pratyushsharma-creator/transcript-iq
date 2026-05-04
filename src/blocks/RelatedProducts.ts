import type { Block } from 'payload'
import { sectionBaseFields, cardHoverField } from './_shared'

export const RelatedProducts: Block = {
  slug: 'relatedProducts',
  labels: { singular: 'Related products', plural: 'Related products blocks' },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: 'Related' },
    { name: 'heading', type: 'text', defaultValue: 'You might also like' },
    {
      name: 'matchBy',
      type: 'select',
      defaultValue: 'sectors',
      options: [
        { label: 'Same sectors', value: 'sectors' },
        { label: 'Same companies discussed', value: 'companies' },
        { label: 'Same expert level', value: 'expertLevel' },
        { label: 'Same tier', value: 'tier' },
      ],
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 3,
      min: 1,
      max: 8,
    },
    cardHoverField,
    ...sectionBaseFields,
  ],
}
