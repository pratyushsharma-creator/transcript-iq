import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const UseCasesBento: Block = {
  slug: 'useCasesBento',
  labels: { singular: 'Use Cases Bento', plural: 'Use Cases Bentos' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: { description: 'Use **text** for mint italic accent.' },
    },
    { name: 'description', type: 'textarea' },
    {
      name: 'cases',
      type: 'array',
      minRows: 2,
      fields: [
        {
          name: 'persona',
          type: 'text',
          required: true,
          admin: { description: 'Persona badge label (e.g. "PE / VC")' },
        },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        {
          name: 'colSpan',
          type: 'select',
          defaultValue: '4',
          label: 'Grid column width (of 12)',
          options: [
            { label: '3 columns', value: '3' },
            { label: '4 columns', value: '4' },
            { label: '5 columns', value: '5' },
          ],
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Featured card: mint gradient border + accent tint background.' },
        },
      ],
    },
    ...sectionBaseFields,
  ],
}
