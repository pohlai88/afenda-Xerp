# Slice ERP-PROC-OP-005 — Context Spine Consumer

> **Position:** Sixth procurement slice — **attests** PAS-001A IS-002 spine consumption before business routes

**Status:** **Delivered** 2026-06-30

**Type:** Serializable TypeScript contract + ERP consumer proof route + governance gate (handoff-first)

**Prerequisite:** [ERP-PROC-OP-004 Delivered](erp-proc-op-004-permission-binding-declaration.md) · [ADR-0031 Accepted §10](../../../adr/ADR-0031-procurement-runtime-authority-boundary.md) · gap report context spine gate

## Purpose

Declare and prove procurement module consumption of the PAS-001A operating-context spine — **before** business procurement routes, permission enforcement, or PAS-006 production UI surfaces.

This slice closes the **"No procurement context spine consumer proof"** blocker with a foundation-only protected route at `/modules/procurement/readiness`.

## Path law (unchanged — ADR-0031 §6)

| Layer | Path | This slice |
| --- | --- | --- |
| Consumer declaration | `packages/features/erp-modules/src/procurement/` | **Context spine consumer contract** |
| ERP consumer proof | `apps/erp/src/app/(protected)/modules/procurement/readiness/` | **Foundation readiness route only** — no business UI |
| Forbidden bypass | `resolve-operating-context-from-headers.server.ts` | **Must not** be used for procurement ingress |

## Handoff block

```
Handoff from: docs/PAS/ERP-MODULES/SLICE/erp-proc-op-005-context-spine-consumer.md

1. Objective    — Declare context spine consumer contract; wire foundation readiness protected route using loadProtectedRequestOperatingContext; register IS-002 consumer proof; add drift gate — NO business procurement routes, NO permission enforcement, NO audit/outbox writers.
2. Allowed layer— packages/features/erp-modules/src/procurement/** · apps/erp/src/lib/procurement/** · apps/erp/src/app/(protected)/modules/procurement/readiness/** · apps/erp/src/lib/context/context-integration-registry.ts · apps/erp/src/lib/context/operating-context-protected-surface.registry.ts · scripts/governance/** · docs/PAS/ERP-MODULES/** · docs/adr/ADR-0031 (§10) · packages/erp-module-foundation/src/reference/build-procurement-foundation-bundle.ts · apps/erp/package.json (@afenda/erp-modules dep)
3. Files        —
   docs/PAS/ERP-MODULES/SLICE/erp-proc-op-005-context-spine-consumer.md
   packages/features/erp-modules/src/procurement/procurement.context-spine-consumer.contract.ts
   packages/features/erp-modules/src/procurement/__tests__/procurement.context-spine-consumer.contract.test.ts
   apps/erp/src/lib/procurement/load-procurement-foundation-readiness-page.server.ts
   apps/erp/src/app/(protected)/modules/procurement/readiness/page.tsx
   scripts/governance/check-procurement-context-spine-consumer.mts
   scripts/governance/__tests__/check-procurement-context-spine-consumer.test.ts
   scripts/governance/procurement-domain-contracts-registry.mts (authorized foundation route exception)
   scripts/governance/check-procurement-domain-contracts.mts
   packages/features/erp-modules/src/procurement/index.ts
   packages/features/erp-modules/src/index.ts
   docs/PAS/ERP-MODULES/SLICE/README.md
   docs/PAS/pas-status-index.md
   docs/PAS/ERP-MODULES/PROCUREMENT/procurement-runtime-readiness-report.md
   package.json (check:procurement-context-spine-consumer)
   packages/erp-module-foundation/src/reference/build-procurement-foundation-bundle.ts
   docs/adr/ADR-0031-procurement-runtime-authority-boundary.md (§10)
4. Prohibited   — packages/permissions/** registry seed · audit/outbox writers · PAS-006 operator UI beyond foundation readiness · packages/procurement/** · additional routes under modules/procurement/**
5. Authority    — ADR-0031 · PAS-001A IS-002 · PAS-001C template §3.6 · PROCUREMENT_OWNERSHIP_CONTRACT.appIngress = apps/erp
6. Gates        —
   pnpm check:procurement-context-spine-consumer
   pnpm check:procurement-domain-contracts
   pnpm check:erp-operating-context-spine
   pnpm check:erp-module-context-spine-consumer
   pnpm check:procurement-runtime-foundation
   pnpm check:erp-module-foundation
   pnpm check:documentation-drift
   pnpm --filter @afenda/erp-modules typecheck
   pnpm --filter @afenda/erp typecheck
   pnpm test:run
7. Closes       — Gap report context spine consumer proof attested; audit/outbox and PAS-006 production UI still deferred
8. Evidence     — procurement.context-spine-consumer.contract.ts · /modules/procurement/readiness · gate PASS · ADR-0031 §10
9. Attestation  — Documentation · Architecture Authority · Governance gate
```

## DoD

| # | Criterion | Gate | Evidence |
| --- | --- | --- | --- |
| 1 | Context spine contract matches bundle consumer | `check:procurement-context-spine-consumer` | gate PASS |
| 2 | Foundation readiness route uses spine delegate | gate + loader | load-procurement-foundation-readiness-page.server.ts |
| 3 | Forbidden header bypass not used | gate | no from-headers import in loader |
| 4 | Only authorized procurement ERP route files exist | `check:procurement-domain-contracts` | registry exception |
| 5 | Protected surface + integration registries wired | `check:erp-operating-context-spine` | context registries |
| 6 | Attestation declares ERP-PROC-OP-005 | unit test | PROCUREMENT_CONTEXT_SPINE_CONSUMER_ATTESTATION |
| 7 | ADR-0031 §10 references contract path | doc drift | ADR-0031 |

## Explicit deferrals (remain blocked after this slice)

- PERMISSION_REGISTRY seed and enforcement runtime
- Audit/outbox writers (ERP-PROC-OP-006+)
- PAS-006 production procurement operator surfaces (invoice table, requisitions UI)
- Business procurement routes under `/modules/procurement/*` beyond readiness
- `@afenda/procurement` top-level package filesystem

## References

- [Procurement gap report §G](../PROCUREMENT/procurement-foundation-gap-report.md)
- [ERP-PROC-OP-004](erp-proc-op-004-permission-binding-declaration.md)
- [PAS-001A IS-002](../../KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md)
- [ADR-0031 §10 Context spine consumer](../../../adr/ADR-0031-procurement-runtime-authority-boundary.md)
