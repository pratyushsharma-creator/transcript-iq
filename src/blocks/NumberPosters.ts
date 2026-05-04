import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const NumberPosters: Block = {
  slug: 'numberPosters',
  labels: { singular: 'Number posters', plural: 'Number poster blocks' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'posters',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      fields: [
        { name: 'number', type: 'text', required: true, admin: { description: 'e.g. "247", "$349", "36h"' } },
        { name: 'caption', type: 'text', required: true },
        { name: 'subcaption', type: 'text' },
        {
          name: 'tone',
          type: 'select',
          defaultValue: 'mintGradient',
          options: [
            { label: 'Mint gradient', value: 'mintGradient' },
            { label: 'Ink solid', value: 'inkSolid' },
            { label: 'Mint solid', value: 'mintSolid' },
            { label: 'Outline (stroke only)', value: 'outline' },
          ],
        },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'horizontal',
      options: [
        { label: 'Horizontal row', value: 'horizontal' },
        { label: 'Stacked vertically', value: 'stacked' },
        { label: 'Single oversized', value: 'single' },
      ],
    },
    ...sectionBaseFields,
  ],
}
