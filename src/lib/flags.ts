// src/lib/flags.ts
//
// Feature flags for temporarily hiding/showing site sections.
//
// Earnings Analysis (/earnings-analysis + all report detail pages) is hidden
// for now. While this flag is `false`:
//   - the listing page and every report URL temporarily redirect (307) to the
//     Transcript Library, so the URLs can be reclaimed cleanly on relaunch
//   - the "Earnings Analysis" links are removed from the header + footer nav
//   - the section is excluded from sitemap.xml
//
// To relaunch: set this to `true` and deploy. Nothing else is required — all
// routes, components and the 24 reports in Payload are left untouched.
export const EARNINGS_ANALYSIS_ENABLED = false
