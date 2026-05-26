import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

/**
 * Migration: convert FAQ answer field from richText (Lexical JSONB) to textarea (TEXT)
 *
 * The answer field was stored as Lexical editor JSON (JSONB) — but the admin editor was
 * not interactive in nested array-block contexts, making answers un-editable.
 *
 * We:
 *   1. Extract the plain text content from each Lexical JSON node (recursive)
 *   2. Replace the JSONB column with a TEXT column carrying the extracted content
 *
 * The frontend renderer (lexicalToText) already handles plain strings, so no
 * frontend changes are required.
 */

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Step 1: add a temporary TEXT column to hold the extracted plain text
  await db.execute(sql`
    ALTER TABLE "pages_blocks_faq_items"
      ADD COLUMN IF NOT EXISTS "answer_text" text;
  `)

  // Step 2: extract plain text from the Lexical JSON tree.
  //   Lexical structure: { root: { children: [ { children: [ { text: "..." } ] } ] } }
  //   We walk two levels of children[] and concatenate all "text" leaf values,
  //   joining paragraphs with a double newline so multi-paragraph answers are preserved.
  await db.execute(sql`
    UPDATE "pages_blocks_faq_items"
    SET "answer_text" = (
      SELECT string_agg(paragraph_text, E'\n\n' ORDER BY para_ord)
      FROM (
        SELECT
          para_ord,
          string_agg(leaf->>'text', '' ORDER BY leaf_ord) AS paragraph_text
        FROM (
          SELECT
            para_row.ordinality            AS para_ord,
            leaf_row.ordinality            AS leaf_ord,
            leaf_row.value                 AS leaf
          FROM
            jsonb_array_elements(
              COALESCE("answer"->'root'->'children', '[]'::jsonb)
            ) WITH ORDINALITY AS para_row(para, ordinality),
            jsonb_array_elements(
              COALESCE(para_row.para->'children', '[]'::jsonb)
            ) WITH ORDINALITY AS leaf_row(value, ordinality)
          WHERE leaf_row.value->>'text' IS NOT NULL
            AND leaf_row.value->>'text' != ''
        ) leaves
        GROUP BY para_ord
        HAVING string_agg(leaf->>'text', '') != ''
      ) paragraphs
    )
    WHERE "answer" IS NOT NULL
      AND jsonb_typeof("answer") = 'object';
  `)

  // For any rows where the JSONB was already a plain string (shouldn't happen but be safe)
  await db.execute(sql`
    UPDATE "pages_blocks_faq_items"
    SET "answer_text" = "answer" #>> '{}'
    WHERE "answer" IS NOT NULL
      AND jsonb_typeof("answer") = 'string'
      AND "answer_text" IS NULL;
  `)

  // Step 3: drop the old JSONB column and rename the TEXT column
  await db.execute(sql`
    ALTER TABLE "pages_blocks_faq_items"
      DROP COLUMN "answer";

    ALTER TABLE "pages_blocks_faq_items"
      RENAME COLUMN "answer_text" TO "answer";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Reverse: turn the TEXT column back into a JSONB column wrapping text in a Lexical node
  await db.execute(sql`
    ALTER TABLE "pages_blocks_faq_items"
      ADD COLUMN IF NOT EXISTS "answer_jsonb" jsonb;
  `)

  await db.execute(sql`
    UPDATE "pages_blocks_faq_items"
    SET "answer_jsonb" = jsonb_build_object(
      'root', jsonb_build_object(
        'type', 'root',
        'children', jsonb_build_array(
          jsonb_build_object(
            'type', 'paragraph',
            'children', jsonb_build_array(
              jsonb_build_object('type', 'text', 'text', COALESCE("answer", ''))
            )
          )
        )
      )
    )
    WHERE "answer" IS NOT NULL;
  `)

  await db.execute(sql`
    ALTER TABLE "pages_blocks_faq_items"
      DROP COLUMN "answer";

    ALTER TABLE "pages_blocks_faq_items"
      RENAME COLUMN "answer_jsonb" TO "answer";
  `)
}
