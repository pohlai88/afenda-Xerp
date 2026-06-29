# PAS-API-001-S8 — Governance Exception Model

| Field | Value |
| --- | --- |
| **Slice ID** | PAS-API-001-S8 |
| **Parent PAS** | [PAS-API-001](../PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) |
| **Status** | Planned |
| **Scope** | API-015 |
| **Prerequisite** | S7 Delivered |

> **Position:** slice `8 of 9`

**Type:** Implementation

## 0. Purpose

Bounded **governance exceptions** — owner, expiry, risk reason, follow-up evidence — for temporary API exposure deviations.

## 3. Contract Surfaces

`core/api-exception.contract.ts` · gate script hook in `scripts/api-contract/`

## Handoff block

```
Handoff from: docs/PAS/API-CONTRACT/SLICE/pas-api-001-s8-governance-exception-model.md
1. Objective    — Exception record contract + attestation that expired exceptions fail CI.
2. Allowed layer— apps/erp/src/server/api/contracts/core/** · scripts/api-contract/**
3. Files        — core/api-exception.contract.ts · scripts/api-contract/check-api-contracts.mts · __tests__/
4. Prohibited   — silent bypass flags in handlers
5. Authority    — PAS-API-001 API-015
6. Gates        — pnpm check:api-contracts · pnpm --filter @afenda/erp test:run
7. Closes       — DoD #1–#2
8. Evidence     — exception contract + gate output
9. Attestation  — Governance · Contract
```

## 5. DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Exception shape requires owner + expiry | test |
| 2 | Expired exception fails check:api-contracts | gate |

## 9. Hard Stops

Exceptions defer only — they do not delete invariants.
