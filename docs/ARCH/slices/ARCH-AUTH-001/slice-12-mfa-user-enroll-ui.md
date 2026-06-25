# ARCH-AUTH-001 Slice 12 — User MFA enroll UI (AUTH-MFA-UI-001)

**Status:** Delivered — 2026-06-25  
**Type:** Implementation  
**Prerequisite:** Slice 5 ✓ · Slice 11 ✓  
**Risk:** Medium · **Clean Core:** B→B  
**Closes waiver:** AUTH-MFA-UI-001

## Design (internal-guide)

- Wire Better Auth TOTP enroll/verify/disable via `@afenda/auth/client` on system-admin Security tab and user `/settings/security` (read ARCH-USER-001 for user slice boundary).
- Extend `app-shell-account-settings-06` or governed user security panel with enroll flow (QR / backup codes per better-auth-erp skill).
- Server remains authority: tenant MFA policy gate unchanged; UI reflects `readAfendaAuthSessionTwoFactorEnabled` + `isAuthUserMfaEnabled`.
- Zero `className` on `@afenda/ui` primitives (TIP-004).

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-AUTH-001/slice-12-mfa-user-enroll-ui.md

1. Objective    — Close AUTH-MFA-UI-001: governed MFA enroll/verify/disable UI on system-admin Security tab using @afenda/auth/client twoFactor APIs; server-side policy unchanged.
2. Allowed layer— packages/appshell/src/shadcn-studio/blocks/ · apps/erp/src/components/system-admin/ · apps/erp/src/lib/system-admin/
3. Files        —
                  packages/appshell/src/shadcn-studio/blocks/app-shell-account-settings-06.tsx
                  packages/appshell/src/shadcn-studio/blocks/app-shell-account-settings-06.stories.tsx
                  packages/appshell/src/__tests__/app-shell-account-settings-06.test.tsx
                  apps/erp/src/components/system-admin/system-admin-security-settings-panel.tsx
                  apps/erp/src/lib/system-admin/resolve-security-settings.server.ts
                  docs/ARCH/slices/ARCH-AUTH-001/slice-12-mfa-user-enroll-ui.md
                  docs/ARCH/[Partially Implemented] ARCH-AUTH-001-enterprise-authentication.md
4. Prohibited   — packages/ui primitive edits; packages/auth schema changes; @afenda/accounting; className on @afenda/ui; SSO/passkey/OAuth
5. Authority    — FR-A03.4 · AUTH-MFA-UI-001 · ADR-0017 · better-auth-erp skill · TIP-004
6. Gates        —
                  pnpm --filter @afenda/appshell check:governance
                  pnpm --filter @afenda/appshell typecheck
                  pnpm --filter @afenda/erp typecheck
                  pnpm ui:guard:scan
                  pnpm ui:guard:proof
                  pnpm check:documentation-drift
7. Closes       — AUTH-MFA-UI-001 waiver · §8 MFA dimension 13→15
8. Evidence     — app-shell-account-settings-06.* · system-admin-security-settings-panel.tsx
9. Attestation  — TIP-004 · Security · Test · UX
```

## DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| — | AUTH-MFA-UI-001 waiver | component + governance tests |

## Gate evidence (2026-06-25)

```text
pnpm --filter @afenda/appshell check:governance           exit 0
pnpm --filter @afenda/appshell typecheck                  exit 0
pnpm --filter @afenda/erp typecheck                       exit 0
pnpm ui:guard:scan                                        exit 0
pnpm ui:guard:proof                                       exit 0
pnpm check:documentation-drift                            exit 0
pnpm --filter @afenda/appshell test:run (account-settings-06) exit 0
pnpm --filter @afenda/erp test:run (security panel)         exit 0
```

**Evidence:** `AppShellAccountSettings06` extended with reauth, TOTP verify, and backup-code enrollment phases; `SystemAdminSecuritySettingsPanel` wires `twoFactor.enable` / `verifyTotp` / `disable` + session refresh via `readAfendaAuthSessionTwoFactorEnabled`. Personal MFA on `/settings/security` remains ARCH-USER-001 (`UserSecuritySettingsPanel`).

## Known debt

- User self-service MFA on `/settings/security` remains ARCH-USER-001 scope — documented split above.
- TOTP setup URI shown as text (no QR library dependency); optional QR enhancement deferred.
