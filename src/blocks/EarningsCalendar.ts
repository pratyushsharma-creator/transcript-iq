import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const EarningsCalendar: Block = {
  slug: 'earningsCalendar',
  labels: { singular: 'Earnings calendar', plural: 'Earnings calendars' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'window',
      type: 'select',
      defaultValue: 'next-30',
      options: [
        { label: 'Next 30 days', value: 'next-30' },
        { label: 'Next 90 days', value: 'next-90' },
        { label: 'Last 30 days', value: 'last-30' },
        { label: 'This quarter', value: 'this-quarter' },
      ],
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 8,
      min: 4,
      max: 24,
    },
    ...sectionBaseFields,
  ],
}
