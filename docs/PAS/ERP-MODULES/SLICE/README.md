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
| ERP-PROC-OP-001 | [erp-proc-op-001-operational-scaffold-authorization.md](erp-proc-op-001-operational-scaffold-authorization.md) | **Proposed** | Authorizes empty features scaffold only |
| ERP-PROC-OP-002+ | TBD per gap report | Not started | DB · permissions · context · audit — separate handoffs |

**Next slice:** [ERP-PROC-OP-001 Proposed](erp-proc-op-001-operational-scaffold-authorization.md) — requires explicit operator go-ahead before scaffold.

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
ERP-PROC-OP-001 (Proposed — scaffold authorization)
        ↓
procurement-runtime-readiness-report.md (operational gate)
        ↓
packages/features/erp-modules/src/procurement/ (when OP-001 Delivered)
```

Reverse flow forbidden — filesystem before identity requires ADR remediation.

**Rule:** No operational procurement filesystem without an authorized handoff in this catalog. Gap report is audit inventory — not a slice catalog.
