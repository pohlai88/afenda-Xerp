# ARCH-AUTH-001 Slice 11 — Durable member invitations (AUTH-INV-001)

**Status:** Delivered  
**Type:** Implementation  
**Prerequisite:** Slice 4 ✓ · Slice 6 ✓  
**Risk:** High · **Clean Core:** B→B  
**Closes waiver:** AUTH-INV-001

## Design (internal-guide)

- Add `member_invitations` Postgres table in `@afenda/database` (tenant-scoped, token hash, expiry, consumed_at).
- Move invitation CRUD from in-memory `Map` in `auth.invitation.ts` to database service; keep public `@afenda/auth` API stable.
- `registerAuthInvitation` / `validateAuthInvitation` / `consumeAuthInvitation` / list / revoke / resend delegate to DB layer.
- Remove or narrow `AFENDA_AUTH_INVITATION_STORE_DEBT` export after persistence lands.
- Token storage: store hashed token only; compare via constant-time check at validation.
- Tests: unit tests in auth + database; extend `auth.invitation.test.ts` and add schema/service tests.

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-AUTH-001/slice-11-member-invitations-persistence.md

1. Objective    — Close AUTH-INV-001: durable tenant-scoped member_invitations table; migrate auth.invitation from in-memory store to @afenda/database service without breaking invite/resend/revoke/sign-up hook flows.
2. Allowed layer— packages/database/src/ · packages/auth/src/
3. Files        —
                  packages/database/src/schema/member-invitation.schema.ts
                  packages/database/src/membership/member-invitation.service.ts
                  packages/database/src/index.ts
                  packages/database/src/migrations/<generated>_member_invitations.sql
                  packages/database/src/__tests__/member-invitation.service.test.ts
                  packages/auth/src/auth.invitation.ts
                  packages/auth/src/index.ts
                  packages/auth/src/__tests__/auth.invitation.test.ts
                  packages/auth/src/__tests__/auth.hooks.test.ts
                  docs/ARCH/slices/ARCH-AUTH-001/slice-11-member-invitations-persistence.md
                  docs/ARCH/[Partially Implemented] ARCH-AUTH-001-enterprise-authentication.md
4. Prohibited   — apps/erp; packages/appshell; packages/ui; hand-edited migration SQL; @afenda/accounting; SSO/passkey/OAuth; foundation-disposition.registry.ts
5. Authority    — FR-A04 · AUTH-INV-001 · PKG003_DATABASE · PKG002_AUTH · ADR-0014
6. Gates        —
                  pnpm --filter @afenda/database typecheck
                  pnpm --filter @afenda/database test:run
                  pnpm quality:migrations
                  pnpm --filter @afenda/auth typecheck
                  pnpm --filter @afenda/auth test:run
                  pnpm quality:boundaries
                  pnpm check:documentation-drift
7. Closes       — AUTH-INV-001 waiver · FR-A04.1 durability · audit auth.invitation.sent completeness
8. Evidence     — member-invitation.schema.ts · member-invitation.service.ts · auth.invitation.ts tests
9. Attestation  — Schema · Migration · Security · Test · Contract
```

## DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| — | AUTH-INV-001 waiver removal | integration + service tests |
| 4 | Negative path: expired/revoked token | `auth.invitation.test.ts` |

## Known debt

- None when delivered; Slice 10 runs after for waiver table sync.

## Delivery evidence (2026-06-25)

- `member_invitations` Postgres table + Drizzle migration `20260625131740_member_invitations`
- `member-invitation.service.ts` CRUD with SHA-256 token hashing
- `@afenda/auth` invitation API delegates to database service (async)
- `AFENDA_AUTH_INVITATION_STORE_DEBT` export removed
