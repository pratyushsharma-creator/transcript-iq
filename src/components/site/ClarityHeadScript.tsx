// Microsoft Clarity project id. Overridable via env; defaults to the live id.
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID ?? 'x8bt9licv7'

/**
 * Microsoft Clarity loader — raw inline <script> in the explicit <head>, rendered
 * ONLY on /reports/ev-ecosystem (gated in the (frontend) root layout via the
 * x-pathname middleware header).
 *
 * Every other route loads Clarity via the global, consent-gated <Analytics>, so
 * Clarity is NOT placed here site-wide.
 */
export function ClarityHeadScript() {
  if (!CLARITY_ID) return null

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`,
      }}
    />
  )
}
