import type { Block } from 'payload'
import { sectionBaseFields, ctaArrayField } from './_shared'

export const Hero: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'split',
      options: [
        { label: 'Split (text + visual)', value: 'split' },
        { label: 'Centered', value: 'center' },
        { label: 'Massive (oversized type)', value: 'massive' },
        { label: 'Full-bleed (image/video bg)', value: 'fullBleed' },
        { label: 'Mockup (text + product mockup)', value: 'mockup' },
        { label: 'Animated (text + animated SVG)', value: 'animated' },
        { label: 'Spotlight (cursor follow)', value: 'spotlight' },
        { label: 'Stencil (full-width 3-line + stats bar)', value: 'stencil' },
      ],
    },
    { name: 'eyebrow', type: 'text', admin: { description: 'Small label above the headline (optional).' } },
    {
      name: 'eyebrowStyle',
      type: 'select',
      defaultValue: 'pulse',
      options: [
        { label: 'Mint pill with pulse', value: 'pulse' },
        { label: 'Mono uppercase', value: 'mono' },
        { label: 'No eyebrow', value: 'none' },
      ],
    },
    { name: 'heading', type: 'text', required: true, admin: { description: 'Use double-asterisks **like this** to mint-gradient a phrase.' } },
    { name: 'subheading', type: 'textarea' },
    ctaArrayField,
    {
      name: 'visual',
      type: 'group',
      label: 'Right-column / background visual',
      admin: {
        condition: (_, sib) =>
          ['split', 'fullBleed', 'mockup', 'animated'].includes(sib?.variant),
      },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'video', type: 'text', admin: { description: 'Optional video URL or path.' } },
        {
          name: 'mockupType',
          type: 'select',
          defaultValue: 'callRecording',
          options: [
            { label: 'Call recording UI', value: 'callRecording' },
            { label: 'Transcript preview', value: 'transcriptPreview' },
            { label: 'Dashboard preview', value: 'dashboardPreview' },
            { label: 'Chart preview', value: 'chartPreview' },
          ],
          admin: { condition: (_, sib) => sib?.variant === 'mockup' },
        },
        {
          name: 'animatedDiagram',
          type: 'select',
          defaultValue: 'network',
          options: [
            { label: 'Network of nodes', value: 'network' },
            { label: 'Data flow', value: 'dataFlow' },
            { label: 'Pulse rings', value: 'pulseRings' },
            { label: 'Soundwave', value: 'soundwave' },
          ],
          admin: { condition: (_, sib) => sib?.variant === 'animated' },
        },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Stats strip below CTAs (optional)',
      maxRows: 6,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    ...sectionBaseFields,
  ],
}
