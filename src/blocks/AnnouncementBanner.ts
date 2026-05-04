import type { Block } from 'payload'
import { sectionBaseFields } from './_shared'

export const AnnouncementBanner: Block = {
  slug: 'announcementBanner',
  labels: { singular: 'Announcement banner', plural: 'Announcement banners' },
  fields: [
    {
      name: 'tone',
      type: 'select',
      defaultValue: 'mint',
      options: [
        { label: 'Mint (default)', value: 'mint' },
        { label: 'Ink (dark contrast)', value: 'ink' },
        { label: 'Surface (subtle)', value: 'surface' },
      ],
    },
    { name: 'message', type: 'text', required: true },
    { name: 'linkLabel', type: 'text' },
    { name: 'linkUrl', type: 'text' },
    {
      name: 'dismissible',
      type: 'checkbox',
      defaultValue: true,
    },
    ...sectionBaseFields,
  ],
}
