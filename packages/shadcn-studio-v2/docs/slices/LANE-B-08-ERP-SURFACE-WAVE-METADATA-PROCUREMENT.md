# Lane B-08 — ERP Surface Wave: Metadata And Procurement

## Document status

- Status: **Complete**
- Completed: 2026-07-06
- Audience: ERP + metadata bridge engineers
- Authority: PAS-006D, B-05 composer, Lane B index
- Action enabled: B-09 workflow board runtime on metadata workspace

## Overview

Second ERP **surface wave** — metadata-driven workspace, binding hydration preview,
procurement requisitions and purchase-order tables.

## Problem

Representative v1 imports:

- `metadata-workspace/page.tsx`
- `metadata-binding-slot-hydration-preview.client.tsx` → v1 block resolver
- `procurement-*` tables → `DatatableInvoiceBlock`
- ERP metadata types from `@afenda/shadcn-studio/metadata`

## Goals

- Port metadata bridge to `@afenda/shadcn-studio-v2/metadata` exports.
- Migrate procurement tables via B-05 composer.
- Keep registry-first metadata binding (no TSX import enforcement in kernel).

## Non-goals

- Drag board frame (B-09).
- Dedicated manifest kind rows (B-10).
- Remaining ERP v1 surfaces (system-admin wave-2, workspace dashboard — B-07-ext / B-09).

## Constraints

- `apps/erp/src/lib/metadata/` stays consumer owner.
- Block resolution maps to v2 public view exports.

## Proposed design

### Touchpoints (changed)

| Area | Path |
| --- | --- |
| Metadata bridge | `apps/erp/src/lib/metadata/**` |
| Block resolver | `resolve-studio-block-component.client.tsx` |
| Metadata workspace | `metadata-workspace/page.tsx` |
| Procurement routes | `modules/procurement/**` |
| Composers | `procurement-*-composer.client.tsx` |
| Widget bridge test | `dashboard-widget-bridge.registry.test.ts` |

### Proof

- `lane-b-erp-metadata-procurement-cutover.test.ts`
- ERP procurement/metadata tests
- ERP build PASS

## Interfaces / dependencies

- Upstream: B-05, B-06, B-07 (pattern proof)
- Downstream: B-09 (board hosts these widgets)

## Rollout and rollback

1. Metadata types + bridge imports to v2.
2. Procurement tables migrated to `ErpDataTableComposer`.
3. Metadata workspace on v2 resolver.

Rollback: per-route revert; keep bridge shim.

## Required gates

```bash
pnpm --filter @afenda/erp test:run -- metadata procurement dashboard-widget-bridge
pnpm --filter @afenda/erp typecheck
pnpm --filter @afenda/erp build
pnpm --filter @afenda/shadcn-studio-v2 test -- lane-b-erp-metadata-procurement
```

## Done definition

- [x] Metadata bridge uses v2/metadata and ERP-local binding registry
- [x] Procurement + metadata workspace routes migrated
- [x] No v1 block imports in scoped files
- [ ] Migration map wave-2 → `pilot-proven` (parent Wave 1 evidence-sync)

## Decision

**COMPLETE** — metadata bridge + procurement wave on v2 composer (2026-07-06)
