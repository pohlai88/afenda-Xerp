# Slice B30 — Deprecate Design-System CSS Monolith (PAS-005 §11)

**Prerequisite:** [B29 Strangler cutover](b29-pas005-ui-cutover.md) delivered

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Medium — backward-compat shim; bridge sync must stay generator-driven

## Handoff block

```
Handoff from: docs/PAS/CSS-AUTHORITY/SLICE/b30-pas005-deprecate-ds-css.md

1. Objective    — Replace afenda-design-system.css monolith with deprecation shim (tokens + css-authority); sync Parts B—F into css-authority via design-system generator; close bridge drift and appshell R19/R20.
2. Allowed layer— packages/design-system/scripts/** · packages/design-system/package.json · packages/design-system/src/__tests__/** · packages/css-authority/src/css/afenda-runtime-bridge.css (generator output) · scripts/css/css-registry.mts · scripts/governance/** · packages/architecture-authority/src/data/dependency-registry.data.ts · packages/architecture-authority/src/data/foundation-disposition.registry.ts · packages/ui/src/__tests__/** · docs/PAS/** · docs/PAS/CSS-AUTHORITY/PAS-005-CSS-AUTHORITY-STANDARD.md
3. Files        —
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
   docs/PAS/CSS-AUTHORITY/PAS-005-CSS-AUTHORITY-STANDARD.md
4. Prohibited   — delete @afenda/design-system; hand-edit generated bridge/registry; apps/erp globals refactor
5. Authority    — PAS-005 · PKGR05 · css-authority skill · package-css-dist-sync
6. Gates        —
   pnpm --filter @afenda/design-system build
   pnpm --filter @afenda/css-authority build
   pnpm check:css-authority-bridge-sync
   pnpm check:css-governance
   pnpm check:css-authority-consumption
   pnpm quality:boundaries
   pnpm check:foundation-disposition
7. Closes       — vendored-shadcn-theme-not-yet-committed · afenda-ui-import-cutover-not-started · consumption-gates-r22-r27-not-wired · bridge drift vs design-system generator
8. Evidence     —
   packages/design-system/scripts/generate-tokens-css.ts
   packages/css-authority/src/css/afenda-runtime-bridge.css
   scripts/governance/check-css-authority-bridge-sync.mts
9. Attestation  — Registry · TypeScript · Governance · Backward-compat shim preserved
```

## Delivery notes

- `generate-tokens-css.ts` emits B30 shim for `afenda-design-system.css` and syncs Parts B—F to `css-authority/afenda-runtime-bridge.css` — **single generator source**, no manual bridge copy.
- `@afenda/design-system` adds approved runtime edge to `@afenda/css-authority` for shim `@import` resolution.
- Appshell R19/R20: `auth-shell.css` registered; budget `maxFiles: 3`.
- Bridge synced on every `pnpm --filter @afenda/design-system build` (B30).
- Visual contract gate: `pnpm check:css-visual-regression` (B33) — Storybook composed story reference.
- Optional before prod: manual spot-check `Governance/Composed ERP Shell` in Storybook; Playwright pixel baselines (B37, future).
