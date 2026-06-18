// Public HappierLeads client id. Overridable via env; defaults to the provided trial id.
const HAPPIERLEADS_CLIENT_ID =
  process.env.NEXT_PUBLIC_HAPPIERLEADS_CLIENT_ID ?? 'eP1KoANrhBtF8gNSi3ANg5'

/**
 * Page-specific HappierLeads visitor de-anonymisation — loaded ONLY on pages that
 * render this component (currently the EV Ecosystem report landing page).
 *
 * Rendered as a raw inline <script> (server-rendered into the HTML) rather than
 * next/script, so the snippet is present in the page source for HappierLeads'
 * installer/validator. Loads unconditionally (ungated), same as Rb2bPageScript.
 */
export function HappierLeadsPageScript() {
  if (!HAPPIERLEADS_CLIENT_ID) return null

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `!function(){var e="rest.happierleads.com/v3/script?clientId=${HAPPIERLEADS_CLIENT_ID}&version=4.0.0",t=document.createElement("script");window.location.protocol.split(":")[0];t.src="https://"+e;var c=document.getElementsByTagName("script")[0];t.async=true;t.onload=function(){new Happierleads.default};c.parentNode.insertBefore(t,c)}();`,
      }}
    />
  )
}
