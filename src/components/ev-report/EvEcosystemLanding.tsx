'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useCart } from '@/context/CartContext'
import { EV_REPORT } from '@/lib/ev-report/content'
import { getStoredUtm } from '@/components/site/UTMCapture'
import {
  trackEvent,
  trackAdsConversion,
  trackBingEvent,
  trackTaboolaEvent,
} from '@/lib/analytics/events'

const REPORT_CART_ITEM = {
  id: 'ev-ecosystem-report',
  slug: 'ev-ecosystem-report',
  type: 'report' as const,
  title: 'Can Europe Win the EV Ecosystem? — Research Report',
  priceUsd: EV_REPORT.priceUsd,
  originalPriceUsd: EV_REPORT.originalPriceUsd,
}

/**
 * EV Ecosystem report landing — editorial redesign (fully wired).
 *
 * The approved HTML design is ported as scoped CSS + markup (MARKUP_TOP +
 * MARKUP_FOOTER, via dangerouslySetInnerHTML) so the page matches the design 1:1.
 *
 * Interactivity:
 *   - [data-ev-buy] CTAs add the report to the cart + open the drawer (Stripe flow).
 *   - The lead form (#talk) is a real React <form> posting to /api/ev-report-leads
 *     (same payload/behaviour as AnalystLeadForm: UTM capture, validation, conversions).
 *   - The FAQ accordion is wired via event delegation.
 *
 * Tracking (Clarity + HappierLeads in <head>, RB2B, AnalyticsTags) and Resend are
 * handled by the layout + page. The design ships its own <nav> and <footer>, so the
 * (frontend) layout suppresses the site Header/Footer on this route.
 */

const STYLES = `
  .ev-redesign{
    --ink:#0F1E2C;
    --ink-soft:#1B2E3D;
    --paper:#F7F8F6;
    --paper-card:#FFFFFF;
    --emerald:#0E9F6E;
    --emerald-bright:#10B981;
    --emerald-deep:#0B7A55;
    --muted:#5C6B72;
    --muted-light:#8A969B;
    --hair:#E4E8E3;
    --hair-dark:#273C4C;
    --v-supported:#10B981;
    --v-emerging:#C98A2B;
    --v-contested:#3E80A6;
    --v-not:#B5614E;
    --serif:"Newsreader",Georgia,"Times New Roman",serif;
    --sans:"Geist","Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
    --mono:"Geist Mono","SF Mono",ui-monospace,monospace;
  }
  .ev-redesign *{box-sizing:border-box;margin:0;padding:0}
  .ev-redesign{
    font-family:var(--sans);
    background:var(--paper);
    color:var(--ink);
    line-height:1.6;
    -webkit-font-smoothing:antialiased;
    font-size:17px;
  }
  .ev-redesign a{color:inherit;text-decoration:none}
  .ev-redesign .wrap{max-width:1140px;margin:0 auto;padding:0 32px}
  .ev-redesign .eyebrow{
    font-family:var(--mono);
    font-size:12px;
    letter-spacing:.18em;
    text-transform:uppercase;
    color:var(--emerald-deep);
    font-weight:500;
  }
  .ev-redesign .serif{font-family:var(--serif)}
  .ev-redesign ::selection{background:rgba(16,185,129,.22)}
  .ev-redesign :focus-visible{outline:2px solid var(--emerald);outline-offset:3px;border-radius:2px}

  /* ---------- NAV ---------- */
  .ev-redesign .nav{
    position:sticky;top:0;z-index:50;
    background:rgba(247,248,246,.86);
    backdrop-filter:saturate(180%) blur(12px);
    border-bottom:1px solid var(--hair);
  }
  .ev-redesign .nav-inner{display:flex;align-items:center;justify-content:space-between;height:64px}
  .ev-redesign .brand{font-family:var(--serif);font-size:21px;font-weight:600;letter-spacing:-.01em;display:flex;align-items:baseline;gap:8px}
  .ev-redesign .brand .iq{color:var(--emerald);font-weight:600}
  .ev-redesign .brand .by{font-family:var(--mono);font-size:9px;letter-spacing:.2em;color:var(--muted-light);text-transform:uppercase;align-self:center}
  .ev-redesign .nav-cta{display:flex;align-items:center;gap:18px}
  .ev-redesign .nav-link{font-size:14.5px;color:var(--muted);font-weight:500}
  .ev-redesign .nav-link:hover{color:var(--ink)}
  .ev-redesign .btn{
    font-family:var(--sans);font-size:14.5px;font-weight:600;
    padding:10px 18px;border-radius:7px;cursor:pointer;border:none;
    transition:transform .15s ease,box-shadow .2s ease,background .2s ease;
    display:inline-flex;align-items:center;gap:8px;
  }
  .ev-redesign .btn-primary{background:var(--ink);color:#fff}
  .ev-redesign .btn-primary:hover{background:var(--ink-soft);transform:translateY(-1px)}
  .ev-redesign .btn-emerald{background:var(--emerald);color:#fff;box-shadow:0 1px 0 rgba(0,0,0,.04)}
  .ev-redesign .btn-emerald:hover{background:var(--emerald-deep);transform:translateY(-1px);box-shadow:0 8px 24px -8px rgba(14,159,110,.5)}
  .ev-redesign .btn-ghost{background:transparent;color:var(--ink);border:1px solid var(--hair);}
  .ev-redesign .btn-ghost:hover{border-color:var(--ink);transform:translateY(-1px)}
  .ev-redesign .btn-ghost-light{background:transparent;color:#fff;border:1px solid var(--hair-dark)}
  .ev-redesign .btn-ghost-light:hover{border-color:#fff;transform:translateY(-1px)}
  @media(max-width:760px){.ev-redesign .nav-link{display:none}.ev-redesign .nav-cta .btn-ghost{display:none}}

  /* ---------- HERO ---------- */
  .ev-redesign .hero{padding:84px 0 64px;position:relative;overflow:hidden}
  .ev-redesign .hero-labels{display:flex;flex-wrap:wrap;gap:8px 22px;margin-bottom:34px}
  .ev-redesign .hero-labels span{font-family:var(--mono);font-size:11.5px;letter-spacing:.13em;text-transform:uppercase;color:var(--muted)}
  .ev-redesign .hero-labels b{color:var(--emerald-deep);font-weight:500}
  .ev-redesign .hero h1{
    font-family:var(--serif);font-weight:500;
    font-size:clamp(38px,6.2vw,68px);
    line-height:1.04;letter-spacing:-.02em;
    max-width:24ch;margin-bottom:26px;
  }
  .ev-redesign .hero h1 em{font-style:italic;color:var(--emerald-deep)}
  .ev-redesign .hero-deck{font-family:var(--serif);font-size:clamp(20px,2.4vw,25px);line-height:1.35;color:var(--ink-soft);max-width:30ch;margin-bottom:22px;font-weight:400}
  .ev-redesign .hero-sub{font-size:18px;color:var(--muted);max-width:54ch;margin-bottom:34px;line-height:1.55}
  .ev-redesign .hero-sub strong{color:var(--ink);font-weight:500}
  .ev-redesign .hero-actions{display:flex;flex-wrap:wrap;gap:14px;align-items:center;margin-bottom:30px}
  .ev-redesign .price-tag{display:flex;align-items:baseline;gap:10px;margin-right:6px}
  .ev-redesign .price-now{font-family:var(--serif);font-size:30px;font-weight:600}
  .ev-redesign .price-anchor{font-family:var(--mono);font-size:13px;color:var(--muted-light)}
  .ev-redesign .hero-meta{font-family:var(--mono);font-size:12.5px;color:var(--muted);letter-spacing:.04em;display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center}
  .ev-redesign .hero-meta .dot{width:3px;height:3px;border-radius:50%;background:var(--muted-light)}
  .ev-redesign .trust-row{display:flex;flex-wrap:wrap;gap:10px;margin-top:34px;padding-top:26px;border-top:1px solid var(--hair)}
  .ev-redesign .chip{
    font-family:var(--mono);font-size:11.5px;letter-spacing:.04em;color:var(--ink-soft);
    background:var(--paper-card);border:1px solid var(--hair);border-radius:6px;
    padding:7px 12px;display:inline-flex;align-items:center;gap:7px;
  }
  .ev-redesign .chip svg{width:13px;height:13px;color:var(--emerald)}

  /* ---------- COVERAGE STRIP ---------- */
  .ev-redesign .coverage{padding:62px 0;background:#FCFDFC;border-top:1px solid var(--hair);border-bottom:1px solid var(--hair)}
  .ev-redesign .coverage-lead{color:var(--muted);font-size:16.5px;max-width:62ch;margin:14px 0 30px;line-height:1.55}
  .ev-redesign .coverage-list{border-top:1px solid var(--hair)}
  .ev-redesign .cov-row{display:grid;grid-template-columns:210px 1fr;gap:28px;padding:18px 8px;border-bottom:1px solid var(--hair);align-items:baseline;transition:background .2s,padding .2s}
  .ev-redesign .cov-row:hover{background:#fff;padding-left:16px}
  .ev-redesign .cov-label{font-family:var(--mono);font-size:13px;letter-spacing:.03em;color:var(--emerald-deep);font-weight:500}
  .ev-redesign .cov-angle{font-family:var(--serif);font-size:18.5px;color:var(--ink);line-height:1.32;font-weight:400}
  @media(max-width:680px){.ev-redesign .cov-row{grid-template-columns:1fr;gap:5px;padding:16px 0}.ev-redesign .cov-row:hover{padding-left:0}.ev-redesign .cov-angle{font-size:17px}}

  /* ---------- VERDICT LEDGER ---------- */
  .ev-redesign .ledger{background:var(--ink);color:#E8EEF0;padding:80px 0}
  .ev-redesign .ledger .eyebrow{color:var(--emerald-bright)}
  .ev-redesign .ledger h2{font-family:var(--serif);font-weight:500;font-size:clamp(28px,4vw,44px);line-height:1.08;letter-spacing:-.015em;margin:14px 0 14px;max-width:20ch}
  .ev-redesign .ledger-lead{color:#9FB1B8;max-width:60ch;font-size:16.5px;margin-bottom:46px}
  .ev-redesign .ledger-lead b{color:#fff;font-weight:500}
  .ev-redesign .verdict-group{margin-bottom:34px}
  .ev-redesign .verdict-head{display:flex;align-items:center;gap:12px;margin-bottom:14px}
  .ev-redesign .verdict-dot{width:10px;height:10px;border-radius:2px;flex:none}
  .ev-redesign .verdict-label{font-family:var(--mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;font-weight:500}
  .ev-redesign .verdict-count{font-family:var(--mono);font-size:12px;color:#6E8088;margin-left:auto}
  .ev-redesign .verdict-items{display:grid;gap:1px;background:var(--hair-dark);border:1px solid var(--hair-dark);border-radius:10px;overflow:hidden}
  .ev-redesign .verdict-item{background:var(--ink-soft);padding:16px 20px;display:flex;align-items:center;gap:16px;transition:background .2s ease}
  .ev-redesign .verdict-item:hover{background:#22384A}
  .ev-redesign .verdict-bar{width:3px;align-self:stretch;border-radius:3px;flex:none}
  .ev-redesign .verdict-text{font-size:15.5px;color:#D7E1E5;line-height:1.4}
  .ev-redesign .verdict-text b{color:#fff;font-weight:500}
  .ev-redesign .ledger-foot{margin-top:42px;padding-top:28px;border-top:1px solid var(--hair-dark);display:flex;flex-wrap:wrap;gap:20px;align-items:center;justify-content:space-between}
  .ev-redesign .ledger-foot p{color:#9FB1B8;font-size:15px;max-width:52ch;font-style:italic;font-family:var(--serif)}

  /* ---------- STATS ---------- */
  .ev-redesign .section{padding:84px 0}
  .ev-redesign .section-head{max-width:60ch;margin-bottom:48px}
  .ev-redesign .section-head h2{font-family:var(--serif);font-weight:500;font-size:clamp(28px,4vw,42px);line-height:1.08;letter-spacing:-.015em;margin:14px 0 16px}
  .ev-redesign .section-head p{color:var(--muted);font-size:17px}
  .ev-redesign .stat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--hair);border:1px solid var(--hair);border-radius:12px;overflow:hidden}
  .ev-redesign .stat{background:var(--paper-card);padding:30px 26px}
  .ev-redesign .stat-num{font-family:var(--serif);font-size:46px;font-weight:600;line-height:1;letter-spacing:-.02em;color:var(--ink);margin-bottom:12px}
  .ev-redesign .stat-num span{color:var(--emerald)}
  .ev-redesign .stat-cap{font-size:14.5px;color:var(--muted);line-height:1.5}
  .ev-redesign .stat-cap b{color:var(--ink);font-weight:500}
  @media(max-width:820px){.ev-redesign .stat-grid{grid-template-columns:repeat(2,1fr)}}
  @media(max-width:520px){.ev-redesign .stat-grid{grid-template-columns:1fr}.ev-redesign .stat-num{font-size:40px}}
  .ev-redesign .stat-foot{font-family:var(--mono);font-size:12.5px;color:var(--muted);margin-top:22px;letter-spacing:.02em}

  /* ---------- BUYING / SPREADS ---------- */
  .ev-redesign .buy-grid{display:grid;grid-template-columns:1fr 1fr;gap:54px;align-items:center}
  @media(max-width:880px){.ev-redesign .buy-grid{grid-template-columns:1fr;gap:40px}}
  .ev-redesign .buy-list{list-style:none;margin-top:24px;display:grid;gap:16px}
  .ev-redesign .buy-list li{display:flex;gap:13px;font-size:16px;color:var(--ink-soft)}
  .ev-redesign .buy-list svg{width:20px;height:20px;color:var(--emerald);flex:none;margin-top:2px}
  .ev-redesign .spreads{position:relative;height:420px}
  .ev-redesign .spread{
    position:absolute;background:var(--paper-card);border:1px solid var(--hair);
    border-radius:6px;box-shadow:0 24px 60px -28px rgba(15,30,44,.32);
    padding:22px;overflow:hidden;width:300px;
  }
  .ev-redesign .spread-1{top:0;left:0;transform:rotate(-3deg);z-index:1}
  .ev-redesign .spread-2{top:50px;right:0;transform:rotate(2.5deg);z-index:2}
  .ev-redesign .spread-3{bottom:0;left:40px;transform:rotate(-1deg);z-index:3}
  .ev-redesign .spread:hover{transform:rotate(0) translateY(-6px);z-index:9;transition:transform .35s cubic-bezier(.2,.8,.2,1)}
  .ev-redesign .sp-eyebrow{font-family:var(--mono);font-size:8.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--emerald-deep);margin-bottom:8px}
  .ev-redesign .sp-title{font-family:var(--serif);font-size:16px;font-weight:600;line-height:1.15;margin-bottom:12px;color:var(--ink)}
  .ev-redesign .sp-row{display:flex;gap:8px;font-size:9px;color:var(--muted);padding:6px 0;border-top:1px solid var(--hair);line-height:1.35}
  .ev-redesign .sp-row b{color:var(--ink);font-weight:600;flex:none;width:62px}
  .ev-redesign .sp-tag{display:inline-block;font-family:var(--mono);font-size:7.5px;letter-spacing:.08em;text-transform:uppercase;padding:2px 6px;border-radius:3px;font-weight:500}
  .ev-redesign .sp-quote{font-family:var(--serif);font-style:italic;font-size:13px;line-height:1.4;color:var(--ink-soft);border-left:2px solid var(--emerald);padding-left:12px}
  .ev-redesign .sp-mini{font-family:var(--mono);font-size:7px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted-light);margin-top:10px}
  .ev-redesign .preview-note{font-family:var(--mono);font-size:12px;color:var(--muted);margin-top:30px;text-align:center}

  /* ---------- QUESTIONS ---------- */
  .ev-redesign .q-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--hair);border:1px solid var(--hair);border-radius:12px;overflow:hidden}
  @media(max-width:760px){.ev-redesign .q-grid{grid-template-columns:1fr}}
  .ev-redesign .q-item{background:var(--paper-card);padding:26px 28px;display:flex;gap:18px;transition:background .2s}
  .ev-redesign .q-item:hover{background:#FCFDFC}
  .ev-redesign .q-num{font-family:var(--mono);font-size:13px;color:var(--emerald);font-weight:500;flex:none;padding-top:3px}
  .ev-redesign .q-text{font-family:var(--serif);font-size:18px;line-height:1.3;color:var(--ink);font-weight:400}
  .ev-redesign .q-note{background:var(--paper-card);border:1px solid var(--hair);border-radius:10px;padding:18px 22px;margin-top:18px;display:flex;gap:13px;align-items:flex-start}
  .ev-redesign .q-note svg{width:18px;height:18px;color:var(--emerald);flex:none;margin-top:2px}
  .ev-redesign .q-note p{font-size:14.5px;color:var(--muted);line-height:1.5}
  .ev-redesign .q-note b{color:var(--ink);font-weight:500}

  /* ---------- EXPERTS ---------- */
  .ev-redesign .exp-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
  @media(max-width:760px){.ev-redesign .exp-grid{grid-template-columns:1fr}}
  .ev-redesign .exp-card{background:var(--paper-card);border:1px solid var(--hair);border-radius:12px;padding:28px}
  .ev-redesign .exp-tag{font-family:var(--mono);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--emerald-deep);margin-bottom:16px;display:flex;align-items:center;gap:8px}
  .ev-redesign .exp-tag::before{content:"";width:18px;height:1px;background:var(--emerald)}
  .ev-redesign .exp-role{font-family:var(--serif);font-size:21px;font-weight:600;line-height:1.15;margin-bottom:12px;letter-spacing:-.01em}
  .ev-redesign .exp-desc{font-size:15px;color:var(--muted);line-height:1.5}
  .ev-redesign .exp-disclosure{font-family:var(--mono);font-size:12px;color:var(--muted-light);margin-top:28px;text-align:center;letter-spacing:.02em;line-height:1.6}

  /* ---------- FAQ ---------- */
  .ev-redesign .faq-list{border-top:1px solid var(--hair)}
  .ev-redesign .faq{border-bottom:1px solid var(--hair)}
  .ev-redesign .faq-q{width:100%;text-align:left;background:none;border:none;cursor:pointer;padding:24px 0;display:flex;justify-content:space-between;gap:24px;align-items:center;font-family:var(--serif);font-size:20px;color:var(--ink);font-weight:500}
  .ev-redesign .faq-q:hover{color:var(--emerald-deep)}
  .ev-redesign .faq-icon{flex:none;width:22px;height:22px;position:relative;transition:transform .3s}
  .ev-redesign .faq-icon::before,.ev-redesign .faq-icon::after{content:"";position:absolute;background:var(--emerald);border-radius:2px}
  .ev-redesign .faq-icon::before{top:10px;left:0;width:22px;height:2px}
  .ev-redesign .faq-icon::after{top:0;left:10px;width:2px;height:22px;transition:opacity .3s}
  .ev-redesign .faq.open .faq-icon::after{opacity:0}
  .ev-redesign .faq-a{max-height:0;overflow:hidden;transition:max-height .35s ease}
  .ev-redesign .faq-a-inner{padding:0 0 26px;color:var(--muted);font-size:16px;line-height:1.6;max-width:72ch}
  .ev-redesign .faq-a-inner b{color:var(--ink);font-weight:500}
  .ev-redesign .faq-verdict{font-family:var(--mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;display:inline-flex;align-items:center;gap:7px;margin-bottom:12px;padding:4px 10px;border-radius:5px;font-weight:500}

  /* ---------- PRICING ---------- */
  .ev-redesign .price-section{background:var(--ink);color:#E8EEF0}
  .ev-redesign .price-section .eyebrow{color:var(--emerald-bright)}
  .ev-redesign .price-section .section-head h2{color:#fff}
  .ev-redesign .price-section .section-head p{color:#9FB1B8}
  .ev-redesign .price-grid{display:grid;grid-template-columns:1.1fr 1fr;gap:22px}
  @media(max-width:820px){.ev-redesign .price-grid{grid-template-columns:1fr}}
  .ev-redesign .price-card{background:var(--ink-soft);border:1px solid var(--hair-dark);border-radius:16px;padding:36px;display:flex;flex-direction:column}
  .ev-redesign .price-card.feature{border-color:var(--emerald);box-shadow:0 0 0 1px var(--emerald),0 30px 60px -30px rgba(16,185,129,.4)}
  .ev-redesign .price-kicker{font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--emerald-bright);margin-bottom:18px;font-weight:500}
  .ev-redesign .price-amount{display:flex;align-items:baseline;gap:12px;margin-bottom:8px}
  .ev-redesign .price-amount .big{font-family:var(--serif);font-size:46px;font-weight:600;color:#fff;letter-spacing:-.02em}
  .ev-redesign .price-amount .small{font-family:var(--mono);font-size:14px;color:#6E8088}
  .ev-redesign .price-equiv{font-size:14px;color:#9FB1B8;margin-bottom:24px;font-style:italic;font-family:var(--serif)}
  .ev-redesign .price-feat{list-style:none;display:grid;gap:13px;margin-bottom:28px;flex:1}
  .ev-redesign .price-feat li{display:flex;gap:11px;font-size:15px;color:#C4D0D5;line-height:1.4}
  .ev-redesign .price-feat svg{width:18px;height:18px;color:var(--emerald-bright);flex:none;margin-top:2px}
  .ev-redesign .price-btn{width:100%;justify-content:center;font-size:15.5px;padding:14px}
  .ev-redesign .price-sub{font-family:var(--mono);font-size:12px;color:#6E8088;margin-top:14px;text-align:center;line-height:1.6}
  .ev-redesign .price-sub a{color:var(--emerald-bright)}
  .ev-redesign .bundle{margin-top:22px;background:rgba(16,185,129,.06);border:1px dashed var(--hair-dark);border-radius:12px;padding:22px 26px;display:flex;flex-wrap:wrap;gap:18px;align-items:center;justify-content:space-between}
  .ev-redesign .bundle p{font-size:15px;color:#C4D0D5;max-width:54ch}
  .ev-redesign .bundle b{color:#fff;font-weight:600}
  .ev-redesign .bundle .serif{font-family:var(--serif);font-style:italic;color:var(--emerald-bright)}

  /* ---------- LEAD FORM ---------- */
  .ev-redesign .lead-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:start}
  @media(max-width:880px){.ev-redesign .lead-grid{grid-template-columns:1fr;gap:40px}}
  .ev-redesign .lead-copy h2{font-family:var(--serif);font-weight:500;font-size:clamp(28px,4vw,40px);line-height:1.1;letter-spacing:-.015em;margin-bottom:18px}
  .ev-redesign .lead-copy p{color:var(--muted);font-size:17px;margin-bottom:20px;max-width:46ch}
  .ev-redesign .lead-points{list-style:none;display:grid;gap:14px}
  .ev-redesign .lead-points li{display:flex;gap:12px;font-size:15.5px;color:var(--ink-soft)}
  .ev-redesign .lead-points svg{width:19px;height:19px;color:var(--emerald);flex:none;margin-top:2px}
  .ev-redesign .form-card{background:var(--paper-card);border:1px solid var(--hair);border-radius:16px;padding:34px;box-shadow:0 24px 60px -40px rgba(15,30,44,.3)}
  .ev-redesign .field{margin-bottom:18px}
  .ev-redesign .field label{display:block;font-size:13px;font-weight:500;color:var(--ink);margin-bottom:7px}
  .ev-redesign .field label span{color:var(--emerald)}
  .ev-redesign .field input,.ev-redesign .field select,.ev-redesign .field textarea{
    width:100%;padding:12px 14px;border:1px solid var(--hair);border-radius:9px;
    font-family:var(--sans);font-size:15px;color:var(--ink);background:var(--paper);transition:border .2s
  }
  .ev-redesign .field input:focus,.ev-redesign .field select:focus,.ev-redesign .field textarea:focus{outline:none;border-color:var(--emerald);background:#fff}
  .ev-redesign .field textarea{resize:vertical;min-height:84px}
  .ev-redesign .form-card .btn-emerald{width:100%;justify-content:center;padding:14px;font-size:15.5px}
  .ev-redesign .form-foot{font-family:var(--mono);font-size:11.5px;color:var(--muted-light);margin-top:16px;text-align:center;line-height:1.6}

  /* ---------- FOOTER ---------- */
  .ev-redesign .footer{background:var(--ink);color:#9FB1B8;padding:60px 0 40px}
  .ev-redesign .footer-top{display:flex;flex-wrap:wrap;gap:30px;justify-content:space-between;padding-bottom:36px;border-bottom:1px solid var(--hair-dark)}
  .ev-redesign .footer .brand{color:#fff;margin-bottom:14px}
  .ev-redesign .footer-tag{font-size:14.5px;max-width:42ch;line-height:1.6}
  .ev-redesign .footer-badges{display:flex;gap:10px;margin-top:18px}
  .ev-redesign .footer-badge{font-family:var(--mono);font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;border:1px solid var(--hair-dark);border-radius:5px;padding:5px 10px;color:#C4D0D5}
  .ev-redesign .footer-cols{display:flex;gap:56px;flex-wrap:wrap}
  .ev-redesign .footer-col h5{font-family:var(--mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#6E8088;margin-bottom:14px;font-weight:500}
  .ev-redesign .footer-col a{display:block;font-size:14px;color:#C4D0D5;margin-bottom:9px}
  .ev-redesign .footer-col a:hover{color:#fff}
  .ev-redesign .footer-bottom{padding-top:28px;font-family:var(--mono);font-size:11.5px;color:#6E8088;display:flex;flex-wrap:wrap;gap:14px;justify-content:space-between;letter-spacing:.02em}

  @media(prefers-reduced-motion:reduce){.ev-redesign *{animation:none!important;transition:none!important}}
`

const MARKUP_TOP = `
<!-- NAV -->
<nav class="nav">
  <div class="wrap nav-inner">
    <a href="#top" class="brand">Transcript <span class="iq">IQ</span> <span class="by">by Nextyn</span></a>
    <div class="nav-cta">
      <a href="#questions" class="nav-link">What's inside</a>
      <a href="#evidence" class="nav-link">The verdicts</a>
      <a href="#talk" class="btn btn-ghost">Talk to an analyst</a>
      <a href="#pricing" class="btn btn-emerald">Buy — $3,499</a>
    </div>
  </div>
</nav>

<!-- HERO -->
<header class="hero" id="top">
  <div class="wrap">
    <div class="hero-labels">
      <span>Sector <b>Automotive &amp; Energy Storage</b></span>
      <span>Geography <b>Europe</b></span>
      <span>Format <b>3 expert interviews</b></span>
      <span>Briefing <b>TIQ-2026-016</b></span>
    </div>
    <h1>Europe's EV Ecosystem: Charging, Storage, Software, and the Fight for the Layer Above the Cell.</h1>
    <p class="hero-deck">A practitioner's map of Europe's EV ecosystem</p>
    <p class="hero-sub">A 25-page report from the people who ran the gigafactory ramps, built the charging networks, and commercialised the energy-platform software. <strong>Where margin migrates once the cell commoditises — and the bets that won't survive the valley of death.</strong></p>
    <div class="hero-actions">
      <div class="price-tag">
        <span class="price-now serif">$3,499</span>
        <span class="price-anchor">≈ 3 expert calls, one synthesised view</span>
      </div>
      <a href="#pricing" class="btn btn-emerald" data-ev-buy="hero">Buy the report</a>
      <a href="#talk" class="btn btn-ghost">Talk to an analyst</a>
    </div>
    <div class="hero-meta">
      <span>25 pages</span><i class="dot"></i>
      <span>3 practitioner interviews</span><i class="dot"></i>
      <span>7 contested questions</span><i class="dot"></i>
      <span>Fieldwork May–June 2026</span>
    </div>
    <div class="trust-row">
      <span class="chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2 4 5v6c0 5 3.5 8 8 11 4.5-3 8-6 8-11V5z"/></svg>MNPI-screened</span>
      <span class="chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2 4 5v6c0 5 3.5 8 8 11 4.5-3 8-6 8-11V5z"/></svg>PII-redacted</span>
      <span class="chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 4.5a3.2 3.2 0 0 1 0 6.4M21 20c0-2.5-1.5-4.7-3.7-5.6"/></svg>Backed by Nextyn's 135,000+ vetted experts</span>
      <span class="chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 6h16M4 12h16M4 18h10"/></svg>Every claim cited to a named practitioner</span>
    </div>
  </div>
</header>

<!-- COVERAGE STRIP -->
<section class="coverage">
  <div class="wrap">
    <p class="eyebrow">What the report is built around</p>
    <p class="coverage-lead">Seven questions European executives, investors, and policymakers are actively sitting with — each answered from inside the stack, with a verdict and a decision frame attached.</p>
    <div class="coverage-list">
      <div class="cov-row"><span class="cov-label">Battery sovereignty</span><span class="cov-angle">Why the cell race is settled — and where that frees capital to go next</span></div>
      <div class="cov-row"><span class="cov-label">The survivors</span><span class="cov-angle">Which gigafactory bets endure, and the single factor that separates them</span></div>
      <div class="cov-row"><span class="cov-label">Value migration</span><span class="cov-angle">Where margin accrues once cells and chargers commoditise</span></div>
      <div class="cov-row"><span class="cov-label">The control question</span><span class="cov-angle">Who owns the platform layer — the field data, or the software that orchestrates it</span></div>
      <div class="cov-row"><span class="cov-label">V2G, honestly</span><span class="cov-angle">What is real this decade versus what is being sold</span></div>
      <div class="cov-row"><span class="cov-label">Charging, repriced</span><span class="cov-angle">The maintenance economics the market is overlooking</span></div>
      <div class="cov-row"><span class="cov-label">AI's real role</span><span class="cov-angle">Who actually captures the gains across the stack</span></div>
    </div>
  </div>
</section>

<!-- VERDICT LEDGER -->
<section class="ledger" id="evidence">
  <div class="wrap">
    <p class="eyebrow">The weight of the evidence</p>
    <h2>Three experts. Ten findings. Four verdicts.</h2>
    <p class="ledger-lead">Most research tells you what to think and hides what it can't defend. We did the opposite. Three practitioners, each running a different layer of the stack, were pushed on every claim. Here is exactly where the evidence is strong, where it is forming, where it splits — and what it flatly refuses to support. <b>The directions are below. The reasoning, the mechanisms, and the implications for capital are in the report.</b></p>

    <div class="verdict-group">
      <div class="verdict-head">
        <span class="verdict-dot" style="background:var(--v-supported)"></span>
        <span class="verdict-label" style="color:var(--v-supported)">Strongly supported</span>
        <span class="verdict-count">3 findings · all three experts converge</span>
      </div>
      <div class="verdict-items">
        <div class="verdict-item"><span class="verdict-bar" style="background:var(--v-supported)"></span><span class="verdict-text"><b>Europe lost on execution, not technology.</b> The know-how existed; the speed, scale-up discipline, and policy follow-through did not. Next-generation chemistry will not close the gap.</span></div>
        <div class="verdict-item"><span class="verdict-bar" style="background:var(--v-supported)"></span><span class="verdict-text"><b>OEM backing determines gigafactory survival.</b> The survivors have automotive parents who absorb ramp losses. Every well-funded independent has failed or stalled.</span></div>
        <div class="verdict-item"><span class="verdict-bar" style="background:var(--v-supported)"></span><span class="verdict-text"><b>Hardware is commoditising; software captures the value.</b> Two experts on opposite ends of the stack reached this conclusion independently.</span></div>
      </div>
    </div>

    <div class="verdict-group">
      <div class="verdict-head">
        <span class="verdict-dot" style="background:var(--v-emerging)"></span>
        <span class="verdict-label" style="color:var(--v-emerging)">Emerging</span>
        <span class="verdict-count">2 findings · structural signal, not yet consensus</span>
      </div>
      <div class="verdict-items">
        <div class="verdict-item"><span class="verdict-bar" style="background:var(--v-emerging)"></span><span class="verdict-text"><b>Stationary storage overtakes EVs as the primary demand driver</b> — supported by the world's largest cell maker's own reported 2030 target.</span></div>
        <div class="verdict-item"><span class="verdict-bar" style="background:var(--v-emerging)"></span><span class="verdict-text"><b>BESS-buffered V2G becomes viable at fleet scale this decade</b> — through a battery in the middle, not the car.</span></div>
      </div>
    </div>

    <div class="verdict-group">
      <div class="verdict-head">
        <span class="verdict-dot" style="background:var(--v-contested)"></span>
        <span class="verdict-label" style="color:var(--v-contested)">Contested</span>
        <span class="verdict-count">2 findings · the experts genuinely disagree</span>
      </div>
      <div class="verdict-items">
        <div class="verdict-item"><span class="verdict-bar" style="background:var(--v-contested)"></span><span class="verdict-text"><b>Who controls the platform layer — software operators or the battery makers who own the field data.</b> One expert holds each view, firmly. Regulation, not technology, may decide it.</span></div>
        <div class="verdict-item"><span class="verdict-bar" style="background:var(--v-contested)"></span><span class="verdict-text"><b>Whether local cell production is essential to ecosystem health.</b> A 15% cost penalty versus a manufacturing-anchor argument. The live boardroom trade-off.</span></div>
      </div>
    </div>

    <div class="verdict-group">
      <div class="verdict-head">
        <span class="verdict-dot" style="background:var(--v-not)"></span>
        <span class="verdict-label" style="color:var(--v-not)">Not supported</span>
        <span class="verdict-count">3 findings · the comfortable assumptions, dismissed</span>
      </div>
      <div class="verdict-items">
        <div class="verdict-item"><span class="verdict-bar" style="background:var(--v-not)"></span><span class="verdict-text"><b>AI lets European latecomers leapfrog Asian manufacturing.</b> Directly rejected — AI compounds the advantage of whoever already owns the data.</span></div>
        <div class="verdict-item"><span class="verdict-bar" style="background:var(--v-not)"></span><span class="verdict-text"><b>Consumer V2G goes mainstream this decade.</b> Battery-wear fear and direct car-to-grid complexity push it to a ~10-year horizon.</span></div>
        <div class="verdict-item"><span class="verdict-bar" style="background:var(--v-not)"></span><span class="verdict-text"><b>Europe can reach full battery supply-chain independence.</b> The deepest tier — refining, graphite, calcination — has no near-term European substitute.</span></div>
      </div>
    </div>

    <div class="ledger-foot">
      <p>"The thread that holds: advantage accrues to whoever executes — on yield, on maintenance, on software — long enough for the compounding to take hold."</p>
      <a href="#pricing" class="btn btn-emerald">See the reasoning — $3,499</a>
    </div>
  </div>
</section>

<!-- STATS -->
<section class="section">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">Direct expert citations · not market estimates</p>
      <h2>The numbers the consensus is getting wrong.</h2>
      <p>Six figures from the interviews that reset the debate. None of them are modelled from the outside.</p>
    </div>
    <div class="stat-grid">
      <div class="stat"><div class="stat-num">~<span>10%</span></div><p class="stat-cap"><b>of announced European gigafactories</b> reached commercial production. The race was lost on execution, not technology.</p></div>
      <div class="stat"><div class="stat-num"><span>15%</span></div><p class="stat-cap"><b>cost penalty</b> to build the same cell in Europe versus importing from China. A live boardroom trade-off for every OEM.</p></div>
      <div class="stat"><div class="stat-num">6<span>&nbsp;vs&nbsp;24</span></div><p class="stat-cap"><b>months, concept-to-certification</b> in China versus Europe. The execution gap, quantified: roughly 4× slower.</p></div>
      <div class="stat"><div class="stat-num"><span>95%+</span></div><p class="stat-cap"><b>manufacturing yield</b> required for viability. Most European independents never reached it.</p></div>
      <div class="stat"><div class="stat-num">$<span>5.8bn</span></div><p class="stat-cap"><b>debt facility raised by Northvolt</b> — Europe's flagship independent — which still failed to reach commercial-scale yield.</p></div>
      <div class="stat"><div class="stat-num"><span>~10</span>&nbsp;yr</div><p class="stat-cap"><b>before consumer V2G</b> moves beyond captive fleets. The market is pricing it wrong today.</p></div>
    </div>
    <p class="stat-foot">The full picture — and what each number means for where capital goes next — is in the report.</p>
  </div>
</section>

<!-- WHAT YOU'RE BUYING + SPREADS -->
<section class="section" style="background:#FCFDFC;border-top:1px solid var(--hair);border-bottom:1px solid var(--hair)">
  <div class="wrap">
    <div class="buy-grid">
      <div>
        <p class="eyebrow">What you're actually buying</p>
        <h2 class="serif" style="font-weight:500;font-size:clamp(28px,4vw,40px);line-height:1.1;letter-spacing:-.015em;margin:14px 0 16px">Not a macro overview. A read on the questions practitioners actually argue about.</h2>
        <p style="color:var(--muted);font-size:17px">Each answered with first-hand citation, a verdict, and a decision frame — what to do now, the metric to track, and what would change the call.</p>
        <ul class="buy-list">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg>Skip the gigafactory bets that won't survive the valley of death.</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg>See where margin goes once cells and chargers commoditise.</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg>Price V2G and charging on real economics, not the brochure.</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg>Arm your IC or strategy team with primary-source conviction.</li>
        </ul>
      </div>
      <div>
        <div class="spreads">
          <div class="spread spread-1">
            <div class="sp-eyebrow">Exhibit 7 · Weight of the evidence</div>
            <div class="sp-title">Verdict ledger</div>
            <div class="sp-row"><span class="sp-tag" style="background:rgba(16,185,129,.12);color:var(--v-supported)">Supported</span>Europe lost on execution, not technology</div>
            <div class="sp-row"><span class="sp-tag" style="background:rgba(201,138,43,.14);color:var(--v-emerging)">Emerging</span>Storage overtakes EVs as demand driver</div>
            <div class="sp-row"><span class="sp-tag" style="background:rgba(62,128,166,.14);color:var(--v-contested)">Contested</span>Who controls the platform layer</div>
            <div class="sp-row"><span class="sp-tag" style="background:rgba(181,97,78,.14);color:var(--v-not)">Not&nbsp;supp.</span>AI lets latecomers leapfrog</div>
            <div class="sp-mini">Synthesis · 3 expert interviews · May–June 2026</div>
          </div>
          <div class="spread spread-2">
            <div class="sp-eyebrow">Section 04 · The live tension</div>
            <div class="sp-quote">"They own the batteries, and therefore they own the data. The battery manufacturers absolutely have all the cards in their hands."</div>
            <div class="sp-mini">— Former Technical Team Lead, Audi AG</div>
          </div>
          <div class="spread spread-3">
            <div class="sp-eyebrow">Exhibit 2 · Tiers of China dependency</div>
            <div class="sp-title">Where Europe stands</div>
            <div class="sp-row"><b>Deepest</b>No substitute — refining, graphite, calcination, cell equipment</div>
            <div class="sp-row"><b>Moderate</b>Partially localised but China-linked — recycling, integration</div>
            <div class="sp-row"><b>Shallow</b>Genuine European strength — power electronics, drivetrain</div>
            <div class="sp-mini">Nextyn primary research · June 2026</div>
          </div>
        </div>
        <p class="preview-note">Representative spreads. The full 25 pages include 7 exhibits, 4 stakeholder playbooks, and a glossary.</p>
      </div>
    </div>
  </div>
</section>

<!-- QUESTIONS -->
<section class="section" id="questions">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">The seven contested questions</p>
      <h2>The battery verdict is settled. Everything built on top of it is not.</h2>
      <p>The seven questions in full — each answered from inside the stack, with first-hand citation, a verdict, and what would change the call.</p>
    </div>
    <div class="q-grid">
      <div class="q-item"><span class="q-num">01</span><span class="q-text">Why did Europe lose the battery manufacturing race — and is it actually lost?</span></div>
      <div class="q-item"><span class="q-num">02</span><span class="q-text">Which gigafactory bets survive, and what separates them from the failures?</span></div>
      <div class="q-item"><span class="q-num">03</span><span class="q-text">Where does value migrate when the cell is commoditised?</span></div>
      <div class="q-item"><span class="q-num">04</span><span class="q-text">Does software eat the ecosystem, or do the battery makers who own the data win?</span></div>
      <div class="q-item"><span class="q-num">05</span><span class="q-text">What does V2G actually look like this decade, versus what is being sold?</span></div>
      <div class="q-item"><span class="q-num">06</span><span class="q-text">Where should capital go in EV charging, and what is the market mispricing?</span></div>
      <div class="q-item" style="grid-column:1/-1"><span class="q-num">07</span><span class="q-text">What is AI's real role in this ecosystem — and who actually captures it?</span></div>
    </div>
    <div class="q-note">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2 4 5v6c0 5 3.5 8 8 11 4.5-3 8-6 8-11V5z"/></svg>
      <p><b>On naming:</b> the report assesses the market structurally and does not name specific players as winners or losers beyond what is already public. Individual expert identities are protected; affiliations and verified credentials are available to qualified buyers on request. This is a compliance feature, not a limitation.</p>
    </div>
  </div>
</section>

<!-- EXPERTS -->
<section class="section" style="background:#FCFDFC;border-top:1px solid var(--hair);border-bottom:1px solid var(--hair)">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">Who you're hearing from</p>
      <h2>Three practitioners who ran the stack — not analysts modelling from the outside.</h2>
    </div>
    <div class="exp-grid">
      <div class="exp-card">
        <div class="exp-tag">EXP-T1 · 2 June 2026</div>
        <div class="exp-role">Former Technical Team Lead, Audi AG</div>
        <p class="exp-desc">Battery cell technology development, gigafactory ramp planning, and European supply-chain strategy. The voice on why the manufacturing race was lost.</p>
      </div>
      <div class="exp-card">
        <div class="exp-tag">EXP-T2 · 10 June 2026</div>
        <div class="exp-role">Former Director, Sunlight Group</div>
        <p class="exp-desc">Energy-storage product strategy, market development, and energy-platform commercialisation. The voice for software controlling everything.</p>
      </div>
      <div class="exp-card">
        <div class="exp-tag">EXP-T3 · 26 May 2026</div>
        <div class="exp-role">Former Engineer, E-GAP</div>
        <p class="exp-desc">Charging-network deployment, grid integration, thermal management, and software platforms. The voice on where charging capital is mispriced.</p>
      </div>
    </div>
    <p class="exp-disclosure">Expert identities are not disclosed publicly to protect professional relationships.<br>Verified credentials are available to qualified buyers on request.</p>
  </div>
</section>

<!-- FAQ -->
<section class="section" style="background:#FCFDFC;border-top:1px solid var(--hair);border-bottom:1px solid var(--hair)">
  <div class="wrap" style="max-width:900px">
    <div class="section-head">
      <p class="eyebrow">Frequently asked</p>
      <h2>The report's position, in brief.</h2>
      <p>The direction on each question. The evidence and the implications for capital are in the full 25 pages.</p>
    </div>
    <div class="faq-list" id="faqList">
      <div class="faq">
        <button class="faq-q">Why did Europe lose the battery manufacturing race?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner">
          <span class="faq-verdict" style="background:rgba(16,185,129,.1);color:var(--v-supported)"><span style="width:7px;height:7px;border-radius:2px;background:var(--v-supported)"></span>Strongly supported</span><br>
          Europe lost on <b>execution, not technology</b>. The cell know-how existed — what never happened was the transfer of tacit manufacturing knowledge needed to hit commercial yield. Korea bought Japan's equipment and its engineers; China bought Korea's process and built its own base. Europe bought the machines without the people who knew how to run them at scale. Only around 10% of announced European gigafactory projects reached commercial production. Next-generation chemistry will not close this gap.
        </div></div>
      </div>
      <div class="faq">
        <button class="faq-q">Which gigafactory bets actually survive?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner">
          <span class="faq-verdict" style="background:rgba(16,185,129,.1);color:var(--v-supported)"><span style="width:7px;height:7px;border-radius:2px;background:var(--v-supported)"></span>Strongly supported</span><br>
          The dividing line is <b>financial structure, not engineering quality</b>. Projects backed by automotive OEMs survive because a parent can absorb losses through the long, low-yield ramp. Every well-funded independent has failed or stalled at scale-up — including Europe's flagship bet, despite a multi-billion-dollar raise. The report names which survive and why, and gives the specific yield-rate milestones to watch over the next 12–18 months.
        </div></div>
      </div>
      <div class="faq">
        <button class="faq-q">Where does value migrate once the cell is commoditised?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner">
          <span class="faq-verdict" style="background:rgba(16,185,129,.1);color:var(--v-supported)"><span style="width:7px;height:7px;border-radius:2px;background:var(--v-supported)"></span>Strongly supported</span><br>
          Building a charger — or a cell — is no longer a moat. The defensible margin sits in <b>software orchestration, predictive maintenance, and energy-platform control</b>. Two experts on different parts of the stack reached this independently. The report maps where value is concentrating across five layers and where Europe holds a genuine, defensible position.
        </div></div>
      </div>
      <div class="faq">
        <button class="faq-q">Who controls the ecosystem — software platforms or battery makers?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner">
          <span class="faq-verdict" style="background:rgba(62,128,166,.1);color:var(--v-contested)"><span style="width:7px;height:7px;border-radius:2px;background:var(--v-contested)"></span>Contested — and that's the insight</span><br>
          This is the sharpest disagreement in the study. One expert argues the <b>battery makers hold all the cards</b> because they own the deployed cells and therefore the field data every AI tool depends on. Another argues <b>software orchestration is the moat</b> and the battery is a passive component. Both positions are internally coherent; they cannot both be fully right. The report lays out both cases in full and explains why regulation — not technology — may ultimately decide it.
        </div></div>
      </div>
      <div class="faq">
        <button class="faq-q">What will V2G actually look like this decade?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner">
          <span class="faq-verdict" style="background:rgba(201,138,43,.12);color:var(--v-emerging)"><span style="width:7px;height:7px;border-radius:2px;background:var(--v-emerging)"></span>Emerging — with a catch</span><br>
          The near-term architecture is <b>car-to-BESS-to-grid, not car-to-grid</b>. Consumer resistance to battery discharge and grid-connection limits mean a stationary battery sits in the middle as the buffer. Direct consumer V2G stays confined to captive fleets on a roughly ten-year horizon. The report details the storage-buffered loop, who benefits at each stage, and why the investable thesis is the buffer, not the car.
        </div></div>
      </div>
      <div class="faq">
        <button class="faq-q">Where is EV charging capital being mispriced?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner">
          <span class="faq-verdict" style="background:rgba(16,185,129,.1);color:var(--v-supported)"><span style="width:7px;height:7px;border-radius:2px;background:var(--v-supported)"></span>Strongly supported</span><br>
          The mispricing is in <b>maintenance economics, not hardware</b>. Chargers are commoditising; the defensible, underserved work is keeping them running — predictive maintenance, inverter economics, grid connection. Investors modelling charging as a hardware rollout miss the return profile. The report gives the utilisation, failure-rate, and revenue-mix metrics that separate a gas-station asset from an energy platform.
        </div></div>
      </div>
      <div class="faq">
        <button class="faq-q">What is AI's real role, and who captures it?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner">
          <span class="faq-verdict" style="background:rgba(181,97,78,.1);color:var(--v-not)"><span style="width:7px;height:7px;border-radius:2px;background:var(--v-not)"></span>Leapfrog thesis: not supported</span><br>
          AI is real but narrow. The claim that it lets a European latecomer <b>leapfrog</b> the Asian learning curve is explicitly dismissed across all three interviews. AI compresses existing processes — it does not replace accumulated process knowledge or the field data that trains the models. The leverage is the data loop, and that belongs to whoever owns the deployed assets. AI helps incumbents more than challengers.
        </div></div>
      </div>
      <div class="faq">
        <button class="faq-q">Can I buy a team or enterprise licence, or be invoiced?<span class="faq-icon"></span></button>
        <div class="faq-a"><div class="faq-a-inner">
          Yes. The headline price is a <b>single-user licence</b>. Multi-seat team and enterprise licences are available with a purchase order and invoice — useful for corporate strategy and corp-dev teams who route research through procurement. Email <a href="mailto:hatim.janjali@nextyn.com" style="color:var(--emerald-deep)">hatim.janjali@nextyn.com</a> or use the analyst form below, and we'll send licensing options and a PO-ready quote.
        </div></div>
      </div>
    </div>
  </div>
</section>

<!-- PRICING -->
<section class="section price-section" id="pricing">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">One report. The whole argument.</p>
      <h2>Priced like a research decision, not a PDF.</h2>
      <p>A single thematic call from a top-tier expert network runs $1,000–1,500 an hour. This is three practitioners, fully synthesised, with the reasoning written down and cited.</p>
    </div>
    <div class="price-grid">
      <div class="price-card feature">
        <div class="price-kicker">Single-user licence</div>
        <div class="price-amount"><span class="big">$3,499</span><span class="small">one-time</span></div>
        <p class="price-equiv">≈ three expert calls — one synthesised, decision-ready view.</p>
        <ul class="price-feat">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg>The full 25-page research report (PDF)</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg>7 exhibits, including the full verdict ledger</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg>4 stakeholder playbooks — OEM, investor, operator, policymaker</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg>Every question answered with direct practitioner citation</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg>Decision frame per question: act now, metric to track, what changes the call</li>
        </ul>
        <a href="#" class="btn btn-emerald price-btn" data-ev-buy="pricing">Buy the report — $3,499</a>
        <p class="price-sub">Secure checkout via Stripe · single-user licence<br>Prefer to be invoiced? <a href="mailto:hatim.janjali@nextyn.com">Email us</a> for a PO-ready quote.</p>
      </div>
      <div class="price-card">
        <div class="price-kicker">Team &amp; enterprise</div>
        <div class="price-amount"><span class="big">Custom</span><span class="small">from $8,000</span></div>
        <p class="price-equiv">Multi-seat access for a deal team, strategy function, or IC.</p>
        <ul class="price-feat">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg>Everything in the single-user licence</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg>Multi-seat distribution rights across one team</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg>Purchase order &amp; invoice — procurement-friendly</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg>A 30-minute analyst walkthrough tailored to your context</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg>Option to commission a follow-on custom study</li>
        </ul>
        <a href="#talk" class="btn btn-ghost-light price-btn">Request team pricing</a>
        <p class="price-sub">For corporate strategy, corp-dev, and investment teams.</p>
      </div>
    </div>
    <div class="bundle">
      <p><span class="serif">Add the practitioner who ran the ramp.</span> &nbsp;Buy the report, then book a one-to-one hour with the expert behind it — context no PDF can carry. <b>Report + one expert hour, $3,850.</b></p>
      <a href="#talk" class="btn btn-emerald">Add the expert hour</a>
    </div>
  </div>
</section>
`

// The lead form (#talk) is rendered as a real React <form> between MARKUP_TOP and
// MARKUP_FOOTER so it can post to /api/ev-report-leads.
const MARKUP_FOOTER = `
<!-- FOOTER -->
<footer class="footer">
  <div class="wrap">
    <div class="footer-top">
      <div>
        <div class="brand">Transcript <span class="iq" style="color:var(--emerald-bright)">IQ</span> <span class="by">by Nextyn</span></div>
        <p class="footer-tag">Expert-call transcripts and analyst-grade research briefings. Primary research for people who can't afford to be wrong.</p>
        <div class="footer-badges">
          <span class="footer-badge">MNPI-screened</span>
          <span class="footer-badge">PII-redacted</span>
          <span class="footer-badge">135,000+ experts</span>
        </div>
      </div>
      <div class="footer-cols">
        <div class="footer-col">
          <h5>Product</h5>
          <a href="https://www.transcript-iq.com/expert-transcripts">Transcript Library</a>
          <a href="https://www.transcript-iq.com/earnings-analysis">Earnings Analysis</a>
          <a href="https://www.transcript-iq.com/custom-reports">Custom Reports</a>
          <a href="https://www.transcript-iq.com/free-transcript">Free Transcript</a>
        </div>
        <div class="footer-col">
          <h5>Resources</h5>
          <a href="https://www.transcript-iq.com/resources">Blog</a>
          <a href="https://www.transcript-iq.com/how-to-use">How to Use Transcripts</a>
          <a href="https://www.transcript-iq.com/why-primary-research-wins">Why Primary Research Wins</a>
        </div>
        <div class="footer-col">
          <h5>Company</h5>
          <a href="https://www.transcript-iq.com/compliance">Compliance</a>
          <a href="https://www.transcript-iq.com/terms">Terms of Service</a>
          <a href="https://www.transcript-iq.com/privacy">Privacy Policy</a>
          <a href="https://www.transcript-iq.com/contact">Contact</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Nextyn Advisory · Transcript IQ</span>
      <span>Briefing TIQ-2026-016 · Not investment advice · Single-user licence · Contact us for team licences</span>
    </div>
  </div>
</footer>
`

type LeadStatus = 'idle' | 'submitting' | 'success' | 'error'

export function EvEcosystemLanding() {
  const rootRef = useRef<HTMLDivElement>(null)
  const { addItem, openCart } = useCart()
  const [leadStatus, setLeadStatus] = useState<LeadStatus>('idle')
  const [leadError, setLeadError] = useState<string | null>(null)
  const formStarted = useRef(false)
  const firedDepth = useRef({ d50: false, d90: false })

  function handleBuy(location: string) {
    trackEvent('click_buy_report', { location })
    trackEvent('add_to_cart', {
      currency: 'USD',
      value: EV_REPORT.priceUsd,
      item_name: 'ev-ecosystem-report',
    })
    addItem(REPORT_CART_ITEM)
    openCart()
  }

  // Delegated handlers for the dangerouslySetInnerHTML content:
  //  - [data-ev-buy] CTAs → add the report to the cart + open the drawer
  //  - .faq-q → toggle the FAQ accordion
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const onClick = (e: Event) => {
      const target = e.target as HTMLElement

      const buy = target.closest('[data-ev-buy]') as HTMLElement | null
      if (buy && root.contains(buy)) {
        e.preventDefault()
        handleBuy(buy.getAttribute('data-ev-buy') || 'cta')
        return
      }

      const talk = target.closest('a[href="#talk"]') as HTMLElement | null
      if (talk && root.contains(talk)) {
        trackEvent('click_talk_analyst', { location: 'cta' })
        // no preventDefault — let the anchor scroll to the lead form
      }

      const faqBtn = target.closest('.faq-q') as HTMLElement | null
      if (faqBtn && root.contains(faqBtn)) {
        const faq = faqBtn.parentElement as HTMLElement | null
        const ans = faq?.querySelector('.faq-a') as HTMLElement | null
        if (!faq || !ans) return
        const isOpen = faq.classList.toggle('open')
        ans.style.maxHeight = isOpen ? `${ans.scrollHeight}px` : ''
      }
    }
    root.addEventListener('click', onClick)
    return () => root.removeEventListener('click', onClick)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // GA4 page-view (view_item) on mount + scroll-depth milestones.
  useEffect(() => {
    trackEvent('view_item', { item_name: 'ev-ecosystem-report', price: EV_REPORT.priceUsd })
    function onScroll() {
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - doc.clientHeight
      if (scrollable <= 0) return
      const pct = (doc.scrollTop / scrollable) * 100
      if (!firedDepth.current.d50 && pct >= 50) {
        firedDepth.current.d50 = true
        trackEvent('scroll_depth_50', { page: 'ev-report' })
      }
      if (!firedDepth.current.d90 && pct >= 90) {
        firedDepth.current.d90 = true
        trackEvent('scroll_depth_90', { page: 'ev-report' })
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleFirstFocus() {
    if (formStarted.current) return
    formStarted.current = true
    trackEvent('form_start', { form: 'analyst_lead' })
  }

  async function handleLeadSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLeadError(null)
    setLeadStatus('submitting')
    const form = e.currentTarget
    const data = new FormData(form)
    const utm = getStoredUtm()
    const payload = {
      name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      company: String(data.get('company') ?? '').trim(),
      role: String(data.get('role') ?? '').trim(),
      message: String(data.get('message') ?? '').trim(),
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      utm_content: utm.utm_content,
      page_referrer: utm.page_referrer,
    }

    try {
      const res = await fetch('/api/ev-report-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(body.error || 'Something went wrong. Please try again.')
      }
      setLeadStatus('success')
      trackEvent('generate_lead', { event_category: 'ev_report', event_label: 'analyst_consultation' })
      trackAdsConversion({ conversionLabel: process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION })
      trackBingEvent('lead', { event_category: 'ev_report', event_label: 'analyst_consultation' })
      trackTaboolaEvent('lead')
    } catch (err) {
      setLeadStatus('error')
      setLeadError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="ev-redesign" ref={rootRef}>
        <div dangerouslySetInnerHTML={{ __html: MARKUP_TOP }} />

        {/* LEAD FORM — real React form posting to /api/ev-report-leads */}
        <section className="section" id="talk">
          <div className="wrap">
            <div className="lead-grid">
              <div className="lead-copy">
                <p className="eyebrow">Not ready to buy?</p>
                <h2 className="serif">Talk to the analyst who built it.</h2>
                <p>
                  A 20-minute call on how the findings apply to your specific context — your portfolio, your
                  platform, your policy question. No obligation, no script.
                </p>
                <ul className="lead-points">
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M20 6 9 17l-5-5" /></svg>
                    Walk through the verdicts that matter to your mandate
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M20 6 9 17l-5-5" /></svg>
                    Get team-licence and procurement options
                  </li>
                  <li>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M20 6 9 17l-5-5" /></svg>
                    Scope a follow-on custom study if you need one
                  </li>
                </ul>
              </div>
              <div className="form-card">
                {leadStatus === 'success' ? (
                  <div style={{ textAlign: 'center', padding: '24px 0' }}>
                    <h3 className="serif" style={{ fontSize: '23px', color: 'var(--ink)', marginBottom: '10px' }}>
                      Thanks — we&rsquo;ll be in touch within one business day.
                    </h3>
                    <p style={{ color: 'var(--muted)', fontSize: '15px' }}>
                      Our research analyst will reach out to walk you through the findings and how they apply to
                      your context.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit} onFocusCapture={handleFirstFocus} noValidate>
                    <div className="field">
                      <label>Full name <span>*</span></label>
                      <input name="name" type="text" placeholder="Jane Doe" autoComplete="name" required />
                    </div>
                    <div className="field">
                      <label>Work email <span>*</span></label>
                      <input name="email" type="email" placeholder="jane@firm.com" autoComplete="email" required />
                    </div>
                    <div className="field">
                      <label>Company <span>*</span></label>
                      <input name="company" type="text" placeholder="Firm name" autoComplete="organization" required />
                    </div>
                    <div className="field">
                      <label>You are a…</label>
                      <select name="role" defaultValue="Private equity / venture / hedge fund">
                        <option>Private equity / venture / hedge fund</option>
                        <option>Management or strategy consultant</option>
                        <option>Corporate strategy / corp-dev</option>
                        <option>OEM / automotive</option>
                        <option>Energy / utility / charging operator</option>
                        <option>Policy / public sector</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>What are you trying to decide?</label>
                      <textarea name="message" placeholder="e.g. Whether to underwrite a European charging platform on a 5-year horizon." />
                    </div>
                    {leadStatus === 'error' && leadError && (
                      <p role="alert" style={{ color: '#B5614E', fontSize: '13px', marginBottom: '12px' }}>
                        {leadError}
                      </p>
                    )}
                    <button type="submit" className="btn btn-emerald" disabled={leadStatus === 'submitting'}>
                      {leadStatus === 'submitting' ? 'Sending…' : 'Request a conversation'}
                    </button>
                    <p className="form-foot">We reply within one business day · info@nextyn.com</p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        <div dangerouslySetInnerHTML={{ __html: MARKUP_FOOTER }} />
      </div>
    </>
  )
}
