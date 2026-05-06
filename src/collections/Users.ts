import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrSelf } from '../access/adminOnly'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    cookies: { secure: true, sameSite: 'Lax' },
    tokenExpiration: 60 * 60 * 24 * 30,
    useAPIKey: true,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'createdAt'],
  },
  access: {
    read: adminOrSelf,
    create: () => true,
    update: adminOrSelf,
    delete: adminOnly,
    admin: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      // Override the auto-generated apiKey field so only admin/editor roles see it in the admin UI.
      // Payload generates this field when useAPIKey: true — we override it here to add the condition.
      name: 'apiKey',
      type: 'text',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.role === 'admin' || siblingData?.role === 'editor',
      },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'customer',
      options: [
        { label: 'Customer', value: 'customer' },
        { label: 'Editor', value: 'editor' },
        { label: 'Admin', value: 'admin' },
      ],
      access: {
        update: ({ req }) => req.user?.role === 'admin',
      },
    },
    { name: 'company', type: 'text' },
    {
      name: 'stripeCustomerId',
      type: 'text',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'purchases',
      type: 'relationship',
      relationTo: ['expert-transcripts', 'earnings-analyses'],
      hasMany: true,
      admin: { readOnly: true },
    },
    {
      name: 'activeSubscription',
      type: 'relationship',
      relationTo: 'subscriptions',
    },
  ],
}
