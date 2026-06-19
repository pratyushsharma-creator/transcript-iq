import type { CollectionConfig } from 'payload'
import { lexicalEditor, BlocksFeature } from '@payloadcms/richtext-lexical'
import { slugify } from '../lib/slugify'
import { publishedOnly } from '../access/publishedOnly'
import { adminOrEditor } from '../access/adminOnly'
import { CACHE_TAGS, revalidateOnPublish } from '@/lib/cache/revalidation'
import { pingCollectionPage } from '@/lib/indexnow'
import { BlogCta } from '../blocks/BlogCta'
import { StatGrid } from '../blocks/StatGrid'

// Show a leadForm sub-field only when the form is enabled on this post.
const whenLeadFormEnabled = (_: unknown, siblingData: Record<string, unknown>) =>
  Boolean(siblingData?.enabled)

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  labels: { singular: 'Blog post', plural: 'Blog posts' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'publishedAt', '_status'],
  },
  versions: { drafts: true },
  access: {
    read: publishedOnly,
    create: adminOrEditor,
    update: adminOrEditor,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      hooks: {
        beforeValidate: [
          ({ value, data }) => slugify((value ?? data?.title) as string | undefined),
        ],
      },
    },
    {
      name: 'contentType',
      type: 'select',
      defaultValue: 'educational',
      required: true,
      options: [
        { label: 'Educational', value: 'educational' },
        { label: 'Industry deep-dive', value: 'industry-deep-dive' },
        { label: 'Use case', value: 'use-case' },
        { label: 'Thought leadership', value: 'thought-leadership' },
        { label: 'Whitepaper', value: 'whitepaper' },
        { label: 'Case study', value: 'case-study' },
        { label: 'Pillar piece', value: 'pillar' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'author', type: 'relationship', relationTo: 'authors' },
    { name: 'categories', type: 'relationship', relationTo: 'categories', hasMany: true },
    { name: 'industries', type: 'relationship', relationTo: 'industries', hasMany: true },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'excerpt', type: 'textarea', maxLength: 280 },
    {
      name: 'body',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          // In-body blocks — insertable anywhere in the article, editable per insertion.
          BlocksFeature({ blocks: [BlogCta, StatGrid] }),
        ],
      }),
    },
    {
      name: 'readTime',
      type: 'number',
      admin: { description: 'Auto-calculated on save', readOnly: true, position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      defaultValue: () => new Date(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
    { name: 'featured', type: 'checkbox', admin: { position: 'sidebar' } },
    {
      name: 'leadForm',
      type: 'group',
      label: 'Sidebar lead form',
      admin: {
        description:
          'A sticky "request a conversation" form shown in this article\'s sidebar. Fully editable per post.',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
          label: 'Show the lead form on this post',
        },
        {
          name: 'eyebrow',
          type: 'text',
          defaultValue: 'Talk to an expert',
          admin: { condition: whenLeadFormEnabled },
        },
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'Request a conversation',
          admin: { condition: whenLeadFormEnabled },
        },
        {
          name: 'subline',
          type: 'textarea',
          defaultValue:
            "Tell us what you're researching and we'll line up the right expert call for your team.",
          admin: { condition: whenLeadFormEnabled },
        },
        {
          name: 'selectLabel',
          type: 'text',
          label: 'Dropdown label',
          defaultValue: 'You are a…',
          admin: { condition: whenLeadFormEnabled },
        },
        {
          name: 'selectOptions',
          type: 'textarea',
          label: 'Dropdown options (one per line)',
          defaultValue: [
            'Private equity / venture / hedge fund',
            'Management or strategy consultant',
            'Corporate strategy / corp-dev',
            'OEM / automotive',
            'Energy / utility / charging operator',
            'Policy / public sector',
            'Other',
          ].join('\n'),
          admin: {
            description: 'One option per line. Leave blank to hide the dropdown.',
            condition: whenLeadFormEnabled,
          },
        },
        {
          name: 'collectCompany',
          type: 'checkbox',
          label: 'Also collect a Company field',
          defaultValue: false,
          admin: { condition: whenLeadFormEnabled },
        },
        {
          name: 'collectMessage',
          type: 'checkbox',
          label: 'Also collect a free-text message',
          defaultValue: false,
          admin: { condition: whenLeadFormEnabled },
        },
        {
          name: 'submitLabel',
          type: 'text',
          defaultValue: 'Request conversation',
          admin: { condition: whenLeadFormEnabled },
        },
        {
          name: 'successMessage',
          type: 'textarea',
          defaultValue: 'Thank you — we’ll be in touch within one business day.',
          admin: { condition: whenLeadFormEnabled },
        },
        {
          name: 'fineprint',
          type: 'text',
          defaultValue: 'No spam · Response within 1 business day',
          admin: { condition: whenLeadFormEnabled },
        },
        {
          name: 'recipient',
          type: 'email',
          label: 'Notify this email (optional)',
          admin: {
            description:
              'Where submissions are emailed. Leave blank to use the site default notification address.',
            condition: whenLeadFormEnabled,
          },
        },
        {
          name: 'recipientCc',
          type: 'text',
          label: 'CC these emails (optional)',
          admin: {
            description:
              'Comma-separated emails to CC on this post’s lead notifications, in addition to the site default CC list.',
            condition: whenLeadFormEnabled,
          },
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        try {
          const text = JSON.stringify(data?.body || '')
          const words = text.split(/\s+/).filter(Boolean).length
          data.readTime = Math.max(1, Math.round(words / 200))
        } catch {
          // non-critical — readTime remains whatever it was
        }
        return data
      },
    ],
    afterChange: [
      ({ doc }) => {
        try {
          revalidateOnPublish(CACHE_TAGS.blogPosts, doc)
          if (doc._status === 'published' && doc.slug) {
            pingCollectionPage('/resources', doc.slug as string)
          }
        } catch (err) {
          console.error('[BlogPosts afterChange] hook error — save succeeded, revalidation skipped:', err)
        }
      },
    ],
  },
}
