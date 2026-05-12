import {defineQuery} from 'next-sanity'

const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->slug.current,
    "pageType": page->_type
  }
`

const linkFields = /* groq */ `
  link {
      ...,
      ${linkReference}
      }
`

export const settingsQuery = defineQuery(`*[_type == "settings"][0]{
  ...,
  navItems[]{
    ...,
    ${linkFields},
    children[]{
      ...,
      ${linkFields}
    }
  },
  ctaButton {
    ...,
    ${linkFields}
  },
  footerColumns[]{
    ...,
    links[]{
      ...,
      ${linkFields}
    }
  },
  contactInfo,
  footerTagline,
  footerText,
  footerTextLink,
  footerBottomLinks[]{
    ...,
    ${linkFields}
  },
  logo,
  yearEstablished,
  socialLinks,
  posUrls,
  "faviconUrl": favicon.asset->url,
  ga4MeasurementId,
  gtmContainerId,
  googleSiteVerification,
  localBusiness
}`)

const buttonFields = /* groq */ `
  {
    ...,
    ${linkFields}
  }
`

const pageBuilderExpansion = /* groq */ `
  "pageBuilder": pageBuilder[]{
    ...,
    _type == "callToAction" => {
      ...,
      button ${buttonFields}
    },
    _type == "infoSection" => {
      content[]{
        ...,
        markDefs[]{
          ...,
          ${linkReference}
        }
      }
    },
    _type == "hero" => {
      ...,
      primaryCta ${buttonFields},
      secondaryCta ${buttonFields}
    },
    _type == "featureCards" => {
      ...,
      cta ${buttonFields}
    },
    _type == "serviceTabs" => {
      ...,
      tabs[]->{
        _id,
        title,
        slug,
        sticker{asset, alt},
        shortDescription,
        tabImage{asset, crop, hotspot, alt},
        tabCta ${buttonFields}
      }
    },
    _type == "testimonials" => {
      ...,
      reviews[]->{
        _id,
        quote,
        authorName,
        authorLabel,
        rating
      }
    },
    _type == "ctaBanner" => {
      ...,
      cta ${buttonFields}
    },
    _type == "splitContent" => {
      ...,
      link {
        ...,
        link {
          ...,
          ${linkReference}
        }
      }
    },
    _type == "faqAccordion" => {
      ...,
      faqs[]{
        ...,
        answer[]{
          ...,
          markDefs[]{
            ...,
            ${linkReference}
          }
        }
      }
    },
    _type == "pricingTable" => {
      ...,
      categories[]{
        ...,
        tiers[]{
          ...,
          cta ${buttonFields}
        }
      }
    },
    _type == "contactForm" => {
      ...,
      description[]{
        ...,
        markDefs[]{
          ...,
          ${linkReference}
        }
      }
    },
    _type == "heroSplit" => {
      ...,
      primaryCta ${buttonFields},
      secondaryCta ${buttonFields}
    },
    _type == "heroBanner" => {
      ...,
      primaryCta ${buttonFields}
    },
    _type == "heroMarquee" => {
      ...,
      primaryCta ${buttonFields},
      secondaryCta ${buttonFields}
    },
    _type == "heroMinimal" => {
      ...
    },
    _type == "serviceCards" => {
      ...,
      cards[]{
        ...,
        cta ${buttonFields}
      }
    },
    _type == "expandingCardsRow" => {
      ...,
      cards[]{
        ...,
        link ${buttonFields}
      }
    },
    _type == "featureList" => {
      ...,
      features[]{
        ...,
        body[]{
          ...,
          markDefs[]{
            ...,
            ${linkReference}
          }
        },
        cta ${buttonFields}
      }
    },
    _type == "processSteps" => {
      ...,
      cta ${buttonFields}
    },
    _type == "contentColumns" => {
      ...,
      columns[]{
        ...,
        body[]{
          ...,
          markDefs[]{
            ...,
            ${linkReference}
          }
        },
        cta ${buttonFields}
      }
    },
    _type == "fullWidthMedia" => {
      ...,
      cta ${buttonFields}
    },
    _type == "ctaStrip" => {
      ...,
      cta ${buttonFields}
    },
    _type == "pricingMatrix" => {
      ...
    },
    _type == "pricingList" => {
      ...
    },
    _type == "policyNotes" => {
      ...
    },
    _type == "featureGrid" => {
      ...,
      cta ${buttonFields}
    },
    _type == "pricingCalculator" => {
      ...,
      ctaLink {
        ...,
        ${linkReference}
      }
    },
    _type == "whatsIncluded" => {
      ...
    },
    _type == "requirementsList" => {
      ...,
      link {
        ...,
        link {
          ...,
          ${linkReference}
        }
      }
    },
    _type == "galleryGrid" => {
      ...
    },
    _type == "galleryCarousel" => {
      ...
    },
    _type == "galleryShowcase" => {
      ...
    },
    _type == "galleryPage" => {
      ...
    },
    _type == "pricingPageTabs" => {
      ...,
      ctaLink {
        ...,
        ${linkReference}
      }
    },
  }
`

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    seo,
    ${pageBuilderExpansion},
  }
`)

export const homepageQuery = defineQuery(`
  *[_type == 'page' && slug.current == 'homepage'][0]{
    _id,
    _type,
    name,
    slug,
    seo,
    ${pageBuilderExpansion},
  }
`)

export const sitemapData = defineQuery(`
  *[_type in ["page", "service"] && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
    "noIndex": seo.noIndex,
  }
`)

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`)

export const getServiceQuery = defineQuery(`
  *[_type == 'service' && slug.current == $slug][0]{
    _id,
    _type,
    title,
    slug,
    heading,
    shortDescription,
    seo,
    ${pageBuilderExpansion},
  }
`)

export const serviceSlugs = defineQuery(`
  *[_type == "service" && defined(slug.current)]
  {"slug": slug.current}
`)

export const servicesNavQuery = defineQuery(`
  *[_type == "service" && defined(slug.current)] | order(title asc) {
    _id, title, "slug": slug.current
  }
`)
