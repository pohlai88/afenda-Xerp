# ARCH-AUTH-001 Slice 4 — Invitation-gated sign-up

**Status:** Delivered (2026-06-25)

```
Handoff from: docs/ARCH/slices/ARCH-AUTH-001/slice-04-invitation-gated-signup.md
1. Objective    — FR-A04.2: sign-up requires valid invitation token; accepted/rejected audits.
2. Allowed layer— packages/auth/src/
3. Files        — auth.invitation.ts · auth.hooks.ts · auth.config.ts · __tests__/auth.invitation.test.ts · auth.hooks.test.ts
4. Prohibited   — @afenda/accounting; packages/appshell; durable table (debt AUTH-INV-001 → Slice 11)
5. Authority    — FR-A04 · better-auth-erp skill
6. Gates        — auth typecheck · auth test:run
7. Closes       — FR-A04.2 · AC-06
8. Evidence     — auth.invitation.ts · auth.invitation.test.ts
9. Attestation  — Security · Test · Contract
```
