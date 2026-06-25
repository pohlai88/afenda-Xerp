# ARCH-USER-001 · Slice 8 — Integration AC closure

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-USER-001`](../../%5BComplete%5D%20ARCH-USER-001-user-settings-self-service.md) |
| **Status** | Delivered (2026-06-25) |
| **Prerequisite** | Slice 9 delivered (mutation audit registry stable) · Slices 1–7 ✓ |
| **Slice type** | Implementation |
| **Runtime owner** | `apps/erp/src/__tests__/` · `apps/erp/src/lib/user-settings/` (read-only assertions) |
| **Closes** | AC-U01 · AC-U02 · AC-U03 · AC-U08 · AC-U11 · AC-U12 · AC-U14 · DoD #2–4 · #15 |

---

## Design (internal-guide)

- Mirror `system-admin-acceptance.test.ts` + `operating-context-integration.test.ts` patterns — static source assertions + registry parity, not full E2E.
- Prove four v1 tab routes exist and layout calls `resolveUserSettingsOperatingContext` (AC-U01, U02).
- Prove user-settings actions use `resolveActionOperatingContext` and never `guardSystemAdminSection` (AC-U11).
- Prove mutation actions scope `actorUserId` from operating context only — no tenant_settings imports (AC-U03, U12).
- Prove profile menu href map matches ARCH §5.7 (AC-U08, U14).
- Negative path: unlinked session redirect contract in layout source (AC-U02).

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-USER-001/slice-08-integration-ac-closure.md

1. Objective    — Close open integration AC rows (U01/U02/U03/U08/U11/U12/U14) with acceptance + integration tests; no runtime behavior change unless test reveals defect.
2. Allowed layer— apps/erp/src/__tests__/ · apps/erp/src/lib/user-settings/__tests__/ (new files only)
3. Files        — apps/erp/src/__tests__/user-settings-acceptance.test.ts (New)
                  apps/erp/src/__tests__/user-settings.integration.test.ts (New)
                  docs/ARCH/slices/ARCH-USER-001/slice-08-integration-ac-closure.md (Modified — status)
                  docs/ARCH/[Partially Implemented] ARCH-USER-001-user-settings-self-service.md (Modified — AC index + Slice 8 status)
4. Prohibited   — packages/* · system_admin guard additions · tenant_settings mutations · @afenda/accounting · behavior changes without failing test evidence
5. Authority    — ARCH-USER-001 §7 · §5.10 · §5.11 · operating-context-protected-surface.registry
6. Gates        — pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm check:documentation-drift
```

---

## DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 2 | Acceptance criteria implemented | `pnpm --filter @afenda/erp test:run` |
| 3 | Positive path tested | acceptance test file |
| 4 | Negative path tested | acceptance test file |
| 15 | Security self-scope verified | integration test |

---

## Known debt

- Email change UI remains blocked on ARCH-AUTH-001 (out of slice scope).
