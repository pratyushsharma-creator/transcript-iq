/**
 * One-time script: fix NVDA earnings analysis price $1 → $99
 * Uses DATABASE_URI_DIRECT (non-pooler) for direct connection.
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import pg from 'pg'

const __dirname = dirname(fileURLToPath(import.meta.url))

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

// Prefer direct connection over pooler
const DATABASE_URL =
  envVars['DATABASE_URI_DIRECT'] ||
  envVars['DATABASE_URI'] ||
  envVars['DATABASE_URL'] ||
  envVars['POSTGRES_URL']

if (!DATABASE_URL) {
  console.error('No DATABASE_URI_DIRECT / DATABASE_URI found in .env.local')
  process.exit(1)
}

console.log('Connecting via:', DATABASE_URL.split('@')[1]?.split('/')[0] ?? '(unknown host)')

const { Pool } = pg
const pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false }, max: 1 })

async function run() {
  const client = await pool.connect()
  try {
    // Find any record with price $1
    const { rows: cheap } = await client.query(
      `SELECT id, ticker, price_usd FROM earnings_analyses WHERE price_usd = 1`
    )
    console.log('Earnings records with price $1:', cheap)

    if (cheap.length === 0) {
      console.log('ℹ  No $1 earnings records found — already fixed or doesn\'t exist.')
      return
    }

    // Update NVDA (or any $1 record) to $99
    const r1 = await client.query(
      `UPDATE earnings_analyses SET price_usd = 99 WHERE price_usd = 1`
    )
    console.log(`✓  earnings_analyses updated: ${r1.rowCount} row(s)`)

    // Mirror into versions table if it exists
    try {
      const r2 = await client.query(
        `UPDATE _earnings_analyses_v SET version_price_usd = 99
         WHERE version_price_usd = 1
           AND parent_id IN (SELECT id FROM earnings_analyses WHERE ticker = 'NVDA')`
      )
      console.log(`✓  _earnings_analyses_v updated: ${r2.rowCount} row(s)`)
    } catch (e) {
      console.log('ℹ  Version table update skipped:', e.message)
    }

    console.log('\n✅  NVDA price fix applied.')
  } finally {
    client.release()
    await pool.end()
  }
}

run().catch(err => {
  console.error('❌  Script failed:', err.message)
  process.exit(1)
})
