# Wags Stay N' Play — CMS Audit Protocol (complete, self-contained)

This is the Wags Stay N' Play repo — the fifth of seven portfolio audits. Completed so far: hound-around, home-away-fargo, boxers, kingdom-canine. This project is LIVE in production: strictly read-only per the ground rules below; the only writes permitted are the three deliverable files in `cms-audit/`.

Ask any clarifying questions before starting. Then run the full audit.

---

## MISSION

You are auditing this repository to produce a complete, evidence-based inventory of its Sanity CMS implementation. This inventory will be used to design a custom CMS that replaces Sanity across a portfolio of pet-care websites, migrating one site at a time. The custom CMS will store rich text in the Portable Text format, so pay special attention to exactly how Portable Text is configured and rendered.

The repositories in this portfolio share a clone lineage: Hound Around → HAFH → Kingdom Canine → Wags → Riverside, with Boxers as a sibling branch off Hound Around. Schemas are expected to be largely shared with per-site drift. Your inventory must be precise enough that a later synthesis pass can diff your output against six other inventories and identify the canonical core schema versus per-site divergence. **Consistency of output format matters as much as completeness.**

**CLONE PARENT IS KNOWN: kingdom-canine.** Do not re-determine it. Record it in the JSON as `"cloneParent": { "determined": "kingdom-canine", "confidence": "documented", "evidence": ["stated lineage"] }` — but if mechanical diffing produces strong evidence AGAINST this parentage, flag it prominently rather than suppressing it.

## GROUND RULES

1. **Read-only.** Do not modify, create, or delete any file in the repository except the three deliverable files specified in the Deliverables section.
2. **Evidence only.** Every claim in your report must cite a file path (and line numbers where useful). If you cannot find evidence for something, write `NOT FOUND` — never infer, assume, or fill gaps from general knowledge of how Sanity projects "usually" work. An accurate `NOT FOUND` is more valuable than a plausible guess.
3. **Exhaustive, not representative.** Do not sample. Every schema file, every field, every GROQ query. If a schema has 40 fields, list 40 fields.
4. **Flag uncertainty explicitly.** If something is ambiguous (e.g., a field that exists in schema but you can't determine if the frontend uses it), mark it `UNCERTAIN` with a note explaining why.
5. **Do not editorialize on the CMS design.** Your job is inventory, not architecture recommendations. There is one exception: the Migration Risk Flags section, where judgment is requested.
6. **Drift by diff, not inspection.** Reference inventories are provided at `cms-audit/reference/kingdom-canine-schema-inventory.json` and `cms-audit/reference/home-away-fargo-schema-inventory.json` (the sibling repos are also on disk under `../` if file-level diffs are needed). Every match/divergence claim must be established mechanically — SHA or diff against the parent — never characterized from memory.

---

## PHASE 0 — Repo Orientation

Establish the lay of the land before extracting anything.

Report:

- Repo name, and the site/brand it serves (check package.json, README, metadata, env examples)
- Framework and versions: Next.js version, App Router vs Pages Router, TypeScript config
- Sanity dependencies and versions: `sanity`, `next-sanity`, `@sanity/image-url`, `@portabletext/react`, `@sanity/vision`, any others
- Sanity project configuration: project ID, dataset name(s), API version(s) used. Check `sanity.config.ts`, `sanity.cli.ts`, client setup files, and `.env.example` / env references. **Do not print actual secret values** — record variable names only (e.g., `SANITY_API_TOKEN` referenced in `frontend/sanity/lib/client.ts`).
- Is Sanity Studio embedded in this repo (e.g., a `studio/` workspace or `/studio` route) or hosted separately? Where is the studio config?
- Directory map of everything Sanity-related: schema folders, client/query files, portable text components, image helpers, webhook/revalidation routes.
- Rendering strategy: which pages are static, ISR (with what revalidate values), or dynamic. How does content get from Sanity to the page (server components, `sanityFetch`, CDN vs uncached client, draft/preview mode)?

## PHASE 1 — Complete Schema Extraction

This is the core of the audit. For **every** schema type registered in the Sanity config:

### 1a. Type census

A table of all types: name, title, kind (`document` / `object` / singleton document), file path, and whether it appears in the Studio structure/desk config (and if singletons are enforced, how). For each type, state whether it is byte-identical to, variant of, or absent from the kingdom-canine parent — established by mechanical diff.

### 1b. Field-by-field breakdown

For each type, list every field with:

- Field `name` and `title`
- Field `type` (and for arrays: the full list of member types, including inline anonymous object definitions — expand those fully)
- Required/validation rules (exact rule: `required()`, `min`, `max`, `regex`, custom validators — quote custom validator logic)
- `initialValue` if present
- For `reference` fields: which type(s) they point to, and whether `weak`
- For `image` fields: is `hotspot` enabled? Are there fields on the image (alt, caption)?
- For `slug` fields: source field and any slugify customization
- For `array` of blocks (Portable Text): see Phase 1c — mark the field and cross-reference
- Hidden/readOnly/conditional fields (`hidden`, `readOnly`, conditional callbacks — quote the condition)
- Field groups/fieldsets and orderings if defined
- `preview` config on the type (select fields, prepare logic)

### 1c. Portable Text deep-dive

For every Portable Text field found (any `array` containing `block`):

- Enabled `styles` (normal, h1–h6, blockquote, custom)
- Enabled `lists`
- Enabled `decorators` (strong, em, custom)
- **Annotations** (links, internal links, etc.) — full object definition of each
- **Custom block members** — every non-`block` type allowed in the array (inline images, CTAs, embeds, etc.) with full definitions
- Where and how each PT field is **rendered** on the frontend: which component file, the full `components` map passed to `<PortableText>` (custom marks, types, blocks), and any serialization quirks
- **Known lineage defect to check:** in Hound Around, only one PT renderer had a components map resolving the custom link annotation; five other render sites rendered bare `<PortableText>`, silently breaking links. Check every PT render site here for the same defect.

This section determines whether the custom CMS's Portable Text config can be shared portfolio-wide, so absolute completeness here is critical.

### 1d. The settings singleton

The portfolio convention stores operational values in a settings singleton (POS/booking URLs, GTM ID, CTM script URL, phone, address, hours, social links, etc.). Document this singleton exhaustively: every field, and — importantly — **where each field is consumed in the frontend** (file paths). If any operational values are hardcoded in the frontend instead of living in the singleton (tracking IDs, booking URLs, phone numbers, addresses, logo image paths), flag each instance with its file path — these are migration cleanup items. (Known lineage pattern: Kingdom's logo was hardcoded at `/images/kingdom-logo.png` while the CMS logo field went unconsumed — check for the equivalent here.)

## PHASE 2 — Query & Consumption Analysis

Map how the frontend actually uses the schema:

- Every GROQ query in the repo: file path, the full query text **verbatim**, which page/component uses it, and which document types/fields it touches
- Fetch configuration per query: CDN usage, caching/revalidate tags, perspective (published vs previewDrafts)
- **Field usage matrix:** for each document type, which fields are actually queried/rendered vs. defined-but-never-consumed. Dead fields matter — they may be drift artifacts from the clone lineage that shouldn't migrate.
- Draft/preview mode: is it implemented? How (route handlers, `draftMode()`, presentation tool)?
- Webhooks and revalidation: any `/api/revalidate` routes, what triggers them, tag- vs path-based revalidation, secret handling (variable names only)

## PHASE 3 — Asset & Image Pipeline Analysis

- How images are queried (asset refs, `->` dereferencing, metadata like `lqip`/dimensions)
- The image URL builder setup (`@sanity/image-url` config) and **every distinct transform pattern used** across the codebase: widths, heights, fit modes, crops, quality, format params, srcset generation
- Hotspot/crop usage: which components respect hotspot data
- Alt text handling: schema-level alt fields vs hardcoded alts vs missing alts
- Any non-image file assets (PDFs, documents) stored in Sanity
- Any images served from outside Sanity (public folder, external URLs) that a migration would need to account for

## PHASE 4 — Structural & Relational Map

- A reference graph: which document types reference which (text-form diagram is fine)
- Slug/routing model: how document slugs map to URL paths, including nested routes, the homepage special case, and any `generateStaticParams`
- Navigation/menu modeling: CMS-driven or hardcoded? (Lineage note: HAFH had a dead "Services" magic-label nav-injection path superseded by CMS-authored children — check which path is live here.)
- SEO/meta modeling: how page titles, meta descriptions, OG images, canonical URLs, and structured data are sourced. Per-document SEO objects? A shared SEO object type? Defaults from settings? Document the full fallback chain. (Lineage defects to check: HAFH double-appended the site name to titles via metaTitle values that already contained the suffix; Hound Around emitted raw asset `_ref` strings as JSON-LD image URLs.)
- Redirects: any redirect handling in next.config, middleware, or CMS
- Sitemap and robots generation: source of truth

## PHASE 5 — Live Dataset Snapshot (run only if a Sanity token/CLI auth is available; otherwise mark section `SKIPPED — NO CREDENTIALS`)

Using the Sanity CLI or HTTP API (strictly read-only queries):

- Document count per type: `*[_type == $type] | count` (or `array::unique(*[]._type)` first to catch types in the dataset that no longer exist in schema — **flag any orphaned types**, they're migration landmines)
- Count of drafts per type
- Total asset count and approximate dataset size if available
- Sample one document per type (truncate very long PT bodies to structure + first block)
- Any documents whose shape doesn't match the current schema (fields present in data but absent from schema definitions)

### 5b. SETTINGS SINGLETON INTEGRITY CHECK (mandatory, part of Phase 5)

This is a confirmed lineage defect — HAFH's settings lived at a UUID instead of the pinned ID, and Kingdom had two competing settings documents selected by unordered `[0]`. For this repo:

- Query ALL documents of the settings type, including `drafts.*` variants
- Report each document's `_id`, `_createdAt`, `_updatedAt`, and whether content differs between them (field-by-field diff if more than one exists)
- State which `_id` the Studio structure pins as the singleton, and whether the frontend query pins an `_id` or uses unordered `[0]`
- **Diagnosis only — no fixes in this session.**

## PHASE 6 — Migration Risk Flags

The one section where judgment is requested. List, in priority order, everything in this specific repo that will make migration to a custom CMS harder than a straight data copy. Candidates to consider (only include what actually applies, with evidence):

- Custom Portable Text marks/blocks that need bespoke editor support
- Sanity-specific features in use: presentation tool, scheduled publishing, cross-dataset references, translations/i18n, custom input components, document actions, initial value templates
- Frontend coupling to Sanity internals: `_id`/`_ref` formats in URLs or keys, `_createdAt`/`_updatedAt` displayed to users, direct dependence on Sanity CDN URLs stored anywhere outside Sanity
- Image transform patterns that the replacement pipeline must reproduce exactly
- Anything else you judge to be a real risk, with file-path evidence

### 6b. CROSS-CONTAMINATION SWEEP (mandatory)

Search the entire repo for other portfolio brand names, domains, phone numbers, addresses, and asset references — Hound Around, Home Away From Home, Boxers, Kingdom Canine, Riverside, Rio, Embark — appearing in fallbacks, alt text, copy, metadata, or config. Every hit is a risk-register entry with severity based on whether it can surface to users. **Known lineage defect to check specifically:** `HeroMarquee.tsx` carried "Boxers Bed & Biscuits" fallback alt strings in both HAFH and Kingdom — check whether it propagated here.

### 6c. PREVIOUS-OWNER INFRASTRUCTURE SWEEP (Wags-specific)

This site's DNS still sits on Wix nameservers inherited from the previous owner. Flag any references to Wix, prior domains, previous-owner branding, legacy redirects, or inherited infrastructure in the codebase, config, and dataset.

## PHASE 7 — Render Contract

Purpose: we are building a content adapter that must return page data in exactly the shape the frontend components receive today, so the audit must capture the POST-PROJECTION contract, not just the schema. Output as `cms-audit/render-contract.md`. Document:

1. **ROUTING MAP** — every route in the app directory: the route file, which GROQ query feeds it, how slugs map to documents (including the homepage special case and any `generateStaticParams`), and any route that renders something other than the page-builder pattern.
2. **PROJECTION DELTA** — for each GROQ query: what the projection changes versus the raw stored document. Every dereference (image assets: which fields get expanded — url, lqip, dimensions?), every reference expansion (links to pages: which fields of the target come back?), renamed/computed fields, and array projections inside pageBuilder blocks. Show a before/after JSON sketch for one representative page document.
3. **BLOCK PROPS CONTRACT** — for each LIVE block type (nonzero usage in THIS repo's dataset), the exact resolved props shape its component receives: field name, type as-received (e.g. "image object with asset.url + lqip", "resolved href string", "PT array"). Note which props are optional in practice based on live data.
4. **PREVIEW/EDITING COUPLING INVENTORY** — every file importing from `next-sanity/hooks`, stega utilities, `dataAttr`, or `sanityFetch`'s live features, so we know the exact surface area that gets deleted at migration.
5. **SHARED SHELL DATA** — what `layout.tsx` and any shared components (nav, footer) fetch, from which documents, with which projections (this is where the settings singleton is consumed).

Precision on shapes matters more than prose — this becomes the spec the adapter is built against.

---

## DELIVERABLES

Produce exactly three files (these are the only writes permitted):

### 1. `cms-audit/schema-inventory.json`

Machine-readable inventory for the cross-repo synthesis pass. Shape (top-level keys and the field-object shape must match the reference inventories exactly):

```json
{
  "repo": "wags-stay-n-play",
  "site": "Wags Stay N' Play",
  "auditDate": "<ISO date>",
  "model": "<the model identifier running this audit>",
  "cloneParent": {
    "determined": "kingdom-canine",
    "confidence": "documented",
    "evidence": ["stated lineage"]
  },
  "sanity": {
    "projectId": "<id>",
    "dataset": "<name>",
    "apiVersion": "<version>",
    "studioEmbedded": true,
    "dependencies": { "sanity": "x.y.z", "next-sanity": "x.y.z" }
  },
  "framework": { "next": "x.y.z", "router": "app" },
  "documentTypes": [
    {
      "name": "",
      "title": "",
      "singleton": false,
      "file": "path/to/schema.ts",
      "fields": [
        {
          "name": "",
          "title": "",
          "type": "",
          "of": [],
          "to": [],
          "required": false,
          "validation": "",
          "hotspot": null,
          "hidden": null,
          "initialValue": null,
          "consumedBy": ["path/to/component.tsx"],
          "unused": false,
          "notes": ""
        }
      ]
    }
  ],
  "objectTypes": [ /* same field shape as documentTypes entries */ ],
  "portableTextConfigs": [
    {
      "location": "documentType.fieldName",
      "styles": [],
      "lists": [],
      "decorators": [],
      "annotations": [],
      "customBlocks": [],
      "rendererFile": "",
      "customComponents": []
    }
  ],
  "queries": [
    { "file": "", "usedBy": "", "types": [], "fields": [], "groq": "" }
  ],
  "imageTransforms": [
    { "pattern": "", "files": [] }
  ],
  "settingsSingleton": {
    "typeName": "",
    "fields": [ /* field shape */ ],
    "hardcodedValuesThatBelongHere": [
      { "value_description": "", "file": "" }
    ]
  },
  "seoModel": { "description": "", "fallbackChain": [] },
  "subSite": null,
  "dataset_snapshot": {
    "skipped": false,
    "documentCounts": {},
    "orphanedTypes": [],
    "schemaDataMismatches": []
  },
  "riskFlags": [
    { "severity": "high|medium|low", "flag": "", "evidence": "" }
  ]
}
```

If the reference inventories contain keys beyond this sketch, match the references — they are the compatibility target.

### 2. `cms-audit/REPORT.md`

The human-readable report following the phase structure above (Phase 0 → 6, including 5b, 6b, 6c), with all tables, the field usage matrix, and the reference graph. Begin with a ten-line executive summary: type counts, PT field count, drift vs parent, and the top three risk flags.

### 3. `cms-audit/render-contract.md`

Per Phase 7.

---

## MANDATORY SELF-VERIFICATION BEFORE REPORTING DONE

1. Diff your `schema-inventory.json`'s top-level keys and field-object shape against BOTH reference inventories — they must match exactly, plus `cloneParent`. Fix any drift before reporting.
2. Re-open two of your captured GROQ queries against the source files and confirm they match verbatim (hash comparison acceptable).
3. Confirm every reference path you diffed against resolves to the completed checkouts.

State in your final summary that all three checks passed, with evidence.

## FINAL CHECK

- [ ] Every schema file in the repo appears in the inventory (cross-check against the types registered in the Sanity config — flag any schema files that exist but aren't registered)
- [ ] Every field of every type is listed — no "etc.", no "and similar fields"
- [ ] Every GROQ query is captured verbatim
- [ ] Every claim has a file path
- [ ] Anything not found is marked `NOT FOUND`, not guessed
- [ ] JSON validates and matches the reference inventories' shape
- [ ] All three self-verification checks passed and are evidenced in the final summary
