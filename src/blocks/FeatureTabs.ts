import type { Block } from 'payload'
import { sectionBaseFields, ctaArrayField } from './_shared'

export const FeatureTabs: Block = {
  slug: 'featureTabs',
  labels: { singular: 'Feature tabs', plural: 'Feature tabs blocks' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'tabs',
      type: 'array',
      minRows: 2,
      maxRows: 6,
      fields: [
        { name: 'tabLabel', type: 'text', required: true },
        { name: 'icon', type: 'text', admin: { description: 'Optional Lucide icon name on the tab.' } },
        { name: 'panelTitle', type: 'text', required: true },
        { name: 'panelBody', type: 'textarea' },
        { name: 'panelImage', type: 'upload', relationTo: 'media' },
        ctaArrayField,
      ],
    },
    {
      name: 'orientation',
      type: 'select',
      defaultValue: 'horizontal',
      options: [
        { label: 'Horizontal tabs (top)', value: 'horizontal' },
        { label: 'Vertical tabs (left rail)', value: 'vertical' },
      ],
    },
    ...sectionBaseFields,
  ],
}
