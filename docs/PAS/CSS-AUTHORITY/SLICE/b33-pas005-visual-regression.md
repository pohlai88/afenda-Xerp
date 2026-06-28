# Slice B33 ÔÇö PAS-005 Visual Regression Gate (PAS-005 ┬º13)

**Prerequisite:** [B30 Deprecate design-system CSS monolith](b30-pas005-deprecate-ds-css.md) delivered

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Medium ÔÇö CI contract gate + Storybook composed spot-check reference

## Handoff block

```
Handoff from: docs/PAS/CSS-AUTHORITY/SLICE/b33-pas005-visual-regression.md

1. Objective    ÔÇö Wire automated CSS theme contract gate for PAS-005 cutover; Storybook composed story as ERP/metadata-ui spot-check reference; close PKGR05 knownGap automated-visual-regression-not-wired.
2. Allowed layerÔÇö scripts/css/css-theme-contract.mts ┬À scripts/governance/check-css-visual-regression.mts ┬À packages/ui/src/__tests__/css-theme-contract.test.ts ┬À apps/storybook/stories/governance-integration-composed.stories.tsx (reference) ┬À package.json ┬À docs/PAS/** ┬À foundation-disposition.registry.ts
3. Files        ÔÇö
   scripts/css/css-theme-contract.mts
   scripts/governance/check-css-visual-regression.mts
   packages/ui/src/__tests__/css-theme-contract.test.ts
   package.json
   docs/PAS/CSS-AUTHORITY/SLICE/b33-pas005-visual-regression.md
   docs/PAS/pas-status-index.md
   packages/architecture-authority/src/data/foundation-disposition.registry.ts
4. Prohibited   ÔÇö delete design-system v1; Playwright pixel baselines in this slice (future enhancement)
5. Authority    ÔÇö PAS-005 ┬À PKGR05 ┬À ui-consistency-bundle
6. Gates        ÔÇö
   pnpm check:css-visual-regression
   pnpm --filter @afenda/ui test:run src/__tests__/css-theme-contract.test.ts
   pnpm check:css-governance
   pnpm check:css-authority-bridge-sync
7. Closes       ÔÇö automated-visual-regression-not-wired
8. Evidence     ÔÇö
   scripts/css/css-theme-contract.mts
   apps/storybook/stories/governance-integration-composed.stories.tsx
9. Attestation  ÔÇö Governance ┬À Visual contract (import chain + bridge markers)
```

## Delivery notes

- **Contract gate:** `pnpm check:css-visual-regression` validates B29/B30 import chain, bridge markers, dist bundle, and Storybook composed CSS import order.
- **Manual prod spot-check:** Run Storybook `Governance/Composed ERP Shell` before release; optional future: Playwright pixel baselines under `apps/docs/e2e/visual-proof/`.
