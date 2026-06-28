# Slice B71 — Permission Scope Permissions Parser Owner (PAS-001A §2.2)

**Status:** Delivered (2026-06-29)

**Objective:** Close the permission-scope ownership split: wire assert/parse in `@afenda/permissions`; kernel retains branded projection only for `OperatingContext.permissionScope`.

**Authority:** PAS-001A §2.2 · §4.2 Runtime ingress rule · `kernel-authority`

---

## Handoff (paste into Phase 0)

| Field | Value |
| --- | --- |
| **Slice** | B71 |
| **PAS** | PAS-001A |
| **Objective** | Attest permission-scope wire triad in `@afenda/permissions`; remove kernel parser; add governance gate |
| **Allowed layer** | `packages/permissions/src/scope/**`, `packages/kernel/src/context/permission-scope-context.projection.ts`, `packages/kernel/src/context/context-registry.ts`, governance script |
| **Prohibited** | New kernel resolver logic; `@afenda/kernel` importing `@afenda/permissions`; ERP-local permission vocabulary |
| **Files (expected)** | See implementation checklist below |
| **Authority** | Platform Authority (PAS-001) · Permissions package owner |
| **Gates** | `pnpm --filter @afenda/permissions test:run` · `pnpm --filter @afenda/kernel test:run` · `pnpm check:permission-scope-permissions-surface` (new) · `pnpm quality:kernel-context-surface` · `pnpm --filter @afenda/erp typecheck` |

---

## Implementation checklist

- [x] `packages/permissions/src/scope/permission-scope-context.assert.ts` — wire shape rejection
- [x] `packages/permissions/src/scope/permission-scope-context.parser.ts` — plain string → resolved scope
- [x] `packages/permissions/src/scope/__tests__/permission-scope-context.test.ts`
- [x] Delete `packages/kernel/src/context/permission-scope-context.parser.ts`
- [x] Add `packages/kernel/src/context/permission-scope-context.projection.ts` — branding only
- [x] `context-registry.ts`: `permission-scope` → `wireIngress: false`; support lists projection module
- [x] `operating-context.parser.ts` uses `brandPermissionScopeContextFromWire`
- [x] `apps/erp/.../resolve-operating-context.server.ts` uses permissions parse + kernel brand
- [x] Add `scripts/governance/check-permission-scope-permissions-surface.mts` + package.json script
- [x] Kernel deprecated aliases documented for one release if needed

## Acceptance

| Check | Required |
| --- | --- |
| No `permission-scope-context.parser.ts` under kernel | Yes |
| Permissions exports assert + parser on package barrel | Yes |
| ERP assembly imports permissions parser, kernel projection | Yes |
| All baseline PAS-001A gates green | Yes |

## Evidence

- Gate output: `check:permission-scope-permissions-surface`
- Test files listed above
