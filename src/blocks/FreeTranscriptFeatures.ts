import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const FreeTranscriptFeatures: Block = {
  slug: 'freeTranscriptFeatures',
  labels: { singular: 'Free Transcript Features', plural: 'Free Transcript Features' },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: "What's in your free PDF" },
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'The same quality as the library.',
    },
    {
      name: 'features',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
      defaultValue: [
        {
          title: 'Full verbatim transcript',
          description:
            "The complete Q&A dialogue — same format as our $349–$599 library transcripts. Every word, timestamp, and speaker label.",
        },
        {
          title: 'Executive summary',
          description:
            'A 150–300 word structured overview written by our research team. Not AI-generated. Covers key findings, data points, and contrarian signals.',
        },
        {
          title: 'Expert profile',
          description:
            'Anonymised background — seniority, sector, tenure. You know exactly who you\'re hearing from, without PII.',
        },
        {
          title: 'MNPI compliance certificate',
          description:
            'The same screening certificate that accompanies every paid transcript. Suitable for internal compliance review.',
        },
      ],
    },
    ...sectionBaseFields,
  ],
}
