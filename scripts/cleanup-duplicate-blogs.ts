/**
 * cleanup-duplicate-blogs.ts
 *
 * Removes the 5 old stub blog posts created by seed-blog-posts.ts
 * whose slugs were superseded by the Webflow-sourced slugs.
 *
 * Old (stub) slugs to delete:
 *   expert-call-to-investment-memo
 *   hedge-fund-analysts-earnings-season
 *   mnpi-compliance-expert-networks
 *   tegus-third-bridge-cost-comparison
 *   pe-firms-expert-networks-deal-diligence
 *
 * The matching Webflow-sourced posts (with real content) are kept:
 *   expert-call-transcript-to-investment-memo-workflow
 *   hedge-fund-expert-transcripts-earnings-research
 *   mnpi-compliance-expert-networks-analyst-guide
 *   tegus-vs-third-bridge-vs-transcript-iq-cost-comparison
 *   pe-expert-networks-deal-diligence-transcripts
 *
 * Safe to run once. Will print a warning and skip if slug is not found.
 */

import { config as loadEnv } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
loadEnv({ path: path.resolve(__dirname, '..', '.env.local') })

const { default: payloadConfig } = await import('../src/payload.config.ts')

const STALE_SLUGS = [
  'expert-call-to-investment-memo',
  'hedge-fund-analysts-earnings-season',
  'mnpi-compliance-expert-networks',
  'tegus-third-bridge-cost-comparison',
  'pe-firms-expert-networks-deal-diligence',
]

async function main() {
  const payload = await getPayload({ config: payloadConfig })

  console.log('\n🧹 Removing stale seed blog posts...\n')

  let deleted = 0
  let notFound = 0

  for (const slug of STALE_SLUGS) {
    const result = await payload.find({
      collection: 'blog-posts',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    })

    if (result.docs.length === 0) {
      console.log(`  ⚠  not found  ${slug}`)
      notFound++
      continue
    }

    const id = result.docs[0].id
    await payload.delete({ collection: 'blog-posts', id })
    console.log(`  ✓ deleted    ${slug}  (id: ${id})`)
    deleted++
  }

  console.log(`
Done.  Deleted: ${deleted}  |  Not found: ${notFound}
`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
