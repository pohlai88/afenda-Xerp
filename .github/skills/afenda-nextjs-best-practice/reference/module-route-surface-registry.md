# Module route and surface registry

**Rule:** A routable ERP module surface must exist in **machine registry** before or with the filesystem page. No orphan folders.

---

## Registry chain

```text
defineErpRuntimeModule (PAS-001C)
  → {module}.pas006-ui.contract.ts (surfaceId, routePattern, pagePath, loaderPath, blockId)
  → apps/erp/src/lib/{module}/load-*-page.server.ts
  → apps/erp/src/app/(protected)/modules/.../page.tsx
  → context-integration-registry / operating-context-protected-surface.registry (spine attestation)
```

---

## `ERP_MODULE_MANIFEST` (`@afenda/entitlements`)

Module hub paths — `/modules/{moduleId}`:

| moduleId | routePath | permissionKey (read) |
| -------- | --------- | -------------------- |
| workspace | `/modules/workspace` | `workspace.dashboard_read` |
| accounting | `/modules/accounting` | `accounting.journal_read` |
| hrm | `/modules/hrm` | `hr.employee_read` |
| inventory | `/modules/inventory` | `inventory.stock_adjust` |
| manufacturing | `/modules/manufacturing` | `inventory.stock_adjust` |
| mrp | `/modules/mrp` | `inventory.stock_adjust` |
| sales | `/modules/sales` | `sales.order_read` |
| ai_copilot | `/modules/ai_copilot` | `ai_copilot.assistant_use` |

**Note:** `procurement` is an ERP-MODULES exemplar (`KV-PROC`) under ADR-0031 — declared in `procurement.pas006-ui.contract.ts`, not yet in `ErpModuleId` union. Do not assume manifest parity until slice promotes it.

API: `getModuleRoute(moduleId)`, `getModuleRouteByPath(path)`, `isModuleRoutePath(path)`.

---

## Procurement PAS-006 UI contract (exemplar)

Source: `packages/features/erp-modules/src/procurement/procurement.pas006-ui.contract.ts`

| surfaceId | routePattern | pagePath | loaderPath | blockId |
| --------- | ------------ | -------- | ---------- | ------- |
| `procurement.requisitions.list` | `/modules/procurement/requisitions` | `app/(protected)/modules/procurement/requisitions/page.tsx` | `lib/procurement/load-procurement-requisitions-page.server.ts` | `datatable-procurement-requisitions` |
| `procurement.purchase_orders.list` | `/modules/procurement/purchase-orders` | `app/(protected)/modules/procurement/purchase-orders/page.tsx` | `lib/procurement/load-procurement-purchase-orders-page.server.ts` | `datatable-procurement-purchase-orders` |

Status: `scaffold_attested` — fixture data, deferred permission enforcement.

---

## Adding a new module surface (checklist)

1. **Authority** — ADR + slice handoff + `defineErpRuntimeModule` (or extend existing module contract).
2. **Contract** — add row to `{module}.pas006-ui.contract.ts` (`surfaceId`, `routePattern`, `loaderPath`, `blockId`).
3. **Ingress** — `apps/erp/src/lib/{module}/load-{surface}-page.server.ts`.
4. **Route** — `page.tsx` under `modules/...` (target: `[moduleSlug]/[surface]/page.tsx`).
5. **UI** — blocks in `modules/.../_components/` from `@afenda/shadcn-studio` (PAS-006 acceptance).
6. **Spine** — register in `context-integration-registry.ts` / protected surface registry if required.
7. **MCP** — `get_routes` includes new path; `get_errors` clean.

Disposition: `do-not-add-module-routes-without-manifest-entry` (foundation registry).

---

## MCP verification

```text
nextjs_call { port: "3000", toolName: "get_routes" }
```

Every UI path under `/modules/**` must trace to a contract row or manifest entry. Mismatches are **drift** — fix registry or remove orphan page.
