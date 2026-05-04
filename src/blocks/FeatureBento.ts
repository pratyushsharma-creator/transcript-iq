import type { Block } from 'payload'
import { sectionBaseFields, cardHoverField } from './_shared'

export const FeatureBento: Block = {
  slug: 'featureBento',
  labels: { singular: 'Feature bento', plural: 'Feature bentos' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'layout',
      type: 'select',
      defaultValue: '2-col-mixed',
      options: [
        { label: '2 columns, mixed sizes', value: '2-col-mixed' },
        { label: '3 columns, mixed sizes', value: '3-col-mixed' },
        { label: '1 large + 4 small', value: 'hero-and-quad' },
        { label: 'Asymmetric (Apple-style)', value: 'asymmetric' },
      ],
    },
    cardHoverField,
    {
      name: 'tiles',
      type: 'array',
      minRows: 3,
      maxRows: 8,
      fields: [
        {
          name: 'span',
          type: 'select',
          defaultValue: '1',
          options: [
            { label: 'Standard (1 col)', value: '1' },
            { label: 'Wide (2 col)', value: '2' },
            { label: 'Tall (1×2)', value: 'tall' },
            { label: 'Hero (2×2)', value: 'hero' },
          ],
        },
        { name: 'eyebrow', type: 'text' },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          name: 'tone',
          type: 'select',
          defaultValue: 'neutral',
          options: [
            { label: 'Neutral surface', value: 'neutral' },
            { label: 'Mint tinted', value: 'mint' },
            { label: 'Ink (dark contrast)', value: 'ink' },
            { label: 'Mesh gradient', value: 'mesh' },
          ],
        },
        { name: 'href', type: 'text' },
      ],
    },
    ...sectionBaseFields,
  ],
}
