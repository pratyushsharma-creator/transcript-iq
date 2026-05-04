import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const RoleCards: Block = {
  slug: 'roleCards',
  labels: { singular: 'Role cards', plural: 'Role cards blocks' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'cards',
      type: 'array',
      minRows: 2,
      maxRows: 8,
      fields: [
        {
          name: 'persona',
          type: 'text',
          required: true,
          admin: { description: 'Role badge label (e.g. "PE / Growth Equity Analyst")' },
        },
        { name: 'title', type: 'text', required: true },
        {
          name: 'workflow',
          type: 'array',
          maxRows: 6,
          admin: {
            description:
              'Workflow stages shown as a breadcrumb beneath the title (e.g. "Deal screening → IC memo")',
          },
          fields: [{ name: 'step', type: 'text', required: true }],
        },
        { name: 'description', type: 'textarea' },
      ],
    },
    ...sectionBaseFields,
  ],
}
