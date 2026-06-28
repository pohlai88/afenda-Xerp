# Slice B37 ÔÇö PAS-005 Playwright Pixel Baselines (PAS-005 ┬º14 P4)

**Prerequisite:** [B33 Visual Regression Gate](b33-pas005-visual-regression.md) delivered

**Status:** Delivered (2026-06-28)

**Type:** Visual proof ÔÇö Playwright pixel baselines for docs CSS theme

**Risk class:** Low ÔÇö docs-only E2E; structural gate extends B33 contract

## Handoff block

```
Handoff from: docs/PAS/CSS-AUTHORITY/SLICE/b37-pas005-pixel-baselines.md

1. Objective    ÔÇö Wire Playwright pixel baseline tests for docs use-erp CSS theme (light header, light cards, dark page); extend B33 contract gate to verify pixel baseline wiring; close PAS-005 ┬º14 P4.
2. Allowed layerÔÇö apps/docs/e2e/** ┬À apps/docs/playwright.config.mts ┬À scripts/css/css-theme-contract.mts ┬À scripts/governance/check-css-visual-regression.mts ┬À docs/PAS/**
3. Files        ÔÇö
   apps/docs/e2e/docs-pixel-baseline.spec.ts
   apps/docs/e2e/visual-proof/use-erp-dark.png
   apps/docs/e2e/visual-proof/use-erp-light-cards.png
   apps/docs/e2e/visual-proof/use-erp-light-header.png
   apps/docs/playwright.config.mts
   scripts/css/css-theme-contract.mts
   scripts/governance/check-css-visual-regression.mts
   docs/PAS/CSS-AUTHORITY/SLICE/b37-pas005-pixel-baselines.md
   docs/PAS/CSS-AUTHORITY/PAS-005-CSS-AUTHORITY-STANDARD.md
   docs/PAS/pas-status-index.md
4. Prohibited   ÔÇö ERP playwright changes ┬À delete design-system CSS ┬À packages/css-authority registry edits
5. Authority    ÔÇö PAS-005 ┬À CSS Authority ┬À ui-consistency-bundle
6. Gates        ÔÇö
   pnpm check:css-visual-regression
   pnpm --filter @afenda/docs typecheck
   pnpm --filter @afenda/docs test:run
   pnpm --filter @afenda/docs build
   pnpm --filter @afenda/docs test:visual -- --grep @pixel
   pnpm check:css-governance
   pnpm ci:biome (changed TS)
7. Closes       ÔÇö PAS-005 ┬º14 P4 Playwright pixel baselines ┬À B33 deferred pixel compare
8. Evidence     ÔÇö
   apps/docs/e2e/docs-pixel-baseline.spec.ts
   apps/docs/e2e/visual-proof/*.png
   scripts/css/css-theme-contract.mts (pixel wiring checks)
9. Attestation  ÔÇö Governance ┬À Visual contract (import chain + pixel baselines)
```

## Delivery notes

- **Pixel spec:** `apps/docs/e2e/docs-pixel-baseline.spec.ts` ÔÇö three `@visual @pixel` tests on `/en/docs/use-erp` using committed baselines under `visual-proof/`.
- **Playwright config:** `pathTemplate: '{testDir}/visual-proof/{arg}{ext}'`, viewport 1280├ù720, `maxDiffPixelRatio: 0.02`, `animations: 'disabled'`.
- **B33 extension:** `pnpm check:css-visual-regression` verifies pixel spec, three baseline PNGs, `@pixel` + `toHaveScreenshot`, and `test:visual` script.
- **Baseline refresh:** `cd apps/docs && pnpm build && pnpm exec playwright test --grep @pixel --update-snapshots` (requires local/CI Chromium).
- **CI note:** Structural gate passes without browser; pixel compare runs via `pnpm --filter @afenda/docs test:visual -- --grep @pixel` when Chromium is available.
