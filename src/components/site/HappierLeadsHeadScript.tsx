// Public HappierLeads client id. Overridable via env; defaults to the trial id.
const HAPPIERLEADS_CLIENT_ID =
  process.env.NEXT_PUBLIC_HAPPIERLEADS_CLIENT_ID ?? 'eP1KoANrhBtF8gNSi3ANg5'

/**
 * HappierLeads loader — raw inline <script>, rendered inside the explicit <head>
 * in the (frontend) root layout on EVERY route (site-wide), per HappierLeads'
 * install instructions (snippet in <head>, across the whole site).
 *
 * Ungated (fires on load, no cookie-consent gate) — consistent with the other
 * B2B de-anonymisation tools on this site (RB2B).
 */
export function HappierLeadsHeadScript() {
  if (!HAPPIERLEADS_CLIENT_ID) return null

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `!function(){var e="rest.happierleads.com/v3/script?clientId=${HAPPIERLEADS_CLIENT_ID}&version=4.0.0",t=document.createElement("script");window.location.protocol.split(":")[0];t.src="https://"+e;var c=document.getElementsByTagName("script")[0];t.async=true;t.onload=function(){new Happierleads.default};c.parentNode.insertBefore(t,c)}();`,
      }}
    />
  )
}
