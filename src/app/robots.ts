// src/app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/checkout/', '/api/', '/styleguide/'],
    },
    sitemap: 'https://transcript-iq.com/sitemap.xml',
  }
}
