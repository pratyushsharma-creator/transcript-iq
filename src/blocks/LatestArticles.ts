import type { Block } from 'payload'
import { sectionBaseFields, cardHoverField } from './_shared'

export const LatestArticles: Block = {
  slug: 'latestArticles',
  labels: { singular: 'Latest articles', plural: 'Latest articles blocks' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'contentTypeFilter',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Educational', value: 'educational' },
        { label: 'Industry deep-dive', value: 'industry-deep-dive' },
        { label: 'Use case', value: 'use-case' },
        { label: 'Thought leadership', value: 'thought-leadership' },
        { label: 'Whitepaper', value: 'whitepaper' },
        { label: 'Case study', value: 'case-study' },
        { label: 'Pillar piece', value: 'pillar' },
      ],
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 3,
      min: 1,
      max: 9,
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'featured-with-aside',
      options: [
        { label: 'Featured with aside + 3-card row (V2 — recommended)', value: 'featured-with-aside' },
        { label: '3-card grid', value: 'grid-3' },
        { label: '2-card grid', value: 'grid-2' },
        { label: 'Compact list', value: 'list' },
      ],
    },
    cardHoverField,
    {
      name: 'showAllCta',
      type: 'group',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true },
        { name: 'label', type: 'text', defaultValue: 'Browse all resources' },
        { name: 'url', type: 'text', defaultValue: '/resources' },
      ],
    },
    {
      name: 'aside',
      type: 'group',
      label: 'Featured aside (Resources V2)',
      admin: {
        description:
          'Right-side aside for the featured article in V2 layout: pull quote + 1-2 stats. Only used when layout is "featured-with-aside".',
      },
      fields: [
        { name: 'asideLabel', type: 'text', defaultValue: 'From the article' },
        { name: 'pullQuote', type: 'textarea' },
        { name: 'pullQuoteAttr', type: 'text', admin: { description: 'e.g. "— FORMER VP, ASIA-PACIFIC EQUITY RESEARCH"' } },
        {
          name: 'stats',
          type: 'array',
          maxRows: 4,
          fields: [
            { name: 'value', type: 'text', required: true, admin: { description: 'e.g. "3-5×", "83%"' } },
            { name: 'label', type: 'text', required: true },
          ],
        },
      ],
    },
    ...sectionBaseFields,
  ],
}
