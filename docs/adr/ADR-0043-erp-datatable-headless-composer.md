# ADR-0043 — ERP Datatable Headless Composer

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-06 |
| **Owner** | Architecture Authority |
| **Related** | [ADR-0027](ADR-0027-frontend-presentation-reset.md), [ADR-0017](ADR-0017-shadcn-studio-ui-delivery-acceleration.md), [PAS-006D](../PAS/PRESENTATION/PAS-006D-METADATA-DRIVEN-SURFACES-STANDARD.md), [Lane B-05](../../packages/shadcn-studio-v2/docs/slices/LANE-B-05-TANSTACK-DATATABLE-COMPOSER.md) |
| **Implementation authorization** | Lane B-07/B-08 (`apps/erp` consumer tables only) |

---

## Context

v1 exports monolithic datatable blocks (`DatatableUserBlock`, `DatatableInvoiceBlock`)
that bundle TanStack Table, filtering, pagination, and presentation chrome inside
`@afenda/shadcn-studio`.

V2 provides **`DataTableSurface`** — presentation chrome and table primitives only
(`packages/shadcn-studio-v2/src/views/datatables/data-table-surface.tsx`). It accepts
column headers and row cells as React nodes; it does not own domain column definitions,
sorting, filtering, or API wiring.

PAS-006D owns metadata binding contracts and surface templates; **column semantics and
domain row mapping stay in `apps/erp`**. Lane B table migration (B-07 system admin,
B-08 metadata/procurement) needs a documented headless composer before replacing v1 blocks.

---

## Decision

### 1. Table engine

Adopt **`@tanstack/react-table` v8** (pinned **`^8.21.3`**, same major as v1 blocks) as
the **sole** headless table engine for ERP list surfaces.

Install scope: **`apps/erp` dependency only**. Do not add to `@afenda/shadcn-studio-v2`
or extend v1 package for new ERP work.

### 2. Composer ownership

ERP datatable composition lives in:

```txt
apps/erp/src/components/presentation/
  erp-datatable-composer.client.tsx       # TanStack → DataTableSurface projection

apps/erp/src/lib/presentation/
  *-table-columns.tsx                     # domain ColumnDef factories (per surface wave)

apps/erp/src/components/system-admin/
  system-admin-users-composer.client.tsx  # B-05 pilot reference (B-07 wires routes)
```

**Deferred:** extracting `@afenda/erp-table-*` requires a **new ADR** after B-07 pilot
proof. B-07/B-08 stay in `apps/erp`.

### 3. Presentation boundary (`@afenda/shadcn-studio-v2`)

| V2 may | V2 must not |
| --- | --- |
| Export `DataTableSurface`, table primitives, `Pagination` | Import `@tanstack/react-table` |
| Accept `columns` / `rows` as presentation props | Own domain column defs or API fetch |
| Render loading/empty/error states via `ViewStateProps` | Embed TanStack hooks |

Composer **projects** TanStack table state into `DataTableSurfaceColumn` /
`DataTableSurfaceRow` using `flexRender` for header and cell slots.

### 4. PAS-006D column binding

- TanStack `column.id` **must** align with metadata binding slot keys when a surface is
  metadata-driven (PAS-006D table presentation group).
- Surface template `blockBindings` remain outside the composer; composer consumes
  resolved column defs from ERP/domain layer.
- v1 `data-afenda-slot` markers on monolithic blocks are replaced by v2
  `data-table-surface-*` slots in B-07+; do not duplicate slot markers in composer.

### 5. v1 block → v2 surface mapping (reference)

| v1 block | v1 input | v2 target | ERP owner |
| --- | --- | --- | --- |
| `DatatableUserBlock` | `DatatableUserRow[]` | `ErpDataTableComposer` + `SystemAdminUserTableRow` column defs | `SystemAdminUsersComposer` |
| `DatatableInvoiceBlock` | invoice row shape | same composer + procurement column defs | B-08 |

Pilot reference (B-05): **`SystemAdminUsersComposer`** — fixture-tested; route cutover
in **B-07** (memberships/users wave).

### 6. Testing strategy

| Layer | Proof |
| --- | --- |
| Composer | jsdom unit test — renders `DataTableSurface` with fixture rows |
| v2 boundary | `lane-b-datatable-composer-boundary.test.ts` — no TanStack in v2 `src/` |
| Route migration | B-07 interaction tests (`setupUser`, not `fireEvent`) |

---

## Consequences

**Positive**

- Clear split: TanStack headless in ERP, presentation in v2.
- Reuses v2 proof-route `DataTableSurface` contract.
- Enables incremental v1 block retirement per B-07/B-08.

**Negative**

- Two table patterns coexist until B-07 completes route cutover.
- ERP vitest gains jsdom + React plugin for composer tests.

**Neutral**

- v1 blocks remain for unmigrated routes; composer does not require v1 removal.

---

## Compliance

Executable proof:

- `apps/erp/src/components/presentation/__tests__/erp-datatable-composer.client.test.tsx`
- `packages/shadcn-studio-v2/src/__tests__/lane-b-datatable-composer-boundary.test.ts`
- Lane B-05 slice sign-off

---

## Related ADRs and slices

- [ADR-0042](ADR-0042-workspaceboard-drag-resize-runtime.md) — parallel consumer-runtime
  boundary pattern (drag vs datatable).
- [Lane B-07](../../packages/shadcn-studio-v2/docs/slices/LANE-B-07-ERP-SURFACE-WAVE-SYSTEM-ADMIN.md) —
  authorized to migrate system-admin tables using this composer.
