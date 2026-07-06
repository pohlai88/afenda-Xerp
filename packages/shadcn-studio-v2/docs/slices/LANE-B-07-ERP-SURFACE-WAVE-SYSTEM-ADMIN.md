# Lane B-07 — ERP Surface Wave: System Admin

## Document status

- Status: **Complete**
- Completed: 2026-07-06
- Audience: ERP engineers
- Authority: [ADR-0043](../../../docs/adr/ADR-0043-erp-datatable-headless-composer.md), B-05 composer, Lane B index
- Action enabled: B-08 metadata/procurement surface wave

## Overview

First ERP **surface wave** — memberships and users admin tables, list toolbars, and
related chrome using B-05 TanStack composer and V2 datatable/form primitives.

## Problem

Representative v1 imports:

- `system-admin-memberships-table.tsx` → `DatatableUserBlock`
- `system-admin-list-toolbar.client.tsx` → v1 `Button`, `SearchDialogBlock`
- Protected routes under `system-admin/memberships` and `system-admin/users`

## Goals

- Migrate listed surfaces to v2 imports + ERP composer.
- Preserve PAS-006D metadata binding where slots exist.
- Interaction tests for sort/filter/pagination if present in v1.

## Non-goals

- Procurement or metadata workspace routes.
- Board drag runtime.
- Roles, permissions, settings, audit tables (later waves).

## Constraints

- Use [ADR-0043](../../../docs/adr/ADR-0043-erp-datatable-headless-composer.md) composer — no new ad hoc table pattern.
- Toolbar primitives from v2 public exports.

## Proposed design

### Scope table

| Surface | v1 symbol | v2 target |
| --- | --- | --- |
| Memberships table | `DatatableUserBlock` | `SystemAdminMembershipsComposer` + `ErpDataTableComposer` |
| Users table | `DatatableUserBlock` | `SystemAdminUsersComposer` + `ErpDataTableComposer` |
| List toolbar | `SearchDialogBlock` | v2 `Dialog` + `Command` + `Button` |
| Section header | v1 block alias | local `SystemAdminSectionHeader` |

### Touchpoints (changed)

| Area | Path |
| --- | --- |
| Memberships route | `apps/erp/src/app/(protected)/system-admin/memberships/page.tsx` |
| Users route | `apps/erp/src/app/(protected)/system-admin/users/page.tsx` |
| Composers | `system-admin-*-composer.client.tsx` |
| Toolbar | `system-admin-list-toolbar.client.tsx` |
| Wire mappers | `map-membership-wire-to-table-row.ts`, `map-user-wire-to-datatable-row.ts` |

### Proof

- `system-admin-composer.client.test.tsx`
- `system-admin-list-toolbar.client.interaction.test.tsx` pattern via `setupUser`
- `lane-b-erp-system-admin-cutover.test.ts`
- B-01 import count decreased (baseline ratchet)
- ERP build PASS

## Interfaces / dependencies

- Upstream: B-05, B-06
- Downstream: B-08, B-11 Storybook parity stories (optional)

## Risks and mitigations

- Risk: search dialog behavior regression.
  - Mitigation: interaction test from AGENTS.md patterns (`setupUser`, not `fireEvent`).

## Rollout and rollback

1. Migrated memberships route end-to-end.
2. Migrated users route + shared toolbar.
3. Ratcheted B-01 baseline.

Rollback: revert consumer PR for memberships/users pages and composers.

## Required gates

```bash
pnpm --filter @afenda/erp test:run -- system-admin map-membership map-user erp-datatable-composer
pnpm --filter @afenda/erp build
pnpm --filter @afenda/shadcn-studio-v2 test -- lane-b-erp-system-admin lane-b-v1-import
pnpm --filter @afenda/shadcn-studio-v2 sync:v1-consumer-import-baseline --write
```

## Done definition

- [x] System-admin memberships + users routes v2-only for in-scope files
- [x] Composer used for datatables
- [x] Tests PASS
- [x] Migration map wave-1 row → `pilot-proven`

## Decision

**PROCEED** — wave-1 system-admin memberships/users cutover complete (2026-07-06)
