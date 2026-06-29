# PAS-API-001-S6 — Lifecycle and Breaking Change

| Field | Value |
| --- | --- |
| **Slice ID** | PAS-API-001-S6 |
| **Parent PAS** | [PAS-API-001](../PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) |
| **Status** | Planned |
| **Scope** | API-012 · API-013 |
| **Prerequisite** | S5 Delivered |

> **Position:** slice `6 of 9`

**Type:** Implementation

## 0. Purpose

Govern operation **lifecycle** (proposed → active → deprecated → retired) and **breaking-change classification** (additive · compatible · deprecated · breaking) at family layer.

## 3. Contract Surfaces

`core/api-lifecycle.contract.ts` · extend `lifecycle.contract.ts` · `stability.contract.ts`

## Handoff block

```
Handoff from: docs/PAS/API-CONTRACT/SLICE/pas-api-001-s6-lifecycle-breaking-change.md
1. Objective    — Family lifecycle + breaking-change enums wired to registry entries.
2. Allowed layer— apps/erp/src/server/api/contracts/core/** · lifecycle.contract.ts · stability.contract.ts
3. Files        — core/api-lifecycle.contract.ts · lifecycle.contract.ts · stability.contract.ts · __tests__/
4. Prohibited   — OpenAPI deprecation projection (REST S10) · ADR amendments
5. Authority    — PAS-API-001 API-012 · API-013 · ADR-0030 §8
6. Gates        — pnpm --filter @afenda/erp typecheck · pnpm --filter @afenda/erp test:run
7. Closes       — DoD #1–#3
8. Evidence     — core/api-lifecycle.contract.ts · lifecycle tests
9. Attestation  — Contract · Test · Governance
```

## 5. DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Lifecycle states enforced on registry type | test |
| 2 | Breaking-change class required on contract mutations | test |
| 3 | Deprecated ops cannot be `active` without migration metadata | test |

## 9. Hard Stops

No publication artifact edits — style bindings project lifecycle.
