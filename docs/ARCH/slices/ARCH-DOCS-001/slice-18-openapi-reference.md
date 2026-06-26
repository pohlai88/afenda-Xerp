# ARCH-DOCS-001 · Slice 18 — OpenAPI reference completion (ARCH-API-002)

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-DOCS-001`](../../%5BComplete%5D%20ARCH-DOCS-001-fumadocs-site.md) |
| **Status** | Delivered (2026-06-26) |
| **Prerequisite** | Slice 17 ✓ · [`ARCH-API-002`](../../ARCH-API-002-openapi-internal-v1-catalog.md) foundation acceptable |
| **Slice type** | Implementation |
| **Runtime owner** | `apps/docs/` |
| **Closes** | Gap audit OpenAPI blocked → **Adopted** · Fumadocs-ready +10% |

---

## Design (internal-guide)

- **Authority:** ARCH-API-002 — static `apps/docs/openapi/afenda-internal-v1.openapi.json`; MDX under `content/docs/en/(guides)/api-reference/`; no `@afenda/erp` runtime imports.
- Wire `fumadocs-openapi` end-to-end: `openapi.loaderPlugin()`, `OpenAPIPage` preload on `_openapi` frontmatter pages, `generate:openapi-docs` in package scripts/CI path.
- Add charter tests: OpenAPI spec present, api-reference in seed nav, slug page OpenAPI preload path, no erp runtime coupling preserved.
- **TypeScript architect pass (apps/docs only):** normalize OpenAPI client/server types, remove dead WIP, ensure boundary-safe exports; no behavior change outside docs app.
- zh: keep stub index linking to en reference until Slice 20; do not duplicate 10 operation MDX files in zh.

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-DOCS-001/slice-18-openapi-reference.md

1. Objective    — Complete Fumadocs OpenAPI reference for internal v1 catalog: interactive operation pages, loader plugin, generator script gates, and TypeScript cleanup in apps/docs.
2. Allowed layer— apps/docs/
3. Files        — apps/docs/src/lib/openapi.server.ts (Modified)
                  apps/docs/src/components/api-page.client.tsx (Modified)
                  apps/docs/src/app/[lang]/docs/[[...slug]]/page.tsx (Modified)
                  apps/docs/scripts/generate-openapi-docs.mts (Modified)
                  apps/docs/package.json (Modified — generate:openapi-docs wiring)
                  apps/docs/content/docs/en/(guides)/api-reference/** (Modified — regen if needed)
                  apps/docs/src/__tests__/docs-openapi.test.ts (New)
                  apps/docs/src/__tests__/docs-routes.test.tsx (Modified)
                  docs/ARCH/slices/ARCH-DOCS-001/slice-18-openapi-reference.md (Modified — status)
                  docs/ARCH/slices/ARCH-DOCS-001/slice-index.md (Modified)
                  docs/architecture/fumadocs-feature-gap-audit.md (Modified)
4. Prohibited   — apps/erp/** runtime imports in docs · hand-edit OpenAPI JSON · Kong/public v1 · @afenda/ui in docs shell · registry mutation
5. Authority    — ARCH-API-002 · ARCH-DOCS-001 · fumadocs-openapi · docs-app-architecture
6. Gates        — pnpm --filter @afenda/docs typecheck
                  pnpm --filter @afenda/docs test:run
                  pnpm quality:docs
                  pnpm check:openapi-drift
                  pnpm --filter @afenda/docs test:run -- src/__tests__/no-erp-runtime-coupling.test.ts
7. Closes       — Gap audit OpenAPI row Adopted · Fumadocs-ready ~88%
8. Evidence     — docs-openapi.test.ts · quality:docs SSG includes api-reference routes
9. Attestation  — Security (static JSON only) · Boundaries (no erp runtime)
```

---

## DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | OpenAPI interactive pages render via fumadocs-openapi | `pnpm --filter @afenda/docs test:run` |
| 2 | Spec drift gate green | `pnpm check:openapi-drift` |
| 3 | Gap audit OpenAPI = Adopted | manual + fumadocs-feature-gap-audit.md |

---

## Known debt

- OpenAPI search indexing deferred (Orama text search sufficient for current corpus).
- zh operation pages deferred to Slice 20.
