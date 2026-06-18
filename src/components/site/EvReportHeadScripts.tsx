// Public client ids. Overridable via env; default to the live / trial ids.
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID ?? 'x8bt9licv7'
const HAPPIERLEADS_CLIENT_ID =
  process.env.NEXT_PUBLIC_HAPPIERLEADS_CLIENT_ID ?? 'eP1KoANrhBtF8gNSi3ANg5'

/**
 * Microsoft Clarity + HappierLeads loaders, rendered as raw inline <script>s.
 *
 * Mounted inside an explicit <head> element in the (frontend) root layout, gated
 * to /reports/ev-ecosystem (see middleware.ts + the layout) — so the snippets are
 * authored literally into the document <head> (both tools' install instructions
 * ask for them before </head>). Raw <script> is used instead of next/script
 * because beforeInteractive does not reliably hoist into <head> from a dynamic
 * layout in this app.
 *
 * RB2B is intentionally NOT here — it already works inline on the page body.
 */
export function EvReportHeadScripts() {
  return (
    <>
      {CLARITY_ID && (
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`,
          }}
        />
      )}
      {HAPPIERLEADS_CLIENT_ID && (
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(){var e="rest.happierleads.com/v3/script?clientId=${HAPPIERLEADS_CLIENT_ID}&version=4.0.0",t=document.createElement("script");window.location.protocol.split(":")[0];t.src="https://"+e;var c=document.getElementsByTagName("script")[0];t.async=true;t.onload=function(){new Happierleads.default};c.parentNode.insertBefore(t,c)}();`,
          }}
        />
      )}
    </>
  )
}
