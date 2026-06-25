# ARCH-AUTH-001 · Slice 13b — Passkey enroll/authenticate UI

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-AUTH-001`](../../%5BPartially%20Implemented%5D%20ARCH-AUTH-001-enterprise-authentication.md) |
| **Amendment** | [`slice-13-phase3-amendment-draft.md`](./slice-13-phase3-amendment-draft.md) — **Accepted 2026-06-25** |
| **Prerequisite** | Slice 13a ✓ · Slices 1–12 + 14 ✓ |
| **Slice** | 13b |
| **Status** | **Delivered** 2026-06-25 — passkey migration, appshell UI props, `/settings/security` panel, integration attestation aligned |
| **Type** | Implementation |
| **Risk** | Medium · **Clean Core:** B |
| **Closes** | FR-A06.3 · partial AUTH-PHASE3-001 (passkey leg) |

---

## Design (internal-guide)

- Add `@better-auth/passkey` dependency; enable `passkey()` server plugin + `passkeyClient()` on `@afenda/auth/client`.
- Add Better Auth `passkey` table to `auth.schema.ts` via **drizzle-kit generate** + governance rule (no hand-edited SQL).
- **Self-service only:** `/settings/security` via `UserSecuritySettingsPanel` + `AppShellAccountSettings06User` — list/add/delete passkeys using `authClient.passkey.*` APIs (session required; `registration.requireSession: true` default).
- **Sign-in passkey:** document as follow-up for sign-in page (Slice 13b scope = enroll UI only; optional conditional UI hook stub in docs if not in scope).
- **Audit:** Register `AUTH_EVENT.passkeyRegistered` · `passkeyDeleted` · `passkeySignInSucceeded` · `passkeySignInFailed` in `auth.contract.ts`; emit via `persistAuthAuditEvent` in hooks where plugin callbacks allow.
- Flip `AFENDA_AUTH_EXTENSION_POINTS.passkey` from `"planned"` → `"active"` when integration test attests.
- TIP-004: zero `className` on `@afenda/ui` in appshell + ERP consumers.
- **Prohibited:** passkey-first onboarding without session (`requireSession: false`); tenant admin passkey policy (defer); sign-in page overhaul unless minimal `autocomplete="webauthn"` note only.

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-AUTH-001/slice-13b-passkey-enroll-ui.md

1. Objective    — Enable Better Auth passkey plugin + client; add passkey table migration; wire user self-service passkey list/register/delete on /settings/security; audit lifecycle via AUTH_EVENT; attestation extension point active.
2. Allowed layer— packages/database/src/schema/ · packages/auth/src/ · packages/appshell/src/shadcn-studio/blocks/ · apps/erp/src/components/user-settings/
3. Files        —
                  packages/auth/package.json (Modified — @better-auth/passkey dependency)
                  packages/database/src/schema/auth.schema.ts (Modified — passkey table)
                  packages/database/src/migrations/meta/_journal.json (Generated)
                  packages/database/src/migrations/<generated>_passkey.sql (Generated — drizzle-kit generate)
                  packages/database/src/migrations/migration-governance.contract.ts (Modified)
                  packages/auth/src/auth.config.ts (Modified — passkey plugin + rpID/rpName/origin from env)
                  packages/auth/src/auth.env.ts (Modified — passkey WebAuthn origin helpers if needed)
                  packages/auth/src/auth.client.ts (Modified — passkeyClient)
                  packages/auth/src/auth.contract.ts (Modified — AUTH_EVENT passkey + extension point)
                  packages/auth/src/auth.hooks.ts (Modified — passkey audit hooks if applicable)
                  packages/auth/src/index.ts (Modified)
                  packages/auth/src/__tests__/auth.config.passkey.test.ts (New)
                  packages/auth/src/__tests__/auth.integration.test.ts (Modified — passkey extension attestation)
                  packages/appshell/src/shadcn-studio/blocks/app-shell-account-settings-06-user.tsx (Modified — passkeys section props)
                  packages/appshell/src/__tests__/app-shell-account-settings-06-user.test.tsx (New or Modified)
                  apps/erp/src/components/user-settings/user-security-settings-panel.tsx (Modified — passkey enroll/list/delete)
                  apps/erp/src/lib/user-settings/__tests__/user-security-settings-panel.test.tsx (Modified — passkey flow tests)
                  docs/ARCH/slices/ARCH-AUTH-001/slice-13b-passkey-enroll-ui.md (Modified — status)
                  docs/ARCH/slices/ARCH-AUTH-001/slice-index.md (Modified)
                  docs/ARCH/[Partially Implemented] ARCH-AUTH-001-enterprise-authentication.md (Modified — FR-A06.3 evidence)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified — Auth passkey note)
4. Prohibited   — packages/ui primitive edits; passkey-first pre-auth registration; @afenda/accounting; hand-edited migration SQL; OAuth (13c); foundation-disposition.registry.ts; sign-in page full redesign
5. Authority    — ARCH-AUTH-001 Phase 3 · FR-A06.3 · PKG002_AUTH · PKG003_DATABASE · better-auth passkey docs · TIP-004 · afenda-drizzle-migration skill
6. Gates        —
                  pnpm --filter @afenda/database typecheck
                  pnpm quality:migrations
                  pnpm --filter @afenda/database test:run
                  pnpm --filter @afenda/auth typecheck
                  pnpm --filter @afenda/auth test:run
                  pnpm --filter @afenda/appshell typecheck
                  pnpm --filter @afenda/appshell test:run
                  pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm ui:guard:scan
                  pnpm check:documentation-drift
7. Closes       — FR-A06.3 · AUTH-PHASE3-001 passkey leg (partial)
8. Evidence     — passkey schema · auth.config passkey plugin · user security panel · extension point active
9. Attestation  — Security · Test · TIP-004 · Documentation
```

---

## DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| FR-A06.3 | Passkey enroll/authenticate user self-service | auth + panel tests |

---

## Known debt

- Sign-in page conditional UI (`signIn.passkey({ autoFill: true })`) — follow-up slice or 13d doc note
- Tenant passkey policy toggle — admin Security tab (future)
- Passkey sign-in on login page — not required for FR-A06.3 enroll self-service
