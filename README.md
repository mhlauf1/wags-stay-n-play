# Wags Stay N' Play

Website for **Wags Stay N' Play**, a locally-owned dog and cat daycare, boarding, and grooming facility in Moorhead, MN. Part of the [Embark Pet Services](https://www.embarkpetservices.com/) portfolio.

**Live domain:** https://wagsstaynplay.com/

## Tech Stack

- **Framework:** Next.js 16 (React 19)
- **CMS:** Sanity.io
- **CSS:** Tailwind CSS v4
- **Hosting:** Vercel

## Getting Started

```bash
npm install
npm run dev
```

- Frontend: http://localhost:3000
- Sanity Studio: http://localhost:3000/studio (embedded)
- Standalone Studio: http://localhost:3333 (via `npm run sanity:dev` in `/studio`)

## Project Structure

```
├── frontend/     # Next.js app with embedded Sanity Studio
├── studio/       # Standalone Sanity Studio
└── context/      # Project documentation and instructions
```

## Design

Single color palette — tan/burgundy theme. No multi-theme system.

Colors, fonts, and spacing are defined as CSS custom properties in `frontend/app/globals.css` using Tailwind CSS v4's `@theme` directive.
