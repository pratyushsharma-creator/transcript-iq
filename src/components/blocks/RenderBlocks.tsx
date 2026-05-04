import {
  CustomTranscriptHeroRenderer,
  CommissioningStepsRenderer,
  DeliverablesGridRenderer,
  UseCasesBentoRenderer,
  PricingComparisonRenderer,
} from './CustomReports'
import {
  FreeTranscriptHeroRenderer,
  FreeTranscriptFeaturesRenderer,
} from './FreeTranscript'
import { ResourcesHeroRenderer, ResourcesHubRenderer } from './Resources'
import {
  HowToUseHeroRenderer,
  TranscriptAnatomyRenderer,
  ResearchApplicationsRenderer,
  WorkflowStepsRenderer,
  RoleCardsRenderer,
  ComplianceStripRenderer,
} from './HowToUse'
import { HeroBlockRenderer } from './Hero'
import { SectionIntroRenderer } from './SectionIntro'
import {
  ComplianceBadgeRowRenderer,
  TrustNumbersRenderer,
  LogosCloudRenderer,
  ComplianceCalloutRenderer,
} from './Trust'
import { ProcessStepsRenderer } from './Process'
import {
  FeatureGridRenderer,
  FeatureSplitRenderer,
  FeatureBentoRenderer,
  FeatureSpotlightRenderer,
  FeatureTabsRenderer,
} from './Features'
import {
  RichTextRenderer,
  PullQuoteRenderer,
  CalloutRenderer,
  ArgumentRenderer,
} from './Editorial'
import {
  ComparisonTableRenderer,
  TierComparisonRenderer,
  FeatureMatrixRenderer,
} from './Comparison'
import { PersonaGridRenderer, PersonaCarouselRenderer } from './Persona'
import {
  FeaturedProductsRenderer,
  ProductFilterRenderer,
  RelatedProductsRenderer,
  BundleShowcaseRenderer,
  LatestArticlesRenderer,
  ResourcesGridRenderer,
  EarningsCalendarRenderer,
} from './Catalog'
import {
  ScrollPinnedRenderer,
  BeforeAfterSliderRenderer,
  ImageRevealRenderer,
  StackedCardsRenderer,
} from './Interactive'
import {
  ImageBlockRenderer,
  ImageGalleryRenderer,
  ImageMasonryRenderer,
  ImageCarouselRenderer,
  VideoBlockRenderer,
  AnimatedSVGRenderer,
} from './Media'
import {
  MockupBuilderRenderer,
  MeshGradientPanelRenderer,
  TextMaskImageRenderer,
  NumberPostersRenderer,
  QuoteSpotlightRenderer,
  ComparisonTickerRenderer,
} from './Creative'
import {
  CTABlockRenderer,
  CTAInlineRenderer,
  CTASplitRenderer,
  NewsletterSignupRenderer,
  FormBlockRenderer,
  TestimonialRenderer,
  CaseStudyHighlightRenderer,
} from './Conversion'
import {
  MarqueeTextRenderer,
  AnnouncementBannerRenderer,
  FAQBlockRenderer,
  AccordionContentRenderer,
  DividerRenderer,
  SpacerRenderer,
  AnchorRenderer,
} from './Misc'

type AnyBlock = { blockType: string } & Record<string, unknown>

export async function RenderBlocks({ blocks }: { blocks: AnyBlock[] | undefined | null }) {
  if (!blocks || blocks.length === 0) return null
  return (
    <>
      {blocks.map((block, i) => {
        const key = `${block.blockType}-${i}`
        switch (block.blockType) {
          case 'freeTranscriptHero':
            return <FreeTranscriptHeroRenderer key={key} block={block as never} />
          case 'freeTranscriptFeatures':
            return <FreeTranscriptFeaturesRenderer key={key} block={block as never} />
          case 'resourcesHero':
            return <ResourcesHeroRenderer key={key} block={block as never} />
          case 'resourcesHub':
            return <ResourcesHubRenderer key={key} block={block as never} />
          case 'customTranscriptHero':
            return <CustomTranscriptHeroRenderer key={key} block={block as never} />
          case 'commissioningSteps':
            return <CommissioningStepsRenderer key={key} block={block as never} />
          case 'deliverablesGrid':
            return <DeliverablesGridRenderer key={key} block={block as never} />
          case 'useCasesBento':
            return <UseCasesBentoRenderer key={key} block={block as never} />
          case 'pricingComparison':
            return <PricingComparisonRenderer key={key} block={block as never} />
          case 'howToUseHero':
            return <HowToUseHeroRenderer key={key} block={block as never} />
          case 'transcriptAnatomy':
            return <TranscriptAnatomyRenderer key={key} block={block as never} />
          case 'researchApplications':
            return <ResearchApplicationsRenderer key={key} block={block as never} />
          case 'workflowSteps':
            return <WorkflowStepsRenderer key={key} block={block as never} />
          case 'roleCards':
            return <RoleCardsRenderer key={key} block={block as never} />
          case 'complianceStrip':
            return <ComplianceStripRenderer key={key} block={block as never} />
          case 'hero':
            return <HeroBlockRenderer key={key} block={block as never} />
          case 'sectionIntro':
            return <SectionIntroRenderer key={key} block={block as never} />
          case 'complianceBadgeRow':
            return <ComplianceBadgeRowRenderer key={key} block={block as never} />
          case 'trustNumbers':
            return <TrustNumbersRenderer key={key} block={block as never} />
          case 'logosCloud':
            return <LogosCloudRenderer key={key} block={block as never} />
          case 'complianceCallout':
            return <ComplianceCalloutRenderer key={key} block={block as never} />
          case 'processSteps':
            return <ProcessStepsRenderer key={key} block={block as never} />
          case 'featureGrid':
            return <FeatureGridRenderer key={key} block={block as never} />
          case 'featureSplit':
            return <FeatureSplitRenderer key={key} block={block as never} />
          case 'featureBento':
            return <FeatureBentoRenderer key={key} block={block as never} />
          case 'featureSpotlight':
            return <FeatureSpotlightRenderer key={key} block={block as never} />
          case 'featureTabs':
            return <FeatureTabsRenderer key={key} block={block as never} />
          case 'richText':
            return <RichTextRenderer key={key} block={block as never} />
          case 'pullQuote':
            return <PullQuoteRenderer key={key} block={block as never} />
          case 'callout':
            return <CalloutRenderer key={key} block={block as never} />
          case 'argument':
            return <ArgumentRenderer key={key} block={block as never} />
          case 'comparisonTable':
            return <ComparisonTableRenderer key={key} block={block as never} />
          case 'tierComparison':
            return <TierComparisonRenderer key={key} block={block as never} />
          case 'featureMatrix':
            return <FeatureMatrixRenderer key={key} block={block as never} />
          case 'personaGrid':
            return <PersonaGridRenderer key={key} block={block as never} />
          case 'personaCarousel':
            return <PersonaCarouselRenderer key={key} block={block as never} />
          case 'featuredProducts':
            return <FeaturedProductsRenderer key={key} block={block as never} />
          case 'productFilter':
            return <ProductFilterRenderer key={key} block={block as never} />
          case 'relatedProducts':
            return <RelatedProductsRenderer key={key} block={block as never} />
          case 'bundleShowcase':
            return <BundleShowcaseRenderer key={key} block={block as never} />
          case 'latestArticles':
            return <LatestArticlesRenderer key={key} block={block as never} />
          case 'resourcesGrid':
            return <ResourcesGridRenderer key={key} block={block as never} />
          case 'earningsCalendar':
            return <EarningsCalendarRenderer key={key} block={block as never} />
          case 'scrollPinned':
            return <ScrollPinnedRenderer key={key} block={block as never} />
          case 'beforeAfterSlider':
            return <BeforeAfterSliderRenderer key={key} block={block as never} />
          case 'imageReveal':
            return <ImageRevealRenderer key={key} block={block as never} />
          case 'stackedCards':
            return <StackedCardsRenderer key={key} block={block as never} />
          case 'imageBlock':
            return <ImageBlockRenderer key={key} block={block as never} />
          case 'imageGallery':
            return <ImageGalleryRenderer key={key} block={block as never} />
          case 'imageMasonry':
            return <ImageMasonryRenderer key={key} block={block as never} />
          case 'imageCarousel':
            return <ImageCarouselRenderer key={key} block={block as never} />
          case 'videoBlock':
            return <VideoBlockRenderer key={key} block={block as never} />
          case 'animatedSvg':
            return <AnimatedSVGRenderer key={key} block={block as never} />
          case 'mockupBuilder':
            return <MockupBuilderRenderer key={key} block={block as never} />
          case 'meshGradientPanel':
            return <MeshGradientPanelRenderer key={key} block={block as never} />
          case 'textMaskImage':
            return <TextMaskImageRenderer key={key} block={block as never} />
          case 'numberPosters':
            return <NumberPostersRenderer key={key} block={block as never} />
          case 'quoteSpotlight':
            return <QuoteSpotlightRenderer key={key} block={block as never} />
          case 'comparisonTicker':
            return <ComparisonTickerRenderer key={key} block={block as never} />
          case 'cta':
            return <CTABlockRenderer key={key} block={block as never} />
          case 'ctaInline':
            return <CTAInlineRenderer key={key} block={block as never} />
          case 'ctaSplit':
            return <CTASplitRenderer key={key} block={block as never} />
          case 'newsletterSignup':
            return <NewsletterSignupRenderer key={key} block={block as never} />
          case 'formBlock':
            return <FormBlockRenderer key={key} block={block as never} />
          case 'testimonial':
            return <TestimonialRenderer key={key} block={block as never} />
          case 'caseStudyHighlight':
            return <CaseStudyHighlightRenderer key={key} block={block as never} />
          case 'marqueeText':
            return <MarqueeTextRenderer key={key} block={block as never} />
          case 'announcementBanner':
            return <AnnouncementBannerRenderer key={key} block={block as never} />
          case 'faq':
            return <FAQBlockRenderer key={key} block={block as never} />
          case 'accordionContent':
            return <AccordionContentRenderer key={key} block={block as never} />
          case 'divider':
            return <DividerRenderer key={key} block={block as never} />
          case 'spacer':
            return <SpacerRenderer key={key} block={block as never} />
          case 'anchor':
            return <AnchorRenderer key={key} block={block as never} />
          default:
            return (
              <div
                key={key}
                className="mx-auto my-8 max-w-3xl rounded-lg border border-dashed border-[var(--border)] p-6 text-center font-mono text-[12px] text-[var(--mist)]"
              >
                Unknown block type: {block.blockType}
              </div>
            )
        }
      })}
    </>
  )
}
