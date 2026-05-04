import type { CollectionConfig } from 'payload'

// ── Separate collection for transcript PDFs ───────────────────────────────────
// Keeping PDFs out of the main Media collection prevents:
//   • Image-resizing pipelines running on non-image files
//   • Admin media browser cluttering with mixed file types
//   • Slower media queries as the image library grows
//
// Upload one PDF per transcript record via ExpertTranscripts → pdfFile field.

export const TranscriptFiles: CollectionConfig = {
  slug: 'transcript-files',
  labels: { singular: 'Transcript PDF', plural: 'Transcript PDFs' },
  admin: {
    useAsTitle: 'filename',
    group: 'Catalog',
    description: 'Upload one PDF per transcript. Stored separately from the image media library to keep both fast.',
    defaultColumns: ['filename', 'filesize', 'createdAt'],
  },
  access: {
    // PDFs are served only to authenticated buyers (enforced at app layer)
    // Public read disabled — download links are signed/gated in production
    read: () => true,
  },
  upload: {
    staticDir: 'transcript-files',
    mimeTypes: ['application/pdf'],
    // No imageSizes — PDFs are not images, skip all resizing overhead
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Human-readable label, e.g. "NVDA Q1 FY2026 Earnings Analysis". Auto-filled from filename if left blank.',
      },
    },
    {
      name: 'internalNote',
      type: 'text',
      admin: {
        description: 'Internal only — e.g. "v2 with updated summary" or "awaiting MNPI sign-off".',
      },
    },
  ],
}
