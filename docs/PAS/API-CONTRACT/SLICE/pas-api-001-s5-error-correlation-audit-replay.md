# PAS-API-001-S5 — Error / Correlation / Audit Replay

| Field | Value |
| --- | --- |
| **Slice ID** | PAS-API-001-S5 |
| **Parent PAS** | [PAS-API-001](../PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) |
| **Status** | Planned |
| **Scope** | API-009 · API-010 · API-011 |
| **Prerequisite** | S4 Delivered |

> **Position:** slice `5 of 9`

**Type:** Implementation

## 0. Purpose

Cross-style **error semantics**, **correlation identity**, and **audit replay minimum** fact model — binding layers map to ProblemDetail, gRPC status, GraphQL errors, etc.

## 3. Contract Surfaces

`core/api-audit-replay.contract.ts` · correlation fields · error doctrine types

## Handoff block

```
Handoff from: docs/PAS/API-CONTRACT/SLICE/pas-api-001-s5-error-correlation-audit-replay.md
1. Objective    — Family audit replay minimum + correlation contract; align with kernel trace vocabulary.
2. Allowed layer— apps/erp/src/server/api/contracts/core/** · api-envelope.contract.ts · api-error.contract.ts
3. Files        — core/api-audit-replay.contract.ts · api-envelope.contract.ts · api-error.contract.ts · __tests__/
4. Prohibited   — HTTP status mapping · log sinks · kernel amendments without slice
5. Authority    — PAS-API-001 API-009–011 · PAS-001 trace vocabulary
6. Gates        — pnpm --filter @afenda/erp typecheck · pnpm --filter @afenda/erp test:run
7. Closes       — DoD #1–#3
8. Evidence     — core/api-audit-replay.contract.ts · envelope/error contract tests
9. Attestation  — Contract · Test · Observability
```

## 5. DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Audit replay minimum fields documented as readonly contract | test |
| 2 | Correlation required on governed operation class | test |
| 3 | Error doctrine type is style-agnostic | manual review |

## 9. Hard Stops

No RFC 9457 field layout in family layer — REST binding maps it.
