# ADR-0031 — Procurement Runtime Authority Boundary (PKG-R05)

| Field | Value |
| --- | --- |
| **Status** | Accepted |
| **Date** | 2026-06-30 |
| **Owner** | Architecture Authority · Procurement Authority |
| **Supersedes** | — |
| **Superseded by** | — |

> **PAS-001B wire authority (KV backfill):** Cross-package ERP wire vocabulary for the procurement catalog slug is **`KV-PROC`** (`erp-domain/procurement` under `@afenda/kernel/erp-domain/procurement`). Runtime package authority is **`@afenda/procurement`** (PKG-R05). Canonical KV citation rules: [ADR-0020](ADR-0020-master-data-authority-consolidation.md).

---

## Context

B80 (KV-PROC) delivered procurement wire vocabulary as contracts-only under `@afenda/kernel/erp-domain/procurement`. The `@afenda/erp-module-foundation` reference bundle (`PROCUREMENT_FOUNDATION_BUNDLE`) attests foundation dimensions with `runtimeStatus: foundation_authorized`, but **operational procurement runtime remains blocked** per [PAS-PROC-FDN-AUDIT-001](../PAS/ERP-MODULES/PROCUREMENT/procurement-foundation-gap-report.md).

Evidence as of 2026-06-30:

| Artifact | Role |
| --- | --- |
| B80 KV-PROC wire slice | Delivered — contracts-only vocabulary |
| `PROCUREMENT_FOUNDATION_BUNDLE` | Foundation attestation — wire-phase evidence |
| PKG-R05 in `package-registry.data.ts` | `lifecycle: planned` · `filesystemRequired: false` |
| `packages/procurement/` | **Absent** — blocked by design |
| Gap report blocker #1 | No procurement runtime ADR |

Without an accepted runtime authority ADR, agents cannot safely reason about PKG-R05 disposition, split ownership, or scaffold unblock criteria. This ADR records the **authority boundary** only — it does **not** activate filesystem, database schema, PO posting, ERP production routes, or permission registry wiring.

Related: [ADR-0020](ADR-0020-master-data-authority-consolidation.md) · [ADR-0021](ADR-0021-canonical-enterprise-identity.md) · [PAS-001C](../PAS/KERNEL/PAS-001C-ERP-MODULE-FOUNDATION-STANDARD.md) · [Procurement North Star](../NORTHSTAR/procurement-north-star.md) · [ERP-PROC-FDN-001](../PAS/ERP-MODULES/SLICE/erp-proc-fdn-001-runtime-authority-boundary.md).

---

## Decision

### 1. PKG-R05 runtime authority boundary (documentation-only in this slice)

**Record** `@afenda/procurement` (PKG-R05) as the **candidate runtime owner package** for procurement domain behavior. **Do not** create `packages/procurement/` filesystem, promote package lifecycle from `planned`, or set `filesystemRequired: true` in this slice.

Foundation disposition entry **`PKGR05_PROCUREMENT`** in `foundation-disposition.registry.ts` is the machine authority for this boundary.

### 2. Split ownership matrix (candidate — full ADR-lock in ERP-PROC-FDN-002A)

| Concern | Owner |
| --- | --- |
| Wire enums / IDs / permission **words** | `@afenda/kernel` (KV-PROC only) |
| Business **meaning** | `@afenda/enterprise-knowledge` (PAS-004) |
| Supplier **identity** | PAS-001 business-reference (`SupplierId`, `supplier_no`) |
| Procurement domain **behavior** (use cases, domain rules) | `@afenda/procurement` (PKG-R05) |
| Schema, migrations, RLS, **persistence services** | `@afenda/database` |
| ERP **ingress** (routes, server actions, context assembly) | `apps/erp` |
| Permission **evaluation** registry | `@afenda/permissions` |
| Metadata **operator surfaces** | `apps/erp` + PAS-006 presentation |

`runtimeOwnerPackage`: **`@afenda/procurement`** (candidate — full lock in **ERP-PROC-FDN-002A**).

### 3. Scaffold unblock criteria (filesystem + lifecycle promotion)

`packages/procurement/` filesystem creation and PKG-R05 lifecycle promotion beyond `planned` require **all** of:

| Prerequisite slice | Delivers |
| --- | --- |
| **ERP-PROC-FDN-001** (this ADR) | Runtime authority boundary + PKGR05_PROCUREMENT disposition |
| **ERP-PROC-FDN-002** | Procurement knowledge alignment (PAS-004 P0 atoms) |
| **ERP-PROC-FDN-002A** | ADR-locked ownership matrix — **blocks FDN-003 and filesystem** |
| Future ADR / slice after 002A | Explicit filesystem activation (contracts-only or runtime phase) |

Until 002A closes, database schema work (FDN-003+) must **not** begin — runtime responsibility would be ambiguous.

### 4. Explicit prohibitions until FDN-002 / FDN-002A / FDN-003

Until the slices above and their acceptance gates pass:

- **No** Drizzle schemas / migrations for suppliers, PR, PO, RFQ, or blanket agreements
- **No** PO posting, goods-receipt matching, or three-way match services
- **No** ERP production routes under `apps/erp/src/app/(protected)/modules/procurement/**`
- **No** `PERMISSION_REGISTRY` procurement block wiring or seed parity
- **No** `@afenda/database` runtime dependency inside `@afenda/procurement` (when created)
- **No** import of `@afenda/procurement` from `@afenda/kernel`
- **No** procurement business runtime under `packages/kernel/src/erp-domain/procurement/`

### 5. Wire versus runtime separation (unchanged)

KV-PROC remains **contracts-only** under kernel per PAS-001B B80. This ADR does not amend wire shapes or promote kernel procurement to runtime.

---

## Consequences

### Positive

- PKG-R05 disposition is ADR-governed — agents have a single authority for reserved runtime package boundary.
- Split ownership matrix is documented before database or route work — reduces ambiguous persistence ownership.
- Scaffold policy is explicit — filesystem blocked until FDN-002A ownership ADR-lock.
- Unblocks ERP-PROC-FDN-002 (knowledge alignment) and ERP-PROC-FDN-002A (ownership model).

### Negative / trade-offs

- Multi-slice activation (001 → 002 → 002A → filesystem ADR) adds process overhead.
- `runtimeOwnerPackage` remains **candidate** until FDN-002A — partial ambiguity intentional.
- Foundation bundle attestation passes while operational runtime remains blocked — honest readiness reporting required.

---

## Acceptance Gate

ERP-PROC-FDN-001 complete when all pass:

- `pnpm check:documentation-drift`
- `pnpm check:foundation-disposition`
- `pnpm check:erp-module-foundation`
- `pnpm check:erp-module-runtime-package-reserved`
- `pnpm check:procurement-domain-contracts`
- `pnpm check:procurement-runtime-foundation` (when wired)

Manual evidence:

- ADR-0031 status **Accepted**
- `PKGR05_PROCUREMENT` row in `foundation-disposition.registry.ts`
- Procurement NS §12.4 runtime ADR **Accepted**
- `PROCUREMENT_FOUNDATION_BUNDLE` authority evidence → ADR-0031 path

---

## References

- [ADR-0020](ADR-0020-master-data-authority-consolidation.md) — contract-first / split ownership model
- [ADR-0021](ADR-0021-canonical-enterprise-identity.md) — SupplierId authority
- [B80 — Procurement Domain Vocabulary](../PAS/KERNEL/SLICE/b80-procurement-domain-vocabulary.md)
- [PAS-001C — ERP Module Foundation](../PAS/KERNEL/PAS-001C-ERP-MODULE-FOUNDATION-STANDARD.md)
- [PAS-PROC-FDN-AUDIT-001](../PAS/ERP-MODULES/PROCUREMENT/procurement-foundation-gap-report.md)
- [Procurement North Star](../NORTHSTAR/procurement-north-star.md)
- [ERP-PROC-FDN-001 slice handoff](../PAS/ERP-MODULES/SLICE/erp-proc-fdn-001-runtime-authority-boundary.md)
