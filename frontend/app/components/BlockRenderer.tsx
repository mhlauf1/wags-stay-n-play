import React, {Suspense, lazy} from 'react'

// Above-fold components loaded eagerly
import Hero from '@/app/components/sections/Hero'
import HeroSplit from '@/app/components/sections/HeroSplit'
import HeroBanner from '@/app/components/sections/HeroBanner'
import HeroMarquee from '@/app/components/sections/HeroMarquee'
import HeroMinimal from '@/app/components/sections/HeroMinimal'
import CtaBanner from '@/app/components/sections/CtaBanner'
import ContactFormComponent from '@/app/components/sections/ContactForm'

// Below-fold components loaded on demand
const Cta = lazy(() => import('@/app/components/Cta'))
const Info = lazy(() => import('@/app/components/InfoSection'))
const ImageRow = lazy(() => import('@/app/components/sections/ImageRow'))
const FeatureCards = lazy(() => import('@/app/components/sections/FeatureCards'))
const ServiceTabs = lazy(() => import('@/app/components/sections/ServiceTabs'))
const StatsBar = lazy(() => import('@/app/components/sections/StatsBar'))
const Testimonials = lazy(() => import('@/app/components/sections/Testimonials'))
const SplitContent = lazy(() => import('@/app/components/sections/SplitContent'))
const FaqAccordion = lazy(() => import('@/app/components/sections/FaqAccordion'))
const PricingTable = lazy(() => import('@/app/components/sections/PricingTable'))
const TeamGrid = lazy(() => import('@/app/components/sections/TeamGrid'))
const GalleryGrid = lazy(() => import('@/app/components/sections/GalleryGrid'))
const ServiceCards = lazy(() => import('@/app/components/sections/ServiceCards'))
const ExpandingCardsRow = lazy(() => import('@/app/components/sections/ExpandingCardsRow'))
const FeatureList = lazy(() => import('@/app/components/sections/FeatureList'))
const ProcessSteps = lazy(() => import('@/app/components/sections/ProcessSteps'))
const ContentColumns = lazy(() => import('@/app/components/sections/ContentColumns'))
const IconGrid = lazy(() => import('@/app/components/sections/IconGrid'))
const VideoSection = lazy(() => import('@/app/components/sections/VideoSection'))
const FullWidthMedia = lazy(() => import('@/app/components/sections/FullWidthMedia'))
const CtaStrip = lazy(() => import('@/app/components/sections/CtaStrip'))
const LogoBar = lazy(() => import('@/app/components/sections/LogoBar'))
const PricingMatrix = lazy(() => import('@/app/components/sections/PricingMatrix'))
const PricingList = lazy(() => import('@/app/components/sections/PricingList'))
const PolicyNotes = lazy(() => import('@/app/components/sections/PolicyNotes'))
const FeatureGrid = lazy(() => import('@/app/components/sections/FeatureGrid'))
const PricingCalculator = lazy(() => import('@/app/components/sections/PricingCalculator'))
const WhatsIncluded = lazy(() => import('@/app/components/sections/WhatsIncluded'))
const RequirementsList = lazy(() => import('@/app/components/sections/RequirementsList'))
const GalleryCarousel = lazy(() => import('@/app/components/sections/GalleryCarousel'))
const GalleryShowcase = lazy(() => import('@/app/components/sections/GalleryShowcase'))
const GalleryPage = lazy(() => import('@/app/components/sections/GalleryPage'))
const ValuePillars = lazy(() => import('@/app/components/sections/ValuePillars'))
const PricingPageTabs = lazy(() => import('@/app/components/sections/PricingPageTabs'))
const Spacer = lazy(() => import('@/app/components/sections/Spacer'))
import {dataAttr} from '@/sanity/lib/utils'
import {PageBuilderSection} from '@/sanity/lib/types'

type BlockProps = {
  index: number
  block: PageBuilderSection
  pageId: string
  pageType: string
}

function ContactForm(props: BlockProps) {
  return (
    <Suspense>
      <ContactFormComponent {...(props as any)} />
    </Suspense>
  )
}

// Hero types are eagerly loaded, everything else is lazy
const eagerTypes = new Set(['hero', 'heroSplit', 'heroBanner', 'heroMarquee', 'heroMinimal', 'ctaBanner', 'galleryPage', 'pricingPageTabs', 'contactForm'])

type BlocksType = {
  [key: string]: React.FC<BlockProps>
}

const Blocks = {
  callToAction: Cta,
  infoSection: Info,
  hero: Hero,
  imageRow: ImageRow,
  featureCards: FeatureCards,
  serviceTabs: ServiceTabs,
  statsBar: StatsBar,
  testimonials: Testimonials,
  ctaBanner: CtaBanner,
  splitContent: SplitContent,
  faqAccordion: FaqAccordion,
  pricingTable: PricingTable,
  teamGrid: TeamGrid,
  galleryGrid: GalleryGrid,
  contactForm: ContactForm,
  heroSplit: HeroSplit,
  heroBanner: HeroBanner,
  heroMarquee: HeroMarquee,
  heroMinimal: HeroMinimal,
  serviceCards: ServiceCards,
  expandingCardsRow: ExpandingCardsRow,
  featureList: FeatureList,
  processSteps: ProcessSteps,
  contentColumns: ContentColumns,
  iconGrid: IconGrid,
  videoSection: VideoSection,
  fullWidthMedia: FullWidthMedia,
  ctaStrip: CtaStrip,
  logoBar: LogoBar,
  pricingMatrix: PricingMatrix,
  pricingList: PricingList,
  policyNotes: PolicyNotes,
  featureGrid: FeatureGrid,
  pricingCalculator: PricingCalculator,
  whatsIncluded: WhatsIncluded,
  requirementsList: RequirementsList,
  galleryCarousel: GalleryCarousel,
  galleryShowcase: GalleryShowcase,
  galleryPage: GalleryPage,
  valuePillars: ValuePillars,
  pricingPageTabs: PricingPageTabs,
  spacer: Spacer,
} as BlocksType

export default function BlockRenderer({block, index, pageId, pageType}: BlockProps) {
  if (typeof Blocks[block._type] !== 'undefined') {
    const content = React.createElement(Blocks[block._type], {
      key: block._key,
      block: block,
      index: index,
      pageId: pageId,
      pageType: pageType,
    })
    return (
      <div
        key={block._key}
        data-sanity={dataAttr({
          id: pageId,
          type: pageType,
          path: `pageBuilder[_key=="${block._key}"]`,
        }).toString()}
      >
        {eagerTypes.has(block._type) ? content : <Suspense>{content}</Suspense>}
      </div>
    )
  }
  return React.createElement(
    () => (
      <div className="w-full bg-sand/20 text-center text-text-muted p-20 rounded-md">
        A &ldquo;{block._type}&rdquo; block hasn&apos;t been created
      </div>
    ),
    {key: block._key},
  )
}
