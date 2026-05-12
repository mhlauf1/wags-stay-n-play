# Home Away From Home — Fargo

Website for **Home Away From Home**, a pet daycare, boarding, and grooming facility in Fargo, ND. Part of the [Embark Pet Services](https://www.embarkpetservices.com/) portfolio.

**Live domain:** https://homeawayfargo.com/

## Tech Stack

- **Framework:** Next.js 16 (React 19)
- **CMS:** Sanity.io
- **CSS:** Tailwind CSS v4
- **Hosting:** Vercel
- **DNS:** Cloudflare

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

## Theme System

Three design themes switchable via dev-only toggle widget:

- **Hearthstone** — Warm, cozy, rustic (barn red + cream)
- **Prairie Modern** — Clean, contemporary, airy (sage + terracotta)
- **Farmstead Blue** — Confident, established (navy + gold)

Use `?theme=hearthstone` URL param for shareable preview links.
