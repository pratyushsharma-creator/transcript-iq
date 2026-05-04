import type { Block } from 'payload'

export const Divider: Block = {
  slug: 'divider',
  labels: { singular: 'Divider', plural: 'Dividers' },
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'hairline',
      options: [
        { label: 'Hairline (default border)', value: 'hairline' },
        { label: 'Mint accent line', value: 'accent' },
        { label: 'Decorative pattern', value: 'pattern' },
        { label: 'Section break (large gap with mark)', value: 'sectionBreak' },
      ],
    },
    {
      name: 'spacing',
      type: 'select',
      defaultValue: 'md',
      options: [
        { label: 'XS', value: 'xs' },
        { label: 'SM', value: 'sm' },
        { label: 'MD', value: 'md' },
        { label: 'LG', value: 'lg' },
        { label: 'XL', value: 'xl' },
      ],
    },
  ],
}

export const Spacer: Block = {
  slug: 'spacer',
  labels: { singular: 'Spacer', plural: 'Spacers' },
  fields: [
    {
      name: 'size',
      type: 'select',
      defaultValue: 'md',
      options: [
        { label: 'XS (16px)', value: 'xs' },
        { label: 'SM (32px)', value: 'sm' },
        { label: 'MD (64px)', value: 'md' },
        { label: 'LG (96px)', value: 'lg' },
        { label: 'XL (160px)', value: 'xl' },
      ],
    },
  ],
}

export const Anchor: Block = {
  slug: 'anchor',
  labels: { singular: 'Anchor (in-page nav target)', plural: 'Anchors' },
  fields: [
    { name: 'anchorId', type: 'text', required: true, admin: { description: 'No leading #. Used for jump links.' } },
  ],
}
