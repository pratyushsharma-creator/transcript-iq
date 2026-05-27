import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

/**
 * Migration: exchange field — select (Postgres ENUM) → free-text (TEXT)
 *
 * The `exchange` field in EarningsAnalyses was a `select` field, which Payload 3's
 * postgres adapter stores as a Postgres ENUM type (`enum_earnings_analyses_exchange`).
 *
 * We changed the Payload schema to `type: 'text'` so the team can enter any exchange
 * without a code change. Without this migration, Payload generates TEXT-mode SQL
 * against an ENUM column → type mismatch → 500 on every save.
 *
 * This migration:
 *   1. Converts `exchange` in `earnings_analyses` from ENUM → TEXT
 *      (guarded by an information_schema check so it's safe to re-run)
 *   2. Converts `version_exchange` in `_earnings_analyses_v` from ENUM → TEXT
 *   3. Drops the now-unused enum types (IF EXISTS — safe to re-run)
 */

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── 1. Convert main-table column: exchange ENUM → TEXT ───────────────────────
  await db.execute(sql`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name  = 'earnings_analyses'
          AND column_name = 'exchange'
          AND data_type   = 'USER-DEFINED'
      ) THEN
        ALTER TABLE "earnings_analyses"
          ALTER COLUMN "exchange" TYPE text USING "exchange"::text;
      END IF;
    END $$;
  `)

  // ── 2. Convert versions-table column: version_exchange ENUM → TEXT ───────────
  await db.execute(sql`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name  = '_earnings_analyses_v'
          AND column_name = 'version_exchange'
          AND data_type   = 'USER-DEFINED'
      ) THEN
        ALTER TABLE "_earnings_analyses_v"
          ALTER COLUMN "version_exchange" TYPE text USING "version_exchange"::text;
      END IF;
    END $$;
  `)

  // ── 3. Drop the old enum types (safe if already gone) ────────────────────────
  await db.execute(sql`DROP TYPE IF EXISTS "enum_earnings_analyses_exchange";`)
  await db.execute(sql`DROP TYPE IF EXISTS "enum__earnings_analyses_v_version_exchange";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Reversing to an ENUM would require knowing all active values — not practical.
  // No-op: the text column works correctly in both directions.
}
