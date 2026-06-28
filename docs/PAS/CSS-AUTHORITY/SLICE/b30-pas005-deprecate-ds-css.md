# Slice B30 ÔÇö Deprecate Design-System CSS Monolith (PAS-005 ┬º11)

**Prerequisite:** [B29 Strangler cutover](b29-pas005-ui-cutover.md) delivered

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Medium ÔÇö backward-compat shim; bridge sync must stay generator-driven

## Handoff block

```
Handoff from: docs/PAS/CSS-AUTHORITY/SLICE/b30-pas005-deprecate-ds-css.md

1. Objective    ÔÇö Replace afenda-design-system.css monolith with deprecation shim (tokens + css-authority); sync Parts BÔÇôF into css-authority via design-system generator; close bridge drift and appshell R19/R20.
2. Allowed layerÔÇö packages/design-system/scripts/** ┬À packages/design-system/package.json ┬À packages/design-system/src/__tests__/** ┬À packages/css-authority/src/css/afenda-runtime-bridge.css (generator output) ┬À scripts/css/css-registry.mts ┬À scripts/governance/** ┬À packages/architecture-authority/src/data/dependency-registry.data.ts ┬À packages/architecture-authority/src/data/foundation-disposition.registry.ts ┬À packages/ui/src/__tests__/** ┬À docs/PAS/** ┬À docs/architecture/css-authority.md
3. Files        ÔÇö
   packages/design-system/scripts/generate-tokens-css.ts
   packages/design-system/package.json
   packages/design-system/src/css/afenda-design-system.css (generated shim)
   packages/css-authority/src/css/afenda-runtime-bridge.css (generated sync)
   scripts/css/css-registry.mts
   scripts/governance/check-css-authority-bridge-sync.mts
   scripts/governance/package-css-dist-policy.mjs
   packages/architecture-authority/src/data/dependency-registry.data.ts
   packages/architecture-authority/src/data/foundation-disposition.registry.ts
   packages/ui/src/__tests__/css-manifest.test.ts
   docs/PAS/CSS-AUTHORITY/SLICE/b30-pas005-deprecate-ds-css.md
   docs/PAS/pas-status-index.md
   docs/architecture/css-authority.md
4. Prohibited   ÔÇö delete @afenda/design-system; hand-edit generated bridge/registry; apps/erp globals refactor
5. Authority    ÔÇö PAS-005 ┬À PKGR05 ┬À css-authority skill ┬À package-css-dist-sync
6. Gates        ÔÇö
   pnpm --filter @afenda/design-system build
   pnpm --filter @afenda/css-authority build
   pnpm check:css-authority-bridge-sync
   pnpm check:css-governance
   pnpm check:css-authority-consumption
   pnpm quality:boundaries
   pnpm check:foundation-disposition
7. Closes       ÔÇö vendored-shadcn-theme-not-yet-committed ┬À afenda-ui-import-cutover-not-started ┬À consumption-gates-r22-r27-not-wired ┬À bridge drift vs design-system generator
8. Evidence     ÔÇö
   packages/design-system/scripts/generate-tokens-css.ts
   packages/css-authority/src/css/afenda-runtime-bridge.css
   scripts/governance/check-css-authority-bridge-sync.mts
9. Attestation  ÔÇö Registry ┬À TypeScript ┬À Governance ┬À Backward-compat shim preserved
```

## Delivery notes

- `generate-tokens-css.ts` emits B30 shim for `afenda-design-system.css` and syncs Parts BÔÇôF to `css-authority/afenda-runtime-bridge.css` ÔÇö **single generator source**, no manual bridge copy.
- `@afenda/design-system` adds approved runtime edge to `@afenda/css-authority` for shim `@import` resolution.
- Appshell R19/R20: `auth-shell.css` registered; budget `maxFiles: 3`.
- Bridge synced on every `pnpm --filter @afenda/design-system build` (B30).
- Visual contract gate: `pnpm check:css-visual-regression` (B33) ÔÇö Storybook composed story reference.
- Optional before prod: manual spot-check `Governance/Composed ERP Shell` in Storybook; Playwright pixel baselines (B37, future).
