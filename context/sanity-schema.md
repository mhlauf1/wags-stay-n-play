# Sanity Schema Reference

> **This file is a living document.** Update it whenever the Sanity schema changes so Claude Code always has an accurate picture of the content model.

## Status

Schema deployed to cloud. All content seeded and published. Pricing data rewritten in pricingData.ts for Wags service structure (4 boarding tiers, cat services, punch cards, 3 grooming service types).

## Sanity Project Details

- **Project ID:** `3h90m8qu`
- **Dataset:** `production`
- **Studio URL:** `http://localhost:3333` (dev) / embedded at `/studio` in frontend
- **API version:** `2025-09-25`

## Architecture

This is a **page builder** architecture. Pages and services have a `pageBuilder` array field that accepts 40+ block types. There are no standalone `pricingTier` or `faq` documents — pricing, FAQs, team members, and feature cards are all inline arrays within pageBuilder blocks.

The only standalone reference document is `testimonial`.

## Document Types

### `settings` (singleton)
Global site config: title, tagline, logo, nav items, CTA button, footer columns, contact info, social links, **POS/booking URLs** (portalUrl, registrationUrl, per-service booking URLs), business hours, SEO (OG image, favicon, GA4, GTM, GSC), local business structured data.

**Wags-specific:** POS portal URLs stored here for single-point swap when Goose goes live. The `posUrls` object field includes transportationBookingUrl which can be removed or left unused.

### `page`
Generic pages (homepage, pricing, gallery, new-clients, contact, about). Fields: name, slug, seo, pageBuilder (42 block types).

### `service`
Service detail pages (daycare, boarding, grooming). Fields: title, slug, sticker, shortDescription, tabImage, tabCta, heading, seo, pageBuilder (35 block types).

### `testimonial`
Customer reviews. Fields: quote, authorName, authorLabel, rating (1-5, default 5).

## Key Object Types (PageBuilder Blocks)

- `hero` / `heroSplit` / `heroBanner` / `heroMinimal` — Hero sections
- `featureCards` / `featureGrid` / `featureList` — Feature displays
- `pricingTable` / `pricingList` / `pricingMatrix` / `pricingCalculator` / `pricingPageTabs` — Pricing
- `faqAccordion` — Inline Q&A (not standalone documents)
- `testimonials` — References `testimonial` documents
- `teamGrid` — Inline team members (name, role, bio, certifications, image)
- `serviceTabs` / `serviceCards` — Service displays (reference `service` documents)
- `contactForm` — Dynamic form builder
- `galleryGrid` / `galleryCarousel` / `galleryShowcase` / `galleryPage` — Gallery
- `processSteps` / `whatsIncluded` / `requirementsList` — Lists/timelines
- `splitContent` / `contentColumns` — Content layouts
- `callToAction` / `ctaBanner` / `ctaStrip` — CTAs
- `statsBar` — Stats counter
- `iconGrid` / `valuePillars` / `logoBar` — Misc

## Reusable Object Types

- `link` — Flexible link (internal page/service reference or external URL)
- `button` — Button with text + link
- `blockContent` — Rich text (Portable Text)
- `blockContentTextOnly` — Text-only rich text
- `seo` — Per-page SEO overrides (metaTitle, metaDescription, ogImage, noIndex)

## GROQ Query Patterns

All queries live in `frontend/sanity/lib/queries.ts`.

```groq
// Homepage
*[_type == 'page' && slug.current == 'homepage'][0]{ ... }

// Page by slug
*[_type == 'page' && slug.current == $slug][0]{ ... }

// Service by slug
*[_type == 'service' && slug.current == $slug][0]{ ... }

// Settings (singleton)
*[_type == 'settings'][0]{ ..., posUrls, ... }

// Services for nav
*[_type == 'service']{ title, "slug": slug.current }
```

## Pricing Calculator

The pricing calculator (`pricingCalculator` block type) has a `calculatorType` field (`daycare` | `boarding` | `grooming`) and supports `single` or `tabbed` display mode. **Actual pricing data is hardcoded in `frontend/app/data/pricingData.ts`**, not in Sanity. The Sanity block only configures which calculator to show and the CTA link.

**Wags pricing structure (implemented in M2):**
- Daycare: Assessment $20, Full Day $29, Half Day $19, Cat $18, punch cards (10/20/30/90-day unlimited)
- Boarding: 4 tiers (Standard $44, Junior $48, Queen $52, Master $57), Cat $28, additional pet $5 discount, punch cards (buy X get Y free)
- Grooming: Full Groom ($65–$130), Bath & Works ($55–$150), Exit Bath ($18–$37), Cat grooming (display only), à la carte ($8 each), exit bath add-ons ($5 each)

## Seeded Content Reference

| Document | Type | Slug | Sanity ID |
|----------|------|------|-----------|
| Settings | settings | — | `aa441a64-cbec-43e1-bd7b-1ac637d0a119` |
| Daycare | service | daycare | `32d065b8-fa8f-4036-abaa-a07d75ec638f` |
| Boarding | service | boarding | `d56ab06d-89fd-4e54-84a7-4df2b54f49ee` |
| Grooming | service | grooming | `39a1ed77-7ef9-438d-9f25-0c8932400086` |
| Homepage | page | homepage | `4422f53e-b3ae-4991-baa3-049fa1093329` |
| Pricing | page | pricing | `cbdc3e6d-03f6-4116-a411-b93b8f3153ee` |
| Contact | page | contact | `286ecd70-41ab-4b1a-90c9-d5ee1fb08220` |
| New Clients | page | new-clients | `4af8f51f-0678-41be-a8b4-8458449a58db` |
| About Us | page | about | `a9fc51c5-e7bd-4f62-ab96-18c13c29aa52` |

## Notes

- Keep schemas structurally aligned with other Embark sites for future template extraction
- Don't add fields you don't need yet — only add what the current content requires
- Schema deployed to cloud via `npx sanity schema deploy` from `studio/` directory
- Wags has no transportation service — don't seed a transportation service document
- Cat services are integrated into daycare, boarding, and grooming pages, not separate documents
