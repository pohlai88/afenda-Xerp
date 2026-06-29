# Slice B33 — PAS-005 Visual Regression Gate (PAS-005 §13)

**Prerequisite:** [B30 Deprecate design-system CSS monolith](b30-pas005-deprecate-ds-css.md) delivered

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Medium — CI contract gate + Storybook composed spot-check reference

## Handoff block

```
Handoff from: docs/PAS/CSS-AUTHORITY/SLICE/b33-pas005-visual-regression.md

1. Objective    — Wire automated CSS theme contract gate for PAS-005 cutover; Storybook composed story as ERP/metadata-ui spot-check reference; close PKGR05 knownGap automated-visual-regression-not-wired.
2. Allowed layer— scripts/css/css-theme-contract.mts · scripts/governance/check-css-visual-regression.mts · packages/ui/src/__tests__/css-theme-contract.test.ts · apps/storybook/stories/governance-integration-composed.stories.tsx (reference) · package.json · docs/PAS/** · foundation-disposition.registry.ts
3. Files        —
   scripts/css/css-theme-contract.mts
   scripts/governance/check-css-visual-regression.mts
   packages/ui/src/__tests__/css-theme-contract.test.ts
   package.json
   docs/PAS/CSS-AUTHORITY/SLICE/b33-pas005-visual-regression.md
   docs/PAS/pas-status-index.md
   packages/architecture-authority/src/data/foundation-disposition.registry.ts
4. Prohibited   — delete design-system v1; Playwright pixel baselines in this slice (future enhancement)
5. Authority    — PAS-005 · PKGR05 · ui-consistency-bundle
6. Gates        —
   pnpm check:css-visual-regression
   pnpm --filter @afenda/ui test:run src/__tests__/css-theme-contract.test.ts
   pnpm check:css-governance
   pnpm check:css-authority-bridge-sync
7. Closes       — automated-visual-regression-not-wired
8. Evidence     —
   scripts/css/css-theme-contract.mts
   apps/storybook/stories/governance-integration-composed.stories.tsx
9. Attestation  — Governance · Visual contract (import chain + bridge markers)
```

## Delivery notes

- **Contract gate:** `pnpm check:css-visual-regression` validates B29/B30 import chain, bridge markers, dist bundle, and Storybook composed CSS import order.
- **Manual prod spot-check:** Run Storybook `Governance/Composed ERP Shell` before release; optional future: Playwright pixel baselines under `apps/docs/e2e/visual-proof/`.
