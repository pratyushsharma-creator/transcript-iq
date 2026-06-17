// Public RB2B (reb2b) client key. Overridable via env; defaults to the provided key.
const RB2B_KEY = process.env.NEXT_PUBLIC_RB2B_KEY ?? '0NW1GHZ910O4'

/**
 * Page-specific RB2B (reb2b) visitor de-anonymisation — loaded ONLY on pages that
 * render this component (currently the EV Ecosystem report landing page).
 *
 * Rendered as a raw inline <script> (server-rendered into the HTML) rather than
 * next/script, so it is present in the page source — RB2B's installer/validator
 * fetches the HTML and must see the snippet there. Loads unconditionally (ungated).
 */
export function Rb2bPageScript() {
  if (!RB2B_KEY) return null

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `!function(key){if(window.reb2b)return;window.reb2b={loaded:true};var s=document.createElement("script");s.async=true;s.src="https://ddwl4m2hdecbv.cloudfront.net/b/"+key+"/"+key+".js.gz";document.getElementsByTagName("script")[0].parentNode.insertBefore(s,document.getElementsByTagName("script")[0]);}("${RB2B_KEY}");`,
      }}
    />
  )
}
