// Microsoft Clarity project id. Overridable via env; defaults to the live id.
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID ?? 'x8bt9licv7'

/**
 * Page-specific Microsoft Clarity loader — rendered as a raw inline <script>
 * (server-rendered into the HTML, so it's present in the page source and loads
 * immediately) on the pages that mount it. Mirrors Rb2bPageScript; ungated.
 *
 * IMPORTANT: on any page that renders this, pass `clarity={false}` to
 * <AnalyticsTags> so Clarity isn't ALSO injected via afterInteractive, which
 * would load the tag twice.
 */
export function ClarityPageScript() {
  if (!CLARITY_ID) return null

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`,
      }}
    />
  )
}
