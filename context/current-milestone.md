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
