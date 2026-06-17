import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

/**
 * Migration: create the `ev_report_leads` table.
 *
 * Backs the EvReportLeads collection (leads from the EV Ecosystem report landing
 * page, /reports/ev-ecosystem). Hand-authored to match Payload 3's postgres adapter
 * conventions: serial integer id, varchar text columns, a status ENUM defaulting to
 * 'new', and timestamptz created/updated columns with btree indexes.
 *
 * All statements are guarded (IF NOT EXISTS / DO block) so the migration is safe
 * to re-run and won't clash if the table was already created via dev push mode.
 */

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── Status enum (CREATE TYPE has no IF NOT EXISTS — guard with a DO block) ────
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_ev_report_leads_status') THEN
        CREATE TYPE "public"."enum_ev_report_leads_status" AS ENUM('new', 'contacted', 'qualified', 'converted', 'not_a_fit');
      END IF;
    END $$;
  `)

  // ── Table ────────────────────────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "ev_report_leads" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "email" varchar NOT NULL,
      "company" varchar NOT NULL,
      "role" varchar,
      "message" varchar,
      "utm_source" varchar,
      "utm_medium" varchar,
      "utm_campaign" varchar,
      "utm_content" varchar,
      "page_referrer" varchar,
      "status" "enum_ev_report_leads_status" DEFAULT 'new',
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)

  // ── Indexes (Payload creates these for sort/filter on timestamps) ────────────
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "ev_report_leads_updated_at_idx" ON "ev_report_leads" USING btree ("updated_at");
  `)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "ev_report_leads_created_at_idx" ON "ev_report_leads" USING btree ("created_at");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "ev_report_leads";`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_ev_report_leads_status";`)
}
