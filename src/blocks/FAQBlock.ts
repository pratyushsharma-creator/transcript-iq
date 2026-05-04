import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const FAQBlock: Block = {
  slug: 'faq',
  labels: { singular: 'FAQ', plural: 'FAQ blocks' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'hairline',
      options: [
        { label: 'Hairline divided list', value: 'hairline' },
        { label: 'Boxed (bordered card)', value: 'boxed' },
        { label: 'Two-column', value: 'twoColumn' },
      ],
    },
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'defaultOpen',
      type: 'select',
      defaultValue: 'first',
      options: [
        { label: 'First open', value: 'first' },
        { label: 'All open', value: 'all' },
        { label: 'All closed', value: 'none' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'richText', required: true },
      ],
    },
    {
      name: 'contactLabel',
      type: 'text',
      defaultValue: 'Still have questions?',
      admin: { description: 'Label above the contact link in the sidebar.' },
    },
    {
      name: 'contactEmail',
      type: 'email',
      admin: { description: 'Contact email shown in the FAQ sidebar.' },
    },
    ...sectionBaseFields,
  ],
}
