# ARCH-DOCS-002 · Slice 1 — IA, catalog export, task articles, redirects

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-DOCS-002`](../../%5BComplete%5D%20ARCH-DOCS-002-published-docs-ia.md) |
| **Prerequisite** | ARCH-DOCS-001 Complete · ARCH-API-002 OpenAPI pipeline |
| **Slice** | 1 |
| **Status** | Delivered (2026-06-26) |
| **Type** | Implementation |
| **Risk** | Low · **Clean Core:** A |

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-DOCS-002/slice-01-ia-catalog-task-articles.md

1. Objective    — Deliver reader-based English IA (use-erp, configure-tenant, operate-tenant, integrate, build-afenda), JSON catalog export scripts, generate-reference-pages.mts, five canonical task articles, OpenAPI relocation to integrate/internal-v1, legacy URL redirects, extended source.config.ts task frontmatter, and drift/coupling tests.
2. Allowed layer— apps/docs/** and scripts/docs/**
3. Files        —
                  scripts/docs/export-auth-routes-catalog.mts
                  scripts/docs/export-system-admin-catalog.mts
                  scripts/docs/export-permissions-catalog.mts
                  scripts/docs/export-env-catalog.mts
                  scripts/docs/export-modules-catalog.mts
                  scripts/docs/sync-product-docs.mts
                  scripts/governance/check-docs-catalog-drift.mjs
                  apps/docs/data/auth-routes.catalog.json
                  apps/docs/data/system-admin.catalog.json
                  apps/docs/data/permissions.catalog.json
                  apps/docs/data/env.catalog.json
                  apps/docs/data/modules.catalog.json
                  apps/docs/scripts/generate-reference-pages.mts
                  apps/docs/scripts/generate-openapi-docs.mts
                  apps/docs/source.config.ts
                  apps/docs/next.config.ts
                  apps/docs/package.json
                  apps/docs/content/docs/en/meta.json
                  apps/docs/content/docs/en/use-erp/sign-in.mdx
                  apps/docs/content/docs/en/configure-tenant/users-and-memberships.mdx
                  apps/docs/content/docs/en/configure-tenant/roles-and-permissions.mdx
                  apps/docs/content/docs/en/operate-tenant/environment-and-auth.mdx
                  apps/docs/content/docs/en/operate-tenant/troubleshooting-login.mdx
                  apps/docs/content/docs/en/build-afenda/** (relocated guides + apps)
                  apps/docs/content/docs/en/integrate/internal-v1/** (generated)
                  apps/docs/src/lib/docs-nav.contract.ts
                  apps/docs/src/lib/docs-product-catalog.contract.ts
                  apps/docs/src/components/generated-reference.tsx
                  apps/docs/src/__tests__/docs-product-catalog.test.ts
                  apps/docs/src/__tests__/docs-task-articles.test.ts
                  apps/docs/src/__tests__/docs-legacy-redirects.test.ts
                  package.json (root — sync:product-docs, check:docs-catalog-drift)
                  docs/ARCH/[Complete] ARCH-DOCS-002-published-docs-ia.md
                  docs/delivery/FDR/[Complete] fdr-033-published-docs-ia.md
                  docs/ARCH/arch-status-index.md
                  docs/delivery/fdr-status-index.md
4. Prohibited   — packages/ui/** · apps/erp/** runtime imports in docs · packages/architecture-authority/registry edits · hand-edited generated MDX · @afenda/accounting
5. Authority    — ARCH-DOCS-002 §5–§6 · ARCH-DOCS-001 editorial charter · ARCH-API-002 OpenAPI pattern · PKG005_DOCS prohibited[] · ADR-0014 FDR authority
6. Gates        —
                  pnpm sync:product-docs
                  pnpm check:docs-catalog-drift
                  pnpm --filter @afenda/docs typecheck
                  pnpm --filter @afenda/docs test:run
                  pnpm --filter @afenda/docs lint:links
                  pnpm quality:docs
                  pnpm check:documentation-drift
7. Closes       — P0 reader IA · P0 catalog export · P0 five task articles · P0 legacy redirects · P0 OpenAPI integrate path · ARCH-DOCS-002 DoD rows 4–15
8. Evidence     — apps/docs/content/docs/en/use-erp/sign-in.mdx · apps/docs/data/*.json · apps/docs/src/__tests__/docs-product-catalog.test.ts · next.config.ts redirects · integrate/internal-v1/index.mdx
9. Attestation  — Contract · TypeScript · Boundary · Test · Documentation
```

---

## Acceptance

```text
[ ] en/meta.json lists use-erp, configure-tenant, operate-tenant, integrate, build-afenda
[ ] Five task articles render with audience + catalogBindings frontmatter
[ ] sync:product-docs regenerates all JSON catalogs exit 0
[ ] check:docs-catalog-drift fails on stale JSON
[ ] generate-reference-pages writes do-not-edit MDX under content/docs/en/**/generated/
[ ] OpenAPI pages under integrate/internal-v1 for en (and other locales)
[ ] Legacy paths redirect per ARCH-DOCS-002 §6.5
[ ] no-erp-runtime-coupling.test.ts still passes
[ ] docs-nav.contract reflects new seed sections
[ ] typecheck + test:run + quality:docs exit 0
```

---

## Notes

- Relocate `(guides)/getting-started`, `monorepo-map`, `contributing`, and `apps/**` under `build-afenda/` for English; keep other locales unchanged in Slice 1 except OpenAPI path.
- Export scripts use dynamic import or fs read of source files — never import ERP server modules into docs app bundle.
- Mirror OpenAPI `buildLocaleConfig` pattern for integrate path: `{locale}/integrate/internal-v1`.
- Root `package.json` adds `sync:product-docs` and `check:docs-catalog-drift`; wire `prebuild` to run sync when catalogs stale (optional — drift gate is sufficient).
