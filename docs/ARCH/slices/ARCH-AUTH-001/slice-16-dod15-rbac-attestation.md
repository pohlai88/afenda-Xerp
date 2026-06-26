# ARCH-AUTH-001 · Slice 16 — DoD #15 Security/RBAC attestation + invitation.sent audit

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-AUTH-001`](../../%5BPartially%20Implemented%5D%20ARCH-AUTH-001-enterprise-authentication.md) |
| **Prerequisite** | Slice 15 ✓ · Slices 1–14 ✓ · Phase 3 (13a–13d) ✓ |
| **Slice** | 16 |
| **Status** | **Delivered** 2026-06-26 |
| **Type** | Implementation |
| **Risk** | High · **Clean Core:** B |
| **Closes** | DoD #15 · AC-02 · `auth.invitation.sent` audit partial |

---

## Design (internal-guide)

- Add repo governance gate `check:auth-user-id-rbac-boundary` — static scan forbids `authUserId` as `checkPermission` / `requirePermission` actor across consumer packages (`apps/erp`, `packages/appshell`, `packages/permissions` consumer paths).
- Extend existing `auth-session-bridge.integration.test.ts` attestation; wire gate into root `package.json`.
- Add `AUTH_EVENT.invitationSent` (`auth.invitation.sent`) to contract vocabulary; emit via `persistAuthAuditEvent` on `registerAuthInvitation` and `resendAuthInvitationById` when audit context supplied.
- Wire invite server path to pass platform actor context on registration.

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-AUTH-001/slice-16-dod15-rbac-attestation.md

1. Objective    — Close DoD #15 and AC-02: add static RBAC boundary gate proving authUserId never feeds permission checks; complete auth.invitation.sent audit emission on invite register/resend paths.
2. Allowed layer— scripts/governance/ · packages/auth/src/ · apps/erp/src/server/system-admin/ · apps/erp/src/__tests__/
3. Files        —
                  scripts/governance/check-auth-user-id-rbac-boundary.mts
                  scripts/governance/__tests__/check-auth-user-id-rbac-boundary.test.ts
                  package.json
                  packages/auth/src/auth.contract.ts
                  packages/auth/src/auth.invitation.ts
                  packages/auth/src/__tests__/auth.invitation.test.ts
                  packages/auth/src/__tests__/auth.audit.test.ts
                  apps/erp/src/server/system-admin/invite-company-user.server.ts
                  apps/erp/src/server/system-admin/__tests__/invite-company-user.server.test.ts
                  apps/erp/src/__tests__/auth-session-bridge.integration.test.ts
                  docs/ARCH/slices/ARCH-AUTH-001/slice-16-dod15-rbac-attestation.md
                  docs/ARCH/slices/ARCH-AUTH-001/slice-index.md
                  docs/ARCH/[Partially Implemented] ARCH-AUTH-001-enterprise-authentication.md
4. Prohibited   — packages/ui; foundation-disposition.registry.ts; mark ARCH Complete; SSO sign-in polish; IdP rotation UX; hand-edited migration SQL; @afenda/accounting
5. Authority    — ARCH-AUTH-001 §7 AC-02 · §11 DoD #15 · PKG002_AUTH · PKG001_APPSHELL consumer rules · registry prohibited rule do-not-use-authUserId-for-rbac
6. Gates        —
                  pnpm check:auth-user-id-rbac-boundary
                  pnpm --filter @afenda/auth typecheck
                  pnpm --filter @afenda/auth test:run
                  pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm check:documentation-drift
7. Closes       — DoD #15 · AC-02 · auth.invitation.sent audit row (§5.6)
8. Evidence     — check-auth-user-id-rbac-boundary.mts · auth.contract.ts invitationSent · auth.invitation.test.ts audit assertions · invite-company-user.server.ts audit context
9. Attestation  — Security · Test · Contract · Observability
```

---

## DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 15 | Security / RBAC verified | `pnpm check:auth-user-id-rbac-boundary` + `@afenda/auth test:run` |

---

## Known debt

- IdP secret rotation UX — Slice 18 (optional)
- Sign-in OAuth/passkey/SAML polish — Slice 19 (optional)
- FR-A01.4 / FR-A05.3 — future ARCH amendment

---

## Gate log (2026-06-26)

| Gate | Exit | Result |
| --- | ---: | --- |
| `pnpm check:auth-user-id-rbac-boundary` | 0 | Pass — AC-02 static scan |
| `pnpm --filter @afenda/auth test:run` | 0 | 134/134 pass |
| `pnpm --filter @afenda/erp test:run` | 0 | auth-session-bridge + invite audit tests |
| `pnpm check:documentation-drift` | 0 | Pass |
