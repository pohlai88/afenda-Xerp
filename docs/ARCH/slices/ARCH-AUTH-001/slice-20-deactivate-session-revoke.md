# ARCH-AUTH-001 · Slice 20 — FR-A01.4 Deactivate user → revoke auth sessions

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-AUTH-001`](../../%5BComplete%5D%20ARCH-AUTH-001-enterprise-authentication.md) |
| **Prerequisite** | Slice 17 ✓ |
| **Slice** | 20 |
| **Status** | Delivered 2026-06-26 |
| **Type** | Implementation |
| **Risk** | High · **Clean Core:** B |
| **Closes** | FR-A01.4 |

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-AUTH-001/slice-20-deactivate-session-revoke.md

1. Objective    — Close FR-A01.4: when a platform user is deactivated, revoke all Better Auth sessions for linked auth_user identities and audit sessionInvalidated.
2. Allowed layer— packages/database/src/auth/ · packages/auth/src/
3. Files        —
                  packages/database/src/auth/auth-identity.service.ts
                  packages/database/src/__tests__/auth-identity.service.test.ts
                  packages/database/src/public-api.ts
                  packages/auth/src/auth.session-revoke.ts
                  packages/auth/src/auth.user-lifecycle.ts
                  packages/auth/src/__tests__/auth.session-revoke.test.ts
                  packages/auth/src/__tests__/auth.user-lifecycle.test.ts
                  packages/auth/src/index.ts
                  docs/ARCH/slices/ARCH-AUTH-001/slice-20-deactivate-session-revoke.md
                  docs/ARCH/slices/ARCH-AUTH-001/slice-index.md
                  docs/ARCH/[Complete] ARCH-AUTH-001-enterprise-authentication.md
                  docs/architecture/afenda-runtime-truth-matrix.md
4. Prohibited   — apps/erp UI; packages/ui; hand-edited migration SQL; @afenda/accounting
5. Authority    — FR-A01.4 · PKG002_AUTH · PKG003_DATABASE · golden rule users.id canonical
6. Gates        —
                  pnpm --filter @afenda/database typecheck
                  pnpm --filter @afenda/database test:run
                  pnpm --filter @afenda/auth typecheck
                  pnpm --filter @afenda/auth test:run
                  pnpm quality:boundaries
                  pnpm check:documentation-drift
7. Closes       — FR-A01.4
8. Evidence     — auth.session-revoke.ts · auth.user-lifecycle.ts · listAuthUserIdsByPlatformUserId
9. Attestation  — Security · Test · Contract
```
