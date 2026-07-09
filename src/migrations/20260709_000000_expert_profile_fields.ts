import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

/**
 * Migration: add expert profile fields to expert_transcripts.
 *
 *   expert_bio        — full anonymised (or verbatim) expert bio paragraph
 *   expert_experience — short credential shown as a box, e.g. "20+ years"
 *   expert_patents    — short credential shown as a box, e.g. "16 U.S. + 1 Indian"
 *
 * Payload v3 (drizzle-postgres) stores draft/version data in the
 * `_expert_transcripts_v` table with columns prefixed by `version_`.
 * The versioned columns must be added too, otherwise the admin list/edit
 * views (which query with draft=true) 500 with "Something went wrong".
 */

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "expert_transcripts"
      ADD COLUMN IF NOT EXISTS "expert_bio" varchar,
      ADD COLUMN IF NOT EXISTS "expert_experience" varchar,
      ADD COLUMN IF NOT EXISTS "expert_patents" varchar;

    ALTER TABLE "_expert_transcripts_v"
      ADD COLUMN IF NOT EXISTS "version_expert_bio" varchar,
      ADD COLUMN IF NOT EXISTS "version_expert_experience" varchar,
      ADD COLUMN IF NOT EXISTS "version_expert_patents" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "expert_transcripts"
      DROP COLUMN IF EXISTS "expert_bio",
      DROP COLUMN IF EXISTS "expert_experience",
      DROP COLUMN IF EXISTS "expert_patents";

    ALTER TABLE "_expert_transcripts_v"
      DROP COLUMN IF EXISTS "version_expert_bio",
      DROP COLUMN IF EXISTS "version_expert_experience",
      DROP COLUMN IF EXISTS "version_expert_patents";
  `)
}
