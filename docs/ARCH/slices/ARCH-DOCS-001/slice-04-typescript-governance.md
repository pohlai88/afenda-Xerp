# ARCH-DOCS-001 · Slice 4 — TypeScript governance + test helper dedup

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-DOCS-001`](../../%5BPartially%20Implemented%5D%20ARCH-DOCS-001-fumadocs-site.md) |
| **Status** | Delivered (2026-06-25) |
| **Prerequisite** | Slices 1–3 ✓ |
| **Slice type** | Implementation |
| **Runtime owner** | `apps/docs/src/` |
| **Closes** | Principal TS objectives #1–3 · #5 · #7–9 · ARCH DoD #5 reaffirmed |

---

## Design (internal-guide)

- Extract `collectSourceFiles`, `hasRuntimeImport`, `hasErpPathImport`, and `bannedRuntimeImports` into `src/__tests__/helpers/docs-import-scan.ts` — single authority for no-ERP-coupling scans (import-statement detection only; prose references allowed).
- Extract `slugToMdxPath` into `src/__tests__/helpers/slug-to-mdx-path.ts` with `contentRoot` parameter — shared by seed-page-registry and future MDX parity tests.
- Tighten `buildGraph()` reference extraction with a type-narrowing guard on `page.data.extractedReferences` instead of loose `Array.isArray`.
- Preserve all public exports from `docs-nav.contract.ts`, `docs-page.ts`, and block barrels — backward compatible.
- No new runtime dependencies; helpers are test-only under `__tests__/helpers/`.

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-DOCS-001/slice-04-typescript-governance.md

1. Objective    — Deduplicate docs-app import-scan and MDX path test utilities; tighten build-graph reference typing without behavior change.
2. Allowed layer— apps/docs/src/
3. Files        — apps/docs/src/__tests__/helpers/docs-import-scan.ts (New)
                  apps/docs/src/__tests__/helpers/slug-to-mdx-path.ts (New)
                  apps/docs/src/__tests__/no-afenda-runtime-imports.test.ts (Modified)
                  apps/docs/src/__tests__/no-erp-runtime-coupling.test.ts (Modified)
                  apps/docs/src/__tests__/seed-page-registry.test.ts (Modified)
                  apps/docs/src/lib/build-graph.ts (Modified)
                  docs/ARCH/slices/ARCH-DOCS-001/slice-04-typescript-governance.md (Modified — status)
                  docs/ARCH/[Partially Implemented] ARCH-DOCS-001-fumadocs-site.md (Modified — Slice 4 row)
4. Prohibited   — packages/* · apps/erp/* · @afenda/accounting · @afenda/* runtime imports · ARCH [Complete] rename · breaking nav contract exports
5. Authority    — ARCH-DOCS-001 · afenda-coding-session PATTERNS.md · fdr-005-docs-app prohibited rules
6. Gates        — pnpm --filter @afenda/docs typecheck
                  pnpm --filter @afenda/docs test:run
                  pnpm exec biome check apps/docs
                  pnpm quality:docs
7. Closes       — Principal TS #1–3 · #5 · #7–9 · import-scan DRY
8. Evidence     — helpers/*.ts · test:run 83+ pass · typecheck exit 0
9. Attestation  — Maintainability · Test coverage · Contract stability
```

---

## DoD rows this slice advances

| # | Criterion | Gate |
| --- | --- | --- |
| 5 | TypeScript strict | `pnpm --filter @afenda/docs typecheck` |
| 4 | Negative path tested | `no-afenda-runtime-imports.test.ts` |
| 15 | Security path verified | `no-erp-runtime-coupling.test.ts` |

---

## Known debt

- DoD #20 Architecture Authority human sign-off (Slice 5)
- Waiver `docs-live-dns` — operator step
