# PAS-API-001-S7 — Consumer Impact and Ownership

| Field | Value |
| --- | --- |
| **Slice ID** | PAS-API-001-S7 |
| **Parent PAS** | [PAS-API-001](../PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) |
| **Status** | Planned |
| **Scope** | API-014 · API-016 |
| **Prerequisite** | S6 Delivered |

> **Position:** slice `7 of 9`

**Type:** Implementation

## 0. Purpose

**Consumer impact** classification and **ownership metadata** dimensions on every active operation.

## 3. Contract Surfaces

`core/api-consumer-impact.contract.ts` · `core/api-ownership.contract.ts`

## Handoff block

```
Handoff from: docs/PAS/API-CONTRACT/SLICE/pas-api-001-s7-consumer-impact-ownership.md
1. Objective    — Enforce consumer impact + ownership metadata on registry contract type.
2. Allowed layer— apps/erp/src/server/api/contracts/core/** · api-governance.constants.ts · **/*.api-contract.ts
3. Files        — core/api-consumer-impact.contract.ts · core/api-ownership.contract.ts · __tests__/api-policy-contracts.test.ts
4. Prohibited   — pas-status-index-only doc edits without contracts
5. Authority    — PAS-API-001 API-014 · API-016
6. Gates        — pnpm --filter @afenda/erp typecheck · pnpm check:api-contracts (when active)
7. Closes       — DoD #1–#3
8. Evidence     — ownership/consumer contract tests
9. Attestation  — Contract · Governance
```

## 5. DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Consumer impact enum on active operations | test |
| 2 | Ownership dimensions (domain/technical/lifecycle) present | test |
| 3 | Breaking/deprecated ops declare consumer impact | test |

## 9. Hard Stops

Ownership metadata is not org-chart HR data — governance fields only.
