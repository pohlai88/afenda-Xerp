# PAS-API-001-S3 — Validation Direction Model

| Field | Value |
| --- | --- |
| **Slice ID** | PAS-API-001-S3 |
| **Parent PAS** | [PAS-API-001](../PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) |
| **Status** | Planned |
| **Scope** | API-004 ingress · API-005 egress validation policy |
| **Prerequisite** | S2 Delivered |

> **Position:** slice `3 of 9`

**Type:** Implementation

## 0. Purpose

Encode **ingress before business execution** and **egress before serialization** as family policy types consumed by REST handler runtime and future RPC validators.

## 3. Contract Surfaces

`core/api-validation.contract.ts` (extend) · ingress/egress policy enums · tests

## Handoff block

```
Handoff from: docs/PAS/API-CONTRACT/SLICE/pas-api-001-s3-validation-direction-model.md
1. Objective    — Family validation direction policy (ingress/egress required flags per operation class).
2. Allowed layer— apps/erp/src/server/api/contracts/core/** · api-contract.ts
3. Files        — core/api-validation.contract.ts · api-contract.ts · __tests__/api-validation-direction.test.ts
4. Prohibited   — createApiHandler implementation (REST S3–S5) · kernel
5. Authority    — PAS-API-001 API-004 · API-005 · ADR-0030 §7
6. Gates        — pnpm --filter @afenda/erp typecheck · pnpm --filter @afenda/erp test:run
7. Closes       — DoD #1–#3
8. Evidence     — core/api-validation.contract.ts · __tests__/api-validation-direction.test.ts
9. Attestation  — Contract · Test
```

## 5. DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Ingress policy declared on protected operations | test |
| 2 | Egress policy declared on mutating operations | test |
| 3 | Policies are style-agnostic (no HTTP-specific fields) | manual review |

## 9. Hard Stops

Do not implement handler validation pipeline in S3 — that is REST binding S3–S5 / R3a.
