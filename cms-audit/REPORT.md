# Wags Stay N' Play — Sanity CMS Audit

1. Wags registers 3 regular document types, 1 settings singleton, and 48 object types (`studio/src/schemaTypes/index.ts`).
2. The machine inventory contains every registered field; no registered schema file was omitted (`cms-audit/schema-inventory.json`).
3. Three Portable Text configurations exist (`studio/src/schemaTypes/objects/blockContent.tsx`, `blockContentTextOnly.tsx`, `singletons/settings.tsx`).
4. Eight exported GROQ queries exist, all in `frontend/sanity/lib/queries.ts`.
5. Mechanical source diff against Kingdom found one added type and field-level variants in six existing files.
6. The documented parentage is supported, not contradicted: 44/47 parent object schema files and all shared infrastructure remain byte-identical or near-identical.
7. Production contains 5 pages, 3 services, 2 competing settings documents, 13 image assets, and no file assets (read-only GROQ, 2026-07-10).
8. Highest risk: Studio pins `siteSettings`, but the frontend selects unordered `*[_type == "settings"][0]` (`studio/src/structure/index.ts`; `frontend/sanity/lib/queries.ts`).
9. Second risk: live `ctaBanner` data contains legacy `ctaLink`/`ctaText` fields absent from the current schema (`studio/src/schemaTypes/objects/ctaBanner.ts`; dataset snapshot).
10. Third risk: five Portable Text render sites omit the custom link serializer defined in `frontend/app/components/PortableText.tsx`.

## Phase 0 — Repository orientation

The repository and package identify Wags Stay N' Play (`package.json`, `README.md`). The frontend uses Next 16.1.1, React 19.2.3, TypeScript 5.9.3, and the App Router (`frontend/package.json`, `frontend/app/`). Sanity dependencies include `sanity ^5.1.0`, `next-sanity ^12.0.5`, `@sanity/client ^7.13.2`, `@sanity/image-url ^1.2.0`, `@sanity/vision ^5.13.0`, `@sanity/assist ^5.0.3`, `sanity-image ^1.0.0`, and the Unsplash asset source (`frontend/package.json`).

Project configuration is project `3h90m8qu`, dataset `production`, API version `2025-09-25`; values come from `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and `NEXT_PUBLIC_SANITY_API_VERSION` (`frontend/.env.example`, `frontend/sanity/lib/api.ts`). Tokens are referenced only by variable name `SANITY_API_READ_TOKEN` (`frontend/sanity/lib/token.ts`). Studio exists both standalone and embedded (`studio/sanity.config.ts`, `frontend/sanity.config.ts`, `frontend/app/studio/[[...tool]]/page.tsx`).

Sanity-related paths: schemas and structure are under `studio/src/`; configs are `studio/sanity.config.ts`, `studio/sanity.cli.ts`, `frontend/sanity.config.ts`, and `frontend/sanity.cli.ts`; query/client/live/image helpers are under `frontend/sanity/lib/`; renderers are under `frontend/app/components/`; draft enablement is `frontend/app/api/draft-mode/enable/route.ts`.

`createClient` uses CDN reads, a read token, and stega configuration (`frontend/sanity/lib/client.ts`). `defineLive` supplies `sanityFetch` and `SanityLive` with server/browser tokens (`frontend/sanity/lib/live.ts`). Page routes are server components; static params explicitly use published perspective, while ordinary `sanityFetch` enables live refresh (`frontend/app/page.tsx`, `[slug]/page.tsx`, `services/[slug]/page.tsx`, `layout.tsx`). No numeric `revalidate` export was found.

## Phase 1 — Complete schema extraction

### Type census and parent drift

The full field-by-field census, including array members, validation, image hotspot flags, initial values, consumers, and unused status, is in `cms-audit/schema-inventory.json`. Registration is authoritative at `studio/src/schemaTypes/index.ts`.

| Kind | Count | Types | Parent result |
|---|---:|---|---|
| document | 3 | page, service, testimonial | Present in Kingdom; page/service variant only in allowed `photoMarquee` member |
| singleton | 1 | settings | Variant: Wags initial values/descriptions plus `ctmScriptUrl` |
| object | 48 | all entries in JSON `objectTypes` | 43 byte-identical source files; variants: ctaBanner, teamGrid, videoSection; photoMarquee added |

Mechanical evidence is `diff -qr studio/src/schemaTypes ../kingdom-canine/studio/src/schemaTypes`. It identified variants in `documents/page.ts`, `documents/service.ts`, `objects/ctaBanner.ts`, `objects/teamGrid.ts`, `objects/videoSection.ts`, `singletons/settings.tsx`, registry ordering, and the Wags-only `objects/photoMarquee.ts`. This strongly supports the documented clone parent; no evidence against parentage was found.

Notable exact Wags deltas:

- `page.pageBuilder` and `service.pageBuilder` add `photoMarquee` (`studio/src/schemaTypes/documents/page.ts`, `service.ts`).
- `ctaBanner.subtext` is added (`studio/src/schemaTypes/objects/ctaBanner.ts`).
- `teamGrid.columns` is number, choices 2/3/4, initial 3 (`studio/src/schemaTypes/objects/teamGrid.ts`).
- `videoSection.primaryCta` and `secondaryCta` are buttons (`studio/src/schemaTypes/objects/videoSection.ts`).
- `photoMarquee.marqueeImages` is an array of hotspot images with `alt`, minimum 3 (`studio/src/schemaTypes/objects/photoMarquee.ts`).
- `settings.ctmScriptUrl` is a string (`studio/src/schemaTypes/singletons/settings.tsx`).

### Portable Text

`blockContent` permits default block styles/lists/decorators, a custom `link` annotation, and hotspot image blocks (`studio/src/schemaTypes/objects/blockContent.tsx`). `blockContentTextOnly` is a bare block array (`studio/src/schemaTypes/objects/blockContentTextOnly.tsx`). `settings.description` explicitly disables styles, lists, and decorators while retaining the custom link annotation (`studio/src/schemaTypes/singletons/settings.tsx`). Exact configurations are recorded in JSON `portableTextConfigs`.

The custom renderer handles image blocks, h1/h2 anchors, and `marks.link` (`frontend/app/components/PortableText.tsx`). Only `InfoSection.tsx` and `Cta.tsx` use it. `SplitContent.tsx`, `FaqAccordion.tsx`, `FeatureList.tsx`, `ContentColumns.tsx`, and `ContactForm.tsx` import bare `PortableText` and pass no components map. Therefore the known lineage link-rendering defect remains structurally present.

### Settings singleton

Every settings field and its consumers are in JSON `settingsSingleton.fields`. Studio pins `_id == "siteSettings"` (`studio/src/structure/index.ts`). Frontend selection does not pin an ID (`frontend/sanity/lib/queries.ts`). Operational values consumed include metadata/JSON-LD/tracking in `frontend/app/layout.tsx`, navigation in `Header.tsx`, footer/contact/social data in `Footer.tsx`, and booking URLs passed through shell data.

Hardcoded operational values include the canonical production origin (`frontend/app/layout.tsx`, `robots.ts`, `sitemap.ts`), calculator prices (`frontend/app/data/pricingData.ts`), and public logo fallback (`frontend/public/images/wags-logo-no-bg.png`, `Header.tsx`, `Footer.tsx`).

## Phase 2 — Queries and consumption

All eight expanded query strings are captured in JSON `queries`; their source is `frontend/sanity/lib/queries.ts`.

| Query | Consumers | Core effect |
|---|---|---|
| settingsQuery | layout metadata and shell | spreads settings, resolves internal links, dereferences favicon URL; unordered settings `[0]` |
| getPageQuery | `/[slug]` | page identity/SEO plus expanded pageBuilder |
| homepageQuery | `/` | homepage slug special case plus same expansion |
| sitemapData | sitemap | computed slug/noIndex and update time |
| pagesSlugs | `/[slug]` static params | computed string slug |
| getServiceQuery | `/services/[slug]` | service identity/SEO plus expanded pageBuilder |
| serviceSlugs | service static params | computed string slug |
| servicesNavQuery | layout/header | sorted service title and computed slug |

The field usage matrix is represented per field by `consumedBy` and `unused` in `schema-inventory.json`. The dataset uses 15 block types; all remaining registered page-builder objects are dead in current live data. Draft mode is enabled by `frontend/app/api/draft-mode/enable/route.ts`, Presentation Tool config, `defineLive`, `DraftModeToast.tsx`, `PageBuilder.tsx`, and `BlockRenderer.tsx`. No `/api/revalidate` route was found; live refresh is handled by `defineLive` (`frontend/sanity/lib/live.ts`).

## Phase 3 — Assets and images

Queries normally preserve image references/crop/hotspot; the sole direct asset dereference is `favicon.asset->url` (`frontend/sanity/lib/queries.ts`). `SanityImage.tsx` supplies the Sanity CDN base to `sanity-image`, and section components pass width/crop/hotspot. OG images use width 1200, height 627, crop fit (`frontend/sanity/lib/utils.ts`). Lightbox URLs use width 1600 and auto format (`frontend/sanity/lib/image.ts`). The exact transform inventory is in JSON `imageTransforms`.

The schema generally adds per-image `alt` fields and hotspot where configured; components use CMS alt values with block-specific fallbacks. `HeroMarquee.tsx` now falls back to `Wags Stay N' Play`, not Boxers (`frontend/app/components/sections/HeroMarquee.tsx:92,260`). Public assets include `frontend/public/images/wags-logo-no-bg.png`, `frontend/public/illustrations/*`, and `frontend/app/icon.svg`. Production contains 13 image assets and zero Sanity file assets.

## Phase 4 — Structural and relational map

```text
settings --nav/footer/button links--> page | service
page --pageBuilder--> inline block objects
service --pageBuilder--> inline block objects
serviceTabs --tabs[]--> service
testimonials --reviews[]--> testimonial
blockContent/link/button --internal links--> page | service (scope varies by schema)
```

`/` selects page slug `homepage`; `/[slug]` maps page slugs; `/services/[slug]` maps service slugs (`frontend/app/page.tsx`, `[slug]/page.tsx`, `services/[slug]/page.tsx`). Both dynamic routes implement `generateStaticParams`.

Navigation is CMS-authored, but layout also injects fetched service children when the label is exactly `Services`; Wags live settings uses that label, so this lineage path is live (`frontend/app/layout.tsx`, dataset snapshot). SEO uses per-document `seo` objects with route fallbacks, then root settings defaults (`frontend/app/layout.tsx` and route files). Canonicals are hardcoded per route. Sitemap and robots are code-generated (`frontend/app/sitemap.ts`, `robots.ts`). No redirects were found in `frontend/next.config.ts`, middleware, or CMS schema.

## Phase 5 — Live dataset snapshot

Read-only queries ran against project `3h90m8qu`, dataset `production`, on 2026-07-10. Counts: page 5, service 3, settings 2, testimonial 0; 13 images; 0 files. Pages: homepage, about, contact, new-clients, pricing. Services: boarding, daycare, grooming. No content drafts were found; one `sanity.previewUrlSecret` draft is a system record. No orphaned content types were found. Four of seven live `ctaBanner` blocks include legacy `ctaLink`/`ctaText` fields absent from the current schema.

Live block counts are: spacer 18; ctaBanner 7; heroMinimal 5; featureCards 4; pricingCalculator 3; faqAccordion 3; splitContent 2; and one each of contactForm, heroMarquee, serviceCards, ctaStrip, statsBar, processSteps, valuePillars, pricingPageTabs.

### Settings integrity

| `_id` | created | updated | content |
|---|---|---|---|
| `aa441a64-cbec-43e1-bd7b-1ac637d0a119` | 2026-05-12T18:35:01Z | 2026-07-09T18:51:24Z | Full navigation, contact, footer, POS, social, tracking, and local-business content |
| `siteSettings` | 2026-05-12T18:43:47Z | 2026-05-12T18:44:00Z | Sparse title/logo plus default CTA/localBusiness objects |

The documents differ materially on nearly every operational field. No `drafts.*` settings variants exist. Studio pins `siteSettings`; frontend uses unordered `[0]`. This is diagnosis only; no fix or mutation was performed.

## Phase 6 — Migration risk register

| Priority | Severity | Flag | Evidence |
|---:|---|---|---|
| 1 | high | Competing settings documents and unordered frontend selection | `studio/src/structure/index.ts`; `frontend/sanity/lib/queries.ts`; Phase 5 snapshot |
| 2 | high | Live legacy fields outside current schema | `ctaBanner` dataset vs `studio/src/schemaTypes/objects/ctaBanner.ts` |
| 3 | medium | Custom PT links are unsupported at five render sites | `frontend/app/components/PortableText.tsx` and five bare section renderers |
| 4 | medium | Presentation/live editing coupling | `frontend/sanity/lib/live.ts`, `PageBuilder.tsx`, `BlockRenderer.tsx`, `DraftModeToast.tsx` |
| 5 | medium | Image transform behavior must be reproduced | `SanityImage.tsx`, `frontend/sanity/lib/image.ts`, `utils.ts` |
| 6 | medium | Wix extraction artifacts and inherited DNS context remain | `new-context/manifest.json`, `new-context/scripts/`, `context/project-overview.md` |
| 7 | low | Internal portfolio names remain in docs and schema descriptions | `AGENTS.md`, `CLAUDE.md`, `context/`, `splitContent.ts`, `settings.tsx` |

### Cross-contamination sweep

The exhaustive case-insensitive repository sweep found portfolio names/domains in governance and context documents (`AGENTS.md`, `CLAUDE.md`, `README.md`, `context/*.md`), and Embark examples/descriptions in `splitContent.ts` and `settings.tsx`. These are low severity because they are internal authoring text or intentional Embark footer content. Dataset footer content intentionally links Embark Pet Services. No other-brand name/domain/phone/address was found in a user-facing frontend fallback. Specifically, the prior Boxers fallback did not propagate: both fallback strings in `HeroMarquee.tsx` are Wags.

### Previous-owner infrastructure sweep

Wix references and URLs are concentrated in the retained content-extraction archive: `new-context/manifest.json`, `new-context/README.md`, and `new-context/scripts/{scrape-wix,download}.mjs`. Context documents state DNS/legacy hosting remains on Wix (`context/project-overview.md`, `current-milestone.md`). No Wix runtime dependency, redirect, middleware, or production frontend asset URL was found. Prior domain/previous-owner branding was `NOT FOUND` in runtime code or dataset.

## Evidence boundary

Claims about dataset contents are from read-only GROQ queries executed 2026-07-10. Claims about drift are from mechanical `diff` against `/Users/michaellaufersweiler/Desktop/lauf/dev/client-websites/kingdom-canine` and reference JSONs under `cms-audit/reference/`. No application, schema, dataset, DNS, or infrastructure changes were made.
