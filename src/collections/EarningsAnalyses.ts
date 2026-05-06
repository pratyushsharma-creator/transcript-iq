import type { CollectionConfig } from 'payload'
import { slugify } from '../lib/slugify'
import { publishedOnly } from '../access/publishedOnly'
import { adminOrEditor } from '../access/adminOnly'
import { CACHE_TAGS, revalidateOnPublish } from '@/lib/cache/revalidation'
import { pingCollectionPage } from '@/lib/indexnow'

export const EarningsAnalyses: CollectionConfig = {
  slug: 'earnings-analyses',
  labels: { singular: 'Earnings analysis', plural: 'Earnings analyses' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'ticker', 'quarter', 'fiscalYear', 'priceUsd', 'featured', '_status'],
    group: 'Catalog',
    description: 'Each document = one earnings analysis product. Fill in all Basics first, then add Content, then publish.',
  },
  versions: { drafts: true },
  access: { read: publishedOnly, create: adminOrEditor, update: adminOrEditor },
  fields: [
    // ── Sidebar ───────────────────────────────────────────────────────────
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar', description: 'Auto-generated from title. Edit only if needed.' },
      hooks: {
        beforeValidate: [
          ({ value, data }) => value || slugify(data?.title as string | undefined),
        ],
      },
    },
    { name: 'featured', type: 'checkbox', admin: { position: 'sidebar', description: 'Pin to top of listing page.' } },
    {
      name: 'priceUsd',
      type: 'number',
      required: true,
      defaultValue: 99,
      admin: { position: 'sidebar', description: 'Earnings analyses are flat-priced. Default $99.' },
    },
    {
      name: 'originalPriceUsd',
      type: 'number',
      admin: { position: 'sidebar', description: 'Optional struck-through price shown beside the live price.' },
    },
    {
      name: 'discountPercent',
      type: 'number',
      min: 0,
      max: 90,
      admin: { position: 'sidebar', description: 'Leave blank if no discount badge needed.' },
    },
    { name: 'priceInr', type: 'number', label: 'Price (INR)', admin: { position: 'sidebar' } },
    {
      name: 'stripePriceId',
      type: 'text',
      admin: { readOnly: true, position: 'sidebar', description: 'Auto-synced via Stripe (Phase G). Do not edit manually.' },
    },
    { name: 'pageCount', type: 'number', label: 'Page count', admin: { position: 'sidebar' } },
    {
      name: 'metaTitle',
      type: 'text',
      maxLength: 120,
      admin: { position: 'sidebar', description: 'SEO / OG title override (max 120 chars). Leave blank to auto-generate.' },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      maxLength: 300,
      admin: { position: 'sidebar', description: 'SEO / OG description override (max 300 chars, displayed truncated to 160). Leave blank to auto-generate from summary.' },
    },

    // ── Tabbed main area ──────────────────────────────────────────────────
    {
      type: 'tabs',
      tabs: [
        // ─────────────────────────────────────────────────────────────────
        // Tab 1 — Basics
        // ─────────────────────────────────────────────────────────────────
        {
          label: 'Basics',
          description: 'Company identity, call details, and taxonomy',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: { description: 'e.g. "Apple — Q2 FY2026 Earnings Analysis"' },
            },
            {
              name: 'companyName',
              type: 'text',
              required: true,
              admin: { description: 'Full legal / trading name, e.g. "Apple Inc."' },
            },
            // Ticker + Exchange side by side
            {
              type: 'row',
              fields: [
                {
                  name: 'ticker',
                  type: 'text',
                  required: true,
                  admin: { description: 'Uppercase, no $ — e.g. AAPL' },
                },
                {
                  name: 'exchange',
                  type: 'select',
                  required: true,
                  options: ['NASDAQ', 'NYSE', 'NSE', 'BSE', 'LSE', 'HKEX', 'SGX', 'TSE', 'ASX'],
                },
              ],
            },
            // Quarter + Fiscal Year + Report Date side by side
            {
              type: 'row',
              fields: [
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
                  label: 'Call / report date',
                  admin: { date: { pickerAppearance: 'dayOnly' } },
                },
              ],
            },
            {
              name: 'sectors',
              type: 'relationship',
              relationTo: 'industries',
              hasMany: true,
              admin: { description: 'Primary sectors this company operates in.' },
            },
            {
              name: 'companies',
              type: 'relationship',
              relationTo: 'companies',
              hasMany: true,
              admin: { description: 'Other companies discussed — peers, suppliers, customers.' },
            },
            { name: 'coverImage', type: 'upload', relationTo: 'media' },
          ],
        },

        // ─────────────────────────────────────────────────────────────────
        // Tab 2 — Performance
        // ─────────────────────────────────────────────────────────────────
        {
          label: 'Performance',
          description: 'EPS / revenue outcome signals and compliance labels',
          fields: [
            // Performance badges — shown as a "select all" with clear colour cues
            {
              name: 'performanceBadges',
              type: 'select',
              hasMany: true,
              admin: {
                description:
                  'Select every badge that applies. These appear as coloured chips on the card (green = beat, red = miss, grey = in-line). Tip: click the field to open the dropdown, then tick each applicable option.',
              },
              options: [
                { label: '↑  EPS BEAT', value: 'eps-beat' },
                { label: '↓  EPS MISS', value: 'eps-miss' },
                { label: '—  EPS IN-LINE', value: 'eps-in-line' },
                { label: '↑  REV BEAT', value: 'rev-beat' },
                { label: '↓  REV MISS', value: 'rev-miss' },
                { label: '—  REV IN-LINE', value: 'rev-in-line' },
              ],
            },
            {
              name: 'complianceBadges',
              type: 'select',
              hasMany: true,
              defaultValue: ['mnpi-screened', 'pii-redacted', 'compliance-certified'],
              admin: {
                description:
                  'Compliance certifications shown on the product detail page. All three are pre-selected by default — remove only if this analysis is an exception.',
              },
              options: [
                { label: 'MNPI Screened', value: 'mnpi-screened' },
                { label: 'PII Redacted', value: 'pii-redacted' },
                { label: 'Compliance Certified', value: 'compliance-certified' },
              ],
            },
            {
              name: 'engagementCopy',
              type: 'text',
              admin: {
                description:
                  'Social-proof line shown at the bottom of the listing card. e.g. "Same-day delivery · Buy-side ready"',
              },
            },
          ],
        },

        // ─────────────────────────────────────────────────────────────────
        // Tab 3 — Content
        // ─────────────────────────────────────────────────────────────────
        {
          label: 'Content',
          description: 'Public summaries, key metrics, topics, and the locked teaser',
          fields: [
            {
              name: 'summary',
              type: 'textarea',
              admin: {
                description:
                  'Public one-paragraph summary — shown on the listing card and in search engine results. Keep it analytical and buyer-focused.',
              },
            },
            {
              name: 'executiveSummaryPreview',
              type: 'richText',
              admin: {
                description:
                  'Shown blurred/locked on the product detail page before purchase. Use headings, bullet lists, and multiple paragraphs — this is rich text so the full Lexical editor is available.',
              },
            },
            {
              name: 'keyMetrics',
              type: 'array',
              labels: { singular: 'Metric', plural: 'Key metrics' },
              admin: {
                description:
                  'Headline financials shown in the mini-table on the listing card (max 3 visible). e.g. Services Revenue → $24.2B → +14% YoY',
              },
              fields: [
                {
                  name: 'metric',
                  type: 'text',
                  required: true,
                  admin: { placeholder: 'e.g. Services Revenue' },
                },
                {
                  name: 'value',
                  type: 'text',
                  required: true,
                  admin: { placeholder: 'e.g. $24.2B' },
                },
                {
                  name: 'yoyChange',
                  type: 'text',
                  label: 'YoY change',
                  admin: { placeholder: 'e.g. +14%  or  ↑14%  or  -3%' },
                },
              ],
            },
            {
              name: 'keyTopics',
              type: 'array',
              labels: { singular: 'Topic', plural: 'Key topics' },
              admin: {
                description:
                  'Themes covered in the analysis — shown as tags on the card. e.g. iPhone Demand, Services Revenue, India Growth, AI Investment.',
              },
              fields: [
                {
                  name: 'topic',
                  type: 'text',
                  required: true,
                  admin: { placeholder: 'e.g. iPhone Demand' },
                },
              ],
            },
            {
              name: 'sampleQA',
              type: 'group',
              label: 'Sample Q&A excerpt (locked teaser)',
              admin: {
                description:
                  'A representative Q&A shown blurred on the product page to demonstrate analysis depth. Pick something substantive — not a softball question.',
              },
              fields: [
                {
                  name: 'question',
                  type: 'textarea',
                  admin: {
                    placeholder:
                      'e.g. Can you walk us through what drove the Services outperformance this quarter, and how sustainable is that trajectory?',
                  },
                },
                {
                  name: 'answer',
                  type: 'textarea',
                  admin: {
                    placeholder: 'Paste the anonymised excerpt from the call transcript or analysis.',
                  },
                },
              ],
            },
          ],
        },

        // ─────────────────────────────────────────────────────────────────
        // Tab 4 — Full Analysis (gated)
        // ─────────────────────────────────────────────────────────────────
        {
          label: 'Full Analysis',
          description: 'Gated content — only accessible after purchase',
          fields: [
            {
              name: 'fullAnalysis',
              type: 'richText',
              label: 'Full analysis (gated content)',
              admin: {
                description:
                  'Use headings, bullet lists, and callout blocks to structure the analysis. This is the buyer-facing document delivered in the PDF.',
              },
            },
            {
              name: 'pdfFile',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'Upload the final PDF once generated. Buyers receive a download link for this file immediately after purchase.',
              },
            },
          ],
        },
      ],
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
