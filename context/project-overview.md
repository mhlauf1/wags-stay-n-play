# Project Overview

## What This Is

This is the website for **Kingdom Canine**, a pet daycare, boarding, grooming, and transportation facility located at 2549 Hogan Rd, Pacific, MO 63069. The site lives at **kingdomcanine.com**.

Kingdom Canine is one of ~10 facilities in the **Embark Pet Services** portfolio, a pet care roll-up platform operated by **Cadence Private Capital**. Lauf Studio (lauf.co) owns the design system, tech stack, and infrastructure for all Embark portfolio websites.

## Repository Origin

**This repo was cloned from the Home Away From Home codebase** (`mhlauf1/home-away-fargo` on GitHub), the most recent Embark site build. The git history was wiped for a clean start — this is its own repo (`mhlauf1/kingdom-canine`), not a GitHub fork.

### How this repo was created

```bash
git clone --depth 1 https://github.com/mhlauf1/home-away-fargo.git kingdom-canine
cd kingdom-canine
rm -rf .git
git init
git add .
git commit -m "Initial commit from Home Away From Home design system"
gh repo create mhlauf1/kingdom-canine --public --source=. --remote=origin --push
```

### What this means in practice

- The component library, page structures, layout patterns, and Sanity integration patterns all originated from the Hound Around / Home Away builds
- The design system (colors, fonts, spacing, illustrations) will be **reskinned** for Kingdom Canine — same bones, different skin
- Kingdom Canine is a simpler site than HAFH — no cat services, no multi-theme system, no webcams. The structure will be trimmed accordingly

### Critical rules for this repo

- **Never reference Home Away From Home or Hound Around in user-facing content.** No leftover copy, image alt text, meta tags, or comments mentioning HAFH, Fargo, Hound Around, Cottage Grove, or any other facility-specific details
- **Never hardcode other facility URLs, Sanity project IDs, or API keys.** All environment-specific values must come from `.env`
- **Preserve component architecture.** When modifying a component, keep the same prop interface and data-fetching pattern unless there is a clear reason to change it
- **Document any structural divergence.** If KC requires a component or page pattern the template doesn't have (e.g., transportation page), note it clearly so it can be backported to the template later

## The Embark Network Context

Kingdom Canine is the **fourth** website in the Embark portfolio:

- **Hound Around Resort** (houndaroundresort.com) — Live, design system origin
- **Boxers Bed & Biscuits** (boxersbedandbiscuits.com) — Live
- **Home Away From Home** (homeawayfargo.com) — Live, this repo's clone source
- **Kingdom Canine** (kingdomcanine.com) — This build
- **Wags Stay N Play** (Moorhead, MN) — In queue
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
| DNS | Cloudflare |
| CSS | Tailwind CSS v4 |
| Animations | Framer Motion |
| Fonts | Google Fonts |
| Domain Registrar | Cloudflare (already there — no transfer needed) |
| Email | GoDaddy M365 (already migrated) |

## Infrastructure Status

DNS recon complete. Kingdom Canine is the cleanest infrastructure picture in the portfolio:

- **Domain:** Registered at Cloudflare, DNS hosted on Cloudflare. No domain transfer needed.
- **Current hosting:** HighLevel (GoHighLevel). www CNAME → `sites.ludicrous.cloud`. At launch, update A + www CNAME to Vercel.
- **Email:** Already on M365 (`kingdomcanine-com.mail.protection.outlook.com`). SPF configured. No email migration needed.
- **POS:** Currently Gingr (`kingdomcanine.portal.gingrapp.com`). Transitioning to Goose — timeline TBD. POS portal lives on gingrapp.com domain, no DNS dependency on our side.
- **TXT records to preserve at launch:** Facebook domain verification, MS verification. Drop Mailgun SPF include (HighLevel artifact).

## Site Structure

Kingdom Canine is simpler than HAFH — Brian confirmed this is the simplest site in the portfolio. No cat services, no webcams, no about page narrative.

```
kingdomcanine.com/
├── / (Homepage)
├── /services/
│   ├── /daycare
│   ├── /boarding
│   ├── /grooming
│   └── /transportation (unique to KC — not in other Embark sites)
├── /pricing
├── /gallery (if photos arrive from Brian)
├── /new-clients (Get Started flow — custom form)
└── /contact
```

### Nav structure

- **Services dropdown:** Daycare · Boarding · Grooming · Transportation
- **Top-level:** Pricing · New Clients
- **CTA button:** Contact / Book a Visit

### Key differences from HAFH

- **Transportation page** — KC offers shuttle service to/from St. Louis and Franklin County. This is unique to KC and will need a new service page. Simple content: description + pricing + packages.
- **No cat services** — Remove cat-related schemas, pages, and pricing
- **No multi-theme system** — Single design direction for KC (no theme toggle widget)
- **No webcams page** — Remove webcam schemas and page
- **No about page** — Brian didn't include about/founder content; skip unless requested
- **Grooming pricing overhaul** — Current site hides prices behind "Contact us." New build has a full pricing matrix: baths (size × hair length), full grooms by size, à la carte services (ear cleaning, gland expression, nail trim, pad trim, teeth brushing), plus doodle/specialty surcharge. This is the biggest content shift.
- **VIP Luxury Suite** — New boarding tier at $150/night for 1–4 dogs. Needs a visual moment, not just another row in a table.
- **Daycare packages** — New structured packages (10/20/30 day) replacing the old flat-rate-only model.
- **POS transition** — Gingr → Goose is in progress. All POS URLs stored in a single Sanity site-settings doc so the swap is one update, not a code change.

### Page pattern (inherited from Embark design system)

Each service page follows a consistent component pattern:
1. Hero section (headline, description, photo, CTA buttons)
2. Feature/differentiator grid (icon cards highlighting key selling points)
3. Pricing section (table, matrix, or calculator — varies by service)
4. FAQ accordion (if applicable)
5. Bottom CTA band

Homepage: hero, services overview cards, stats counter, testimonials, CTA band.

## Content Status

### Have now (from Brian's pricing doc + current site)
- All new pricing data (daycare single visits + packages, boarding tiers including VIP, grooming matrix, transportation + packages)
- Hours of operation (Mon–Fri 6am–11am & 1pm–7pm, Sat–Sun 11am–4pm)
- Facility info (name, address, phone)
- Service descriptions (boarding "Pack Mentality" narrative, daycare, grooming packages, transportation)
- Facility stats (11,000 sqft turfed outdoor, 4,200 sqft indoor)
- Booking flow (Gingr portal — 3-step: create account → trial day → schedule)
- Brand language ("Pack Mentality", "Enjoy your vacay while your dog has a staycay")

### Waiting on
- **Photos from Brian** — he said he'd send "PICs shortly" but they haven't come through yet
- Logo files (current logo is hosted on HighLevel CDN — need source file or high-res version)
- Testimonials / reviews (none provided yet)
- Team info / staff bios (none provided)
- FAQ content (none provided beyond what's implied by current site)
- Vaccination / requirements info
- Email address for the facility (need to confirm what mailboxes exist under M365)
- Goose POS go-live date for KC

## Facility Quick Reference

- **Name:** Kingdom Canine
- **Address:** 2549 Hogan Rd, Pacific, MO 63069
- **Phone:** (314) 631-6738
- **Email:** TBD (confirm M365 mailboxes)
- **Service area:** St. Louis area and Franklin County, MO
- **Hours:** Mon–Fri 6am–11am & 1pm–7pm | Sat–Sun 11am–4pm
- **Play areas:** 11,000 sqft turfed outdoor, 4,200 sqft indoor
- **Booking:** Gingr Pet Parent App (portal: kingdomcanine.portal.gingrapp.com)
- **Services:** Dog daycare, dog boarding (Standard + VIP Luxury Suite), grooming, transportation
- **POS:** Gingr (transitioning to Goose — date TBD)