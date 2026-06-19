import type { Block } from 'payload'

/**
 * In-body "number cards" grid for blog posts.
 *
 * Like blogCta (see blocks/BlogCta.ts), this is an inline Lexical block wired
 * up via the BlocksFeature in collections/BlogPosts.ts. Its data lives inside
 * the post body's JSON column, so it needs no database migration.
 *
 * Each `items` entry renders as one boxed card: a large figure, an optional
 * bold lead clause, and a supporting sentence — e.g. the "five numbers" grid
 * in the EV ecosystem briefs.
 */
export const StatGrid: Block = {
  slug: 'statGrid',
  interfaceName: 'StatGridBlock',
  labels: { singular: 'Number cards', plural: 'Number card grids' },
  fields: [
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Card', plural: 'Cards' },
      fields: [
        {
          name: 'figure',
          type: 'text',
          required: true,
          admin: { description: 'The big number, e.g. "~10%" or "6 vs 24".' },
        },
        {
          name: 'lead',
          type: 'text',
          admin: { description: 'Optional bold lead clause shown before the body text.' },
        },
        {
          name: 'body',
          type: 'textarea',
          required: true,
          admin: { description: 'Supporting sentence(s) for this card.' },
        },
      ],
    },
  ],
}
