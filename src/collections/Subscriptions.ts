import type { CollectionConfig } from 'payload'
import { adminOnly } from '../access/adminOnly'

export const Subscriptions: CollectionConfig = {
  slug: 'subscriptions',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'tier', 'status', 'currentPeriodEnd'],
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (!req.user) return false
      return { user: { equals: req.user.id } }
    },
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users', required: true },
    {
      name: 'tier',
      type: 'select',
      options: ['starter', 'professional', 'enterprise'],
    },
    {
      name: 'status',
      type: 'select',
      options: ['active', 'past_due', 'canceled', 'paused'],
      defaultValue: 'active',
    },
    {
      name: 'stripeSubscriptionId',
      type: 'text',
      unique: true,
      admin: { readOnly: true },
    },
    { name: 'currentPeriodEnd', type: 'date' },
    { name: 'cancelAt', type: 'date' },
  ],
}
