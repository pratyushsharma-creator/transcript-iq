import type { Block } from 'payload'

export const FreeTranscriptHero: Block = {
  slug: 'freeTranscriptHero',
  labels: { singular: 'Free Transcript Hero', plural: 'Free Transcript Heroes' },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'Free · No Credit Card',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: {
        description:
          'Use \\n for line breaks, **text** for accent green, ~~text~~ for ghost/stroke-only.',
      },
      defaultValue: 'Your first\\n~~expert call~~\\n**transcript. Free.**',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      defaultValue:
        'Get one MNPI-screened expert call transcript delivered to your inbox — matched to your sector. No subscription, no billing details. Just the research.',
    },
    {
      name: 'checklist',
      type: 'array',
      fields: [{ name: 'item', type: 'text', required: true }],
      defaultValue: [
        { item: 'Full verbatim transcript PDF, not a summary' },
        { item: 'Executive summary written by our research team' },
        { item: 'MNPI-screened · PII-redacted · Compliance certified' },
        { item: 'Matched to your chosen sector — not a random pick' },
        { item: 'Delivered within 24 hours of signup' },
      ],
    },
    {
      name: 'socialProof',
      type: 'text',
      defaultValue: '400+ analysts claimed their free transcript this month',
    },
    {
      name: 'sectors',
      type: 'array',
      admin: { description: 'Sector buttons in the claim card (max 6)' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
      defaultValue: [
        { label: 'Technology / SaaS', value: 'tech' },
        { label: 'Healthcare', value: 'health' },
        { label: 'Financial Services', value: 'fin' },
        { label: 'Industrials', value: 'ind' },
        { label: 'Consumer', value: 'cons' },
        { label: 'Energy', value: 'energy' },
      ],
    },
    {
      name: 'ctaLabel',
      type: 'text',
      defaultValue: 'Get My Free Transcript',
    },
    {
      name: 'complianceItems',
      type: 'array',
      fields: [{ name: 'label', type: 'text', required: true }],
      defaultValue: [
        { label: 'MNPI Screened' },
        { label: 'PII Redacted' },
        { label: 'PDF Yours Forever' },
      ],
    },
  ],
}
