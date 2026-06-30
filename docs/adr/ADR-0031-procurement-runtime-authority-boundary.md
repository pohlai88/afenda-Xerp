# ADR-0031 — Procurement Runtime Authority Boundary

| Field | Value |
| --- | --- |
| **Status** | Accepted |
| **Date** | 2026-06-30 |
| **Owner** | Architecture Authority · ERP Module Foundation domain |
| **Supersedes** | — |
| **Superseded by** | — |

---

## Context

Procurement wire vocabulary (KV-PROC) is **Delivered** under PAS-001B (B80). Operational procurement runtime — PO posting, supplier lifecycle, ERP routes, and database schema — requires an explicit authority boundary before filesystem work begins.

Evidence as of 2026-06-30:

| Artifact | Role |
| --- | --- |
| [B80 procurement domain vocabulary](../PAS/KERNEL/SLICE/b80-procurement-domain-vocabulary.md) | Kernel contracts-only wire (KV-PROC) |
| [PAS-001C](../PAS/KERNEL/PAS-001C-ERP-MODULE-FOUNDATION-STANDARD.md) | Platform module foundation helpers and readiness gates |
| [Procurement North Star](../NORTHSTAR/procurement-north-star.md) | Business architecture and cross-domain handoff matrix |
| [Procurement gap report](../PAS/ERP-MODULES/PROCUREMENT/procurement-foundation-gap-report.md) | Honest operational readiness inventory |
| `@afenda/erp-module-foundation` · `PROCUREMENT_FOUNDATION_BUNDLE` | Reference foundation bundle attestation |
| `PKGR05_PROCUREMENT` in foundation-disposition.registry.ts | Machine disposition row |

Related: ADR-0020 (contract-first master data) · ADR-0027 (ERP presentation reset — PAS-006) · ERP-PROC-FDN-001 slice.

---

## Decision

### 1. Runtime package identity

| Field | Value |
| --- | --- |
| **Package ID** | PKG-R05 |
| **Package name** | `@afenda/procurement` |
| **Runtime owner path** | `packages/procurement` |
| **Registry entry** | `PKGR05_PROCUREMENT` |
| **Authority** | ADR-0031 |

### 2. Layer ownership (contract-first)

| Layer | Owner | Procurement scope |
| --- | --- | --- |
| Wire vocabulary | `@afenda/kernel/erp-domain/procurement` | Permission keys, audit actions, domain IDs (KV-PROC) |
| Business meaning | `@afenda/enterprise-knowledge` | PAS-004 atoms (PO, supplier, RFQ, sourcing) |
| Foundation attestation | `@afenda/erp-module-foundation` | Readiness matrix, bundle serialization |
| HTTP wiring | `apps/erp` | Governed internal v1 routes when authorized |
| Persistence | `@afenda/database` | Schema boundary — deferred until authorized slice |
| Runtime domain | `@afenda/procurement` | Application/domain logic — **blocked until slice handoff** |

### 3. Filesystem gate

`packages/procurement/**` must **not** exist until:

1. This ADR is **Accepted** (satisfied),
2. `PKGR05_PROCUREMENT` disposition is recorded (satisfied),
3. An authorized ERP-MODULES slice handoff explicitly permits filesystem scaffold.

Enforced by `pnpm check:procurement-runtime-foundation` and `pnpm check:erp-module-runtime-package-reserved`.

### 4. Prohibited without new ADR

- PO posting or three-way match runtime
- Procurement database migrations
- Kernel procurement business logic (beyond PAS-001B wire)
- ERP production procurement UI routes (PAS-006) without slice handoff

### 5. Foundation vs operational readiness

**Foundation Pass** (bundle + gates) ≠ **operational procurement**. Operational rows remain blocked per gap report sections A–F until subsequent authorized slices close each dimension.

### 6. Path law reconciliation (registry vs operational filesystem)

Two path references are **intentional** and **not contradictory** while operational procurement is deferred:

| Layer | Path | Role | Authority |
| --- | --- | --- | --- |
| **Registry / governance reservation** | `@afenda/procurement` · `packages/procurement` | PKG-R05 identity; `check:procurement-runtime-foundation` and `check:erp-module-runtime-package-reserved` assert this path **must not exist** until an authorized slice permits scaffold | This ADR · `PKGR05_PROCUREMENT` · package registry PKG-R05 |
| **Operational filesystem (future)** | `packages/features/erp-modules/src/procurement/` | Default LoB runtime scaffold when business runtime is authorized | [ERP Module Runtime Blueprint §4.5](../BLUEPRINT/erp-module-runtime-blueprint.md) · [Procurement NS §0](../NORTHSTAR/procurement-north-star.md) |

**Rule:** Until an ERP-MODULES slice closes operational runtime, **neither** path may contain business runtime on disk. The registry path is a **reserved package name** for disposition and gates; the features path is the **documented operational layout** for the next scaffold slice. Reconciling both into a single filesystem path requires a **future ADR** amending Blueprint §4.5 or this ADR — not agent-local choice.

---

## Consequences

### Positive

- Clear PKG-R05 disposition path for registry and CI gates
- Procurement NS §9.4 orthogonal separation preserved (foundation gates ≠ business runtime)
- Reference bundle (`PROCUREMENT_FOUNDATION_BUNDLE`) can attest authority without premature package creation

### Negative / deferred

- No `@afenda/procurement` filesystem until next ERP-MODULES slice
- Database, permission enforcement, audit writers, and ERP UI remain gap-report blockers

---

## Verification

| Gate | Purpose |
| --- | --- |
| `pnpm check:procurement-runtime-foundation` | ADR Accepted · PKG-R05 · no premature filesystem |
| `pnpm check:foundation-disposition` | Registry row parity |
| `pnpm check:erp-module-foundation` | Platform foundation composite |
| `pnpm check:erp-module-runtime-package-reserved` | Reserved package law |
| `pnpm check:procurement-ownership-contract` | Features ownership contract ↔ foundation bundle parity |
| `pnpm check:procurement-database-boundary-contract` | Features database boundary declaration ↔ no schema files on disk |
| `pnpm check:procurement-permission-binding-contract` | Features permission binding ↔ kernel vocabulary · no PERMISSION_REGISTRY wiring |

---

## 7. Serialized ownership contract (ERP-PROC-OP-002)

**Delivered:** 2026-06-30 · [ERP-PROC-OP-002 slice](../PAS/ERP-MODULES/SLICE/erp-proc-op-002-runtime-ownership-contract.md)

The gap report F.2 split ownership matrix is **ADR-locked** as a serializable TypeScript contract:

| Field | Value |
| --- | --- |
| **Contract path** | `packages/features/erp-modules/src/procurement/procurement.ownership.contract.ts` |
| **Export** | `PROCUREMENT_OWNERSHIP_CONTRACT` — eight `defineModuleOwnership` surfaces |
| **Extended matrix** | `PROCUREMENT_OWNERSHIP_MATRIX` — includes PAS-001 `supplierIdentity` row |
| **Attestation** | `PROCUREMENT_OWNERSHIP_ATTESTATION` — slice `ERP-PROC-OP-002` · status `adr_locked` |
| **Drift gate** | `pnpm check:procurement-ownership-contract` |

**Database boundary remains deferred.** This section closes the ownership decision gate only — schema, migrations, and `@afenda/procurement` filesystem work require subsequent authorized slices.

---

## 8. Database boundary declaration (ERP-PROC-OP-003)

**Delivered:** 2026-06-30 · [ERP-PROC-OP-003 slice](../PAS/ERP-MODULES/SLICE/erp-proc-op-003-database-boundary-declaration.md)

The gap report F.3–F.4 planned persistence boundary is **declared** (not migrated) as a serializable TypeScript contract:

| Field | Value |
| --- | --- |
| **Contract path** | `packages/features/erp-modules/src/procurement/procurement.database-boundary.contract.ts` |
| **Export** | `PROCUREMENT_DATABASE_BOUNDARY_CONTRACT` — four planned tables · `migrationStatus: "deferred"` |
| **Schema owner** | `@afenda/database` — parity with `PROCUREMENT_OWNERSHIP_CONTRACT.databaseSchema` |
| **Attestation** | `PROCUREMENT_DATABASE_BOUNDARY_ATTESTATION` — slice `ERP-PROC-OP-003` · status `declared` |
| **Drift gate** | `pnpm check:procurement-database-boundary-contract` |

**Planned tables (declaration only):** `suppliers`, `purchase_requisitions`, `purchase_orders`, `procurement_rfqs` — each with `plannedSchemaPath` under `packages/database/src/schema/` documented for future authorized migration slice.

**Migrations prohibited until:** RLS ADR acceptance + authorized ERP-MODULES migration slice. No `packages/database/src/schema/*purchase*`, `*procurement*`, or `*supplier*` files may exist until that slice.

---

## 9. Permission binding declaration (ERP-PROC-OP-004)

**Delivered:** 2026-06-30 · [ERP-PROC-OP-004 slice](../PAS/ERP-MODULES/SLICE/erp-proc-op-004-permission-binding-declaration.md)

The gap report §D permission binding is **declared** (not enforced) as a serializable TypeScript contract:

| Field | Value |
| --- | --- |
| **Contract path** | `packages/features/erp-modules/src/procurement/procurement.permission-binding.contract.ts` |
| **Export** | `PROCUREMENT_PERMISSION_BINDING_CONTRACT` — 18 kernel keys · `permissionParity: "deferred"` |
| **Kernel authority** | `packages/kernel/src/erp-domain/procurement/procurement-permission-vocabulary.contract.ts` |
| **Registry owner** | `@afenda/permissions` — parity with `PROCUREMENT_OWNERSHIP_CONTRACT.permissionRegistry` |
| **Attestation** | `PROCUREMENT_PERMISSION_BINDING_ATTESTATION` — slice `ERP-PROC-OP-004` · status `declared` |
| **Drift gate** | `pnpm check:procurement-permission-binding-contract` |

**PERMISSION_REGISTRY wiring prohibited until:** authorized ERP-MODULES permission enforcement slice. No `procurement` namespace in `packages/permissions/src/grants/permission.contract.ts` until that slice.

---

## References

- [ERP-PROC-FDN-001 slice](../PAS/ERP-MODULES/SLICE/erp-proc-fdn-001-runtime-authority-boundary.md)
- [PAS-001C](../PAS/KERNEL/PAS-001C-ERP-MODULE-FOUNDATION-STANDARD.md)
- [Procurement runtime readiness report](../PAS/ERP-MODULES/PROCUREMENT/procurement-runtime-readiness-report.md)
