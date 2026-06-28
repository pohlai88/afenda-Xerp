# Slice B42l — afenda-appshell-studio.css Consolidation (PAS-005A §14)

**Prerequisite:** B42h delivered — studio CSS retained as internal layer; B42j deferred consolidation

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Low — documentation + deduplication comments; no css-authority JSON mutation

**Clean Core impact:** A→A — clarifies studio vs block-local CSS ownership; manifest invariants unchanged

## Handoff block

```
Handoff from: docs/PAS/slice/b42l-pas005a-studio-css-consolidation.md

1. Objective    — Document PAS-005A B42l consolidation intent in afenda-appshell-studio.css; verify no duplicate selectors vs afenda-appshell.css; add css-manifest.test.ts B42l invariant; sync dist if CSS changed.
2. Allowed layer— packages/appshell/src/styles/afenda-appshell-studio.css · packages/appshell/src/styles/afenda-appshell.css (comment-only dedup) · packages/appshell/src/__tests__/css-manifest.test.ts · docs/PAS/slice/b42l-*.md · docs/PAS/pas-status-index.md · docs/PAS/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md (§14 row) · docs/PAS/slice/b42j-pas005a-wrapper-expansion-delegating-flip.md (deferred section)
3. Files        — afenda-appshell-studio.css · afenda-appshell.css (comments only) · css-manifest.test.ts · slice doc · pas-status-index · PAS-005A §14 · b42j deferred
4. Prohibited   — foundation-disposition.registry.ts · remove afenda-appshell-studio.css · css-authority JSON/registry mutation · new --afenda-* definitions in studio CSS
5. Authority    — PAS-005A · css-manifest.ts · package-css-dist-sync · css-authority consumption doctrine
6. Gates        —
   pnpm --filter @afenda/appshell test:run
   pnpm sync:package-css-dist -- --package @afenda/appshell
   pnpm check:package-css-dist-sync
   pnpm ui:guard:scan
7. Closes       — B42l section header · KPI/sparkline vs statistics-metric namespace documentation · no duplicate selector proof · css-manifest B42l invariant test
8. Evidence     — css-manifest.test.ts · check:package-css-dist-sync · ui:guard:scan
9. Attestation  — Studio CSS consolidation · Manifest invariants · Gate evidence
```

## Namespace split (post-B42l)

| Pattern family | File | Class prefix | Use |
| --- | --- | --- | --- |
| Reusable studio KPI/sparkline | `afenda-appshell-studio.css` §B–C | `.app-shell-studio-metric-*` / `.app-shell-studio-sparkline-*` | Dashboard KPI widgets |
| Block-local statistics cards | `afenda-appshell.css` §statistics-metric | `.app-shell-statistics-metric-*` | Governed/delegating statistics card geometry |
| Auth editorial | `afenda-appshell-studio.css` §L | `.app-shell-studio-auth-*` | Login/error surfaces |

## DoD

- [x] Slice doc with 9-field handoff
- [x] B42l consolidation header in studio CSS
- [x] Comments confirm no duplicate selectors between files
- [x] css-manifest.test.ts B42l invariant
- [x] CSS dist sync + check pass
- [x] All gates run with evidence
