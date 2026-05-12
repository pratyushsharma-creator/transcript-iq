/**
 * CI pre-migration helper.
 *
 * Payload inserts a row with `batch = -1` into `payload_migrations` whenever
 * the dev server pushes schema changes directly to the database (dev-mode sync).
 * When `payload migrate` sees this sentinel it opens an interactive prompts
 * dialog — which hangs forever in Vercel's CI environment.
 *
 * This script removes the sentinel BEFORE `payload migrate` runs so the dialog
 * never fires.  Our explicit migration files capture every required schema change,
 * so removing the sentinel is safe.
 */

import pg from 'pg'

const { Client } = pg

const connectionString = process.env.DATABASE_URI
if (!connectionString) {
  console.log('[migrate-ci] DATABASE_URI not set — skipping sentinel cleanup')
  process.exit(0)
}

const client = new Client({ connectionString })
await client.connect()

try {
  // Confirm the migrations table exists before touching it
  const { rows: tableRows } = await client.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name   = 'payload_migrations'
    ) AS exists
  `)

  if (!tableRows[0].exists) {
    console.log('[migrate-ci] payload_migrations table not found — nothing to clean')
    process.exit(0)
  }

  // Remove dev-mode sentinel row(s)
  const { rowCount, rows } = await client.query(
    "DELETE FROM payload_migrations WHERE batch = -1 RETURNING name",
  )

  if (rowCount > 0) {
    console.log(
      `[migrate-ci] Removed ${rowCount} dev-mode sentinel row(s): ${rows.map((r) => r.name).join(', ')}`,
    )
  } else {
    console.log('[migrate-ci] No dev-mode sentinel found — payload_migrations is clean')
  }
} finally {
  await client.end()
}
