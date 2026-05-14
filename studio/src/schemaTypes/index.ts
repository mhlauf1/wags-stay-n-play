import {page} from './documents/page'
import {service} from './documents/service'
import {testimonial} from './documents/testimonial'
import {callToAction} from './objects/callToAction'
import {infoSection} from './objects/infoSection'
import {hero} from './objects/hero'
import {imageRow} from './objects/imageRow'
import {featureCards} from './objects/featureCards'
import {serviceTabs} from './objects/serviceTabs'
import {statsBar} from './objects/statsBar'
import {testimonials} from './objects/testimonials'
import {ctaBanner} from './objects/ctaBanner'
import {splitContent} from './objects/splitContent'
import {faqAccordion} from './objects/faqAccordion'
import {pricingTable} from './objects/pricingTable'
import {teamGrid} from './objects/teamGrid'
import {galleryGrid} from './objects/galleryGrid'
import {contactForm} from './objects/contactForm'
import {heroSplit} from './objects/heroSplit'
import {heroBanner} from './objects/heroBanner'
import {heroMarquee} from './objects/heroMarquee'
import {heroMinimal} from './objects/heroMinimal'
import {serviceCards} from './objects/serviceCards'
import {expandingCardsRow} from './objects/expandingCardsRow'
import {featureList} from './objects/featureList'
import {processSteps} from './objects/processSteps'
import {contentColumns} from './objects/contentColumns'
import {iconGrid} from './objects/iconGrid'
import {videoSection} from './objects/videoSection'
import {fullWidthMedia} from './objects/fullWidthMedia'
import {ctaStrip} from './objects/ctaStrip'
import {logoBar} from './objects/logoBar'
import {pricingMatrix} from './objects/pricingMatrix'
import {pricingList} from './objects/pricingList'
import {policyNotes} from './objects/policyNotes'
import {featureGrid} from './objects/featureGrid'
import {pricingCalculator} from './objects/pricingCalculator'
import {whatsIncluded} from './objects/whatsIncluded'
import {requirementsList} from './objects/requirementsList'
import {galleryCarousel} from './objects/galleryCarousel'
import {galleryShowcase} from './objects/galleryShowcase'
import {galleryPage} from './objects/galleryPage'
import {valuePillars} from './objects/valuePillars'
import {pricingPageTabs} from './objects/pricingPageTabs'
import {photoMarquee} from './objects/photoMarquee'
import {spacer} from './objects/spacer'
import {seo} from './objects/seo'
import {settings} from './singletons/settings'
import {link} from './objects/link'
import {blockContent} from './objects/blockContent'
import button from './objects/button'
import {blockContentTextOnly} from './objects/blockContentTextOnly'

export const schemaTypes = [
  // Singletons
  settings,
  // Documents
  page,
  service,
  testimonial,
  // Objects
  seo,
  button,
  blockContent,
  blockContentTextOnly,
  infoSection,
  callToAction,
  link,
  // New page builder blocks
  hero,
  imageRow,
  featureCards,
  serviceTabs,
  statsBar,
  testimonials,
  ctaBanner,
  splitContent,
  faqAccordion,
  pricingTable,
  teamGrid,
  galleryGrid,
  contactForm,
  heroSplit,
  heroBanner,
  heroMarquee,
  heroMinimal,
  serviceCards,
  expandingCardsRow,
  featureList,
  processSteps,
  contentColumns,
  iconGrid,
  videoSection,
  fullWidthMedia,
  ctaStrip,
  logoBar,
  pricingMatrix,
  pricingList,
  policyNotes,
  featureGrid,
  pricingCalculator,
  whatsIncluded,
  requirementsList,
  galleryCarousel,
  galleryShowcase,
  galleryPage,
  valuePillars,
  pricingPageTabs,
  photoMarquee,
  spacer,
]
