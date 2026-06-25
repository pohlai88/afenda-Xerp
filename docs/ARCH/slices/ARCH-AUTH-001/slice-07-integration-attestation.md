# ARCH-AUTH-001 Slice 7 — Integration attestation

**Status:** Delivered (2026-06-25) · 106/106 tests pass

```
Handoff from: docs/ARCH/slices/ARCH-AUTH-001/slice-07-integration-attestation.md
1. Objective    — testClient integration: rate limit, lifecycle, MFA, multi-session, invitation.
2. Allowed layer— packages/auth/src/__tests__/ · auth.contract.ts
3. Files        — auth.integration.test.ts · auth.contract.ts
4. Prohibited   — apps/erp; packages/appshell; SSO/passkey/OAuth tests
5. Authority    — AC-01–AC-08
6. Gates        — auth typecheck · auth test:run
7. Closes       — AC-01 · AC-06 · AC-10
8. Evidence     — auth.integration.test.ts
9. Attestation  — Test · Contract · Security
```
