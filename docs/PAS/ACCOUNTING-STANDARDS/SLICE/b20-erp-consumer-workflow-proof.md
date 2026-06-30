# Slice B20 — ERP Consumer Workflow Proof (PAS-003 §11.6)

**Prerequisite:** B12 delivered · B17–B19 delivered

**Status:** Delivered (2026-06-30)

**Type:** ERP consumer

## Purpose

Wire `apps/erp` to import `validatePostingAgainstAccountingStandards`, persist evidence snapshots in workflow output, and satisfy consumer proof gate (ADR-0027).

**Implementation target:** `apps/erp/src/lib/accounting-standards/**` · protected readiness route

## Consumer proof checklist (B12 prerequisite)

- [x] ERP route or server module imports `validatePostingAgainstAccountingStandards`
- [x] Evidence snapshot displayed or persisted in workflow
- [x] Gate `check:accounting-standards-metadata-consumer-proof` passes against `apps/erp`
- [x] PAS-003 maturity block updated to Enterprise Accepted

## Handoff block

```
Handoff from: docs/PAS/ACCOUNTING-STANDARDS/SLICE/b20-erp-consumer-workflow-proof.md

1. Objective    — ERP consumer workflow proof for PAS-003 validation + evidence.
2. Allowed layer— apps/erp/src/lib/accounting-standards/** · apps/erp route
3. Files        —
   apps/erp/src/lib/accounting-standards/run-accounting-standards-validation.server.ts
   apps/erp/src/lib/accounting-standards/load-accounting-standards-readiness-page.server.ts
   apps/erp/src/app/(protected)/modules/accounting/standards-readiness/page.tsx
   scripts/governance/check-accounting-standards-metadata-consumer-proof.mts
4. Prohibited   — journal posting · @afenda/accounting runtime
5. Authority    — PAS-003 §11.6 · ADR-0027
6. Gates        —
   pnpm --filter @afenda/erp typecheck
   pnpm check:accounting-standards-metadata-consumer-proof
7. Closes       — Enterprise Accepted consumer proof path
8. Evidence     — readiness route + consumer gate PASS
9. Attestation  — ERP consumer · Gate
```
