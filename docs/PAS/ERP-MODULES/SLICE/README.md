# ERP Module Runtime — Slice Catalog

Platform foundation slices (PAS-001C) and LoB exemplar slices (Procurement KV-PROC).

## Platform — PAS-001C

| Slice ID | Handoff | Status |
| --- | --- | --- |
| ERP-MOD-FDN-003 | [erp-mod-fdn-003-foundation-authority.md](../../KERNEL/SLICE/erp-mod-fdn-003-foundation-authority.md) | **Delivered** 2026-06-30 |

## Procurement exemplar — KV-PROC

Wire vocabulary: [B80](../../KERNEL/SLICE/b80-procurement-domain-vocabulary.md) Delivered.

Foundation gap audit: [procurement-foundation-gap-report.md](../../KERNEL/audit/procurement-foundation-gap-report.md).

| Slice ID | Handoff | Status | Blocker |
| --- | --- | --- | --- |
| ERP-PROC-FDN-001 | [erp-proc-fdn-001-runtime-authority-boundary.md](erp-proc-fdn-001-runtime-authority-boundary.md) | Planned | Domain ADR + PKG-R05 disposition |
| ERP-PROC-FDN-002 | *(planned)* Runtime ownership model | Planned | After FDN-001 |
| ERP-PROC-FDN-002A | *(planned)* Ownership model attestation | Planned | **Blocks FDN-003** |
| ERP-PROC-FDN-003 | *(planned)* Database boundary | Planned | After FDN-002A |
| ERP-PROC-FDN-004…009 | *(planned)* Context, permissions, audit, metadata, tests, gates | Planned | See gap report §G |

**Next sequence item:** ERP-PROC-FDN-001.

## Build order rule

```text
PAS-001C platform (Delivered)
        ↓
LoB domain NS (Procurement)
        ↓
ERP-PROC-FDN-001 → 002 → 002A → 003 → …
        ↓
procurement-runtime-readiness-report.md (operational gate)
```

Reverse flow forbidden — filesystem before identity requires ADR remediation.
