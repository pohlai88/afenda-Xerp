# Slice P06-006 — ACPA Block Acceptance Gate Suite (PAS-006C)

> **Position:** Slice `6 of 10` · Blueprint box: **shadcn/studio Presentation**

**Prerequisite:** P06-005 Delivered

**Status:** Not started

**Type:** Implementation

## Handoff block

```
Handoff from: docs/PAS/PRESENTATION/SLICE/p06-006-acpa-acceptance-gates.md

1. Objective    — Add check:studio-block-acpa-acceptance gate and extend ACPA contract tests.
2. Allowed layer— packages/shadcn-studio · scripts/governance
3. Files        —
   scripts/governance/check-studio-block-acpa-acceptance.mjs
   packages/shadcn-studio/src/__tests__/statistics-metric-a11y.contract.test.tsx
   package.json
4. Prohibited   — WCAG auth pack (P06-007) · ERP route changes
5. Authority    — PAS-006C §3 ACPA profile
6. Gates        —
   pnpm check:studio-block-acpa-acceptance
   pnpm --filter @afenda/shadcn-studio test:run
7. Closes       — Closes DoD #1–#2
8. Evidence     —
   scripts/governance/check-studio-block-acpa-acceptance.mjs
9. Attestation  — Test · Governance
```

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | ACPA gate script exists and passes | `pnpm check:studio-block-acpa-acceptance` |
| 2 | Statistics metric ACPA pattern retained | `statistics-metric-a11y.contract.test.tsx` |
