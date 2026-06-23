# TIP-011 — Execution Foundation

| Field | Value |
| --- | --- |
| **Status** | **Partially Implemented** |
| **Authority** | ADR-0001 TIP-011 — Execution Foundation |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../architecture/afenda-runtime-truth-matrix.md) |
| **Misnumbered evidence** | [`tip-012-execution-foundation.md`](tip-012-execution-foundation.md) (Trigger.dev slice — **not** ERP Operating Spine TIP-012) |
| **Observability evidence** | [`tip-010-observability-audit.md`](tip-010-observability-audit.md) (misnumbered — TIP-011 observability slice) |

## Purpose

Establish Afenda's execution foundation: Drizzle persistence hooks, storage, observability integration, Trigger.dev durable jobs, and **database outbox** for event publication.

## Scope (ADR-0001)

**In scope**

- `@afenda/execution` — durable job spine
- `@afenda/storage` — tenant-scoped storage
- `@afenda/observability` — logging, tracing, audit adapters
- `@afenda/database` — execution runs schema; **outbox schema**
- Trigger.dev provider isolation

**Out of scope**

- Business workflows (domain TIPs)
- Accounting event consumers (TIP-013+)

## Runtime evidence (2026-06-23)

| Component | Status | Evidence |
| --- | --- | --- |
| Execution package + Trigger.dev | **Implemented** | `packages/execution/`, `tip-012-execution-foundation.md` |
| Execution runs schema | **Implemented** | `packages/database/src/schema/execution.schema.ts` |
| Observability / audit baseline | **Partial** | `packages/observability/`, `tip-010-observability-audit.md` |
| Storage abstraction | **Implemented** | `packages/storage/` |
| **Database outbox** | **Missing** | No `outbox` table in `packages/database/src/schema/` |
| Outbox → execution worker | **Missing** | Vocabulary only in `execution-metadata.contract.ts` |

## Remaining deliverables

1. Outbox table schema + migration (via `pnpm db:generate`)
2. Outbox publish worker via `@afenda/execution`
3. Integration test: mutation → outbox row → worker dispatch
4. Rename/hygiene: retain misnumbered docs as **evidence only** (TIP-000D)

## Acceptance gate

- Trigger.dev spine operational ✅
- Outbox pattern operational ❌
- All execution paths use `@afenda/execution` only ✅

## Verdict

**Partially Implemented** — execution spine and observability baseline exist; **outbox is the blocking gap** for TIP-011 and TIP-012 operating spine closeout.
