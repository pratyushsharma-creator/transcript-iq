import type { FaqItem } from './jsonld'
// Note: import from './jsonld' not './jsonld.tsx' — TypeScript resolves the extension automatically

// ── Homepage ─────────────────────────────────────────────────────────────────

export const HOME_FAQS: FaqItem[] = [
  {
    question: 'What is Transcript IQ?',
    answer:
      'The first retail marketplace for institutional-grade expert call transcripts. You can buy individual transcripts from $349 without a subscription — the same documents hedge funds and PE firms use for primary research, now available per document.',
  },
  {
    question: 'What is an expert call transcript?',
    answer:
      'A verbatim record of a structured conversation between an institutional researcher and an industry practitioner — typically a former executive or sector specialist. The document captures the full dialogue, question by question, and is used as primary research in investment analysis, deal diligence, and consulting engagements.',
  },
  {
    question: 'How much does a transcript cost?',
    answer:
      'Standard (Director-level): $349. Premium (VP-level): $449. Elite (C-suite): $599. One-time purchase, PDF download, no subscription.',
  },
  {
    question: 'Is there a subscription required?',
    answer:
      'No. You pay per transcript. There is no platform fee, no seat license, and no minimum commitment. Buy exactly what you need.',
  },
  {
    question: 'Are transcripts MNPI compliant?',
    answer:
      'Yes. Every transcript in the library is screened for material non-public information before publication and includes a compliance certification document suitable for filing with an institutional compliance team.',
  },
  {
    question: 'What sectors are covered?',
    answer:
      '12 sectors: Technology & SaaS, Healthcare & Pharma, Financial Services, Energy & Utilities, Industrials & Manufacturing, Telecommunications, Chemicals, Metals & Mining, Professional Services, Space Economy, Transportation & Logistics, and Real Estate & Infrastructure.',
  },
  {
    question: 'How is Transcript IQ different from Tegus or Third Bridge?',
    answer:
      'Tegus and Third Bridge require annual subscriptions starting at $15,000+ per seat. Transcript IQ charges per transcript with no subscription, no platform fee, and no lock-in. Every transcript is MNPI-screened and delivered as a portable PDF you own outright.',
  },
  {
    question: 'How quickly can I access a transcript after purchase?',
    answer:
      'Immediately. PDF download is available the moment payment clears — no waiting period, no approval queue.',
  },
  {
    question: 'Can I use transcripts in an investment memo or IC presentation?',
    answer:
      'Yes. Each transcript includes a compliance certification. The recommended citation format is: Expert call, [Sector], via Transcript IQ, [Date]. This is sufficient for institutional compliance documentation.',
  },
]

// ── Expert Transcripts Index ──────────────────────────────────────────────────

export const TRANSCRIPTS_INDEX_FAQS: FaqItem[] = [
  {
    question: 'What expert levels are available?',
    answer:
      'Three levels: Standard (Director and Senior Manager, $349), Premium (VP and SVP, $449), and Elite (C-suite: CEO, CFO, CTO, COO, $599). The level reflects the seniority of the practitioner who participated in the call, not the complexity of the content.',
  },
  {
    question: 'How are transcripts screened for MNPI?',
    answer:
      'Every transcript undergoes a compliance review by the Nextyn team before publication. The review checks for forward-looking guidance, undisclosed financial information, customer-specific data, and regulatory non-public information. Each document that passes receives a compliance certification with the review date and methodology. Documents that do not pass are not published.',
  },
  {
    question: 'Can I preview a transcript before buying?',
    answer:
      'Yes. Every transcript listing includes a moderator-written executive summary (150–300 words) covering the key themes, expert background, and main findings. You can assess relevance from the summary before purchasing the full document.',
  },
  {
    question: 'What file format do I receive?',
    answer:
      'PDF. The document is downloaded immediately after purchase and is yours to keep. It is not locked inside a platform — you can store, share, and cite it freely within your organisation.',
  },
  {
    question: 'How many transcripts are in the library?',
    answer:
      '77+ published transcripts at launch, across 12 industry sectors. New transcripts are added regularly. If you need a transcript on a topic not currently in the library, you can commission a custom expert call.',
  },
  {
    question: 'Are new transcripts added regularly?',
    answer:
      'Yes. New transcripts are added to the library as they are produced and cleared through the MNPI review process. Subscribe to the research newsletter for notifications when transcripts relevant to your sectors are published.',
  },
  {
    question: 'Do you offer bulk or team pricing?',
    answer:
      'Custom pricing is available for teams purchasing five or more transcripts. Contact us at support@transcript-iq.com to discuss volume pricing and team access arrangements.',
  },
]

// ── Free Transcript ───────────────────────────────────────────────────────────

export const FREE_TRANSCRIPT_FAQS: FaqItem[] = [
  {
    question: 'What do I get in the free transcript?',
    answer:
      'A full expert call transcript — the same format and quality as a paid document. Verbatim dialogue, expert profile, compliance certification, and sector tags. The free transcript is matched to the industry sector you specify when you sign up.',
  },
  {
    question: 'Do I need a credit card?',
    answer:
      'No. A work email address and a sector selection are all that is required. No payment information is collected at any point in the free transcript flow.',
  },
  {
    question: 'Can I get more than one free transcript?',
    answer:
      'One free transcript is available per registered email address. Additional transcripts are available for purchase from $349.',
  },
  {
    question: 'Is the free transcript a full document or a summary?',
    answer:
      'It is the full verbatim transcript — not an excerpt or a summary. The only difference between the free transcript and a paid document is that the free transcript is selected by the Transcript IQ team based on your sector, rather than chosen by you from the full library.',
  },
  {
    question: 'How do I qualify for a free transcript?',
    answer:
      'Register with a work email address (institutional email preferred) and select your primary research sector. The matched transcript is delivered to your inbox within one business day.',
  },
]

// ── Per-article FAQs keyed by blog slug ──────────────────────────────────────

export const ARTICLE_FAQS: Record<string, FaqItem[]> = {
  'what-are-expert-call-transcripts': [
    {
      question: 'What is an expert call transcript?',
      answer:
        'A verbatim record of a structured conversation between an institutional researcher and an industry practitioner — typically a former executive or sector specialist. Used for primary research in investment analysis, deal diligence, and strategy engagements.',
    },
    {
      question: 'How long is a typical expert call transcript?',
      answer:
        'A standard 45–60 minute expert call produces 8,000–12,000 words of verbatim dialogue. At a comfortable reading pace, that is 30–40 minutes.',
    },
    {
      question:
        'What is the difference between an expert call transcript and an earnings call transcript?',
      answer:
        'An earnings call transcript records the formal quarterly investor call between company management and the public market. An expert call transcript records a private, structured conversation with a practitioner who has direct operating experience — typically a former employee, supplier, or customer of the company being researched.',
    },
    {
      question: 'Are expert call transcripts legal to use?',
      answer:
        'Yes, when sourced from a reputable provider that conducts MNPI screening. The legal framework is well established: expert networks have operated within SEC and FCA guidance for over two decades.',
    },
    {
      question: 'Where can I buy expert call transcripts?',
      answer:
        'Transcript IQ offers individual expert call transcripts from $349 per document, with no subscription required. Browse 77+ published transcripts at transcript-iq.com/expert-transcripts.',
    },
  ],
  'expert-call-transcript-to-investment-memo-workflow': [
    {
      question: 'How do you use an expert call transcript in an investment memo?',
      answer:
        "Identify the 2–3 insights from the transcript that directly bear on your thesis. Write those as explicit sentences connecting the expert's view to your investment case. Cite as: Expert call, [Sector], via Transcript IQ, [Date].",
    },
    {
      question: 'What is the difference between summarising and synthesising a transcript?',
      answer:
        'A summary answers "what did the expert say?" A synthesis answers "what does that mean for my thesis?" IC memos need synthesis, not summaries.',
    },
    {
      question: 'How many transcripts do you need for a conviction investment thesis?',
      answer:
        'Three to five transcripts from independent sources covering the same question generates a pattern. Convergent views build conviction; divergent views reveal the most interesting analytical question.',
    },
    {
      question: 'Can I cite an expert call transcript in a regulated investment process?',
      answer:
        'Yes. Each Transcript IQ document includes a compliance certification. Recommended citation: Expert call, [Sector], via Transcript IQ, [Date].',
    },
  ],
  'hedge-fund-expert-transcripts-earnings-research': [
    {
      question: 'How do hedge funds use expert call transcripts for earnings research?',
      answer:
        'Primarily for channel checks (demand, pricing, competitive dynamics), management quality calibration, thesis stress-testing before the call, and post-earnings variance analysis.',
    },
    {
      question: 'How much does a quarterly transcript library cost?',
      answer:
        'At Transcript IQ pricing, maintaining a refresh library for 15 positions costs approximately $3,000–$5,000 per quarter — a fraction of the cost of a platform subscription or fresh expert call programme.',
    },
    {
      question: 'When should you buy transcripts relative to earnings season?',
      answer:
        'Ideally 2–3 weeks before the earnings date, to allow time for two reads and synthesis before the call.',
    },
    {
      question: 'Can transcripts replace fresh expert calls for earnings prep?',
      answer:
        'For structural questions (competitive dynamics, management quality, cost structure), existing transcripts are usually sufficient. For time-sensitive questions (what happened in the last 90 days), a fresh call is still the right tool.',
    },
  ],
  'mnpi-compliance-expert-networks-analyst-guide': [
    {
      question: 'What is MNPI in the context of expert networks?',
      answer:
        'Material Non-Public Information — information a reasonable investor would consider significant for an investment decision that has not been publicly disclosed. In expert network research, MNPI risk arises when an expert inadvertently discloses forward-looking financial guidance, customer data, or non-public regulatory developments.',
    },
    {
      question: 'How do expert network platforms screen for MNPI?',
      answer:
        'Most platforms use a combination of pre-call compliance training for experts, interviewer guidelines, and post-call review of transcripts or notes. The weakness is reliance on self-disclosure by the expert. Transcript IQ reviews each transcript against a compliance framework before publication.',
    },
    {
      question: 'What does a transcript compliance certificate include?',
      answer:
        'The compliance certification date, the review methodology used, confirmation that no MNPI was identified, and the expert anonymisation confirmation.',
    },
    {
      question:
        'What should institutional compliance teams ask when approving a transcript platform?',
      answer:
        'Evidence of MNPI screening methodology, expert anonymisation practice, audit trail capability, and the format of the compliance certification. All four are addressed in the Transcript IQ compliance documentation.',
    },
  ],
  'tegus-vs-third-bridge-vs-transcript-iq-cost-comparison': [
    {
      question: 'How much does a Tegus subscription cost?',
      answer:
        'Tegus typically starts at approximately $15,000–$30,000 per user per year, depending on access tier and library scope. Pricing is negotiated and not publicly listed.',
    },
    {
      question:
        'What is the break-even point between a subscription and per-transcript pricing?',
      answer:
        'Roughly 25–30 transcripts per user per year. Below that, per-transcript pricing is almost always more cost-efficient.',
    },
    {
      question: 'Is Transcript IQ cheaper than Tegus?',
      answer:
        'For episodic research needs (fewer than 25 transcripts per user per year), yes — significantly. For high-frequency users reading 50+ transcripts per year, a subscription platform may offer better unit economics.',
    },
    {
      question: 'Do per-transcript providers have smaller libraries than subscription platforms?',
      answer:
        'Yes, currently. Tegus has tens of thousands of transcripts; Transcript IQ launched with 77+. The gap narrows for teams with specific sector focus — and Transcript IQ offers custom commissioning for topics not in the library.',
    },
  ],
  'pe-expert-networks-deal-diligence-transcripts': [
    {
      question: 'How do PE firms use expert networks in deal diligence?',
      answer:
        'Primarily for sector orientation at the start of a new process, management quality calibration, competitive positioning analysis, and customer/supplier perspective on the target.',
    },
    {
      question: 'How many expert calls does a PE deal team typically run per transaction?',
      answer:
        'Varies significantly by deal size and process length. Mid-market PE teams commonly run 4–10 expert interactions per transaction; large-cap teams may run 20+.',
    },
    {
      question:
        'What is the advantage of buying existing transcripts over commissioning fresh calls?',
      answer:
        'Immediate availability (minutes vs 3–7 business days), lower cost, and the ability to read before committing to a deeper primary research programme. Transcripts are a screening tool; fresh calls are for confirmed priority questions.',
    },
    {
      question: 'Can Transcript IQ transcripts be used in an IC memo for a PE deal?',
      answer:
        'Yes. Each document includes a compliance certification. Cite as: Expert call, [Sector], via Transcript IQ, [Date]. This satisfies institutional compliance documentation requirements.',
    },
  ],
}
