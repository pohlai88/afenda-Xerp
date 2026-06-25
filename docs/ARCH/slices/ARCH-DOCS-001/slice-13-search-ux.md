# ARCH-DOCS-001 · Slice 13 — Search UX (empty-state links)

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-DOCS-001`](../../%5BComplete%5D%20ARCH-DOCS-001-fumadocs-site.md) |
| **Status** | Delivered (2026-06-25) |
| **Prerequisite** | Phase 2 Slices 6–12 ✓ |
| **Slice type** | Implementation |
| **Runtime owner** | `apps/docs/src/lib/` · `apps/docs/src/app/layout.tsx` |
| **Closes** | Gap audit search · Fumadocs `RootProvider search.links` |

---

## Design (internal-guide)

- Wire Fumadocs Search empty-state quick links via `RootProvider` — no custom `SearchDialog` or Algolia.
- Contract: `docs-search.contract.ts` exports `docsSearchEmptyLinks` aligned with seed nav slugs.
- Links: Getting Started, Monorepo Map, Applications, Contributing.

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-DOCS-001/slice-13-search-ux.md

1. Objective    — Add Fumadocs search empty-state quick links on RootProvider.
2. Allowed layer— apps/docs/src/
3. Files        — apps/docs/src/lib/docs-search.contract.ts (New)
                  apps/docs/src/app/layout.tsx (Modified)
                  apps/docs/src/__tests__/docs-search.test.ts (New)
                  docs/ARCH/slices/ARCH-DOCS-001/slice-13-search-ux.md (Modified — status)
4. Prohibited   — Custom SearchDialog · Algolia · OpenAPI search · apps/erp/*
5. Authority    — ARCH-DOCS-001 · Fumadocs UI Search docs
6. Gates        — pnpm --filter @afenda/docs typecheck
                  pnpm --filter @afenda/docs test:run
                  pnpm quality:docs
                  pnpm exec biome check apps/docs
7. Closes       — Search empty-state UX · Fumadocs-ready +2%
8. Evidence     — docs-search.test.ts · layout.tsx search prop
9. Attestation  — Usability · Contract stability
```

---

## Known debt

- Custom search API route optional — default Orama sufficient for current corpus.
