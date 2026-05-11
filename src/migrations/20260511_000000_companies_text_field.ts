import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

/**
 * Migration: add companies text column to expert_transcripts and earnings_analyses
 *
 * Previously companies was a relationship field (stored in *_rels join tables).
 * It is now a plain varchar column on the main table — staff paste comma-separated
 * company names directly, no pre-creation required.
 *
 * The old rows in the _rels tables with path='companies' become inert dead data;
 * they cause no errors and can be cleaned up manually later if needed.
 */

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "expert_transcripts"
      ADD COLUMN IF NOT EXISTS "companies" varchar;

    ALTER TABLE "earnings_analyses"
      ADD COLUMN IF NOT EXISTS "companies" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "expert_transcripts"
      DROP COLUMN IF EXISTS "companies";

    ALTER TABLE "earnings_analyses"
      DROP COLUMN IF EXISTS "companies";
  `)
}
