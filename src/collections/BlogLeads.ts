import type { CollectionConfig } from 'payload'

/**
 * Leads captured from the per-post lead form in the blog sidebar
 * (the "Request a conversation" form on /resources/[slug]).
 *
 * Created publicly via POST /api/blog-leads. Read/update/delete are admin-only.
 * `blogTitle` / `blogSlug` record which article produced the lead so the team
 * can attribute it. Mirrors the EvReportLeads pattern.
 */
export const BlogLeads: CollectionConfig = {
  slug: 'blog-leads',
  labels: { singular: 'Blog lead', plural: 'Blog leads' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role', 'blogTitle', 'status', 'createdAt'],
    group: 'Resources',
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
    { name: 'role', type: 'text', label: 'You are a…' },
    { name: 'company', type: 'text' },
    { name: 'message', type: 'textarea' },
    { name: 'blogTitle', type: 'text', admin: { readOnly: true } },
    { name: 'blogSlug', type: 'text', admin: { readOnly: true } },
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
