import type { Block } from 'payload'
import { sectionBaseFields, cardHoverField, ctaArrayField } from './_shared'

export const FeatureSpotlight: Block = {
  slug: 'featureSpotlight',
  labels: { singular: 'Feature spotlight', plural: 'Feature spotlights' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'spotlight',
      type: 'group',
      label: 'Hero feature (large)',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        ctaArrayField,
        // ── Pricing card (right panel) ──────────────────────────────────────
        {
          name: 'pricingCard',
          // dbName shortens the Drizzle-generated identifiers.
          // Without this, the versions table name would be:
          //   _pages_v_blocks_feature_spotlight_spotlight_pricing_card_features
          // = 65 chars — over PostgreSQL's 63-char identifier limit.
          // With dbName: 'pc' it becomes:
          //   _pages_v_blocks_feature_spotlight_spotlight_pc_features = 55 chars ✓
          dbName: 'pc',
          type: 'group',
          label: 'Pricing card (right panel)',
          admin: {
            description:
              'Controls the price box shown to the right of the feature description. Leave fields blank to hide the card entirely.',
          },
          fields: [
            {
              name: 'eyebrow',
              type: 'text',
              defaultValue: 'Custom Transcript',
              admin: { description: 'Small label above the price (e.g. "Custom Transcript").' },
            },
            {
              name: 'price',
              type: 'text',
              defaultValue: '$899',
              admin: { description: 'Headline price — include the $ sign (e.g. "$899").' },
            },
            {
              name: 'priceLabel',
              type: 'text',
              defaultValue: 'per transcript · one-time fee',
              admin: { description: 'Subtext next to the price (e.g. "per transcript · one-time fee").' },
            },
            {
              name: 'features',
              type: 'array',
              label: 'Feature bullets',
              admin: { description: 'Checkmark list shown under the price.' },
              fields: [
                {
                  name: 'line',
                  type: 'text',
                  required: true,
                  admin: { placeholder: 'e.g. "MNPI-screened & PII-redacted transcript"' },
                },
              ],
            },
            {
              name: 'volumeNote',
              type: 'text',
              defaultValue: 'Volume pricing from $699/transcript for 5+ commissions',
              admin: {
                description: 'Small caps note at the bottom of the card (e.g. "Volume pricing from $699/…").',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'supporting',
      type: 'array',
      minRows: 2,
      maxRows: 4,
      labels: { singular: 'Supporting feature', plural: 'Supporting features' },
      fields: [
        { name: 'icon', type: 'text', admin: { description: 'Lucide icon name.' } },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    cardHoverField,
    ...sectionBaseFields,
  ],
}
