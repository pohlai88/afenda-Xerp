# Slice B34 ÔÇö PAS-005 Registry Expansion (PAS-005 ┬º14 P1)

**Prerequisite:** [B33 Visual Regression Gate](b33-pas005-visual-regression.md) delivered

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Medium ÔÇö authority JSON population + generator sync wiring

## Handoff block

```
Handoff from: docs/PAS/CSS-AUTHORITY/SLICE/b34-pas005-registry-expansion.md

1. Objective    ÔÇö Populate afenda-extensions, appshell, and auth-editorial authority JSON domains with CSS-TOKEN-* rows synced from source CSS; wire domain sync into generate-css-authority-registry.ts.
2. Allowed layerÔÇö packages/css-authority/** ┬À docs/PAS/CSS-AUTHORITY/SLICE/b34-pas005-registry-expansion.md ┬À docs/PAS/pas-status-index.md ┬À docs/PAS/CSS-AUTHORITY/PAS-005-CSS-AUTHORITY-STANDARD.md (┬º14 + header metadata)
3. Files        ÔÇö
   packages/css-authority/scripts/sync-domain-authority.ts
   packages/css-authority/scripts/generate-css-authority-registry.ts
   packages/css-authority/src/authorities/afenda-extensions.json
   packages/css-authority/src/authorities/appshell.json
   packages/css-authority/src/authorities/auth-editorial.json
   packages/css-authority/src/authorities/id-sequence.json
   packages/css-authority/src/__tests__/domain-authority-sync.test.ts
   docs/PAS/CSS-AUTHORITY/SLICE/b34-pas005-registry-expansion.md
   docs/PAS/pas-status-index.md
   docs/PAS/CSS-AUTHORITY/PAS-005-CSS-AUTHORITY-STANDARD.md
4. Prohibited   ÔÇö packages/ui/** ┬À packages/design-system/** (except reading generated afenda-tokens.css) ┬À apps/** ┬À hand-edit src/generated/*
5. Authority    ÔÇö PAS-005 ┬À PKGR05_CSS_AUTHORITY ┬À css-authority skill
6. Gates        ÔÇö
   pnpm --filter @afenda/css-authority typecheck
   pnpm --filter @afenda/css-authority test:run
   pnpm --filter @afenda/css-authority build
   pnpm check:css-authority-conformance
   pnpm check:css-authority-consumption
   pnpm check:css-authority-bridge-sync
   pnpm check:css-visual-regression
   pnpm check:css-governance
7. Closes       ÔÇö empty afenda-extensions.json ┬À empty appshell.json ┬À empty auth-editorial.json
8. Evidence     ÔÇö
   packages/css-authority/scripts/sync-domain-authority.ts
   packages/css-authority/src/authorities/*.json (568 merged tokens)
9. Attestation  ÔÇö Registry-first ┬À Generator-synced ┬À No hand-edited generated registry
```

## Delivery notes

- **Token counts:** 465 `--afenda-*` ┬À 43 `--app-shell-*` (`.app-shell-root` block) ┬À 14 `--auth-editorial-*` ┬À 46 shadcn (unchanged) ÔåÆ **568 total**.
- **Id sequence:** `nextTokenId` 569 after B34 allocation (CSS-TOKEN-047 through CSS-TOKEN-568).
- **Known gap (out of scope):** `--app-shell-content-padding-inline` is consumed in `afenda-appshell.css` but not defined in the `.app-shell-root` block ÔÇö report only; appshell slice owns remediation.
