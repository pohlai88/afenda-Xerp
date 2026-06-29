# ERP Module Runtime Foundation — PAS Family

Canonical documentation for governed line-of-business module delivery — identity, ownership, integration proof, and readiness attestation.

## Read order

```text
Platform Constitutional Laws
        ↓
ERP Runtime Module Foundation North Star (§1–§12)
        ↓
erp-module-runtime Blueprint
        ↓
PAS-001C (platform foundation helpers)
        ↓
Implementation template (this directory)
        ↓
Module slice handoffs (SLICE/)
        ↓
LoB domain North Star (e.g. Procurement) when touching business meaning
        ↓
Code under packages/features/erp-modules/src/{module-slug}/ (when package live)
```

## Canonical artifacts

| Artifact | Role |
| --- | --- |
| [erp-runtime-module-foundation.template.md](erp-runtime-module-foundation.template.md) | Implementation SSOT — folder tree, contract files, gates |
| [../KERNEL/PAS-001C-ERP-MODULE-FOUNDATION-STANDARD.md](../KERNEL/PAS-001C-ERP-MODULE-FOUNDATION-STANDARD.md) | Platform PAS — `@afenda/erp-module-foundation` authority |
| [../../NORTHSTAR/erp-module-runtime-north-star.md](../../NORTHSTAR/erp-module-runtime-north-star.md) | Business architecture — module delivery domain |
| [../../BLUEPRINT/erp-module-runtime-blueprint.md](../../BLUEPRINT/erp-module-runtime-blueprint.md) | Blueprint box map and gate inventory |
| [SLICE/README.md](SLICE/README.md) | Module foundation and LoB exemplar slice catalog |
| [PROCUREMENT/](PROCUREMENT/) | Procurement exemplar readiness and LoB PAS (planned) |

## Boundary

- **PAS-001C** owns platform foundation **shape** helpers — not LoB business rules.
- **Kernel (PAS-001B)** owns wire vocabulary — modules bind to KV IDs; they do not redefine words. Kernel does **not** own procurement runtime slices.
- **LoB domain North Stars** own business meaning — Procurement, Inventory, Accounting, etc.
- **Template** owns filesystem and contract file names — not business philosophy (North Star §1–§12).
- **Runtime path law:** LoB module runtime lives under `packages/features/erp-modules/src/{module-slug}/` (Blueprint §4.5) — consumes kernel wire; not nested under KERNEL.

## Slice authority

Official slice IDs exist **only** when a handoff file is present under [SLICE/](SLICE/README.md). Gap reports list gaps — not authorized numbering.

**Last updated:** 2026-06-30
