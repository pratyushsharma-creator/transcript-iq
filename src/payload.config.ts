import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { stripePlugin } from '@payloadcms/plugin-stripe'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig, type Plugin } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import {
  Users,
  Media,
  Pages,
  BlogPosts,
  ExpertTranscripts,
  EarningsAnalyses,
  Companies,
  Bundles,
  Categories,
  Industries,
  Authors,
  Orders,
  Subscriptions,
  TranscriptFiles,
} from './collections'
import { SiteSettings } from './globals'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const plugins: Plugin[] = [
  seoPlugin({
    // 'pages', 'expert-transcripts', 'earnings-analyses' intentionally excluded:
    // those collections define standalone metaTitle/metaDescription fields, and the
    // seoPlugin's meta.* group maps to the same DB columns (meta_title, meta_description),
    // causing a duplicate-column SQL error on every INSERT/draft creation.
    collections: ['blog-posts', 'bundles'],
    uploadsCollection: 'media',
    generateTitle: ({ doc }) =>
      doc?.title || doc?.name ? `${doc?.title ?? doc?.name} — Transcript IQ` : 'Transcript IQ',
    generateDescription: ({ doc }) =>
      (doc?.summary as string | undefined) ??
      (doc?.excerpt as string | undefined) ??
      (doc?.executiveSummaryPreview as string | undefined) ??
      (doc?.description as string | undefined) ??
      '',
  }),
  redirectsPlugin({
    collections: ['pages', 'blog-posts'],
  }),
]

if (process.env.STRIPE_SECRET_KEY) {
  plugins.push(
    stripePlugin({
      stripeSecretKey: process.env.STRIPE_SECRET_KEY,
      stripeWebhooksEndpointSecret: process.env.STRIPE_WEBHOOK_SECRET,
      isTestKey: process.env.STRIPE_SECRET_KEY.startsWith('sk_test_'),
      rest: false,
    }),
  )
}

// Private store for purchased transcript PDF files
if (process.env.BLOB_READ_WRITE_TOKEN) {
  plugins.push(
    vercelBlobStorage({
      collections: { 'transcript-files': true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  )
}

// Public store for media uploads (logos, images, etc.)
if (process.env.BLOB_MEDIA_READ_WRITE_TOKEN) {
  plugins.push(
    vercelBlobStorage({
      collections: { media: true },
      token: process.env.BLOB_MEDIA_READ_WRITE_TOKEN,
    }),
  )
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — Transcript IQ Admin',
    },
    components: {
      views: {
        bulkUpload: {
          Component: '@/components/admin/BulkUploader#BulkUploaderPage',
          path: '/bulk-import',
          exact: true,
        },
      },
    },
  },
  collections: [
    Users,
    Pages,
    BlogPosts,
    ExpertTranscripts,
    EarningsAnalyses,
    Bundles,
    Companies,
    Authors,
    Categories,
    Industries,
    Orders,
    Subscriptions,
    Media,
    TranscriptFiles,
  ],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  plugins,
})
