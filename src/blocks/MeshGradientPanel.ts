import type { Block } from 'payload'
import { sectionBaseFields, ctaArrayField } from './_shared'

export const MeshGradientPanel: Block = {
  slug: 'meshGradientPanel',
  labels: { singular: 'Mesh gradient panel', plural: 'Mesh gradient panels' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'textarea' },
    ctaArrayField,
    {
      name: 'animated',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Slowly drift the gradient stops over time.' },
    },
    {
      name: 'intensity',
      type: 'select',
      defaultValue: 'subtle',
      options: [
        { label: 'Subtle', value: 'subtle' },
        { label: 'Medium', value: 'medium' },
        { label: 'Vivid', value: 'vivid' },
      ],
    },
    {
      name: 'minHeightVh',
      type: 'number',
      defaultValue: 60,
      min: 30,
      max: 100,
      admin: { description: 'Minimum panel height as % of viewport.' },
    },
    ...sectionBaseFields,
  ],
}
