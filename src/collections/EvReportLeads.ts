import type { CollectionConfig } from 'payload'

/**
 * Leads captured from the EV Ecosystem report landing page (/reports/ev-ecosystem).
 *
 * Created publicly via POST /api/ev-report-leads (the "Talk to our Research Analyst"
 * form). Read/update/delete are admin-only. UTM params are captured client-side and
 * persisted here for campaign attribution.
 */
export const EvReportLeads: CollectionConfig = {
  slug: 'ev-report-leads',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'company', 'email', 'status', 'createdAt'],
    group: 'EV Report',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'company', type: 'text', required: true },
    { name: 'role', type: 'text' },
    { name: 'message', type: 'textarea', label: 'What are you trying to solve?' },
    { name: 'utm_source', type: 'text', admin: { readOnly: true } },
    { name: 'utm_medium', type: 'text', admin: { readOnly: true } },
    { name: 'utm_campaign', type: 'text', admin: { readOnly: true } },
    { name: 'utm_content', type: 'text', admin: { readOnly: true } },
    { name: 'page_referrer', type: 'text', admin: { readOnly: true } },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Qualified', value: 'qualified' },
        { label: 'Converted', value: 'converted' },
        { label: 'Not a fit', value: 'not_a_fit' },
      ],
    },
  ],
  timestamps: true,
}
