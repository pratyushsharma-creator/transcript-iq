import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const PricingComparison: Block = {
  slug: 'pricingComparison',
  labels: { singular: 'Pricing Comparison', plural: 'Pricing Comparisons' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: { description: 'Use **text** for mint italic accent.' },
    },
    { name: 'description', type: 'textarea' },
    // ── Left panel (your offering) ───────────────────────────────────────────
    {
      name: 'leftPanel',
      type: 'group',
      label: 'Left panel — your offer',
      fields: [
        { name: 'panelLabel', type: 'text', admin: { description: 'e.g. "Custom Transcript — Starting price"' } },
        { name: 'amount', type: 'text', required: true, admin: { description: 'e.g. "$599"' } },
        { name: 'period', type: 'text', admin: { description: 'e.g. "· one-time"' } },
        { name: 'note', type: 'textarea' },
        {
          name: 'features',
          type: 'array',
          label: 'Feature list (green checkmarks)',
          fields: [{ name: 'text', type: 'text', required: true }],
        },
      ],
    },
    // ── Right panel (comparison) ─────────────────────────────────────────────
    {
      name: 'rightPanel',
      type: 'group',
      label: 'Right panel — comparison',
      fields: [
        { name: 'panelLabel', type: 'text', admin: { description: 'e.g. "vs. Traditional expert networks"' } },
        { name: 'amount', type: 'text', required: true },
        { name: 'period', type: 'text' },
        {
          name: 'amountColor',
          type: 'select',
          defaultValue: 'warning',
          enumName: 'pc_right_amount_color',
          options: [
            { label: 'Mint (accent)', value: 'accent' },
            { label: 'Amber (warning)', value: 'warning' },
          ],
        },
        { name: 'note', type: 'textarea' },
        {
          name: 'features',
          type: 'array',
          label: 'Feature list (X marks, negative)',
          fields: [{ name: 'text', type: 'text', required: true }],
        },
      ],
    },
    // ── CTA panel ────────────────────────────────────────────────────────────
    {
      name: 'ctaPanel',
      type: 'group',
      label: 'CTA panel (third column)',
      fields: [
        { name: 'overline', type: 'text', admin: { description: 'Small mono overline text' } },
        { name: 'heading', type: 'text', required: true },
        { name: 'body', type: 'textarea' },
        { name: 'primaryLabel', type: 'text', required: true },
        { name: 'primaryUrl', type: 'text', required: true },
        { name: 'browseLinkLabel', type: 'text', admin: { description: 'Optional secondary browse link text' } },
        { name: 'browseLinkUrl', type: 'text' },
      ],
    },
    ...sectionBaseFields,
  ],
}
