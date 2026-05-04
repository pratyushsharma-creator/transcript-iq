import type { CollectionConfig } from 'payload'
import { slugify } from '../lib/slugify'
import { publishedOnly } from '../access/publishedOnly'
import { CACHE_TAGS, revalidateOnPublish } from '@/lib/cache/revalidation'

import {
  Hero,
  SectionIntro,
  HowToUseHero,
  FreeTranscriptHero,
  FreeTranscriptFeatures,
  ResourcesHero,
  ResourcesHub,
  CustomTranscriptHero,
  CommissioningSteps,
  DeliverablesGrid,
  UseCasesBento,
  PricingComparison,
  TranscriptAnatomy,
  ResearchApplications,
  WorkflowSteps,
  RoleCards,
  ComplianceStrip,
  ComplianceBadgeRow,
  TrustNumbers,
  LogosCloud,
  ComplianceCallout,
  ProcessSteps,
  FeatureGrid,
  FeatureSplit,
  FeatureBento,
  FeatureSpotlight,
  FeatureTabs,
  RichTextBlock,
  PullQuote,
  Callout,
  ArgumentBlock,
  ComparisonTable,
  TierComparison,
  FeatureMatrix,
  PersonaGrid,
  PersonaCarousel,
  FeaturedProducts,
  ProductFilter,
  RelatedProducts,
  BundleShowcase,
  LatestArticles,
  ResourcesGrid,
  EarningsCalendar,
  ScrollPinned,
  BeforeAfterSlider,
  ImageReveal,
  StackedCards,
  ImageBlock,
  ImageGallery,
  ImageMasonry,
  ImageCarousel,
  VideoBlock,
  AnimatedSVG,
  CTABlock,
  CTAInline,
  CTASplit,
  NewsletterSignup,
  FormBlock,
  TestimonialBlock,
  CaseStudyHighlight,
  MarqueeText,
  AnnouncementBanner,
  FAQBlock,
  AccordionContent,
  Divider,
  Spacer,
  Anchor,
  MockupBuilder,
  MeshGradientPanel,
  TextMaskImage,
  NumberPosters,
  QuoteSpotlight,
  ComparisonTicker,
} from '../blocks'

const allBlocks = [
  // Heroes & intros
  Hero,
  SectionIntro,
  // How-to-use page blocks
  HowToUseHero,
  // Free transcript page blocks
  FreeTranscriptHero,
  FreeTranscriptFeatures,
  // Resources hub page blocks
  ResourcesHero,
  ResourcesHub,
  // Custom transcript page blocks
  CustomTranscriptHero,
  CommissioningSteps,
  DeliverablesGrid,
  UseCasesBento,
  PricingComparison,
  TranscriptAnatomy,
  ResearchApplications,
  WorkflowSteps,
  RoleCards,
  ComplianceStrip,
  // Trust / compliance
  ComplianceBadgeRow,
  TrustNumbers,
  LogosCloud,
  ComplianceCallout,
  // Process
  ProcessSteps,
  // Features
  FeatureGrid,
  FeatureSplit,
  FeatureBento,
  FeatureSpotlight,
  FeatureTabs,
  // Editorial
  RichTextBlock,
  PullQuote,
  Callout,
  ArgumentBlock,
  // Comparison
  ComparisonTable,
  TierComparison,
  FeatureMatrix,
  // Persona
  PersonaGrid,
  PersonaCarousel,
  // Catalog / dynamic
  FeaturedProducts,
  ProductFilter,
  RelatedProducts,
  BundleShowcase,
  LatestArticles,
  ResourcesGrid,
  EarningsCalendar,
  // Interactive
  ScrollPinned,
  BeforeAfterSlider,
  ImageReveal,
  StackedCards,
  // Visual / media
  ImageBlock,
  ImageGallery,
  ImageMasonry,
  ImageCarousel,
  VideoBlock,
  AnimatedSVG,
  // CTAs
  CTABlock,
  CTAInline,
  CTASplit,
  NewsletterSignup,
  // Forms
  FormBlock,
  // Social proof
  TestimonialBlock,
  CaseStudyHighlight,
  // Marquee / banner
  MarqueeText,
  AnnouncementBanner,
  // FAQ / accordions
  FAQBlock,
  AccordionContent,
  // Layout helpers
  Divider,
  Spacer,
  Anchor,
  // Bonus creatives
  MockupBuilder,
  MeshGradientPanel,
  TextMaskImage,
  NumberPosters,
  QuoteSpotlight,
  ComparisonTicker,
]

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    group: 'Content',
  },
  versions: { drafts: true },
  access: {
    read: publishedOnly,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar', description: 'Page route. "home" is special — renders at /.' },
      hooks: {
        beforeValidate: [
          ({ value, data }) => value || slugify(data?.title as string | undefined),
        ],
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: allBlocks,
      admin: { initCollapsed: true },
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidateOnPublish(CACHE_TAGS.pages, doc)
      },
    ],
  },
}
