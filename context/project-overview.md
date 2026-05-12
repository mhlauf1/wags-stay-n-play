# Project Overview

## What This Is

This is the website for **Wags Stay N' Play**, a locally-owned dog and cat daycare, boarding, and grooming facility located at 1601 Main Ave SE, Moorhead, MN 56560. The site lives at **wagsstaynplay.com**.

Wags Stay N' Play is one of ~10 facilities in the **Embark Pet Services** portfolio, a pet care roll-up platform operated by **Cadence Private Capital**. Lauf Studio (lauf.co) owns the design system, tech stack, and infrastructure for all Embark portfolio websites.

## Repository Origin

**This repo was cloned from the Kingdom Canine codebase** (`mhlauf1/kingdom-canine`), the most recent Embark site build. The git history was wiped for a clean start — this is its own repo (`mhlauf1/wags-stay-n-play`), not a GitHub fork.

### What this means in practice

- The component library, page structures, layout patterns, and Sanity integration patterns all originated from the Embark design system (Hound Around → HAFH → Kingdom Canine → this repo)
- The design system (colors, fonts, spacing, illustrations) has been **reskinned** for Wags — same bones, different skin
- Wags has some features KC didn't (cat services, about page, assessment process) and drops some KC had (transportation)

### Critical rules for this repo

- **Never reference Kingdom Canine, Home Away, or Hound Around in user-facing content.** No leftover copy, image alt text, meta tags, or comments mentioning KC, Pacific MO, HAFH, Fargo, Hound Around, Cottage Grove, or any other facility-specific details
- **Never hardcode other facility URLs, Sanity project IDs, or API keys.** All environment-specific values must come from `.env`
- **Preserve component architecture.** When modifying a component, keep the same prop interface and data-fetching pattern unless there is a clear reason to change it
- **Document any structural divergence.** If Wags requires a component or page pattern the template doesn't have (e.g., assessment flow, cat services), note it clearly so it can be backported to the template later

## The Embark Network Context

Wags Stay N' Play is the **fifth** website in the Embark portfolio:

- **Hound Around Resort** (houndaroundresort.com) — Live, design system origin
- **Boxers Bed & Biscuits** (boxersbedandbiscuits.com) — Live
- **Home Away From Home** (homeawayfargo.com) — Live
- **Kingdom Canine** (kingdomcanine.com) — Live, this repo's clone source
- **Wags Stay N' Play** (wagsstaynplay.com) — This build
- **Canine Country Club** (West Des Moines, IA) — Migration only, no rebuild
- **Barks & Rec** (Hastings, MN) — Future
- **Rio Grooming School & Salon** — Future

## Tech Stack

| Category | Choice |
|----------|--------|
| Framework | Next.js (React 19) |
| Language | TypeScript |
| CMS | Sanity.io |
| Hosting | Vercel |
| DNS | TBD (investigate current registrar) |
| CSS | Tailwind CSS v4 |
| Animations | Framer Motion |
| Fonts | Google Fonts |
| Current site platform | Wix |
| Email | office@wagsstaynplay.com |

## Infrastructure Status

- **Domain:** wagsstaynplay.com — current registrar TBD, DNS currently points to Wix
- **Current hosting:** Wix. At launch, update DNS to point to Vercel
- **Email:** office@wagsstaynplay.com — need to confirm provider and ensure MX records are preserved at launch
- **POS:** Transitioning to Goose — timeline TBD. Current booking system unknown (no Gingr portal observed on current site)
- **Social:** Facebook (facebook.com/wagsstaynplay)

## Site Structure

Wags is a straightforward facility site. Services include dogs AND cats (unlike KC which was dogs-only). No transportation. Has an about page and assessment process.

```
wagsstaynplay.com/
├── / (Homepage)
├── /about (About Us — team, story, facility)
├── /services/
│   ├── /daycare (dogs + cats)
│   ├── /boarding (4 kennel sizes + cat boarding)
│   └── /grooming (dogs + cats)
├── /pricing (Rates overview)
├── /new-clients (Getting Started — assessments, breakaway collars, forms)
├── /gallery (facility photos)
└── /contact
```

### Nav structure

- **Services dropdown:** Daycare · Boarding · Grooming
- **Top-level:** Pricing · About · New Clients
- **CTA button:** Contact

### Key differences from Kingdom Canine

- **Cat services** — Wags serves dogs AND cats (daycare, boarding, grooming). KC was dogs-only. Cat services are integrated into each service page, not separate pages.
- **No transportation** — KC had a shuttle service; Wags does not
- **About Us page** — Wags has a team page with 4 staff members and a facility narrative. KC skipped this.
- **Assessment process** — All dogs must pass an assessment before daycare/boarding. $20, Mon-Thu 10am-2pm, minimum 4 hours. This is a unique onboarding flow.
- **Breakaway collars** — Required for all daycare/boarding dogs. Dedicated section in Getting Started.
- **4 boarding kennel sizes** — Standard, Junior Suite, Queen Suite, Master Suite (KC had Standard + VIP only)
- **Punch cards** — Daycare and boarding use punch card packages (buy X get Y free) in addition to standard bulk discounts
- **Structured play increments** — 2-hour play rotations (9-11, 11-1, 1-3, 3-5) with mandatory naps between
- **4 separate play yards** — Dogs grouped by play style and size
- **No multi-theme system** — Single design direction (tan/burgundy palette)

### Page pattern (inherited from Embark design system)

Each service page follows a consistent component pattern:
1. Hero section (headline, description, photo, CTA buttons)
2. Feature/differentiator grid (icon cards highlighting key selling points)
3. Pricing section (table, matrix, or calculator — varies by service)
4. FAQ accordion (if applicable)
5. Bottom CTA band

Homepage: hero, services overview cards, about teaser, hours, gallery, stats, CTA band.

## Content Status

### Have now (from Wix scrape + current site)
- All current pricing data (daycare, boarding 4 tiers, grooming with cat services)
- Hours of operation (Mon-Sat 6:30am-7pm, Sunday 8am-12pm & 2pm-6pm)
- Facility info (name, address, phone, email)
- Service descriptions (daycare, boarding daily schedule, grooming packages)
- Team info (4 staff members — Cindy Holtan Manager, Whitney Nelson Grooming Manager, Akaysha Delzer Assistant Manager, Ashley Harn Grooming Associate)
- Assessment process details
- Breakaway collar requirement info
- 12 homepage gallery photos from Wix
- 6 team photos (names need re-pairing — Wix filenames scrambled)
- 5 assessment gallery photos
- Facility/boarding hero photos
- 4 downloadable forms (2 PDF registration forms, 2 DOCX policies/waiver)
- About Us narrative copy
- Facebook page link

### Waiting on / Need to confirm
- **Logo source file** — current logo is Wix-hosted, need vector/high-res
- **Team photo ↔ name pairing** — Wix filenames don't match team member names
- **Goose POS go-live date** — determines booking URLs and final pricing
- **Updated pricing from Goose** — current Wix prices are baseline, will be replaced
- **Training status** — meta description claims training but no page exists. Assumed dropped.
- **Hours confirmation** — hours on homepage but not contact page, verify current
- **Waiver document** — file named "meds and add ins.docx" may be mislabeled

## Facility Quick Reference

- **Name:** Wags Stay N' Play
- **Address:** 1601 Main Ave SE, Moorhead, MN 56560
- **Phone:** (218) 287-2000
- **Email:** office@wagsstaynplay.com
- **Service area:** Moorhead, MN / Fargo-Moorhead metro
- **Hours:** Mon-Sat 6:30am-7pm | Sunday 8am-12pm & 2pm-6pm
- **Play areas:** 4 separate play yards (indoor/outdoor)
- **Booking:** TBD (Goose POS transition)
- **Services:** Dog & cat daycare, dog & cat boarding (4 kennel sizes), dog & cat grooming
- **POS:** Transitioning to Goose — date TBD
- **Social:** Facebook (facebook.com/wagsstaynplay)
- **Locally owned**
