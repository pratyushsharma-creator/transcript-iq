import type { Block } from 'payload'
import { sectionBaseFields, cardHoverField } from './_shared'

export const PersonaGrid: Block = {
  slug: 'personaGrid',
  labels: { singular: 'Persona grid', plural: 'Persona grids' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '4',
      options: [
        { label: '2 columns', value: '2' },
        { label: '3 columns', value: '3' },
        { label: '4 columns', value: '4' },
      ],
    },
    cardHoverField,
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'standard',
      options: [
        { label: 'Standard grid (N cards equal, geometric markers)', value: 'standard' },
        { label: 'Bento (first persona featured with snippet)', value: 'bento' },
        { label: 'Guidebook (left text + CTA, right stacked cards)', value: 'guidebook' },
      ],
    },
    {
      name: 'guidebookCta',
      type: 'group',
      label: 'Guidebook CTA (guidebook layout only)',
      admin: {
        description:
          'Primary CTA button shown in the left column when layout is guidebook (e.g. "Download Free Guidebook").',
      },
      fields: [
        { name: 'label', type: 'text', defaultValue: 'Download Free Guidebook' },
        { name: 'url', type: 'text', defaultValue: '/free-transcript' },
      ],
    },
    {
      name: 'cards',
      type: 'array',
      minRows: 2,
      maxRows: 6,
      labels: { singular: 'Persona card', plural: 'Persona cards' },
      fields: [
        {
          name: 'icon',
          type: 'select',
          defaultValue: 'diamond',
          options: [
            { label: 'Diamond ◆', value: 'diamond' },
            { label: 'Inverse diamond ◇', value: 'diamondOpen' },
            { label: 'Grid ▣', value: 'grid' },
            { label: 'Triangle ▲', value: 'triangle' },
            { label: 'Square ■', value: 'square' },
            { label: 'Circle ●', value: 'circle' },
          ],
        },
        { name: 'title', type: 'text', required: true, admin: { description: 'e.g. "Private Equity"' } },
        { name: 'description', type: 'textarea' },
        {
          name: 'bullets',
          type: 'array',
          maxRows: 5,
          admin: {
            description: 'Optional bullet points (used in featured bento variant).',
          },
          fields: [{ name: 'item', type: 'text', required: true }],
        },
        {
          name: 'snippet',
          type: 'group',
          label: 'Featured persona transcript snippet (bento layout only)',
          admin: {
            description:
              'Used on the featured persona card in bento layout to show a real transcript exchange.',
          },
          fields: [
            { name: 'expertId', type: 'text', defaultValue: 'EXP-247' },
            { name: 'duration', type: 'text', defaultValue: '47:21' },
            {
              name: 'lines',
              type: 'array',
              maxRows: 4,
              fields: [
                {
                  name: 'speaker',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Analyst', value: 'analyst' },
                    { label: 'Expert', value: 'expert' },
                  ],
                },
                {
                  name: 'text',
                  type: 'textarea',
                  required: true,
                  admin: { description: 'Wrap a key phrase in **double asterisks** to highlight it.' },
                },
              ],
            },
          ],
        },
        { name: 'href', type: 'text', admin: { description: 'Optional link to deeper detail.' } },
      ],
    },
    ...sectionBaseFields,
  ],
}
