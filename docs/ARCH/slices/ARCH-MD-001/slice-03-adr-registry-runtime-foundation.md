# ARCH-MD-001 Slice 3 — ADR + registry promotion (PKG-R02)

| Field | Value |
| --- | --- |
| **Parent ARCH** | [`[Partially Implemented] ARCH-MD-001-master-data-enterprise.md`](../../%5BPartially%20Implemented%5D%20ARCH-MD-001-master-data-enterprise.md) |
| **Prerequisite** | ARCH-MD-001 Slice 2 Delivered ✓ |
| **Slice** | 3 |
| **Status** | **Delivered** (2026-06-26) |
| **Type** | ADR + registry + runtime foundation |
| **Risk class** | Medium |
| **Clean Core impact** | A→A |

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-MD-001/slice-03-adr-registry-runtime-foundation.md

1. Objective    — ADR-0019 + PKGR02_INVENTORY registry promotion; unblock packages/inventory; deliver product+warehouse contracts, schemas, RLS (fdr-r02 Slice 1).
2. Allowed layer— docs/adr/; packages/architecture-authority/; packages/inventory/; packages/database/src/schema/; packages/kernel/ (scaffold + wire export); governance docs
3. Files        — ADR-0019; foundation-disposition.registry.ts; package-registry.data.ts; business-master-data-scaffold.policy.ts; packages/inventory/**; product.schema.ts; warehouse.schema.ts; migrations; fdr-r02-inventory-master-data.md
4. Prohibited   — packages/crm, hrm, procurement; @afenda/master-data hub; stock movement services; apps/erp routes; accounting runtime (ADR-0010)
5. Authority    — ARCH-MD-001 §6.6 · ADR-0019 · PKGR02_INVENTORY · Database schema authority · Kernel MD authority (consume only)
6. Gates        —
   pnpm --filter @afenda/inventory typecheck
   pnpm --filter @afenda/inventory test:run
   pnpm --filter @afenda/database typecheck
   pnpm --filter @afenda/kernel test:run
   pnpm check:business-master-data-scaffold
   pnpm check:foundation-disposition
   pnpm quality:boundaries
   pnpm check:documentation-drift
7. Closes       — ARCH-MD-001 §15 rows 15–16; PKG-R02 ADR + registry; fdr-r02 Slice 1 foundation
8. Evidence     —
   docs/adr/ADR-0019-inventory-domain-master-data-activation.md
   packages/inventory/src/index.ts
   packages/database/src/schema/product.schema.ts
   packages/database/src/schema/warehouse.schema.ts
9. Attestation  — Architecture (ADR-0019) · Database (schema + RLS) · Inventory domain contracts
```

## Acceptance

- [x] ADR-0019 Accepted
- [x] PKGR02_INVENTORY in foundation-disposition.registry.ts
- [x] PKG-R02 active in package-registry.data.ts
- [x] `packages/inventory/` exists; scaffold allows it
- [x] Product + warehouse Drizzle schemas + tenant RLS
- [x] fdr-r02-inventory-master-data Slice 1 documented
- [ ] DoD #14 peer review — **open** (human Architecture Authority PR)

## Notes

- Kernel MD registry entries remain `authority_only` by design — domain runtime does not mutate kernel authority map.
- Stock movement, ERP API/UI deferred to fdr-r02 Slice 2+.
