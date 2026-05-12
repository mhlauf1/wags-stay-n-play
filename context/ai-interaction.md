# AI Interaction Guidelines

## Communication

- Be concise and direct
- Explain non-obvious decisions briefly
- Ask before large refactors or architectural changes
- Don't add features or pages not discussed in the project plan
- Never delete files without clarification
- If a component exists from the Hound Around codebase, modify it — don't rewrite from scratch unless structurally necessary

## Workflow

This is the workflow for every milestone, feature, or fix:

1. **Document** — Update @context/current-milestone.md with what we're working on
2. **Branch** — Create new branch for the work
3. **Implement** — Build what's documented in current-milestone.md
4. **Test** — Verify it works in the browser. Run `npm run build` and fix any errors
5. **Iterate** — Iterate and change things if needed
6. **Commit** — Only after build passes and everything works
7. **Merge** — Merge to main
8. **Delete branch** — Delete branch after merge
9. **Deploy** — Verify Vercel preview deployment looks correct
10. **Update** — Mark as completed in @context/current-milestone.md and add to history in @context/milestones.md

Do NOT commit without permission and until the build passes. If build fails, fix the issues first.

## Branching

Create a new branch for every milestone or significant change.

- Features: `feature/[name]` (e.g., `feature/theme-system`, `feature/pricing-page`)
- Fixes: `fix/[name]` (e.g., `fix/mobile-nav-overflow`)
- Content: `content/[name]` (e.g., `content/seed-pricing-data`)
- Chore: `chore/[name]` (e.g., `chore/remove-hound-around-refs`)

Ask to delete the branch once merged.

## Commits

- Ask before committing (don't auto-commit)
- Use conventional commit messages (`feat:`, `fix:`, `chore:`, `content:`, `style:`, etc.)
- Keep commits focused (one feature/fix per commit)
- **Never put "Generated With Claude" or any AI attribution in commit messages**

## Codebase Origin Rules

This repo was cloned from the Hound Around Resort codebase (`mhlauf1/hound-3`) with a clean git history. It is its own independent repo (`mhlauf1/home-away-fargo`), not a GitHub fork. Follow these rules strictly:

### Do
- Reuse existing component structures and patterns
- Modify components to accept theme tokens instead of hardcoded values
- Add new components alongside existing ones when HAFH needs something Hound Around doesn't have
- Keep the same Sanity query patterns and data-fetching approach
- Document any structural changes so they can inform the future Embark site template

### Don't
- Leave any Hound Around-specific content (copy, images, alt text, meta tags, comments, URLs)
- Change a working component pattern just because you'd do it differently — consistency across sites matters
- Rename files/components without a clear reason — the Hound Around naming conventions are the standard
- Modify the Sanity schema structure unless the content genuinely requires it

### When you find HAFH or Hound Around content
- Replace it with the Kingdom Canine equivalent from @context/project-overview.md or @context/intake-content.md
- If KC content doesn't exist yet for that field, use a clear placeholder: `[PLACEHOLDER: description]`
- Never leave an HAFH or Hound Around reference as a placeholder — always swap to either real KC content or an explicit `[PLACEHOLDER]` marker

## Theme System Rules

- KC uses a single color palette — no multi-theme system, no theme toggle, no `data-theme` switching
- Every color and font reference in a component must use a semantic CSS custom property token
- Never use raw hex values (e.g., `bg-[#8B2D1E]`) — use the token (e.g., `bg-cream`, `bg-forest`)

## Sanity Content Rules

- All user-facing text comes from Sanity — not hardcoded in components
- When Sanity content is missing, render gracefully (hide the section or show nothing) — never crash
- When seeding Sanity content, use the exact data from the intake document (pricing, hours, descriptions) — don't paraphrase or embellish
- Keep GROQ queries in the central queries file, not scattered across components

## When Stuck

- If something isn't working after 2-3 attempts, stop and explain the issue
- Don't keep trying random fixes
- Ask for clarification if requirements are unclear
- If a Hound Around pattern doesn't make sense for HAFH, explain why before changing it

## Code Changes

- Make minimal changes to accomplish the task
- Don't refactor unrelated code unless asked
- Don't add "nice to have" features
- Preserve existing patterns from the Hound Around codebase
- When modifying a shared component, consider how the change would affect other Embark sites

## What Not To Do

- Don't add pages or sections not in the sitemap (@context/project-overview.md)
- Don't install new dependencies without asking — especially for things the existing stack already handles
- Don't change the Vercel, Cloudflare, or Sanity configuration without explicit instruction
- Don't create mock/dummy images — use placeholder divs with appropriate aspect ratios and a muted background
- Don't write Sanity migration scripts unless asked — content seeding is done manually or through Studio
