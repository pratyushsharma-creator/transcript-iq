import type { Block } from 'payload'
import { sectionBaseFields, ctaArrayField } from './_shared'

export const ComplianceCallout: Block = {
  slug: 'complianceCallout',
  labels: { singular: 'Compliance callout', plural: 'Compliance callouts' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    {
      name: 'pillars',
      type: 'array',
      minRows: 2,
      maxRows: 6,
      fields: [
        {
          name: 'icon',
          type: 'select',
          defaultValue: 'shield-check',
          options: [
            { label: 'Shield (compliance)', value: 'shield-check' },
            { label: 'Lock (privacy)', value: 'lock' },
            { label: 'User (anonymity)', value: 'user-x' },
            { label: 'File (citation)', value: 'file-text' },
            { label: 'Check (verified)', value: 'check-circle' },
            { label: 'Eye (review)', value: 'eye' },
          ],
        },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    ctaArrayField,
    ...sectionBaseFields,
  ],
}
