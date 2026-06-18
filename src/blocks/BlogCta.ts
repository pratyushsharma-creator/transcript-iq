import type { Block } from 'payload'

/**
 * In-body CTA banner for blog posts.
 *
 * Inserted inline ANYWHERE in a post's `body` rich text via the Lexical
 * BlocksFeature wired up in collections/BlogPosts.ts. Every field is editable
 * per insertion, so each blog — and each placement within a blog — can carry
 * its own eyebrow, headline, subline, button label and link.
 *
 * The block's data is stored inside the body's JSON column, so this needs no
 * database migration.
 */
export const BlogCta: Block = {
  slug: 'blogCta',
  interfaceName: 'BlogCtaBlock',
  labels: { singular: 'CTA banner', plural: 'CTA banners' },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'Free to claim',
      admin: { description: 'Small uppercase label above the headline. Leave blank to hide it.' },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'See what an institutional-grade transcript looks like',
    },
    {
      name: 'subline',
      type: 'textarea',
      admin: { description: 'Supporting sentence under the headline.' },
    },
    {
      name: 'buttonLabel',
      type: 'text',
      required: true,
      defaultValue: 'Claim your free transcript',
    },
    {
      name: 'buttonUrl',
      type: 'text',
      required: true,
      defaultValue: '/free-transcript',
      admin: {
        description: 'Where the button links — a path like /free-transcript or a full https:// URL.',
      },
    },
  ],
}
