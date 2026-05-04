import type { CollectionConfig } from 'payload'
import { slugify } from '../lib/slugify'
import { publishedOnly } from '../access/publishedOnly'
import { CACHE_TAGS, revalidateOnPublish } from '@/lib/cache/revalidation'
import { pingCollectionPage } from '@/lib/indexnow'

export const EarningsAnalyses: CollectionConfig = {
  slug: 'earnings-analyses',
  labels: { singular: 'Earnings analysis', plural: 'Earnings analyses' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'ticker', 'quarter', 'fiscalYear', 'priceUsd', 'featured', '_status'],
    group: 'Catalog',
  },
  versions: { drafts: true },
  access: { read: publishedOnly },
  fields: [
    // ── Identity ───────────────────────────────────────────────────────
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'e.g. "Apple — Q2 FY2026 Earnings Analysis"' },
    },
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

    // ── Company & quarter identifiers ──────────────────────────────────
    { name: 'companyName', type: 'text', required: true, admin: { description: 'e.g. "Apple Inc."' } },
    { name: 'ticker', type: 'text', required: true, admin: { description: 'e.g. AAPL — uppercase, no $.' } },
    {
      name: 'exchange',
      type: 'select',
      required: true,
      options: ['NASDAQ', 'NYSE', 'NSE', 'BSE', 'LSE', 'HKEX', 'SGX', 'TSE', 'ASX'],
    },
    {
      name: 'quarter',
      type: 'select',
      required: true,
      options: ['Q1', 'Q2', 'Q3', 'Q4', 'FY'],
    },
    { name: 'fiscalYear', type: 'number', required: true },
    {
      name: 'reportDate',
      type: 'date',
      required: true,
      label: 'Earnings call / report date',
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },

    // ── Performance signals (the badges shown on the card) ─────────────
    {
      name: 'performanceBadges',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'EPS BEAT', value: 'eps-beat' },
        { label: 'EPS MISS', value: 'eps-miss' },
        { label: 'EPS IN-LINE', value: 'eps-in-line' },
        { label: 'REV BEAT', value: 'rev-beat' },
        { label: 'REV MISS', value: 'rev-miss' },
        { label: 'REV IN-LINE', value: 'rev-in-line' },
      ],
    },

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
      name: 'keyTopics',
      type: 'array',
      labels: { singular: 'Topic', plural: 'Key topics covered' },
      admin: { description: 'e.g. iPhone Demand, Services Revenue, Apple Intelligence, India Growth.' },
      fields: [{ name: 'topic', type: 'text', required: true }],
    },
    {
      name: 'keyMetrics',
      type: 'array',
      labels: { singular: 'Metric', plural: 'Key metrics' },
      admin: { description: 'Headline metrics surfaced on the analysis (e.g. Services revenue $24.2B, +14% YoY).' },
      fields: [
        { name: 'metric', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
        { name: 'yoyChange', type: 'text', label: 'YoY change' },
      ],
    },
    {
      name: 'sampleQA',
      type: 'group',
      label: 'Sample Q&A excerpt (locked teaser)',
      fields: [
        { name: 'question', type: 'textarea' },
        { name: 'answer', type: 'textarea' },
      ],
    },
    {
      name: 'fullAnalysis',
      type: 'richText',
      label: 'Full analysis (gated content)',
    },
    { name: 'pdfFile', type: 'upload', relationTo: 'media' },
    { name: 'pageCount', type: 'number', admin: { position: 'sidebar' } },

    // ── Pricing (flat $99 by default) ──────────────────────────────────
    {
      name: 'priceUsd',
      type: 'number',
      required: true,
      defaultValue: 99,
      admin: { position: 'sidebar', description: 'Earnings analyses are flat-priced by default.' },
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
      admin: { position: 'sidebar' },
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
      defaultValue: ['mnpi-screened', 'pii-redacted', 'compliance-certified'],
      options: [
        { label: 'MNPI Screened', value: 'mnpi-screened' },
        { label: 'PII Redacted', value: 'pii-redacted' },
        { label: 'Compliance Certified', value: 'compliance-certified' },
      ],
    },
    {
      name: 'engagementCopy',
      type: 'text',
      admin: { description: 'Optional social-proof line (e.g. "Same-day delivery · Buy-side ready").' },
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
      name: 'companies',
      type: 'relationship',
      relationTo: 'companies',
      hasMany: true,
      admin: { description: 'Other companies discussed (peers, suppliers, customers).' },
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidateOnPublish(CACHE_TAGS.earningsAnalyses, doc)
        if (doc._status === 'published' && doc.slug) {
          pingCollectionPage('/earnings-analysis', doc.slug as string)
        }
      },
    ],
  },
}
