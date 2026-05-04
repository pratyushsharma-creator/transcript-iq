import type { CollectionConfig } from 'payload'
import { slugify } from '../lib/slugify'
import { publishedOnly } from '../access/publishedOnly'

export const Bundles: CollectionConfig = {
  slug: 'bundles',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'bundlePriceUsd', 'savingsPercent', 'featured', '_status'],
    group: 'Catalog',
  },
  versions: { drafts: true },
  access: { read: publishedOnly },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
      hooks: {
        beforeValidate: [
          ({ value, data }) => value || slugify(data?.name as string | undefined),
        ],
      },
    },
    { name: 'tagline', type: 'text' },
    { name: 'description', type: 'textarea', maxLength: 500 },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    {
      name: 'items',
      label: 'Bundle items',
      type: 'relationship',
      relationTo: ['expert-transcripts', 'earnings-analyses'],
      hasMany: true,
      required: true,
      admin: { description: 'Mix transcripts and earnings analyses freely in a bundle.' },
    },
    {
      name: 'bundlePriceUsd',
      type: 'number',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'originalTotalUsd',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Sum of products if bought separately. Used for struck-through display.',
      },
    },
    {
      name: 'savingsPercent',
      type: 'number',
      min: 0,
      max: 90,
      admin: { position: 'sidebar' },
    },
    { name: 'featured', type: 'checkbox', admin: { position: 'sidebar' } },
  ],
}
