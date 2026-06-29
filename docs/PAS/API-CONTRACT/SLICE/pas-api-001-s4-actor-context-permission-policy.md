# PAS-API-001-S4 — Actor / Context / Permission Policy

| Field | Value |
| --- | --- |
| **Slice ID** | PAS-API-001-S4 |
| **Parent PAS** | [PAS-API-001](../PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) |
| **Status** | Planned |
| **Scope** | API-006 · API-007 · API-008 |
| **Prerequisite** | S3 Delivered |

> **Position:** slice `4 of 9`

**Type:** Implementation

## 0. Purpose

Family-level **actor**, **operating context**, and **permission declaration** contracts — distinct from evaluation and assembly (PAS-001A / authorization).

## 3. Contract Surfaces

`core/api-policy.contract.ts` · integrate with existing `authPolicy` / `contextPolicy` on api-contract modules

## Handoff block

```
Handoff from: docs/PAS/API-CONTRACT/SLICE/pas-api-001-s4-actor-context-permission-policy.md
1. Objective    — Unify actor/context/permission declaration types under family api-policy contract.
2. Allowed layer— apps/erp/src/server/api/contracts/core/** · **/*.api-contract.ts (type imports only)
3. Files        — core/api-policy.contract.ts · api-contract.ts · __tests__/api-policy.contract.test.ts
4. Prohibited   — permission evaluation · operating-context assembly · session storage
5. Authority    — PAS-API-001 API-006–008 · PAS-001A IS-001/IS-002 (consume only)
6. Gates        — pnpm --filter @afenda/erp typecheck · pnpm --filter @afenda/erp test:run
7. Closes       — DoD #1–#4
8. Evidence     — core/api-policy.contract.ts · __tests__/api-policy.contract.test.ts
9. Attestation  — Contract · Test · Security
```

## 5. DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Human vs service actor kinds are distinct at contract layer | test |
| 2 | Operating context policy fields are declared per operation | test |
| 3 | Permission intent declared (not evaluated) on protected ops | test |
| 4 | No conflation of service actor as human session | manual review |

## 9. Hard Stops

No auth/session code · No `apps/erp/src/lib/context` assembly logic in this slice.
