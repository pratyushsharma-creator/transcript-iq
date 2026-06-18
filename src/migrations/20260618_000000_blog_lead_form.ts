import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

/**
 * Migration: blog lead form + per-post CTA support.
 *
 * 1. Adds the `leadForm` group columns to `blog_posts` and its versions table
 *    `_blog_posts_v`. Payload/Drizzle flattens group sub-fields to
 *    `lead_form_<field>` columns, prefixed with `version_` on the _v table.
 * 2. Creates the `blog_leads` table (+ status enum) backing the BlogLeads
 *    collection — submissions from the per-post sidebar form (POST /api/blog-leads).
 *
 * The in-body CTA banner is a Lexical block stored inside the existing `body`
 * JSON column, so it needs no schema change.
 *
 * Every statement is guarded (IF NOT EXISTS / DO block) so the migration is
 * additive, backward-compatible, and safe to re-run.
 */

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── leadForm columns — live table ───────────────────────────────────────────
  await db.execute(sql`
    ALTER TABLE "blog_posts"
      ADD COLUMN IF NOT EXISTS "lead_form_enabled" boolean,
      ADD COLUMN IF NOT EXISTS "lead_form_eyebrow" varchar,
      ADD COLUMN IF NOT EXISTS "lead_form_heading" varchar,
      ADD COLUMN IF NOT EXISTS "lead_form_subline" varchar,
      ADD COLUMN IF NOT EXISTS "lead_form_select_label" varchar,
      ADD COLUMN IF NOT EXISTS "lead_form_select_options" varchar,
      ADD COLUMN IF NOT EXISTS "lead_form_collect_company" boolean,
      ADD COLUMN IF NOT EXISTS "lead_form_collect_message" boolean,
      ADD COLUMN IF NOT EXISTS "lead_form_submit_label" varchar,
      ADD COLUMN IF NOT EXISTS "lead_form_success_message" varchar,
      ADD COLUMN IF NOT EXISTS "lead_form_fineprint" varchar,
      ADD COLUMN IF NOT EXISTS "lead_form_recipient" varchar;
  `)

  // ── leadForm columns — versions table (version_ prefix) ─────────────────────
  await db.execute(sql`
    ALTER TABLE "_blog_posts_v"
      ADD COLUMN IF NOT EXISTS "version_lead_form_enabled" boolean,
      ADD COLUMN IF NOT EXISTS "version_lead_form_eyebrow" varchar,
      ADD COLUMN IF NOT EXISTS "version_lead_form_heading" varchar,
      ADD COLUMN IF NOT EXISTS "version_lead_form_subline" varchar,
      ADD COLUMN IF NOT EXISTS "version_lead_form_select_label" varchar,
      ADD COLUMN IF NOT EXISTS "version_lead_form_select_options" varchar,
      ADD COLUMN IF NOT EXISTS "version_lead_form_collect_company" boolean,
      ADD COLUMN IF NOT EXISTS "version_lead_form_collect_message" boolean,
      ADD COLUMN IF NOT EXISTS "version_lead_form_submit_label" varchar,
      ADD COLUMN IF NOT EXISTS "version_lead_form_success_message" varchar,
      ADD COLUMN IF NOT EXISTS "version_lead_form_fineprint" varchar,
      ADD COLUMN IF NOT EXISTS "version_lead_form_recipient" varchar;
  `)

  // ── blog_leads status enum (CREATE TYPE has no IF NOT EXISTS — guard it) ─────
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_blog_leads_status') THEN
        CREATE TYPE "public"."enum_blog_leads_status" AS ENUM('new', 'contacted', 'qualified', 'converted', 'not_a_fit');
      END IF;
    END $$;
  `)

  // ── blog_leads table ────────────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "blog_leads" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "email" varchar NOT NULL,
      "role" varchar,
      "company" varchar,
      "message" varchar,
      "blog_title" varchar,
      "blog_slug" varchar,
      "page_referrer" varchar,
      "status" "enum_blog_leads_status" DEFAULT 'new',
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "blog_leads_updated_at_idx" ON "blog_leads" USING btree ("updated_at");
  `)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "blog_leads_created_at_idx" ON "blog_leads" USING btree ("created_at");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "blog_leads";`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_blog_leads_status";`)

  await db.execute(sql`
    ALTER TABLE "blog_posts"
      DROP COLUMN IF EXISTS "lead_form_enabled",
      DROP COLUMN IF EXISTS "lead_form_eyebrow",
      DROP COLUMN IF EXISTS "lead_form_heading",
      DROP COLUMN IF EXISTS "lead_form_subline",
      DROP COLUMN IF EXISTS "lead_form_select_label",
      DROP COLUMN IF EXISTS "lead_form_select_options",
      DROP COLUMN IF EXISTS "lead_form_collect_company",
      DROP COLUMN IF EXISTS "lead_form_collect_message",
      DROP COLUMN IF EXISTS "lead_form_submit_label",
      DROP COLUMN IF EXISTS "lead_form_success_message",
      DROP COLUMN IF EXISTS "lead_form_fineprint",
      DROP COLUMN IF EXISTS "lead_form_recipient";
  `)
  await db.execute(sql`
    ALTER TABLE "_blog_posts_v"
      DROP COLUMN IF EXISTS "version_lead_form_enabled",
      DROP COLUMN IF EXISTS "version_lead_form_eyebrow",
      DROP COLUMN IF EXISTS "version_lead_form_heading",
      DROP COLUMN IF EXISTS "version_lead_form_subline",
      DROP COLUMN IF EXISTS "version_lead_form_select_label",
      DROP COLUMN IF EXISTS "version_lead_form_select_options",
      DROP COLUMN IF EXISTS "version_lead_form_collect_company",
      DROP COLUMN IF EXISTS "version_lead_form_collect_message",
      DROP COLUMN IF EXISTS "version_lead_form_submit_label",
      DROP COLUMN IF EXISTS "version_lead_form_success_message",
      DROP COLUMN IF EXISTS "version_lead_form_fineprint",
      DROP COLUMN IF EXISTS "version_lead_form_recipient";
  `)
}
