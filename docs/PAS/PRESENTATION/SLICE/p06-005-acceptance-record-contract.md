# Slice P06-005 — Acceptance Record Wire Contract (PAS-006C)

> **Position:** Slice `5 of 10` · Blueprint box: **shadcn/studio Presentation**

**Prerequisite:** P06-004 Delivered

**Status:** Not started

**Type:** Implementation

## Handoff block

```
Handoff from: docs/PAS/PRESENTATION/SLICE/p06-005-acceptance-record-contract.md

1. Objective    — Deliver Acceptance Record wire contract and seal validator per PAS-006C §1.
2. Allowed layer— packages/shadcn-studio only
3. Files        —
   packages/shadcn-studio/src/contracts/acceptance-record.contract.ts
   packages/shadcn-studio/src/contracts/acceptance-record.validator.ts
   packages/shadcn-studio/src/__tests__/acceptance-record.contract.test.ts
   packages/shadcn-studio/src/index.ts
4. Prohibited   — ERP auth route wiring without P06-007 · kernel import
5. Authority    — PAS-006C §1 · NS §8.2
6. Gates        —
   pnpm --filter @afenda/shadcn-studio typecheck
   pnpm --filter @afenda/shadcn-studio test:run
7. Closes       — Closes DoD #1–#2
8. Evidence     —
   packages/shadcn-studio/src/contracts/acceptance-record.contract.ts
   packages/shadcn-studio/src/__tests__/acceptance-record.contract.test.ts
9. Attestation  — Contract · Test
```

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Acceptance Record JSON-serializable | `acceptance-record.contract.test.ts` |
| 2 | Seal requires Metadata-bound+ lifecycle | `acceptance-record.contract.test.ts` |
