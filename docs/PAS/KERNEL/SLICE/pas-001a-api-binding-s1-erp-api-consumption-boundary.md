# PAS-001A-API-BINDING-S1 — ERP API Consumption Boundary

| Slice ID | PAS-001A-API-BINDING-S1 |
| Parent PAS | [PAS-001A-API-BINDING](../PAS-001A-API-BINDING-ERP-INTEGRATION-SPINE-CONSUMPTION.md) |
| Status | **Delivered** |
| Type | Implementation |
| Scope | Document + type proof that ERP consumes PAS-API-001; does not own family doctrine |
| Prerequisite | [PAS-API-001-S1](../../API-CONTRACT/SLICE/pas-api-001-s1-operation-identity-registry.md) · [PAS-API-REST-001-S1](../../API-CONTRACT/REST/SLICE/pas-api-rest-001-s1-rest-operation-binding.md) Delivered |

## 0. Purpose

Formalize ERP Integration Spine as **consumer** of Platform API Contract — IS-004 references family + REST binding without redefining invariants.

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/pas-001a-api-binding-s1-erp-api-consumption-boundary.md
1. Objective    — erp-api-consumption.contract.ts + PAS-001A §6.1.3 cross-links proving consumption boundary.
2. Allowed layer— apps/erp/src/server/api/contracts/** · docs/PAS/KERNEL/PAS-001A*.md · docs/PAS/API-CONTRACT/**
3. Files        —
   apps/erp/src/server/api/contracts/erp-api-consumption.contract.ts
   apps/erp/src/server/api/__tests__/erp-api-consumption.test.ts
   docs/PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md (§6.1.3)
   docs/PAS/KERNEL/PAS-001A-API-BINDING-ERP-INTEGRATION-SPINE-CONSUMPTION.md
4. Prohibited   — PAS-API-001 invariant edits · kernel · new routes
5. Authority    — PAS-001A-API-BINDING §1–§2 · PAS-API-001
6. Gates        —
   pnpm --filter @afenda/erp typecheck
   pnpm --filter @afenda/erp test:run
   pnpm check:documentation-drift
7. Closes       — Consumption boundary typed + documented
8. Evidence     — erp-api-consumption.contract.ts · PAS-001A §6.1.3 · erp-api-consumption.test.ts
9. Attestation  — Documentation · Contract · Test
```

## 5. DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | ERP role typed as `consumer` of PAS-API-001 / PAS-API-REST-001 | typecheck |
| 2 | Consumption attestation JSON-serializable | test |
| 3 | Family registry + REST bindings consumed without violations | test |
| 4 | PAS-001A §6.1.3 cross-links consumption module | documentation-drift |

## 7. Evidence (Delivered)

| Artifact | Path |
| --- | --- |
| Consumption contract | `apps/erp/src/server/api/contracts/erp-api-consumption.contract.ts` |
| Attestation test | `apps/erp/src/server/api/__tests__/erp-api-consumption.test.ts` |
| Spine cross-link | [PAS-001A §6.1.3](../PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md#613-r3--api-contract-runtime-delivered) |

## 9. Hard Stops

Do not nest API doctrine in PAS-001A.

## Related

| Artifact | Path |
| --- | --- |
| Next slice | [pas-001a-api-binding-s2-erp-rest-binding-consumption.md](./pas-001a-api-binding-s2-erp-rest-binding-consumption.md) |
| Track | [pas-001a-api-binding-slice-track.md](./pas-001a-api-binding-slice-track.md) |
