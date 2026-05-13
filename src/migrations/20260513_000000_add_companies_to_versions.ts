import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

/**
 * Migration: add version_companies text column to the versions tables.
 *
 * The previous migration (20260511_000000_companies_text_field) added the
 * `companies` varchar column to the main tables but missed the corresponding
 * versioned column in each collection's _v (versions) table.
 *
 * Payload v3 (drizzle-postgres) stores draft/version data in
 * `_<collection>_v` tables with field columns prefixed by `version_`.
 *
 * Without this column the admin queries (which always use `draft=true`)
 * fail with a 500 "Something went wrong" error, leaving the collection
 * list views completely blank.
 */

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "_expert_transcripts_v"
      ADD COLUMN IF NOT EXISTS "version_companies" varchar;

    ALTER TABLE "_earnings_analyses_v"
      ADD COLUMN IF NOT EXISTS "version_companies" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "_expert_transcripts_v"
      DROP COLUMN IF EXISTS "version_companies";

    ALTER TABLE "_earnings_analyses_v"
      DROP COLUMN IF EXISTS "version_companies";
  `)
}
