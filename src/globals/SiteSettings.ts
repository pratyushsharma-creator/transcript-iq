import type { GlobalConfig } from 'payload'

const navItemFields = [
  { name: 'label', type: 'text', required: true },
  { name: 'url', type: 'text', required: true },
] as const

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'companyName',
      type: 'text',
      defaultValue: 'Transcript IQ',
      required: true,
    },
    { name: 'tagline', type: 'text' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'logoDark', type: 'upload', relationTo: 'media' },
    { name: 'favicon', type: 'upload', relationTo: 'media' },
    {
      name: 'social',
      type: 'group',
      fields: [
        { name: 'twitter', type: 'text', label: 'Twitter / X URL' },
        { name: 'linkedin', type: 'text', label: 'LinkedIn URL' },
        { name: 'youtube', type: 'text', label: 'YouTube URL' },
      ],
    },
    {
      name: 'navigation',
      type: 'array',
      label: 'Header navigation',
      fields: [
        ...navItemFields,
        {
          name: 'children',
          type: 'array',
          fields: [...navItemFields],
        },
      ],
    },
    {
      name: 'footerLinks',
      type: 'array',
      label: 'Footer links',
      fields: [
        ...navItemFields,
        {
          name: 'children',
          type: 'array',
          fields: [...navItemFields],
        },
      ],
    },
    {
      name: 'defaultMeta',
      type: 'group',
      label: 'Default SEO metadata',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
