import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const NewsletterSignup: Block = {
  slug: 'newsletterSignup',
  labels: { singular: 'Newsletter signup', plural: 'Newsletter signups' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'textarea' },
    { name: 'placeholder', type: 'text', defaultValue: 'work@email.com' },
    { name: 'submitLabel', type: 'text', defaultValue: 'Subscribe' },
    { name: 'consent', type: 'text', defaultValue: 'No spam. Unsubscribe anytime. 1 research briefing per week.' },
    { name: 'socialProof', type: 'text', admin: { description: 'e.g. "2,400+ analysts subscribed".' } },
    ...sectionBaseFields,
  ],
}
