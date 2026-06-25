# ARCH-ADMIN-001 · Slice 9 — TypeScript action dedup + contract cleanup

| Field | Value |
| --- | --- |
| **ARCH** | ARCH-ADMIN-001 |
| **Slice** | 9 |
| **Status** | Delivered (2026-06-25) |
| **Prerequisite** | Slices 1–8 delivered ✓ |
| **Closes** | Principal TS objectives #1–3 · #5 · #7–9 (system-admin settings mutations) |

## Design

- Extract shared `parseTenantSettingsPayloadFormData` — one FormData→unknown parser for intent+JSON payload tabs.
- Extract `executeTenantSettingsSectionUpdate` — guard, audit, upsert, revalidate spine shared by notifications/workspace/billing/integrations actions.
- Remove unused `@deprecated` `SYSTEM_ADMIN_SETTINGS_SCAFFOLD_FAILURE_MESSAGE` export (zero consumers).
- Preserve public action names, action IDs, and `ServerActionResult` shapes — backward compatible.

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-ADMIN-001/slice-09-typescript-action-dedup.md

1. Objective    — Deduplicate tenant settings section server actions via shared parse/execute helpers; remove dead deprecated copy export; keep mutation audit and guard behavior identical.
2. Allowed layer— apps/erp/src/lib/system-admin/
3. Files        — apps/erp/src/lib/system-admin/parse-tenant-settings-payload-form-data.ts (New)
                  apps/erp/src/lib/system-admin/execute-tenant-settings-section-update.server.ts (New)
                  apps/erp/src/lib/system-admin/update-notifications-settings.action.ts (Modified)
                  apps/erp/src/lib/system-admin/update-workspace-settings.action.ts (Modified)
                  apps/erp/src/lib/system-admin/update-billing-settings.action.ts (Modified)
                  apps/erp/src/lib/system-admin/update-integrations-settings.action.ts (Modified)
                  apps/erp/src/lib/system-admin/system-admin-settings.copy.contract.ts (Modified)
                  apps/erp/src/lib/system-admin/__tests__/tenant-settings-persistence.test.ts (Modified — if needed)
                  docs/ARCH/slices/ARCH-ADMIN-001/slice-09-typescript-action-dedup.md (Modified — status)
                  docs/ARCH/[Partially Implemented] ARCH-ADMIN-001-system-admin-control-plane.md (Modified — Slice 9 row)
4. Prohibited   — packages/ui · packages/database schema/migrations · @afenda/accounting · ARCH [Complete] rename · fake DoD #20 sign-off · user-settings actions
5. Authority    — ARCH-ADMIN-001 §5.2 · afenda-coding-session PATTERNS.md
6. Gates        — pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run system-admin
                  pnpm check:system-admin-mutation-audit
                  pnpm check:documentation-drift
```

## DoD rows this slice advances

| # | Criterion | Gate |
| --- | --- | --- |
| 5 | TypeScript strict passes | `pnpm --filter @afenda/erp typecheck` |
| 3–4 | Positive/negative paths unchanged | `test:run system-admin` |

## Known debt

- DoD #20 Architecture Authority human sign-off (blocks Complete promotion)
- Operator: `pnpm migrate` per environment for `tenant_settings_integrations`
