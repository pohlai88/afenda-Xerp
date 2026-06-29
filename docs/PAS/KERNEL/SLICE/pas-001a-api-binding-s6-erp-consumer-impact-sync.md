# PAS-001A-API-BINDING-S6 — ERP Consumer Impact Sync

| Slice ID | PAS-001A-API-BINDING-S6 |
| Parent PAS | [PAS-001A-API-BINDING](../PAS-001A-API-BINDING-ERP-INTEGRATION-SPINE-CONSUMPTION.md) |
| Status | **Delivered** |
| Type | Evidence-sync |
| Scope | Classify ERP UI and internal-service consumer impact on REST operations (API-014) |
| Prerequisite | [S5 Delivered](./pas-001a-api-binding-s5-erp-runtime-evidence.md) · [PAS-API-001-S7](../../API-CONTRACT/SLICE/pas-api-001-s7-consumer-impact-ownership.md) Delivered |

## 0. Purpose

Classify ERP UI and internal service consumer impact on deprecated/breaking REST operations.

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/pas-001a-api-binding-s6-erp-consumer-impact-sync.md
1. Objective    — erp-api-consumer-impact-sync.contract.ts; ERP spine consumer impact attestation (API-014).
2. Allowed layer— apps/erp/src/server/api/contracts/** · __tests__/
3. Files        —
   apps/erp/src/server/api/contracts/erp-api-consumer-impact-sync.contract.ts
   apps/erp/src/server/api/__tests__/erp-api-consumer-impact-sync.test.ts
   apps/erp/src/server/api/contracts/api-governance.constants.ts
   docs/PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md (§6.1.3)
   docs/PAS/KERNEL/PAS-001A-API-BINDING-ERP-INTEGRATION-SPINE-CONSUMPTION.md
4. Prohibited   — Marketing copy · new API meaning · hand-edited OpenAPI
5. Authority    — PAS-001A IS-004 · PAS-API-001 API-014 · API-016 consumerImpactOwner
6. Gates        —
   pnpm --filter @afenda/erp typecheck
   pnpm --filter @afenda/erp test:run
   pnpm check:api-contracts
   pnpm check:documentation-drift
7. Closes       — ERP UI/internal-service consumer impact classified at binding layer
8. Evidence     — erp-api-consumer-impact-sync.contract.ts · erp-api-consumer-impact-sync.test.ts · PAS-001A §6.1.3
9. Attestation  — Contract · Test · Governance
```

## 5. DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Family consumer impact registry passes | `erp-api-consumer-impact-sync.test.ts` |
| 2 | Active operations affect internal-ui or internal-service | test |
| 3 | Active operations declare platform-api-contract consumerImpactOwner | test |
| 4 | Deprecated/breaking require explicit impact (family layer) | `api-consumer-impact-ownership.test.ts` |
| 5 | Attestation JSON-serializable | test |

## 7. Evidence (Delivered)

| Artifact | Path |
| --- | --- |
| Consumer impact sync contract | `apps/erp/src/server/api/contracts/erp-api-consumer-impact-sync.contract.ts` |
| Attestation test | `apps/erp/src/server/api/__tests__/erp-api-consumer-impact-sync.test.ts` |

## 9. Hard Stops

Consumer impact is governance metadata — not marketing copy.

## Related

| Artifact | Path |
| --- | --- |
| Prior slice | [pas-001a-api-binding-s5-erp-runtime-evidence.md](./pas-001a-api-binding-s5-erp-runtime-evidence.md) |
| Family authority | [pas-api-001-s7-consumer-impact-ownership.md](../../API-CONTRACT/SLICE/pas-api-001-s7-consumer-impact-ownership.md) |
| Next slice | [pas-001a-api-binding-s7-erp-release-gate.md](./pas-001a-api-binding-s7-erp-release-gate.md) |
