# PAS-001A R3c — Route Coverage + OpenAPI Drift Attestation

> **Position:** API-CONTRACT R3 slice `3 of 4` · IS-004 publication + handler-coverage proof

**Prerequisite:** [R3a](./pas-001a-r3a-handler-runtime-envelope.md) · [R3b](./pas-001a-r3b-service-actor-context-assembly.md) Delivered

**Status:** Planned

**Type:** Implementation

## Handoff block

```
Handoff from: docs/PAS/API-CONTRACT/REST/SLICE/pas-001a-r3c-route-coverage-drift-attestation.md

1. Objective    — Wire all governed /api/internal/v1/** routes through createApiHandler; prove registry coverage and OpenAPI drift attestation green.
2. Allowed layer— apps/erp/src/app/api/internal/v1/**/route.ts · apps/erp/src/server/api/contracts/** · scripts/api-contract/** · apps/erp/src/server/api/__tests__/api-contract-registry.test.ts · apps/erp/src/server/api/__tests__/api-route-catalog.test.ts · apps/erp/src/server/api/__tests__/openapi-document.test.ts
3. Files        —
   apps/erp/src/server/api/contracts/api-contract-registry.ts
   apps/erp/src/server/api/contracts/api-route-coverage.ts
   apps/erp/src/server/api/contracts/api-route-catalog.ts
   apps/erp/src/server/api/contracts/afenda-internal-v1.openapi.json
   apps/erp/src/server/api/contracts/openapi/build-afenda-openapi-document.ts
   apps/erp/src/app/api/internal/v1/**/route.ts
   scripts/api-contract/check-api-contracts.mts
   scripts/api-contract/check-openapi-drift.mts
   scripts/api-contract/check-api-route-catalog.mts
   apps/erp/src/server/api/__tests__/api-contract-registry.test.ts
   apps/erp/src/server/api/__tests__/api-route-catalog.test.ts
   apps/erp/src/server/api/__tests__/openapi-document.test.ts
4. Prohibited   — Hand-editing afenda-internal-v1.openapi.json · direct Response.json() · orphan routes · public/partner API namespace
5. Authority    — PAS-API-REST-001 §2.1 · §2.3 · §2.6 · ADR-0030 §1–§3 · afenda-openapi skill
6. Gates        —
   pnpm check:api-contracts
   pnpm check:openapi-drift
   pnpm check:api-route-catalog
   pnpm lint:openapi
   pnpm --filter @afenda/erp typecheck
   pnpm --filter @afenda/erp test:run
7. Closes       — Registry coverage + publication drift attestation (R3c)
8. Evidence     —
   scripts/api-contract/check-api-contracts.mts
   scripts/api-contract/check-openapi-drift.mts
   apps/erp/src/server/api/__tests__/openapi-document.test.ts
9. Attestation  — Gate · Contract · Governance
```

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | Every governed internal v1 route uses createApiHandler | `pnpm check:api-contracts` | North Star I1 · API-INV-001 |
| 2 | Registry covers all active routes; no orphans | `pnpm check:api-contracts` · `pnpm check:api-route-catalog` | ADR-0030 §1 |
| 3 | OpenAPI snapshot matches generator | `pnpm check:openapi-drift` | North Star I2 |
| 4 | OpenAPI structural lint passes | `pnpm lint:openapi` | afenda-openapi I3 |
| 5 | OpenAPI document tests pass | `pnpm --filter @afenda/erp test:run` | OpenAPI 3.1 publication |

## Related

| Artifact | Path |
| --- | --- |
| Next slice | [pas-001a-r3d-governance-metadata-closure.md](./pas-001a-r3d-governance-metadata-closure.md) |
| Blueprint §2.4 | [api-contract-blueprint.md](../../../BLUEPRINT/api-contract-blueprint.md) |
