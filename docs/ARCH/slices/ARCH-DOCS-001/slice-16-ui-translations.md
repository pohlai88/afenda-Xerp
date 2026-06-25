# ARCH-DOCS-001 · Slice 16 — UI translations (singular)

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-DOCS-001`](../../%5BComplete%5D%20ARCH-DOCS-001-fumadocs-site.md) |
| **Status** | Delivered (2026-06-25) |
| **Prerequisite** | Phase 3 Slices 13–15 ✓ |
| **Slice type** | Implementation |
| **Runtime owner** | `apps/docs/src/lib/` · `apps/docs/src/app/layout.tsx` |
| **Closes** | Gap audit i18n (singular) · Fumadocs `RootProvider i18n` |

---

## Design (Option A — UI translations only)

- Wire Fumadocs **singular** UI translations via `defineTranslations` + `i18nProvider` on `RootProvider`.
- Contract: `docs-ui-translations.ts` extends `uiTranslations()` with Afenda editorial overrides (English).
- **Out of scope:** middleware, `app/[lang]/`, `content/docs/{locale}/`, language switcher URLs, `@fumadocs/language` preset.
- Infrastructure is ready for `.preset()` / multilingual i18n when product requires it.

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-DOCS-001/slice-16-ui-translations.md

1. Objective    — Wire Fumadocs UI translations (singular) via defineTranslations + i18nProvider.
2. Allowed layer— apps/docs/src/ · docs/ARCH/slices/ · docs/architecture/fumadocs-feature-gap-audit.md
3. Files        — apps/docs/src/lib/docs-ui-translations.ts (New)
                  apps/docs/src/app/layout.tsx (Modified)
                  apps/docs/src/__tests__/docs-ui-translations.test.ts (New)
                  docs/ARCH/slices/ARCH-DOCS-001/slice-16-ui-translations.md (New)
                  docs/ARCH/slices/ARCH-DOCS-001/slice-index.md (Modified)
                  docs/architecture/fumadocs-feature-gap-audit.md (Modified)
4. Prohibited   — Full multilingual i18n · middleware · [lang] routes · content locale dirs · apps/erp/*
5. Authority    — ARCH-DOCS-001 · Fumadocs UI Translations (singular) · fdr-005-docs-app
6. Gates        — pnpm --filter @afenda/docs typecheck
                  pnpm --filter @afenda/docs test:run
                  pnpm quality:docs
                  pnpm exec biome check apps/docs
7. Closes       — i18n Partial (UI singular) · Fumadocs-ready ~76%
8. Evidence     — docs-ui-translations.test.ts · layout.tsx i18n prop
9. Attestation  — Contract stability · URL stability (no route changes)
```

---

## Afenda overrides

| Fumadocs label key | Override |
| --- | --- |
| `Search(search trigger)` | Search documentation |
| `Search(search dialog)` | Search documentation |

---

## Known debt

- **Full multilingual i18n** — blocked until product requirement (`defineI18n`, `[lang]` routes, locale content dirs).
- **`@fumadocs/language` preset** — optional when non-English UI is required; not needed for singular English overrides.
