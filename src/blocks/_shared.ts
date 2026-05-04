import type { Field } from 'payload'

/**
 * Common section-level fields every block accepts: background treatment,
 * vertical spacing, and an optional in-page anchor ID.
 */
export const sectionBaseFields: Field[] = [
  {
    type: 'row',
    fields: [
      {
        name: 'background',
        type: 'select',
        defaultValue: 'clean',
        options: [
          { label: 'Clean', value: 'clean' },
          { label: 'Glow (mint corners)', value: 'glow' },
          { label: 'Dot grid', value: 'grid' },
          { label: 'Grid lines', value: 'mesh' },
          { label: 'Flood (mint tint)', value: 'flood' },
        ],
        admin: { width: '50%' },
      },
      {
        name: 'spacing',
        type: 'select',
        defaultValue: 'default',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Default', value: 'default' },
          { label: 'Spacious', value: 'spacious' },
        ],
        admin: { width: '50%' },
      },
    ],
  },
  {
    name: 'anchorId',
    type: 'text',
    admin: { description: 'Optional in-page anchor ID for jump links (no leading #).' },
  },
]

export const cardHoverField: Field = {
  name: 'cardHover',
  type: 'select',
  defaultValue: 'lift',
  options: [
    { label: 'None', value: 'none' },
    { label: 'Lift', value: 'lift' },
    { label: 'Moving border (mint trace)', value: 'moving-border' },
    { label: 'Spotlight (cursor follow)', value: 'spotlight' },
  ],
}

export const ctaArrayField: Field = {
  name: 'ctas',
  type: 'array',
  maxRows: 3,
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'url', type: 'text', required: true },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'primary',
      options: [
        { label: 'Primary (mint)', value: 'primary' },
        { label: 'Secondary (outline)', value: 'secondary' },
        { label: 'Ghost (text only)', value: 'ghost' },
        { label: 'Tertiary (mint underline)', value: 'tertiary' },
      ],
    },
    {
      name: 'magnetic',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Magnetic cursor pull on hover.' },
    },
  ],
}
