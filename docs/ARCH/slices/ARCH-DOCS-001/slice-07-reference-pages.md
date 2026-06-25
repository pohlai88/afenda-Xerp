# ARCH-DOCS-001 · Slice 7 — Package reference pages (AutoTypeTable)

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-DOCS-001`](../../%5BComplete%5D%20ARCH-DOCS-001-fumadocs-site.md) |
| **Status** | Delivered (2026-06-25) |
| **Prerequisite** | Slice 6 ✓ |
| **Slice type** | Implementation |
| **Runtime owner** | `apps/docs/content/docs/monorepo-map/` |
| **Closes** | Gap audit P0 reference pages · AutoTypeTable content adoption |

---

## Design (internal-guide)

- Add `monorepo-map/docs-contracts.mdx` documenting `@afenda/docs` nav/graph contracts with `AutoTypeTable` (self-contained — zero `@afenda/*` workspace type imports).
- Export documented interfaces from `docs-graph.types.ts` and `docs-nav.contract.ts` if needed for `name=` prop.
- Extend `docs-nav.contract.ts` subpages; add parity test for new slug.
- Enable `remarkAutoTypeTable` + filesystem cache in `source.config.ts` for MDX-native usage.

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-DOCS-001/slice-07-reference-pages.md

1. Objective    — Publish monorepo-map reference page with AutoTypeTable for docs-app public contracts; wire remark plugin.
2. Allowed layer— apps/docs/
3. Files        — apps/docs/source.config.ts (Modified)
                  apps/docs/src/lib/docs-graph.types.ts (Modified — export surface for docgen)
                  apps/docs/src/lib/docs-nav.contract.ts (Modified — subpage registry)
                  apps/docs/content/docs/monorepo-map/docs-contracts.mdx (New)
                  apps/docs/content/docs/monorepo-map/meta.json (Modified)
                  apps/docs/content/docs/monorepo-map/index.mdx (Modified — link)
                  apps/docs/src/__tests__/docs-content.test.ts (Modified)
                  apps/docs/src/__tests__/seed-page-registry.test.ts (Modified)
                  docs/ARCH/slices/ARCH-DOCS-001/slice-07-reference-pages.md (Modified — status)
                  docs/ARCH/[Complete] ARCH-DOCS-001-fumadocs-site.md (Modified — Slice 7 row)
                  docs/ARCH/slices/ARCH-DOCS-001/slice-index.md (Modified)
4. Prohibited   — Import @afenda/erp or spine packages for types · OpenAPI · verbatim inventory tables in MDX
5. Authority    — ARCH-DOCS-001 · afenda-fumadocs · docs-app-architecture boundary rules
6. Gates        — pnpm --filter @afenda/docs typecheck
                  pnpm --filter @afenda/docs test:run
                  pnpm quality:docs
                  pnpm exec biome check apps/docs
7. Closes       — AutoTypeTable adoption · reference depth · Fumadocs-ready +10%
8. Evidence     — docs-contracts.mdx · SSG route · test:run
9. Attestation  — Documentation · Maintainability · Contract stability
```

---

## Known debt

- Per-package `@afenda/*` reference pages deferred until TIP-031 / package export index exists
