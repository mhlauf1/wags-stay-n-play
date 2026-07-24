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
- Contact form spam protection: Google reCAPTCHA v3 (invisible). ContactForm loads the script on mount and sends a `recaptchaToken` with submissions; `/api/contact` verifies it against Google (min score 0.5) before sending email. No new npm deps. Fails open if `RECAPTCHA_SECRET_KEY` is unset or Google is unreachable, so misconfiguration never drops real leads. Env vars: `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` + `RECAPTCHA_SECRET_KEY` (documented in `.env.example`, need to be added in Vercel + reCAPTCHA admin console).
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
