# ARCH-AUTH-001 Slice 3 — Tenant MFA policy + session gate

**Status:** Delivered (2026-06-25)

```
Handoff from: docs/ARCH/slices/ARCH-AUTH-001/slice-03-tenant-mfa-policy.md
1. Objective    — FR-A03: tenants.mfa_required, admin read/write, fail-closed session gate.
2. Allowed layer— packages/database/src/ · packages/auth/src/
3. Files        — tenant.schema.ts · 20260625070000_tenant_mfa_required.sql · auth.mfa-policy.ts · auth.server.ts · __tests__/auth.mfa-policy.test.ts
4. Prohibited   — @afenda/accounting; apps/erp UI; packages/appshell
5. Authority    — FR-A03 · ADR-0014
6. Gates        — database typecheck · quality:migrations · auth typecheck · auth test:run
7. Closes       — FR-A03.1–FR-A03.3 · AC-04 · AC-05
8. Evidence     — auth.mfa-policy.ts · tenant migration
9. Attestation  — Security · Contract · Test
```
