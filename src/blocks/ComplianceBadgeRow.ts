import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const ComplianceBadgeRow: Block = {
  slug: 'complianceBadgeRow',
  labels: { singular: 'Compliance badge row', plural: 'Compliance badge rows' },
  fields: [
    { name: 'eyebrow', type: 'text', admin: { description: 'Optional eyebrow above badges.' } },
    { name: 'heading', type: 'text', admin: { description: 'Optional heading.' } },
    {
      name: 'badges',
      type: 'select',
      hasMany: true,
      defaultValue: ['mnpi-screened', 'pii-redacted', 'compliance-certified', 'expert-anonymised'],
      options: [
        { label: 'MNPI Screened', value: 'mnpi-screened' },
        { label: 'PII Redacted', value: 'pii-redacted' },
        { label: 'Compliance Certified', value: 'compliance-certified' },
        { label: 'Expert Anonymised', value: 'expert-anonymised' },
        { label: 'Same-day delivery', value: 'same-day-delivery' },
        { label: 'Instant PDF', value: 'instant-pdf' },
        { label: 'No subscription', value: 'no-subscription' },
      ],
    },
    {
      name: 'alignment',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
      ],
    },
    ...sectionBaseFields,
  ],
}
