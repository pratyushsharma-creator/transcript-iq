import type { CollectionConfig } from 'payload'
import { slugify } from '../lib/slugify'

export const Industries: CollectionConfig = {
  slug: 'industries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'updatedAt'],
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
    { name: 'description', type: 'textarea' },
  ],
}
