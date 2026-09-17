# Database & schema changes

## How the database is set up today

Transcript IQ has **one** Neon Postgres database: production. Vercel's Production, Preview and
Development environments — and local `.env.local` files — all point at it. That means:

- **Preview deployments run `payload migrate` against production** during their build, before the PR is merged.
- **`pnpm dev` reads and writes production data.** Test leads, orders and edits are real.

No other project uses this database (the Nextyn apps have their own Neon projects).
See [Recommended setup](#recommended-setup) for separating preview/dev from production.

## Changing the schema

Adding or changing a field, block, collection or global:

1. Change the config in `src/collections`, `src/blocks` or `src/globals`.
2. Generate the migration — never write it by hand:
   ```bash
   pnpm payload migrate:create add_something
   ```
   This writes a `.ts` migration with the SQL diff, a `.json` schema snapshot, and updates
   `src/migrations/index.ts`. Commit all three.
3. Read the generated SQL. Keep it **additive** (new tables/columns), because the preview build
   applies it to production before merge. Drop or rename columns in a follow-up PR, after the code
   that stops using them is live.
4. Open a PR. The Vercel build runs `payload migrate` (`pnpm build`).
5. After it deploys, run `pnpm db:check` — it should report 0 problems.

### Why not hand-write migrations

Payload maintains tables you never declare: `payload_locked_documents_rels` needs a column for every
collection, and each versioned collection has `_<name>_v` tables that mirror its fields. Hand-written
migrations missed these twice — `ev_report_leads_id` (June 2026) and `blog_leads_id` plus a
versions-table column type (September 2026) — and both times `/admin` returned 500 and saves failed.
`migrate:create` diffs against the last `.json` snapshot and gets these right.

Data-only migrations (rewriting content) are fine: create the file with `migrate:create`, then write
the `UPDATE`s in `up`.

## Rules

- **Schema push is off** (`push: false` in `payload.config.ts`). `pnpm dev` no longer changes the
  database schema. If your branch adds fields, your local server will error on them until the
  migration has run — push the branch and let the preview build apply it.
- **Don't run `pnpm payload migrate` locally** while `.env.local` points at production. Let the
  Vercel build apply migrations.
- **Don't remove `scripts/migrate-ci.mjs` warnings from the build log.** If it ever reports a
  "dev-mode sentinel", someone pushed schema directly — run `pnpm db:check`.

## Checking for drift

```bash
pnpm db:check
```

Read-only. Compares every table, column, index, foreign key and enum Payload expects with the
database in `DATABASE_URI`, and exits 1 if anything Payload needs is missing or has the wrong type.
It also lists unused leftovers (old columns, the `redirects` tables) that are safe to ignore.

## Recommended setup

One-time changes that need Neon and Vercel account access:

1. **Separate preview/dev from production.** Create a Neon branch (e.g. `preview`) from the production
   branch, then point Vercel's Preview and Development `DATABASE_URI` / `DATABASE_URI_DIRECT` (and
   local `.env.local` files) at it. Preview builds then migrate the branch, not production.
2. **Turn off scale-to-zero on the production compute** (or raise its suspend timeout). When the
   compute is asleep, the first connections after it wakes can fail with `ECONNRESET` or
   `Authentication timed out`.
