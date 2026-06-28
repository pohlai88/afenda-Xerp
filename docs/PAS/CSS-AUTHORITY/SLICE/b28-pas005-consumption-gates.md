# Slice B28 ÔÇö CSS Authority Consumption Gates (PAS-005 ┬º7 ┬À ┬º13)

**Prerequisite:** [B27 Vendored shadcn theme](b27-pas005-shadcn-theme.md)

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Medium ÔÇö governance scripts; baseline scan warnings allowed initially

## Handoff block

```
Handoff from: docs/PAS/CSS-AUTHORITY/SLICE/b28-pas005-consumption-gates.md

1. Objective    ÔÇö Register @afenda/css-authority in css-registry; add R23ÔÇôR27 consumption proof rules using CSS Authority Registry allowlist; wire root check script.
2. Allowed layerÔÇö scripts/css/** ┬À scripts/governance/check-css-authority-consumption.mts ┬À package.json (check script only) ┬À docs/PAS/CSS-AUTHORITY/SLICE/b28-pas005-consumption-gates.md ┬À docs/PAS/pas-status-index.md
3. Files        ÔÇö
   scripts/css/css-registry.mts
   scripts/css/check-css-governance.mts
   scripts/governance/check-css-authority-consumption.mts
   package.json
   docs/PAS/CSS-AUTHORITY/SLICE/b28-pas005-consumption-gates.md
   docs/PAS/pas-status-index.md
4. Prohibited   ÔÇö packages/css-authority runtime dep changes; B29 ui cutover; foundation-disposition.registry.ts
5. Authority    ÔÇö PAS-005 ┬À PKGR05_CSS_AUTHORITY
6. Gates        ÔÇö
   pnpm check:css-authority-conformance
   pnpm check:css-governance
   tsx scripts/governance/check-css-authority-consumption.mts
7. Closes       ÔÇö consumption-gates-r22-r27-not-wired knownGap (partial ÔÇö design-system shim period)
8. Evidence     ÔÇö
   scripts/governance/check-css-authority-consumption.mts
   scripts/css/css-registry.mts
9. Attestation  ÔÇö Governance ┬À Documentation
```
