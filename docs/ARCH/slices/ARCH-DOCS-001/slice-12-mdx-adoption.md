# ARCH-DOCS-001 · Slice 12 (C) — MDX adoption (Accordion · ImageZoom · InlineTOC)

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-DOCS-001`](../../%5BComplete%5D%20ARCH-DOCS-001-fumadocs-site.md) |
| **Status** | Delivered (2026-06-25) |
| **Prerequisite** | Phase 2 Slices 6–11 ✓ |
| **Slice type** | Implementation |
| **Runtime owner** | `apps/docs/` |
| **Closes** | Gap audit MDX adoption · long-form page UX |

---

## Design (internal-guide)

- Wire **InlineTOC** and **Accordions** on five long-form MDX pages (monorepo-map, contributing, apps erp/docs/storybook).
- Register global **`img` → ImageZoom** in `mdx.tsx` so markdown images are zoomable.
- Add `docsLongFormMdxPaths` contract + `mdx-adoption.test.ts` charter tests.
- Layer diagram at `public/docs/monorepo-layers.svg` (ASCII-safe UTF-8 for Turbopack).

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-DOCS-001/slice-12-mdx-adoption.md

1. Objective    — Adopt Accordion, ImageZoom, InlineTOC on long pages; raise Fumadocs-ready score.
2. Allowed layer— apps/docs/
3. Files        — apps/docs/src/components/mdx.tsx (Modified)
                  apps/docs/src/lib/docs-nav.contract.ts (Modified)
                  apps/docs/content/docs/monorepo-map/index.mdx (Modified)
                  apps/docs/content/docs/contributing/index.mdx (Modified)
                  apps/docs/content/docs/apps/erp/index.mdx (Modified)
                  apps/docs/content/docs/apps/docs/index.mdx (Modified)
                  apps/docs/content/docs/apps/storybook/index.mdx (Modified)
                  apps/docs/public/docs/monorepo-layers.svg (New)
                  apps/docs/src/__tests__/mdx-adoption.test.ts (New)
                  apps/docs/src/__tests__/docs-routes.test.tsx (Modified)
                  docs/architecture/fumadocs-feature-gap-audit.md (Modified)
                  docs/ARCH/slices/ARCH-DOCS-001/slice-12-mdx-adoption.md (Modified — status)
                  docs/ARCH/slices/ARCH-DOCS-001/slice-index.md (Modified)
4. Prohibited   — apps/erp/* · packages/* · @afenda/* runtime imports · Phase 3 OpenAPI/i18n
5. Authority    — ARCH-DOCS-001 · fumadocs-feature-gap-audit · fumadocs-ui component catalog
6. Gates        — pnpm --filter @afenda/docs typecheck
                  pnpm --filter @afenda/docs test:run
                  pnpm quality:docs
                  pnpm exec biome check apps/docs
7. Closes       — Accordion · ImageZoom · InlineTOC adoption · long-form MDX charter
8. Evidence     — mdx-adoption.test.ts · 16 SSG routes · quality:docs build
9. Attestation  — Usability · Documentation traceability · Contract stability
```

---

## Known debt

- Banner, DynamicCodeBlock, GithubInfo, TypeTable remain registered but unused (lower ROI than Slice C trio).
- Phase 3 (OpenAPI, i18n, dual sidebar tab) unchanged — trigger-based only.
