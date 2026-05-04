import { config as loadEnv } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

loadEnv({ path: path.resolve(__dirname, '..', '.env.local') })

const { default: payloadConfig } = await import('../src/payload.config.ts')

async function main() {
  const payload = await getPayload({ config: payloadConfig })

  const res = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
    depth: 0,
  })
  const page = res.docs[0] as any
  if (!page) {
    console.log('❌ Home page not found in DB — run seed-home.ts first')
    process.exit(1)
  }

  const layout: any[] = (page.layout ?? [])
  const heroIdx = layout.findIndex((b: any) => b.blockType === 'hero')
  if (heroIdx === -1) {
    console.log('❌ Hero block not found in home page layout')
    process.exit(1)
  }

  layout[heroIdx].eyebrow    = 'On Demand · No Subscription'
  layout[heroIdx].heading    = 'Primary research.\nWithout the\nplatform tax.'
  layout[heroIdx].subheading = 'MNPI-screened expert call transcripts and AI-powered earnings analyses — from C-suite executives, VPs, and directors across 13 sectors. Portable PDF from $99. No subscription, no platform fee.'
  layout[heroIdx].ctas = [
    { label: 'Browse Transcripts', url: '/expert-transcripts', variant: 'primary' },
    { label: 'Get a Free Transcript', url: '/free-transcript', variant: 'secondary' },
  ]

  await payload.update({ collection: 'pages', id: page.id, data: { layout } })
  console.log('✓ Home hero block copy updated in Payload')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
