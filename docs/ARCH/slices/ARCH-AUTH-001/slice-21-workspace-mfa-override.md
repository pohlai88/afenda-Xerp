# ARCH-AUTH-001 · Slice 21 — FR-A05.3 Workspace MFA override

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-AUTH-001`](../../%5BComplete%5D%20ARCH-AUTH-001-enterprise-authentication.md) |
| **Prerequisite** | Slice 20 ✓ |
| **Slice** | 21 |
| **Status** | Delivered 2026-06-26 |
| **Type** | Implementation |
| **Risk** | High · **Clean Core:** B |
| **Closes** | FR-A05.3 |

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-AUTH-001/slice-21-workspace-mfa-override.md

1. Objective    — Close FR-A05.3: nullable company-level MFA override column; effective MFA policy resolves company override before tenant default when activeWorkspaceId carries companyId.
2. Allowed layer— packages/database/src/schema/ · packages/database/src/company/ · packages/auth/src/
3. Files        —
                  packages/database/src/schema/company.schema.ts
                  packages/database/src/migrations/<generated>_companies_mfa_required_override.sql
                  packages/database/src/migrations/migration-governance.contract.ts
                  packages/database/src/__tests__/company-schema.test.ts
                  packages/database/src/public-api.ts
                  packages/auth/src/auth.mfa-policy.ts
                  packages/auth/src/auth.server.ts
                  packages/auth/src/__tests__/auth.mfa-policy.test.ts
                  packages/auth/src/__tests__/auth.server.test.ts
                  docs/ARCH/slices/ARCH-AUTH-001/slice-21-workspace-mfa-override.md
                  docs/ARCH/slices/ARCH-AUTH-001/slice-index.md
                  docs/ARCH/[Complete] ARCH-AUTH-001-enterprise-authentication.md
                  docs/architecture/afenda-runtime-truth-matrix.md
4. Prohibited   — apps/erp admin UI for override (follow-up); hand-edited migration SQL; packages/ui; @afenda/accounting
5. Authority    — FR-A05.3 · ADR-0011 · PKG003_DATABASE · PKG002_AUTH
6. Gates        —
                  pnpm --filter @afenda/database typecheck
                  pnpm --filter @afenda/database test:run
                  pnpm quality:migrations
                  pnpm --filter @afenda/auth typecheck
                  pnpm --filter @afenda/auth test:run
                  pnpm check:documentation-drift
7. Closes       — FR-A05.3
8. Evidence     — company.schema.ts mfaRequiredOverride · getEffectiveMfaPolicy · assertTenantMfaPolicySatisfied company path
9. Attestation  — Schema · Migration · Security · Test
```
