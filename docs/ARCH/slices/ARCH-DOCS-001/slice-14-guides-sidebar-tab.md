# ARCH-DOCS-001 · Slice 14 — Guides dual sidebar tab

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-DOCS-001`](../../%5BComplete%5D%20ARCH-DOCS-001-fumadocs-site.md) |
| **Status** | Delivered (2026-06-25) |
| **Prerequisite** | Slice 9 (Applications tab) ✓ |
| **Slice type** | Implementation |
| **Runtime owner** | `apps/docs/content/docs/` · `apps/docs/src/lib/` |
| **Closes** | Gap audit sidebar tabs · deferred Slice 9 Guides tab |

---

## Design (internal-guide)

- Fumadocs **folder group** `(guides)/` with `root: true` meta — parentheses omit slug prefix so `/docs/getting-started/**` URLs unchanged.
- Root `meta.json`: `index`, `(guides)`, `apps`.
- `(guides)/meta.json`: `root: true`, pages `getting-started`, `monorepo-map`, `contributing`.
- Path helpers: `docs-seed-mdx-path.ts`, `docsGuidesFolderGroup` in nav contract.

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-DOCS-001/slice-14-guides-sidebar-tab.md

1. Objective    — Dual sidebar tabs: Guides + Applications without breaking seed URLs.
2. Allowed layer— apps/docs/
3. Files        — apps/docs/content/docs/meta.json (Modified)
                  apps/docs/content/docs/(guides)/meta.json (New)
                  apps/docs/content/docs/(guides)/** (Moved from top-level guides sections)
                  apps/docs/src/lib/docs-nav.contract.ts (Modified)
                  apps/docs/src/lib/docs-seed-mdx-path.ts (New)
                  apps/docs/src/lib/docs-page-path.ts (Modified)
                  apps/docs/src/__tests__/docs-content.test.ts (Modified)
                  apps/docs/src/__tests__/docs-contract-authority.test.ts (Modified)
                  apps/docs/src/__tests__/helpers/slug-to-mdx-path.ts (Modified)
                  apps/docs/src/__tests__/mdx-adoption.test.ts (Modified)
                  apps/docs/src/__tests__/docs-github.constants.test.ts (Modified)
                  docs/ARCH/slices/ARCH-DOCS-001/slice-14-guides-sidebar-tab.md (Modified — status)
4. Prohibited   — Breaking /docs/getting-started/** URLs · ERP imports
5. Authority    — ARCH-DOCS-001 · slice-09 design · Fumadocs folder group conventions
6. Gates        — pnpm --filter @afenda/docs typecheck
                  pnpm --filter @afenda/docs test:run
                  pnpm quality:docs (16 SSG routes)
                  pnpm exec biome check apps/docs
7. Closes       — Guides sidebar tab · Fumadocs-ready +3%
8. Evidence     — quality:docs /docs/getting-started · docs-content.test.ts
9. Attestation  — Usability · Contract stability
```

---

## Known debt

- GitHub edit paths now include `(guides)/` prefix in blob URLs — intentional filesystem truth.
- Folder icons in meta.json — Slice 10 frontmatter schema (unchanged).
