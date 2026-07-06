# Lane B-05 — TanStack Datatable Headless Composer

## Document status

- Status: **Complete**
- Completed: 2026-07-06
- Audience: ERP + presentation engineers
- Authority: PAS-006D, Lane B index, `data-table-surface` V2 view
- Action enabled: B-07 system-admin table migration using ADR-0043 composer

## Overview

Defined the **ERP headless datatable composer** — TanStack Table v8 in `apps/erp`,
composing V2 `DataTableSurface` for chrome and PAS-006D column/slot binding at the
ERP/domain layer.

## Problem

v1 exports monolithic blocks (`DatatableUserBlock`, `DatatableInvoiceBlock`). V2 provides
presentation surfaces, not ERP domain column wiring. Lane B table migration needs a
documented composer pattern.

## Goals

- ADR or slice-level design doc: composer ownership, TanStack version, testing strategy.
- Reference implementation for one admin list (feeds B-07).
- Map v1 block props → v2 surface slots + metadata binding descriptors.

## Non-goals

- Embedding TanStack inside `@afenda/shadcn-studio-v2`.
- Migrating all ERP tables in this slice.

## Constraints

- Composer must not import `@afenda/kernel` into v2 package.
- Column definitions stay ERP/domain layer.
- Reuse V2 `Pagination`, table primitives from public exports.

## Proposed design

### Layering (implemented)

```txt
apps/erp/src/components/presentation/
  erp-datatable-composer.client.tsx
apps/erp/src/lib/presentation/
  system-admin-user-table-columns.tsx
apps/erp/src/components/system-admin/
  system-admin-users-composer.client.tsx   # B-05 pilot (B-07 wires routes)
packages/shadcn-studio-v2/
  data-table-surface                         # presentation chrome only
```

### v1 → v2 mapping

| v1 | v2 / ERP |
| --- | --- |
| `DatatableUserBlock` + `data` | `SystemAdminUsersComposer` → `ErpDataTableComposer` → `DataTableSurface` |
| Column accessors in v1 block | `systemAdminUserTableColumnDefs` (`ColumnDef`) |
| PAS-006D slot keys | TanStack `column.id` (B-07 metadata wiring) |

### Proof

- [ADR-0043](../../../docs/adr/ADR-0043-erp-datatable-headless-composer.md) **Accepted**
- `erp-datatable-composer.client.test.tsx`
- `lane-b-datatable-composer-boundary.test.ts`

## Interfaces / dependencies

- Upstream: B-03 CSS (visual parity)
- Downstream: B-07, B-08

## Risks and mitigations

- Risk: duplicating v1 block behavior.
  - Mitigation: one reference table; B-07 parity checklist.

## Rollout and rollback

1. ADR-0043 Accepted; composer + pilot landed.
2. B-07 migrates memberships/users routes to composer.
3. B-08 applies same pattern to invoice-style tables.

Rollback: routes keep v1 blocks until B-07 cutover.

## Required gates

```bash
pnpm --filter @afenda/erp typecheck
pnpm --filter @afenda/erp test
pnpm --filter @afenda/shadcn-studio-v2 test
```

## Done definition

- [x] Composer ADR/design accepted (ADR-0043)
- [x] Reference composer implementation exists
- [x] One pilot table documented for B-07 (`SystemAdminUsersComposer`)
- [x] No TanStack import in v2 package

## commands Run

| command | Result |
| --- | --- |
| `pnpm --filter @afenda/erp typecheck` | PASS |
| `pnpm --filter @afenda/erp test` | PASS (includes composer test) |
| `pnpm --filter @afenda/shadcn-studio-v2 test` | PASS (includes boundary test) |

## Decision

**`PROCEED`** — B-07 authorized to migrate system-admin tables per ADR-0043.
