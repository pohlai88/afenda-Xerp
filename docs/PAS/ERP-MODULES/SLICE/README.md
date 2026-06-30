# ERP Module Runtime — Slice Catalog

Platform foundation slices (PAS-001C) and LoB exemplar slices under **ERP-MODULES** lane.

> **Slice ID rule:** Slice IDs are **official only when a handoff file exists under this directory**. The [gap report](../PROCUREMENT/procurement-foundation-gap-report.md) lists foundation **gaps** — not authorized slice numbering. Do not execute from audit-agent proposals.

| Field | Value |
| --- | --- |
| **Authority** | PAS-001C · ADR-0031 (procurement) · ERP Module Runtime Blueprint §4.5 |
| **Runtime path law** | Operational: `packages/features/erp-modules/src/<lob>/` · Registry reservation: `packages/<lob>` (must not exist until authorized — [ADR-0031 §6](../../../adr/ADR-0031-procurement-runtime-authority-boundary.md)) |

## Platform — PAS-001C

| Slice ID | Handoff | Status |
| --- | --- | --- |
| ERP-MOD-FDN-003 | [erp-mod-fdn-003-foundation-authority.md](../../KERNEL/SLICE/erp-mod-fdn-003-foundation-authority.md) | **Delivered** 2026-06-30 |

## Procurement exemplar — KV-PROC

**Wire vocabulary (kernel):** [B80](../../KERNEL/SLICE/b80-procurement-domain-vocabulary.md) Delivered — contracts-only; not procurement runtime.

**Runtime path law:** `packages/features/erp-modules/src/procurement/` · consumes `@afenda/kernel/erp-domain/procurement`.

**Foundation gap audit:** [procurement-foundation-gap-report.md](../PROCUREMENT/procurement-foundation-gap-report.md).

| Slice ID | Handoff | Status | Notes |
| --- | --- | --- | --- |
| ERP-PROC-FDN-001 | [erp-proc-fdn-001-runtime-authority-boundary.md](erp-proc-fdn-001-runtime-authority-boundary.md) | **Delivered** 2026-06-30 | ADR + PKG-R05 disposition; no runtime |
| ERP-PROC-OP-001 | [erp-proc-op-001-operational-scaffold-authorization.md](erp-proc-op-001-operational-scaffold-authorization.md) | **Delivered** 2026-06-30 | Empty features scaffold at `packages/features/erp-modules/src/procurement/` |
| ERP-PROC-OP-002 | [erp-proc-op-002-runtime-ownership-contract.md](erp-proc-op-002-runtime-ownership-contract.md) | **Delivered** 2026-06-30 | ADR-locked ownership contract — gap report F.2 closed |
| ERP-PROC-OP-003 | [erp-proc-op-003-database-boundary-declaration.md](erp-proc-op-003-database-boundary-declaration.md) | **Delivered** 2026-06-30 | Planned database boundary declared — gap report F.3–F.4 closed (no migrations) |
| ERP-PROC-OP-004 | [erp-proc-op-004-permission-binding-declaration.md](erp-proc-op-004-permission-binding-declaration.md) | **Delivered** 2026-06-30 | Permission binding declared — gap report §D closed (no PERMISSION_REGISTRY wiring) |
| ERP-PROC-OP-005 | [erp-proc-op-005-context-spine-consumer.md](erp-proc-op-005-context-spine-consumer.md) | **Delivered** 2026-06-30 | Context spine consumer attested — foundation readiness route |
| ERP-PROC-OP-006 | [erp-proc-op-006-audit-outbox-declaration.md](erp-proc-op-006-audit-outbox-declaration.md) | **Delivered** 2026-06-30 | Audit/outbox declared — 13 actions · deferred outbox entries |
| ERP-PROC-OP-007 | [erp-proc-op-007-pas006-procurement-ui.md](erp-proc-op-007-pas006-procurement-ui.md) | **Delivered** 2026-06-30 | PAS-006 requisitions + PO list scaffold (fixture-backed) |
| ERP-PROC-OP-008+ | TBD per gap report | Not started | Permission enforcement · DB runtime |

**Next slice:** **ERP-PROC-OP-008+** — permission enforcement · database runtime per gap report.

## Build order rule

```text
PAS-001C platform (Delivered)
        ↓
KV-PROC wire B80 (kernel — Delivered)
        ↓
LoB domain NS (Procurement)
        ↓
ERP-PROC-FDN-001 (Delivered)
        ↓
ERP-PROC-OP-001 (Delivered — scaffold authorization)
        ↓
ERP-PROC-OP-002 (Delivered — ownership contract ADR-lock)
        ↓
ERP-PROC-OP-003 (Delivered — database boundary declaration)
        ↓
ERP-PROC-OP-004 (Delivered — permission binding declaration)
        ↓
ERP-PROC-OP-005 (Delivered — context spine consumer attestation)
        ↓
apps/erp/src/app/(protected)/modules/procurement/readiness (foundation consumer proof)
        ↓
ERP-PROC-OP-006 (Delivered — audit/outbox declaration)
        ↓
packages/features/erp-modules/src/procurement/ (scaffold + ownership + database + permission + context spine + audit/outbox contracts)
        ↓
procurement-runtime-readiness-report.md (operational gate — business runtime still blocked)
```

Reverse flow forbidden — filesystem before identity requires ADR remediation.

**Rule:** No operational procurement filesystem without an authorized handoff in this catalog. Gap report is audit inventory — not a slice catalog.
