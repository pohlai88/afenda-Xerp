# ARCH-DOCS-001 · Slice 21 — Nav polish (icons · prev/next · draft filter)

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-DOCS-001`](../../%5BComplete%5D%20ARCH-DOCS-001-fumadocs-site.md) |
| **Status** | **Delivered** 2026-06-26 |
| **Prerequisite** | Slice 20 ✓ |
| **Slice type** | Implementation |
| **Runtime owner** | `apps/docs/src/` |
| **Closes** | Loader plugin polish · page-tree utils adoption |

---

## Design (internal-guide)

- Add `lucideIconsPlugin()` to `source.ts`; add `icon` keys to `(guides)/meta.json` and `apps/meta.json` for sidebar folders (Rocket, Layers, etc.).
- Add `docs-page-footer.tsx` using `findNeighbour(source.pageTree[lang], page.url)` for prev/next on slug page.
- Add `docs-draft-tree-filter.plugin.ts` loader plugin: hide pages with `status: draft` from `transformPageTree` (frontmatter already in schema).
- Charter tests for plugin wiring, neighbour footer, draft exclusion.

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-DOCS-001/slice-21-nav-polish.md

1. Objective    — Polish docs navigation: Lucide sidebar icons, prev/next footer via findNeighbour, and draft page tree filtering.
2. Allowed layer— apps/docs/src/ · apps/docs/content/docs/*/meta.json (icon keys only)
3. Files        — apps/docs/src/lib/source.ts (Modified)
                  apps/docs/src/lib/docs-draft-tree-filter.plugin.ts (New)
                  apps/docs/src/components/docs-page-footer.tsx (New)
                  apps/docs/src/app/[lang]/docs/[[...slug]]/page.tsx (Modified)
                  apps/docs/content/docs/en/(guides)/meta.json (Modified)
                  apps/docs/content/docs/en/apps/meta.json (Modified)
                  apps/docs/content/docs/zh/(guides)/meta.json (Modified)
                  apps/docs/content/docs/zh/apps/meta.json (Modified)
                  apps/docs/src/__tests__/docs-nav-polish.test.ts (New)
                  docs/ARCH/slices/ARCH-DOCS-001/slice-21-nav-polish.md (Modified — status)
                  docs/ARCH/slices/ARCH-DOCS-001/slice-index.md (Modified)
4. Prohibited   — @afenda/ui in shell · ERP coupling · changing published page slugs
5. Authority    — fumadocs-core/page-tree · fumadocs-core/source/lucide-icons · ARCH-DOCS-001
6. Gates        — pnpm --filter @afenda/docs typecheck
                  pnpm --filter @afenda/docs test:run
                  pnpm quality:docs
7. Closes       — Nav polish P4 · optional UX when corpus grows
8. Evidence     — docs-nav-polish.test.ts
9. Attestation  — Usability · draft pages hidden from nav only (routes still SSG if present)
```

---

## Known debt

- Draft pages still generateStaticParams unless excluded in postprocess — document behavior in test.
