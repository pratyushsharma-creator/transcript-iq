'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'tiq-cookie-consent'

/**
 * Consent-aware analytics tags.
 * Reads the same localStorage key as CookieBanner so consent is always in sync.
 * Loads nothing until the user has accepted cookies.
 * All three tags are loaded together — if the user accepted, all fire;
 * if they declined (or haven't decided), nothing loads.
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
