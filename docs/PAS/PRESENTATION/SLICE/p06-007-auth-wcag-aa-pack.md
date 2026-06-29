# Slice P06-007 — Auth-Adjacent WCAG 2.2 AA Pack (PAS-006C)

> **Position:** Slice `7 of 10` · Blueprint box: **shadcn/studio Presentation**

**Prerequisite:** P06-005 Delivered

**Status:** Delivered

**Type:** Implementation

## Handoff block

```
Handoff from: docs/PAS/PRESENTATION/SLICE/p06-007-auth-wcag-aa-pack.md

1. Objective    — Auth-adjacent WCAG 2.2 AA acceptance pack + check:studio-auth-surface-wcag-aa gate.
2. Allowed layer— packages/shadcn-studio · apps/erp/src/app/(auth)/** tests only
3. Files        —
   scripts/governance/check-studio-auth-surface-wcag-aa.mjs
   apps/erp/src/app/(auth)/__tests__/auth-wcag-aa.contract.test.tsx
   package.json
4. Prohibited   — Non-auth block WCAG scope creep · kernel in studio
5. Authority    — PAS-006C §4 · NS §3.7 criterion #10
6. Gates        —
   pnpm check:studio-auth-surface-wcag-aa
   pnpm --filter @afenda/erp test:run
7. Closes       — Closes DoD #1–#2
8. Evidence     —
   scripts/governance/check-studio-auth-surface-wcag-aa.mjs
   apps/erp/src/app/(auth)/__tests__/auth-wcag-aa.contract.test.tsx
9. Attestation  — Test · Governance · Security
```

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | WCAG AA gate covers auth route surfaces | `pnpm check:studio-auth-surface-wcag-aa` |
| 2 | Auth contract test passes | `auth-wcag-aa.contract.test.tsx` |
