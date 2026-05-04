import type { CollectionConfig } from 'payload'
import { adminOnly } from '../access/adminOnly'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['customerEmail', 'totalUsd', 'currency', 'status', 'createdAt'],
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (!req.user) return false
      return { user: { equals: req.user.id } }
    },
    create: adminOnly,
    update: adminOnly,
    delete: () => false,
  },
  fields: [
    // Guest-friendly customer identity (always populated)
    {
      name: 'customerEmail',
      type: 'email',
      required: true,
      admin: { description: 'Buyer email — from Stripe session.' },
    },
    {
      name: 'customerName',
      type: 'text',
      admin: { description: 'Buyer full name.' },
    },
    {
      name: 'organisation',
      type: 'text',
      admin: { description: 'Buyer organisation / company.' },
    },
    // Optional link to a Payload user account (populated when auth exists)
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false,
    },
    // Purchased items — stored as JSON snapshots so the order is self-contained
    {
      name: 'lineItems',
      type: 'json',
      required: true,
      admin: {
        description:
          'JSON array of { slug, type, title, ticker?, quarter?, priceUsd } — snapshot at time of purchase.',
      },
    },
    // Legacy relationship field kept for backwards compatibility
    {
      name: 'items',
      type: 'relationship',
      relationTo: ['expert-transcripts', 'earnings-analyses'],
      hasMany: true,
    },
    { name: 'totalUsd', type: 'number', required: true },
    { name: 'totalInr', type: 'number' },
    {
      name: 'currency',
      type: 'select',
      options: ['usd', 'inr'],
      required: true,
      defaultValue: 'usd',
    },
    {
      name: 'status',
      type: 'select',
      options: ['pending', 'paid', 'refunded', 'failed'],
      defaultValue: 'pending',
      required: true,
    },
    {
      name: 'paymentProvider',
      type: 'select',
      options: ['stripe', 'razorpay'],
      defaultValue: 'stripe',
    },
    { name: 'orderRef', type: 'text', admin: { readOnly: true, description: 'Human-readable order reference, e.g. TIQ-2026-12345.' } },
    { name: 'stripeCheckoutId', type: 'text', admin: { readOnly: true } },
    { name: 'stripePaymentIntentId', type: 'text', admin: { readOnly: true } },
    { name: 'razorpayOrderId', type: 'text', admin: { readOnly: true } },
    { name: 'invoiceUrl', type: 'text' },
    // Billing snapshot
    {
      name: 'billingAddress',
      type: 'json',
      admin: { description: 'Billing address snapshot from checkout form.' },
    },
  ],
}
