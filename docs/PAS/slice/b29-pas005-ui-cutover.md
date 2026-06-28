# Slice B29 — Strangler Cutover `afenda-ui.css` (PAS-005 §8 · §11)

**Prerequisite:** [B28 Consumption gates](b28-pas005-consumption-gates.md) delivered

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** High — runtime CSS composition change; visual parity required

## Handoff block

```
Handoff from: docs/PAS/slice/b29-pas005-ui-cutover.md

1. Objective    — Cut over @afenda/ui/afenda-ui.css to import afenda-tokens + @afenda/css-authority bundle; migrate runtime theme bridge (Parts B–F) into css-authority; preserve --afenda-* from design-system tokens shim.
2. Allowed layer— packages/ui/src/styles/** · packages/ui/package.json · packages/ui/src/__tests__/** · packages/ui/src/styles/css-manifest.ts · packages/css-authority/src/css/** · packages/css-authority/scripts/generate-css-authority-registry.ts · packages/architecture-authority/src/data/dependency-registry.data.ts · scripts/css/css-registry.mts · docs/PAS/slice/b29-pas005-ui-cutover.md · docs/PAS/pas-status-index.md
3. Files        —
   packages/ui/src/styles/afenda-ui.css
   packages/ui/src/styles/css-manifest.ts
   packages/ui/src/__tests__/primitive-boundary.test.ts
   packages/ui/package.json
   packages/css-authority/src/css/afenda-runtime-bridge.css
   packages/css-authority/scripts/generate-css-authority-registry.ts
   packages/css-authority/src/authorities/css-files.json
   scripts/css/css-registry.mts
   packages/architecture-authority/src/data/dependency-registry.data.ts
   docs/PAS/slice/b29-pas005-ui-cutover.md
   docs/PAS/pas-status-index.md
4. Prohibited   — packages/design-system/src/css/** edits (B30); delete design-system; foundation-disposition.registry.ts; apps/erp globals beyond test impact
5. Authority    — PAS-005 · PKGR05 · css-authority skill · package-css-dist-sync
6. Gates        —
   pnpm --filter @afenda/css-authority build
   pnpm --filter @afenda/ui build
   pnpm sync:package-css-dist -- --package @afenda/ui
   pnpm --filter @afenda/ui test:run
   pnpm check:css-authority-consumption
   pnpm quality:boundaries
7. Closes       — afenda-ui-import-cutover-not-started knownGap
8. Evidence     —
   packages/ui/src/styles/afenda-ui.css
   packages/css-authority/src/css/afenda-runtime-bridge.css
9. Attestation  — Registry · TypeScript · Governance · Visual parity (token chain preserved)
```
