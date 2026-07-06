# Lane B-07-ext — ERP Surface Wave 2

## Document status

- Status: **Complete**
- Completed: 2026-07-06
- Audience: ERP engineers
- Authority: [ADR-0043](../../../docs/adr/ADR-0043-erp-datatable-headless-composer.md), B-07 wave-1, B-08 metadata bridge
- Action enabled: Lane B v1 import freeze ratchet (parent Wave 2 evidence-sync)

## Overview

Second ERP **surface wave** — remaining v1 `@afenda/shadcn-studio` imports under
`apps/erp/src/**` (17 baseline touchpoints, 2026-07-06). Migrates system-admin
roles/permissions/audit/diagnostics/settings, workspace dashboard, auth chrome,
error surfaces, and accounting-readiness to v2.

## Problem

Baseline v1 imports remain in:

- System-admin routes: roles, permissions, audit, diagnostics, settings
- Legacy table blocks: `DatatableUserBlock`, `DatatableInvoiceBlock`
- Workspace: `WorkspaceDashboardToolbarBlock`, `resolveStudioBlockComponent` (v1)
- Auth: v1 `Button`, `Card`
- Error pages: `ErrorPageShell`, `ERROR_PAGE_COPY_REGISTRY`
- Standards: accounting-readiness v1 `Card`

## Goals

- Zero active `@afenda/shadcn-studio` imports under `apps/erp/src/**`.
- Roles + permissions via `ErpDataTableComposer` (ADR-0043).
- Audit, diagnostics, settings via v2 primitives (Table, Card).
- Workspace widget resolution via ERP v2 preview bridge (`resolve-studio-block-component.client.tsx`).
- Error page contract ERP-local; shell composed from v2 `Button` + layout primitives.
- Boundary test + composer smoke tests.

## Non-goals

- Storybook or developer lab changes.
- Baseline JSON / MIGRATION-MAP / Lane B index edits (parent sync).
- B-09 board drag runtime.
- v1 block slot registry port into v2 package.

## Constraints

- Allowed scope: `apps/erp/**`, slice doc, `lane-b-erp-surface-wave-2-cutover.test.ts`.
- Toolbar: v2 `Button` + controlled `Dialog`/`Command` (B-07 pattern).
- No importing v1 into v2 package.

## Proposed design

### Scope table

| Surface | v1 symbol | v2 target |
| --- | --- | --- |
| Roles table | `DatatableUserBlock` | `SystemAdminRolesComposer` + `ErpDataTableComposer` |
| Permissions table | `DatatableInvoiceBlock` | `SystemAdminPermissionsComposer` + `ErpDataTableComposer` |
| Audit | `SystemAdminAuditEventsTableBlock` | `SystemAdminAuditEventsPanel` (v2 Table) |
| Diagnostics | `SystemAdminDiagnosticsPanelBlock` | `SystemAdminDiagnosticsPanel` (v2 Card) |
| Settings | `SystemAdminSettingsTableBlock` | `SystemAdminSettingsPanel` (v2 Table) |
| Workspace toolbar | `SearchDialogBlock` | v2 `Dialog` + `Command` + `Button` |
| Dashboard grid | v1 `resolveStudioBlockComponent` | ERP `@/lib/metadata/resolve-studio-block-component.client` |
| Error pages | `ErrorPageShell` | `ErpErrorPageShell` + ERP-local contract |
| Auth chrome | v1 `Button`, `Card` | `@afenda/shadcn-studio-v2/clients` |
| Accounting readiness | v1 `Card` | v2 `Card` |

### Touchpoints (17 baseline files)

| File | Migration |
| --- | --- |
| `system-admin/roles/page.tsx` | v2 composer route |
| `system-admin/permissions/page.tsx` | v2 composer route |
| `system-admin/audit/page.tsx` | v2 audit panel |
| `system-admin/diagnostics/page.tsx` | v2 diagnostics panel |
| `system-admin/settings/page.tsx` | v2 settings panel |
| `system-admin-roles-table.tsx` | **Delete** — replaced by composer |
| `system-admin-permissions-table.tsx` | **Delete** — replaced by composer |
| `workspace/page.tsx` | v2 Card + local toolbar |
| `dashboard-layout-renderer.client.tsx` | ERP v2 preview bridge |
| `workspace-dashboard-toolbar.client.tsx` | v2 toolbar pattern |
| `auth-complete-resolver.client.tsx` | v2 Button |
| `auth-workspace-selection.client.tsx` | v2 Button + Card |
| `erp-error-page.client.tsx` | `ErpErrorPageShell` |
| `error-page-surface.registry.ts` | ERP-local contract |
| `get-error-page-variant-for-path.ts` | ERP-local type |
| `standards/accounting-readiness/page.tsx` | v2 Card |
| `auth-wcag-aa.contract.test.tsx` | ERP auth block slot registry |

### New ERP artifacts

| Artifact | Path |
| --- | --- |
| Roles composer | `system-admin-roles-composer.client.tsx` |
| Permissions composer | `system-admin-permissions-composer.client.tsx` |
| Column defs | `system-admin-role-table-columns.tsx`, `system-admin-permission-table-columns.tsx` |
| Row mappers | `map-role-wire-to-table-row.ts`, `map-permission-wire-to-table-row.ts` |
| Audit/diagnostics/settings panels | `system-admin-*-panel.client.tsx` |
| Error contract + shell | `error-page.contract.ts`, `erp-error-page-shell.client.tsx` |
| Auth slot registry | `auth-block-slot.registry.ts` |

### Proof

- `lane-b-erp-surface-wave-2-cutover.test.ts`
- `system-admin-composer.client.test.tsx` (roles + permissions)
- Zero v1 imports grep under `apps/erp/src`
- ERP build PASS

## Required gates

```bash
pnpm --filter @afenda/erp test:run -- system-admin workspace auth error-page erp-error
pnpm --filter @afenda/erp typecheck
pnpm --filter @afenda/erp build
pnpm --filter @afenda/shadcn-studio-v2 test -- lane-b-erp-surface-wave-2 lane-b-erp-system-admin
```

## Done definition

- [x] All 17 baseline files migrated or superseded
- [x] Zero `@afenda/shadcn-studio` imports under `apps/erp/src/**`
- [x] Roles + permissions use `ErpDataTableComposer`
- [x] Boundary test PASS
- [x] Required gates PASS

## Known gaps

- Workspace widget preview uses v2 view stubs (MetricWidget, DataTableSurface) — not full v1 block parity.
- Error page shell simplified (no morphing text / dot grid) until v2 error view promotes.
- Auth WCAG slot registry is ERP-local until v2 metadata slot bridge lands.

## Decision

**PROCEED** — wave-2 ERP v1 cutover complete (2026-07-06)
