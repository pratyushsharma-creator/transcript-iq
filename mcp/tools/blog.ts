import { z } from 'zod'
import { apiGet, buildPayloadQuery, type BlogPost, type PayloadList } from '../api-client.js'

export const listBlogPostsSchema = z.object({
  contentType: z.string().optional().describe('Filter by content type (e.g. "educational", "case-study")'),
  limit: z.number().int().min(1).max(100).default(20).describe('Number of results'),
  page: z.number().int().min(1).default(1).describe('Page number'),
})

export const getBlogPostSchema = z.object({
  slug: z.string().describe('The blog post slug'),
})

export async function listBlogPosts(args: z.infer<typeof listBlogPostsSchema>): Promise<string> {
  const where: Record<string, string> = { _status: 'published' }
  if (args.contentType) where.contentType = args.contentType

  const params = buildPayloadQuery(where, {
    limit: String(args.limit),
    page: String(args.page),
    depth: '1',
    sort: '-publishedAt',
  })

  const result = await apiGet<PayloadList<BlogPost>>('/api/blog-posts', params)

  if (result.docs.length === 0) {
    return 'No blog posts found.'
  }

  const lines = [
    `Found ${result.totalDocs} blog posts (page ${args.page}/${result.totalPages}):`,
    '',
  ]

  for (const p of result.docs) {
    lines.push(`**${p.title}**`)
    lines.push(`  Slug: ${p.slug}`)
    lines.push(`  Type: ${p.contentType ?? 'n/a'} | Published: ${p.publishedAt?.split('T')[0] ?? 'n/a'} | Read time: ${p.readTime ?? '?'} min`)
    if (p.excerpt) {
      lines.push(`  Excerpt: ${p.excerpt.slice(0, 200)}`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

export async function getBlogPost(args: z.infer<typeof getBlogPostSchema>): Promise<string> {
  const params = buildPayloadQuery({ slug: args.slug }, { depth: '2', limit: '1' })
  const result = await apiGet<PayloadList<BlogPost>>('/api/blog-posts', params)

  if (result.docs.length === 0) {
    return `No blog post found with slug: ${args.slug}`
  }

  const p = result.docs[0]

  return [
    `# ${p.title}`,
    ``,
    `**Slug:** ${p.slug}`,
    `**Type:** ${p.contentType ?? 'n/a'}`,
    `**Author:** ${p.author?.name ?? 'n/a'}`,
    `**Published:** ${p.publishedAt?.split('T')[0] ?? 'n/a'}`,
    `**Read Time:** ${p.readTime ?? '?'} min`,
    ``,
    `**Excerpt:**`,
    p.excerpt ?? '(no excerpt)',
  ].join('\n')
}
