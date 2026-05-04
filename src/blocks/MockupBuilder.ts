import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const MockupBuilder: Block = {
  slug: 'mockupBuilder',
  labels: { singular: 'Mockup builder', plural: 'Mockup builders' },
  fields: [
    {
      name: 'mockupType',
      type: 'select',
      required: true,
      defaultValue: 'callRecording',
      options: [
        { label: 'Call recording UI', value: 'callRecording' },
        { label: 'Transcript preview', value: 'transcriptPreview' },
        { label: 'Dashboard preview', value: 'dashboardPreview' },
        { label: 'Chart preview', value: 'chartPreview' },
        { label: 'Compliance certificate', value: 'complianceCert' },
        { label: 'Email inbox', value: 'emailInbox' },
      ],
    },
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    // Call recording specific
    {
      name: 'callContent',
      type: 'group',
      label: 'Call recording content',
      admin: { condition: (_, sib) => sib?.mockupType === 'callRecording' },
      fields: [
        { name: 'analystName', type: 'text', defaultValue: 'Research Analyst' },
        { name: 'expertName', type: 'text', defaultValue: 'Former VP, Healthcare' },
        {
          name: 'lines',
          type: 'array',
          minRows: 2,
          fields: [
            {
              name: 'speaker',
              type: 'select',
              required: true,
              options: [
                { label: 'Analyst', value: 'analyst' },
                { label: 'Expert', value: 'expert' },
              ],
            },
            { name: 'text', type: 'textarea', required: true },
          ],
        },
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
          ],
        },
      ],
    },
    // Transcript preview specific
    {
      name: 'transcriptContent',
      type: 'group',
      label: 'Transcript preview content',
      admin: { condition: (_, sib) => sib?.mockupType === 'transcriptPreview' },
      fields: [
        { name: 'documentTitle', type: 'text' },
        { name: 'expertId', type: 'text', defaultValue: 'EXP-247' },
        { name: 'sector', type: 'text' },
        {
          name: 'sections',
          type: 'array',
          fields: [
            { name: 'heading', type: 'text', required: true },
            { name: 'preview', type: 'textarea' },
          ],
        },
      ],
    },
    // Dashboard preview specific
    {
      name: 'dashboardContent',
      type: 'group',
      label: 'Dashboard preview content',
      admin: { condition: (_, sib) => sib?.mockupType === 'dashboardPreview' },
      fields: [
        {
          name: 'tiles',
          type: 'array',
          maxRows: 6,
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'value', type: 'text', required: true },
            { name: 'delta', type: 'text', admin: { description: 'e.g. "+24%" or "—"' } },
          ],
        },
      ],
    },
    // Chart preview specific
    {
      name: 'chartContent',
      type: 'group',
      label: 'Chart preview content',
      admin: { condition: (_, sib) => sib?.mockupType === 'chartPreview' },
      fields: [
        { name: 'title', type: 'text' },
        {
          name: 'chartType',
          type: 'select',
          defaultValue: 'sparkline',
          options: [
            { label: 'Sparkline', value: 'sparkline' },
            { label: 'Bar chart', value: 'bars' },
            { label: 'Area chart', value: 'area' },
          ],
        },
        {
          name: 'dataPoints',
          type: 'array',
          fields: [{ name: 'value', type: 'number', required: true }],
        },
      ],
    },
    {
      name: 'frameStyle',
      type: 'select',
      defaultValue: 'glass',
      options: [
        { label: 'Glassmorphism (frosted)', value: 'glass' },
        { label: 'Surface card', value: 'surface' },
        { label: 'Borderless', value: 'borderless' },
      ],
    },
    ...sectionBaseFields,
  ],
}
