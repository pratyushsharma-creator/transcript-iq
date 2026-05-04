import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const CommissioningSteps: Block = {
  slug: 'commissioningSteps',
  labels: { singular: 'Commissioning Steps', plural: 'Commissioning Steps sections' },
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
      name: 'steps',
      type: 'array',
      minRows: 2,
      maxRows: 6,
      fields: [
        {
          name: 'stepNumber',
          type: 'text',
          required: true,
          admin: { description: 'e.g. "01"' },
        },
        {
          name: 'stepLabel',
          type: 'text',
          required: true,
          admin: { description: 'Short verb label, e.g. "Submit"' },
        },
        {
          name: 'iconKey',
          type: 'select',
          defaultValue: 'submit',
          options: [
            { label: 'Submit (document)', value: 'submit' },
            { label: 'Match (people)', value: 'match' },
            { label: 'Call (phone)', value: 'call' },
            { label: 'Deliver (checkmark)', value: 'deliver' },
          ],
        },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        {
          name: 'timing',
          type: 'text',
          admin: { description: 'e.g. "Takes < 5 minutes"' },
        },
      ],
    },
    ...sectionBaseFields,
  ],
}
