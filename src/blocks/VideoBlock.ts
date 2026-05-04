import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const VideoBlock: Block = {
  slug: 'videoBlock',
  labels: { singular: 'Video', plural: 'Video blocks' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'source',
      type: 'select',
      required: true,
      defaultValue: 'youtube',
      options: [
        { label: 'YouTube', value: 'youtube' },
        { label: 'Vimeo', value: 'vimeo' },
        { label: 'Hosted file (uploaded)', value: 'hosted' },
        { label: 'External URL', value: 'url' },
      ],
    },
    {
      name: 'youtubeId',
      type: 'text',
      admin: { condition: (_, sib) => sib?.source === 'youtube', description: 'Just the ID (e.g. dQw4w9WgXcQ).' },
    },
    {
      name: 'vimeoId',
      type: 'text',
      admin: { condition: (_, sib) => sib?.source === 'vimeo' },
    },
    {
      name: 'hostedFile',
      type: 'upload',
      relationTo: 'media',
      admin: { condition: (_, sib) => sib?.source === 'hosted' },
    },
    {
      name: 'externalUrl',
      type: 'text',
      admin: { condition: (_, sib) => sib?.source === 'url' },
    },
    { name: 'poster', type: 'upload', relationTo: 'media' },
    {
      name: 'autoplay',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Autoplay muted (e.g. background loop).' },
    },
    {
      name: 'loop',
      type: 'checkbox',
      defaultValue: false,
    },
    ...sectionBaseFields,
  ],
}
