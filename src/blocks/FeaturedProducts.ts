import type { Block } from 'payload'
import { sectionBaseFields, cardHoverField } from './_shared'

export const FeaturedProducts: Block = {
  slug: 'featuredProducts',
  labels: { singular: 'Featured products', plural: 'Featured products blocks' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'productSource',
      type: 'select',
      required: true,
      defaultValue: 'expert-transcripts',
      options: [
        { label: 'Expert transcripts', value: 'expert-transcripts' },
        { label: 'Earnings analyses', value: 'earnings-analyses' },
        { label: 'Both (mixed)', value: 'mixed' },
      ],
    },
    {
      name: 'mode',
      type: 'select',
      defaultValue: 'auto',
      options: [
        { label: 'Auto (filter-driven)', value: 'auto' },
        { label: 'Manual selection', value: 'manual' },
      ],
    },
    // ── Manual selection ──────────────────────────────────────────────
    {
      name: 'manualTranscripts',
      type: 'relationship',
      relationTo: 'expert-transcripts',
      hasMany: true,
      admin: {
        condition: (_, sib) =>
          sib?.mode === 'manual' && (sib?.productSource === 'expert-transcripts' || sib?.productSource === 'mixed'),
      },
    },
    {
      name: 'manualAnalyses',
      type: 'relationship',
      relationTo: 'earnings-analyses',
      hasMany: true,
      admin: {
        condition: (_, sib) =>
          sib?.mode === 'manual' && (sib?.productSource === 'earnings-analyses' || sib?.productSource === 'mixed'),
      },
    },
    // ── Auto filtering ────────────────────────────────────────────────
    {
      name: 'autoFilters',
      type: 'group',
      label: 'Auto-filter rules',
      admin: { condition: (_, sib) => sib?.mode === 'auto' },
      fields: [
        {
          name: 'onlyFeatured',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Only items marked Featured.' },
        },
        {
          name: 'sectors',
          type: 'relationship',
          relationTo: 'industries',
          hasMany: true,
        },
        {
          name: 'tier',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Standard', value: 'standard' },
            { label: 'Premium', value: 'premium' },
            { label: 'Elite', value: 'elite' },
          ],
        },
        {
          name: 'sortBy',
          type: 'select',
          defaultValue: 'newest',
          options: [
            { label: 'Newest first', value: 'newest' },
            { label: 'Featured first, then newest', value: 'featuredFirst' },
            { label: 'Most expensive first', value: 'priceDesc' },
          ],
        },
      ],
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 3,
      min: 1,
      max: 12,
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid-2',
      options: [
        { label: '2-card grid (large)', value: 'grid-2' },
        { label: '3-card grid', value: 'grid-3' },
        { label: '4-card grid', value: 'grid-4' },
        { label: 'Compact list (rows)', value: 'list' },
        { label: 'Carousel', value: 'carousel' },
      ],
    },
    cardHoverField,
    {
      name: 'showAllCta',
      type: 'group',
      label: 'See-all CTA below cards',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true },
        { name: 'label', type: 'text', defaultValue: 'See all transcripts' },
        { name: 'url', type: 'text', defaultValue: '/expert-transcripts' },
      ],
    },
    ...sectionBaseFields,
  ],
}
