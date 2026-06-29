# PAS-API-001-S2 — Schema Authority Model

| Field | Value |
| --- | --- |
| **Slice ID** | PAS-API-001-S2 |
| **Parent PAS** | [PAS-API-001](../PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) |
| **Status** | Planned |
| **Maturity target** | Production Candidate |
| **Scope** | API-003 — shapes declared before runtime |
| **Non-scope** | Zod/OpenAPI/Protobuf implementation details |

> **Position:** PAS-API-001 slice `2 of 9` · **Prerequisite:** S1 Delivered

**Type:** Implementation

## 0. Purpose

Govern cross-style **schema authority** — every operation declares input/output/event shapes before runtime binding serializes them.

## 2. Owns / Never Owns

| Owns | Never owns |
| --- | --- |
| `api-validation.contract.ts` schema authority types | REST Zod module layout |
| Declared-before-runtime rule | OpenAPI component generation |

## 3. Contract Surfaces

`apps/erp/src/server/api/contracts/core/api-validation.contract.ts` · tests

## Handoff block

```
Handoff from: docs/PAS/API-CONTRACT/SLICE/pas-api-001-s2-schema-authority-model.md
1. Objective    — Add family schema authority contract; link api-contract schema refs to API-003 invariant.
2. Allowed layer— apps/erp/src/server/api/contracts/core/** · api-contract.ts · __tests__/
3. Files        — core/api-validation.contract.ts · api-contract.ts · __tests__/api-validation.contract.test.ts
4. Prohibited   — OpenAPI generator · route handlers · kernel
5. Authority    — PAS-API-001 API-003
6. Gates        — pnpm --filter @afenda/erp typecheck · pnpm --filter @afenda/erp test:run
7. Closes       — DoD #1–#3
8. Evidence     — core/api-validation.contract.ts · __tests__/api-validation.contract.test.ts
9. Attestation  — Contract · Test
```

## 5. DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Schema authority type documents declared-before-runtime | typecheck |
| 2 | Active registry entries reference schema authority | test |
| 3 | No style-specific schema paths in family contract | manual review |

## 9. Hard Stops

No OpenAPI · No `.proto` · No GraphQL SDL in family layer.
