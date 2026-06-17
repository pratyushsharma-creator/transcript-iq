'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'tiq-cookie-consent'

/**
 * Consent-aware analytics tags.
 * Reads the same localStorage key as CookieBanner so consent is always in sync.
 * Loads nothing until the user has accepted cookies.
 * All tags are loaded together — if the user accepted, all fire;
 * if they declined (or haven't decided), nothing loads.
 *
 * Env vars required (set in Vercel + .env.local):
 *   NEXT_PUBLIC_GA4_ID            — Google Analytics 4 measurement ID (G-XXXXXXXX)
 *   NEXT_PUBLIC_GOOGLE_ADS_ID     — Google Ads tag ID (AW-XXXXXXXXX) for conversion tracking (optional)
 *   NEXT_PUBLIC_CLARITY_ID        — Microsoft Clarity project ID
 *   NEXT_PUBLIC_META_PIXEL_ID     — Meta Pixel ID (optional)
 *   NEXT_PUBLIC_LINKEDIN_PARTNER_ID — LinkedIn Insight Tag partner ID (optional)
 *
 * NOTE: Warmly is intentionally NOT loaded here. It is page-specific — see
 * <WarmlyPageScript /> (currently only on the EV Ecosystem report landing page).
 */
export function Analytics() {
  const [consent, setConsent] = useState(false)

  useEffect(() => {
    function checkConsent() {
      try {
        setConsent(localStorage.getItem(STORAGE_KEY) === 'accepted')
      } catch {
        // localStorage unavailable (privacy mode, SSR guard)
      }
    }

    checkConsent()

    // Re-check if the user accepts later in the session (same tab)
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) checkConsent()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  if (!consent) return null

  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID
  const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID
  const linkedInPartnerId = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID

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
    </>
  )
}
