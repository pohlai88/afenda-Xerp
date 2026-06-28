# Slice B42l ÔÇö afenda-appshell-studio.css Consolidation (PAS-005A ┬º14)

**Prerequisite:** B42h delivered ÔÇö studio CSS retained as internal layer; B42j deferred consolidation

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Low ÔÇö documentation + deduplication comments; no css-authority JSON mutation

**Clean Core impact:** AÔåÆA ÔÇö clarifies studio vs block-local CSS ownership; manifest invariants unchanged

## Handoff block

```
Handoff from: docs/PAS/CSS-AUTHORITY/SLICE/b42l-pas005a-studio-css-consolidation.md

1. Objective    ÔÇö Document PAS-005A B42l consolidation intent in afenda-appshell-studio.css; verify no duplicate selectors vs afenda-appshell.css; add css-manifest.test.ts B42l invariant; sync dist if CSS changed.
2. Allowed layerÔÇö packages/appshell/src/styles/afenda-appshell-studio.css ┬À packages/appshell/src/styles/afenda-appshell.css (comment-only dedup) ┬À packages/appshell/src/__tests__/css-manifest.test.ts ┬À docs/PAS/CSS-AUTHORITY/SLICE/b42l-*.md ┬À docs/PAS/pas-status-index.md ┬À docs/PAS/CSS-AUTHORITY/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md (┬º14 row) ┬À docs/PAS/CSS-AUTHORITY/SLICE/b42j-pas005a-wrapper-expansion-delegating-flip.md (deferred section)
3. Files        ÔÇö afenda-appshell-studio.css ┬À afenda-appshell.css (comments only) ┬À css-manifest.test.ts ┬À slice doc ┬À pas-status-index ┬À PAS-005A ┬º14 ┬À b42j deferred
4. Prohibited   ÔÇö foundation-disposition.registry.ts ┬À remove afenda-appshell-studio.css ┬À css-authority JSON/registry mutation ┬À new --afenda-* definitions in studio CSS
5. Authority    ÔÇö PAS-005A ┬À css-manifest.ts ┬À package-css-dist-sync ┬À css-authority consumption doctrine
6. Gates        ÔÇö
   pnpm --filter @afenda/appshell test:run
   pnpm sync:package-css-dist -- --package @afenda/appshell
   pnpm check:package-css-dist-sync
   pnpm ui:guard:scan
7. Closes       ÔÇö B42l section header ┬À KPI/sparkline vs statistics-metric namespace documentation ┬À no duplicate selector proof ┬À css-manifest B42l invariant test
8. Evidence     ÔÇö css-manifest.test.ts ┬À check:package-css-dist-sync ┬À ui:guard:scan
9. Attestation  ÔÇö Studio CSS consolidation ┬À Manifest invariants ┬À Gate evidence
```

## Namespace split (post-B42l)

| Pattern family | File | Class prefix | Use |
| --- | --- | --- | --- |
| Reusable studio KPI/sparkline | `afenda-appshell-studio.css` ┬ºBÔÇôC | `.app-shell-studio-metric-*` / `.app-shell-studio-sparkline-*` | Dashboard KPI widgets |
| Block-local statistics cards | `afenda-appshell.css` ┬ºstatistics-metric | `.app-shell-statistics-metric-*` | Governed/delegating statistics card geometry |
| Auth editorial | `afenda-appshell-studio.css` ┬ºL | `.app-shell-studio-auth-*` | Login/error surfaces |

## DoD

- [x] Slice doc with 9-field handoff
- [x] B42l consolidation header in studio CSS
- [x] Comments confirm no duplicate selectors between files
- [x] css-manifest.test.ts B42l invariant
- [x] CSS dist sync + check pass
- [x] All gates run with evidence

## Deferred (post-B42l ÔÇö closed in B42m)

- ~~Bridge-index placeholder wrapperPaths for hero, auth parity rows, chart-component-02, statistics orders/sales overview~~ ÔÇö closed in B42m
