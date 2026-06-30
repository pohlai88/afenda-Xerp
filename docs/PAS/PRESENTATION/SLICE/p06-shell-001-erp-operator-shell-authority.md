# P06-SHELL-001 — ERP operator shell authority (post–ADR-0027)

**Status:** Accepted implementation note  
**Lane:** PAS-006 presentation  
**Supersedes:** ADR-0017 rejection of `application-shell` block for retired `@afenda/appshell`

## Authority

After [ADR-0027](../../../adr/ADR-0027-frontend-presentation-reset.md), the ERP operator chrome lives in `@afenda/shadcn-studio` under `src/components/erp-shell/` and is composed by `apps/erp` protected layouts. This is **not** a restoration of `@afenda/appshell` or PAS-005 governed UI.

## Contract

- Serializable nav wires: `ErpNavGroupWire`, `ErpNavItemWire` (`contracts/erp-shell.contract.ts`)
- Operating context wire: `ErpShellOperatingContextWire` (projected from kernel `OperatingContext` in ERP only)
- Theme/layout: AdminCN-aligned `SettingsProvider` + `ThemeCustomizer` (layout, sidebar variant, collapsible, scale, preset, mode, radius)
- MCP blocks in shell: `menu-trigger`, `sidebar-user-dropdown`, `dropdown-notification`

## ERP wiring

| Surface | Module |
| --- | --- |
| Root providers | `apps/erp/src/app/layout.tsx` → `ErpPresentationProviders` |
| Protected shell | `apps/erp/src/app/(protected)/layout.tsx` → `ErpProtectedShell` |
| Nav SSOT | `apps/erp/src/lib/navigation/resolve-erp-nav.server.ts` |

## Gates

```bash
pnpm --filter @afenda/shadcn-studio typecheck
pnpm --filter @afenda/erp typecheck
pnpm check:studio-import-zones
pnpm check:downstream-integration
```
