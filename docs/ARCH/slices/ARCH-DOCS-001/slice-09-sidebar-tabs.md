# ARCH-DOCS-001 · Slice 9 — Sidebar tabs (root folders)

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-DOCS-001`](../../%5BComplete%5D%20ARCH-DOCS-001-fumadocs-site.md) |
| **Status** | Delivered (2026-06-25) |
| **Prerequisite** | Slice 8 ✓ |
| **Slice type** | Implementation |
| **Runtime owner** | `apps/docs/content/docs/` |
| **Closes** | Gap audit P1 nav UX · Fumadocs sidebar tabs |

---

## Design (internal-guide)

- Set `"root": true` on `apps/meta.json` (Applications tab) without breaking existing `/docs/apps/**` URLs.
- Add `"root": true` guides grouping via `guides/meta.json` that **indexes** existing sections (getting-started, monorepo-map, contributing) using Fumadocs folder structure — move only if URL redirects preserved in nav contract tests.
- Prefer **non-breaking** approach: dual root tabs (Guides + Applications) by restructuring root `meta.json` to two root folders; update `docs-nav.contract.ts` and all nav tests.
- Extend `layout.shared.ts` top nav if needed.

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-DOCS-001/slice-09-sidebar-tabs.md

1. Objective    — Enable Fumadocs sidebar tabs separating Guides from Applications via root meta.json folders.
2. Allowed layer— apps/docs/content/docs/ · apps/docs/src/lib/
3. Files        — apps/docs/content/docs/meta.json (Modified)
                  apps/docs/content/docs/guides/meta.json (New)
                  apps/docs/content/docs/guides/index.mdx (New)
                  apps/docs/content/docs/apps/meta.json (Modified — root true)
                  apps/docs/src/lib/docs-nav.contract.ts (Modified)
                  apps/docs/src/__tests__/docs-content.test.ts (Modified)
                  apps/docs/src/__tests__/docs-routes.test.tsx (Modified)
                  apps/docs/src/__tests__/seed-page-registry.test.ts (Modified)
                  docs/ARCH/slices/ARCH-DOCS-001/slice-09-sidebar-tabs.md (Modified — status)
                  docs/ARCH/[Complete] ARCH-DOCS-001-fumadocs-site.md (Modified — Slice 9 row)
                  docs/ARCH/slices/ARCH-DOCS-001/slice-index.md (Modified)
4. Prohibited   — Breaking /docs/apps/** URLs without contract test update · ERP imports
5. Authority    — ARCH-DOCS-001 · Fumadocs page conventions (root folders)
6. Gates        — pnpm --filter @afenda/docs typecheck
                  pnpm --filter @afenda/docs test:run
                  pnpm quality:docs
                  pnpm exec biome check apps/docs
7. Closes       — Sidebar tabs · Fumadocs-ready +5%
8. Evidence     — meta.json root flags · docs-routes.test.tsx · quality:docs
9. Attestation  — Usability · Contract stability
```

---

## Known debt

- Folder icons in meta.json — Slice 10 frontmatter schema
