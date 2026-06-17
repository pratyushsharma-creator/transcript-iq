'use client'

import Script from 'next/script'

// Public RB2B (reb2b) client key. Overridable via env; defaults to the provided key.
const RB2B_KEY = process.env.NEXT_PUBLIC_RB2B_KEY ?? '0NW1GHZ910O4'

/**
 * Page-specific RB2B (reb2b) visitor de-anonymisation — loaded ONLY on pages that
 * render this component (currently the EV Ecosystem report landing page), not site-wide.
 *
 * Loads unconditionally (no consent gate) per product decision.
 */
export function Rb2bPageScript() {
  if (!RB2B_KEY) return null

  return (
    <Script id="reb2b" strategy="afterInteractive">
      {`!function(key){if(window.reb2b)return;window.reb2b={loaded:true};var s=document.createElement("script");s.async=true;s.src="https://ddwl4m2hdecbv.cloudfront.net/b/"+key+"/"+key+".js.gz";document.getElementsByTagName("script")[0].parentNode.insertBefore(s,document.getElementsByTagName("script")[0]);}("${RB2B_KEY}");`}
    </Script>
  )
}
