# Current Milestone

## Milestone 5: Polish & Launch Prep

### Status

In Progress

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

### What's been done

#### Client feedback round 1 (in progress)

- Branch: `content/client-feedback-round-1`
- Code: removed duplicate Cat Nail Trim from the dog à la carte list in `pricingData.ts`; calculator cat box retitled "Cat Services"
- Sanity (published 2026-10-01): play areas corrected to 4 indoor + 3 outdoor everywhere; hours changed to Mon–Fri 6:30 AM–7 PM, Sat–Sun 9 AM–12 PM & 2–5 PM (homepage, contact, daycare FAQ, LocalBusiness structured data, About pillar); email changed to wagsstaynplaymn@gmail.com (settings + contact block); assessment rule now covers new clients and clients inactive 6+ months, clarifies that only the dog stays 4 hours and that registration paperwork is required; spay/neuter changed to "by 9 months"; cat vaccines now include a negative FeLV test; final potty time removed; "Supervised Around the Clock" replaced with "Kuranda Beds & Clean Kennels"; mobile grooming, optional trimming, puppy package, and senior package removed; cat grooming limited to baths and nail trims; grooming days (Mon/Tue/Wed/Fri) and the grooming vaccine requirement added; "Individual Services" renamed "Walk-In Nail Trims & Add-Ons"; new Vaccine Requirements section on /new-clients; About CTA heading changed; Gallery footer link removed; Cat Nail Trim removed from the pricing page à la carte table
- Code: hero accent lines (HeroMinimal `headingAccent`, HeroMarquee accent span) now match the main heading's color, size, and weight. The client read the two-tone hero headings as "two different fonts". **Template divergence note:** other Embark sites still use the two-tone accent.
- Pending: photo handoff (client can send photos or wait for Impact team handoff)

#### Client feedback round 2

- Branch: `content/client-feedback-round-2`
- Sanity (published 2026-10-01): Goose account link (`https://booking.goose.pet/wags-stay-n-play/search/boarding/pets`) set as `settings.posUrls.registrationUrl`, added as a "Create Your Account" button on the /new-clients CTA banner, and referenced in assessment Step 1; new grooming FAQ "Do you offer mobile grooming?" refers clients to Home Away From Home's grooming page (client-requested cross-referral, an intentional exception to the no-sister-site rule)
- Code: FaqAccordion now renders Portable Text link annotations (previously dropped). **Template divergence note:** backport to other Embark sites.
- Confirmed by client: grooming vaccines match daycare/boarding (no change needed)
- HAFH Sanity (published 2026-10-01): weekend boarding pickup cutoff changed 1:30 PM → 12:00 PM (boarding FAQ, boarding policy content, pricing footnote)
- Pending: Vercel `CONTACT_FORM_TO_EMAIL` → `wagsstaynplaymn@gmail.com` (Production + Preview), then redeploy

#### Client feedback round 3

- Full Groom starting prices corrected to Small $85, Medium $105, Large $135 in `pricingData.ts` (calculator) and Sanity (published 2026-10-05: pricing page matrix, grooming page "Starting at $85" feature card)
- Pending: client to confirm the XL Full Groom price (still $130)

#### Contact form hardening pilot (implemented; awaiting review)

- Branch: `fix/contact-form-hardening`
- Preserve the fixed facility recipient and required BCC to `acockerham@impactmarketing.net`.
- Added progressive US phone formatting for the CMS `phone` field (for example, `(218) 287-2000`) while retaining server-side validation.
- Added a honeypot, a 32 KB JSON request limit, strict recognized-field validation, and safe field-length limits using Zod.
- Now requires the `contact_form` reCAPTCHA action and an allowed Wags hostname, with Preview restricted to the exact current Vercel deployment or branch hostname; uses two three-second attempts; fails clearly when the production secret is missing; visibly flags delivery during a genuine Google verification outage.
- Added ten focused tests. Recipient manipulation and unknown fields are rejected. Focused lint, type-check, and the production build pass. Repository-wide lint still reports 111 pre-existing errors outside this pilot's scope.
- Safe local production API checks passed without sending email: non-JSON `400`, honeypot `200`, recipient manipulation `400`, missing production secret `503`, and oversized body `413`.
- Local browser QA passed without submitting the form: partial input formats as `(218) 287`, complete input formats as `(218) 287-2000`, field requirements and length limits match the published CMS contract, the honeypot is hidden and removed from keyboard navigation, and no browser console errors were reported.
- Local configuration presence audit: both reCAPTCHA variables are present; SMTP, primary-recipient, and explicit BCC variables are absent locally. The code-level required BCC fallback remains intact. A separate Vercel audit confirmed the required reCAPTCHA, SMTP, primary-recipient, and explicit BCC variables for Production and Preview.
- No deployment or live form submission is part of this branch until the diff is reviewed and approved.

#### Already existed from Embark design system

- Dynamic sitemap (`sitemap.ts`) — pulls from Sanity, filters noIndex, proper priority
- Robots.txt (`robots.ts`) — allows /, disallows /studio and /api/, sitemap URL correct
- Favicon — SVG paw icon at `app/icon.svg`
- Per-page metadata — `generateMetadata()` on all routes with canonical URLs, OG images, noIndex support
- Global metadata — title template, description, metadataBase set to wagsstaynplay.com
- JSON-LD structured data — LocalBusiness (address, geo, hours), Organization, WebSite
- Image optimization — Sanity CDN loader, responsive sizes, eager/lazy loading
- Accessibility — ARIA attributes, keyboard nav, focus traps, semantic HTML
- Styled 404 page — proper heading, message, back-to-home button
- Vercel Speed Insights integrated

#### Added in this milestone

- Skip-to-content accessibility link in layout.tsx
- Fixed Boxers Bed & Biscuits alt text reference in HeroMarquee.tsx
- Contact form spam protection: Google reCAPTCHA v3 (invisible). ContactForm loads the script on mount and sends a `recaptchaToken` with submissions; `/api/contact` verifies it against Google (min score 0.5) before sending email. A missing production `RECAPTCHA_SECRET_KEY` returns `503`; a genuine Google verification outage permits delivery only after bounded retries and visibly annotates the notification. Env vars: `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` + `RECAPTCHA_SECRET_KEY` (documented in `.env.example` and configured in Vercel).
- Contact form thank-you page (client request, pilot for all Embark sites): new Sanity page at `/thank-you` (heroMinimal + ctaBanner, noIndex so it's excluded from search + sitemap). ContactForm now redirects via `router.push('/thank-you')` on successful submit instead of showing the inline success card — the client-side navigation fires the existing `virtual_page_view` GTM/CTM event, making submissions trackable as conversions. **Template divergence note:** the `successMessage` field remains in the schema but is no longer rendered; backport this pattern to other Embark sites when they adopt dedicated thank-you pages.

- SEO crawl fixes (from Googlebot-style crawl of production, branch `fix/seo-crawl-issues`):
  - **Soft 404s fixed** — `[slug]` and `services/[slug]` routes now call `notFound()` when no Sanity document matches, returning real HTTP 404s (previously `/gallery` and any bogus URL returned 200 with a "Page not found" body)
  - **Canonical host unified on www** — `SITE_URL` in layout.tsx and the robots.ts sitemap URL now use `https://www.wagsstaynplay.com` (apex 308-redirects to www, so canonicals pointed at a redirect). Homepage now always emits a canonical even when the Sanity `seo` object is absent
  - **Complete H1s** — HeroMinimal renders heading + headingAccent inside a single `<h1>` (accent line was a sibling span, so Google saw truncated H1s like "A Different Kind of"). PricingPageTabs and ContactForm render their heading as `<h1>` when first content block on the page (h2 otherwise); PageBuilder ignores leading spacer blocks when computing block index. **Template divergence note:** backport all three to other Embark sites
  - **Contact form SSR restored** — ContactForm used `useSearchParams()`, which bailed the whole section out of SSR (crawlers saw no form, heading, or address). Now reads `window.location.search` in the mount effect instead

### Still needed

- Lighthouse audit to identify any remaining performance/accessibility gaps
- Cross-browser visual check
- Vercel deployment verification
- DNS cutover plan documentation
- Gallery page (blocked on client photos)
- Team photos for About page (blocked on client)

### Definition of Done

- [ ] Lighthouse 90+ across all categories
- [ ] No remaining KC/sister site references
- [ ] Skip-to-content link works
- [ ] All pages render correctly on Vercel preview
- [ ] Build passes clean
