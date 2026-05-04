import type { CollectionConfig } from 'payload'
import { slugify } from '../lib/slugify'

export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      hooks: {
        beforeValidate: [
          ({ value, data }) => value || slugify(data?.name as string | undefined),
        ],
      },
    },
    { name: 'bio', type: 'textarea' },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
    { name: 'email', type: 'email' },
    { name: 'linkedIn', type: 'text', label: 'LinkedIn URL' },
    { name: 'twitter', type: 'text', label: 'Twitter/X URL' },
  ],
}
