# Milestones

## Overview

The Wags Stay N' Play website is built in milestones, not features. Each milestone represents a meaningful, deployable chunk of work. The site should be viewable on Vercel after every milestone.

Wags is a straightforward facility site with some unique features (cat services, assessment process, 4 kennel sizes). The milestone plan reflects the standard Embark build cadence.

---

## Milestone 1: Foundation & Cleanup

**Status:** In Progress
**Branch:** `feature/foundation`

### Goals
- Strip all Kingdom Canine-specific content, images, and references from the cloned codebase
- Connect new Sanity project and set up environment
- Update all meta tags, site title, phone numbers for Wags Stay N' Play
- Establish tan/burgundy color palette
- Rewrite all context files for Wags
- Remove transportation service content

### What was done
- All KC text references replaced with "Wags Stay N' Play" across source files
- KC phone number (314-631-6738) replaced with Wags phone (218-287-2000)
- Logo references updated from kingdom-logo.png to wags-logo.png
- Site URL updated to wagsstaynplay.com
- package.json name updated to "wags-stay-n-play"
- Color palette replaced: KC purple/gold → Wags tan/burgundy
- All context files rewritten for Wags
- Transportation service content removed
- Sanity configs updated

### Still needed
- New Sanity project created and connected
- Logo file (waiting on source from client)

---

## Milestone 2: Sanity Schema & Content Seeding

**Status:** Complete (on branch `content/sanity-seed`)
**Branch:** `content/sanity-seed`

### Goals
- Rewrite all pricing data with Wags values (4 boarding tiers, cat services, punch cards)
- Update calculator components for Wags service structure
- Seed all Sanity content
- Deploy schema to cloud

### What was done
- pricingData.ts completely rewritten: daycare (full/half/cat + 4 punch cards + assessment), boarding (4 tiers + cat + $5 discount + punch cards), grooming (3 service types + cat display + à la carte)
- All 3 calculator components updated for Wags service structure
- 8 Sanity documents seeded and published (settings, 3 services, 4 pages)
- Schema deployed to cloud
- Build passes clean

---

## Milestone 3: Core Pages — Homepage, About & Services

**Status:** Not Started
**Branch:** `feature/core-pages`

### Goals
- Homepage: hero with facility photos, service cards, about teaser, hours, gallery, CTA
- About Us page (NEW): team grid, facility narrative, differentiators
- Daycare page: hero, 4 play yards, structured play, cat daycare, pricing calculator
- Boarding page: hero, 4 kennel tiers, cat boarding, daily schedule, pricing calculator
- Grooming page: hero, service categories (Full Groom, Bath & Works, Exit Bath, Cat), pricing calculator

---

## Milestone 4: Supporting Pages & New Clients Flow

**Status:** Not Started
**Branch:** `feature/supporting-pages`

### Goals
- New Clients / Getting Started: assessment process, vaccination requirements, breakaway collars, downloadable forms
- Pricing page: comprehensive pricing overview with all services
- Contact page: form, Google Maps, hours, phone/email
- Gallery page: facility photos from Wix scrape

---

## Milestone 5: Polish & Launch Prep

**Status:** Not Started
**Branch:** `feature/polish`

### Goals
- SEO optimization (meta tags, structured data, sitemap.xml, robots.txt)
- Performance audit (Lighthouse 90+ all categories)
- Accessibility audit (WCAG AA compliance)
- Cross-browser testing
- Custom 404 page
- Final content review
- Vercel deployment
- DNS cutover plan (Wix → Vercel)
- POS coordination (Goose timeline)
