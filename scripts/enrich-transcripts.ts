/**
 * enrich-transcripts.ts
 *
 * Three-phase enrichment from Webflow CMS data:
 *
 * Phase 1 — Fix industry taxonomy
 *   • Renames wrong slugs created by seed-expert-transcripts:
 *     technology-software  → technology-saas
 *     healthcare-life-sciences → healthcare-pharma
 *   • Merges any duplicate industry records
 *   • Ensures all 12 canonical industries exist
 *
 * Phase 2 — Re-assign sectors to all transcripts
 *   • For every transcript, looks up the correct sector ID from the
 *     Webflow-sourced data (webflow-transcript-data.json) and updates
 *     the `sectors` relationship field
 *
 * Phase 3 — Apply real executive summaries from Webflow
 *   • Updates `executiveSummaryPreview` with the 150-300 word
 *     preview written in Webflow (replaces the short description placeholder)
 *   • Skips items where Webflow had no executive summary (keeps existing)
 *
 * Phase 4 — Insert missing transcript
 *   • Adds the one transcript present in Webflow but missing from the
 *     original seed: leo-satellite-broadband-outlook-...
 *
 * Run:
 *   npx tsx scripts/enrich-transcripts.ts
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

// ── Canonical industry taxonomy (source of truth going forward) ────────────────
const CANONICAL_INDUSTRIES = [
  { name: 'Technology & SaaS',          slug: 'technology-saas' },
  { name: 'Healthcare & Pharma',         slug: 'healthcare-pharma' },
  { name: 'Financial Services',          slug: 'financial-services' },
  { name: 'Energy & Utilities',          slug: 'energy-utilities' },
  { name: 'Industrials & Manufacturing', slug: 'industrials-manufacturing' },
  { name: 'Telecommunications',          slug: 'telecommunications' },
  { name: 'Chemicals',                   slug: 'chemicals' },
  { name: 'Metals & Mining',             slug: 'metals-mining' },
  { name: 'Professional Services',       slug: 'professional-services' },
  { name: 'Space Economy',               slug: 'space-economy' },
  { name: 'Transportation & Logistics',  slug: 'transportation-logistics' },
  { name: 'Real Estate & Infrastructure',slug: 'real-estate-infrastructure' },
]

// Old slugs → correct slug (from the seed script name mismatch)
const SLUG_RENAMES: Record<string, string> = {
  'technology-software':     'technology-saas',
  'healthcare-life-sciences':'healthcare-pharma',
}

// Webflow sector data (from webflow-transcript-data.json)
type WFEntry = {
  slug: string
  executiveSummary: string
  sectorSlug: string
  geography: string
}

// The one transcript in Webflow not in the original seed
const LEO_TRANSCRIPT = {
  slug: 'leo-satellite-broadband-outlook-household-penetration-potential-and-structural-advantages-over-fiber-and-fwa',
  title: 'LEO Satellite Broadband Outlook: Household Penetration Potential, and Structural Advantages Over Fiber and FWA',
  expertId: 'EXP-LEO-001',
  expertFormerTitle: 'Former Manager, LEO Broadband Strategy, Major Satellite Operator',
  expertLevel: 'director' as const,
  dateConducted: '2026-04-20',
  price: 349,
  originalPrice: 499,
  tier: 'standard' as const,
  sectors: ['space-economy', 'telecommunications'],
  geography: ['north-america', 'global'] as ('north-america' | 'global')[],
  summary: 'Examines LEO broadband as a complementary layer between fiber and fixed wireless, best suited for rural fill-in, mobility, backup, and enterprise redundancy rather than mass-market urban broadband.',
  executiveSummaryPreview: 'This transcript examines LEO broadband as a complementary layer between fiber and fixed wireless, best suited for rural fill-in, mobility, backup, and enterprise redundancy rather than mass-market urban broadband. Starlink leads through scale, low launch costs, and first-mover advantage, while fiber remains superior on price, symmetry, and reliability. LEO\'s economics are constrained by satellite capacity, FCC limits, hardware distribution, and weather sensitivity. Growth is strongest in enterprise and mobility segments, where ARPU is higher and customers value rapid deployment, coverage, and continuity.',
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function deriveTier(price: number): 'standard' | 'premium' | 'elite' {
  if (price >= 599) return 'elite'
  if (price >= 449) return 'premium'
  return 'standard'
}

function deriveLevel(price: number): 'c-suite' | 'vp' | 'director' {
  if (price >= 599) return 'c-suite'
  if (price >= 449) return 'vp'
  return 'director'
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  const payload = await getPayload({ config: payloadConfig })

  // Load Webflow data
  const wfData: WFEntry[] = JSON.parse(
    readFileSync(path.resolve(__dirname, 'webflow-transcript-data.json'), 'utf-8')
  )
  const wfMap = new Map(wfData.map(e => [e.slug, e]))

  console.log(`\n${'═'.repeat(64)}`)
  console.log('  PHASE 1 — Fix industry taxonomy')
  console.log('═'.repeat(64))

  // Build industryMap: slug → Payload ID
  const industryMap = new Map<string, string | number>()

  for (const industry of CANONICAL_INDUSTRIES) {
    const { name, slug } = industry

    // Check if correct slug already exists
    const existing = await payload.find({
      collection: 'industries',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      industryMap.set(slug, existing.docs[0].id)
      // Ensure name is up to date
      if (existing.docs[0].name !== name) {
        await payload.update({
          collection: 'industries',
          id: existing.docs[0].id,
          data: { name },
        })
        console.log(`  ✎ renamed  ${existing.docs[0].name} → ${name}`)
      } else {
        console.log(`  ✓ exists   ${slug}`)
      }
      continue
    }

    // Check if an old/wrong slug exists that maps to this canonical one
    const oldSlug = Object.entries(SLUG_RENAMES).find(([, v]) => v === slug)?.[0]
    if (oldSlug) {
      const oldRecord = await payload.find({
        collection: 'industries',
        where: { slug: { equals: oldSlug } },
        limit: 1,
      })

      if (oldRecord.docs.length > 0) {
        // Rename the old record to the correct slug + name
        await payload.update({
          collection: 'industries',
          id: oldRecord.docs[0].id,
          data: { name, slug },
        })
        industryMap.set(slug, oldRecord.docs[0].id)
        console.log(`  ✎ fixed    ${oldSlug} → ${slug}  (id ${oldRecord.docs[0].id})`)
        continue
      }
    }

    // Create fresh
    const created = await payload.create({
      collection: 'industries',
      data: { name, slug },
    })
    industryMap.set(slug, created.id)
    console.log(`  + created  ${slug}`)
  }

  // Delete any leftover wrong-slug records that weren't renamed
  for (const [oldSlug] of Object.entries(SLUG_RENAMES)) {
    const stale = await payload.find({
      collection: 'industries',
      where: { slug: { equals: oldSlug } },
      limit: 1,
    })
    if (stale.docs.length > 0) {
      await payload.delete({ collection: 'industries', id: stale.docs[0].id })
      console.log(`  ✗ deleted stale  ${oldSlug}`)
    }
  }

  console.log(`\n${'═'.repeat(64)}`)
  console.log('  PHASE 2+3 — Update transcripts: sectors + executive summaries')
  console.log('═'.repeat(64))

  // Fetch all transcripts in Payload
  const allTranscripts = await payload.find({
    collection: 'expert-transcripts',
    limit: 200,
    depth: 0,
  })

  let updated = 0
  let noMatch = 0

  for (const tx of allTranscripts.docs) {
    const wf = wfMap.get(tx.slug as string)

    if (!wf) {
      console.log(`  ? no WF match  ${tx.slug}`)
      noMatch++
      continue
    }

    // Resolve sector IDs
    const sectorIds: (string | number)[] = []
    if (wf.sectorSlug && industryMap.has(wf.sectorSlug)) {
      sectorIds.push(industryMap.get(wf.sectorSlug)!)
    }

    // Build update payload
    const updateData: Record<string, unknown> = {
      sectors: sectorIds,
    }

    // Only overwrite exec summary if Webflow has one
    if (wf.executiveSummary) {
      updateData.executiveSummaryPreview = wf.executiveSummary
    }

    await payload.update({
      collection: 'expert-transcripts',
      id: tx.id,
      data: updateData,
    })

    console.log(`  ✓ updated  ${tx.slug?.toString().slice(0, 60)}  [sector: ${wf.sectorSlug}]`)
    updated++
  }

  console.log(`\n${'═'.repeat(64)}`)
  console.log('  PHASE 4 — Add missing LEO satellite transcript')
  console.log('═'.repeat(64))

  const leoExists = await payload.find({
    collection: 'expert-transcripts',
    where: { slug: { equals: LEO_TRANSCRIPT.slug } },
    limit: 1,
  })

  if (leoExists.docs.length > 0) {
    console.log('  ✓ LEO transcript already exists, skipping')
  } else {
    const sectorIds: (string | number)[] = LEO_TRANSCRIPT.sectors
      .map(s => industryMap.get(s))
      .filter(Boolean) as (string | number)[]

    await payload.create({
      collection: 'expert-transcripts',
      data: {
        title: LEO_TRANSCRIPT.title,
        slug: LEO_TRANSCRIPT.slug,
        expertId: LEO_TRANSCRIPT.expertId,
        expertFormerTitle: LEO_TRANSCRIPT.expertFormerTitle,
        expertLevel: LEO_TRANSCRIPT.expertLevel,
        dateConducted: new Date(LEO_TRANSCRIPT.dateConducted).toISOString(),
        summary: LEO_TRANSCRIPT.summary,
        executiveSummaryPreview: LEO_TRANSCRIPT.executiveSummaryPreview,
        priceUsd: LEO_TRANSCRIPT.price,
        originalPriceUsd: LEO_TRANSCRIPT.originalPrice,
        discountPercent: 30,
        tier: LEO_TRANSCRIPT.tier,
        sectors: sectorIds,
        geography: LEO_TRANSCRIPT.geography,
        complianceBadges: ['mnpi-screened', 'pii-redacted', 'compliance-certified', 'expert-anonymised'],
        featured: false,
        _status: 'published',
      },
    })
    console.log('  + created LEO satellite broadband transcript')
  }

  console.log(`
${'═'.repeat(64)}
  DONE
  Industries fixed : ${CANONICAL_INDUSTRIES.length} canonical
  Transcripts updated: ${updated}
  No WF match      : ${noMatch}
${'═'.repeat(64)}
`)
}

main().catch(e => { console.error(e); process.exit(1) })
