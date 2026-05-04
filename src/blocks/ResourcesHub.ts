import type { Block } from 'payload'

export const ResourcesHub: Block = {
  slug: 'resourcesHub',
  labels: { singular: 'Resources Hub (grid + filter)', plural: 'Resources Hub blocks' },
  fields: [
    {
      name: 'pageSize',
      type: 'number',
      defaultValue: 9,
      min: 3,
      max: 24,
      admin: { description: 'Max articles shown in the grid (not counting featured).' },
    },
    {
      name: 'featuredSlug',
      type: 'text',
      admin: {
        description:
          'Slug of the blog post to pin as the featured article. Leave blank to auto-pick the most recent.',
      },
    },
    {
      name: 'newsletterEyebrow',
      type: 'text',
      defaultValue: 'Research Intelligence',
    },
    {
      name: 'newsletterHeading',
      type: 'text',
      defaultValue: 'New analyses, delivered to your inbox',
    },
    {
      name: 'newsletterBody',
      type: 'textarea',
      defaultValue:
        'Get notified when we publish new articles, use cases, and whitepapers on expert network research, compliance, and primary research strategy. No noise, no marketing. Just the research.',
    },
  ],
}
