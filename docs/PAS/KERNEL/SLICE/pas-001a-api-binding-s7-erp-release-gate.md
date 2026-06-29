# PAS-001A-API-BINDING-S7 — ERP Release Gate

| Slice ID | PAS-001A-API-BINDING-S7 |
| Parent PAS | [PAS-001A-API-BINDING](../PAS-001A-API-BINDING-ERP-INTEGRATION-SPINE-CONSUMPTION.md) |
| Status | **Delivered** |
| Type | Evidence-sync + gate closure |
| Scope | IS-004 closure gate — ERP cannot release with API contract drift |
| Prerequisite | [S6 Delivered](./pas-001a-api-binding-s6-erp-consumer-impact-sync.md) |

## 0. Purpose

ERP cannot release with API contract drift — IS-004 closure gate on PAS-001A.

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/pas-001a-api-binding-s7-erp-release-gate.md
1. Objective    — erp-api-release-gate.contract.ts; composite S1–S6 + release gate attestation.
2. Allowed layer— apps/erp/src/server/api/contracts/** · __tests__/
3. Files        —
   apps/erp/src/server/api/contracts/erp-api-release-gate.contract.ts
   apps/erp/src/server/api/__tests__/erp-api-release-gate.test.ts
   apps/erp/src/server/api/contracts/api-governance.constants.ts
   docs/PAS/KERNEL/PAS-001A-API-BINDING-ERP-INTEGRATION-SPINE-CONSUMPTION.md
   docs/PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md (§6.1.3)
   docs/PAS/pas-status-index.md
4. Prohibited   — Activating RPC/GQL/Event/Agent style bindings · new API meaning
5. Authority    — PAS-001A IS-004 · PAS-001A-API-BINDING acceptance
6. Gates        —
   pnpm check:api-contracts
   pnpm check:openapi-drift
   pnpm check:api-route-catalog
   pnpm check:foundation-disposition
   pnpm --filter @afenda/erp typecheck
   pnpm --filter @afenda/erp test:run
   pnpm check:documentation-drift
7. Closes       — PAS-001A-API-BINDING S1–S7 **Delivered** · IS-004 Production Accepted
8. Evidence     — erp-api-release-gate.contract.ts · erp-api-release-gate.test.ts
9. Attestation  — Contract · Test · Gate bundle
```

## 5. DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | S1–S6 composite violations empty | `erp-api-release-gate.test.ts` |
| 2 | Only PAS-API-REST-001 active style binding | test |
| 3 | Seven slice modules declared on track | test |
| 4 | Full release gate bundle green | `check:api-contracts` · `check:foundation-disposition` |
| 5 | Attestation JSON-serializable | test |

## 7. Acceptance

PAS-001A-API-BINDING **Delivered** when S1–S7 complete and IS-004 marked Production Accepted in pas-status-index.

## 7. Evidence (Delivered)

| Artifact | Path |
| --- | --- |
| Release gate contract | `apps/erp/src/server/api/contracts/erp-api-release-gate.contract.ts` |
| Track closure test | `apps/erp/src/server/api/__tests__/erp-api-release-gate.test.ts` |

## 9. Hard Stops

ERP release gate does not activate reserved RPC/GQL/Event/Agent bindings.

## Related

| Artifact | Path |
| --- | --- |
| Prior slice | [pas-001a-api-binding-s6-erp-consumer-impact-sync.md](./pas-001a-api-binding-s6-erp-consumer-impact-sync.md) |
| Track index | [pas-001a-api-binding-slice-track.md](./pas-001a-api-binding-slice-track.md) |
