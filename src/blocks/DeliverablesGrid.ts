import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const DeliverablesGrid: Block = {
  slug: 'deliverablesGrid',
  labels: { singular: 'Deliverables Grid', plural: 'Deliverables Grids' },
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
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2 columns', value: '2' },
        { label: '3 columns', value: '3' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'iconKey',
          type: 'select',
          defaultValue: 'document',
          options: [
            { label: 'Document / transcript', value: 'document' },
            { label: 'Clock / summary', value: 'clock' },
            { label: 'Person / profile', value: 'profile' },
            { label: 'Star / compliance', value: 'compliance' },
            { label: 'Arrow / custom', value: 'custom' },
            { label: 'Expedited / fast', value: 'expedited' },
          ],
        },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        {
          name: 'badge',
          type: 'text',
          admin: { description: 'Optional badge text (e.g. "⚡ PDF included"). Leave blank for no badge.' },
        },
        {
          name: 'badgeTone',
          type: 'select',
          defaultValue: 'amber',
          options: [
            { label: 'Amber (warning)', value: 'amber' },
            { label: 'Mint (accent)', value: 'mint' },
            { label: 'Muted', value: 'muted' },
          ],
        },
      ],
    },
    ...sectionBaseFields,
  ],
}
