# Sanity Schema Reference

> **This file is a living document.** Update it whenever the Sanity schema changes so Claude Code always has an accurate picture of the content model.

## Status

Schema fully set up for Kingdom Canine. Webcam types removed in M1. POS URL fields added to settings in M2. M3 added: `hero.carouselImages[]`, `serviceCards.variant` (`white` | `imageOverlay`, default `white`), `serviceCards.cards[]` named as `serviceCard`, `splitContent.hours[]` (named `hoursEntry`, label/value). All content seeded and published. Schema deployed to cloud.

## Sanity Project Details

- **Project ID:** `ldmtl3r7`
- **Dataset:** `production`
- **Studio URL:** `http://localhost:3333` (dev) / embedded at `/studio` in frontend
- **API version:** `2025-09-25`

## Architecture

This is a **page builder** architecture. Pages and services have a `pageBuilder` array field that accepts 40+ block types. There are no standalone `pricingTier` or `faq` documents — pricing, FAQs, team members, and feature cards are all inline arrays within pageBuilder blocks.

The only standalone reference document is `testimonial`.

## Document Types

### `settings` (singleton)
Global site config: title, tagline, logo, nav items, CTA button, footer columns, contact info, social links, **POS/booking URLs** (portalUrl, registrationUrl, per-service booking URLs), business hours, SEO (OG image, favicon, GA4, GTM, GSC), local business structured data.

**KC-specific:** POS portal URLs stored here (Gingr now, Goose later) for single-point swap. The `posUrls` object field was added in M2.

### `page`
Generic pages (homepage, pricing, gallery, new-clients, contact). Fields: name, slug, seo, pageBuilder (42 block types).

**Seeded pages:** Homepage, Pricing, Contact, New Clients.

### `service`
Service detail pages (daycare, boarding, grooming, transportation). Fields: title, slug, sticker, shortDescription, tabImage, tabCta, heading, seo, pageBuilder (35 block types).

**Seeded services:** Daycare, Boarding, Grooming, Transportation.

### `testimonial`
Customer reviews. Fields: quote, authorName, authorLabel, rating (1-5, default 5).

**No testimonials seeded yet** — waiting on content from Brian.

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

**M2 update:** `pricingData.ts` has been completely rewritten with KC pricing:
- Daycare: $36/$24 single, 10/20/30-day packages
- Boarding: Standard $64, VIP Luxury Suite $150 (suite rate), additional dog $55
- Grooming: Bath (size × hair length), full groom by size, doodle surcharge, 5 à la carte services, teeth cleaning add-on

## Seeded Content Reference

| Document | Type | Slug | Sanity ID |
|----------|------|------|-----------|
| Daycare | service | daycare | `ac1c50d8-43b0-43f1-a3d9-7610223f9069` |
| Boarding | service | boarding | `55576abb-c716-4f3f-94af-d09ff5c4157d` |
| Grooming | service | grooming | `402a10e1-4e98-4403-88a3-99e52b7c6c01` |
| Transportation | service | transportation | `ae6eb460-0265-4a10-94cc-4194caf02531` |
| Homepage | page | homepage | `419c1a14-b6a4-4ef8-9313-97d7b71ccecc` |
| Pricing | page | pricing | `bac599e8-11c6-423b-9ce5-a4b557d311e5` |
| Contact | page | contact | `9b3488e7-b902-416e-87cf-2c1382e785ba` |
| New Clients | page | new-clients | `5e76c40e-9e73-46f2-9bea-8625f04cbc85` |
| Settings | settings | — | `fba58743-9937-4781-b004-ad8ced408efd` |

## Notes

- Keep schemas structurally aligned with other Embark sites for future template extraction
- Don't add fields you don't need yet — only add what the current content requires
- Schema deployed to cloud via `npx sanity schema deploy` from `studio/` directory
- Transportation pricing uses `pricingList` block (single trip $16, 5-trip $75, 10-trip $140) — no calculator needed
