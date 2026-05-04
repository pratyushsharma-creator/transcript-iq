import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const FormBlock: Block = {
  slug: 'formBlock',
  labels: { singular: 'Form', plural: 'Form blocks' },
  fields: [
    {
      name: 'formType',
      type: 'select',
      required: true,
      defaultValue: 'contact',
      options: [
        { label: 'Contact (general)', value: 'contact' },
        { label: 'Custom commission (transcript brief)', value: 'commission' },
        { label: 'Free transcript request', value: 'freeTranscript' },
        { label: 'Waitlist (e.g. Conferences product)', value: 'waitlist' },
        { label: 'Enterprise enquiry', value: 'enterprise' },
      ],
    },
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    { name: 'submitLabel', type: 'text', defaultValue: 'Submit' },
    {
      name: 'successMessage',
      type: 'text',
      defaultValue: 'Thank you. We’ll be in touch within 24 hours.',
    },
    { name: 'errorMessage', type: 'text', defaultValue: 'Something went wrong. Please try again or email us.' },
    {
      name: 'recipient',
      type: 'email',
      admin: { description: 'Where should this form’s submissions be sent? Defaults to global setting.' },
    },
    ...sectionBaseFields,
  ],
}
