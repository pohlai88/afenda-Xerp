# Slice B28 — CSS Authority Consumption Gates (PAS-005 §7 · §13)

**Prerequisite:** [B27 Vendored shadcn theme](b27-pas005-shadcn-theme.md)

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Medium — governance scripts; baseline scan warnings allowed initially

## Handoff block

```
Handoff from: docs/PAS/CSS-AUTHORITY/SLICE/b28-pas005-consumption-gates.md

1. Objective    — Register @afenda/css-authority in css-registry; add R23—R27 consumption proof rules using CSS Authority Registry allowlist; wire root check script.
2. Allowed layer— scripts/css/** · scripts/governance/check-css-authority-consumption.mts · package.json (check script only) · docs/PAS/CSS-AUTHORITY/SLICE/b28-pas005-consumption-gates.md · docs/PAS/pas-status-index.md
3. Files        —
   scripts/css/css-registry.mts
   scripts/css/check-css-governance.mts
   scripts/governance/check-css-authority-consumption.mts
   package.json
   docs/PAS/CSS-AUTHORITY/SLICE/b28-pas005-consumption-gates.md
   docs/PAS/pas-status-index.md
4. Prohibited   — packages/css-authority runtime dep changes; B29 ui cutover; foundation-disposition.registry.ts
5. Authority    — PAS-005 · PKGR05_CSS_AUTHORITY
6. Gates        —
   pnpm check:css-authority-conformance
   pnpm check:css-governance
   tsx scripts/governance/check-css-authority-consumption.mts
7. Closes       — consumption-gates-r22-r27-not-wired knownGap (partial — design-system shim period)
8. Evidence     —
   scripts/governance/check-css-authority-consumption.mts
   scripts/css/css-registry.mts
9. Attestation  — Governance · Documentation
```
