# PAS-001A R3d — Governance Metadata + Production Accepted Closure

> **Position:** API-CONTRACT R3 slice `4 of 4` · IS-004 attestation closure

**Prerequisite:** R3a · R3b · R3c Delivered

**Status:** Delivered

**Type:** Evidence-sync + governance enforcement

## Handoff block

```
Handoff from: docs/PAS/API-CONTRACT/REST/SLICE/pas-001a-r3d-governance-metadata-closure.md

1. Objective    — Enforce operation ownership metadata, consumer impact on deprecated/breaking transitions, audit replay minimum attestation; close IS-004 as Production Accepted runtime.
2. Allowed layer— apps/erp/src/server/api/contracts/** · scripts/api-contract/** · docs/PAS/API-CONTRACT/** · docs/PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md · docs/PAS/pas-status-index.md
3. Files        —
   apps/erp/src/server/api/contracts/api-governance.constants.ts
   apps/erp/src/server/api/contracts/lifecycle.contract.ts
   apps/erp/src/server/api/contracts/stability.contract.ts
   apps/erp/src/server/api/contracts/api-contract.ts
   apps/erp/src/server/api/contracts/**/*.api-contract.ts
   apps/erp/src/server/api/__tests__/api-policy-contracts.test.ts
   scripts/api-contract/check-api-contracts.mts
   docs/PAS/API-CONTRACT/REST/PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md
   docs/PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md
   docs/PAS/pas-status-index.md
4. Prohibited   — Hand-editing afenda-internal-v1.openapi.json · registry bypass · packages/kernel/src/** · public API without ADR
5. Authority    — PAS-API-REST-001 §2.4 · §10 · api-contract North Star §14.6 · §8.5 · ADR-0030 §8
6. Gates        —
   pnpm check:api-contracts
   pnpm check:openapi-drift
   pnpm check:api-route-catalog
   pnpm check:erp-service-actor-s2s-attestation
   pnpm check:documentation-drift
   pnpm --filter @afenda/erp typecheck
   pnpm --filter @afenda/erp test:run
7. Closes       — IS-004 Production Accepted · R3 track Delivered · PAS-001A §6.1.3
8. Evidence     —
   apps/erp/src/server/api/__tests__/api-policy-contracts.test.ts
   docs/PAS/API-CONTRACT/REST/PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md
9. Attestation  — Gate · Governance · Documentation · Contract
```

## Closure sync (mandatory on Delivered)

1. [PAS-API-REST-001](../PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md) — `remaining_slices: none`
2. [PAS-001A §6.1.3](../../../KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) — Planned → Delivered
3. [pas-status-index.md](../../pas-status-index.md)
4. [api-contract Blueprint §11](../../../BLUEPRINT/api-contract-blueprint.md)

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Active contracts declare four ownership dimensions | `api-policy-contracts.test.ts` |
| 2 | Deprecated contracts declare consumer impact classes | `api-policy-contracts.test.ts` |
| 3 | Full R3 gate bundle green | `pnpm check:api-contracts` · `pnpm check:openapi-drift` |
| 4 | Spine + S2S gates remain green | `pnpm check:erp-service-actor-s2s-attestation` |
| 5 | Documentation drift sync | `pnpm check:documentation-drift` |

## Related

| Artifact | Path |
| --- | --- |
| Parent track | [pas-001a-r3-api-contract-runtime.md](./pas-001a-r3-api-contract-runtime.md) |
