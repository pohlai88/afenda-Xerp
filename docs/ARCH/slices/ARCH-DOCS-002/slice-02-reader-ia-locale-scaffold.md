# ARCH-DOCS-002 · Slice 2 — Reader IA locale scaffold

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-DOCS-002`](../../%5BComplete%5D%20ARCH-DOCS-002-published-docs-ia.md) |
| **Prerequisite** | Slice 1 ✓ |
| **Slice** | 2 |
| **Status** | Delivered (2026-06-26) |
| **Type** | Implementation |
| **Risk** | Low · **Clean Core:** A |

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-DOCS-002/slice-02-reader-ia-locale-scaffold.md

1. Objective    — Scaffold reader IA (use-erp, configure-tenant, operate-tenant) for zh/vi/ms/id/th/fil; generate reference MDX for all docsLocales; restrict English-only SSG to build-afenda only; resolve empty non-en IA risk.
2. Allowed layer— apps/docs/** and scripts/docs/**
3. Files        —
                  apps/docs/scripts/generate-reference-pages.mts
                  apps/docs/scripts/scaffold-reader-ia-locales.mts
                  apps/docs/src/lib/docs-nav.contract.ts
                  scripts/docs/sync-product-docs.mts
                  apps/docs/content/docs/{zh,vi,ms,id,th,fil}/use-erp/**
                  apps/docs/content/docs/{zh,vi,ms,id,th,fil}/configure-tenant/**
                  apps/docs/content/docs/{zh,vi,ms,id,th,fil}/operate-tenant/**
                  apps/docs/content/docs/{zh,vi,ms,id,th,fil}/meta.json
                  apps/docs/src/__tests__/docs-openapi.test.ts
                  apps/docs/src/__tests__/docs-reader-ia-locales.test.ts
4. Prohibited   — packages/ui/** · apps/erp runtime imports · localized prose translation (P2 editorial)
5. Authority    — ARCH-DOCS-002 §5.4 P2 wording · PKG005_DOCS
6. Gates        —
                  pnpm sync:product-docs
                  pnpm --filter @afenda/docs typecheck
                  pnpm --filter @afenda/docs test:run
7. Closes       — Non-en empty IA risk · docs-ia-l10n-tasks (scaffold only) · ARCH-DOCS-002 Slice 2 row
8. Evidence     — apps/docs/content/docs/zh/use-erp/sign-in.mdx · docs-reader-ia-locales.test.ts · isEnglishOnlyDocsSlug build-afenda-only
9. Attestation  — Contract · TypeScript · Boundary · Test · Documentation
```

---

## Acceptance

```text
[x] zh/vi/ms/id/th/fil meta.json lists reader sections
[x] sign-in.mdx exists per locale (English scaffold)
[x] generate-reference-pages writes all locales
[x] isEnglishOnlyDocsSlug true only for build-afenda
[x] non-en SSG includes use-erp and generated env pages
[x] 230 tests pass
```

---

## Notes

- Task article **body** remains English scaffold — full translation is P2 editorial, not this slice.
- `build-afenda` stays English-only until engineer IA localization is approved.
