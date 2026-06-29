# ERP Module Runtime — Slice Catalog

Platform foundation slices (PAS-001C) and LoB exemplar slices under **ERP-MODULES** lane.

> **Slice ID rule:** Slice IDs are **official only when a handoff file exists under this directory**. The [gap report](../PROCUREMENT/procurement-foundation-gap-report.md) lists foundation **gaps** — not authorized slice numbering. Do not execute from audit-agent proposals.

## Platform — PAS-001C

| Slice ID | Handoff | Status |
| --- | --- | --- |
| ERP-MOD-FDN-003 | [erp-mod-fdn-003-foundation-authority.md](../../KERNEL/SLICE/erp-mod-fdn-003-foundation-authority.md) | **Delivered** 2026-06-30 |

## Procurement exemplar — KV-PROC

**Wire vocabulary (kernel):** [B80](../../KERNEL/SLICE/b80-procurement-domain-vocabulary.md) Delivered — contracts-only; not procurement runtime.

**Runtime path law:** `packages/features/erp-modules/src/procurement/` · consumes `@afenda/kernel/erp-domain/procurement`.

**Foundation gap audit:** [procurement-foundation-gap-report.md](../PROCUREMENT/procurement-foundation-gap-report.md).

| Slice ID | Handoff | Status |
| --- | --- | --- |
| ERP-PROC-FDN-001 | [erp-proc-fdn-001-runtime-authority-boundary.md](erp-proc-fdn-001-runtime-authority-boundary.md) | **Delivered** 2026-06-30 |

**Next slice:** **TBD** — handoff must be authored before listing.

## Build order rule

```text
PAS-001C platform (Delivered)
        ↓
KV-PROC wire B80 (kernel — Delivered)
        ↓
LoB domain NS (Procurement)
        ↓
ERP-PROC-FDN-001 (Delivered) → next handoff TBD
        ↓
procurement-runtime-readiness-report.md (operational gate)
        ↓
packages/features/erp-modules/src/procurement/ (when authorized)
```

Reverse flow forbidden — filesystem before identity requires ADR remediation.
