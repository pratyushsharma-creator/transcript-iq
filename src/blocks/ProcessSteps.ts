import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const ProcessSteps: Block = {
  slug: 'processSteps',
  labels: { singular: 'Process steps', plural: 'Process steps blocks' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'horizontal',
      options: [
        { label: 'Horizontal (3-5 steps in a row)', value: 'horizontal' },
        { label: 'Vertical (timeline)', value: 'vertical' },
        { label: 'Flow (animated SVG flowchart)', value: 'flow' },
      ],
    },
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'numbering',
      type: 'select',
      defaultValue: 'mono',
      options: [
        { label: 'Mono labels (01 / 02)', value: 'mono' },
        { label: 'Massive numbers (Apple-scale)', value: 'massive' },
        { label: 'Icon only (no number)', value: 'iconOnly' },
        { label: 'Both icon and number', value: 'iconAndNumber' },
      ],
    },
    {
      name: 'steps',
      type: 'array',
      minRows: 2,
      maxRows: 6,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        {
          name: 'icon',
          type: 'select',
          options: [
            'search',
            'wallet',
            'book-open',
            'sparkles',
            'shield-check',
            'file-text',
            'send',
            'check-circle',
            'phone',
            'edit',
            'package',
            'download',
            'mail',
            'users',
            'credit-card',
          ].map((v) => ({ label: v, value: v })),
        },
        { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Optional supporting image.' } },
        {
          name: 'visualRows',
          type: 'array',
          maxRows: 4,
          labels: { singular: 'Visual row', plural: 'Mini visual artifact rows' },
          admin: {
            description: 'Small product-mockup rows shown inside the step card (label + optional tag/value).',
          },
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'tag', type: 'text', admin: { description: 'Optional right-side chip (e.g. "$NVDA", "✓").' } },
            {
              name: 'tone',
              type: 'select',
              defaultValue: 'accent',
              options: [
                { label: 'Accent (mint)', value: 'accent' },
                { label: 'Neutral', value: 'neutral' },
                { label: 'Muted (struck-through)', value: 'muted' },
              ],
            },
          ],
        },
      ],
    },
    ...sectionBaseFields,
  ],
}
