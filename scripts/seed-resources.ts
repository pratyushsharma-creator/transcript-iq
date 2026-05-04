/**
 * seed-resources.ts
 * Seeds the Pages collection with the /resources hub page.
 *
 * Usage: npx tsx scripts/seed-resources.ts
 */

import { config as loadEnv } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
loadEnv({ path: path.resolve(__dirname, '..', '.env.local') })

const { default: payloadConfig } = await import('../src/payload.config.ts')

const pageData: any = {
  title: 'Research Hub — Expert Network Insights',
  slug: 'resources',
  _status: 'published' as const,
  layout: [
    // ── 1. Hero ───────────────────────────────────────────────────────────
    {
      blockType: 'resourcesHero',
      eyebrow: 'Research Hub',
      heading: 'Sharper research.\\n~~Better decisions.~~\\n**Deeper edge.**',
      subtitle:
        'Guides, frameworks, and analysis for institutional research teams. Expert network workflows, MNPI compliance, and primary research strategy — from the Nextyn research desk.',
      stats: [
        { value: '6', label: 'Published articles' },
        { value: '7', label: 'Topic categories' },
      ],
    },

    // ── 2. Resources hub (filter + featured + grid + newsletter) ──────────
    {
      blockType: 'resourcesHub',
      pageSize: 9,
      featuredSlug: 'what-are-expert-call-transcripts',
      newsletterEyebrow: 'Research Intelligence',
      newsletterHeading: 'New analyses, delivered to your inbox',
      newsletterBody:
        'Get notified when we publish new articles, use cases, and whitepapers on expert network research, compliance, and primary research strategy. No noise, no marketing. Just the research.',
    },
  ],
}

async function main() {
  const payload = await getPayload({ config: await payloadConfig })

  console.log('\n📖 Seeding resources page...\n')

  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'resources' } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    const id = existing.docs[0]!.id
    await payload.update({
      collection: 'pages',
      id,
      data: pageData,
    })
    console.log('✓ Updated existing resources page')
  } else {
    await payload.create({
      collection: 'pages',
      data: pageData,
    })
    console.log('✓ Created resources page')
  }

  console.log('\n✅ Done! EXIT:0\n')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
