import type { CollectionConfig } from 'payload'
import { slugify } from '../lib/slugify'

export const Companies: CollectionConfig = {
  slug: 'companies',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'ticker', 'exchange', 'updatedAt'],
    group: 'Catalog',
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
          ({ value, data }) =>
            value || slugify((data?.ticker as string | undefined) ?? (data?.name as string | undefined)),
        ],
      },
    },
    { name: 'ticker', type: 'text', admin: { description: 'e.g. AAPL — uppercase, no $' } },
    {
      name: 'exchange',
      type: 'select',
      options: ['NASDAQ', 'NYSE', 'NSE', 'BSE', 'LSE', 'HKEX', 'SGX', 'TSE', 'ASX', 'PRIVATE'],
    },
    { name: 'sector', type: 'relationship', relationTo: 'industries' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'description', type: 'textarea' },
  ],
}
