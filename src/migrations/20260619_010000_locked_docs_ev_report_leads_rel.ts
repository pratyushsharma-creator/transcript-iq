import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

/**
 * Migration: repair payload_locked_documents_rels for ev-report-leads.
 *
 * The 20260617 ev_report_leads migration created the collection table but did
 * NOT add its relation column to `payload_locked_documents_rels` (the table
 * Payload's document-locking joins across every collection). The missing
 * `ev_report_leads_id` column made every `update` (admin save + REST/local
 * API) throw `Failed query: select ... from payload_locked_documents`.
 *
 * This adds the column + FK + index, matching Payload's exact naming for the
 * 16 sibling collection relations. Additive and idempotent — safe to re-run.
 */

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "ev_report_leads_id" integer;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_ev_report_leads_fk"
        FOREIGN KEY ("ev_report_leads_id") REFERENCES "public"."ev_report_leads"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `)

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_ev_report_leads_id_idx"
      ON "payload_locked_documents_rels" USING btree ("ev_report_leads_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP INDEX IF EXISTS "payload_locked_documents_rels_ev_report_leads_id_idx";`)
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_ev_report_leads_fk";
  `)
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "ev_report_leads_id";
  `)
}
