import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrSelf } from '../access/adminOnly'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    cookies: { secure: true, sameSite: 'Lax' },
    tokenExpiration: 60 * 60 * 24 * 30,
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
      // Personal MCP/Claude API key — auto-generated for admin/editor accounts.
      // Only visible to admin and editor roles in the Payload admin UI.
      name: 'mcpApiKey',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Your personal API key for MCP and Claude integration. Auto-generated — copy this into your Claude Desktop config as TIQ_API_KEY.',
        condition: (_, siblingData) =>
          siblingData?.role === 'admin' || siblingData?.role === 'editor',
      },
      hooks: {
        beforeChange: [
          ({ value, previousValue, siblingData }) => {
            // Preserve existing key — readOnly fields come back as undefined from admin saves
            if (previousValue) return previousValue
            const role = (siblingData as Record<string, unknown>)?.role
            // Auto-generate a UUID key for admin/editor users who don't have one yet
            if (!value && (role === 'admin' || role === 'editor')) {
              return crypto.randomUUID()
            }
            return value ?? undefined
          },
        ],
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
