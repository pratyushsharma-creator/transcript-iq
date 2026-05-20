import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

/**
 * Migration: normalize expertLevel — enum → text, 'vp' → 'Vice President'
 *
 * Previously expertLevel was a `select` field stored as a Postgres ENUM
 * (enum_expert_transcripts_expert_level) with values c-suite | vp | director.
 * It is now a free-text `text` field that accepts any value.
 *
 * This migration:
 *   1. Converts expert_level / version_expert_level columns from ENUM → TEXT
 *      (skips the ALTER safely if dev-mode sync already converted the column)
 *   2. Rewrites every stored 'vp' → 'Vice President' in the main table
 *   3. Rewrites every stored 'vp' → 'Vice President' in the drafts/versions table
 *   4. Drops the old enum type (IF EXISTS, so safe to re-run)
 */

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── 1. Convert main-table column from ENUM → TEXT (no-op if already text) ──
  await db.execute(sql`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name  = 'expert_transcripts'
          AND column_name = 'expert_level'
          AND data_type   = 'USER-DEFINED'
      ) THEN
        ALTER TABLE "expert_transcripts"
          ALTER COLUMN "expert_level" TYPE text USING "expert_level"::text;
      END IF;
    END $$;
  `)

  // ── 2. Convert versions-table column from ENUM → TEXT ──────────────────────
  await db.execute(sql`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name  = '_expert_transcripts_v'
          AND column_name = 'version_expert_level'
          AND data_type   = 'USER-DEFINED'
      ) THEN
        ALTER TABLE "_expert_transcripts_v"
          ALTER COLUMN "version_expert_level" TYPE text USING "version_expert_level"::text;
      END IF;
    END $$;
  `)

  // ── 3. Rewrite stored 'vp' → 'Vice President' in main table ────────────────
  await db.execute(sql`
    UPDATE "expert_transcripts"
      SET "expert_level" = 'Vice President'
      WHERE "expert_level" = 'vp';
  `)

  // ── 4. Rewrite stored 'vp' → 'Vice President' in versions table ────────────
  await db.execute(sql`
    UPDATE "_expert_transcripts_v"
      SET "version_expert_level" = 'Vice President'
      WHERE "version_expert_level" = 'vp';
  `)

  // ── 5. Drop the old enum type (safe if already gone) ───────────────────────
  await db.execute(sql`
    DROP TYPE IF EXISTS "enum_expert_transcripts_expert_level";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Reverse: rewrite 'Vice President' back to 'vp'
  await db.execute(sql`
    UPDATE "expert_transcripts"
      SET "expert_level" = 'vp'
      WHERE "expert_level" = 'Vice President';

    UPDATE "_expert_transcripts_v"
      SET "version_expert_level" = 'vp'
      WHERE "version_expert_level" = 'Vice President';
  `)
}
