# ARCH-DOCS-001 · Slice 17 — Full multilingual i18n

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-DOCS-001`](../../%5BComplete%5D%20ARCH-DOCS-001-fumadocs-site.md) |
| **Status** | Delivered (2026-06-25) |
| **Prerequisite** | Slice 16 (UI translations singular) ✓ |
| **Slice type** | Implementation |
| **Runtime owner** | `apps/docs/` |
| **Closes** | Gap audit i18n (multilingual en+zh) · Fumadocs `defineI18n` + middleware |

---

## Design

- **Locales:** `en` (default) + `zh` — sufficient for multilingual MVP; `fr` / `ko` documented as future expansion.
- **Routing:** `app/[lang]/` with middleware redirect `/` → `/en`, `/docs/*` → `/en/docs/*`.
- **Content:** `content/docs/en/` + `content/docs/zh/` (zh body copied from en initially; zh UI via `defineI18nUI`).
- **Contracts:** locale-aware `docsHref`, `docsHomeSections(locale)`, `docsSearchEmptyLinks(locale)`, `docsLocaleContentRoot(locale)`.

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-DOCS-001/slice-17-multilingual-i18n.md

1. Objective    — Wire full Fumadocs i18n: defineI18n + middleware + app/[lang]/ + content/docs/{en,zh}/ + language switcher.
2. Allowed layer— apps/docs/ · docs/ARCH/slices/ARCH-DOCS-001/ · docs/architecture/fumadocs-feature-gap-audit.md
3. Files        — apps/docs/src/lib/i18n.ts (New)
                  apps/docs/src/middleware.ts (New)
                  apps/docs/content/docs/{en,zh}/ (Migrated)
                  apps/docs/src/app/[lang]/ (New)
                  apps/docs/src/lib/* contracts + source.ts (Modified)
                  apps/docs/src/__tests__/docs-i18n.test.ts (New)
                  docs/ARCH/slices/ARCH-DOCS-001/slice-17-multilingual-i18n.md (New)
                  docs/ARCH/slices/ARCH-DOCS-001/slice-index.md (Modified)
                  docs/architecture/fumadocs-feature-gap-audit.md (Modified)
4. Prohibited   — apps/erp/** · packages/** · OpenAPI/TIP-031 · @afenda/ui runtime imports
5. Authority    — fumadocs-i18n skill · Fumadocs internationalization docs · ARCH-DOCS-001
6. Gates        — pnpm --filter @afenda/docs typecheck
                  pnpm --filter @afenda/docs test:run
                  pnpm quality:docs
                  pnpm exec biome check apps/docs
7. Closes       — i18n Adopted (partial multilingual en+zh) · Fumadocs-ready ~78%
8. Evidence     — docs-i18n.test.ts · quality:docs SSG route count · middleware redirect
9. Attestation  — Backward compat via middleware; seed slugs under /en/docs/**
```

---

## Known debt

- **URL change:** Legacy `/docs/**` redirects to `/en/docs/**` via middleware — update external bookmarks.
- **zh content:** MDX body is English copy; translate incrementally.
- **fr / ko:** Future expansion — add locale to `docsLocales`, create `content/docs/{locale}/`, extend `defineI18nUI` translations.

---

## Evidence (2026-06-25)

| Gate | Result |
| --- | --- |
| `pnpm --filter @afenda/docs typecheck` | exit 0 |
| `pnpm --filter @afenda/docs test:run` | see Completion Report |
| `pnpm quality:docs` | see Completion Report (SSG routes ×2 locales) |
| `pnpm exec biome check apps/docs` | exit 0 |
