/**
 * One-time script: update custom-reports pricing from $599 → $899
 * and add $699/5+ bulk pricing copy.
 *
 * Uses pg directly — NO Payload init, NO Drizzle schema push.
 * Safe to run against production DB.
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import pg from 'pg'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Manually read .env.local without dotenv (no package dep needed)
const envPath = resolve(__dirname, '..', '.env.local')
const envText = readFileSync(envPath, 'utf8')
const envVars = {}
for (const line of envText.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const idx = trimmed.indexOf('=')
  if (idx === -1) continue
  const key = trimmed.slice(0, idx).trim()
  const val = trimmed.slice(idx + 1).trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1')
  envVars[key] = val
}

const DATABASE_URL = envVars['DATABASE_URI'] || envVars['DATABASE_URL'] || envVars['POSTGRES_URL']
if (!DATABASE_URL) {
  console.error('No DATABASE_URI / DATABASE_URL found in .env.local')
  process.exit(1)
}

const { Pool } = pg
const pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false }, max: 1 })

async function run() {
  const client = await pool.connect()
  try {
    // ── 0. Find the custom-reports page ─────────────────────────────────────
    const { rows: [page] } = await client.query(
      `SELECT id FROM pages WHERE slug = 'custom-reports' LIMIT 1`
    )
    if (!page) { console.error('❌  custom-reports page not found'); process.exit(1) }
    const pageId = page.id
    console.log(`✓  Found page id=${pageId}`)

    // ── 1. Hero trust stats: $599 → $899 ────────────────────────────────────
    const { rows: heroBlocks } = await client.query(
      `SELECT id FROM pages_blocks_custom_transcript_hero WHERE _parent_id = $1`,
      [pageId]
    )
    let statsUpdated = 0
    for (const hero of heroBlocks) {
      const r = await client.query(
        `UPDATE pages_blocks_custom_transcript_hero_trust_stats
         SET value = '$899'
         WHERE _parent_id = $1 AND value = '$599'`,
        [hero.id]
      )
      statsUpdated += r.rowCount
    }
    console.log(`✓  trust_stats updated: ${statsUpdated} row(s)`)

    // ── 2. Marquee text item: $599 → $899 ───────────────────────────────────
    const { rows: marqueeBlocks } = await client.query(
      `SELECT id FROM pages_blocks_marquee_text WHERE _parent_id = $1`,
      [pageId]
    )
    let marqueeUpdated = 0
    for (const m of marqueeBlocks) {
      const r = await client.query(
        `UPDATE pages_blocks_marquee_text_items
         SET label = '✓ $899 flat · one-time fee'
         WHERE _parent_id = $1 AND label = '✓ $599 flat · one-time fee'`,
        [m.id]
      )
      marqueeUpdated += r.rowCount
    }
    console.log(`✓  marquee items updated: ${marqueeUpdated} row(s)`)

    // ── 3. Pricing comparison: amount + note ────────────────────────────────
    const bulkNote = 'One flat fee per commissioned transcript. No platform fee, no annual commitment, no expert network membership required. Volume pricing from $699/transcript for 5+ commissions.'
    const r3 = await client.query(
      `UPDATE pages_blocks_pricing_comparison
       SET left_panel_amount = '$899',
           left_panel_note   = $2
       WHERE _parent_id = $1 AND left_panel_amount = '$599'`,
      [pageId, bulkNote]
    )
    console.log(`✓  pricing_comparison updated: ${r3.rowCount} row(s)`)

    // ── 4. FAQ items ─────────────────────────────────────────────────────────
    const { rows: faqBlocks } = await client.query(
      `SELECT id FROM pages_blocks_faq WHERE _parent_id = $1`,
      [pageId]
    )
    let faqUpdated = 0
    for (const faq of faqBlocks) {
      // 4a. The $599 pricing question + answer
      const r4a = await client.query(
        `UPDATE pages_blocks_faq_items
         SET question = 'How is the $899 price structured — are there additional fees?',
             answer   = replace(answer::text, '$599', '$899')::jsonb
         WHERE _parent_id = $1 AND question LIKE '%$599%'`,
        [faq.id]
      )
      faqUpdated += r4a.rowCount

      // 4b. Volume pricing sentence in the multi-transcript FAQ item
      const r4b = await client.query(
        `UPDATE pages_blocks_faq_items
         SET answer = replace(
           answer::text,
           'Volume pricing is available for 3+ commissions',
           'Volume pricing from $699/transcript is available for 5 or more custom commissions'
         )::jsonb
         WHERE _parent_id = $1
           AND answer::text LIKE '%Volume pricing is available for 3+%'`,
        [faq.id]
      )
      faqUpdated += r4b.rowCount
    }
    console.log(`✓  faq items updated: ${faqUpdated} row(s)`)

    // ── 5. CTA compliance note ───────────────────────────────────────────────
    const r5 = await client.query(
      `UPDATE pages_blocks_cta
       SET compliance_note = '$899 flat · No subscription · MNPI screened · 36hr turnaround'
       WHERE _parent_id = $1 AND compliance_note LIKE '%$599%'`,
      [pageId]
    )
    console.log(`✓  cta updated: ${r5.rowCount} row(s)`)

    // ── 6. Mirror changes into the latest _pages_v version ──────────────────
    //  (keeps the admin panel consistent with the live data)
    const { rows: [latestVersion] } = await client.query(
      `SELECT id FROM _pages_v WHERE parent_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [pageId]
    )
    if (latestVersion) {
      const vId = latestVersion.id

      // 6a. Version hero trust_stats
      const { rows: vHeroBlocks } = await client.query(
        `SELECT id FROM _pages_v_blocks_custom_transcript_hero WHERE _parent_id = $1`,
        [vId]
      )
      let vStats = 0
      for (const vh of vHeroBlocks) {
        const r = await client.query(
          `UPDATE _pages_v_blocks_custom_transcript_hero_trust_stats
           SET value = '$899'
           WHERE _parent_id = $1 AND value = '$599'`,
          [vh.id]
        )
        vStats += r.rowCount
      }

      // 6b. Version marquee items
      const { rows: vMarqueeBlocks } = await client.query(
        `SELECT id FROM _pages_v_blocks_marquee_text WHERE _parent_id = $1`,
        [vId]
      )
      let vMarquee = 0
      for (const vm of vMarqueeBlocks) {
        const r = await client.query(
          `UPDATE _pages_v_blocks_marquee_text_items
           SET label = '✓ $899 flat · one-time fee'
           WHERE _parent_id = $1 AND label = '✓ $599 flat · one-time fee'`,
          [vm.id]
        )
        vMarquee += r.rowCount
      }

      // 6c. Version pricing comparison
      const r6c = await client.query(
        `UPDATE _pages_v_blocks_pricing_comparison
         SET left_panel_amount = '$899',
             left_panel_note   = $2
         WHERE _parent_id = $1 AND left_panel_amount = '$599'`,
        [vId, bulkNote]
      )

      // 6d. Version FAQ items
      const { rows: vFaqBlocks } = await client.query(
        `SELECT id FROM _pages_v_blocks_faq WHERE _parent_id = $1`,
        [vId]
      )
      let vFaq = 0
      for (const vf of vFaqBlocks) {
        const r1 = await client.query(
          `UPDATE _pages_v_blocks_faq_items
           SET question = 'How is the $899 price structured — are there additional fees?',
               answer   = replace(answer::text, '$599', '$899')::jsonb
           WHERE _parent_id = $1 AND question LIKE '%$599%'`,
          [vf.id]
        )
        const r2 = await client.query(
          `UPDATE _pages_v_blocks_faq_items
           SET answer = replace(
             answer::text,
             'Volume pricing is available for 3+ commissions',
             'Volume pricing from $699/transcript is available for 5 or more custom commissions'
           )::jsonb
           WHERE _parent_id = $1
             AND answer::text LIKE '%Volume pricing is available for 3+%'`,
          [vf.id]
        )
        vFaq += r1.rowCount + r2.rowCount
      }

      // 6e. Version CTA
      const r6e = await client.query(
        `UPDATE _pages_v_blocks_cta
         SET compliance_note = '$899 flat · No subscription · MNPI screened · 36hr turnaround'
         WHERE _parent_id = $1 AND compliance_note LIKE '%$599%'`,
        [vId]
      )

      console.log(`✓  versions updated: stats=${vStats} marquee=${vMarquee} pricing=${r6c.rowCount} faq=${vFaq} cta=${r6e.rowCount}`)
    } else {
      console.log('ℹ  No _pages_v row found for this page — skipping version update')
    }

    console.log('\n✅  All pricing updates applied successfully.')
  } finally {
    client.release()
    await pool.end()
  }
}

run().catch(err => {
  console.error('❌  Script failed:', err.message)
  process.exit(1)
})
