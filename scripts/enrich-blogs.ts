/**
 * enrich-blogs.ts
 *
 * Updates all blog posts in Payload with full body content converted from
 * Webflow's HTML CMS into Payload Lexical JSON format.
 *
 * What it does per post:
 *   • Sets `body` to the full Lexical document (converted from Webflow HTML)
 *   • Sets `excerpt` from the Webflow post-summary field
 *   • Sets `publishedAt` from the Webflow lastPublished date
 *   • Keeps all other fields (title, author, categories, etc.) untouched
 *
 * Safe to re-run — matches by slug, updates existing records.
 *
 * Run:
 *   npx tsx scripts/enrich-blogs.ts
 */

import { config as loadEnv } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'
import { getPayload } from 'payload'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

loadEnv({ path: path.resolve(__dirname, '..', '.env.local') })

const { default: payloadConfig } = await import('../src/payload.config.ts')

type BlogEntry = {
  slug: string
  name: string
  excerpt: string
  published: string
  lexical_body: object
}

async function main() {
  const payload = await getPayload({ config: payloadConfig })

  const blogData: BlogEntry[] = JSON.parse(
    readFileSync(path.resolve(__dirname, 'webflow-blog-data.json'), 'utf-8')
  )

  console.log(`\n${'═'.repeat(64)}`)
  console.log(`  Enriching ${blogData.length} blog posts from Webflow content`)
  console.log('═'.repeat(64))

  let updated = 0
  let created = 0
  let notFound = 0

  for (const entry of blogData) {
    // Find existing post by slug
    const existing = await payload.find({
      collection: 'blog-posts',
      where: { slug: { equals: entry.slug } },
      limit: 1,
      depth: 0,
    })

    const updateData = {
      body: entry.lexical_body,
      excerpt: entry.excerpt?.slice(0, 280) || undefined,
      publishedAt: entry.published ? new Date(entry.published).toISOString() : undefined,
    }

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'blog-posts',
        id: existing.docs[0].id,
        data: updateData,
      })
      console.log(`  ✓ updated  ${entry.slug}`)
      updated++
    } else {
      // Post doesn't exist yet — create it
      await payload.create({
        collection: 'blog-posts',
        data: {
          title: entry.name,
          slug: entry.slug,
          ...updateData,
          contentType: 'educational',
          _status: 'published',
        },
      })
      console.log(`  + created  ${entry.slug}`)
      created++
    }
  }

  console.log(`
${'═'.repeat(64)}
  DONE
  Updated : ${updated}
  Created : ${created}
  Not found: ${notFound}
${'═'.repeat(64)}
`)
}

main().catch(e => { console.error(e); process.exit(1) })
