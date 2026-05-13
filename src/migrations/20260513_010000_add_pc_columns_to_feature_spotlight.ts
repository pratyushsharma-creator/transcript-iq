import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

/**
 * Migration: add pricing-card (pc) columns to feature_spotlight block tables
 *
 * The FeatureSpotlight block gained a `spotlight.pc` group with four text fields:
 *   eyebrow, price, priceLabel, volumeNote
 *
 * Payload/Drizzle maps nested group fields to flat columns on the block join table.
 * The path spotlight → pc → fieldName becomes "spotlight_pc_<field_name>".
 *
 * Both the live table and the versions copy need the columns.
 * Using ADD COLUMN IF NOT EXISTS so re-runs are safe.
 */

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Live blocks table
    ALTER TABLE "pages_blocks_feature_spotlight"
      ADD COLUMN IF NOT EXISTS "spotlight_pc_eyebrow"    varchar,
      ADD COLUMN IF NOT EXISTS "spotlight_pc_price"       varchar,
      ADD COLUMN IF NOT EXISTS "spotlight_pc_price_label" varchar,
      ADD COLUMN IF NOT EXISTS "spotlight_pc_volume_note" varchar;

    -- Versions blocks table (mirrors the live table structure; no "version_" prefix
    -- because this is a dedicated block sub-table, not a flat collection version row)
    ALTER TABLE "_pages_v_blocks_feature_spotlight"
      ADD COLUMN IF NOT EXISTS "spotlight_pc_eyebrow"    varchar,
      ADD COLUMN IF NOT EXISTS "spotlight_pc_price"       varchar,
      ADD COLUMN IF NOT EXISTS "spotlight_pc_price_label" varchar,
      ADD COLUMN IF NOT EXISTS "spotlight_pc_volume_note" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_feature_spotlight"
      DROP COLUMN IF EXISTS "spotlight_pc_eyebrow",
      DROP COLUMN IF EXISTS "spotlight_pc_price",
      DROP COLUMN IF EXISTS "spotlight_pc_price_label",
      DROP COLUMN IF EXISTS "spotlight_pc_volume_note";

    ALTER TABLE "_pages_v_blocks_feature_spotlight"
      DROP COLUMN IF EXISTS "spotlight_pc_eyebrow",
      DROP COLUMN IF EXISTS "spotlight_pc_price",
      DROP COLUMN IF EXISTS "spotlight_pc_price_label",
      DROP COLUMN IF EXISTS "spotlight_pc_volume_note";
  `)
}
