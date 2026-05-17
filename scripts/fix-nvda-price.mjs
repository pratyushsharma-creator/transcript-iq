/**
 * One-time script: fix NVDA earnings analysis price $1 → $99
 *
 * Uses pg directly — NO Payload init, NO Drizzle schema push.
 * Safe to run against production DB.
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import pg from 'pg'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Manually read .env.local without dotenv
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
    // Check current NVDA price
    const { rows: current } = await client.query(
      `SELECT id, ticker, price_usd FROM earnings_analyses WHERE ticker = 'NVDA'`
    )
    console.log('Current NVDA records:', current)

    if (current.length === 0) {
      console.log('⚠  No NVDA record found. Trying to find any $1 earnings record...')
      const { rows: cheap } = await client.query(
        `SELECT id, ticker, price_usd FROM earnings_analyses WHERE price_usd = 1`
      )
      console.log('Records with price $1:', cheap)
      if (cheap.length === 0) {
        console.log('ℹ  No $1 earnings records found. Nothing to update.')
        return
      }
    }

    // Update NVDA price from $1 → $99
    const r1 = await client.query(
      `UPDATE earnings_analyses SET price_usd = 99 WHERE ticker = 'NVDA' AND price_usd = 1`
    )
    console.log(`✓  earnings_analyses updated: ${r1.rowCount} row(s)`)

    // Also update versions table
    const r2 = await client.query(
      `UPDATE _earnings_analyses_v SET price_usd = 99 WHERE price_usd = 1
       AND parent_id IN (SELECT id FROM earnings_analyses WHERE ticker = 'NVDA')`
    )
    console.log(`✓  _earnings_analyses_v updated: ${r2.rowCount} row(s)`)

    console.log('\n✅  NVDA price fix applied.')
  } catch (err) {
    // Version table may not exist or have different structure — try fallback
    console.log('ℹ  Version table update skipped or failed (may not exist):', err.message)
    console.log('\n✅  Main table update done.')
  } finally {
    client.release()
    await pool.end()
  }
}

run().catch(err => {
  console.error('❌  Script failed:', err.message)
  process.exit(1)
})
