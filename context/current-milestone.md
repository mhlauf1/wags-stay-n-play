# Current Milestone

## Milestone 3: Core Pages — Homepage, About & Services

### Status
In Progress

### Goals
- Homepage: hero with facility photos, service cards, about teaser, hours, gallery, CTA
- About Us page (NEW): team grid, facility narrative, differentiators
- Daycare page: hero, 4 play yards, structured play, cat daycare, pricing calculator
- Boarding page: hero, 4 kennel tiers, cat boarding, daily schedule, pricing calculator
- Grooming page: hero, service categories (Full Groom, Bath & Works, Exit Bath, Cat), pricing calculator

### What's been done

#### Logo fix
- Updated Footer.tsx to reference new `wags-logo-no-bg.png`
- Removed stale logo files: `kingdom-logo.png`, `logo-no-bg.png`, `wags-logo.png`
- Header.tsx already had correct reference

#### GROQ query gaps fixed
- Added `teamGrid` and `valuePillars` block type expansions to `pageBuilderExpansion` in `queries.ts`

#### About page seeded (new for Wags)
- Created and published About page in Sanity (slug: `about`, ID: `a9fc51c5-e7bd-4f62-ab96-18c13c29aa52`)
- Sections: heroMinimal, splitContent (facility narrative), teamGrid (4 staff members), valuePillars (4 differentiators), ctaBanner
- Team photos not yet added (waiting on client photo ↔ name pairing)

#### Page verification
- All 8 pages return 200 and render correct Wags content
- Build passes clean (8 static pages generated)

### Still needed
- Visual QA in browser — verify design, spacing, colors across all pages
- Add nav link to About page in Sanity settings
- Facility photos for hero sections and service pages
- Team photos for About page (waiting on client)
- Any design tweaks identified during QA

### Definition of Done
- [ ] All core pages render correctly with Wags content
- [ ] About page live with team grid, narrative, differentiators
- [ ] No KC/HAFH references anywhere
- [ ] Logo displays correctly in header and footer
- [ ] Build passes clean
