# Coding Standards

## TypeScript

- Strict mode enabled
- No `any` types — use proper typing or `unknown`
- Define interfaces for all props, API responses, and data models
- Use type inference where obvious, explicit types where helpful

## React

- Functional components only (no class components)
- Use hooks for state and side effects
- Keep components focused — one job per component
- Extract reusable logic into custom hooks

## Next.js

- Server components by default
- Only use `'use client'` when needed (interactivity, hooks, browser APIs)
- Use Server Actions for form submissions (contact form, newsletter, etc.)
- Fetch Sanity data directly in server components using GROQ queries
- Dynamic routes for service pages
- Static generation for all pages (ISR with Sanity webhook revalidation)

## Sanity CMS

- All user-facing content comes from Sanity — no hardcoded copy in components
- GROQ queries live in `frontend/sanity/lib/queries.ts`
- Sanity client config in `frontend/sanity/lib/client.ts`
- Type definitions generated from Sanity schema or manually maintained in `frontend/sanity/lib/types.ts`
- Image URLs built with Sanity's image URL builder — never construct CDN URLs manually
- Portable Text rendered with `@portabletext/react` for rich text fields
- Schema files live in the `studio/` directory at project root (Sanity Studio embedded in the Next.js project)

## Tailwind CSS v4

**CRITICAL**: We are using Tailwind CSS v4, which uses CSS-based configuration.

- **DO NOT** create `tailwind.config.ts` or `tailwind.config.js` files (those are for v3)
- All theme configuration must be done in CSS using the `@theme` directive in `frontend/app/globals.css`
- Use CSS custom properties for all colors, fonts, and spacing tokens
- No JavaScript-based Tailwind config allowed

### Theme token system

Wags uses a single color palette defined as CSS custom properties in `globals.css`. Components use semantic token names mapped via the Tailwind `@theme` block — never raw hex values.

```css
@import 'tailwindcss';

:root {
  --theme-cream: #faf6f1;
  --theme-forest: #4a1c2a;       /* deep burgundy (primary dark) */
  --theme-terracotta: #8b2f3a;   /* burgundy (accent) */
  --theme-gold: #c49a3c;         /* gold (highlight) */
  --theme-charcoal: #361520;     /* darker burgundy */
  --theme-sage: #c4a882;         /* warm tan */
  /* ... etc */
  --theme-font-heading: var(--font-bricolage, 'Bricolage Grotesque', ...);
  --theme-font-body: var(--font-geist, 'Geist', ...);
}

@theme {
  --color-cream: var(--theme-cream);
  --color-forest: var(--theme-forest);
  --color-terracotta: var(--theme-terracotta);
  /* ... mapped tokens */
}
```

- **Never use hardcoded color values** in components — always reference semantic tokens
- No multi-theme system — Wags has a single design direction (no theme toggle, no `data-theme` switching)

## File Organization

```
frontend/
├── app/
│   ├── page.tsx                  # Homepage
│   ├── [slug]/page.tsx           # Dynamic CMS pages (pricing, gallery, new-clients, contact, about)
│   ├── services/[slug]/page.tsx  # Dynamic service pages (daycare, boarding, grooming)
│   ├── studio/[[...tool]]/page.tsx # Embedded Sanity Studio
│   ├── api/
│   │   ├── contact/route.ts      # Contact form submission
│   │   └── draft-mode/           # Sanity draft mode toggle
│   ├── layout.tsx
│   ├── globals.css               # Tailwind v4 config + single theme tokens
│   ├── components/
│   │   ├── Header.tsx, Footer.tsx, TextLogo.tsx  # Layout
│   │   ├── sections/             # Page sections (Hero, ServiceCards, Stats, etc.)
│   │   ├── pricing/              # Pricing calculators (Daycare, Boarding, Grooming)
│   │   └── ui/                   # Reusable primitives (Button, Badge, FadeIn, etc.)
│   └── data/
│       └── pricingData.ts        # Wags pricing data (daycare, boarding, grooming)
├── sanity/
│   └── lib/
│       ├── client.ts             # Sanity client configuration
│       ├── queries.ts            # All GROQ queries
│       ├── api.ts                # Sanity API config (projectId, dataset, apiVersion)
│       └── token.ts              # Sanity API read token
└── public/
    ├── illustrations/            # Sticker/badge SVGs and PNGs
    └── images/                   # Static images (logo, fallbacks)

studio/
├── src/
│   ├── schemaTypes/
│   │   ├── documents/            # page, service, testimonial
│   │   ├── objects/              # 45+ page builder block types
│   │   ├── singletons/          # settings
│   │   └── index.ts              # Schema registry
│   └── structure.ts              # Custom Studio structure
└── sanity.config.ts
```

## Naming

- Components: PascalCase (`ServiceHero.tsx`)
- Files: Match component name or kebab-case for non-components
- Functions: camelCase
- Constants: SCREAMING_SNAKE_CASE
- Types/Interfaces: PascalCase (no I or T prefix)
- CSS custom properties: kebab-case (`--color-primary`, `--theme-surface`)
- Sanity document types: camelCase (`servicePage`, `pricingTier`)

## Styling

- Tailwind CSS for all styling
- Use semantic theme tokens for all colors and fonts
- No inline styles
- Framer Motion for animations (page transitions, scroll reveals, hover effects)
- All animations respect `prefers-reduced-motion`

## Data Fetching

- Server components fetch directly from Sanity
- GROQ queries are the only way to read content — no REST API
- Use `next: { revalidate }` or on-demand revalidation via Sanity webhooks
- Validate contact form inputs with Zod

## Error Handling

- Graceful fallbacks for missing Sanity content (don't crash if a field is empty)
- 404 pages for invalid routes
- Loading states for any client-side data fetching

## Code Quality

- No commented-out code unless specified
- No unused imports or variables
- Keep functions under 50 lines when possible
- No KC, HAFH, or Hound Around references in any user-facing content, meta tags, alt text, or comments

## Performance

- All images served through Sanity CDN with proper sizing (`w`, `h`, `fit`, `auto=format`)
- Use `next/image` with Sanity loader for optimized delivery
- Lazy load below-fold images and sections
- Font files preloaded for active theme only
- Lighthouse target: 90+ across all categories

## Accessibility

- Semantic HTML throughout
- ARIA labels on interactive elements
- Keyboard navigation for all interactive components (nav, accordions, pricing calculators)
- Color contrast meets WCAG AA minimum
- Skip-to-content link
