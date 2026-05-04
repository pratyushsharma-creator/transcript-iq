/**
 * update-home-hero.ts
 * ─────────────────────────────────────────────────────────
 * • Updates the hero block heading + subheading on the home page
 * • Removes the trustNumbers block that repeated the same stats
 * • Safe to re-run — idempotent
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function main() {
  const payload = await getPayload({ config: await config })

  // ── 1. Find the home page ─────────────────────────────────────────────────
  const res = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
    depth: 0,
  })

  const page = res.docs[0]
  if (!page) {
    console.error('❌  Home page not found. Run seed-home.ts first.')
    process.exit(1)
  }

  const layout = (page.layout ?? []) as Array<{ blockType: string } & Record<string, unknown>>

  // ── 2. Update the hero block ──────────────────────────────────────────────
  const updated = layout
    .map((block) => {
      if (block.blockType !== 'hero') return block

      return {
        ...block,
        heading: 'Primary intelligence at the speed of Now',
        subheading:
          'Verbatim expert call transcripts from C-suite executives, VPs, and directors across 13 sectors — from $349. Comprehensive earnings analyses covering the companies your portfolio follows, from $99. Portable PDF, instant delivery, no subscription required.',
        eyebrow: 'On Demand · No Subscription',
      }
    })
    // ── 3. Remove the trustNumbers block that duplicates the hero stats bar ──
    .filter((block) => block.blockType !== 'trustNumbers')

  // ── 4. Save ───────────────────────────────────────────────────────────────
  await payload.update({
    collection: 'pages',
    id: page.id,
    data: { layout: updated as never },
    draft: false,
  })

  console.log('✅  Home page hero updated and trustNumbers block removed.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
