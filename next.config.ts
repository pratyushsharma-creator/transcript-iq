import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'
import { EARNINGS_ANALYSIS_ENABLED } from './src/lib/flags'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  async redirects() {
    const redirects = [
      // Legacy seed-data URLs that shipped with wrong paths
      { source: '/transcripts', destination: '/expert-transcripts', permanent: true },
      { source: '/transcript-library', destination: '/expert-transcripts', permanent: true },
      { source: '/blog', destination: '/resources', permanent: true },
    ]

    if (EARNINGS_ANALYSIS_ENABLED) {
      redirects.push({ source: '/earnings', destination: '/earnings-analysis', permanent: true })
    } else {
      // Earnings Analysis is temporarily hidden. Send the section, its custom
      // request page, and the legacy /earnings alias to the closest live page
      // with a TEMPORARY (307) redirect so the URLs can be reclaimed on relaunch.
      redirects.push(
        { source: '/earnings', destination: '/expert-transcripts', permanent: false },
        { source: '/earnings-analysis', destination: '/expert-transcripts', permanent: false },
        { source: '/earnings-analysis/:slug*', destination: '/expert-transcripts', permanent: false },
        { source: '/custom-earnings', destination: '/custom-reports', permanent: false },
      )
    }

    return redirects
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      {
        // Self-hosted blog assets in /public/blog (e.g. per-article hero covers)
        pathname: '/blog/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
