/**
 * Fixes /transcripts → /expert-transcripts and /earnings → /earnings-analysis
 * in all FeaturedProducts blocks stored in the Pages collection.
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function main() {
  const payload = await getPayload({ config })

  // Get all pages
  const pages = await payload.find({ collection: 'pages', limit: 100, depth: 10 })

  let fixed = 0
  for (const page of pages.docs) {
    const layout = (page.layout ?? []) as Array<Record<string, unknown>>
    let changed = false

    const patchedLayout = layout.map((block) => {
      if (block.blockType !== 'featuredProducts') return block
      const cta = block.showAllCta as Record<string, unknown> | undefined
      if (!cta) return block

      let url = cta.url as string | undefined
      if (!url) return block

      const originalUrl = url
      if (url === '/transcripts' || url === '/transcript-library') {
        url = '/expert-transcripts'
      } else if (url === '/earnings') {
        url = '/earnings-analysis'
      }

      if (url !== originalUrl) {
        changed = true
        console.log(`  Page "${page.slug}": fixed showAllCta.url "${originalUrl}" → "${url}"`)
        return { ...block, showAllCta: { ...cta, url } }
      }
      return block
    })

    if (changed) {
      await payload.update({
        collection: 'pages',
        id: page.id,
        data: { layout: patchedLayout as never },
      })
      fixed++
    }
  }

  console.log(`\nDone. Fixed ${fixed} page(s).`)
  process.exit(0)
}

main().catch((e) => { console.error(e); process.exit(1) })
