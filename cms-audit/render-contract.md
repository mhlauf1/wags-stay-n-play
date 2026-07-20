# Wags Stay N' Play — Post-Projection Render Contract

Evidence is from `frontend/sanity/lib/queries.ts`, route/component source, and read-only production GROQ on 2026-07-10. “Optional live” means absent from at least one live instance of that block.

## 1. Routing map

| Route | File | Data/query | Mapping and behavior |
|---|---|---|---|
| `/` | `frontend/app/page.tsx` | `homepageQuery` | Selects `_type=='page' && slug.current=='homepage'`; page builder; canonical `/` |
| `/[slug]` | `frontend/app/[slug]/page.tsx` | `getPageQuery`, `pagesSlugs` | `$slug` selects page; `generateStaticParams` uses published perspective; page builder |
| `/services/[slug]` | `frontend/app/services/[slug]/page.tsx` | `getServiceQuery`, `serviceSlugs` | `$slug` selects service; published static params; page builder |
| `/studio/[[...tool]]` | `frontend/app/studio/[[...tool]]/page.tsx` | Sanity `NextStudio` | Embedded Studio, not page builder |
| `/api/contact` | `frontend/app/api/contact/route.ts` | none | POST email handler, not CMS page |
| `/api/draft-mode/enable` | `frontend/app/api/draft-mode/enable/route.ts` | `defineEnableDraftMode` | Enables preview/draft mode |
| `/sitemap.xml` | `frontend/app/sitemap.ts` | `sitemapData` | Code-generated sitemap from page/service slugs |
| `/robots.txt` | `frontend/app/robots.ts` | none | Code-generated robots metadata |

`frontend/app/layout.tsx` wraps every route and fetches `settingsQuery` and `servicesNavQuery`. Error and not-found boundaries do not fetch CMS data (`frontend/app/error.tsx`, `not-found.tsx`).

## 2. Projection delta

All query text is captured verbatim/expanded in `cms-audit/schema-inventory.json`; source fragments are `linkReference`, `linkFields`, `buttonFields`, and `pageBuilderExpansion` in `frontend/sanity/lib/queries.ts`.

| Query | Stored → returned delta |
|---|---|
| `settingsQuery` | `...` retains raw fields. Internal `link.page` reference becomes target `slug.current`, and `pageType` is computed from target `_type`. This happens in nav items, children, header CTA, footer columns, and footer-bottom links. `faviconUrl` is renamed/computed from `favicon.asset->url`. Other images remain reference objects. Selection is unordered settings `[0]`. |
| `getPageQuery` | Restricts top level to `_id`, `_type`, `name`, `slug`, `seo`, and projected `pageBuilder`. Raw top-level timestamps/revisions are omitted. Block-specific link mark definitions get computed `page`/`pageType`; buttons get link expansion; `serviceTabs.tabs[]` references are replaced by selected service fields; `testimonials.reviews[]` references are replaced by selected review fields. |
| `homepageQuery` | Same projection as `getPageQuery`, but hardcodes slug `homepage`. |
| `getServiceQuery` | Same block expansion; top level is `_id`, `_type`, `title`, `slug`, `heading`, `shortDescription`, `seo`, `pageBuilder`. Sticker/tab fields not explicitly selected are omitted. |
| `sitemapData` | Computes string `slug` from `slug.current` and boolean/null `noIndex` from `seo.noIndex`; retains `_type`, `_updatedAt`; sorts by type. |
| `pagesSlugs` | Replaces slug object with `{slug: string}`. |
| `serviceSlugs` | Replaces slug object with `{slug: string}`. |
| `servicesNavQuery` | Returns `_id`, `title`, and computed string `slug`; sorts title ascending. |

### Page-builder array projection details

- `callToAction.button`, hero CTA fields, feature CTA fields, banner/strip CTA fields, and nested CTA fields retain button data and resolve their nested internal link (`queries.ts`).
- `infoSection.content`, FAQ answers, contact description, feature-list body, and content-column body retain PT blocks while resolving each custom link mark definition (`queries.ts`).
- `serviceTabs.tabs[]->` returns `_id`, `title`, raw `slug` object, sticker `{asset,alt}`, `shortDescription`, tab image `{asset,crop,hotspot,alt}`, and resolved `tabCta` (`queries.ts`).
- `testimonials.reviews[]->` returns `_id`, quote, authorName, authorLabel, rating (`queries.ts`).
- Other live blocks use `...` and therefore retain stored field names and image reference/crop/hotspot objects.
- No normal page-builder image asset is dereferenced to URL/lqip/dimensions. Components receive asset `_ref` plus crop/hotspot and build URLs (`SanityImage.tsx`).

### Representative before/after sketch

```json
// stored page (abbreviated)
{
  "_id": "4422f53e-b3ae-4991-baa3-049fa1093329",
  "_type": "page",
  "_createdAt": "...",
  "name": "Homepage",
  "slug": {"_type": "slug", "current": "homepage"},
  "pageBuilder": [{
    "_type": "heroMarquee",
    "primaryCta": {"link": {"linkType": "page", "page": {"_ref": "target-id"}}}
  }]
}

// projected page (abbreviated)
{
  "_id": "4422f53e-b3ae-4991-baa3-049fa1093329",
  "_type": "page",
  "name": "Homepage",
  "slug": {"_type": "slug", "current": "homepage"},
  "seo": {},
  "pageBuilder": [{
    "_type": "heroMarquee",
    "primaryCta": {"link": {"linkType": "page", "page": "contact", "pageType": "page"}}
  }]
}
```

Top-level timestamps/revisions disappear; internal reference identity is replaced by route inputs. Evidence: `frontend/sanity/lib/queries.ts`.

## 3. Live block props contract

`PageBuilder.tsx` passes each projected block to `BlockRenderer.tsx`, which invokes the mapped component with `{block, index:number, pageId:string, pageType:string}`. `_key` and `_type` are always present in every live block. Images below mean `{_type?, asset:{_ref,_type?}, crop?, hotspot?, alt?}` unless stated otherwise. Buttons/links are post-projection objects whose internal reference has `page:string` and `pageType:string` instead of `_ref`.

### `spacer` — 18 live

Component: `frontend/app/components/sections/Spacer.tsx`.

| Field | As received | Optional live |
|---|---|---|
| size | string | no |

### `ctaBanner` — 7 live

Component: `frontend/app/components/sections/CtaBanner.tsx`.

| Field | As received | Optional live |
|---|---|---|
| heading | string | no |
| backgroundImage | image reference object | no |
| cta | resolved button object | yes (6/7) |
| alignment | string | yes (2/7) |
| subtext | string | yes (1/7) |
| ctaLink | legacy object, absent from current schema | yes (4/7) |
| ctaText | legacy string, absent from current schema | yes (4/7) |

### `heroMinimal` — 5 live

Component: `frontend/app/components/sections/HeroMinimal.tsx`.

All live instances receive `backgroundColor`, `eyebrow`, `heading`, `headingAccent`, and `subtext` as strings. None is optional in current live data.

### `featureCards` — 4 live

Component: `frontend/app/components/sections/FeatureCards.tsx`.

`darkMode:boolean`, `features:array`, `heading:string`, and `subheading:string` are present in all instances. `columns:number` is optional live (3/4). Each feature is retained by spread and may include its stored icon/image/title/description fields; the block-level `cta`, when stored, is resolved by `buttonFields` (`queries.ts`).

### `pricingCalculator` — 3 live

Component: `frontend/app/components/sections/PricingCalculator.tsx`; calculator data: `frontend/app/data/pricingData.ts`.

All instances receive `calculatorType:string`, `ctaLink:resolved link object`, `ctaText:string`, `displayMode:string`, `eyebrow:string`, `heading:string`, and `subheading:string`. CMS chooses the calculator/configuration; actual price data comes from code.

### `faqAccordion` — 3 live

Component: `frontend/app/components/sections/FaqAccordion.tsx`.

All instances receive `eyebrow:string`, `heading:string`, `faqs:array`, and legacy/parallel `items:array`. `faqs[].answer` is a PT array whose custom link mark definitions are resolved; the component renders it with bare `<PortableText>` and no custom components map.

### `splitContent` — 2 live

Component: `frontend/app/components/sections/SplitContent.tsx`.

All instances receive `backgroundColor:string`, `body:PT array`, `heading:string`, `image:image reference object`, and `imagePosition:string`. `hours:array` is optional live (1/2). A stored nested link would be resolved by the query. Body is rendered with bare Portable Text.

### One-instance live blocks

| Type / component | Exact fields present in live instance |
|---|---|
| `contactForm` / `sections/ContactForm.tsx` | address:string, contactAddress:string, contactEmail:string, contactPhone:string, email:string, fields:array, formFields:array, heading:string, hours:array, mapAddress:string, phone:string, showMap:boolean, successMessage:string |
| `heroMarquee` / `sections/HeroMarquee.tsx` | bubbleText:string, eyebrow:string, heading:string, headingAccent:string, marqueeImages:array of image objects, primaryCta:resolved button, secondaryCta:resolved button, subtext:string |
| `serviceCards` / `sections/ServiceCards.tsx` | cards:array (each CTA resolved), columns:number, description:string, heading:string, variant:string |
| `ctaStrip` / `sections/CtaStrip.tsx` | backgroundColor:string, cta:resolved button, heading:string, subtext:string |
| `statsBar` / `sections/StatsBar.tsx` | stats:array |
| `processSteps` / `sections/ProcessSteps.tsx` | backgroundColor:string, description:string, eyebrow:string, heading:string, steps:array |
| `valuePillars` / `sections/ValuePillars.tsx` | backgroundColor:string, columns:number, eyebrow:string, heading:string, pillars:array |
| `pricingPageTabs` / `sections/PricingPageTabs.tsx` | description:string, eyebrow:string, heading:string, services:array |

No field in the table above is optional in its sole current live instance. Nested inline shapes are preserved with `...` except explicit link expansions described in Section 2. Registered blocks with zero production usage are intentionally excluded.

## 4. Preview/editing coupling inventory

| File | Coupling |
|---|---|
| `frontend/sanity/lib/client.ts` | stega-enabled Sanity client |
| `frontend/sanity/lib/live.ts` | `defineLive`, `sanityFetch`, `SanityLive`, server/browser tokens |
| `frontend/sanity/lib/utils.ts` | `dataAttr` creation and image builder |
| `frontend/app/layout.tsx` | `sanityFetch`, `SanityLive` |
| `frontend/app/page.tsx` | `sanityFetch` |
| `frontend/app/[slug]/page.tsx` | `sanityFetch`, published perspective for params |
| `frontend/app/services/[slug]/page.tsx` | `sanityFetch`, published perspective for params |
| `frontend/app/sitemap.ts` | `sanityFetch` |
| `frontend/app/components/DraftModeToast.tsx` | `next-sanity/hooks` draft/presentation hooks |
| `frontend/app/components/PageBuilder.tsx` | `useOptimistic` and `dataAttr` |
| `frontend/app/components/BlockRenderer.tsx` | `dataAttr` block paths |
| `frontend/app/components/sections/ContactForm.tsx` | `stegaClean` plus Portable Text |
| `PolicyNotes.tsx`, `GalleryShowcase.tsx`, `ContentColumns.tsx`, `IconGrid.tsx`, `ServiceCards.tsx`, `HeroSplit.tsx`, `SplitContent.tsx`, `PricingMatrix.tsx`, `RequirementsList.tsx`, `GalleryGrid.tsx`, `LogoBar.tsx`, `WhatsIncluded.tsx`, `FeatureGrid.tsx`, `PricingList.tsx`, `ExpandingCardsRow.tsx`, `VideoSection.tsx`, `FeatureList.tsx`, `FullWidthMedia.tsx`, `ProcessSteps.tsx`, `HeroMinimal.tsx`, `HeroBanner.tsx`, `CtaStrip.tsx`, `ValuePillars.tsx`, `GalleryPage.tsx`, `Cta.tsx`, `GalleryCarousel.tsx` | `@sanity/client/stega` `stegaClean` calls |

No imports from `next-sanity/hooks` beyond `DraftModeToast.tsx` and `PageBuilder.tsx` were found (`rg` sweep).

## 5. Shared shell data

`RootLayout` concurrently fetches `settingsQuery` and `servicesNavQuery` (`frontend/app/layout.tsx`). It passes settings-derived nav items, CTA, logo, and fetched services to `Header.tsx`; footer columns/contact/tagline/copyright/social/logo fields to `Footer.tsx`; and emits tracking, verification, JSON-LD, and metadata from settings.

The live navigation item labeled exactly `Services` receives generated children from `servicesNavQuery` (boarding/daycare/grooming sorted by title) in `layout.tsx`. Other nav/footer links retain CMS order and their post-projection resolved-link objects. `settingsQuery` also returns `posUrls`, though direct shell consumption of every subfield is `NOT FOUND`.

Singleton warning: this contract is unstable at the source because `settingsQuery` selects unordered `[0]` while two materially different settings documents exist. Studio editing the pinned `siteSettings` document does not guarantee that the frontend reads the same document (`frontend/sanity/lib/queries.ts`; `studio/src/structure/index.ts`; read-only dataset snapshot).
