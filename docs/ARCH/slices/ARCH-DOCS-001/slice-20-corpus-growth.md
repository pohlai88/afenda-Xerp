# ARCH-DOCS-001 · Slice 20 — Corpus growth (zh body · AutoTypeTable)

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-DOCS-001`](../../%5BComplete%5D%20ARCH-DOCS-001-fumadocs-site.md) |
| **Status** | **Delivered** 2026-06-26 |
| **Prerequisite** | Slice 19 ✓ |
| **Slice type** | Implementation |
| **Runtime owner** | `apps/docs/content/` · `apps/docs/src/` |
| **Closes** | Gap audit zh MDX translation · per-package AutoTypeTable debt (scoped) |

---

## Design (internal-guide)

- **zh translation (scoped):** Translate body copy for `getting-started/index.mdx` and `contributing/index.mdx` in zh (UI labels already localized). Other zh pages remain English with frontmatter title/description zh where trivial.
- **AutoTypeTable:** Add one reference page under `monorepo-map/` documenting a docs-owned contract already in apps/docs (no cross-package `@afenda/*` runtime imports). Mirror en+zh MDX stubs.
- **OpenAPI zh:** Regenerate or stub zh api-reference index cards pointing to en operation pages (from Slice 18).
- Parity tests: zh content files exist for translated pages; seed registry unchanged for slugs.

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-DOCS-001/slice-20-corpus-growth.md

1. Objective    — Expand docs corpus value: translate two zh guide pages and add one scoped AutoTypeTable reference page (docs-local types only).
2. Allowed layer— apps/docs/content/docs/ · apps/docs/src/lib/docs-nav.contract.ts (Modified if new slug)
3. Files        — apps/docs/content/docs/zh/(guides)/getting-started/index.mdx (Modified)
                  apps/docs/content/docs/zh/(guides)/contributing/index.mdx (Modified)
                  apps/docs/content/docs/en/(guides)/monorepo-map/<new-page>.mdx (New)
                  apps/docs/content/docs/zh/(guides)/monorepo-map/<new-page>.mdx (New)
                  apps/docs/content/docs/zh/(guides)/monorepo-map/meta.json (Modified)
                  apps/docs/content/docs/en/(guides)/monorepo-map/meta.json (Modified)
                  apps/docs/src/__tests__/docs-content.test.ts (Modified)
                  docs/ARCH/slices/ARCH-DOCS-001/slice-20-corpus-growth.md (Modified — status)
                  docs/ARCH/slices/ARCH-DOCS-001/slice-index.md (Modified)
                  docs/architecture/fumadocs-feature-gap-audit.md (Modified)
4. Prohibited   — Import @afenda/erp or spine packages for AutoTypeTable paths · verbatim ADR/registry copy (ADR-0012) · apps/erp/**
5. Authority    — ARCH-DOCS-001 · ADR-0012 · docs-app-architecture
6. Gates        — pnpm --filter @afenda/docs typecheck
                  pnpm --filter @afenda/docs test:run
                  pnpm quality:docs
7. Closes       — zh body partial translation · AutoTypeTable corpus +1
8. Evidence     — docs-content.test.ts · SSG route count increase
9. Attestation  — No governance doc duplication
```

---

## Known debt

- Full zh translation of all seed pages remains incremental.
- Per-package `@afenda/*` AutoTypeTable outside docs boundary still blocked.
