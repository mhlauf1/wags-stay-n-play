# Current Milestone

## Milestone 2: Sanity Schema & Content Seeding

### Status
Complete

### Goals
- Rewrite all pricing data with Wags values (4 boarding tiers, cat services, punch cards)
- Update calculator components for Wags service structure
- Seed all Sanity content
- Deploy schema to cloud

### What was done

#### Pricing data (`pricingData.ts` — complete rewrite)
- Daycare: $29 full / $19 half / $18 cat, assessment day $20, 4 punch card packages (10/20/30/90-day unlimited $1,350)
- Boarding: 4 tiers (Standard $44, Junior $48, Queen $52, Master $57), cat $28, additional pet $5 discount, punch card info
- Grooming: 3 service types (Full Groom $65–$130, Bath & Works $55–$150, Exit Bath $18–$37), cat grooming display, 6 à la carte services ($8 each), exit bath add-ons ($5 each)
- Removed: KC's hair length dimension, doodle surcharge, teeth cleaning add-on, VIP suite

#### Calculator components
- DaycareCalculator: cat daycare option, 90-day unlimited, assessment info notice, punch card savings
- BoardingCalculator: 4 room types, $5 discount model, cat boarding info, punch card deals display
- GroomingCalculator: 3 service types (Full Groom / Bath & Works / Exit Bath), removed hair length and doodle toggle, cat grooming info, service-specific add-ons

#### Sanity content (8 documents seeded and published)
- Settings: full facility info, nav with services dropdown, footer, contact, social, local business structured data with Moorhead geo
- 3 services: Daycare, Boarding, Grooming (each with heroMinimal + featureCards + pricingCalculator + faqAccordion + ctaBanner)
- 4 pages: Homepage (heroMinimal + serviceCards + ctaStrip + splitContent with hours + statsBar + ctaBanner), Pricing (pricingPageTabs with 3 service tabs), Contact (contactForm with map + hours), New Clients (processSteps + featureCards requirements + ctaBanner)

#### Infrastructure
- Schema deployed to Sanity cloud
- Build passes clean

### Definition of Done
- [x] pricingData.ts fully rewritten with Wags pricing structure
- [x] All 3 calculators updated for Wags service model
- [x] All Sanity content seeded and published (8 documents)
- [x] Schema deployed to cloud
- [x] Build passes clean
