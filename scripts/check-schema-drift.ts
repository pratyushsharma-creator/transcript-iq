/**
 * Read-only schema drift check: compares the tables, columns, indexes, foreign keys and
 * enums Payload expects (from payload.config.ts) against the database in DATABASE_URI.
 * Makes no writes. Exits 1 when something Payload needs is missing or has the wrong type.
 *
 *   pnpm db:check
 *
 * The script sets NODE_ENV=production and PAYLOAD_MIGRATING=true so Payload never tries
 * to push schema while connecting.
 */
import { getPayload } from 'payload'
import { getTableConfig } from '@payloadcms/db-postgres/drizzle/pg-core'
import config from '../src/payload.config'

// Postgres truncates identifiers to 63 bytes.
const pgName = (name: string) => name.slice(0, 63)

// text and varchar are interchangeable for Payload; normalise type spellings.
const normType = (t: string) =>
  t
    .toLowerCase()
    .replace(/^serial$/, 'integer')
    .replace(/^(varchar(\(\d+\))?|character varying|text)$/, 'text')
    .replace(/^timestamp\(\d\) with time zone$/, 'timestamp with time zone')
    .replace(/^numeric(\(.*\))?$/, 'numeric')

const run = async () => {
  if (process.env.PAYLOAD_MIGRATING !== 'true') {
    throw new Error('Run via `pnpm db:check` (needs PAYLOAD_MIGRATING=true so Payload never pushes schema)')
  }
  const payload = await getPayload({ config, disableOnInit: true })
  const db = payload.db as any
  const query = async (text: string) => (await db.pool.query(text)).rows as any[]

  const actualTables = new Map<string, Map<string, string>>()
  for (const r of await query(
    `select table_name t, column_name c, data_type dt, udt_name udt from information_schema.columns where table_schema = 'public'`,
  )) {
    if (!actualTables.has(r.t)) actualTables.set(r.t, new Map())
    actualTables.get(r.t)!.set(r.c, r.dt === 'USER-DEFINED' ? r.udt : r.dt)
  }
  const actualIndexes = new Set((await query(`select indexname n from pg_indexes where schemaname = 'public'`)).map((r) => r.n))
  const actualFks = new Set(
    (
      await query(
        `select conname n from pg_constraint c join pg_namespace s on s.oid = c.connamespace where s.nspname = 'public' and contype = 'f'`,
      )
    ).map((r) => r.n),
  )
  const actualEnums = new Map<string, string[]>(
    (
      await query(
        `select t.typname n, array_agg(e.enumlabel order by e.enumsortorder) l from pg_type t join pg_enum e on e.enumtypid = t.oid join pg_namespace s on s.oid = t.typnamespace where s.nspname = 'public' group by 1`,
      )
    ).map((r) => [r.n, r.l]),
  )

  // Problems break Payload; notes are leftovers that are safe to ignore.
  const problems: string[] = []
  const notes: string[] = []
  const expectedTables = new Set<string>()

  for (const table of Object.values(db.tables) as any[]) {
    const cfg = getTableConfig(table)
    expectedTables.add(cfg.name)
    const actual = actualTables.get(cfg.name)
    if (!actual) {
      problems.push(`missing table ${cfg.name}`)
      continue
    }
    const expectedColumns = new Set<string>()
    for (const col of cfg.columns) {
      expectedColumns.add(col.name)
      if (!actual.has(col.name)) {
        problems.push(`missing column ${cfg.name}.${col.name} (${col.getSQLType()})`)
      } else if (normType(col.getSQLType()) !== normType(actual.get(col.name)!)) {
        problems.push(`type mismatch ${cfg.name}.${col.name}: config ${col.getSQLType()}, database ${actual.get(col.name)}`)
      }
    }
    for (const c of actual.keys()) if (!expectedColumns.has(c)) notes.push(`unused column ${cfg.name}.${c}`)
    for (const idx of cfg.indexes) {
      if (idx.config.name && !actualIndexes.has(pgName(idx.config.name))) problems.push(`missing index ${idx.config.name}`)
    }
    for (const fk of cfg.foreignKeys) {
      if (!actualFks.has(pgName(fk.getName()))) problems.push(`missing foreign key ${fk.getName()}`)
    }
  }
  for (const t of actualTables.keys()) if (!expectedTables.has(t)) notes.push(`unused table ${t}`)
  for (const e of Object.values(db.enums ?? {}) as any[]) {
    const labels = actualEnums.get(e.enumName)
    if (!labels) problems.push(`missing enum ${e.enumName}`)
    else {
      const missing = (e.enumValues as string[]).filter((l) => !labels.includes(l))
      if (missing.length) problems.push(`enum ${e.enumName} missing values: ${missing.join(', ')}`)
    }
  }

  console.log(`Checked ${expectedTables.size} tables Payload expects against ${actualTables.size} in the database.`)
  console.log(`\nProblems (${problems.length}):`)
  for (const p of problems) console.log(`  ✗ ${p}`)
  console.log(`\nLeftovers, safe to ignore (${notes.length}):`)
  for (const n of notes) console.log(`  · ${n}`)

  // Don't await pool.end(): Payload keeps other handles open, and `payload run` exits anyway.
  process.exit(problems.length ? 1 : 0)
}

// Top-level await: `payload run` calls process.exit() as soon as the import resolves.
await run().catch((err) => {
  console.error('Schema drift check failed to run:', err?.message || err)
  process.exit(2)
})
