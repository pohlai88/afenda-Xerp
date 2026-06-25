# ARCH-USER-001 · Slice 9 — TypeScript governance + mutation audit registry

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-USER-001`](../../%5BComplete%5D%20ARCH-USER-001-user-settings-self-service.md) |
| **Status** | Delivered |
| **Prerequisite** | Slices 1–7 ✓ |
| **Slice type** | Implementation |
| **Runtime owner** | `apps/erp/src/lib/user-settings/` |
| **Closes** | ARCH §5.11 audit CI · DoD #16 · Enterprise benchmark Contract stability + Observability |

---

## Design (internal-guide)

- Expand `user-settings-audit.registry.ts` to mirror `system-admin-mutation-audit.registry.ts` — governed server-action entries + coverage test path constant.
- Extract shared `parseFormDataJsonField(formData, key)` helper to dedupe JSON.parse in notifications + preferences actions (boundary-safe `unknown` return).
- Tighten `USER_DND_WEEK_DAYS` with `satisfies ReadonlyArray<{ readonly value: string; readonly label: string }>`.
- Add `USER_SETTINGS_MUTATION_AUDIT_COVERAGE_TEST` path + `user-settings-mutation-audit-coverage.test.ts` asserting every mutation action wires `resolveActionOperatingContext` + `recordActionAudit` + registry event id.
- No branded `UserId` migration in this slice — kernel `UserId` already flows via `OperatingContext`; avoid cross-package churn.
- Preserve all public action signatures and ServerActionResult shapes (backward compatible).

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-USER-001/slice-09-typescript-governance.md

1. Objective    — Harden user-settings TypeScript contracts: mutation audit registry parity, deduped form JSON parsing, satisfies tightening, and audit coverage test per ARCH §5.11.
2. Allowed layer— apps/erp/src/lib/user-settings/
3. Files        — apps/erp/src/lib/user-settings/user-settings-audit.registry.ts (Modified)
                  apps/erp/src/lib/user-settings/parse-user-settings-form-payload.ts (New)
                  apps/erp/src/lib/user-settings/__tests__/parse-user-settings-form-payload.test.ts (New)
                  apps/erp/src/lib/user-settings/__tests__/user-settings-mutation-audit-coverage.test.ts (New)
                  apps/erp/src/lib/user-settings/update-user-notifications-settings.action.ts (Modified)
                  apps/erp/src/lib/user-settings/update-user-preferences-settings.action.ts (Modified)
                  apps/erp/src/lib/user-settings/user-settings-blocks.contract.ts (Modified — satisfies only)
                  docs/ARCH/slices/ARCH-USER-001/slice-09-typescript-governance.md (Modified — status)
                  docs/ARCH/[Partially Implemented] ARCH-USER-001-user-settings-self-service.md (Modified — Slice 9 status)
4. Prohibited   — packages/* · branded UserId refactor across kernel · any · @afenda/accounting · breaking ServerActionResult exports
5. Authority    — ARCH-USER-001 §5.11 · afenda-coding-session PATTERNS.md · system-admin-mutation-audit.registry pattern
6. Gates        — pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm exec biome check apps/erp/src/lib/user-settings
                  pnpm check:documentation-drift
```

---

## DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 16 | Observability verified | mutation audit coverage test |
| 17 | Public API compatibility verified | typecheck |

---

## Delivery note

**Status:** Delivered (2026-06-25)  
**Commit:** _pending — ARCH-USER-001 Slice 9 TypeScript governance + mutation audit registry_


- Branded `UserId` at ERP resolver return type deferred to kernel-wide batch (ADR scope).
