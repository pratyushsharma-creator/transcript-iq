import Script from 'next/script'

// Public HappierLeads client id. Overridable via env; defaults to the provided trial id.
const HAPPIERLEADS_CLIENT_ID =
  process.env.NEXT_PUBLIC_HAPPIERLEADS_CLIENT_ID ?? 'eP1KoANrhBtF8gNSi3ANg5'

/**
 * HappierLeads visitor de-anonymisation loader.
 *
 * Rendered via next/script with strategy="beforeInteractive" so Next injects the
 * snippet into the document <head> (HappierLeads asks for it before </head>).
 * Mounted ONLY from the EV report route layout, so it stays scoped to that page.
 */
export function HappierLeadsPageScript() {
  if (!HAPPIERLEADS_CLIENT_ID) return null

  return (
    <Script id="happierleads-loader" strategy="beforeInteractive">
      {`!function(){var e="rest.happierleads.com/v3/script?clientId=${HAPPIERLEADS_CLIENT_ID}&version=4.0.0",t=document.createElement("script");window.location.protocol.split(":")[0];t.src="https://"+e;var c=document.getElementsByTagName("script")[0];t.async=true;t.onload=function(){new Happierleads.default};c.parentNode.insertBefore(t,c)}();`}
    </Script>
  )
}
