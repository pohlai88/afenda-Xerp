# P06-SHELL-001 — App shell authority (post–ADR-0027)

**Status:** Accepted implementation note  
**Lane:** PAS-006 presentation  
**Supersedes:** ADR-0017 rejection of `application-shell` block for retired `@afenda/appshell`

## Authority

After [ADR-0027](../../../adr/ADR-0027-frontend-presentation-reset.md), the operator app shell lives in `@afenda/shadcn-studio` under `src/components/app-shell/` and is composed by `apps/erp` protected layouts. This is **not** a restoration of the retired `@afenda/appshell` package or PAS-005 governed UI — it is the same **app-shell** concept under PAS-006 presentation.

## Contract

- Serializable nav wires: `AppShellNavGroupWire`, `AppShellNavItemWire` (`contracts/app-shell.contract.ts`)
- Operating context wire: `AppShellOperatingContextWire` (projected from kernel `OperatingContext` in ERP only)
- Theme/layout: AdminCN-aligned `SettingsProvider` + `ThemeCustomizer` (layout, sidebar variant, collapsible, scale, preset, mode, radius)
- MCP blocks in shell: `menu-trigger`, `sidebar-user-dropdown`, `dropdown-notification`

## ERP wiring

| Surface | Module |
| --- | --- |
| Root providers | `apps/erp/src/app/layout.tsx` → `ErpPresentationProviders` |
| Protected app shell | `apps/erp/src/app/(protected)/layout.tsx` → `AppProtectedShell` |
| Nav SSOT | `apps/erp/src/lib/navigation/resolve-app-shell-nav.server.ts` |

## Gates

```bash
pnpm --filter @afenda/shadcn-studio typecheck
pnpm --filter @afenda/erp typecheck
pnpm check:studio-import-zones
pnpm check:downstream-integration
```
