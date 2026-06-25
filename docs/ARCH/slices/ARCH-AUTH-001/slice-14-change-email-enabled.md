# ARCH-AUTH-001 · Slice 14 — `changeEmail` enabled + profile UI wire

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-AUTH-001`](../../%5BPartially%20Implemented%5D%20ARCH-AUTH-001-enterprise-authentication.md) |
| **Slice** | 14 |
| **Status** | Delivered 2026-06-25 |
| **Prerequisite** | Slices 1–12 ✓ · ARCH-USER-001 Complete ✓ |
| **Type** | Implementation |
| **Runtime owner** | `packages/auth/src/` · `apps/erp/src/components/user-settings/` |
| **Closes** | Profile email change UI gap (ARCH-USER-001 §15) · matrix Auth row `changeEmail` note |

---

## Design (internal-guide)

- Enable Better Auth `user.changeEmail.enabled: true` in `auth.config.ts` (verification via existing `emailVerification.sendVerificationEmail`).
- Export contract flag `isAuthChangeEmailEnabled()` from `@afenda/auth` for ERP UI gating.
- Wire `UserProfileEmailPasswordSection` to call `authClient.changeEmail({ newEmail, callbackURL: "/settings/profile" })` when enabled; keep read-only email when disabled.
- On successful change-email **verification completion**, platform `users.email` must stay aligned — use existing mirror/identity pipeline (audit `AUTH_EVENT` if hook exists; do not duplicate Better Auth APIs in ERP).
- Password change UX unchanged (already uses `authClient.changePassword`).
- TIP-004: zero `className` on `@afenda/ui` primitives.

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-AUTH-001/slice-14-change-email-enabled.md

1. Objective    — Enable Better Auth changeEmail, expose enabled contract, wire /settings/profile email change UI with verification flow; add auth + panel tests.
2. Allowed layer— packages/auth/src/ · apps/erp/src/components/user-settings/ · apps/erp/src/lib/user-settings/__tests__/
3. Files        — packages/auth/src/auth.config.ts (Modified)
                  packages/auth/src/auth.env.ts (Modified — export isAuthChangeEmailEnabled if needed)
                  packages/auth/src/auth.contract.ts (Modified — AUTH_EVENT changeEmail if new event)
                  packages/auth/src/index.ts (Modified — export enabled helper)
                  packages/auth/src/__tests__/auth.config.test.ts (New or Modified)
                  apps/erp/src/components/user-settings/user-profile-settings-panel.tsx (Modified)
                  apps/erp/src/lib/user-settings/__tests__/user-profile-settings-panel.test.tsx (New)
                  docs/ARCH/slices/ARCH-AUTH-001/slice-14-change-email-enabled.md (Modified — status)
                  docs/ARCH/slices/ARCH-AUTH-001/slice-index.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified — Auth row changeEmail note)
4. Prohibited   — packages/ui · SSO/passkey/OAuth (AUTH-PHASE3-001) · @afenda/accounting · ARCH [Complete] rename · local permission constants
5. Authority    — ARCH-AUTH-001 · better-auth-erp · ARCH-USER-001 §15 cross-ref · PKG002_AUTH
6. Gates        — pnpm --filter @afenda/auth typecheck
                  pnpm --filter @afenda/auth test:run
                  pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm ui:guard:scan
                  pnpm check:documentation-drift
```

---

## DoD rows this slice closes

| Criterion | Gate |
| --- | --- |
| Profile email change UI (cross-ARCH) | panel test + auth test:run |
| `changeEmail.enabled` runtime | auth.config test |

---

## Known debt

- AUTH-PHASE3-001 (SSO/passkey/OAuth) — unchanged; ARCH stays Partially Implemented
- Slice 13 Phase 3 amendment — draft only until human acceptance
