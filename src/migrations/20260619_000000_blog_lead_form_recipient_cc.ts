import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

/**
 * Migration: per-post lead-form CC.
 *
 * Adds the `leadForm.recipientCc` field as `lead_form_recipient_cc` on
 * `blog_posts` (and `version_lead_form_recipient_cc` on `_blog_posts_v`).
 * Holds a comma-separated list of addresses CC'd on that post's lead
 * notifications, on top of the global NOTIFICATION_CC_EMAILS list.
 *
 * Additive and idempotent (IF NOT EXISTS) — safe to re-run.
 */

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "blog_posts"
      ADD COLUMN IF NOT EXISTS "lead_form_recipient_cc" varchar;
  `)
  await db.execute(sql`
    ALTER TABLE "_blog_posts_v"
      ADD COLUMN IF NOT EXISTS "version_lead_form_recipient_cc" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "blog_posts" DROP COLUMN IF EXISTS "lead_form_recipient_cc";
  `)
  await db.execute(sql`
    ALTER TABLE "_blog_posts_v" DROP COLUMN IF EXISTS "version_lead_form_recipient_cc";
  `)
}
