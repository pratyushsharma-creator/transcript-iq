import type { CollectionConfig } from 'payload'
import { slugify } from '../lib/slugify'
import { publishedOnly } from '../access/publishedOnly'
import { CACHE_TAGS, revalidateOnPublish } from '@/lib/cache/revalidation'
import { pingCollectionPage } from '@/lib/indexnow'

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
          ({ value, data }) => value || slugify(data?.title as string | undefined),
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
    { name: 'body', type: 'richText' },
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
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        const text = JSON.stringify(data?.body || '')
        const words = text.split(/\s+/).filter(Boolean).length
        data.readTime = Math.max(1, Math.round(words / 200))
        return data
      },
    ],
    afterChange: [
      ({ doc }) => {
        revalidateOnPublish(CACHE_TAGS.blogPosts, doc)
        if (doc._status === 'published' && doc.slug) {
          pingCollectionPage('/resources', doc.slug as string)
        }
      },
    ],
  },
}
