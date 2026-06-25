// Public ids. Overridable via env; default to the live / trial ids.
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID ?? 'G-WWNHDYT1HZ'
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID ?? 'x8bt9licv7'
const UET_TAG_ID = process.env.NEXT_PUBLIC_BING_UET_ID ?? '187259236'
const HAPPIERLEADS_CLIENT_ID =
  process.env.NEXT_PUBLIC_HAPPIERLEADS_CLIENT_ID ?? 'eP1KoANrhBtF8gNSi3ANg5'

/**
 * GA4 + Microsoft Clarity + Microsoft UET + HappierLeads loaders, rendered as raw inline <script>s.
 *
 * Mounted inside an explicit <head> element in the (frontend) root layout, gated
 * to /reports/ev-ecosystem (see middleware.ts + the layout) — authored literally
 * into the document <head>. Raw <script> is used instead of next/script because
 * next/script (before/afterInteractive) does not reliably inject on this dynamic
 * route in this app, so GA4 + Clarity + UET + HappierLeads are loaded here directly.
 *
 * The Microsoft UET tag is the verbatim official snippet; Microsoft requires it in
 * the document <head>, which is exactly where this component mounts.
 *
 * GA4 defines a global `gtag` so trackEvent (lib/analytics/events) works on this
 * page. AnalyticsTags is passed ga4={false} + clarity={false} + uet={false} here to
 * avoid a double-load. RB2B is intentionally NOT here — it already works inline on the body.
 */
export function EvReportHeadScripts() {
  return (
    <>
      {GA4_ID && (
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA4_ID}',{anonymize_ip:true});(function(){var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${GA4_ID}';var f=document.getElementsByTagName('script')[0];f.parentNode.insertBefore(s,f);})();`,
          }}
        />
      )}
      {CLARITY_ID && (
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`,
          }}
        />
      )}
      {UET_TAG_ID && (
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,t,r,u){var f,n,i;w[u]=w[u]||[],f=function(){var o={ti:"${UET_TAG_ID}", enableAutoSpaTracking:true};o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")},n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function(){var s=this.readyState;s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)},i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)})(window,document,"script","//bat.bing.com/bat.js","uetq");`,
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
