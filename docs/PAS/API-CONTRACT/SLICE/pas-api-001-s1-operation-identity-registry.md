# PAS-API-001-S1 — Operation Identity Registry

| Field | Value |
| --- | --- |
| **Slice ID** | PAS-API-001-S1 |
| **Parent PAS** | [PAS-API-001](../PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) |
| **Authority chain** | North Star → Blueprint → PAS-API-001 → **S1** → Code |
| **Status** | Planned |
| **Maturity target** | Production Candidate |
| **Scope** | Stable cross-style operation identity + registry-first exposure model |
| **Non-scope** | REST paths · OpenAPI · ERP routes · style bindings |
| **Runtime surfaces** | `apps/erp/src/server/api/contracts/core/**` · registry types |
| **Gates** | ERP typecheck · registry tests |

> **Position:** PAS-API-001 slice `1 of 9` · Blueprint box: **Platform API Contract**

**Prerequisite:** [PAS-API-001](../PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) published · [api-contract North Star §0.2](../../NORTHSTAR/api-contract-north-star.md)

**Type:** Implementation

---

## 0. Purpose

Extract and govern **operation identity** (API-001) and **registry-first exposure** (API-002) as style-agnostic family contracts consumed by REST/RPC/GQL/Event/Agent bindings — without embedding HTTP path or OpenAPI mechanics.

## 1. Authority and Traceability

| Upstream | Use |
| --- | --- |
| North Star I1–I2 | Registry-first · no orphan operations |
| PAS-API-001 API-001 · API-002 | Invariants this slice proves |
| Existing `api-contract.ts` | Refactor source — do not duplicate ad hoc |

## 2. Owns / Never Owns

| Owns | Never owns |
| --- | --- |
| `ApiOperationId` branded type | REST method/path mapping |
| Registry entry shape for operation identity | OpenAPI operationId string rules alone |
| Style-agnostic operation registry contract | Handler runtime |
| Proof that no binding adds operations outside registry | Permission evaluation |

## 3. Contract Surfaces

```text
apps/erp/src/server/api/contracts/core/api-operation-id.contract.ts
apps/erp/src/server/api/contracts/core/api-registry.contract.ts
apps/erp/src/server/api/contracts/core/api-style.contract.ts
apps/erp/src/server/api/__tests__/api-operation-id.contract.test.ts
```

## Handoff block

```
Handoff from: docs/PAS/API-CONTRACT/SLICE/pas-api-001-s1-operation-identity-registry.md

1. Objective    — Introduce cross-style ApiOperationId + registry contract types; wire existing api-contract-registry to family contracts without REST-specific leakage.
2. Allowed layer— apps/erp/src/server/api/contracts/core/** · apps/erp/src/server/api/contracts/api-contract-registry.ts · apps/erp/src/server/api/contracts/api-contract.ts · apps/erp/src/server/api/__tests__/
3. Files        —
   apps/erp/src/server/api/contracts/core/api-operation-id.contract.ts
   apps/erp/src/server/api/contracts/core/api-registry.contract.ts
   apps/erp/src/server/api/contracts/core/api-style.contract.ts
   apps/erp/src/server/api/contracts/api-contract.ts
   apps/erp/src/server/api/contracts/api-contract-registry.ts
   apps/erp/src/server/api/__tests__/api-operation-id.contract.test.ts
4. Prohibited   — packages/kernel/src/** · OpenAPI generator changes · route.ts · REST path constants · claiming S2–S9 Delivered
5. Authority    — PAS-API-001 §3 API-001 · API-002 · api-contract North Star §0.2
6. Gates        —
   pnpm --filter @afenda/erp typecheck
   pnpm --filter @afenda/erp test:run
7. Closes       — DoD #1–#4 · PAS-API-001 family primitive S1
8. Evidence     —
   apps/erp/src/server/api/contracts/core/api-operation-id.contract.ts
   apps/erp/src/server/api/__tests__/api-operation-id.contract.test.ts
   apps/erp/src/server/api/contracts/api-contract-registry.ts
9. Attestation  — Contract · Test · Documentation
```

## 4. Implementation Steps

1. Add `core/` folder under contracts with operation id + registry + style enum contracts.
2. Refactor `api-contract.ts` to import family types — preserve existing export surface.
3. Ensure every registry entry carries stable `ApiOperationId`.
4. Add tests proving duplicate ids and orphan registration patterns fail at compile or test time.

## 5. Tests and Gates (DoD)

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | `ApiOperationId` is branded and used on all registry entries | `api-operation-id.contract.test.ts` |
| 2 | Registry contract documents style-agnostic operation record | `pnpm --filter @afenda/erp typecheck` |
| 3 | Existing internal v1 contracts compile against family types | `pnpm --filter @afenda/erp test:run` |
| 4 | No REST path fields added to family core contracts | Manual review — PAS-API-001 §2 |

## 6. Evidence Register

| Tier | Evidence |
| --- | --- |
| T3 | Contract types in `core/` |
| T5 | Test file green in CI |

## 7. Acceptance Criteria

S1 **Delivered** when family operation identity types exist, registry uses them, and REST binding can import without redefining identity.

## 8. Sync Obligations

On Delivered: [pas-api-001-slice-catalog.md](./pas-api-001-slice-catalog.md) · [PAS-API-001 §7](../PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) · [pas-status-index.md](../../pas-status-index.md)

## 9. Hard Stops

- Do not define REST path rules in family core contracts.
- Do not add OpenAPI generator behavior in S1.
- Do not mark PAS-API-001 Delivered — S1 is one of nine family slices.
