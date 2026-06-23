# TIP-012 — ERP Operating Spine

| Field | Value |
| --- | --- |
| **Status** | **Partially Implemented** |
| **Authority** | ADR-0001 TIP-012 — ERP Operating Spine |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../architecture/afenda-runtime-truth-matrix.md) |
| **Related delivery** | [`tip-007-012-enterprise-group-operating-context.md`](tip-007-012-enterprise-group-operating-context.md) (multi-tenancy / context slice) |
| **Not this TIP** | [`tip-012-execution-foundation.md`](tip-012-execution-foundation.md) — **misnumbered** Trigger.dev evidence (TIP-011) |

## Purpose

Every protected ERP action must flow through a governed lifecycle. No bypass.

```text
Validation
  → Authorization      (@afenda/permissions)
  → Policy             (policy engine)
  → Execution          (domain service)
  → Audit              (@afenda/database audit + @afenda/observability)
  → Observability      (pino + correlation ID)
  → Event publication  (outbox → @afenda/execution)   ← NOT YET IMPLEMENTED
```

## Runtime evidence (2026-06-23)

| Layer | Status | Evidence |
| --- | --- | --- |
| Kernel operating contexts | **Implemented (contracts)** | `packages/kernel/src/context/context-registry.ts` |
| ERP operating context resolver | **Partial** | `apps/erp/src/lib/context/` |
| API RBAC wiring | **Partial** | `tip-010-api-rbac-wiring.md` |
| Audit writer | **Partial** | `packages/database/src/audit/` |
| Correlation ID | **Partial** | `apps/erp/src/lib/observability/erp-correlation-id.ts` |
| Outbox event publication | **Missing** | TIP-011 gap |

## Depends on

- TIP-010 Identity & Authorization (partial)
- TIP-011 Execution Foundation (partial — outbox)
- TIP-007 / operating context (partial)

## Blocks

- TIP-013+ all business domains (with Phase 9 gate per ADR-0010)

## Acceptance gate

Full lifecycle integration test on at least one protected mutation including outbox event publication.

## Verdict

**Partially Implemented** — context contracts and partial API/auth/audit paths exist; spine is **not complete** until TIP-011 outbox lands.
