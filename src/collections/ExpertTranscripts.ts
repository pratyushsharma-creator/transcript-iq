import type { CollectionConfig } from 'payload'
import { slugify } from '../lib/slugify'
import { publishedOnly } from '../access/publishedOnly'
import { CACHE_TAGS, revalidateOnPublish } from '@/lib/cache/revalidation'

export const ExpertTranscripts: CollectionConfig = {
  slug: 'expert-transcripts',
  labels: { singular: 'Expert transcript', plural: 'Expert transcripts' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'expertId', 'tier', 'priceUsd', 'dateConducted', 'featured', '_status'],
    group: 'Catalog',
  },
  versions: { drafts: true },
  access: { read: publishedOnly },
  fields: [
    // ── Identity ───────────────────────────────────────────────────────
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
      hooks: {
        beforeValidate: [
          ({ value, data }) => value || slugify(data?.title as string | undefined),
        ],
      },
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },

    // ── Expert profile (anonymized) ────────────────────────────────────
    {
      name: 'expertId',
      type: 'text',
      required: true,
      admin: { description: 'Format: EXP-001 (always anonymized).' },
    },
    {
      name: 'expertFormerTitle',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. "Former VP Engineering, Major SaaS Co" — never name companies.',
      },
    },
    {
      name: 'expertLevel',
      type: 'select',
      required: true,
      options: [
        { label: 'C-Suite', value: 'c-suite' },
        { label: 'VP', value: 'vp' },
        { label: 'Director', value: 'director' },
      ],
      admin: { position: 'sidebar' },
    },

    // ── Call details ───────────────────────────────────────────────────
    {
      name: 'dateConducted',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    { name: 'duration', type: 'number', label: 'Duration (minutes)' },
    { name: 'pageCount', type: 'number' },

    // ── Description / preview content ──────────────────────────────────
    {
      name: 'summary',
      type: 'textarea',
      maxLength: 500,
      admin: { description: 'One-paragraph public summary shown on listings.' },
    },
    {
      name: 'executiveSummaryPreview',
      type: 'textarea',
      maxLength: 800,
      admin: { description: 'Shown locked on the product detail page before purchase.' },
    },
    {
      name: 'topicsCovered',
      type: 'array',
      labels: { singular: 'Topic', plural: 'Topics covered' },
      fields: [{ name: 'topic', type: 'text', required: true }],
    },
    {
      name: 'sampleQA',
      type: 'group',
      label: 'Sample Q&A (locked teaser)',
      fields: [
        { name: 'question', type: 'textarea' },
        { name: 'answer', type: 'textarea' },
      ],
    },
    {
      name: 'fullTranscript',
      type: 'richText',
      label: 'Full transcript (gated content)',
    },
    {
      name: 'pdfFile',
      type: 'upload',
      relationTo: 'transcript-files',
      admin: {
        description: 'Upload the gated PDF here. Go to Transcript PDFs collection to manage existing uploads.',
      },
    },

    // ── Pricing & tier ─────────────────────────────────────────────────
    {
      name: 'tier',
      type: 'select',
      required: true,
      defaultValue: 'standard',
      options: [
        { label: 'Standard ($349)', value: 'standard' },
        { label: 'Premium ($449)', value: 'premium' },
        { label: 'Elite ($599)', value: 'elite' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'priceUsd',
      type: 'number',
      required: true,
      defaultValue: 349,
      admin: { position: 'sidebar' },
    },
    {
      name: 'originalPriceUsd',
      type: 'number',
      admin: { position: 'sidebar', description: 'Optional struck-through price for promo display.' },
    },
    {
      name: 'discountPercent',
      type: 'number',
      min: 0,
      max: 90,
      admin: { position: 'sidebar', description: '0 = no discount badge.' },
    },
    { name: 'priceInr', type: 'number', admin: { position: 'sidebar' } },
    {
      name: 'stripePriceId',
      type: 'text',
      admin: { readOnly: true, position: 'sidebar', description: 'Auto-synced via Stripe plugin (Phase G).' },
    },

    // ── Compliance & engagement ────────────────────────────────────────
    {
      name: 'complianceBadges',
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
    {
      name: 'engagementCopy',
      type: 'text',
      admin: { description: 'Optional social-proof line: e.g. "100+ buyers last 30 days · Popular among PE investors".' },
    },
    { name: 'featured', type: 'checkbox', admin: { position: 'sidebar' } },

    // ── Taxonomy ───────────────────────────────────────────────────────
    {
      name: 'sectors',
      type: 'relationship',
      relationTo: 'industries',
      hasMany: true,
    },
    {
      name: 'geography',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'North America', value: 'north-america' },
        { label: 'Europe', value: 'europe' },
        { label: 'Global', value: 'global' },
        { label: 'APAC', value: 'apac' },
      ],
    },
    {
      name: 'companies',
      type: 'relationship',
      relationTo: 'companies',
      hasMany: true,
      admin: { description: 'Companies discussed in this transcript.' },
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidateOnPublish(CACHE_TAGS.expertTranscripts, doc)
      },
    ],
  },
}
