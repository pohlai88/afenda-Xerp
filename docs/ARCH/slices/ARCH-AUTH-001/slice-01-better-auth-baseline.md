# ARCH-AUTH-001 Slice 1 — Better Auth baseline

**Status:** Delivered (2026-06-25)  
**Evidence:** `packages/auth/src/auth.config.ts` · migration `20260624233736_auth_mfa_two_factor.sql` · 106 PKG tests pass.

```
Handoff from: docs/ARCH/slices/ARCH-AUTH-001/slice-01-better-auth-baseline.md
1. Objective    — Better Auth foundation: plugins, MFA schema, session contract baseline.
2. Allowed layer— packages/auth/src/
3. Files        — packages/auth/src/auth.config.ts · auth.contract.ts · migrations (see parent ARCH Appendix A)
4. Prohibited   — @afenda/accounting; apps/erp UI; SSO/passkey/OAuth
5. Authority    — PKG002_AUTH · better-auth-erp skill
6. Gates        — pnpm --filter @afenda/auth typecheck · test:run
7. Closes       — FR-A01.1 baseline · FR-A03.2
8. Evidence     — auth.config.ts · integration tests
9. Attestation  — Contract · Test
```
