# Slice ERP-PROC-OP-007 — PAS-006 Procurement UI (Requisitions + PO Lists)

> **Position:** Eighth procurement slice — **presentation-first** operator list surfaces with spine-backed ERP routes

**Status:** **Delivered** 2026-06-30

**Type:** PAS-006 blocks + Serializable TypeScript contract + ERP consumer routes + governance gate (handoff-first)

**Prerequisite:** [ERP-PROC-OP-006 Delivered](erp-proc-op-006-audit-outbox-declaration.md) · [ADR-0031 Accepted §12](../../../adr/ADR-0031-procurement-runtime-authority-boundary.md) · PAS-006 presentation north star

## Purpose

Deliver PAS-006 procurement operator list surfaces (requisitions table, purchase orders table) as `@afenda/shadcn-studio` blocks with Storybook coverage, then wire spine-backed ERP routes that compose those blocks with **fixture data only** — before database runtime, permission enforcement, or audit/outbox writers.

## Path law (ADR-0031 §6 + PAS-006)

| Layer | Path | This slice |
| --- | --- | --- |
| Presentation blocks | `packages/shadcn-studio/src/components-layouts/` | **Requisitions + PO datatable blocks** |
| Storybook lab | `packages/shadcn-studio/src/*.stories.tsx` | **Curated block stories** |
| UI declaration | `packages/features/erp-modules/src/procurement/` | **PAS-006 UI contract** |
| ERP consumer | `apps/erp/src/app/(protected)/modules/procurement/` | **Requisitions + purchase-orders routes** |
| Forbidden runtime | `packages/procurement/` | **Still blocked** |

## Handoff block

```
Handoff from: docs/PAS/ERP-MODULES/SLICE/erp-proc-op-007-pas006-procurement-ui.md

1. Objective    — Add PAS-006 procurement requisitions + purchase-order list blocks; register metadata/surface templates; add Storybook stories; declare PAS-006 UI contract; wire spine-backed ERP list routes with fixture rows; extend authorized route allowlist; add drift gate — NO DB, NO permission enforcement, NO audit/outbox writers, NO packages/procurement/.
2. Allowed layer— packages/shadcn-studio/** · apps/storybook/** · packages/features/erp-modules/src/procurement/** · apps/erp/src/lib/procurement/** · apps/erp/src/app/(protected)/modules/procurement/requisitions/** · apps/erp/src/app/(protected)/modules/procurement/purchase-orders/** · apps/erp/src/lib/context/context-integration-registry.ts · apps/erp/src/lib/context/operating-context-protected-surface.registry.ts · scripts/governance/** · docs/PAS/ERP-MODULES/** · docs/adr/ADR-0031 (§12) · packages/erp-module-foundation/src/reference/build-procurement-foundation-bundle.ts · package.json · foundation-disposition.registry.ts (delegate foundation-registry-owner only)
3. Files        —
   docs/PAS/ERP-MODULES/SLICE/erp-proc-op-007-pas006-procurement-ui.md
   packages/shadcn-studio/src/components-layouts/datatable-procurement-requisitions.tsx
   packages/shadcn-studio/src/components-layouts/datatable-procurement-purchase-orders.tsx
   packages/shadcn-studio/src/components-layouts/_internal/procurement-datatable-shell.tsx
   packages/shadcn-studio/src/registry/mcp-seed-block-manifest.ts
   packages/shadcn-studio/src/registry/block-slot.registry.ts
   packages/shadcn-studio/src/registry/surface-template.registry.ts
   packages/shadcn-studio/src/registry/studio-block-component.registry.tsx
   packages/shadcn-studio/src/registry/metadata-binding-module-assignment.ts
   packages/shadcn-studio/src/index.ts
   packages/shadcn-studio/src/shadcn-studio-blocks.stories.tsx
   packages/features/erp-modules/src/procurement/procurement.pas006-ui.contract.ts
   packages/features/erp-modules/src/procurement/__tests__/procurement.pas006-ui.contract.test.ts
   apps/erp/src/lib/procurement/load-procurement-requisitions-page.server.ts
   apps/erp/src/lib/procurement/load-procurement-purchase-orders-page.server.ts
   apps/erp/src/app/(protected)/modules/procurement/requisitions/page.tsx
   apps/erp/src/app/(protected)/modules/procurement/purchase-orders/page.tsx
   scripts/governance/check-procurement-pas006-ui-contract.mts
   scripts/governance/procurement-domain-contracts-registry.mts
   scripts/governance/check-procurement-context-spine-consumer.mts
   packages/features/erp-modules/src/procurement/procurement.context-spine-consumer.contract.ts
   packages/features/erp-modules/src/procurement/index.ts
   docs/PAS/ERP-MODULES/SLICE/README.md
   docs/PAS/pas-status-index.md
   docs/PAS/ERP-MODULES/PROCUREMENT/procurement-runtime-readiness-report.md
   docs/adr/ADR-0031-procurement-runtime-authority-boundary.md (§12)
   package.json (check:procurement-pas006-ui-contract)
   packages/erp-module-foundation/src/reference/build-procurement-foundation-bundle.ts
4. Prohibited   — packages/procurement/** · database migrations · PERMISSION_REGISTRY seed/enforcement · audit/outbox writers · direct foundation-disposition.registry.ts edit (delegate registry owner) · business posting services
5. Authority    — ADR-0031 · ADR-0027 · PAS-006 · PAS-001A IS-002 · PROCUREMENT_OWNERSHIP_CONTRACT.appIngress = apps/erp
6. Gates        —
   pnpm --filter @afenda/shadcn-studio typecheck
   pnpm check:studio-metadata-binding
   pnpm check:studio-block-slot-markers
   pnpm check:procurement-pas006-ui-contract
   pnpm check:procurement-domain-contracts
   pnpm check:procurement-context-spine-consumer
   pnpm check:procurement-runtime-foundation
   pnpm check:erp-module-foundation
   pnpm check:documentation-drift
   pnpm --filter @afenda/erp-modules typecheck
   pnpm --filter @afenda/erp-modules test:run
   pnpm --filter @afenda/erp typecheck
   pnpm storybook generate
7. Closes       — Gap report PAS-006 production UI scaffold attested (fixture-backed); permission enforcement + DB still deferred
8. Evidence     — procurement.pas006-ui.contract.ts · shadcn blocks · /modules/procurement/requisitions · /modules/procurement/purchase-orders · gate PASS · ADR-0031 §12
9. Attestation  — Documentation · Architecture Authority · Governance gate · Registry owner (PKGR05 v39)
```

## DoD

| # | Criterion | Gate | Evidence |
| --- | --- | --- | --- |
| 1 | Requisitions + PO blocks registered with slot markers | `check:studio-block-slot-markers` | block-slot.registry.ts |
| 2 | Metadata binding covers procurement blocks | `check:studio-metadata-binding` | metadata-binding registry |
| 3 | PAS-006 UI contract matches bundle + routes on disk | `check:procurement-pas006-ui-contract` | gate PASS |
| 4 | Only authorized procurement ERP route files exist | `check:procurement-domain-contracts` | registry allowlist |
| 5 | List routes use spine delegate | `check:procurement-context-spine-consumer` | loaders |
| 6 | Storybook stories render blocks | `pnpm storybook generate` | shadcn-studio-blocks.stories.tsx |
| 7 | ADR-0031 §12 references contract path | doc drift | ADR-0031 |

## Explicit deferrals (remain blocked after this slice)

- Database-backed list queries and mutations
- PERMISSION_REGISTRY enforcement runtime
- Audit/outbox writers
- `@afenda/procurement` top-level package filesystem
- PO posting, GR/IR, three-way match

## References

- [Procurement gap report §G](../PROCUREMENT/procurement-foundation-gap-report.md)
- [ERP-PROC-OP-006](erp-proc-op-006-audit-outbox-declaration.md)
- [PAS-006 SHADCN-STUDIO standard](../../PRESENTATION/PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md)
- [ADR-0031 §12 PAS-006 UI](../../../adr/ADR-0031-procurement-runtime-authority-boundary.md)
