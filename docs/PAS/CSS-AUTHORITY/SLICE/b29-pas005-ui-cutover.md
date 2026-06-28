# Slice B29 ÔÇö Strangler Cutover `afenda-ui.css` (PAS-005 ┬º8 ┬À ┬º11)

**Prerequisite:** [B28 Consumption gates](b28-pas005-consumption-gates.md) delivered

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** High ÔÇö runtime CSS composition change; visual parity required

## Handoff block

```
Handoff from: docs/PAS/CSS-AUTHORITY/SLICE/b29-pas005-ui-cutover.md

1. Objective    ÔÇö Cut over @afenda/ui/afenda-ui.css to import afenda-tokens + @afenda/css-authority bundle; migrate runtime theme bridge (Parts BÔÇôF) into css-authority; preserve --afenda-* from design-system tokens shim.
2. Allowed layerÔÇö packages/ui/src/styles/** ┬À packages/ui/package.json ┬À packages/ui/src/__tests__/** ┬À packages/ui/src/styles/css-manifest.ts ┬À packages/css-authority/src/css/** ┬À packages/css-authority/scripts/generate-css-authority-registry.ts ┬À packages/architecture-authority/src/data/dependency-registry.data.ts ┬À scripts/css/css-registry.mts ┬À docs/PAS/CSS-AUTHORITY/SLICE/b29-pas005-ui-cutover.md ┬À docs/PAS/pas-status-index.md
3. Files        ÔÇö
   packages/ui/src/styles/afenda-ui.css
   packages/ui/src/styles/css-manifest.ts
   packages/ui/src/__tests__/primitive-boundary.test.ts
   packages/ui/package.json
   packages/css-authority/src/css/afenda-runtime-bridge.css
   packages/css-authority/scripts/generate-css-authority-registry.ts
   packages/css-authority/src/authorities/css-files.json
   scripts/css/css-registry.mts
   packages/architecture-authority/src/data/dependency-registry.data.ts
   docs/PAS/CSS-AUTHORITY/SLICE/b29-pas005-ui-cutover.md
   docs/PAS/pas-status-index.md
4. Prohibited   ÔÇö packages/design-system/src/css/** edits (B30); delete design-system; foundation-disposition.registry.ts; apps/erp globals beyond test impact
5. Authority    ÔÇö PAS-005 ┬À PKGR05 ┬À css-authority skill ┬À package-css-dist-sync
6. Gates        ÔÇö
   pnpm --filter @afenda/css-authority build
   pnpm --filter @afenda/ui build
   pnpm sync:package-css-dist -- --package @afenda/ui
   pnpm --filter @afenda/ui test:run
   pnpm check:css-authority-consumption
   pnpm quality:boundaries
7. Closes       ÔÇö afenda-ui-import-cutover-not-started knownGap
8. Evidence     ÔÇö
   packages/ui/src/styles/afenda-ui.css
   packages/css-authority/src/css/afenda-runtime-bridge.css
9. Attestation  ÔÇö Registry ┬À TypeScript ┬À Governance ┬À Visual parity (token chain preserved)
```
