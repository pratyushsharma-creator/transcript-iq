'use client'

import Script from 'next/script'

/**
 * Presentational analytics tags — renders all configured tracking scripts with NO
 * consent logic of its own. Each tag is env-gated (renders only if its ID is set).
 *
 * Consumed in two ways:
 *   - <Analytics> (global, in the layout) — renders this only after cookie consent.
 *   - The EV report landing + thank-you pages — render this ungated (per decision),
 *     and <Analytics> skips those routes so nothing loads twice.
 *
 * Env vars:
 *   NEXT_PUBLIC_GA4_ID, NEXT_PUBLIC_GOOGLE_ADS_ID, NEXT_PUBLIC_CLARITY_ID,
 *   NEXT_PUBLIC_META_PIXEL_ID, NEXT_PUBLIC_LINKEDIN_PARTNER_ID,
 *   NEXT_PUBLIC_BING_UET_ID, NEXT_PUBLIC_TABOOLA_ID
 */
export function AnalyticsTags() {
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID
  const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID
  const linkedInPartnerId = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID
  const bingUetId = process.env.NEXT_PUBLIC_BING_UET_ID
  const taboolaId = process.env.NEXT_PUBLIC_TABOOLA_ID

  return (
    <>
      {/* ── Google Analytics 4 ──────────────────────────────────────────── */}
      {ga4Id && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ga4Id}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      {/* ── Google Ads (conversion tracking) ────────────────────────────── */}
      {googleAdsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-ads-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAdsId}');
            `}
          </Script>
        </>
      )}

      {/* ── Microsoft Clarity ───────────────────────────────────────────── */}
      {clarityId && (
        <Script id="clarity-init" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window,document,"clarity","script","${clarityId}");
          `}
        </Script>
      )}

      {/* ── Meta Pixel ──────────────────────────────────────────────────── */}
      {metaPixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {/* ── LinkedIn Insight Tag ─────────────────────────────────────────── */}
      {linkedInPartnerId && (
        <Script id="linkedin-insight" strategy="afterInteractive">
          {`
            _linkedin_partner_id = "${linkedInPartnerId}";
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(_linkedin_partner_id);
            (function(l) {
              if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
              window.lintrk.q=[]}
              var s = document.getElementsByTagName("script")[0];
              var b = document.createElement("script");
              b.type = "text/javascript";b.async = true;
              b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
              s.parentNode.insertBefore(b, s);
            })(window.lintrk);
          `}
        </Script>
      )}

      {/* ── Microsoft Advertising (Bing) UET ─────────────────────────────── */}
      {bingUetId && (
        <Script id="bing-uet" strategy="afterInteractive">
          {`
            (function(w,d,t,r,u){
              var f,n,i;
              w[u]=w[u]||[],f=function(){
                var o={ti:"${bingUetId}", enableAutoSpaTracking:true};
                o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")
              },
              n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function(){
                var s=this.readyState;
                s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)
              },
              i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)
            })(window,document,"script","//bat.bing.com/bat.js","uetq");
          `}
        </Script>
      )}

      {/* ── Taboola Pixel ───────────────────────────────────────────────── */}
      {taboolaId && (
        <Script id="taboola-pixel" strategy="afterInteractive">
          {`
            window._tfa = window._tfa || [];
            !function (t, f, a, x) {
              if (!document.getElementById(x)) {
                t.async = 1; t.src = a; t.id = x; f.parentNode.insertBefore(t, f);
              }
            }(document.createElement('script'), document.getElementsByTagName('script')[0],
              '//cdn.taboola.com/libtrc/unip/${taboolaId}/tfa.js', 'tb_tfa_script');
            _tfa.push({ notify: 'event', name: 'page_view', id: ${taboolaId} });
          `}
        </Script>
      )}
    </>
  )
}
