# Wags Stay N' Play — site scrape bundle

Complete content extract from `https://www.wagsstaynplay.com` (Wix site) for the new build. All 12 pages, all client-uploaded images at original resolution, and the 4 registration documents.

## What's here

```
.
├── content/                  # CMS-ready markdown, one per page
│   ├── 00-home.md
│   ├── 01-about-us.md
│   ├── ...
│   └── 11-contact.md
├── manifest.json             # master list of every asset URL
├── scripts/
│   ├── download.mjs          # downloads everything in manifest.json
│   └── scrape-wix.mjs        # reusable crawler for the NEXT Wix site
└── README.md
```

## Quick start (this site)

You need Node 20+ (for native `fetch`). No npm install required.

```bash
cd scripts
node download.mjs                  # priority images + documents
node download.mjs --include-stock  # also pull Wix stock library images
```

Output lands in `scripts/assets/`:
```
assets/
├── homepage-gallery/      # 12 facility photos
├── team/                  # 6 team headshots
├── facility/              # boarding hero, rates header
├── assessments-gallery/   # 5 assessment photos
├── product/               # breakaway collar image
└── documents/             # 4 forms (2 PDF, 2 DOCX)
```

## Quick start (next Wix site)

```bash
node scrape-wix.mjs https://www.example.com
node scrape-wix.mjs https://www.example.com --out ./my-output --max-pages 50
node scrape-wix.mjs https://www.example.com --no-download   # manifest only
node scrape-wix.mjs https://www.example.com --include-stock
```

The crawler:
- BFS-crawls internal links (same origin only)
- Saves raw HTML per page
- Best-effort extracts content to markdown
- Finds every `<img src>`, `srcset`, `<source>`, and `og:image`
- Rewrites Wix CDN URLs (`/v1/fill/...`) back to originals
- Pulls every linked PDF/DOCX/XLSX/etc.
- Skips Wix stock images (`11062b_` prefix) by default
- Throttles at 250ms between requests

## Notes & open questions for the client

Flagged inline in the markdown files — search for `⚠️`:

1. **Team photo labels are scrambled.** Original filenames (`tank1.jpg`, `Roger and Lois.jpg`, `Ebon.jpg`, `Poppy.jpg`) don't match the team member names beside them. Names and photos need to be re-paired with Cindy/Whitney/Akaysha/Ashley.
2. **Training page link is broken** — the "Classes" link on /our-services points back to homepage. Likely they don't offer training despite the meta description claiming they do.
3. **All pricing is going to be replaced** by the Goose POS transition. Use what's in `content/06-rates.md` as the baseline for understanding their service structure only.
4. **Waiver document** is named `meds and add ins.docx` on the server — possibly the "Waiver" link points to the wrong file. Worth opening to confirm before relying on it.
5. **Hours of operation** appear on homepage but not contact page. Verify with client which is current.
6. **No training offered** — meta description claims daycare/boarding/grooming/training but no training page exists. Drop from new site unless they want to add it.

## The Wix URL trick (for reference)

Wix serves images through a transformation pipeline:
```
https://static.wixstatic.com/media/{asset}/v1/fill/w_480,h_360,.../{derived-name}.jpg
                                              ^^^^ strip everything from here
```
Strip everything from `/v1/` onward and you get the original full-resolution upload:
```
https://static.wixstatic.com/media/{asset}
```

Asset prefix tells you the source:
- `a585ce_...` → uploaded by this specific site (the photos you want)
- `11062b_...` → Wix shared stock library (skip)
- bare hash (no underscore prefix) → also Wix shared stock (skip)
